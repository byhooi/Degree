from __future__ import annotations

import json
import re
import statistics
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEPS = ROOT / ".codex_deps"
if DEPS.exists():
    sys.path.insert(0, str(DEPS))

import openpyxl  # type: ignore
import xlrd  # type: ignore
from pypdf import PdfReader  # type: ignore


TARGET_KEYWORDS = ("布吉街道", "布吉片区")
MAX_ADMISSION_SCORE = 110
TREND_DECAY = 0.8
TREND_MAX_YEARLY_CHANGE = 3
COHORT_DELTA_OUTLIER_THRESHOLD = 10
COHORT_DELTA_WEIGHT_DECAY = 0.75
BACKTEST_LARGE_ERROR_THRESHOLD = 20
TREND_DECAY_SCAN_VALUES = [round(value / 100, 2) for value in range(30, 91, 5)]
TREND_MAX_CHANGE_SCAN_VALUES = list(range(3, 11))

EXCEL_FILES = [
    ("小一", ROOT / "小一17-25.xlsx"),
    ("初一", ROOT / "初一17-25.xlsx"),
]

PDF_FILES = [
    ("小一", ROOT / "2026小一录取规则.pdf"),
    ("初一", ROOT / "2026初一录取规则.pdf"),
]


RULE_SUMMARY = {
    "year": 2026,
    "scope": "深圳市龙岗区布吉街道",
    "common": [
        "公办第一志愿必须选择招生地段内学校；其它公办志愿可在所属街道教育办服务范围内选择。",
        "积分录取按志愿顺序进行，同一志愿同一积分时按户籍、居住或社保等规则排序。",
        "所有加分项累计最高不超过 10 分；居住、社保、学区户籍加分的计算截止日为 2026-04-01。",
        "租赁凭证或人口居住登记时间要求较严格，2026 年申请通常要求备案或登记时间在 2025-08-31 及以前。",
    ],
    "primary": [
        "小一可填报四个志愿；非深户籍适龄儿童须至少填报两所民办学校。",
        "小一招生对象须年满六周岁，即 2020-08-31 及以前出生。",
        "2026 年继续在部分共享学区试行优享学区，第一志愿选择对应优享学校可获得 2.5 分，仅在本共享学区内有效。",
    ],
    "junior": [
        "初一可填报四个志愿；非深户籍适龄少年须至少填报一所民办学校。",
        "初一招生对象为目前就读小学六年级，并在龙岗区居住且符合政策条件。",
    ],
    "score_types": [
        {"type": "第一类", "base": 100, "hukou": "龙岗户籍/学区户籍", "residence": "学区自购商品房或学区祖屋"},
        {"type": "第二类", "base": 95, "hukou": "深圳其他区户籍", "residence": "学区自购商品房"},
        {"type": "第三类", "base": 90, "hukou": "学区户籍", "residence": "特殊住房或符合条件租房/祖辈商品房"},
        {"type": "第四类", "base": 80, "hukou": "非深圳户籍", "residence": "学区自购商品房"},
        {"type": "第五类", "base": 75, "hukou": "龙岗户籍", "residence": "学区租房或特殊住房"},
        {"type": "第六类", "base": 70, "hukou": "深圳其他区户籍", "residence": "学区租房或特殊住房"},
        {"type": "第七类", "base": 60, "hukou": "非深圳户籍", "residence": "学区租房或特殊住房"},
    ],
}


def clean_text(value: object) -> str:
    if value is None:
        return ""
    text = str(value).strip()
    if text.endswith(".0") and text[:-2].isdigit():
        return text[:-2]
    return re.sub(r"\s+", " ", text)


def read_sheet(path: Path) -> list[list[str]]:
    if path.suffix.lower() == ".xls":
        book = xlrd.open_workbook(str(path))
        sheet = book.sheet_by_index(0)
        return [
            [clean_text(sheet.cell_value(row, col)) for col in range(sheet.ncols)]
            for row in range(sheet.nrows)
        ]

    book = openpyxl.load_workbook(path, data_only=True, read_only=True)
    sheet = book.worksheets[0]
    rows: list[list[str]] = []
    for row in sheet.iter_rows(values_only=True):
        rows.append([clean_text(cell) for cell in row])
    return rows


