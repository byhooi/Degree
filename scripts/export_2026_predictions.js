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
const MIN_ADMISSION_SCORE = 60;
const MAX_ADMISSION_SCORE = 110;
const FORECAST_YEAR_COUNT = 3;
const TREND_DECAY = 0.8;
const TREND_MAX_YEARLY_CHANGE = 3;
const TREND_STRUCTURAL_BREAK_THRESHOLD =
  data.backtest?.structural_break_threshold || 20;
const COHORT_DELTA_OUTLIER_THRESHOLD =
  data.cohort_model?.delta_outlier_threshold || 10;
const HIGH_SCORE_PRIVATE_JUNIOR_THRESHOLD =
  data.cohort_model?.high_score_private_junior_threshold || 100;
const HIGH_SCORE_PRIMARY_POOL_THRESHOLD =
  data.cohort_model?.high_score_primary_pool_threshold || 100;
const HIGH_SCORE_POOL_MIN_COUNT =
  data.cohort_model?.high_score_pool_min_count || 3;
const MODEL_BACKTEST_MIN_SAMPLES = 2;
const PREDICTION_INTERVAL_MAE_MULTIPLIER = 1.5;

// ============================================================
// 工具函数（与 index.html 保持一致）
// ============================================================
function capScore(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  return (
    Math.round(
      Math.min(MAX_ADMISSION_SCORE, Math.max(MIN_ADMISSION_SCORE, Number(value))) *
        100
    ) / 100
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

function truncateAtStructuralBreak(history) {
  let breakIndex = null;
  for (let index = 1; index < history.length; index += 1) {
    if (
      history[index].year === history[index - 1].year + 1 &&
      Math.abs(history[index].score_value - history[index - 1].score_value) >
        TREND_STRUCTURAL_BREAK_THRESHOLD
    ) {
      breakIndex = index;
    }
  }
  if (breakIndex === null) return { history, breakYear: null };
  return { history: history.slice(breakIndex), breakYear: history[breakIndex].year };
}

function recentTrendPrediction(stage, schoolKey, schoolType, admissionType) {
  if (!admissionType) admissionType = "录取分数线";
  const fullHistory = recordsForSchool(
    stage,
    schoolKey,
    schoolType,
    admissionType
  ).filter((record) => record.score_value !== null);
  if (fullHistory.length < 2) return null;
  const { history, breakYear } = truncateAtStructuralBreak(fullHistory);
  const recent = history.slice(-4);
  const changes = recent
    .slice(1)
    .map((record, index) => record.score_value - recent[index].score_value);
  const weightedChange = changes.length ? weightedRecentChange(changes) ?? 0 : 0;
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
    breakYear
      ? `${breakYear} 年录取线跳变超过 ${TREND_STRUCTURAL_BREAK_THRESHOLD} 分（结构性断点），仅用断点后历史`
      : "",
    breakYear && history.length < 2 ? "断点后样本不足，按持平延展" : "",
    lowConfidence ? "有效数据不足 3 年，趋势仅供参考" : "",
    clipped ? `年变化超过 ${TREND_MAX_YEARLY_CHANGE} 分时已截尾` : "",
  ].filter(Boolean);
  return forecastResult({
    method: "近年趋势",
    modelKey: "trend",
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
  const consistentOutlier = summary.delta_mode === "consistent_outlier";
  const multiPair = summary.delta_pair_count > 1;
  const method = consistentOutlier
    ? "小一到初一 cohort（同向大差值）"
    : multiPair
      ? "小一到初一 cohort 加权"
      : "小一到初一 cohort";
  const confidence = consistentOutlier
    ? `${summary.delta_pair_count} 届 delta 均超阈值但方向一致，使用自身中位数`
    : multiPair
      ? `${summary.delta_pair_count} 届有效 cohort 样本`
      : "仅 1 届有效 cohort 样本";
  const deltaBasis = consistentOutlier
    ? `各届 delta 中位数 ${formatDelta(summary.weighted_delta)}，样本年 ${summary.years.join("、")}`
    : multiPair
      ? `有效 delta 加权均值 ${formatDelta(summary.weighted_delta)}，样本年 ${summary.years.join("、")}`
      : `cohort delta ${formatDelta(summary.weighted_delta)}`;
  return forecastResult({
    method,
    modelKey: "direct_cohort",
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

function primaryScoreMapByYear(schoolType, year) {
  const map = new Map();
  data.records.forEach((record) => {
    if (
      record.stage === "小一" &&
      record.admission_type === "录取分数线" &&
      record.year === year &&
      record.score_value !== null &&
      (!schoolType || record.school_type === schoolType)
    ) {
      map.set(record.school_key, record.score_value);
    }
  });
  return map;
}

function pairedPrimaryChange(schoolType, fromYear, toYear) {
  // 只统计两年都有分数的学校，避免学校集合逐年进出造成的成分漂移
  const fromMap = primaryScoreMapByYear(schoolType, fromYear);
  const toMap = primaryScoreMapByYear(schoolType, toYear);
  const common = [...fromMap.keys()].filter((key) => toMap.has(key));
  if (!common.length) return null;
  return {
    change: average(common.map((key) => toMap.get(key) - fromMap.get(key))),
    schoolCount: common.length,
  };
}

function groupedPrimaryCohortPrediction(stage, schoolKey, schoolType, admissionType) {
  if (stage !== "初一") return null;
  if (!admissionType) admissionType = "录取分数线";
  if (admissionType !== "录取分数线") return null;
  const lagYears = data.cohort_model?.lag_years || 6;
  const latest = latestRecordForSchool(stage, schoolKey, schoolType, admissionType);
  if (!latest || latest.score_value === null) return null;
  const primaryYear = latest.year - lagYears;
  const futureScores = [];
  for (let step = 1; step <= FORECAST_YEAR_COUNT; step += 1) {
    const paired = pairedPrimaryChange(schoolType, primaryYear, primaryYear + step);
    if (!paired) break;
    futureScores.push({
      year: latest.year + step,
      score: latest.score_value + paired.change,
      source: `布吉${schoolType}小学${primaryYear}→${primaryYear + step}配对均线变化 ${formatDelta(roundDelta(paired.change))}（${paired.schoolCount} 所）`,
    });
  }
  return forecastResult({
    method: `${schoolType}小学整体 cohort`,
    modelKey: "grouped_cohort",
    latestYear: latest.year,
    forecasts: forecastItemsFromScores(latest.score_value, futureScores),
    basis: `${schoolType}初中${latest.year}线 ${formatScore(latest.score_value)} 叠加布吉${schoolType}小学配对均线变化（只统计两年共有学校）；${futureScores.length} 年参考 ${futureScores.map((item) => item.source).join("、")}`,
  });
}

function highScorePoolKeys(year) {
  // 池口径完全由基准年决定：优先取 ≥阈值 的学校，不足最小数量时取基准年前 25%（至少 3 所）
  const scores = primaryScoreMapByYear(null, year);
  if (!scores.size) return null;
  const high = [...scores.entries()]
    .filter(([, value]) => value >= HIGH_SCORE_PRIMARY_POOL_THRESHOLD)
    .map(([key]) => key);
  if (high.length >= HIGH_SCORE_POOL_MIN_COUNT) {
    return { keys: high, label: `${HIGH_SCORE_PRIMARY_POOL_THRESHOLD}分以上小学` };
  }
  const topCount = Math.max(HIGH_SCORE_POOL_MIN_COUNT, Math.ceil(scores.size * 0.25));
  const ranked = [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topCount)
    .map(([key]) => key);
  return { keys: ranked, label: "小一高分段" };
}

function pairedPoolChange(fromYear, toYear) {
  const pool = highScorePoolKeys(fromYear);
  if (!pool) return null;
  const fromMap = primaryScoreMapByYear(null, fromYear);
  const toMap = primaryScoreMapByYear(null, toYear);
  const common = pool.keys.filter((key) => toMap.has(key));
  if (!common.length) return null;
  return {
    change: average(common.map((key) => toMap.get(key) - fromMap.get(key))),
    schoolCount: common.length,
    label: pool.label,
  };
}

function highScorePrivateCohortPrediction(
  stage,
  schoolKey,
  schoolType,
  admissionType
) {
  if (!admissionType) admissionType = "录取分数线";
  if (
    stage !== "初一" ||
    schoolType !== "民办" ||
    admissionType !== "录取分数线"
  )
    return null;
  const latest = latestRecordForSchool(
    stage,
    schoolKey,
    schoolType,
    admissionType
  );
  if (
    !latest ||
    latest.score_value === null ||
    latest.score_value < HIGH_SCORE_PRIVATE_JUNIOR_THRESHOLD
  )
    return null;
  const lagYears = data.cohort_model?.lag_years || 6;
  const primaryYear = latest.year - lagYears;
  const futureScores = [];
  let poolLabel = "";
  for (let step = 1; step <= FORECAST_YEAR_COUNT; step += 1) {
    const paired = pairedPoolChange(primaryYear, primaryYear + step);
    if (!paired) break;
    poolLabel = paired.label;
    futureScores.push({
      year: latest.year + step,
      score: latest.score_value + paired.change,
      source: `布吉${paired.label}${primaryYear}→${primaryYear + step}配对均线变化 ${formatDelta(roundDelta(paired.change))}（${paired.schoolCount} 所）`,
    });
  }
  return forecastResult({
    method: "高分民办竞争池 cohort",
    modelKey: "high_score_cohort",
    latestYear: latest.year,
    forecasts: forecastItemsFromScores(latest.score_value, futureScores),
    basis: `该校为 ${HIGH_SCORE_PRIVATE_JUNIOR_THRESHOLD} 分以上民办初中，按高积分择校生源池处理；民办初中${latest.year}线 ${formatScore(latest.score_value)} 叠加${poolLabel || "高分池"}配对均线变化（池成员由基准年固定）；${futureScores.length} 年参考 ${futureScores.map((item) => item.source).join("、")}`,
    confidenceNote:
      "高分民办可能吸引具备公办资格的深户、有房等高积分家庭，不能只按普通民办小学均线估计",
  });
}

// ============================================================
// 主预测函数（与 index.html 保持一致）
// ============================================================
function modelBacktestStats(modelKey, schoolType) {
  const entry = data.cohort_model?.model_backtests?.[modelKey];
  if (!entry) return null;
  const candidates = [entry.by_school_type?.[schoolType], entry.overall];
  for (const item of candidates) {
    if (
      item &&
      item.mae !== null &&
      item.mae !== undefined &&
      item.sample_count >= MODEL_BACKTEST_MIN_SAMPLES
    ) {
      return { mae: item.mae, sampleCount: item.sample_count };
    }
  }
  return null;
}

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
      ? [
          summary?.delta_mode === "consistent_outlier"
            ? "cohort delta 同向且均超阈值，已改用该校自身中位数"
            : "cohort delta 异常，已自动降级",
        ]
      : [];

  const direct =
    stage === "初一" && admissionType === "录取分数线"
      ? cohortPrediction(stage, schoolKey, schoolType)
      : null;

  const highScorePrivate =
    stage === "初一"
      ? highScorePrivateCohortPrediction(
          stage,
          schoolKey,
          schoolType,
          admissionType
        )
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

  const prioritized =
    stage === "初一" && admissionType === "录取分数线"
      ? [direct, highScorePrivate, grouped, trend].filter(Boolean)
      : [trend].filter(Boolean);
  prioritized.forEach((model, index) => {
    model.priority = index;
    model.backtest = modelBacktestStats(model.modelKey, schoolType);
  });
  // 按各模型留一回测 MAE 升序选择主预测模型；无可用回测数据的模型保持原有优先级
  const candidates = prioritized.slice().sort((a, b) => {
    const maeA = a.backtest ? a.backtest.mae : Infinity;
    const maeB = b.backtest ? b.backtest.mae : Infinity;
    return maeA === maeB ? a.priority - b.priority : maeA - maeB;
  });

  const forecast = candidates[0] || null;
  const auxiliary = candidates.find((model) => model !== forecast) || null;

  // 提取目标年份预测
  const targetForecast =
    forecast?.forecasts?.find((f) => f.year === TARGET_YEAR) || null;
  const auxiliaryTargetForecast =
    auxiliary?.forecasts?.find((f) => f.year === TARGET_YEAR) || null;

  // 按主模型回测 MAE 计算目标年置信区间
  const interval =
    targetForecast && forecast?.backtest
      ? {
          low: capScore(
            targetForecast.score -
              forecast.backtest.mae * PREDICTION_INTERVAL_MAE_MULTIPLIER
          ),
          high: capScore(
            targetForecast.score +
              forecast.backtest.mae * PREDICTION_INTERVAL_MAE_MULTIPLIER
          ),
          mae: forecast.backtest.mae,
          sample_count: forecast.backtest.sampleCount,
        }
      : null;

  // 收集所有模型的首年预测
  const allModelForecasts = candidates
    .filter((m) => m?.forecasts?.length)
    .map((m) => {
      const modelTargetForecast =
        m.forecasts.find((f) => f.year === TARGET_YEAR) || null;
      return {
        method: m.method,
        model_key: m.modelKey || null,
        backtest_mae: m.backtest?.mae ?? null,
        backtest_sample_count: m.backtest?.sampleCount ?? null,
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
    primary_model_key: forecast?.modelKey || null,
    primary_backtest_mae: forecast?.backtest?.mae ?? null,
    predicted_score: targetForecast?.score ?? null,
    predicted_change: targetForecast?.change ?? null,
    predicted_cumulative_change: targetForecast?.cumulativeChange ?? null,
    predicted_interval: interval,
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
        min_score: MIN_ADMISSION_SCORE,
        max_score: MAX_ADMISSION_SCORE,
        forecast_year_count: FORECAST_YEAR_COUNT,
        trend_decay: TREND_DECAY,
        trend_max_yearly_change: TREND_MAX_YEARLY_CHANGE,
        cohort_delta_outlier_threshold: COHORT_DELTA_OUTLIER_THRESHOLD,
        high_score_private_junior_threshold:
          HIGH_SCORE_PRIVATE_JUNIOR_THRESHOLD,
        high_score_primary_pool_threshold: HIGH_SCORE_PRIMARY_POOL_THRESHOLD,
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
