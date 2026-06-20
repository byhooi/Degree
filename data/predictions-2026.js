window.PREDICTIONS_DATA = window.PREDICTIONS_DATA || {};
window.PREDICTIONS_DATA[2026] = {
  "meta": {
    "generated_at": "2026-06-20T06:32:03.883Z",
    "generator": "scripts/export_2026_predictions.js",
    "description": "2026 年布吉街道小一/初一录取分数预测备份。用于与 2026 年实际录取分数对比。",
    "data_snapshot": {
      "years": [
        2017,
        2018,
        2019,
        2020,
        2021,
        2022,
        2023,
        2024,
        2025
      ],
      "record_count": 349,
      "school_count": 39,
      "data_generated_at": "2026-06-19T18:03:28"
    },
    "prediction_constants": {
      "target_year": 2026,
      "max_score": 110,
      "forecast_year_count": 3,
      "trend_decay": 0.8,
      "trend_max_yearly_change": 3,
      "cohort_delta_outlier_threshold": 10
    }
  },
  "summary": {
    "target_year": 2026,
    "total_schools": 47,
    "with_prediction": 47,
    "without_prediction": 0,
    "without_details": [],
    "by_primary_method": {
      "近年趋势": 33,
      "公办小学整体 cohort": 5,
      "小一到初一 cohort 加权": 5,
      "小一到初一 cohort": 1,
      "民办小学整体 cohort": 3
    },
    "with_2026_prediction": 47,
    "without_2026_prediction": 0
  },
  "predictions": [
    {
      "target_year": 2026,
      "stage": "小一",
      "school_key": "百外世纪小学公办班",
      "school_type": "公办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道百外世纪小学公办班",
      "latest_year": 2025,
      "latest_score": 105.95,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 105.35,
      "predicted_change": -0.6,
      "predicted_cumulative_change": -0.6,
      "predicted_2026_score": 105.35,
      "predicted_2026_change": -0.6,
      "predicted_2026_cumulative_change": -0.6,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 105.35,
            "change": -0.6,
            "cumulativeChange": -0.6,
            "source": "近年加权变化 -0.6"
          },
          "year2026": {
            "year": 2026,
            "score": 105.35,
            "change": -0.6,
            "cumulativeChange": -0.6,
            "source": "近年加权变化 -0.6"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 105.35,
              "change": -0.6,
              "cumulativeChange": -0.6,
              "source": "近年加权变化 -0.6"
            },
            {
              "year": 2027,
              "score": 104.75,
              "change": -0.6,
              "cumulativeChange": -1.2,
              "source": "近年加权变化 -0.6"
            },
            {
              "year": 2028,
              "score": 104.15,
              "change": -0.6,
              "cumulativeChange": -1.8,
              "source": "近年加权变化 -0.6"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 -0.6 逐年延展",
          "confidenceNote": null
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "小一",
      "school_key": "德兴小学",
      "school_type": "公办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道德兴小学",
      "latest_year": 2025,
      "latest_score": 66.35,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 64.92,
      "predicted_change": -1.43,
      "predicted_cumulative_change": -1.43,
      "predicted_2026_score": 64.92,
      "predicted_2026_change": -1.43,
      "predicted_2026_cumulative_change": -1.43,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 64.92,
            "change": -1.43,
            "cumulativeChange": -1.43,
            "source": "近年加权变化 -1.43"
          },
          "year2026": {
            "year": 2026,
            "score": 64.92,
            "change": -1.43,
            "cumulativeChange": -1.43,
            "source": "近年加权变化 -1.43"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 64.92,
              "change": -1.43,
              "cumulativeChange": -1.43,
              "source": "近年加权变化 -1.43"
            },
            {
              "year": 2027,
              "score": 63.49,
              "change": -1.43,
              "cumulativeChange": -2.86,
              "source": "近年加权变化 -1.43"
            },
            {
              "year": 2028,
              "score": 62.06,
              "change": -1.43,
              "cumulativeChange": -4.29,
              "source": "近年加权变化 -1.43"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 -1.43 逐年延展；年变化超过 3 分时已截尾",
          "confidenceNote": "年变化超过 3 分时已截尾"
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "小一",
      "school_key": "华中师范大学龙岗附属中学",
      "school_type": "公办",
      "admission_type": "录取分数线",
      "school_name": "华中师范大学龙岗附属中学",
      "latest_year": 2025,
      "latest_score": 91.2,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 92.63,
      "predicted_change": 1.43,
      "predicted_cumulative_change": 1.43,
      "predicted_2026_score": 92.63,
      "predicted_2026_change": 1.43,
      "predicted_2026_cumulative_change": 1.43,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 92.63,
            "change": 1.43,
            "cumulativeChange": 1.43,
            "source": "近年加权变化 +1.43"
          },
          "year2026": {
            "year": 2026,
            "score": 92.63,
            "change": 1.43,
            "cumulativeChange": 1.43,
            "source": "近年加权变化 +1.43"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 92.63,
              "change": 1.43,
              "cumulativeChange": 1.43,
              "source": "近年加权变化 +1.43"
            },
            {
              "year": 2027,
              "score": 94.06,
              "change": 1.43,
              "cumulativeChange": 2.86,
              "source": "近年加权变化 +1.43"
            },
            {
              "year": 2028,
              "score": 95.49,
              "change": 1.43,
              "cumulativeChange": 4.29,
              "source": "近年加权变化 +1.43"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 +1.43 逐年延展；年变化超过 3 分时已截尾",
          "confidenceNote": "年变化超过 3 分时已截尾"
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "小一",
      "school_key": "吉祥小学",
      "school_type": "公办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道吉祥小学",
      "latest_year": 2025,
      "latest_score": 67.35,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 64.8,
      "predicted_change": -2.55,
      "predicted_cumulative_change": -2.55,
      "predicted_2026_score": 64.8,
      "predicted_2026_change": -2.55,
      "predicted_2026_cumulative_change": -2.55,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 64.8,
            "change": -2.55,
            "cumulativeChange": -2.55,
            "source": "近年加权变化 -2.55"
          },
          "year2026": {
            "year": 2026,
            "score": 64.8,
            "change": -2.55,
            "cumulativeChange": -2.55,
            "source": "近年加权变化 -2.55"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 64.8,
              "change": -2.55,
              "cumulativeChange": -2.55,
              "source": "近年加权变化 -2.55"
            },
            {
              "year": 2027,
              "score": 62.25,
              "change": -2.55,
              "cumulativeChange": -5.1,
              "source": "近年加权变化 -2.55"
            },
            {
              "year": 2028,
              "score": 59.7,
              "change": -2.55,
              "cumulativeChange": -7.65,
              "source": "近年加权变化 -2.55"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 -2.55 逐年延展；年变化超过 3 分时已截尾",
          "confidenceNote": "年变化超过 3 分时已截尾"
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "小一",
      "school_key": "莲花小学",
      "school_type": "公办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道莲花小学",
      "latest_year": 2025,
      "latest_score": 70,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 69.56,
      "predicted_change": -0.44,
      "predicted_cumulative_change": -0.44,
      "predicted_2026_score": 69.56,
      "predicted_2026_change": -0.44,
      "predicted_2026_cumulative_change": -0.44,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 69.56,
            "change": -0.44,
            "cumulativeChange": -0.44,
            "source": "近年加权变化 -0.44"
          },
          "year2026": {
            "year": 2026,
            "score": 69.56,
            "change": -0.44,
            "cumulativeChange": -0.44,
            "source": "近年加权变化 -0.44"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 69.56,
              "change": -0.44,
              "cumulativeChange": -0.44,
              "source": "近年加权变化 -0.44"
            },
            {
              "year": 2027,
              "score": 69.12,
              "change": -0.44,
              "cumulativeChange": -0.88,
              "source": "近年加权变化 -0.44"
            },
            {
              "year": 2028,
              "score": 68.68,
              "change": -0.44,
              "cumulativeChange": -1.32,
              "source": "近年加权变化 -0.44"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 -0.44 逐年延展；年变化超过 3 分时已截尾",
          "confidenceNote": "年变化超过 3 分时已截尾"
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "小一",
      "school_key": "龙岭学校公办班",
      "school_type": "公办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道龙岭学校公办班",
      "latest_year": 2025,
      "latest_score": 97.7,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 98.22,
      "predicted_change": 0.52,
      "predicted_cumulative_change": 0.52,
      "predicted_2026_score": 98.22,
      "predicted_2026_change": 0.52,
      "predicted_2026_cumulative_change": 0.52,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 98.22,
            "change": 0.52,
            "cumulativeChange": 0.52,
            "source": "近年加权变化 +0.52"
          },
          "year2026": {
            "year": 2026,
            "score": 98.22,
            "change": 0.52,
            "cumulativeChange": 0.52,
            "source": "近年加权变化 +0.52"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 98.22,
              "change": 0.52,
              "cumulativeChange": 0.52,
              "source": "近年加权变化 +0.52"
            },
            {
              "year": 2027,
              "score": 98.74,
              "change": 0.52,
              "cumulativeChange": 1.04,
              "source": "近年加权变化 +0.52"
            },
            {
              "year": 2028,
              "score": 99.26,
              "change": 0.52,
              "cumulativeChange": 1.56,
              "source": "近年加权变化 +0.52"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 +0.52 逐年延展；年变化超过 3 分时已截尾",
          "confidenceNote": "年变化超过 3 分时已截尾"
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "小一",
      "school_key": "龙园意境小学",
      "school_type": "公办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道龙园意境小学",
      "latest_year": 2025,
      "latest_score": 75.65,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 74.22,
      "predicted_change": -1.43,
      "predicted_cumulative_change": -1.43,
      "predicted_2026_score": 74.22,
      "predicted_2026_change": -1.43,
      "predicted_2026_cumulative_change": -1.43,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 74.22,
            "change": -1.43,
            "cumulativeChange": -1.43,
            "source": "近年加权变化 -1.43"
          },
          "year2026": {
            "year": 2026,
            "score": 74.22,
            "change": -1.43,
            "cumulativeChange": -1.43,
            "source": "近年加权变化 -1.43"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 74.22,
              "change": -1.43,
              "cumulativeChange": -1.43,
              "source": "近年加权变化 -1.43"
            },
            {
              "year": 2027,
              "score": 72.79,
              "change": -1.43,
              "cumulativeChange": -2.86,
              "source": "近年加权变化 -1.43"
            },
            {
              "year": 2028,
              "score": 71.36,
              "change": -1.43,
              "cumulativeChange": -4.29,
              "source": "近年加权变化 -1.43"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 -1.43 逐年延展；年变化超过 3 分时已截尾",
          "confidenceNote": "年变化超过 3 分时已截尾"
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "小一",
      "school_key": "文景小学",
      "school_type": "公办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道文景小学",
      "latest_year": 2025,
      "latest_score": 103.4,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 103.54,
      "predicted_change": 0.14,
      "predicted_cumulative_change": 0.14,
      "predicted_2026_score": 103.54,
      "predicted_2026_change": 0.14,
      "predicted_2026_cumulative_change": 0.14,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 103.54,
            "change": 0.14,
            "cumulativeChange": 0.14,
            "source": "近年加权变化 +0.14"
          },
          "year2026": {
            "year": 2026,
            "score": 103.54,
            "change": 0.14,
            "cumulativeChange": 0.14,
            "source": "近年加权变化 +0.14"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 103.54,
              "change": 0.14,
              "cumulativeChange": 0.14,
              "source": "近年加权变化 +0.14"
            },
            {
              "year": 2027,
              "score": 103.68,
              "change": 0.14,
              "cumulativeChange": 0.28,
              "source": "近年加权变化 +0.14"
            },
            {
              "year": 2028,
              "score": 103.82,
              "change": 0.14,
              "cumulativeChange": 0.42,
              "source": "近年加权变化 +0.14"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 +0.14 逐年延展",
          "confidenceNote": null
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "小一",
      "school_key": "文理学校",
      "school_type": "公办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道文理学校",
      "latest_year": 2025,
      "latest_score": 90.35,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 93.24,
      "predicted_change": 2.89,
      "predicted_cumulative_change": 2.89,
      "predicted_2026_score": 93.24,
      "predicted_2026_change": 2.89,
      "predicted_2026_cumulative_change": 2.89,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 93.24,
            "change": 2.89,
            "cumulativeChange": 2.89,
            "source": "近年加权变化 +2.89"
          },
          "year2026": {
            "year": 2026,
            "score": 93.24,
            "change": 2.89,
            "cumulativeChange": 2.89,
            "source": "近年加权变化 +2.89"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 93.24,
              "change": 2.89,
              "cumulativeChange": 2.89,
              "source": "近年加权变化 +2.89"
            },
            {
              "year": 2027,
              "score": 96.13,
              "change": 2.89,
              "cumulativeChange": 5.78,
              "source": "近年加权变化 +2.89"
            },
            {
              "year": 2028,
              "score": 99.02,
              "change": 2.89,
              "cumulativeChange": 8.67,
              "source": "近年加权变化 +2.89"
            }
          ],
          "basis": "2023-2025 同校录取线变化，按 EWMA 加权变化 +2.89 逐年延展；年变化超过 3 分时已截尾",
          "confidenceNote": "年变化超过 3 分时已截尾"
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "小一",
      "school_key": "贤义外国语学校",
      "school_type": "公办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道贤义外国语学校小学部",
      "latest_year": 2025,
      "latest_score": 105.1,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 105.24,
      "predicted_change": 0.14,
      "predicted_cumulative_change": 0.14,
      "predicted_2026_score": 105.24,
      "predicted_2026_change": 0.14,
      "predicted_2026_cumulative_change": 0.14,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 105.24,
            "change": 0.14,
            "cumulativeChange": 0.14,
            "source": "近年加权变化 +0.14"
          },
          "year2026": {
            "year": 2026,
            "score": 105.24,
            "change": 0.14,
            "cumulativeChange": 0.14,
            "source": "近年加权变化 +0.14"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 105.24,
              "change": 0.14,
              "cumulativeChange": 0.14,
              "source": "近年加权变化 +0.14"
            },
            {
              "year": 2027,
              "score": 105.38,
              "change": 0.14,
              "cumulativeChange": 0.28,
              "source": "近年加权变化 +0.14"
            },
            {
              "year": 2028,
              "score": 105.52,
              "change": 0.14,
              "cumulativeChange": 0.42,
              "source": "近年加权变化 +0.14"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 +0.14 逐年延展",
          "confidenceNote": null
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "小一",
      "school_key": "信义实验小学",
      "school_type": "公办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道信义实验小学",
      "latest_year": 2025,
      "latest_score": 96,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 95.32,
      "predicted_change": -0.68,
      "predicted_cumulative_change": -0.68,
      "predicted_2026_score": 95.32,
      "predicted_2026_change": -0.68,
      "predicted_2026_cumulative_change": -0.68,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 95.32,
            "change": -0.68,
            "cumulativeChange": -0.68,
            "source": "近年加权变化 -0.68"
          },
          "year2026": {
            "year": 2026,
            "score": 95.32,
            "change": -0.68,
            "cumulativeChange": -0.68,
            "source": "近年加权变化 -0.68"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 95.32,
              "change": -0.68,
              "cumulativeChange": -0.68,
              "source": "近年加权变化 -0.68"
            },
            {
              "year": 2027,
              "score": 94.64,
              "change": -0.68,
              "cumulativeChange": -1.36,
              "source": "近年加权变化 -0.68"
            },
            {
              "year": 2028,
              "score": 93.96,
              "change": -0.68,
              "cumulativeChange": -2.04,
              "source": "近年加权变化 -0.68"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 -0.68 逐年延展；年变化超过 3 分时已截尾",
          "confidenceNote": "年变化超过 3 分时已截尾"
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "小一",
      "school_key": "中心小学",
      "school_type": "公办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道中心小学",
      "latest_year": 2025,
      "latest_score": 70,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 69.8,
      "predicted_change": -0.2,
      "predicted_cumulative_change": -0.2,
      "predicted_2026_score": 69.8,
      "predicted_2026_change": -0.2,
      "predicted_2026_cumulative_change": -0.2,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 69.8,
            "change": -0.2,
            "cumulativeChange": -0.2,
            "source": "近年加权变化 -0.2"
          },
          "year2026": {
            "year": 2026,
            "score": 69.8,
            "change": -0.2,
            "cumulativeChange": -0.2,
            "source": "近年加权变化 -0.2"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 69.8,
              "change": -0.2,
              "cumulativeChange": -0.2,
              "source": "近年加权变化 -0.2"
            },
            {
              "year": 2027,
              "score": 69.6,
              "change": -0.2,
              "cumulativeChange": -0.4,
              "source": "近年加权变化 -0.2"
            },
            {
              "year": 2028,
              "score": 69.4,
              "change": -0.2,
              "cumulativeChange": -0.6,
              "source": "近年加权变化 -0.2"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 -0.2 逐年延展；年变化超过 3 分时已截尾",
          "confidenceNote": "年变化超过 3 分时已截尾"
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "小一",
      "school_key": "爱义学校",
      "school_type": "民办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道爱义学校",
      "latest_year": 2025,
      "latest_score": 60,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 58.88,
      "predicted_change": -1.12,
      "predicted_cumulative_change": -1.12,
      "predicted_2026_score": 58.88,
      "predicted_2026_change": -1.12,
      "predicted_2026_cumulative_change": -1.12,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 58.88,
            "change": -1.12,
            "cumulativeChange": -1.12,
            "source": "近年加权变化 -1.12"
          },
          "year2026": {
            "year": 2026,
            "score": 58.88,
            "change": -1.12,
            "cumulativeChange": -1.12,
            "source": "近年加权变化 -1.12"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 58.88,
              "change": -1.12,
              "cumulativeChange": -1.12,
              "source": "近年加权变化 -1.12"
            },
            {
              "year": 2027,
              "score": 57.76,
              "change": -1.12,
              "cumulativeChange": -2.24,
              "source": "近年加权变化 -1.12"
            },
            {
              "year": 2028,
              "score": 56.64,
              "change": -1.12,
              "cumulativeChange": -3.36,
              "source": "近年加权变化 -1.12"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 -1.12 逐年延展",
          "confidenceNote": null
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "小一",
      "school_key": "百外春蕾小学",
      "school_type": "民办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道百外春蕾小学",
      "latest_year": 2025,
      "latest_score": 105.3,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 105.5,
      "predicted_change": 0.2,
      "predicted_cumulative_change": 0.2,
      "predicted_2026_score": 105.5,
      "predicted_2026_change": 0.2,
      "predicted_2026_cumulative_change": 0.2,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 105.5,
            "change": 0.2,
            "cumulativeChange": 0.2,
            "source": "近年加权变化 +0.2"
          },
          "year2026": {
            "year": 2026,
            "score": 105.5,
            "change": 0.2,
            "cumulativeChange": 0.2,
            "source": "近年加权变化 +0.2"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 105.5,
              "change": 0.2,
              "cumulativeChange": 0.2,
              "source": "近年加权变化 +0.2"
            },
            {
              "year": 2027,
              "score": 105.7,
              "change": 0.2,
              "cumulativeChange": 0.4,
              "source": "近年加权变化 +0.2"
            },
            {
              "year": 2028,
              "score": 105.9,
              "change": 0.2,
              "cumulativeChange": 0.6,
              "source": "近年加权变化 +0.2"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 +0.2 逐年延展",
          "confidenceNote": null
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "小一",
      "school_key": "百外世纪小学",
      "school_type": "民办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道百外世纪小学",
      "latest_year": 2025,
      "latest_score": 103.8,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 103.7,
      "predicted_change": -0.1,
      "predicted_cumulative_change": -0.1,
      "predicted_2026_score": 103.7,
      "predicted_2026_change": -0.1,
      "predicted_2026_cumulative_change": -0.1,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 103.7,
            "change": -0.1,
            "cumulativeChange": -0.1,
            "source": "近年加权变化 -0.1"
          },
          "year2026": {
            "year": 2026,
            "score": 103.7,
            "change": -0.1,
            "cumulativeChange": -0.1,
            "source": "近年加权变化 -0.1"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 103.7,
              "change": -0.1,
              "cumulativeChange": -0.1,
              "source": "近年加权变化 -0.1"
            },
            {
              "year": 2027,
              "score": 103.6,
              "change": -0.1,
              "cumulativeChange": -0.2,
              "source": "近年加权变化 -0.1"
            },
            {
              "year": 2028,
              "score": 103.5,
              "change": -0.1,
              "cumulativeChange": -0.3,
              "source": "近年加权变化 -0.1"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 -0.1 逐年延展",
          "confidenceNote": null
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "小一",
      "school_key": "承翰学校",
      "school_type": "民办",
      "admission_type": "录取分数线",
      "school_name": "深圳市承翰学校",
      "latest_year": 2025,
      "latest_score": 60,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 59.27,
      "predicted_change": -0.73,
      "predicted_cumulative_change": -0.73,
      "predicted_2026_score": 59.27,
      "predicted_2026_change": -0.73,
      "predicted_2026_cumulative_change": -0.73,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 59.27,
            "change": -0.73,
            "cumulativeChange": -0.73,
            "source": "近年加权变化 -0.73"
          },
          "year2026": {
            "year": 2026,
            "score": 59.27,
            "change": -0.73,
            "cumulativeChange": -0.73,
            "source": "近年加权变化 -0.73"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 59.27,
              "change": -0.73,
              "cumulativeChange": -0.73,
              "source": "近年加权变化 -0.73"
            },
            {
              "year": 2027,
              "score": 58.54,
              "change": -0.73,
              "cumulativeChange": -1.46,
              "source": "近年加权变化 -0.73"
            },
            {
              "year": 2028,
              "score": 57.81,
              "change": -0.73,
              "cumulativeChange": -2.19,
              "source": "近年加权变化 -0.73"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 -0.73 逐年延展",
          "confidenceNote": null
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "小一",
      "school_key": "东方半岛小学",
      "school_type": "民办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道东方半岛小学",
      "latest_year": 2025,
      "latest_score": 63.7,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 63.89,
      "predicted_change": 0.19,
      "predicted_cumulative_change": 0.19,
      "predicted_2026_score": 63.89,
      "predicted_2026_change": 0.19,
      "predicted_2026_cumulative_change": 0.19,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 63.89,
            "change": 0.19,
            "cumulativeChange": 0.19,
            "source": "近年加权变化 +0.19"
          },
          "year2026": {
            "year": 2026,
            "score": 63.89,
            "change": 0.19,
            "cumulativeChange": 0.19,
            "source": "近年加权变化 +0.19"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 63.89,
              "change": 0.19,
              "cumulativeChange": 0.19,
              "source": "近年加权变化 +0.19"
            },
            {
              "year": 2027,
              "score": 64.08,
              "change": 0.19,
              "cumulativeChange": 0.38,
              "source": "近年加权变化 +0.19"
            },
            {
              "year": 2028,
              "score": 64.27,
              "change": 0.19,
              "cumulativeChange": 0.57,
              "source": "近年加权变化 +0.19"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 +0.19 逐年延展",
          "confidenceNote": null
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "小一",
      "school_key": "东升学校",
      "school_type": "民办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道东升学校",
      "latest_year": 2025,
      "latest_score": 64.15,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 63.49,
      "predicted_change": -0.66,
      "predicted_cumulative_change": -0.66,
      "predicted_2026_score": 63.49,
      "predicted_2026_change": -0.66,
      "predicted_2026_cumulative_change": -0.66,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 63.49,
            "change": -0.66,
            "cumulativeChange": -0.66,
            "source": "近年加权变化 -0.66"
          },
          "year2026": {
            "year": 2026,
            "score": 63.49,
            "change": -0.66,
            "cumulativeChange": -0.66,
            "source": "近年加权变化 -0.66"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 63.49,
              "change": -0.66,
              "cumulativeChange": -0.66,
              "source": "近年加权变化 -0.66"
            },
            {
              "year": 2027,
              "score": 62.83,
              "change": -0.66,
              "cumulativeChange": -1.32,
              "source": "近年加权变化 -0.66"
            },
            {
              "year": 2028,
              "score": 62.17,
              "change": -0.66,
              "cumulativeChange": -1.98,
              "source": "近年加权变化 -0.66"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 -0.66 逐年延展",
          "confidenceNote": null
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "小一",
      "school_key": "科城实验学校",
      "school_type": "民办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道科城实验学校",
      "latest_year": 2025,
      "latest_score": 60,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 59.25,
      "predicted_change": -0.75,
      "predicted_cumulative_change": -0.75,
      "predicted_2026_score": 59.25,
      "predicted_2026_change": -0.75,
      "predicted_2026_cumulative_change": -0.75,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 59.25,
            "change": -0.75,
            "cumulativeChange": -0.75,
            "source": "近年加权变化 -0.75"
          },
          "year2026": {
            "year": 2026,
            "score": 59.25,
            "change": -0.75,
            "cumulativeChange": -0.75,
            "source": "近年加权变化 -0.75"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 59.25,
              "change": -0.75,
              "cumulativeChange": -0.75,
              "source": "近年加权变化 -0.75"
            },
            {
              "year": 2027,
              "score": 58.5,
              "change": -0.75,
              "cumulativeChange": -1.5,
              "source": "近年加权变化 -0.75"
            },
            {
              "year": 2028,
              "score": 57.75,
              "change": -0.75,
              "cumulativeChange": -2.25,
              "source": "近年加权变化 -0.75"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 -0.75 逐年延展；年变化超过 3 分时已截尾",
          "confidenceNote": "年变化超过 3 分时已截尾"
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "小一",
      "school_key": "龙岭学校",
      "school_type": "民办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道龙岭学校",
      "latest_year": 2025,
      "latest_score": 60.6,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 58.58,
      "predicted_change": -2.02,
      "predicted_cumulative_change": -2.02,
      "predicted_2026_score": 58.58,
      "predicted_2026_change": -2.02,
      "predicted_2026_cumulative_change": -2.02,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 58.58,
            "change": -2.02,
            "cumulativeChange": -2.02,
            "source": "近年加权变化 -2.02"
          },
          "year2026": {
            "year": 2026,
            "score": 58.58,
            "change": -2.02,
            "cumulativeChange": -2.02,
            "source": "近年加权变化 -2.02"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 58.58,
              "change": -2.02,
              "cumulativeChange": -2.02,
              "source": "近年加权变化 -2.02"
            },
            {
              "year": 2027,
              "score": 56.56,
              "change": -2.02,
              "cumulativeChange": -4.04,
              "source": "近年加权变化 -2.02"
            },
            {
              "year": 2028,
              "score": 54.54,
              "change": -2.02,
              "cumulativeChange": -6.06,
              "source": "近年加权变化 -2.02"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 -2.02 逐年延展；年变化超过 3 分时已截尾",
          "confidenceNote": "年变化超过 3 分时已截尾"
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "小一",
      "school_key": "木棉湾实验",
      "school_type": "民办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道木棉湾实验",
      "latest_year": 2025,
      "latest_score": 63.75,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 64.06,
      "predicted_change": 0.31,
      "predicted_cumulative_change": 0.31,
      "predicted_2026_score": 64.06,
      "predicted_2026_change": 0.31,
      "predicted_2026_cumulative_change": 0.31,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 64.06,
            "change": 0.31,
            "cumulativeChange": 0.31,
            "source": "近年加权变化 +0.31"
          },
          "year2026": {
            "year": 2026,
            "score": 64.06,
            "change": 0.31,
            "cumulativeChange": 0.31,
            "source": "近年加权变化 +0.31"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 64.06,
              "change": 0.31,
              "cumulativeChange": 0.31,
              "source": "近年加权变化 +0.31"
            },
            {
              "year": 2027,
              "score": 64.37,
              "change": 0.31,
              "cumulativeChange": 0.62,
              "source": "近年加权变化 +0.31"
            },
            {
              "year": 2028,
              "score": 64.68,
              "change": 0.31,
              "cumulativeChange": 0.93,
              "source": "近年加权变化 +0.31"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 +0.31 逐年延展",
          "confidenceNote": null
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "小一",
      "school_key": "启元学校",
      "school_type": "民办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道启元学校",
      "latest_year": 2025,
      "latest_score": 60,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 59.3,
      "predicted_change": -0.7,
      "predicted_cumulative_change": -0.7,
      "predicted_2026_score": 59.3,
      "predicted_2026_change": -0.7,
      "predicted_2026_cumulative_change": -0.7,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 59.3,
            "change": -0.7,
            "cumulativeChange": -0.7,
            "source": "近年加权变化 -0.7"
          },
          "year2026": {
            "year": 2026,
            "score": 59.3,
            "change": -0.7,
            "cumulativeChange": -0.7,
            "source": "近年加权变化 -0.7"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 59.3,
              "change": -0.7,
              "cumulativeChange": -0.7,
              "source": "近年加权变化 -0.7"
            },
            {
              "year": 2027,
              "score": 58.6,
              "change": -0.7,
              "cumulativeChange": -1.4,
              "source": "近年加权变化 -0.7"
            },
            {
              "year": 2028,
              "score": 57.9,
              "change": -0.7,
              "cumulativeChange": -2.1,
              "source": "近年加权变化 -0.7"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 -0.7 逐年延展；年变化超过 3 分时已截尾",
          "confidenceNote": "年变化超过 3 分时已截尾"
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "小一",
      "school_key": "智民实验学校",
      "school_type": "民办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道智民实验学校",
      "latest_year": 2025,
      "latest_score": 94.85,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 96.93,
      "predicted_change": 2.08,
      "predicted_cumulative_change": 2.08,
      "predicted_2026_score": 96.93,
      "predicted_2026_change": 2.08,
      "predicted_2026_cumulative_change": 2.08,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 96.93,
            "change": 2.08,
            "cumulativeChange": 2.08,
            "source": "近年加权变化 +2.08"
          },
          "year2026": {
            "year": 2026,
            "score": 96.93,
            "change": 2.08,
            "cumulativeChange": 2.08,
            "source": "近年加权变化 +2.08"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 96.93,
              "change": 2.08,
              "cumulativeChange": 2.08,
              "source": "近年加权变化 +2.08"
            },
            {
              "year": 2027,
              "score": 99.01,
              "change": 2.08,
              "cumulativeChange": 4.16,
              "source": "近年加权变化 +2.08"
            },
            {
              "year": 2028,
              "score": 101.09,
              "change": 2.08,
              "cumulativeChange": 6.24,
              "source": "近年加权变化 +2.08"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 +2.08 逐年延展；年变化超过 3 分时已截尾",
          "confidenceNote": "年变化超过 3 分时已截尾"
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "小一",
      "school_key": "中兴小学",
      "school_type": "民办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道中兴小学",
      "latest_year": 2025,
      "latest_score": 60,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 59.37,
      "predicted_change": -0.63,
      "predicted_cumulative_change": -0.63,
      "predicted_2026_score": 59.37,
      "predicted_2026_change": -0.63,
      "predicted_2026_cumulative_change": -0.63,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 59.37,
            "change": -0.63,
            "cumulativeChange": -0.63,
            "source": "近年加权变化 -0.63"
          },
          "year2026": {
            "year": 2026,
            "score": 59.37,
            "change": -0.63,
            "cumulativeChange": -0.63,
            "source": "近年加权变化 -0.63"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 59.37,
              "change": -0.63,
              "cumulativeChange": -0.63,
              "source": "近年加权变化 -0.63"
            },
            {
              "year": 2027,
              "score": 58.74,
              "change": -0.63,
              "cumulativeChange": -1.26,
              "source": "近年加权变化 -0.63"
            },
            {
              "year": 2028,
              "score": 58.11,
              "change": -0.63,
              "cumulativeChange": -1.89,
              "source": "近年加权变化 -0.63"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 -0.63 逐年延展",
          "confidenceNote": null
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "初一",
      "school_key": "布吉中学",
      "school_type": "公办",
      "admission_type": "录取分数线",
      "school_name": "布吉中学",
      "latest_year": 2025,
      "latest_score": 67.5,
      "forecast_horizon": 1,
      "primary_method": "公办小学整体 cohort",
      "predicted_score": 68.47,
      "predicted_change": 0.97,
      "predicted_cumulative_change": 0.97,
      "predicted_2026_score": 68.47,
      "predicted_2026_change": 0.97,
      "predicted_2026_cumulative_change": 0.97,
      "all_models": [
        {
          "method": "公办小学整体 cohort",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 68.47,
            "change": 0.97,
            "cumulativeChange": 0.97,
            "source": "布吉公办小学2020均线 91.05"
          },
          "year2026": {
            "year": 2026,
            "score": 68.47,
            "change": 0.97,
            "cumulativeChange": 0.97,
            "source": "布吉公办小学2020均线 91.05"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 68.47,
              "change": 0.97,
              "cumulativeChange": 0.97,
              "source": "布吉公办小学2020均线 91.05"
            },
            {
              "year": 2027,
              "score": 71.09,
              "change": 2.62,
              "cumulativeChange": 3.59,
              "source": "布吉公办小学2021均线 93.67"
            },
            {
              "year": 2028,
              "score": 69.18,
              "change": -1.91,
              "cumulativeChange": 1.68,
              "source": "布吉公办小学2022均线 91.76"
            }
          ],
          "basis": "公办初中2025线 67.5 - 布吉公办小学2019均线 90.08；3 年参考 布吉公办小学2020均线 91.05、布吉公办小学2021均线 93.67、布吉公办小学2022均线 91.76",
          "confidenceNote": null
        },
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 67.7,
            "change": 0.2,
            "cumulativeChange": 0.2,
            "source": "近年加权变化 +0.2"
          },
          "year2026": {
            "year": 2026,
            "score": 67.7,
            "change": 0.2,
            "cumulativeChange": 0.2,
            "source": "近年加权变化 +0.2"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 67.7,
              "change": 0.2,
              "cumulativeChange": 0.2,
              "source": "近年加权变化 +0.2"
            },
            {
              "year": 2027,
              "score": 67.9,
              "change": 0.2,
              "cumulativeChange": 0.4,
              "source": "近年加权变化 +0.2"
            },
            {
              "year": 2028,
              "score": 68.1,
              "change": 0.2,
              "cumulativeChange": 0.6,
              "source": "近年加权变化 +0.2"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 +0.2 逐年延展",
          "confidenceNote": null
        }
      ],
      "auxiliary_method": "近年趋势",
      "auxiliary_score": 67.7,
      "auxiliary_2026_score": 67.7,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "初一",
      "school_key": "可园学校",
      "school_type": "公办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道可园学校",
      "latest_year": 2025,
      "latest_score": 103.55,
      "forecast_horizon": 1,
      "primary_method": "公办小学整体 cohort",
      "predicted_score": 104.52,
      "predicted_change": 0.97,
      "predicted_cumulative_change": 0.97,
      "predicted_2026_score": 104.52,
      "predicted_2026_change": 0.97,
      "predicted_2026_cumulative_change": 0.97,
      "all_models": [
        {
          "method": "公办小学整体 cohort",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 104.52,
            "change": 0.97,
            "cumulativeChange": 0.97,
            "source": "布吉公办小学2020均线 91.05"
          },
          "year2026": {
            "year": 2026,
            "score": 104.52,
            "change": 0.97,
            "cumulativeChange": 0.97,
            "source": "布吉公办小学2020均线 91.05"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 104.52,
              "change": 0.97,
              "cumulativeChange": 0.97,
              "source": "布吉公办小学2020均线 91.05"
            },
            {
              "year": 2027,
              "score": 107.14,
              "change": 2.62,
              "cumulativeChange": 3.59,
              "source": "布吉公办小学2021均线 93.67"
            },
            {
              "year": 2028,
              "score": 105.23,
              "change": -1.91,
              "cumulativeChange": 1.68,
              "source": "布吉公办小学2022均线 91.76"
            }
          ],
          "basis": "公办初中2025线 103.55 - 布吉公办小学2019均线 90.08；3 年参考 布吉公办小学2020均线 91.05、布吉公办小学2021均线 93.67、布吉公办小学2022均线 91.76",
          "confidenceNote": null
        },
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 104.38,
            "change": 0.83,
            "cumulativeChange": 0.83,
            "source": "近年加权变化 +0.83"
          },
          "year2026": {
            "year": 2026,
            "score": 104.38,
            "change": 0.83,
            "cumulativeChange": 0.83,
            "source": "近年加权变化 +0.83"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 104.38,
              "change": 0.83,
              "cumulativeChange": 0.83,
              "source": "近年加权变化 +0.83"
            },
            {
              "year": 2027,
              "score": 105.21,
              "change": 0.83,
              "cumulativeChange": 1.66,
              "source": "近年加权变化 +0.83"
            },
            {
              "year": 2028,
              "score": 106.04,
              "change": 0.83,
              "cumulativeChange": 2.49,
              "source": "近年加权变化 +0.83"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 +0.83 逐年延展；年变化超过 3 分时已截尾",
          "confidenceNote": "年变化超过 3 分时已截尾"
        }
      ],
      "auxiliary_method": "近年趋势",
      "auxiliary_score": 104.38,
      "auxiliary_2026_score": 104.38,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "初一",
      "school_key": "龙岭初级中学公办班",
      "school_type": "公办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道龙岭初级中学公办班",
      "latest_year": 2025,
      "latest_score": 109.35,
      "forecast_horizon": 1,
      "primary_method": "公办小学整体 cohort",
      "predicted_score": 110,
      "predicted_change": 0.65,
      "predicted_cumulative_change": 0.65,
      "predicted_2026_score": 110,
      "predicted_2026_change": 0.65,
      "predicted_2026_cumulative_change": 0.65,
      "all_models": [
        {
          "method": "公办小学整体 cohort",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 110,
            "change": 0.65,
            "cumulativeChange": 0.65,
            "source": "布吉公办小学2020均线 91.05"
          },
          "year2026": {
            "year": 2026,
            "score": 110,
            "change": 0.65,
            "cumulativeChange": 0.65,
            "source": "布吉公办小学2020均线 91.05"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 110,
              "change": 0.65,
              "cumulativeChange": 0.65,
              "source": "布吉公办小学2020均线 91.05"
            },
            {
              "year": 2027,
              "score": 110,
              "change": 0,
              "cumulativeChange": 0.65,
              "source": "布吉公办小学2021均线 93.67"
            },
            {
              "year": 2028,
              "score": 110,
              "change": 0,
              "cumulativeChange": 0.65,
              "source": "布吉公办小学2022均线 91.76"
            }
          ],
          "basis": "公办初中2025线 109.35 - 布吉公办小学2019均线 90.08；3 年参考 布吉公办小学2020均线 91.05、布吉公办小学2021均线 93.67、布吉公办小学2022均线 91.76",
          "confidenceNote": null
        },
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 110,
            "change": 0.65,
            "cumulativeChange": 0.65,
            "source": "近年加权变化 +0.68"
          },
          "year2026": {
            "year": 2026,
            "score": 110,
            "change": 0.65,
            "cumulativeChange": 0.65,
            "source": "近年加权变化 +0.68"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 110,
              "change": 0.65,
              "cumulativeChange": 0.65,
              "source": "近年加权变化 +0.68"
            },
            {
              "year": 2027,
              "score": 110,
              "change": 0,
              "cumulativeChange": 0.65,
              "source": "近年加权变化 +0.68"
            },
            {
              "year": 2028,
              "score": 110,
              "change": 0,
              "cumulativeChange": 0.65,
              "source": "近年加权变化 +0.68"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 +0.68 逐年延展",
          "confidenceNote": null
        }
      ],
      "auxiliary_method": "近年趋势",
      "auxiliary_score": 110,
      "auxiliary_2026_score": 110,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "初一",
      "school_key": "木棉湾学校",
      "school_type": "公办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道木棉湾学校",
      "latest_year": 2025,
      "latest_score": 95,
      "forecast_horizon": 1,
      "primary_method": "公办小学整体 cohort",
      "predicted_score": 95.97,
      "predicted_change": 0.97,
      "predicted_cumulative_change": 0.97,
      "predicted_2026_score": 95.97,
      "predicted_2026_change": 0.97,
      "predicted_2026_cumulative_change": 0.97,
      "all_models": [
        {
          "method": "公办小学整体 cohort",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 95.97,
            "change": 0.97,
            "cumulativeChange": 0.97,
            "source": "布吉公办小学2020均线 91.05"
          },
          "year2026": {
            "year": 2026,
            "score": 95.97,
            "change": 0.97,
            "cumulativeChange": 0.97,
            "source": "布吉公办小学2020均线 91.05"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 95.97,
              "change": 0.97,
              "cumulativeChange": 0.97,
              "source": "布吉公办小学2020均线 91.05"
            },
            {
              "year": 2027,
              "score": 98.59,
              "change": 2.62,
              "cumulativeChange": 3.59,
              "source": "布吉公办小学2021均线 93.67"
            },
            {
              "year": 2028,
              "score": 96.68,
              "change": -1.91,
              "cumulativeChange": 1.68,
              "source": "布吉公办小学2022均线 91.76"
            }
          ],
          "basis": "公办初中2025线 95 - 布吉公办小学2019均线 90.08；3 年参考 布吉公办小学2020均线 91.05、布吉公办小学2021均线 93.67、布吉公办小学2022均线 91.76",
          "confidenceNote": null
        },
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 95.89,
            "change": 0.89,
            "cumulativeChange": 0.89,
            "source": "近年加权变化 +0.89"
          },
          "year2026": {
            "year": 2026,
            "score": 95.89,
            "change": 0.89,
            "cumulativeChange": 0.89,
            "source": "近年加权变化 +0.89"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 95.89,
              "change": 0.89,
              "cumulativeChange": 0.89,
              "source": "近年加权变化 +0.89"
            },
            {
              "year": 2027,
              "score": 96.78,
              "change": 0.89,
              "cumulativeChange": 1.78,
              "source": "近年加权变化 +0.89"
            },
            {
              "year": 2028,
              "score": 97.67,
              "change": 0.89,
              "cumulativeChange": 2.67,
              "source": "近年加权变化 +0.89"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 +0.89 逐年延展；年变化超过 3 分时已截尾",
          "confidenceNote": "年变化超过 3 分时已截尾"
        }
      ],
      "auxiliary_method": "近年趋势",
      "auxiliary_score": 95.89,
      "auxiliary_2026_score": 95.89,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "初一",
      "school_key": "文理学校",
      "school_type": "公办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道文理学校",
      "latest_year": 2025,
      "latest_score": 94.1,
      "forecast_horizon": 1,
      "primary_method": "公办小学整体 cohort",
      "predicted_score": 95.07,
      "predicted_change": 0.97,
      "predicted_cumulative_change": 0.97,
      "predicted_2026_score": 95.07,
      "predicted_2026_change": 0.97,
      "predicted_2026_cumulative_change": 0.97,
      "all_models": [
        {
          "method": "公办小学整体 cohort",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 95.07,
            "change": 0.97,
            "cumulativeChange": 0.97,
            "source": "布吉公办小学2020均线 91.05"
          },
          "year2026": {
            "year": 2026,
            "score": 95.07,
            "change": 0.97,
            "cumulativeChange": 0.97,
            "source": "布吉公办小学2020均线 91.05"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 95.07,
              "change": 0.97,
              "cumulativeChange": 0.97,
              "source": "布吉公办小学2020均线 91.05"
            },
            {
              "year": 2027,
              "score": 97.69,
              "change": 2.62,
              "cumulativeChange": 3.59,
              "source": "布吉公办小学2021均线 93.67"
            },
            {
              "year": 2028,
              "score": 95.78,
              "change": -1.91,
              "cumulativeChange": 1.68,
              "source": "布吉公办小学2022均线 91.76"
            }
          ],
          "basis": "公办初中2025线 94.1 - 布吉公办小学2019均线 90.08；3 年参考 布吉公办小学2020均线 91.05、布吉公办小学2021均线 93.67、布吉公办小学2022均线 91.76",
          "confidenceNote": null
        },
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 95.46,
            "change": 1.36,
            "cumulativeChange": 1.36,
            "source": "近年加权变化 +1.36"
          },
          "year2026": {
            "year": 2026,
            "score": 95.46,
            "change": 1.36,
            "cumulativeChange": 1.36,
            "source": "近年加权变化 +1.36"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 95.46,
              "change": 1.36,
              "cumulativeChange": 1.36,
              "source": "近年加权变化 +1.36"
            },
            {
              "year": 2027,
              "score": 96.82,
              "change": 1.36,
              "cumulativeChange": 2.72,
              "source": "近年加权变化 +1.36"
            },
            {
              "year": 2028,
              "score": 98.18,
              "change": 1.36,
              "cumulativeChange": 4.08,
              "source": "近年加权变化 +1.36"
            }
          ],
          "basis": "2023-2025 同校录取线变化，按 EWMA 加权变化 +1.36 逐年延展；年变化超过 3 分时已截尾",
          "confidenceNote": "年变化超过 3 分时已截尾"
        }
      ],
      "auxiliary_method": "近年趋势",
      "auxiliary_score": 95.46,
      "auxiliary_2026_score": 95.46,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "初一",
      "school_key": "贤义外国语学校",
      "school_type": "公办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道贤义外国语学校",
      "latest_year": 2025,
      "latest_score": 106.55,
      "forecast_horizon": 1,
      "primary_method": "小一到初一 cohort 加权",
      "predicted_score": 104.9,
      "predicted_change": -1.65,
      "predicted_cumulative_change": -1.65,
      "predicted_2026_score": 104.9,
      "predicted_2026_change": -1.65,
      "predicted_2026_cumulative_change": -1.65,
      "all_models": [
        {
          "method": "小一到初一 cohort 加权",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 104.9,
            "change": -1.65,
            "cumulativeChange": -1.65,
            "source": "小一2020 104.6"
          },
          "year2026": {
            "year": 2026,
            "score": 104.9,
            "change": -1.65,
            "cumulativeChange": -1.65,
            "source": "小一2020 104.6"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 104.9,
              "change": -1.65,
              "cumulativeChange": -1.65,
              "source": "小一2020 104.6"
            },
            {
              "year": 2027,
              "score": 104.45,
              "change": -0.45,
              "cumulativeChange": -2.1,
              "source": "小一2021 104.15"
            },
            {
              "year": 2028,
              "score": 104.85,
              "change": 0.4,
              "cumulativeChange": -1.7,
              "source": "小一2022 104.55"
            }
          ],
          "basis": "最新映射小一2019 105.35 -> 初一2025 106.55；有效 delta 加权均值 +0.3，样本年 2023、2024、2025；3 届有效 cohort 样本；3 年参考 小一2020 104.6、小一2021 104.15、小一2022 104.55",
          "confidenceNote": "3 届有效 cohort 样本"
        },
        {
          "method": "公办小学整体 cohort",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 107.52,
            "change": 0.97,
            "cumulativeChange": 0.97,
            "source": "布吉公办小学2020均线 91.05"
          },
          "year2026": {
            "year": 2026,
            "score": 107.52,
            "change": 0.97,
            "cumulativeChange": 0.97,
            "source": "布吉公办小学2020均线 91.05"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 107.52,
              "change": 0.97,
              "cumulativeChange": 0.97,
              "source": "布吉公办小学2020均线 91.05"
            },
            {
              "year": 2027,
              "score": 110,
              "change": 2.48,
              "cumulativeChange": 3.45,
              "source": "布吉公办小学2021均线 93.67"
            },
            {
              "year": 2028,
              "score": 108.23,
              "change": -1.77,
              "cumulativeChange": 1.68,
              "source": "布吉公办小学2022均线 91.76"
            }
          ],
          "basis": "公办初中2025线 106.55 - 布吉公办小学2019均线 90.08；3 年参考 布吉公办小学2020均线 91.05、布吉公办小学2021均线 93.67、布吉公办小学2022均线 91.76",
          "confidenceNote": null
        },
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 106.96,
            "change": 0.41,
            "cumulativeChange": 0.41,
            "source": "近年加权变化 +0.41"
          },
          "year2026": {
            "year": 2026,
            "score": 106.96,
            "change": 0.41,
            "cumulativeChange": 0.41,
            "source": "近年加权变化 +0.41"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 106.96,
              "change": 0.41,
              "cumulativeChange": 0.41,
              "source": "近年加权变化 +0.41"
            },
            {
              "year": 2027,
              "score": 107.37,
              "change": 0.41,
              "cumulativeChange": 0.82,
              "source": "近年加权变化 +0.41"
            },
            {
              "year": 2028,
              "score": 107.78,
              "change": 0.41,
              "cumulativeChange": 1.23,
              "source": "近年加权变化 +0.41"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 +0.41 逐年延展",
          "confidenceNote": null
        }
      ],
      "auxiliary_method": "公办小学整体 cohort",
      "auxiliary_score": 107.52,
      "auxiliary_2026_score": 107.52,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "初一",
      "school_key": "爱义学校",
      "school_type": "民办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道爱义学校",
      "latest_year": 2025,
      "latest_score": 61.7,
      "forecast_horizon": 1,
      "primary_method": "小一到初一 cohort",
      "predicted_score": 64,
      "predicted_change": 2.3,
      "predicted_cumulative_change": 2.3,
      "predicted_2026_score": 64,
      "predicted_2026_change": 2.3,
      "predicted_2026_cumulative_change": 2.3,
      "all_models": [
        {
          "method": "小一到初一 cohort",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 64,
            "change": 2.3,
            "cumulativeChange": 2.3,
            "source": "小一2020 64.9"
          },
          "year2026": {
            "year": 2026,
            "score": 64,
            "change": 2.3,
            "cumulativeChange": 2.3,
            "source": "小一2020 64.9"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 64,
              "change": 2.3,
              "cumulativeChange": 2.3,
              "source": "小一2020 64.9"
            },
            {
              "year": 2027,
              "score": 64.75,
              "change": 0.75,
              "cumulativeChange": 3.05,
              "source": "小一2021 65.65"
            },
            {
              "year": 2028,
              "score": 61.8,
              "change": -2.95,
              "cumulativeChange": 0.1,
              "source": "小一2022 62.7"
            }
          ],
          "basis": "最新映射小一2019 62.6 -> 初一2025 61.7；cohort delta -0.9；仅 1 届有效 cohort 样本；3 年参考 小一2020 64.9、小一2021 65.65、小一2022 62.7",
          "confidenceNote": "仅 1 届有效 cohort 样本"
        },
        {
          "method": "民办小学整体 cohort",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 66.35,
            "change": 4.65,
            "cumulativeChange": 4.65,
            "source": "布吉民办小学2020均线 69.04"
          },
          "year2026": {
            "year": 2026,
            "score": 66.35,
            "change": 4.65,
            "cumulativeChange": 4.65,
            "source": "布吉民办小学2020均线 69.04"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 66.35,
              "change": 4.65,
              "cumulativeChange": 4.65,
              "source": "布吉民办小学2020均线 69.04"
            },
            {
              "year": 2027,
              "score": 68.21,
              "change": 1.86,
              "cumulativeChange": 6.51,
              "source": "布吉民办小学2021均线 70.9"
            },
            {
              "year": 2028,
              "score": 68.1,
              "change": -0.11,
              "cumulativeChange": 6.4,
              "source": "布吉民办小学2022均线 70.8"
            }
          ],
          "basis": "民办初中2025线 61.7 - 布吉民办小学2019均线 64.39；3 年参考 布吉民办小学2020均线 69.04、布吉民办小学2021均线 70.9、布吉民办小学2022均线 70.8",
          "confidenceNote": null
        },
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 60.73,
            "change": -0.97,
            "cumulativeChange": -0.97,
            "source": "近年加权变化 -0.97"
          },
          "year2026": {
            "year": 2026,
            "score": 60.73,
            "change": -0.97,
            "cumulativeChange": -0.97,
            "source": "近年加权变化 -0.97"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 60.73,
              "change": -0.97,
              "cumulativeChange": -0.97,
              "source": "近年加权变化 -0.97"
            },
            {
              "year": 2027,
              "score": 59.76,
              "change": -0.97,
              "cumulativeChange": -1.94,
              "source": "近年加权变化 -0.97"
            },
            {
              "year": 2028,
              "score": 58.79,
              "change": -0.97,
              "cumulativeChange": -2.91,
              "source": "近年加权变化 -0.97"
            }
          ],
          "basis": "2021-2025 同校录取线变化，按 EWMA 加权变化 -0.97 逐年延展",
          "confidenceNote": null
        }
      ],
      "auxiliary_method": "民办小学整体 cohort",
      "auxiliary_score": 66.35,
      "auxiliary_2026_score": 66.35,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "初一",
      "school_key": "百合外国语学校",
      "school_type": "民办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道百合外国语学校",
      "latest_year": 2025,
      "latest_score": 106.9,
      "forecast_horizon": 1,
      "primary_method": "民办小学整体 cohort",
      "predicted_score": 110,
      "predicted_change": 3.1,
      "predicted_cumulative_change": 3.1,
      "predicted_2026_score": 110,
      "predicted_2026_change": 3.1,
      "predicted_2026_cumulative_change": 3.1,
      "all_models": [
        {
          "method": "民办小学整体 cohort",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 110,
            "change": 3.1,
            "cumulativeChange": 3.1,
            "source": "布吉民办小学2020均线 69.04"
          },
          "year2026": {
            "year": 2026,
            "score": 110,
            "change": 3.1,
            "cumulativeChange": 3.1,
            "source": "布吉民办小学2020均线 69.04"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 110,
              "change": 3.1,
              "cumulativeChange": 3.1,
              "source": "布吉民办小学2020均线 69.04"
            },
            {
              "year": 2027,
              "score": 110,
              "change": 0,
              "cumulativeChange": 3.1,
              "source": "布吉民办小学2021均线 70.9"
            },
            {
              "year": 2028,
              "score": 110,
              "change": 0,
              "cumulativeChange": 3.1,
              "source": "布吉民办小学2022均线 70.8"
            }
          ],
          "basis": "民办初中2025线 106.9 - 布吉民办小学2019均线 64.39；3 年参考 布吉民办小学2020均线 69.04、布吉民办小学2021均线 70.9、布吉民办小学2022均线 70.8",
          "confidenceNote": null
        },
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 106.57,
            "change": -0.33,
            "cumulativeChange": -0.33,
            "source": "近年加权变化 -0.33"
          },
          "year2026": {
            "year": 2026,
            "score": 106.57,
            "change": -0.33,
            "cumulativeChange": -0.33,
            "source": "近年加权变化 -0.33"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 106.57,
              "change": -0.33,
              "cumulativeChange": -0.33,
              "source": "近年加权变化 -0.33"
            },
            {
              "year": 2027,
              "score": 106.24,
              "change": -0.33,
              "cumulativeChange": -0.66,
              "source": "近年加权变化 -0.33"
            },
            {
              "year": 2028,
              "score": 105.91,
              "change": -0.33,
              "cumulativeChange": -0.99,
              "source": "近年加权变化 -0.33"
            }
          ],
          "basis": "2020-2025 同校录取线变化，按 EWMA 加权变化 -0.33 逐年延展；年变化超过 3 分时已截尾",
          "confidenceNote": "年变化超过 3 分时已截尾"
        }
      ],
      "auxiliary_method": "近年趋势",
      "auxiliary_score": 106.57,
      "auxiliary_2026_score": 106.57,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "初一",
      "school_key": "承翰学校",
      "school_type": "民办",
      "admission_type": "录取分数线",
      "school_name": "深圳实验布吉街道承翰学校",
      "latest_year": 2025,
      "latest_score": 62.85,
      "forecast_horizon": 1,
      "primary_method": "民办小学整体 cohort",
      "predicted_score": 67.5,
      "predicted_change": 4.65,
      "predicted_cumulative_change": 4.65,
      "predicted_2026_score": 67.5,
      "predicted_2026_change": 4.65,
      "predicted_2026_cumulative_change": 4.65,
      "all_models": [
        {
          "method": "民办小学整体 cohort",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 67.5,
            "change": 4.65,
            "cumulativeChange": 4.65,
            "source": "布吉民办小学2020均线 69.04"
          },
          "year2026": {
            "year": 2026,
            "score": 67.5,
            "change": 4.65,
            "cumulativeChange": 4.65,
            "source": "布吉民办小学2020均线 69.04"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 67.5,
              "change": 4.65,
              "cumulativeChange": 4.65,
              "source": "布吉民办小学2020均线 69.04"
            },
            {
              "year": 2027,
              "score": 69.36,
              "change": 1.86,
              "cumulativeChange": 6.51,
              "source": "布吉民办小学2021均线 70.9"
            },
            {
              "year": 2028,
              "score": 69.25,
              "change": -0.11,
              "cumulativeChange": 6.4,
              "source": "布吉民办小学2022均线 70.8"
            }
          ],
          "basis": "民办初中2025线 62.85 - 布吉民办小学2019均线 64.39；3 年参考 布吉民办小学2020均线 69.04、布吉民办小学2021均线 70.9、布吉民办小学2022均线 70.8",
          "confidenceNote": null
        },
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 61.77,
            "change": -1.08,
            "cumulativeChange": -1.08,
            "source": "近年加权变化 -1.08"
          },
          "year2026": {
            "year": 2026,
            "score": 61.77,
            "change": -1.08,
            "cumulativeChange": -1.08,
            "source": "近年加权变化 -1.08"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 61.77,
              "change": -1.08,
              "cumulativeChange": -1.08,
              "source": "近年加权变化 -1.08"
            },
            {
              "year": 2027,
              "score": 60.69,
              "change": -1.08,
              "cumulativeChange": -2.16,
              "source": "近年加权变化 -1.08"
            },
            {
              "year": 2028,
              "score": 59.61,
              "change": -1.08,
              "cumulativeChange": -3.24,
              "source": "近年加权变化 -1.08"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 -1.08 逐年延展；年变化超过 3 分时已截尾",
          "confidenceNote": "年变化超过 3 分时已截尾"
        }
      ],
      "auxiliary_method": "近年趋势",
      "auxiliary_score": 61.77,
      "auxiliary_2026_score": 61.77,
      "warnings": [
        "cohort delta 异常，已自动降级"
      ]
    },
    {
      "target_year": 2026,
      "stage": "初一",
      "school_key": "东升学校",
      "school_type": "民办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道东升学校",
      "latest_year": 2025,
      "latest_score": 70,
      "forecast_horizon": 1,
      "primary_method": "小一到初一 cohort 加权",
      "predicted_score": 68.14,
      "predicted_change": -1.86,
      "predicted_cumulative_change": -1.86,
      "predicted_2026_score": 68.14,
      "predicted_2026_change": -1.86,
      "predicted_2026_cumulative_change": -1.86,
      "all_models": [
        {
          "method": "小一到初一 cohort 加权",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 68.14,
            "change": -1.86,
            "cumulativeChange": -1.86,
            "source": "小一2020 65.2"
          },
          "year2026": {
            "year": 2026,
            "score": 68.14,
            "change": -1.86,
            "cumulativeChange": -1.86,
            "source": "小一2020 65.2"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 68.14,
              "change": -1.86,
              "cumulativeChange": -1.86,
              "source": "小一2020 65.2"
            },
            {
              "year": 2027,
              "score": 67.49,
              "change": -0.65,
              "cumulativeChange": -2.51,
              "source": "小一2021 64.55"
            },
            {
              "year": 2028,
              "score": 68.54,
              "change": 1.05,
              "cumulativeChange": -1.46,
              "source": "小一2022 65.6"
            }
          ],
          "basis": "最新映射小一2019 64.3 -> 初一2025 70；有效 delta 加权均值 +2.94，样本年 2023、2024、2025；3 届有效 cohort 样本；3 年参考 小一2020 65.2、小一2021 64.55、小一2022 65.6",
          "confidenceNote": "3 届有效 cohort 样本"
        },
        {
          "method": "民办小学整体 cohort",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 74.65,
            "change": 4.65,
            "cumulativeChange": 4.65,
            "source": "布吉民办小学2020均线 69.04"
          },
          "year2026": {
            "year": 2026,
            "score": 74.65,
            "change": 4.65,
            "cumulativeChange": 4.65,
            "source": "布吉民办小学2020均线 69.04"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 74.65,
              "change": 4.65,
              "cumulativeChange": 4.65,
              "source": "布吉民办小学2020均线 69.04"
            },
            {
              "year": 2027,
              "score": 76.51,
              "change": 1.86,
              "cumulativeChange": 6.51,
              "source": "布吉民办小学2021均线 70.9"
            },
            {
              "year": 2028,
              "score": 76.4,
              "change": -0.11,
              "cumulativeChange": 6.4,
              "source": "布吉民办小学2022均线 70.8"
            }
          ],
          "basis": "民办初中2025线 70 - 布吉民办小学2019均线 64.39；3 年参考 布吉民办小学2020均线 69.04、布吉民办小学2021均线 70.9、布吉民办小学2022均线 70.8",
          "confidenceNote": null
        },
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 70.2,
            "change": 0.2,
            "cumulativeChange": 0.2,
            "source": "近年加权变化 +0.2"
          },
          "year2026": {
            "year": 2026,
            "score": 70.2,
            "change": 0.2,
            "cumulativeChange": 0.2,
            "source": "近年加权变化 +0.2"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 70.2,
              "change": 0.2,
              "cumulativeChange": 0.2,
              "source": "近年加权变化 +0.2"
            },
            {
              "year": 2027,
              "score": 70.4,
              "change": 0.2,
              "cumulativeChange": 0.4,
              "source": "近年加权变化 +0.2"
            },
            {
              "year": 2028,
              "score": 70.6,
              "change": 0.2,
              "cumulativeChange": 0.6,
              "source": "近年加权变化 +0.2"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 +0.2 逐年延展；年变化超过 3 分时已截尾",
          "confidenceNote": "年变化超过 3 分时已截尾"
        }
      ],
      "auxiliary_method": "民办小学整体 cohort",
      "auxiliary_score": 74.65,
      "auxiliary_2026_score": 74.65,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "初一",
      "school_key": "科城实验学校",
      "school_type": "民办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道科城实验学校",
      "latest_year": 2025,
      "latest_score": 65.6,
      "forecast_horizon": 1,
      "primary_method": "小一到初一 cohort 加权",
      "predicted_score": 62.15,
      "predicted_change": -3.45,
      "predicted_cumulative_change": -3.45,
      "predicted_2026_score": 62.15,
      "predicted_2026_change": -3.45,
      "predicted_2026_cumulative_change": -3.45,
      "all_models": [
        {
          "method": "小一到初一 cohort 加权",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 62.15,
            "change": -3.45,
            "cumulativeChange": -3.45,
            "source": "小一2020 61.6"
          },
          "year2026": {
            "year": 2026,
            "score": 62.15,
            "change": -3.45,
            "cumulativeChange": -3.45,
            "source": "小一2020 61.6"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 62.15,
              "change": -3.45,
              "cumulativeChange": -3.45,
              "source": "小一2020 61.6"
            },
            {
              "year": 2027,
              "score": 62.2,
              "change": 0.05,
              "cumulativeChange": -3.4,
              "source": "小一2021 61.65"
            },
            {
              "year": 2028,
              "score": 63.2,
              "change": 1,
              "cumulativeChange": -2.4,
              "source": "小一2022 62.65"
            }
          ],
          "basis": "最新映射小一2019 62.5 -> 初一2025 65.6；有效 delta 加权均值 +0.55，样本年 2024、2025；2 届有效 cohort 样本；3 年参考 小一2020 61.6、小一2021 61.65、小一2022 62.65",
          "confidenceNote": "2 届有效 cohort 样本"
        },
        {
          "method": "民办小学整体 cohort",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 70.25,
            "change": 4.65,
            "cumulativeChange": 4.65,
            "source": "布吉民办小学2020均线 69.04"
          },
          "year2026": {
            "year": 2026,
            "score": 70.25,
            "change": 4.65,
            "cumulativeChange": 4.65,
            "source": "布吉民办小学2020均线 69.04"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 70.25,
              "change": 4.65,
              "cumulativeChange": 4.65,
              "source": "布吉民办小学2020均线 69.04"
            },
            {
              "year": 2027,
              "score": 72.11,
              "change": 1.86,
              "cumulativeChange": 6.51,
              "source": "布吉民办小学2021均线 70.9"
            },
            {
              "year": 2028,
              "score": 72,
              "change": -0.11,
              "cumulativeChange": 6.4,
              "source": "布吉民办小学2022均线 70.8"
            }
          ],
          "basis": "民办初中2025线 65.6 - 布吉民办小学2019均线 64.39；3 年参考 布吉民办小学2020均线 69.04、布吉民办小学2021均线 70.9、布吉民办小学2022均线 70.8",
          "confidenceNote": null
        },
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 65.36,
            "change": -0.24,
            "cumulativeChange": -0.24,
            "source": "近年加权变化 -0.24"
          },
          "year2026": {
            "year": 2026,
            "score": 65.36,
            "change": -0.24,
            "cumulativeChange": -0.24,
            "source": "近年加权变化 -0.24"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 65.36,
              "change": -0.24,
              "cumulativeChange": -0.24,
              "source": "近年加权变化 -0.24"
            },
            {
              "year": 2027,
              "score": 65.12,
              "change": -0.24,
              "cumulativeChange": -0.48,
              "source": "近年加权变化 -0.24"
            },
            {
              "year": 2028,
              "score": 64.88,
              "change": -0.24,
              "cumulativeChange": -0.72,
              "source": "近年加权变化 -0.24"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 -0.24 逐年延展",
          "confidenceNote": null
        }
      ],
      "auxiliary_method": "民办小学整体 cohort",
      "auxiliary_score": 70.25,
      "auxiliary_2026_score": 70.25,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "初一",
      "school_key": "龙岭学校",
      "school_type": "民办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道龙岭学校",
      "latest_year": 2025,
      "latest_score": 66.25,
      "forecast_horizon": 1,
      "primary_method": "小一到初一 cohort 加权",
      "predicted_score": 59.52,
      "predicted_change": -6.73,
      "predicted_cumulative_change": -6.73,
      "predicted_2026_score": 59.52,
      "predicted_2026_change": -6.73,
      "predicted_2026_cumulative_change": -6.73,
      "all_models": [
        {
          "method": "小一到初一 cohort 加权",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 59.52,
            "change": -6.73,
            "cumulativeChange": -6.73,
            "source": "小一2020 60.8"
          },
          "year2026": {
            "year": 2026,
            "score": 59.52,
            "change": -6.73,
            "cumulativeChange": -6.73,
            "source": "小一2020 60.8"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 59.52,
              "change": -6.73,
              "cumulativeChange": -6.73,
              "source": "小一2020 60.8"
            },
            {
              "year": 2027,
              "score": 61.32,
              "change": 1.8,
              "cumulativeChange": -4.93,
              "source": "小一2021 62.6"
            },
            {
              "year": 2028,
              "score": 66.02,
              "change": 4.7,
              "cumulativeChange": -0.23,
              "source": "小一2022 67.3"
            }
          ],
          "basis": "最新映射小一2019 66.05 -> 初一2025 66.25；有效 delta 加权均值 -1.28，样本年 2023、2024、2025；3 届有效 cohort 样本；3 年参考 小一2020 60.8、小一2021 62.6、小一2022 67.3",
          "confidenceNote": "3 届有效 cohort 样本"
        },
        {
          "method": "民办小学整体 cohort",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 70.9,
            "change": 4.65,
            "cumulativeChange": 4.65,
            "source": "布吉民办小学2020均线 69.04"
          },
          "year2026": {
            "year": 2026,
            "score": 70.9,
            "change": 4.65,
            "cumulativeChange": 4.65,
            "source": "布吉民办小学2020均线 69.04"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 70.9,
              "change": 4.65,
              "cumulativeChange": 4.65,
              "source": "布吉民办小学2020均线 69.04"
            },
            {
              "year": 2027,
              "score": 72.76,
              "change": 1.86,
              "cumulativeChange": 6.51,
              "source": "布吉民办小学2021均线 70.9"
            },
            {
              "year": 2028,
              "score": 72.65,
              "change": -0.11,
              "cumulativeChange": 6.4,
              "source": "布吉民办小学2022均线 70.8"
            }
          ],
          "basis": "民办初中2025线 66.25 - 布吉民办小学2019均线 64.39；3 年参考 布吉民办小学2020均线 69.04、布吉民办小学2021均线 70.9、布吉民办小学2022均线 70.8",
          "confidenceNote": null
        },
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 67.06,
            "change": 0.81,
            "cumulativeChange": 0.81,
            "source": "近年加权变化 +0.81"
          },
          "year2026": {
            "year": 2026,
            "score": 67.06,
            "change": 0.81,
            "cumulativeChange": 0.81,
            "source": "近年加权变化 +0.81"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 67.06,
              "change": 0.81,
              "cumulativeChange": 0.81,
              "source": "近年加权变化 +0.81"
            },
            {
              "year": 2027,
              "score": 67.87,
              "change": 0.81,
              "cumulativeChange": 1.62,
              "source": "近年加权变化 +0.81"
            },
            {
              "year": 2028,
              "score": 68.68,
              "change": 0.81,
              "cumulativeChange": 2.43,
              "source": "近年加权变化 +0.81"
            }
          ],
          "basis": "2023-2025 同校录取线变化，按 EWMA 加权变化 +0.81 逐年延展",
          "confidenceNote": null
        }
      ],
      "auxiliary_method": "民办小学整体 cohort",
      "auxiliary_score": 70.9,
      "auxiliary_2026_score": 70.9,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "初一",
      "school_key": "木棉湾实验",
      "school_type": "民办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道木棉湾实验",
      "latest_year": 2025,
      "latest_score": 63.85,
      "forecast_horizon": 1,
      "primary_method": "小一到初一 cohort 加权",
      "predicted_score": 62.56,
      "predicted_change": -1.29,
      "predicted_cumulative_change": -1.29,
      "predicted_2026_score": 62.56,
      "predicted_2026_change": -1.29,
      "predicted_2026_cumulative_change": -1.29,
      "all_models": [
        {
          "method": "小一到初一 cohort 加权",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 62.56,
            "change": -1.29,
            "cumulativeChange": -1.29,
            "source": "小一2020 62.4"
          },
          "year2026": {
            "year": 2026,
            "score": 62.56,
            "change": -1.29,
            "cumulativeChange": -1.29,
            "source": "小一2020 62.4"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 62.56,
              "change": -1.29,
              "cumulativeChange": -1.29,
              "source": "小一2020 62.4"
            },
            {
              "year": 2027,
              "score": 62.71,
              "change": 0.15,
              "cumulativeChange": -1.14,
              "source": "小一2021 62.55"
            },
            {
              "year": 2028,
              "score": 62.91,
              "change": 0.2,
              "cumulativeChange": -0.94,
              "source": "小一2022 62.75"
            }
          ],
          "basis": "最新映射小一2019 63.4 -> 初一2025 63.85；有效 delta 加权均值 +0.16，样本年 2023、2024、2025；3 届有效 cohort 样本；3 年参考 小一2020 62.4、小一2021 62.55、小一2022 62.75",
          "confidenceNote": "3 届有效 cohort 样本"
        },
        {
          "method": "民办小学整体 cohort",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 68.5,
            "change": 4.65,
            "cumulativeChange": 4.65,
            "source": "布吉民办小学2020均线 69.04"
          },
          "year2026": {
            "year": 2026,
            "score": 68.5,
            "change": 4.65,
            "cumulativeChange": 4.65,
            "source": "布吉民办小学2020均线 69.04"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 68.5,
              "change": 4.65,
              "cumulativeChange": 4.65,
              "source": "布吉民办小学2020均线 69.04"
            },
            {
              "year": 2027,
              "score": 70.36,
              "change": 1.86,
              "cumulativeChange": 6.51,
              "source": "布吉民办小学2021均线 70.9"
            },
            {
              "year": 2028,
              "score": 70.25,
              "change": -0.11,
              "cumulativeChange": 6.4,
              "source": "布吉民办小学2022均线 70.8"
            }
          ],
          "basis": "民办初中2025线 63.85 - 布吉民办小学2019均线 64.39；3 年参考 布吉民办小学2020均线 69.04、布吉民办小学2021均线 70.9、布吉民办小学2022均线 70.8",
          "confidenceNote": null
        },
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 62.55,
            "change": -1.3,
            "cumulativeChange": -1.3,
            "source": "近年加权变化 -1.3"
          },
          "year2026": {
            "year": 2026,
            "score": 62.55,
            "change": -1.3,
            "cumulativeChange": -1.3,
            "source": "近年加权变化 -1.3"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 62.55,
              "change": -1.3,
              "cumulativeChange": -1.3,
              "source": "近年加权变化 -1.3"
            },
            {
              "year": 2027,
              "score": 61.25,
              "change": -1.3,
              "cumulativeChange": -2.6,
              "source": "近年加权变化 -1.3"
            },
            {
              "year": 2028,
              "score": 59.95,
              "change": -1.3,
              "cumulativeChange": -3.9,
              "source": "近年加权变化 -1.3"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 -1.3 逐年延展",
          "confidenceNote": null
        }
      ],
      "auxiliary_method": "民办小学整体 cohort",
      "auxiliary_score": 68.5,
      "auxiliary_2026_score": 68.5,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "初一",
      "school_key": "智民实验学校",
      "school_type": "民办",
      "admission_type": "录取分数线",
      "school_name": "布吉街道智民实验学校",
      "latest_year": 2025,
      "latest_score": 107,
      "forecast_horizon": 1,
      "primary_method": "民办小学整体 cohort",
      "predicted_score": 110,
      "predicted_change": 3,
      "predicted_cumulative_change": 3,
      "predicted_2026_score": 110,
      "predicted_2026_change": 3,
      "predicted_2026_cumulative_change": 3,
      "all_models": [
        {
          "method": "民办小学整体 cohort",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 110,
            "change": 3,
            "cumulativeChange": 3,
            "source": "布吉民办小学2020均线 69.04"
          },
          "year2026": {
            "year": 2026,
            "score": 110,
            "change": 3,
            "cumulativeChange": 3,
            "source": "布吉民办小学2020均线 69.04"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 110,
              "change": 3,
              "cumulativeChange": 3,
              "source": "布吉民办小学2020均线 69.04"
            },
            {
              "year": 2027,
              "score": 110,
              "change": 0,
              "cumulativeChange": 3,
              "source": "布吉民办小学2021均线 70.9"
            },
            {
              "year": 2028,
              "score": 110,
              "change": 0,
              "cumulativeChange": 3,
              "source": "布吉民办小学2022均线 70.8"
            }
          ],
          "basis": "民办初中2025线 107 - 布吉民办小学2019均线 64.39；3 年参考 布吉民办小学2020均线 69.04、布吉民办小学2021均线 70.9、布吉民办小学2022均线 70.8",
          "confidenceNote": null
        },
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 108.3,
            "change": 1.3,
            "cumulativeChange": 1.3,
            "source": "近年加权变化 +1.3"
          },
          "year2026": {
            "year": 2026,
            "score": 108.3,
            "change": 1.3,
            "cumulativeChange": 1.3,
            "source": "近年加权变化 +1.3"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 108.3,
              "change": 1.3,
              "cumulativeChange": 1.3,
              "source": "近年加权变化 +1.3"
            },
            {
              "year": 2027,
              "score": 109.6,
              "change": 1.3,
              "cumulativeChange": 2.6,
              "source": "近年加权变化 +1.3"
            },
            {
              "year": 2028,
              "score": 110,
              "change": 0.4,
              "cumulativeChange": 3,
              "source": "近年加权变化 +1.3"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 +1.3 逐年延展",
          "confidenceNote": null
        }
      ],
      "auxiliary_method": "近年趋势",
      "auxiliary_score": 108.3,
      "auxiliary_2026_score": 108.3,
      "warnings": [
        "cohort delta 异常，已自动降级"
      ]
    },
    {
      "target_year": 2026,
      "stage": "初一",
      "school_key": "爱义学校",
      "school_type": "民办",
      "admission_type": "民办直升",
      "school_name": "布吉街道爱义学校",
      "latest_year": 2025,
      "latest_score": 60,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 58.7,
      "predicted_change": -1.3,
      "predicted_cumulative_change": -1.3,
      "predicted_2026_score": 58.7,
      "predicted_2026_change": -1.3,
      "predicted_2026_cumulative_change": -1.3,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 58.7,
            "change": -1.3,
            "cumulativeChange": -1.3,
            "source": "近年加权变化 -1.3"
          },
          "year2026": {
            "year": 2026,
            "score": 58.7,
            "change": -1.3,
            "cumulativeChange": -1.3,
            "source": "近年加权变化 -1.3"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 58.7,
              "change": -1.3,
              "cumulativeChange": -1.3,
              "source": "近年加权变化 -1.3"
            },
            {
              "year": 2027,
              "score": 57.4,
              "change": -1.3,
              "cumulativeChange": -2.6,
              "source": "近年加权变化 -1.3"
            },
            {
              "year": 2028,
              "score": 56.1,
              "change": -1.3,
              "cumulativeChange": -3.9,
              "source": "近年加权变化 -1.3"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 -1.3 逐年延展",
          "confidenceNote": null
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "初一",
      "school_key": "百合外国语学校",
      "school_type": "民办",
      "admission_type": "民办直升",
      "school_name": "布吉街道百合外国语学校",
      "latest_year": 2024,
      "latest_score": 60,
      "forecast_horizon": 2,
      "primary_method": "近年趋势",
      "predicted_score": 59.38,
      "predicted_change": -0.31,
      "predicted_cumulative_change": -0.62,
      "predicted_2026_score": 59.38,
      "predicted_2026_change": -0.31,
      "predicted_2026_cumulative_change": -0.62,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 59.38,
            "change": -0.31,
            "cumulativeChange": -0.62,
            "source": "近年加权变化 -0.31"
          },
          "year2026": {
            "year": 2026,
            "score": 59.38,
            "change": -0.31,
            "cumulativeChange": -0.62,
            "source": "近年加权变化 -0.31"
          },
          "allForecasts": [
            {
              "year": 2025,
              "score": 59.69,
              "change": -0.31,
              "cumulativeChange": -0.31,
              "source": "近年加权变化 -0.31"
            },
            {
              "year": 2026,
              "score": 59.38,
              "change": -0.31,
              "cumulativeChange": -0.62,
              "source": "近年加权变化 -0.31"
            },
            {
              "year": 2027,
              "score": 59.07,
              "change": -0.31,
              "cumulativeChange": -0.93,
              "source": "近年加权变化 -0.31"
            }
          ],
          "basis": "2021-2024 同校录取线变化，按 EWMA 加权变化 -0.31 逐年延展",
          "confidenceNote": null
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "初一",
      "school_key": "承翰学校",
      "school_type": "民办",
      "admission_type": "民办直升",
      "school_name": "深圳实验布吉街道承翰学校",
      "latest_year": 2025,
      "latest_score": 60,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 59.27,
      "predicted_change": -0.73,
      "predicted_cumulative_change": -0.73,
      "predicted_2026_score": 59.27,
      "predicted_2026_change": -0.73,
      "predicted_2026_cumulative_change": -0.73,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 59.27,
            "change": -0.73,
            "cumulativeChange": -0.73,
            "source": "近年加权变化 -0.73"
          },
          "year2026": {
            "year": 2026,
            "score": 59.27,
            "change": -0.73,
            "cumulativeChange": -0.73,
            "source": "近年加权变化 -0.73"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 59.27,
              "change": -0.73,
              "cumulativeChange": -0.73,
              "source": "近年加权变化 -0.73"
            },
            {
              "year": 2027,
              "score": 58.54,
              "change": -0.73,
              "cumulativeChange": -1.46,
              "source": "近年加权变化 -0.73"
            },
            {
              "year": 2028,
              "score": 57.81,
              "change": -0.73,
              "cumulativeChange": -2.19,
              "source": "近年加权变化 -0.73"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 -0.73 逐年延展",
          "confidenceNote": null
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "初一",
      "school_key": "东升学校",
      "school_type": "民办",
      "admission_type": "民办直升",
      "school_name": "布吉街道东升学校",
      "latest_year": 2025,
      "latest_score": 60,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 58.77,
      "predicted_change": -1.23,
      "predicted_cumulative_change": -1.23,
      "predicted_2026_score": 58.77,
      "predicted_2026_change": -1.23,
      "predicted_2026_cumulative_change": -1.23,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 58.77,
            "change": -1.23,
            "cumulativeChange": -1.23,
            "source": "近年加权变化 -1.23"
          },
          "year2026": {
            "year": 2026,
            "score": 58.77,
            "change": -1.23,
            "cumulativeChange": -1.23,
            "source": "近年加权变化 -1.23"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 58.77,
              "change": -1.23,
              "cumulativeChange": -1.23,
              "source": "近年加权变化 -1.23"
            },
            {
              "year": 2027,
              "score": 57.54,
              "change": -1.23,
              "cumulativeChange": -2.46,
              "source": "近年加权变化 -1.23"
            },
            {
              "year": 2028,
              "score": 56.31,
              "change": -1.23,
              "cumulativeChange": -3.69,
              "source": "近年加权变化 -1.23"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 -1.23 逐年延展；年变化超过 3 分时已截尾",
          "confidenceNote": "年变化超过 3 分时已截尾"
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "初一",
      "school_key": "科城实验学校",
      "school_type": "民办",
      "admission_type": "民办直升",
      "school_name": "布吉街道科城实验学校",
      "latest_year": 2025,
      "latest_score": 63.9,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 64.36,
      "predicted_change": 0.46,
      "predicted_cumulative_change": 0.46,
      "predicted_2026_score": 64.36,
      "predicted_2026_change": 0.46,
      "predicted_2026_cumulative_change": 0.46,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 64.36,
            "change": 0.46,
            "cumulativeChange": 0.46,
            "source": "近年加权变化 +0.46"
          },
          "year2026": {
            "year": 2026,
            "score": 64.36,
            "change": 0.46,
            "cumulativeChange": 0.46,
            "source": "近年加权变化 +0.46"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 64.36,
              "change": 0.46,
              "cumulativeChange": 0.46,
              "source": "近年加权变化 +0.46"
            },
            {
              "year": 2027,
              "score": 64.82,
              "change": 0.46,
              "cumulativeChange": 0.92,
              "source": "近年加权变化 +0.46"
            },
            {
              "year": 2028,
              "score": 65.28,
              "change": 0.46,
              "cumulativeChange": 1.38,
              "source": "近年加权变化 +0.46"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 +0.46 逐年延展",
          "confidenceNote": null
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "初一",
      "school_key": "龙岭初级中学",
      "school_type": "民办",
      "admission_type": "民办直升",
      "school_name": "布吉街道龙岭初级中学",
      "latest_year": 2025,
      "latest_score": 68.5,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 67.47,
      "predicted_change": -1.03,
      "predicted_cumulative_change": -1.03,
      "predicted_2026_score": 67.47,
      "predicted_2026_change": -1.03,
      "predicted_2026_cumulative_change": -1.03,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 67.47,
            "change": -1.03,
            "cumulativeChange": -1.03,
            "source": "近年加权变化 -1.03"
          },
          "year2026": {
            "year": 2026,
            "score": 67.47,
            "change": -1.03,
            "cumulativeChange": -1.03,
            "source": "近年加权变化 -1.03"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 67.47,
              "change": -1.03,
              "cumulativeChange": -1.03,
              "source": "近年加权变化 -1.03"
            },
            {
              "year": 2027,
              "score": 66.44,
              "change": -1.03,
              "cumulativeChange": -2.06,
              "source": "近年加权变化 -1.03"
            },
            {
              "year": 2028,
              "score": 65.41,
              "change": -1.03,
              "cumulativeChange": -3.09,
              "source": "近年加权变化 -1.03"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 -1.03 逐年延展；年变化超过 3 分时已截尾",
          "confidenceNote": "年变化超过 3 分时已截尾"
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "初一",
      "school_key": "龙岭学校",
      "school_type": "民办",
      "admission_type": "民办直升",
      "school_name": "布吉街道龙岭学校",
      "latest_year": 2025,
      "latest_score": 60,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 58.61,
      "predicted_change": -1.39,
      "predicted_cumulative_change": -1.39,
      "predicted_2026_score": 58.61,
      "predicted_2026_change": -1.39,
      "predicted_2026_cumulative_change": -1.39,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 58.61,
            "change": -1.39,
            "cumulativeChange": -1.39,
            "source": "近年加权变化 -1.39"
          },
          "year2026": {
            "year": 2026,
            "score": 58.61,
            "change": -1.39,
            "cumulativeChange": -1.39,
            "source": "近年加权变化 -1.39"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 58.61,
              "change": -1.39,
              "cumulativeChange": -1.39,
              "source": "近年加权变化 -1.39"
            },
            {
              "year": 2027,
              "score": 57.22,
              "change": -1.39,
              "cumulativeChange": -2.78,
              "source": "近年加权变化 -1.39"
            },
            {
              "year": 2028,
              "score": 55.83,
              "change": -1.39,
              "cumulativeChange": -4.17,
              "source": "近年加权变化 -1.39"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 -1.39 逐年延展；年变化超过 3 分时已截尾",
          "confidenceNote": "年变化超过 3 分时已截尾"
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "初一",
      "school_key": "木棉湾实验",
      "school_type": "民办",
      "admission_type": "民办直升",
      "school_name": "布吉街道木棉湾实验",
      "latest_year": 2025,
      "latest_score": 60,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 58.32,
      "predicted_change": -1.68,
      "predicted_cumulative_change": -1.68,
      "predicted_2026_score": 58.32,
      "predicted_2026_change": -1.68,
      "predicted_2026_cumulative_change": -1.68,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 58.32,
            "change": -1.68,
            "cumulativeChange": -1.68,
            "source": "近年加权变化 -1.68"
          },
          "year2026": {
            "year": 2026,
            "score": 58.32,
            "change": -1.68,
            "cumulativeChange": -1.68,
            "source": "近年加权变化 -1.68"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 58.32,
              "change": -1.68,
              "cumulativeChange": -1.68,
              "source": "近年加权变化 -1.68"
            },
            {
              "year": 2027,
              "score": 56.64,
              "change": -1.68,
              "cumulativeChange": -3.36,
              "source": "近年加权变化 -1.68"
            },
            {
              "year": 2028,
              "score": 54.96,
              "change": -1.68,
              "cumulativeChange": -5.04,
              "source": "近年加权变化 -1.68"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 -1.68 逐年延展；年变化超过 3 分时已截尾",
          "confidenceNote": "年变化超过 3 分时已截尾"
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    },
    {
      "target_year": 2026,
      "stage": "初一",
      "school_key": "智民实验学校",
      "school_type": "民办",
      "admission_type": "民办直升",
      "school_name": "布吉街道智民实验学校",
      "latest_year": 2025,
      "latest_score": 103.1,
      "forecast_horizon": 1,
      "primary_method": "近年趋势",
      "predicted_score": 104.6,
      "predicted_change": 1.5,
      "predicted_cumulative_change": 1.5,
      "predicted_2026_score": 104.6,
      "predicted_2026_change": 1.5,
      "predicted_2026_cumulative_change": 1.5,
      "all_models": [
        {
          "method": "近年趋势",
          "target_year": 2026,
          "target_forecast": {
            "year": 2026,
            "score": 104.6,
            "change": 1.5,
            "cumulativeChange": 1.5,
            "source": "近年加权变化 +1.5"
          },
          "year2026": {
            "year": 2026,
            "score": 104.6,
            "change": 1.5,
            "cumulativeChange": 1.5,
            "source": "近年加权变化 +1.5"
          },
          "allForecasts": [
            {
              "year": 2026,
              "score": 104.6,
              "change": 1.5,
              "cumulativeChange": 1.5,
              "source": "近年加权变化 +1.5"
            },
            {
              "year": 2027,
              "score": 106.1,
              "change": 1.5,
              "cumulativeChange": 3,
              "source": "近年加权变化 +1.5"
            },
            {
              "year": 2028,
              "score": 107.6,
              "change": 1.5,
              "cumulativeChange": 4.5,
              "source": "近年加权变化 +1.5"
            }
          ],
          "basis": "2022-2025 同校录取线变化，按 EWMA 加权变化 +1.5 逐年延展；年变化超过 3 分时已截尾",
          "confidenceNote": "年变化超过 3 分时已截尾"
        }
      ],
      "auxiliary_method": null,
      "auxiliary_score": null,
      "auxiliary_2026_score": null,
      "warnings": null
    }
  ]
};
window.PREDICTION_REPORT_DATA = window.PREDICTIONS_DATA[2026];