def find_header_row(rows: list[list[str]]) -> int:
    for idx, row in enumerate(rows):
        text = "|".join(row)
        if "学校" in text and re.search(r"20\d{2}年", text):
            return idx
    raise ValueError("未找到表头行")


def normalize_school_name(name: str) -> str:
    normalized = name
    replacements = {
        "（公办班）": "公办班",
        "(公办班)": "公办班",
        "深圳中学龙岗学校（集团）": "",
        "龙城高级中学（教育集团）": "",
        "华中师范大学龙岗附属中学（集团）": "华中师范大学龙岗附属中学",
        "深圳市": "",
        "深圳市龙岗区": "",
        "龙岗区": "",
        "（公办）": "",
        "(公办)": "",
        "（民办）": "",
        "(民办)": "",
        "（小学部）": "",
        "(小学部)": "",
        "（初中部）": "",
        "(初中部)": "",
        "小学部": "",
        "初中部": "",
        "（原坪地二小）": "",
        "(原坪地二小)": "",
    }
    for old, new in replacements.items():
        normalized = normalized.replace(old, new)
    normalized = normalized.replace("（", "(").replace("）", ")")
    normalized = re.sub(r"\(.*?\)", "", normalized)
    normalized = re.sub(r"\s+", "", normalized)
    normalized = re.sub(r"^布吉街道", "", normalized)
    if "承翰学校" in normalized:
        normalized = "承翰学校"
    return normalized


def infer_school_type(raw_type: str, school_name: str) -> str:
    if raw_type in ("公办", "民办"):
        return raw_type
    if "民办" in school_name:
        return "民办"
    if "公办" in school_name:
        return "公办"
    return raw_type or "未知"


def extract_score_value(score_text: str) -> float | None:
    if not score_text:
        return None
    if any(token in score_text for token in ("新开办", "开办", "新增", "无", "未公布", "暂停")):
        return None
    match = re.search(r"\d+(?:\.\d+)?", score_text)
    if not match:
        return None
    return round(float(match.group(0)), 2)


def extract_note(score_text: str) -> str:
    pairs = re.findall(r"[（(]([^（）()]*)[）)]", score_text)
    if pairs:
        return "；".join(part.strip() for part in pairs if part.strip())
    return ""


def cap_admission_score(value: float) -> float:
    return round(min(MAX_ADMISSION_SCORE, max(0, value)), 2)


def clamp_trend_change(value: float) -> float:
    return max(-TREND_MAX_YEARLY_CHANGE, min(TREND_MAX_YEARLY_CHANGE, value))


def parse_year_from_header(header: str) -> int | None:
    match = re.search(r"(20\d{2})年", header)
    if not match:
        return None
    return int(match.group(1))


def parse_records(stage: str, path: Path) -> list[dict]:
    rows = read_sheet(path)
    header_index = find_header_row(rows)
    headers = rows[header_index]

    region_col = next((i for i, h in enumerate(headers) if "街道" in h or "片区" in h), None)
    has_region_col = region_col is not None
    type_col = next((i for i, h in enumerate(headers) if "办学性质" in h), None)
    school_col = next((i for i, h in enumerate(headers) if h in ("学校", "学校名称") or "学校名称" in h), None)
    if school_col is None:
        raise ValueError(f"{path.name} 未找到学校列")

    score_cols: list[tuple[int, int, str]] = []
    for col, header in enumerate(headers):
        year = parse_year_from_header(header)
        if year is None:
            continue
        admission_type = "民办直升" if "直升" in header else "录取分数线"
        score_cols.append((col, year, admission_type))

    records: list[dict] = []
    current_region = ""
    current_type = ""
    for row_index, row in enumerate(rows[header_index + 1 :], start=header_index + 2):
        row = row + [""] * max(0, len(headers) - len(row))
        if has_region_col and region_col is not None:
            region = row[region_col] if region_col < len(row) else ""
            if region:
                current_region = region
        else:
            current_region = "布吉街道"

        if type_col is not None and type_col < len(row) and row[type_col]:
            current_type = row[type_col]

        school_name = row[school_col] if school_col < len(row) else ""
        if not school_name or not current_region:
            continue
        if not any(keyword in current_region for keyword in TARGET_KEYWORDS):
            continue

        school_type = infer_school_type(current_type, school_name)
        school_key = normalize_school_name(school_name)
        for col, year, admission_type in score_cols:
            score_text = row[col] if col < len(row) else ""
            if not score_text:
                continue
            effective_admission_type = admission_type
            if stage == "初一" and "直升" in score_text:
                effective_admission_type = "民办直升"
            value = extract_score_value(score_text)
            records.append(
                {
                    "id": f"{stage}-{year}-{school_key}-{effective_admission_type}-{path.name}",
                    "stage": stage,
                    "year": year,
                    "region": current_region,
                    "region_group": "布吉",
                    "school_type": school_type,
                    "school_name": school_name,
                    "school_key": school_key,
                    "admission_type": effective_admission_type,
                    "score_text": score_text,
                    "score_value": value,
                    "note": extract_note(score_text),
                    "source": path.name,
                    "source_row": row_index,
                }
            )
    return records


