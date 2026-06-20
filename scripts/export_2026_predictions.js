/**
 * 导出目标年份所有学校录取分数预测
 *
 * 复制 index.html 中内嵌 JS 的预测逻辑，对每条学校记录生成目标年份预测，
 * 输出到 data/predictions-<year>.json，供实际录取分数出炉后对比。
 *
 * 用法: node scripts/export_2026_predictions.js --year 2026
 */

const fs = require("fs");
const path = require("path");

const DEFAULT_TARGET_YEAR = 2026;

function parseTargetYear(args) {
  let candidate = null;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const inline = arg.match(/^--year=(\d{4})$/);
    if (inline) {
      candidate = inline[1];
      break;
    }
    if (arg === "--year" || arg === "-y") {
      candidate = args[index + 1];
      break;
    }
    if (/^\d{4}$/.test(arg)) {
      candidate = arg;
      break;
    }
  }
  const year = Number(candidate || DEFAULT_TARGET_YEAR);
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    console.error(
      `年份参数无效: ${candidate}. 用法: node scripts/export_2026_predictions.js --year 2026`
    );
    process.exit(1);
  }
  return year;
}

const TARGET_YEAR = parseTargetYear(process.argv.slice(2));

const data = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "..", "data", "admission-data.json"),
    "utf-8"
  )
);

// ============================================================
// 常量（与 index.html 保持一致）
// ============================================================
const MAX_ADMISSION_SCORE = 110;
const FORECAST_YEAR_COUNT = 3;
const TREND_DECAY = 0.8;
const TREND_MAX_YEARLY_CHANGE = 3;
const COHORT_DELTA_OUTLIER_THRESHOLD =
  data.cohort_model?.delta_outlier_threshold || 10;

// ============================================================
// 工具函数（与 index.html 保持一致）
// ============================================================
function capScore(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  return (
    Math.round(Math.min(MAX_ADMISSION_SCORE, Math.max(0, Number(value))) * 100) /
    100
  );
}

function roundDelta(value) {
  return Math.round(value * 100) / 100;
}

