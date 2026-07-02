# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

布吉街道义务教育录取分析 — 纯静态单页工具，用于查询和分析深圳龙岗区布吉片区的小一、初一历年录取分数线，并提供积分试算和录取预测。

## 构建和验证

```powershell
# 从本地 Excel/PDF 原始数据重新生成结构化数据文件
python scripts/build_data.py

# Python 语法检查
python -m py_compile scripts/build_data.py

# 内嵌 JS 语法检查
node -e "const fs=require('fs'); const h=fs.readFileSync('index.html','utf8'); [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].forEach(m=>new Function(m[1])); console.log('ok')"

# 导出目标年份预测备份（默认 2026，可用 --year 指定）
node scripts/export_2026_predictions.js --year 2026

# 对比 2026 年预测与实际录取分数（需先将 2026 数据录入 Excel 并运行 build_data.py）
node scripts/compare_2026_predictions.js --year 2026
```

`scripts/build_data.py` 依赖 `.codex_deps/` 中的 `openpyxl`、`xlrd`、`pypdf`。运行前需确认根目录存在 `小一17-25.xlsx`、`初一17-25.xlsx`、`2026小一录取规则.pdf`、`2026初一录取规则.pdf`（均在 `.gitignore` 中，不提交）。

## 架构与数据流

```
原始数据源 (Excel/PDF, .gitignore)
    │
    ▼  scripts/build_data.py
data/admission-data.json  ──→  data/admission-data.js (window.ADMISSION_DATA)
                                      │
                                      ▼  <script src="data/admission-data.js">
                                 index.html  (单文件: CSS + HTML + JS)
                                      │
                                      ▼
                              Cloudflare Pages (静态部署, 无构建步骤)
```

- `index.html` 是**唯一的页面文件**，包含所有 CSS、HTML、内嵌 JS。没有外部框架或构建工具。
- 前端逻辑通过 `window.ADMISSION_DATA` 读取数据，数据对象结构为 `{ meta, rules, rule_sections, cohort_model, backtest, records, schools }`。
- `data/` 目录下两个文件均由 `build_data.py` 生成，**不应手动编辑**。

## 前端关键模块（index.html 内嵌 JS）

| 模块 | 核心函数 | 说明 |
|------|---------|------|
| 状态管理 | `state` 对象 | 保存当前筛选条件（stage/year/admissionType/query）、计算器输入、选中行 |
| 数据筛选 | `visibleRecords()`, `recordsForTable()` | 按 stage/年份/搜索词/录取类型过滤 |
| 积分试算 | `calculateScore()`, `baseCategory()` | 按 2026 规则：匹配基础类别 → 逐项计算加分 → 合计封顶 10 分 → 总分封顶 110 分 |
| 初一预测 | `predictionForTarget()` | 候选模型按留一回测 MAE 升序选主模型（`model_backtests`），无回测数据时按 direct cohort → 高分民办池 → grouped → 趋势兜底 |
| 趋势预测 | `recentTrendPrediction()` | EWMA 加权年变化（衰减系数 0.8），年变化截尾 ±3 分；相邻年跳变超 20 分视为结构性断点，只用断点后历史 |
| Cohort 模型 | `cohortPrediction()`, `groupedPrimaryCohortPrediction()` | 小一-初一 6 年滞后映射；grouped 用同类型小学**配对均线变化**（只统计两年共有学校），公办/民办分离 |
| SVG 图表 | `renderAverageChart()`, `renderRankChart()`, `renderSchoolSvg()` | 手写 SVG，无图表库依赖 |
| UI 渲染 | `render()`, `renderFilters()`, `renderTable()`, `renderCalculator()` | 声明式 DOM 更新，直接操作 innerHTML |

## 预测逻辑约定

1. **积分试算**：先匹配基础类别（7 类，分值 60-100），再按产权日期、租赁备案日期、学区户籍迁入日期、社保月数计算加分，**加分合计封顶 10 分**，总分封顶 110 分。小一有"优享学区第一志愿"开关（+2.5 分，纳入封顶）。
2. **初一预测模型选择**：候选模型 = direct cohort（同校同办学性质 `小一→初一` 6 年滞后）、高分民办竞争池 cohort（最新线 ≥100 的民办）、grouped cohort（同类型小学配对均线，**不混合公/民办**）、近年趋势；**主模型按各模型留一回测 MAE 升序选择**（优先同办学性质分段，样本 ≥2 才参与），无回测数据时按上述顺序兜底。某校各届 cohort delta 均超 10 分但方向一致（≥2 届）时用该校自身中位数，不弃用。
3. **不确定度展示**：主模型有回测数据时展示首年置信区间（预测值 ± MAE × 1.5）；趋势模型遇结构性断点（相邻年跳变 >20 分）只用断点后历史并标注低置信度。
4. **预测仅供填报参考**，不表述为保证录取。
5. **修改预测逻辑需三处同步**：`index.html`、`scripts/export_2026_predictions.js`（复制了一份前端逻辑）、`scripts/build_data.py`（回测须与前端公式一致），并更新 `prediction-algorithm.md`。

## 部署

Cloudflare Pages，Framework preset: None，Build command: 留空，Build output: `/`。自定义域名和 DNS 在 Cloudflare 控制台维护。`CNAME` 文件是历史 GitHub Pages 残留，不影响当前部署。

## 编码约定

- Python: 4 空格缩进，类型提示使用 `from __future__ import annotations`
- 数据字段语义化命名：`school_key`（标准化键）、`score_value`（数值）、`cohort_model`（预测模型）
- 前端元素 ID 是稳定的，JS 逻辑直接依赖它们，不要随意修改
- 提交信息使用简短祈使句；提交前必须运行语法检查