def deduplicate_records(records: list[dict]) -> list[dict]:
    # 同一年数据会在滚动三年表里重复出现，优先保留较新的来源文件。
    priority = {
        "小一17-25.xlsx": 10,
        "初一17-25.xlsx": 10,
        "小一19-25.xlsx": 10,
        "初一19-25.xlsx": 10,
        "小一22-24.xls": 3,
        "小一21-23.xls": 2,
        "小一19-21.xls": 1,
        "初一22-24.xlsx": 3,
        "初一20-22.xls": 2,
        "初一19-21.xls": 1,
    }
    deduped: dict[tuple, dict] = {}
    for record in records:
        key = (
            record["stage"],
            record["year"],
            record["school_key"],
            record["admission_type"],
        )
        old = deduped.get(key)
        if old is None or priority.get(record["source"], 0) >= priority.get(old["source"], 0):
            deduped[key] = record
    return sorted(
        deduped.values(),
        key=lambda item: (
            item["stage"],
            item["school_type"],
            item["school_key"],
            item["admission_type"],
            item["year"],
        ),
    )


def backfill_school_types(records: list[dict]) -> list[dict]:
    known: dict[tuple[str, str], dict[str, int]] = defaultdict(lambda: defaultdict(int))
    for record in records:
        if record["school_type"] != "未知":
            known[(record["stage"], record["school_key"])][record["school_type"]] += 1

    for record in records:
        if record["school_type"] != "未知":
            continue
        candidates = known.get((record["stage"], record["school_key"]))
        if candidates:
            record["school_type"] = max(candidates.items(), key=lambda item: item[1])[0]
    return records


def build_school_stats(records: list[dict]) -> list[dict]:
    grouped: dict[tuple[str, str, str], list[dict]] = defaultdict(list)
    for record in records:
        if record["admission_type"] != "录取分数线":
            continue
        grouped[(record["stage"], record["school_key"], record["school_type"])].append(record)

    stats: list[dict] = []
    for (stage, school_key, school_type), items in grouped.items():
        items = sorted(items, key=lambda item: item["year"])
        numeric_items = [item for item in items if item["score_value"] is not None]
        values = [item["score_value"] for item in numeric_items]
        latest = numeric_items[-1] if numeric_items else items[-1]
        first = numeric_items[0] if numeric_items else items[0]
        trend = None
        if latest.get("score_value") is not None and first.get("score_value") is not None:
            trend = round(latest["score_value"] - first["score_value"], 2)
        stats.append(
            {
                "stage": stage,
                "school_key": school_key,
                "school_name": latest["school_name"],
                "school_names": sorted({item["school_name"] for item in items}),
                "school_type": school_type,
                "years": [item["year"] for item in items],
                "latest_year": latest["year"],
                "latest_score": latest.get("score_value"),
                "latest_score_text": latest["score_text"],
                "latest_note": latest.get("note", ""),
                "min_score": round(min(values), 2) if values else None,
                "max_score": round(max(values), 2) if values else None,
                "avg_score": round(statistics.mean(values), 2) if values else None,
                "trend": trend,
                "volatility": round(statistics.pstdev(values), 2) if len(values) > 1 else 0,
                "record_count": len(items),
            }
        )
    return sorted(
        stats,
        key=lambda item: (
            item["stage"],
            item["school_type"],
            -(item["latest_score"] or 0),
            item["school_name"],
        ),
    )


def cohort_pair_usable(pair: dict) -> bool:
    return abs(pair["cohort_delta"]) <= COHORT_DELTA_OUTLIER_THRESHOLD


