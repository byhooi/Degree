/**
 * 对比目标年份预测与实际录取分数
 *
 * 当目标年份实际录取数据录入后（更新 Excel → python scripts/build_data.py），
 * 运行此脚本即可得到对比报告。
 *
 * 用法: node scripts/compare_2026_predictions.js --year 2026
 *
 * 输出:
 *   - 终端摘要（MAE、最大误差、按方法/学段分组）
 *   - data/comparison-<year>.json（完整对比数据）
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
      `年份参数无效: ${candidate}. 用法: node scripts/compare_2026_predictions.js --year 2026`
    );
    process.exit(1);
  }
  return year;
}

const TARGET_YEAR = parseTargetYear(process.argv.slice(2));

const PREDICTIONS_PATH = path.join(
  __dirname,
  "..",
  "data",
  `predictions-${TARGET_YEAR}.json`
);
const DATA_PATH = path.join(
  __dirname,
  "..",
  "data",
  "admission-data.json"
);
const OUTPUT_PATH = path.join(
  __dirname,
  "..",
  "data",
  `comparison-${TARGET_YEAR}.json`
);

// ============================================================
// 加载数据
// ============================================================
let predictions;
try {
  predictions = JSON.parse(fs.readFileSync(PREDICTIONS_PATH, "utf-8"));
} catch (e) {
  console.error("预测备份文件未找到:", PREDICTIONS_PATH);
  console.error(
    `请先运行: node scripts/export_2026_predictions.js --year ${TARGET_YEAR}`
  );
  process.exit(1);
}

let data;
try {
  data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
} catch (e) {
  console.error("数据文件未找到:", DATA_PATH);
  process.exit(1);
}

// ============================================================
// 提取目标年份实际录取分数
// ============================================================
function getActualScore(stage, schoolKey, schoolType, admissionType) {
  const record = data.records.find(
    (r) =>
      r.stage === stage &&
      r.school_key === schoolKey &&
      r.school_type === schoolType &&
      r.admission_type === admissionType &&
      r.year === TARGET_YEAR
  );
  return record || null;
}

function predictionScore(pred) {
  return pred.predicted_score ?? pred[`predicted_${TARGET_YEAR}_score`] ?? null;
}

function modelTargetForecast(model) {
  return (
    model.target_forecast ??
    model[`year${TARGET_YEAR}`] ??
    (TARGET_YEAR === 2026 ? model.year2026 : null) ??
    null
  );
}

// ============================================================
// 执行对比
// ============================================================
function compare() {
  const results = [];
  let evaluableCount = 0;
  let noActualCount = 0;
  let noPredictionCount = 0;
  let actualCount = 0;

  predictions.predictions.forEach((pred) => {
    const predictedScore = predictionScore(pred);
    const actual = getActualScore(
      pred.stage,
      pred.school_key,
      pred.school_type,
      pred.admission_type
    );

    if (!actual || actual.score_value === null) {
      noActualCount++;
      results.push({
        target_year: TARGET_YEAR,
        school_key: pred.school_key,
        school_name: pred.school_name,
        stage: pred.stage,
        school_type: pred.school_type,
        admission_type: pred.admission_type,
        forecast_horizon: pred.forecast_horizon ?? null,
        predicted: predictedScore,
        [`predicted_${TARGET_YEAR}`]: predictedScore,
        primary_method: pred.primary_method,
        actual: null,
        [`actual_${TARGET_YEAR}`]: null,
        error: null,
        abs_error: null,
        status: "no_actual_data",
      });
      return;
    }

    actualCount++;

    if (predictedScore === null) {
      noPredictionCount++;
      results.push({
        target_year: TARGET_YEAR,
        school_key: pred.school_key,
        school_name: pred.school_name,
        stage: pred.stage,
        school_type: pred.school_type,
        admission_type: pred.admission_type,
        forecast_horizon: pred.forecast_horizon ?? null,
        predicted: null,
        [`predicted_${TARGET_YEAR}`]: null,
        primary_method: pred.primary_method,
        actual: actual.score_value,
        [`actual_${TARGET_YEAR}`]: actual.score_value,
        error: null,
        abs_error: null,
        status: "no_prediction",
        actual_note: actual.note || null,
      });
      return;
    }

    evaluableCount++;
    const error = Math.round((actual.score_value - predictedScore) * 100) / 100;
    const absError = error !== null ? Math.abs(error) : null;

    // 按模型分别计算误差
    const modelErrors = (pred.all_models || []).map((m) => {
      const modelPred = modelTargetForecast(m);
      if (!modelPred || modelPred.score === null) return null;
      return {
        method: m.method,
        predicted: modelPred.score,
        error: Math.round((actual.score_value - modelPred.score) * 100) / 100,
        abs_error: Math.abs(
          Math.round((actual.score_value - modelPred.score) * 100) / 100
        ),
      };
    }).filter(Boolean);

    results.push({
      target_year: TARGET_YEAR,
      school_key: pred.school_key,
      school_name: pred.school_name,
      stage: pred.stage,
      school_type: pred.school_type,
      admission_type: pred.admission_type,
      forecast_horizon: pred.forecast_horizon ?? null,
      predicted: predictedScore,
      [`predicted_${TARGET_YEAR}`]: predictedScore,
      primary_method: pred.primary_method,
      actual: actual.score_value,
      [`actual_${TARGET_YEAR}`]: actual.score_value,
      error,
      abs_error: absError,
      status: "matched",
      model_errors: modelErrors,
      actual_note: actual.note || null,
    });
  });

  return {
    results,
    evaluableCount,
    noActualCount,
    noPredictionCount,
    actualCount,
  };
}

// ============================================================
// 计算统计指标
// ============================================================
function computeMetrics(matched) {
  if (!matched.length) return null;
  const evaluable = matched.filter((r) => r.abs_error !== null);
  const absErrors = evaluable.map((r) => r.abs_error);
  if (!absErrors.length) return null;

  const mae =
    Math.round(
      (absErrors.reduce((a, b) => a + b, 0) / absErrors.length) * 100
    ) / 100;
  const rmse = Math.round(
    Math.sqrt(
      absErrors.reduce((a, b) => a + b * b, 0) / absErrors.length
    ) * 100
  ) / 100;
  const maxError = Math.max(...absErrors);
  const within1 =
    Math.round(
      (absErrors.filter((e) => e <= 1).length / absErrors.length) * 10000
    ) / 100;
  const within3 =
    Math.round(
      (absErrors.filter((e) => e <= 3).length / absErrors.length) * 10000
    ) / 100;
  const within5 =
    Math.round(
      (absErrors.filter((e) => e <= 5).length / absErrors.length) * 10000
    ) / 100;
  const within10 =
    Math.round(
      (absErrors.filter((e) => e <= 10).length / absErrors.length) * 10000
    ) / 100;

  const overEstimates = evaluable.filter((r) => r.error < 0);
  const underEstimates = evaluable.filter((r) => r.error > 0);
  const exactCount = evaluable.filter((r) => r.error === 0);

  return {
    count: evaluable.length,
    mae,
    rmse,
    max_error: maxError,
    max_error_school: evaluable.find((r) => r.abs_error === maxError)?.school_name || null,
    error_distribution: {
      within_1: within1 + "%",
      within_3: within3 + "%",
      within_5: within5 + "%",
      within_10: within10 + "%",
    },
    bias: {
      over_estimate: overEstimates.length,   // 预测高于实际
      under_estimate: underEstimates.length,  // 预测低于实际
      exact: exactCount.length,
      mean_error: Math.round(
        (evaluable.reduce((a, b) => a + b.error, 0) / evaluable.length) *
          100
      ) / 100,
    },
  };
}

// ============================================================
// 按维度分组统计
// ============================================================
function groupBy(matched, keyFn) {
  const groups = {};
  matched.forEach((r) => {
    const key = keyFn(r);
    if (!groups[key]) groups[key] = [];
    groups[key].push(r);
  });
  const result = {};
  Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([key, items]) => {
      result[key] = computeMetrics(items);
    });
  return result;
}

// ============================================================
// 最佳模型分析
// ============================================================
function bestModelAnalysis(matched) {
  // 对每个学校，找出误差最小的模型
  const modelRanks = {};
  matched.forEach((r) => {
    if (!r.model_errors) return;
    r.model_errors.forEach((me) => {
      if (!modelRanks[me.method]) {
        modelRanks[me.method] = { errors: [], count: 0, total_abs_error: 0 };
      }
      modelRanks[me.method].errors.push(me.abs_error);
      modelRanks[me.method].count++;
      modelRanks[me.method].total_abs_error += me.abs_error;
    });

    // 找出该学校的最佳模型
    const best = r.model_errors
      .filter((me) => me.abs_error !== null)
      .sort((a, b) => a.abs_error - b.abs_error)[0];
    if (best) {
      r.best_model = best.method;
      r.best_model_error = best.abs_error;
    }
  });

  const modelMAE = {};
  Object.entries(modelRanks).forEach(([method, stats]) => {
    modelMAE[method] = {
      sample_count: stats.count,
      mae: Math.round((stats.total_abs_error / stats.count) * 100) / 100,
    };
  });

  // 统计每个模型作为"最佳"的次数
  const bestCounts = {};
  matched.forEach((r) => {
    if (r.best_model) {
      bestCounts[r.best_model] = (bestCounts[r.best_model] || 0) + 1;
    }
  });

  return { model_mae: modelMAE, best_model_counts: bestCounts };
}

// ============================================================
// 主入口
// ============================================================
function main() {
  const {
    results,
    evaluableCount,
    noActualCount,
    noPredictionCount,
    actualCount,
  } = compare();

  console.log(`===== ${TARGET_YEAR} 年预测 vs 实际录取分数对比 =====\n`);

  if (actualCount === 0) {
    console.log(`admission-data.json 中尚无 ${TARGET_YEAR} 年实际录取数据。`);
    console.log(`请将 ${TARGET_YEAR} 年数据录入 Excel 后重新运行:`);
    console.log("  python scripts/build_data.py");
    console.log(`  node scripts/compare_2026_predictions.js --year ${TARGET_YEAR}\n`);
    console.log(
      `未输出 ${OUTPUT_PATH}，避免生成没有实际分数的占位对比文件。`
    );
    return;
  }

  const matched = results.filter((r) => r.status === "matched");
  if (!matched.length) {
    const output = {
      meta: {
        compared_at: new Date().toISOString(),
        target_year: TARGET_YEAR,
        status: "no_evaluable_predictions",
        message: `${TARGET_YEAR} 年实际录取数据已存在，但预测备份中没有可评估预测。`,
        predictions_backup: predictions.meta,
        data_snapshot: {
          years: data.meta.years,
          has_target_year: data.meta.years.includes(TARGET_YEAR),
        },
      },
      summary: {
        actual: actualCount,
        evaluable: evaluableCount,
        no_actual: noActualCount,
        no_prediction: noPredictionCount,
      },
      results,
    };
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf-8");
    console.log(`无可评估预测，对比文件已输出: ${OUTPUT_PATH}`);
    return;
  }

  const overall = computeMetrics(matched);
  const byStage = groupBy(matched, (r) => r.stage);
  const byType = groupBy(matched, (r) => r.school_type);
  const byMethod = groupBy(matched, (r) => r.primary_method || "未知");
  const byForecastHorizon = groupBy(
    matched,
    (r) => `${r.forecast_horizon ?? "未知"} 年`
  );
  const byStageAndMethod = groupBy(
    matched,
    (r) => `${r.stage} · ${r.primary_method || "未知"}`
  );
  const modelAnalysis = bestModelAnalysis(matched);

  // 终端摘要
  console.log(
    `可评估: ${evaluableCount}  无 ${TARGET_YEAR} 实际数据: ${noActualCount}  无预测: ${noPredictionCount}\n`
  );

  console.log("---- 总体指标 ----");
  console.log(`MAE:          ${overall.mae}`);
  console.log(`RMSE:         ${overall.rmse}`);
  console.log(`最大误差:     ${overall.max_error}（${overall.max_error_school}）`);
  console.log(`误差分布:     ≤1分 ${overall.error_distribution.within_1}  ≤3分 ${overall.error_distribution.within_3}  ≤5分 ${overall.error_distribution.within_5}  ≤10分 ${overall.error_distribution.within_10}`);
  console.log(
    `偏差方向:     高估 ${overall.bias.over_estimate}  低估 ${overall.bias.under_estimate}  精确 ${overall.bias.exact}`
  );
  console.log(`平均偏差:     ${overall.bias.mean_error}（正=低估，负=高估）\n`);

  console.log("---- 按学段 ----");
  Object.entries(byStage).forEach(([stage, m]) => {
    console.log(`${stage}: MAE ${m.mae}  样本 ${m.count}`);
  });

  console.log("\n---- 按预测方法 ----");
  Object.entries(byMethod).forEach(([method, m]) => {
    console.log(`${method}: MAE ${m.mae}  样本 ${m.count}`);
  });

  console.log("\n---- 按预测期限 ----");
  Object.entries(byForecastHorizon).forEach(([horizon, m]) => {
    console.log(`${horizon}: MAE ${m.mae}  样本 ${m.count}`);
  });

  console.log("\n---- 按学段×方法 ----");
  Object.entries(byStageAndMethod).forEach(([key, m]) => {
    console.log(`${key}: MAE ${m.mae}  样本 ${m.count}`);
  });

  console.log("\n---- 各模型独立 MAE ----");
  Object.entries(modelAnalysis.model_mae).forEach(([method, m]) => {
    console.log(`${method}: MAE ${m.mae}  样本 ${m.sample_count}`);
  });

  console.log("\n---- 各模型被选为最佳次数 ----");
  Object.entries(modelAnalysis.best_model_counts)
    .sort(([, a], [, b]) => b - a)
    .forEach(([method, count]) => {
      console.log(`${method}: ${count} 次`);
    });

  console.log("\n---- 最大误差 TOP 5 ----");
  matched
    .filter((r) => r.abs_error !== null)
    .sort((a, b) => b.abs_error - a.abs_error)
    .slice(0, 5)
    .forEach((r) => {
      console.log(
        `${r.school_name} (${r.stage} ${r.school_type}): 预测 ${r.predicted}  实际 ${r.actual}  误差 ${r.error}  [${r.primary_method}]`
      );
    });

  // 输出完整对比文件
  const output = {
    meta: {
      compared_at: new Date().toISOString(),
      target_year: TARGET_YEAR,
      status: "complete",
      predictions_backup: predictions.meta,
      data_snapshot: {
        years: data.meta.years,
        has_target_year: data.meta.years.includes(TARGET_YEAR),
      },
    },
    summary: {
      actual: actualCount,
      evaluable: evaluableCount,
      no_actual: noActualCount,
      no_prediction: noPredictionCount,
      overall,
      by_stage: byStage,
      by_type: byType,
      by_method: byMethod,
      by_forecast_horizon: byForecastHorizon,
      by_stage_and_method: byStageAndMethod,
      model_analysis: modelAnalysis,
    },
    results,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf-8");
  console.log(`\n对比文件已输出: ${OUTPUT_PATH}`);
}

main();