function formatScore(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  return Number(value).toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

function formatDelta(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  if (Math.abs(value) < 0.005) return "持平";
  return `${value > 0 ? "+" : ""}${formatScore(value)}`;
}

function modelDirection(change) {
  if (
    change === null ||
    change === undefined ||
    Number.isNaN(change) ||
    Math.abs(change) < 0.005
  )
    return "flat";
  return change > 0 ? "up" : "down";
}

function forecastDirection(change) {
  const direction = modelDirection(change);
  if (direction === "flat") return "预计持平";
  return direction === "up" ? "预计上升" : "预计下降";
}

function clampTrendChange(value) {
  return Math.max(
    -TREND_MAX_YEARLY_CHANGE,
    Math.min(TREND_MAX_YEARLY_CHANGE, value)
  );
}

function weightedRecentChange(changes) {
  if (!changes.length) return null;
  let weighted = 0;
  let totalWeight = 0;
  changes.forEach((change, index) => {
    const distanceFromLatest = changes.length - 1 - index;
    const weight = Math.pow(TREND_DECAY, distanceFromLatest);
    weighted += clampTrendChange(change) * weight;
    totalWeight += weight;
  });
  return totalWeight ? weighted / totalWeight : null;
}

function average(values) {
  const nums = values.filter(
    (value) => value !== null && value !== undefined && !Number.isNaN(value)
  );
  if (!nums.length) return null;
  return nums.reduce((sum, value) => sum + value, 0) / nums.length;
}

// ============================================================
// 数据查询函数（与 index.html 保持一致）
// ============================================================
function recordsForSchool(stage, schoolKey, schoolType, admissionType = "录取分数线") {
  return data.records
    .filter(
      (record) =>
        record.stage === stage &&
        record.school_key === schoolKey &&
        record.school_type === schoolType &&
        record.admission_type === admissionType
    )
    .sort((a, b) => a.year - b.year);
}

function latestRecordForSchool(stage, schoolKey, schoolType, admissionType) {
  const records = recordsForSchool(stage, schoolKey, schoolType, admissionType)
    .filter((record) => record.score_value !== null)
    .slice();
  return records.pop() || null;
}

// ============================================================
// Cohort 模型函数（与 index.html 保持一致）
// ============================================================
function latestCohortPair(schoolKey, schoolType) {
  if (!data.cohort_model) return null;
  const pairs = data.cohort_model.pairs
    .filter(
      (item) =>
        item.school_key === schoolKey && item.school_type === schoolType
    )
    .sort((a, b) => a.junior_year - b.junior_year);
  return pairs[pairs.length - 1] || null;
}

function cohortSummary(schoolKey, schoolType) {
  return (
    data.cohort_model?.school_summaries?.[`${schoolKey}|${schoolType}`] || null
  );
}

function cohortPairOutlier(pair) {
  return pair && Math.abs(pair.cohort_delta) > COHORT_DELTA_OUTLIER_THRESHOLD;
}

// ============================================================
// 预测模型函数（与 index.html 保持一致）
// ============================================================
function forecastItemsFromScores(latestScore, futureScores) {
  const forecasts = [];
  let previousScore = latestScore;
  futureScores.forEach((item) => {
    const score = capScore(item.score);
    if (score === null) return;
    forecasts.push({
      year: item.year,
      score,
      change: roundDelta(score - previousScore),
      cumulativeChange: roundDelta(score - latestScore),
      source: item.source || "",
    });
    previousScore = score;
  });
  return forecasts;
}

function forecastResult(payload) {
  const forecasts = (payload.forecasts || []).filter(
    (item) => item.score !== null && item.score !== undefined
  );
  if (!forecasts.length) return null;
  const first = forecasts[0];
  return {
    ...payload,
    forecasts,
    predictedYear: first.year,
    predictedScore: first.score,
    change: first.change,
  };
}

function recentTrendPrediction(stage, schoolKey, schoolType, admissionType) {
  if (!admissionType) admissionType = "录取分数线";
  const history = recordsForSchool(
    stage,
    schoolKey,
    schoolType,
    admissionType
  ).filter((record) => record.score_value !== null);
  if (history.length < 2) return null;
  const recent = history.slice(-4);
  const changes = recent
    .slice(1)
    .map((record, index) => record.score_value - recent[index].score_value);
  const weightedChange = weightedRecentChange(changes) ?? 0;
  const latest = recent[recent.length - 1];
  const futureScores = [];
  let previousScore = latest.score_value;
  for (let step = 1; step <= FORECAST_YEAR_COUNT; step += 1) {
    const score = capScore(previousScore + weightedChange);
    futureScores.push({
      year: latest.year + step,
      score,
      source: `近年加权变化 ${formatDelta(roundDelta(weightedChange))}`,
    });
    previousScore = score;
  }
  const lowConfidence = history.length <= 2;
  const clipped = changes.some(
    (change) => Math.abs(change) > TREND_MAX_YEARLY_CHANGE
  );
  const notes = [
    lowConfidence ? "仅 2 年有效数据，趋势仅供参考" : "",
    clipped ? `年变化超过 ${TREND_MAX_YEARLY_CHANGE} 分时已截尾` : "",
  ].filter(Boolean);
  return forecastResult({
    method: "近年趋势",
    latestYear: latest.year,
    forecasts: forecastItemsFromScores(latest.score_value, futureScores),
    basis: `${recent[0].year}-${latest.year} 同校录取线变化，按 EWMA 加权变化 ${formatDelta(roundDelta(weightedChange))} 逐年延展${notes.length ? `；${notes.join("；")}` : ""}`,
    confidenceNote: notes.join("；"),
  });
}

function cohortPrediction(stage, schoolKey, schoolType) {
  if (stage !== "初一" || !data.cohort_model) return null;
  const summary = cohortSummary(schoolKey, schoolType);
  const pair = latestCohortPair(schoolKey, schoolType);
  if (
    !summary ||
    !pair ||
    summary.weighted_delta === null ||
    summary.weighted_delta === undefined
  )
    return null;
  const primaryByYear = new Map(
    recordsForSchool("小一", schoolKey, schoolType)
      .filter((record) => record.score_value !== null)
      .map((record) => [record.year, record])
  );
  const futureScores = [];
  for (let step = 1; step <= FORECAST_YEAR_COUNT; step += 1) {
    const primaryYear = summary.latest_primary_year + step;
    const primary = primaryByYear.get(primaryYear);
    if (!primary) break;
    futureScores.push({
      year: summary.latest_junior_year + step,
      score: primary.score_value + summary.weighted_delta,
      source: `小一${primaryYear} ${formatScore(primary.score_value)}`,
    });
  }
  const multiPair = summary.usable_pair_count > 1;
  const method = multiPair ? "小一到初一 cohort 加权" : "小一到初一 cohort";
  const confidence =
    summary.usable_pair_count > 1
      ? `${summary.usable_pair_count} 届有效 cohort 样本`
      : "仅 1 届有效 cohort 样本";
  const deltaBasis = multiPair
    ? `有效 delta 加权均值 ${formatDelta(summary.weighted_delta)}，样本年 ${summary.years.join("、")}`
    : `cohort delta ${formatDelta(summary.weighted_delta)}`;
  return forecastResult({
    method,
    latestYear: summary.latest_junior_year,
    forecasts: forecastItemsFromScores(
      summary.latest_junior_score,
      futureScores
    ),
    basis: `最新映射小一${summary.latest_primary_year} ${formatScore(summary.latest_primary_score)} -> 初一${summary.latest_junior_year} ${formatScore(summary.latest_junior_score)}；${deltaBasis}；${confidence}；${futureScores.length} 年参考 ${futureScores.map((item) => item.source).join("、")}`,
    cohortDelta: summary.weighted_delta,
    confidenceNote: confidence,
  });
}

function groupedPrimaryCohortPrediction(stage, schoolKey, schoolType, admissionType) {
  if (stage !== "初一") return null;
  if (!admissionType) admissionType = "录取分数线";
  if (admissionType !== "录取分数线") return null;
  const lagYears = data.cohort_model?.lag_years || 6;
  const latest = latestRecordForSchool(stage, schoolKey, schoolType, admissionType);
  if (!latest || latest.score_value === null) return null;
  const primaryYear = latest.year - lagYears;
  const primaryRecords = data.records.filter(
    (record) =>
      record.stage === "小一" &&
      record.school_type === schoolType &&
      record.admission_type === "录取分数线" &&
      record.year === primaryYear &&
      record.score_value !== null
  );
  const primaryAvg = average(primaryRecords.map((record) => record.score_value));
  if (primaryAvg === null) return null;
  const cohortDelta = latest.score_value - primaryAvg;
  const futureScores = [];
  for (let step = 1; step <= FORECAST_YEAR_COUNT; step += 1) {
    const futurePrimaryYear = primaryYear + step;
    const futurePrimaryRecords = data.records.filter(
      (record) =>
        record.stage === "小一" &&
        record.school_type === schoolType &&
        record.admission_type === "录取分数线" &&
        record.year === futurePrimaryYear &&
        record.score_value !== null
    );
    const futurePrimaryAvg = average(
      futurePrimaryRecords.map((record) => record.score_value)
    );
    if (futurePrimaryAvg === null) break;
    futureScores.push({
      year: latest.year + step,
      score: futurePrimaryAvg + cohortDelta,
      source: `布吉${schoolType}小学${futurePrimaryYear}均线 ${formatScore(futurePrimaryAvg)}`,
    });
  }
  return forecastResult({
    method: `${schoolType}小学整体 cohort`,
    latestYear: latest.year,
    forecasts: forecastItemsFromScores(latest.score_value, futureScores),
    basis: `${schoolType}初中${latest.year}线 ${formatScore(latest.score_value)} - 布吉${schoolType}小学${primaryYear}均线 ${formatScore(primaryAvg)}；${futureScores.length} 年参考 ${futureScores.map((item) => item.source).join("、")}`,
    cohortDelta: Math.round(cohortDelta * 100) / 100,
  });
}

// ============================================================
// 主预测函数（与 index.html 保持一致）
// ============================================================
function predictionForSchool(stage, schoolKey, schoolType, admissionType) {
  if (!admissionType) admissionType = "录取分数线";
  const latest = latestRecordForSchool(
    stage,
    schoolKey,
    schoolType,
    admissionType
  );
  const pair =
    stage === "初一" && admissionType === "录取分数线"
      ? latestCohortPair(schoolKey, schoolType)
      : null;
  const summary =
    stage === "初一" && admissionType === "录取分数线"
      ? cohortSummary(schoolKey, schoolType)
      : null;

  const warnings =
    summary?.outlier_pair_count ||
    (pair && cohortPairOutlier(pair))
      ? [`cohort delta 异常，已自动降级`]
      : [];

  const direct =
    stage === "初一" && admissionType === "录取分数线"
      ? cohortPrediction(stage, schoolKey, schoolType)
      : null;

  const grouped =
    stage === "初一"
      ? groupedPrimaryCohortPrediction(
          stage,
          schoolKey,
          schoolType,
          admissionType
        )
      : null;

  const trend = recentTrendPrediction(
    stage,
    schoolKey,
    schoolType,
    admissionType
  );

  const candidates =
    stage === "初一" && admissionType === "录取分数线"
      ? [direct, grouped, trend].filter(Boolean)
      : [trend].filter(Boolean);

  const forecast = candidates[0] || null;
  const auxiliary = candidates.find((model) => model !== forecast) || null;

  // 提取目标年份预测
  const targetForecast =
    forecast?.forecasts?.find((f) => f.year === TARGET_YEAR) || null;
  const auxiliaryTargetForecast =
    auxiliary?.forecasts?.find((f) => f.year === TARGET_YEAR) || null;

  // 收集所有模型的首年预测
  const allModelForecasts = candidates
    .filter((m) => m?.forecasts?.length)
    .map((m) => {
      const modelTargetForecast =
        m.forecasts.find((f) => f.year === TARGET_YEAR) || null;
      return {
        method: m.method,
        target_year: TARGET_YEAR,
        target_forecast: modelTargetForecast,
        [`year${TARGET_YEAR}`]: modelTargetForecast,
        allForecasts: m.forecasts,
        basis: m.basis,
        confidenceNote: m.confidenceNote || null,
      };
    });

  const forecastHorizon = latest?.year ? TARGET_YEAR - latest.year : null;

  return {
    target_year: TARGET_YEAR,
    stage,
    school_key: schoolKey,
    school_type: schoolType,
    admission_type: admissionType,
    school_name: latest?.school_name || null,
    latest_year: latest?.year || null,
    latest_score: latest?.score_value ?? null,
    forecast_horizon: forecastHorizon,
    primary_method: forecast?.method || null,
    predicted_score: targetForecast?.score ?? null,
    predicted_change: targetForecast?.change ?? null,
    predicted_cumulative_change: targetForecast?.cumulativeChange ?? null,
    [`predicted_${TARGET_YEAR}_score`]: targetForecast?.score ?? null,
    [`predicted_${TARGET_YEAR}_change`]: targetForecast?.change ?? null,
    [`predicted_${TARGET_YEAR}_cumulative_change`]:
      targetForecast?.cumulativeChange ?? null,
    all_models: allModelForecasts,
    auxiliary_method: auxiliary?.method || null,
    auxiliary_score: auxiliaryTargetForecast?.score ?? null,
    [`auxiliary_${TARGET_YEAR}_score`]: auxiliaryTargetForecast?.score ?? null,
    warnings: warnings.length ? warnings : null,
  };
}

// ============================================================
// 收集所有唯一的学校组合
// ============================================================
function getAllSchoolTargets() {
  const targets = new Map();
  data.records.forEach((record) => {
    const key = [
      record.stage,
      record.school_key,
      record.school_type,
      record.admission_type,
    ].join("|");
    if (!targets.has(key)) {
      targets.set(key, {
        stage: record.stage,
        schoolKey: record.school_key,
        schoolType: record.school_type,
        admissionType: record.admission_type,
        schoolName: record.school_name,
      });
    }
  });
  return Array.from(targets.values());
}

// ============================================================
// 运行所有预测
// ============================================================
function runAllPredictions() {
  const targets = getAllSchoolTargets();
  const predictions = [];

  targets.forEach((target) => {
    const result = predictionForSchool(
      target.stage,
      target.schoolKey,
      target.schoolType,
      target.admissionType
    );
    predictions.push(result);
  });

  // 按学段、办学性质、录取类型、学校名排序
  const stageOrder = { 小一: 0, 初一: 1 };
  predictions.sort((a, b) => {
    const sa = stageOrder[a.stage] ?? 0;
    const sb = stageOrder[b.stage] ?? 0;
    if (sa !== sb) return sa - sb;
    if (a.school_type !== b.school_type)
      return a.school_type.localeCompare(b.school_type, "zh-CN");
    if (a.admission_type !== b.admission_type)
      return a.admission_type.localeCompare(b.admission_type, "zh-CN");
    return (a.school_key || "").localeCompare(b.school_key || "", "zh-CN");
  });

  return predictions;
}

// ============================================================
// 统计摘要
// ============================================================
function summarize(predictions) {
  const withPrediction = predictions.filter(
    (p) => p.predicted_score !== null
  );
  const withoutPrediction = predictions.filter(
    (p) => p.predicted_score === null
  );
  const byMethod = {};
  withPrediction.forEach((p) => {
    const m = p.primary_method || "未知";
    byMethod[m] = (byMethod[m] || 0) + 1;
  });
  const summary = {
    target_year: TARGET_YEAR,
    total_schools: predictions.length,
    with_prediction: withPrediction.length,
    without_prediction: withoutPrediction.length,
    without_details: withoutPrediction.map((p) => ({
      school_key: p.school_key,
      school_name: p.school_name,
      stage: p.stage,
      school_type: p.school_type,
      admission_type: p.admission_type,
      reason: p.latest_score === null ? "无有效历史分数" : "样本不足",
    })),
    by_primary_method: byMethod,
  };
  if (TARGET_YEAR === 2026) {
    summary.with_2026_prediction = withPrediction.length;
    summary.without_2026_prediction = withoutPrediction.length;
  }
  summary[`with_${TARGET_YEAR}_prediction`] = withPrediction.length;
  summary[`without_${TARGET_YEAR}_prediction`] = withoutPrediction.length;
  return summary;
}

// ============================================================
// 主入口
// ============================================================
function main() {
  console.log(`正在生成 ${TARGET_YEAR} 年录取分数预测...`);
  const predictions = runAllPredictions();
  const summary = summarize(predictions);

  const output = {
    meta: {
      generated_at: new Date().toISOString(),
      generator: "scripts/export_2026_predictions.js",
      description:
        `${TARGET_YEAR} 年布吉街道小一/初一录取分数预测备份。用于与 ${TARGET_YEAR} 年实际录取分数对比。`,
      data_snapshot: {
        years: data.meta.years,
        record_count: data.meta.record_count,
        school_count: data.meta.school_count,
        data_generated_at: data.meta.generated_at,
      },
      prediction_constants: {
        target_year: TARGET_YEAR,
        max_score: MAX_ADMISSION_SCORE,
        forecast_year_count: FORECAST_YEAR_COUNT,
        trend_decay: TREND_DECAY,
        trend_max_yearly_change: TREND_MAX_YEARLY_CHANGE,
        cohort_delta_outlier_threshold: COHORT_DELTA_OUTLIER_THRESHOLD,
      },
    },
    summary,
    predictions,
  };

  const outPath = path.join(
    __dirname,
    "..",
    "data",
    `predictions-${TARGET_YEAR}.json`
  );
  const jsOutPath = path.join(
    __dirname,
    "..",
    "data",
    `predictions-${TARGET_YEAR}.js`
  );
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2), "utf-8");
  const jsPayload = [
    "window.PREDICTIONS_DATA = window.PREDICTIONS_DATA || {};",
    `window.PREDICTIONS_DATA[${TARGET_YEAR}] = ${JSON.stringify(output, null, 2)};`,
    `window.PREDICTION_REPORT_DATA = window.PREDICTIONS_DATA[${TARGET_YEAR}];`,
    "",
  ].join("\n");
  fs.writeFileSync(jsOutPath, jsPayload, "utf-8");

  console.log(`\n===== 预测摘要 =====`);
  console.log(`学校组合总数: ${summary.total_schools}`);
  console.log(
    `有 ${TARGET_YEAR} 预测: ${summary.with_prediction}`
  );
  console.log(
    `无 ${TARGET_YEAR} 预测: ${summary.without_prediction}`
  );
  console.log(`\n预测方法分布:`);
  Object.entries(summary.by_primary_method).forEach(([method, count]) => {
    console.log(`  ${method}: ${count}`);
  });
  console.log(`\n无法预测的学校:`);
  summary.without_details.forEach((d) => {
    console.log(
      `  ${d.stage} ${d.school_type} ${d.school_name} (${d.school_key}) - ${d.reason}`
    );
  });
  console.log(`\n输出文件: ${outPath}`);
  console.log(`脚本数据: ${jsOutPath}`);
}

main();