def weighted_cohort_delta(pairs: list[dict]) -> float | None:
    usable = [pair for pair in pairs if cohort_pair_usable(pair)]
    if not usable:
        return None

    latest_year = max(pair["junior_year"] for pair in usable)
    weighted = 0.0
    total_weight = 0.0
    for pair in usable:
        distance = latest_year - pair["junior_year"]
        weight = COHORT_DELTA_WEIGHT_DECAY ** distance
        weighted += pair["cohort_delta"] * weight
        total_weight += weight
    return round(weighted / total_weight, 2) if total_weight else None


def build_cohort_school_summaries(pairs: list[dict]) -> dict[str, dict]:
    grouped: dict[str, list[dict]] = defaultdict(list)
    for pair in pairs:
        grouped[f"{pair['school_key']}|{pair['school_type']}"].append(pair)

    summaries: dict[str, dict] = {}
    for key, items in grouped.items():
        items = sorted(items, key=lambda item: item["junior_year"])
        usable = [item for item in items if cohort_pair_usable(item)]
        deltas = [item["cohort_delta"] for item in items]
        usable_deltas = [item["cohort_delta"] for item in usable]
        latest = items[-1]
        summaries[key] = {
            "school_key": latest["school_key"],
            "school_type": latest["school_type"],
            "pair_count": len(items),
            "usable_pair_count": len(usable),
            "outlier_pair_count": len(items) - len(usable),
            "years": [item["junior_year"] for item in items],
            "latest_junior_year": latest["junior_year"],
            "latest_junior_score": latest["junior_score"],
            "latest_primary_year": latest["primary_year"],
            "latest_primary_score": latest["primary_score"],
            "latest_delta": latest["cohort_delta"],
            "weighted_delta": weighted_cohort_delta(items),
            "mean_delta": round(statistics.mean(usable_deltas), 2) if usable_deltas else None,
            "median_delta": round(statistics.median(usable_deltas), 2) if usable_deltas else None,
            "delta_stdev": round(statistics.pstdev(usable_deltas), 2) if len(usable_deltas) > 1 else 0,
            "min_delta": round(min(deltas), 2) if deltas else None,
            "max_delta": round(max(deltas), 2) if deltas else None,
            "outlier_years": [item["junior_year"] for item in items if not cohort_pair_usable(item)],
        }
    return dict(sorted(summaries.items()))


def collect_direct_cohort_backtest_errors(pairs: list[dict]) -> list[dict]:
    grouped: dict[str, list[dict]] = defaultdict(list)
    for pair in pairs:
        grouped[f"{pair['school_key']}|{pair['school_type']}"].append(pair)

    errors: list[dict] = []
    for items in grouped.values():
        items = sorted(items, key=lambda item: item["junior_year"])
        for index in range(1, len(items)):
            actual = items[index]
            prior = items[:index]
            delta = weighted_cohort_delta(prior)
            if delta is None:
                continue
            predicted = cap_admission_score(actual["primary_score"] + delta)
            errors.append(
                {
                    "school_key": actual["school_key"],
                    "school_type": actual["school_type"],
                    "school_name": actual["junior_school"],
                    "junior_year": actual["junior_year"],
                    "primary_year": actual["primary_year"],
                    "primary_score": actual["primary_score"],
                    "actual_score": actual["junior_score"],
                    "predicted_score": predicted,
                    "abs_error": round(abs(predicted - actual["junior_score"]), 2),
                    "weighted_delta": delta,
                    "used_pair_count": len([item for item in prior if cohort_pair_usable(item)]),
                    "history_years": [item["junior_year"] for item in prior],
                    "history_deltas": [item["cohort_delta"] for item in prior],
                }
            )
    return errors


