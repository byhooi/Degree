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
```

`scripts/build_data.py` 依赖 `.codex_deps/` 中的 `openpyxl`、`xlrd`、`pypdf`。运行前需确认根目录存在 `小一19-25.xlsx`、`初一19-25.xlsx`、`2026小一录取规则.pdf`、`2026初一录取规则.pdf`（均在 `.gitignore` 中，不提交）。

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
| 初一预测 | `predictionForTarget()` | 优先使用 cohort 模型（同校小一滞后 6 年映射），其次 grouped primary cohort，最后兜底趋势预测 |
| 趋势预测 | `recentTrendPrediction()` | EWMA 加权年变化（衰减系数 0.65），年变化截尾 ±5 分 |
| Cohort 模型 | `cohortPrediction()`, `groupedPrimaryCohortPrediction()` | 小一-初一 6 年滞后映射；无映射表时公办/民办分离使用各自均线 |
| SVG 图表 | `renderAverageChart()`, `renderRankChart()`, `renderSchoolSvg()` | 手写 SVG，无图表库依赖 |
| UI 渲染 | `render()`, `renderFilters()`, `renderTable()`, `renderCalculator()` | 声明式 DOM 更新，直接操作 innerHTML |

## 预测逻辑约定

1. **积分试算**：先匹配基础类别（7 类，分值 60-100），再按产权日期、租赁备案日期、学区户籍迁入日期、社保月数计算加分，**加分合计封顶 10 分**，总分封顶 110 分。小一有"优享学区第一志愿"开关（+2.5 分，纳入封顶）。
2. **初一预测优先级**：
   - 优先：同校同办学性质 `小一→初一` 6 年 cohort
   - 次级：无映射表时，公办初中用布吉公办小学均线，民办初中用民办小学均线，**不混合公/民办**
   - 兜底：初中自身近年趋势（仅辅助参考）
3. **预测仅供填报参考**，不表述为保证录取。

## 部署

Cloudflare Pages，Framework preset: None，Build command: 留空，Build output: `/`。自定义域名和 DNS 在 Cloudflare 控制台维护。`CNAME` 文件是历史 GitHub Pages 残留，不影响当前部署。

## 编码约定

- Python: 4 空格缩进，类型提示使用 `from __future__ import annotations`
- 数据字段语义化命名：`school_key`（标准化键）、`score_value`（数值）、`cohort_model`（预测模型）
- 前端元素 ID 是稳定的，JS 逻辑直接依赖它们，不要随意修改
- 提交信息使用简短祈使句；提交前必须运行语法检查