def build_cohort_model(records: list[dict]) -> dict:
    lag_years = 6
    by_key: dict[tuple[str, str, int, str], dict] = {}
    for record in records:
        if record["admission_type"] != "录取分数线":
            continue
        if record["score_value"] is None:
            continue
        by_key[(record["stage"], record["school_key"], record["year"], record["school_type"])] = record

    primary_keys = {(record["school_key"], record["school_type"]) for record in records if record["stage"] == "小一"}
    junior_keys = {(record["school_key"], record["school_type"]) for record in records if record["stage"] == "初一"}
    common_keys = sorted(primary_keys & junior_keys)

    pairs: list[dict] = []
    for school_key, school_type in common_keys:
        junior_years = sorted({
            record["year"]
            for record in records
            if record["stage"] == "初一"
            and record["school_key"] == school_key
            and record["school_type"] == school_type
            and record["admission_type"] == "录取分数线"
        })
        for junior_year in junior_years:
            primary_year = junior_year - lag_years
            primary = by_key.get(("小一", school_key, primary_year, school_type))
            junior = by_key.get(("初一", school_key, junior_year, school_type))
            if not primary or not junior:
                continue

            next_primary_year = primary_year + 1
            next_primary = by_key.get(("小一", school_key, next_primary_year, school_type))
            delta = round(junior["score_value"] - primary["score_value"], 2)
            projected_next = None
            projected_change = None
            if next_primary:
                projected_next = cap_admission_score(next_primary["score_value"] + delta)
                projected_change = round(projected_next - junior["score_value"], 2)

            pairs.append(
                {
                    "school_key": school_key,
                    "school_type": school_type,
                    "primary_school": primary["school_name"],
                    "junior_school": junior["school_name"],
                    "primary_year": primary_year,
                    "primary_score": primary["score_value"],
                    "junior_year": junior_year,
                    "junior_score": junior["score_value"],
                    "cohort_delta": delta,
                    "next_primary_year": next_primary_year if next_primary else None,
                    "next_primary_score": next_primary["score_value"] if next_primary else None,
                    "projected_next_junior_year": junior_year + 1 if next_primary else None,
                    "projected_next_junior_score": projected_next,
                    "projected_change": projected_change,
                    "confidence": "同校同办学性质样本" if projected_next is not None else "仅有本届差值",
                }
            )

    school_summaries = build_cohort_school_summaries(pairs)
    direct_backtest_errors = collect_direct_cohort_backtest_errors(pairs)
    backtest_by_type: dict[str, list[dict]] = defaultdict(list)
    for item in direct_backtest_errors:
        backtest_by_type[item["school_type"]].append(item)

    numeric_changes = [item["projected_change"] for item in pairs if item["projected_change"] is not None]
    deltas = [item["cohort_delta"] for item in pairs]
    outliers = [
        item
        for item in pairs
        if abs(item["cohort_delta"]) > COHORT_DELTA_OUTLIER_THRESHOLD
    ]
    pair_counts: dict[str, int] = defaultdict(int)
    for item in pairs:
        pair_counts[f"{item['school_key']}|{item['school_type']}"] += 1

    return {
        "method": "同校同办学性质小一录取线滞后 6 年映射到初一录取线；下一届预测使用下一年小一录取线叠加已观测 cohort 差值。",
        "lag_years": lag_years,
        "delta_outlier_threshold": COHORT_DELTA_OUTLIER_THRESHOLD,
        "delta_weight_decay": COHORT_DELTA_WEIGHT_DECAY,
        "common_school_count": len(common_keys),
        "pair_count": len(pairs),
        "school_pair_counts": dict(sorted(pair_counts.items())),
        "school_summaries": school_summaries,
        "delta_stats": {
            "count": len(deltas),
            "mean": round(statistics.mean(deltas), 2) if deltas else None,
            "median": round(statistics.median(deltas), 2) if deltas else None,
            "stdev": round(statistics.pstdev(deltas), 2) if len(deltas) > 1 else 0,
            "min": round(min(deltas), 2) if deltas else None,
            "max": round(max(deltas), 2) if deltas else None,
            "outlier_count": len(outliers),
            "outlier_schools": [
                {
                    "school_key": item["school_key"],
                    "school_type": item["school_type"],
                    "cohort_delta": item["cohort_delta"],
                }
                for item in outliers
            ],
        },
        "average_projected_change": round(statistics.mean(numeric_changes), 2) if numeric_changes else None,
        "direct_backtest": {
            "method": "direct cohort 逐年留一回测；使用目标年前已观测同校同办学性质 delta 的时间加权均值预测目标年初一线。",
            "overall": summarize_error_items(direct_backtest_errors),
            "by_school_type": {
                school_type: summarize_error_items(items)
                for school_type, items in sorted(backtest_by_type.items())
            },
            "errors": direct_backtest_errors,
        },
        "pairs": pairs,
    }


def robust_trend_change(
    items: list[dict],
    decay: float = TREND_DECAY,
    max_yearly_change: float = TREND_MAX_YEARLY_CHANGE,
) -> float | None:
    if len(items) < 2:
        return None

    recent = items[-4:]
    changes = [
        max(-max_yearly_change, min(max_yearly_change, recent[index]["score_value"] - recent[index - 1]["score_value"]))
        for index in range(1, len(recent))
    ]
    if not changes:
        return None

    weighted = 0.0
    total_weight = 0.0
    for index, change in enumerate(changes):
        distance_from_latest = len(changes) - 1 - index
        weight = decay ** distance_from_latest
        weighted += change * weight
        total_weight += weight
    return weighted / total_weight if total_weight else None


def summarize_errors(errors: list[float]) -> dict:
    if not errors:
        return {"sample_count": 0, "mae": None, "max_abs_error": None}
    return {
        "sample_count": len(errors),
        "mae": round(statistics.mean(errors), 2),
        "max_abs_error": round(max(errors), 2),
    }


def collect_trend_backtest_errors(
    records: list[dict],
    decay: float = TREND_DECAY,
    max_yearly_change: float = TREND_MAX_YEARLY_CHANGE,
) -> list[dict]:
    grouped: dict[tuple[str, str, str], list[dict]] = defaultdict(list)
    for record in records:
        if record["admission_type"] != "录取分数线":
            continue
        if record["score_value"] is None:
            continue
        grouped[(record["stage"], record["school_key"], record["school_type"])].append(record)

    errors: list[dict] = []
    for items in grouped.values():
        items = sorted(items, key=lambda item: item["year"])
        for index in range(2, len(items)):
            actual = items[index]
            prior = items[:index]
            latest = prior[-1]
            if actual["year"] != latest["year"] + 1:
                continue
            change = robust_trend_change(prior, decay, max_yearly_change)
            if change is None:
                continue
            predicted = cap_admission_score(latest["score_value"] + change)
            errors.append(
                {
                    "stage": actual["stage"],
                    "school_key": actual["school_key"],
                    "school_name": actual["school_name"],
                    "school_type": actual["school_type"],
                    "year": actual["year"],
                    "actual_score": actual["score_value"],
                    "predicted_score": predicted,
                    "abs_error": round(abs(predicted - actual["score_value"]), 2),
                    "latest_year": latest["year"],
                    "latest_score": latest["score_value"],
                    "weighted_change": round(change, 2),
                    "history_years": [item["year"] for item in prior[-4:]],
                    "history_scores": [item["score_value"] for item in prior[-4:]],
                }
            )
    return errors


def summarize_error_items(items: list[dict]) -> dict:
    return summarize_errors([item["abs_error"] for item in items])


def build_trend_parameter_scan(records: list[dict]) -> dict:
    results: list[dict] = []
    for decay in TREND_DECAY_SCAN_VALUES:
        for max_change in TREND_MAX_CHANGE_SCAN_VALUES:
            errors = collect_trend_backtest_errors(records, decay, max_change)
            stage_errors: dict[str, list[dict]] = defaultdict(list)
            type_errors: dict[str, list[dict]] = defaultdict(list)
            for item in errors:
                stage_errors[item["stage"]].append(item)
                type_errors[item["school_type"]].append(item)
            results.append(
                {
                    "decay": decay,
                    "max_yearly_change": max_change,
                    "overall": summarize_error_items(errors),
                    "by_stage": {
                        stage: summarize_error_items(group)
                        for stage, group in sorted(stage_errors.items())
                    },
                    "by_school_type": {
                        school_type: summarize_error_items(group)
                        for school_type, group in sorted(type_errors.items())
                    },
                }
            )

    best = min(
        (item for item in results if item["overall"]["mae"] is not None),
        key=lambda item: (item["overall"]["mae"], item["overall"]["max_abs_error"]),
        default=None,
    )
    top_results = sorted(
        [item for item in results if item["overall"]["mae"] is not None],
        key=lambda item: (item["overall"]["mae"], item["overall"]["max_abs_error"]),
    )[:10]
    return {
        "method": "趋势模型参数网格扫描",
        "decay_values": TREND_DECAY_SCAN_VALUES,
        "max_yearly_change_values": TREND_MAX_CHANGE_SCAN_VALUES,
        "current": {
            "decay": TREND_DECAY,
            "max_yearly_change": TREND_MAX_YEARLY_CHANGE,
        },
        "best": best,
        "top_results": top_results,
    }


def build_backtest(records: list[dict]) -> dict:
    errors = collect_trend_backtest_errors(records)
    stage_errors: dict[str, list[dict]] = defaultdict(list)
    for item in errors:
        stage_errors[item["stage"]].append(item)

    large_errors = sorted(
        [item for item in errors if item["abs_error"] >= BACKTEST_LARGE_ERROR_THRESHOLD],
        key=lambda item: item["abs_error"],
        reverse=True,
    )

    return {
        "method": "近年趋势留一回测",
        "description": f"每个学校组合使用目标年前历史录取线预测下一年，年变化按 EWMA 加权并以 ±{TREND_MAX_YEARLY_CHANGE} 分截尾。",
        "large_error_threshold": BACKTEST_LARGE_ERROR_THRESHOLD,
        "overall": summarize_error_items(errors),
        "by_stage": {stage: summarize_error_items(items) for stage, items in sorted(stage_errors.items())},
        "large_errors": large_errors,
        "parameter_scan": build_trend_parameter_scan(records),
    }


def pdf_text(path: Path) -> list[dict]:
    reader = PdfReader(str(path))
    pages: list[dict] = []
    for index, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        text = re.sub(r"[ \t]+", " ", text)
        text = re.sub(r"\n{2,}", "\n", text)
        pages.append({"page": index, "text": text.strip()})
    return pages


def extract_buji_rule_sections() -> dict[str, list[dict]]:
    sections: dict[str, list[dict]] = {}
    for stage, path in PDF_FILES:
        pages = pdf_text(path)
        hits: list[dict] = []
        for page in pages:
            text = page["text"]
            if "布吉街道教育办服务范围" not in text and "布吉" not in text:
                continue
            compact = re.sub(r"\s+", " ", text)
            snippets = []
            for marker in ("布吉街道教育办服务范围", "布吉"):
                pos = compact.find(marker)
                if pos >= 0:
                    start = max(0, pos - 120)
                    end = min(len(compact), pos + 2200)
                    snippets.append(compact[start:end])
            if snippets:
                hits.append({"page": page["page"], "text": snippets[0]})
        sections[stage] = hits
    return sections


def build_data() -> dict:
    raw_records: list[dict] = []
    for stage, path in EXCEL_FILES:
        raw_records.extend(parse_records(stage, path))
    records = backfill_school_types(deduplicate_records(raw_records))
    stats = build_school_stats(records)

    years = sorted({record["year"] for record in records})
    stages = sorted({record["stage"] for record in records})
    school_types = sorted({record["school_type"] for record in records})

    return {
        "meta": {
            "title": "布吉街道义务教育录取分析",
            "scope": "布吉街道/布吉片区",
            "generated_at": datetime.now().isoformat(timespec="seconds"),
            "source_files": [path.name for _, path in EXCEL_FILES + PDF_FILES],
            "record_count": len(records),
            "school_count": len({(item["stage"], item["school_key"]) for item in records}),
            "years": years,
            "stages": stages,
            "school_types": school_types,
        },
        "rules": RULE_SUMMARY,
        "rule_sections": extract_buji_rule_sections(),
        "cohort_model": build_cohort_model(records),
        "backtest": build_backtest(records),
        "records": records,
        "schools": stats,
    }


def main() -> None:
    data = build_data()
    data_dir = ROOT / "data"
    data_dir.mkdir(exist_ok=True)

    json_path = data_dir / "admission-data.json"
    js_path = data_dir / "admission-data.js"
    json_payload = json.dumps(data, ensure_ascii=False, indent=2)
    json_path.write_text(json_payload + "\n", encoding="utf-8")
    js_path.write_text("window.ADMISSION_DATA = " + json_payload + ";\n", encoding="utf-8")

    print(f"生成记录：{data['meta']['record_count']} 条")
    print(f"学校数量：{data['meta']['school_count']} 所")
    print(f"年份范围：{data['meta']['years'][0]}-{data['meta']['years'][-1]}")
    print(f"输出文件：{json_path.relative_to(ROOT)} / {js_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
