# 录取预测算法说明与优化计划

> 更新日期：2026-07-02  
> 适用范围：`index.html` 前端预测逻辑、`scripts/build_data.py` 数据生成与回测逻辑、`data/admission-data.json` 结构化数据  
> 文档来源：整合 `prediction-algorithm-review.md` 与 `prediction-algorithm-feasibility.md`

## 一、当前算法概览

系统目前有 4 类预测模型。小一只使用近年趋势模型；初一优先使用小一到初一的 cohort 信号。对 100 分以上的高分民办初中，额外使用“高积分择校生源池”模型，避免把优质民办简单等同于普通民办生源。

自 2026-07 起，初一主模型不再按固定优先级链选取，而是**按各模型留一回测 MAE 升序选择**（优先取同办学性质分段 MAE，样本不足 2 个时退回总体；均不足时按下方启发式顺序兜底）。当前数据下的实际效果：有同校 cohort 对的学校走 direct cohort（公办 MAE 2.67），高分民办走竞争池 cohort（MAE 4.18），其余多为 recent trend；grouped cohort 因回测最差（民办 MAE 6.17）退为辅助参考。

```text
初一预测（实际选择）：按模型留一回测 MAE 升序
初一预测（启发式兜底顺序）：direct cohort -> high-score private cohort -> grouped cohort -> recent trend
小一预测：recent trend
```

核心常量如下：

| 常量 | 当前值 | 位置 | 含义 |
|------|--------|------|------|
| `MAX_ADMISSION_SCORE` | 110 | `index.html` / `scripts/build_data.py` | 试算积分和预测线封顶值 |
| `TREND_DECAY` | 0.8 | `index.html` / `scripts/build_data.py` | 近年趋势 EWMA 衰减系数 |
| `TREND_MAX_YEARLY_CHANGE` | 3 | `index.html` / `scripts/build_data.py` | 单年趋势变化截尾值 |
| `COHORT_DELTA_WEIGHT_DECAY` | 0.75 | `scripts/build_data.py` | 多届 cohort delta 时间加权衰减系数 |
| `HIGH_SCORE_PRIVATE_JUNIOR_THRESHOLD` | 100 | `index.html` / `scripts/export_2026_predictions.js` | 高分民办初中竞争池启用阈值 |
| `HIGH_SCORE_PRIMARY_POOL_THRESHOLD` | 100 | `index.html` / `scripts/export_2026_predictions.js` | 小一高分生源池筛选阈值 |
| `MODEL_SPREAD_RANGE_THRESHOLD` | 5 | `index.html` | 多模型首年预测线极差达到该值时展示预测区间 |
| `MODEL_SPREAD_RISK_THRESHOLD` | 6 | `index.html` | 多模型首年预测线极差达到该值时标记为分歧大 |
| `TREND_STRUCTURAL_BREAK_THRESHOLD` | 20 | `index.html` / `scripts/build_data.py` | 相邻年份跳变超过该值视为结构性断点，趋势模型只用断点后历史 |
| `COHORT_CONSISTENT_OUTLIER_MIN_PAIRS` | 2 | `scripts/build_data.py` | 全部 delta 超阈值但方向一致时启用自身中位数所需的最少届数 |
| `HIGH_SCORE_POOL_MIN_COUNT` | 3 | `index.html` / `scripts/build_data.py` | 高分池阈值口径的最少学校数，不足时退回基准年前 25% |
| `MODEL_BACKTEST_MIN_SAMPLES` | 2 | `index.html` / `scripts/export_2026_predictions.js` | 模型回测 MAE 参与主模型排序所需的最少样本数 |
| `PREDICTION_INTERVAL_MAE_MULTIPLIER` | 1.5 | `index.html` / `scripts/export_2026_predictions.js` | 首年置信区间 = 预测值 ± 主模型回测 MAE × 该系数 |
| `FORECAST_YEAR_COUNT` | 3 | `index.html` | 前端展示未来预测年数 |
| `cohort lag_years` | 6 | `scripts/build_data.py` | 小一到初一 cohort 滞后年数 |

## 二、数据现状与约束

当前结构化数据覆盖 2017-2025 年：

| 学段 | 有效录取线记录 | 学校组合数 | 年份 |
|------|----------------|------------|------|
| 小一 | 197 | 24 | 2017-2025 |
| 初一 | 98 | 14 | 2017-2025 |

cohort 使用 6 年滞后映射，目前可形成三届真实映射：`小一2017 -> 初一2023`、`小一2018 -> 初一2024`、`小一2019 -> 初一2025`。这带来三个重要变化：

- direct cohort 已可做逐年留一回测。
- 有 2 届以上有效 pair 的学校已可使用多对 delta 时间加权均值。
- 仍需剔除异常 delta，避免学校变更、数据口径变化或异常年份直接污染主预测。

**结构性样本约束（重要）**：由于 cohort 使用 6 年滞后映射，2017-2025 数据**结构上只能形成 3 届真实映射**，且映射届数随年份线性增长。这意味着在约 2028 年前，cohort 模型的统计基础不会有质变，**不具备支撑跨模型加权融合的样本条件**。后续维护者无需反复评估融合可行性——这是被样本量结构性卡死的问题，须等映射届数自然增长。

## 三、模型说明与问题

### 3.1 Direct Cohort

direct cohort 是初一预测的最高优先级模型。它使用同一学校、同一办学性质的 `小一 N 年 -> 初一 N+6 年` 配对，计算：

```text
cohort_delta = 初一(N+6) - 小一(N)
预测 初一(N+7) = 小一(N+1) + cohort_delta
```

当前普通录取线有效 pair 共 19 对，覆盖 9 个同校同办学性质组合。其中东升学校、木棉湾实验、贤义外国语学校、龙岭学校、智民实验学校各有 3 届 pair，科城实验学校有 2 届 pair。

主要问题：

- 单点脆弱已缓解，但仍存在：部分学校仍只有 1 个 pair，异常年份仍可能影响主预测。
- delta 稳定性仍需观察：虽然已有三届映射，但同校样本仍偏少，不能假设 delta 长期稳定。
- 承翰学校 `-21.45` 是单届异常值，仍按剔除处理；智民实验学校 `+36.75`、`+19.45`、`+35.40` 三届同向且量级相近，属于该校系统性生源差异（高分民办），2026-07 起改用**该校自身 delta 中位数**参与预测，不再整体弃用（`delta_mode = consistent_outlier`）。
- direct cohort 留一回测样本 10 个（MAE 4.12，公办 2.67 / 民办 4.48），仍不足以支撑模型加权融合。

当前判断：direct cohort 仍是初一普通录取线的核心模型；有多届有效 pair 时使用时间加权 delta，单届异常 delta 从加权中剔除；全部 delta 超阈值但方向一致（≥2 届）的学校用自身中位数，并保留样本置信提示。

### 3.2 高分民办竞争池 Cohort

高分民办竞争池模型用于最新普通录取线达到 100 分以上的民办初中。它基于一个现实假设：优质民办初中录取的很多孩子本身是深户、有房、高积分家庭，具备读公办小学和公办初中的资格；选择民办更多是教育路径规划，而不是公办资格不足。

因此，这类学校不应只参考普通民办小学均线，而应视为“高积分择校生源池”：

```text
预测 初一(Y+step) = 民办初中最新线(Y) + 高分池配对均线变化(基准年P -> P+step)
其中 P = Y - 6，池成员由基准年 P 确定，变化只统计两年都有分数的池内学校
```

小一高分池口径**完全由基准年决定**：优先使用基准年小一录取线 `>= 100` 的学校；不足 3 所时退回基准年前 25% 的高分段学校（至少 3 所）。目标年只取池成员交集，两年口径一致，避免不同年份在“阈值口径”和“前 25% 口径”之间切换造成的失真。该模型只作用于“初一 + 民办 + 普通录取线 + 最新线 >= 100”的组合，不影响民办直升和普通低分民办。

留一回测：样本 2 个，MAE 4.18（样本极少，仅作弱排序参考）。

当前判断：高分民办竞争池修正了“民办学校 = 民办小学低分生源池”的错误假设；在按 MAE 排序下，当前它是高分民办的首选模型（4.18 < direct 民办 4.48 < trend 民办 4.86 < grouped 民办 6.17）。

### 3.3 Grouped Primary Cohort

grouped cohort 是初一预测的替代模型。它不区分具体小学，而是按办学性质计算布吉片区同类型小学的**配对均线变化**：

```text
预测 初一(Y+step) = 目标初中最新线(Y) + 同类型小学配对均线变化(基准年P -> P+step)
其中 P = Y - 6，变化只统计两年都有分数的学校
```

2026-07 前该模型使用“当年全部同类型小学均线”，学校集合逐年进出（新校、缺数）导致均线年际变化混入成分变化；现已改为配对口径。

留一回测：样本 24 个，MAE 5.30（公办 4.43 / 民办 6.17）。**数据显示 grouped cohort 并不优于趋势模型**（trend 公办 4.13 / 民办 4.86），此前“grouped 优于 trend”的假设不成立。

主要问题：

- 同办学性质内学校差异仍然很大，均值会抹平高分校、低分校和九年一贯制学校差异。
- 公办/民办分离是必要条件，但不是充分条件。

当前判断：在按 MAE 排序下，grouped cohort 通常不会被选为主模型，保留用于模型一致性交叉验证和分歧区间展示。

### 3.4 Recent Trend

recent trend 是小一唯一模型，也是初一 cohort 不可用时的兜底模型。它取最近最多 4 年逐年变化，按 EWMA 加权，并把单年变化截尾在 `±3` 分内。2026-07 起增加**结构性断点截断**：历史序列中相邻年份跳变超过 20 分（如民办摇号政策导致的暴涨暴跌）时，只用断点后的历史计算趋势，并在 UI 标注低置信度；断点后不足 2 年数据时按持平延展。

```text
weighted_change = sum(clamp(change_i) * weight_i) / sum(weight_i)   （只用断点后历史）
预测(year+1) = latest_score + weighted_change
```

当前回测结果：

| 范围 | 样本数 | MAE | 最大绝对误差 |
|------|--------|-----|--------------|
| 全部 | 216 | 4.50 | 45.30 |
| 初一 | 68 | 4.43 | 30.15 |
| 小一 | 148 | 4.53 | 45.30 |

主要问题：

- MAE 约 4.5 分，在积分录取场景中偏高。
- 最大绝对误差仍达 45 分：全部 7 个 20 分以上大误差样本均来自民办学校 2020-2023 年政策跳变年（如中兴小学、百外春蕾），断点发生在目标年当年时任何趋势模型都无法预测，截断只能改善断点后年份的预测。
- 参数扫描已饱和：`TREND_DECAY = 0.8` 与网格最优 `0.9` 的 MAE 均为 4.5，继续调参无收益。
- 线性外推缺少均值回归，连续上涨或下跌后不会自然收敛。

当前判断：recent trend 的剩余误差主要来自政策跳变而非参数选择；改进方向是断点标注与不确定度展示，不是继续调参。

## 四、模型融合与展示现状

当前 `modelAgreement()` 同时判断模型方向和首年预测线极差，不做数值融合：

| 判定 | 条件 | 标注 |
|------|------|------|
| 一致 | 所有可用模型方向相同 | safe |
| 有分歧 | 多数模型方向相同 | watch |
| 分歧大 | 模型方向分散 | risk |
| 分歧大 | 多模型首年预测线极差 `>= 6` 分 | risk |

当前 UI 主要展示最高优先级模型的预测值，同时在模型分歧或预测差距较大时展示预测区间，并在计算明细中列出所有可用模型依据。

当前展示策略：

- 主预测模型按各模型留一回测 MAE 升序选择（`model_backtests`），异常 direct cohort 仍会自动降级或改用自身中位数。
- 主模型有可用回测时，展示**首年置信区间 = 预测值 ± MAE × 1.5**，并注明回测样本数；这是对用户最直接的不确定度表达。
- 当模型方向分歧大，或首年预测线最大差值 `>= 5` 分时，展示所有模型的分歧区间。
- 若多个模型首年预测方向一致，但预测线最大差值 `>= 6` 分，也标记为“分歧大”，避免“同向但数值差距很大”的盲区。
- 计算明细中每个模型标注回测 MAE 和样本数。
- 暂不做跨模型加权融合：虽然四个模型都有回测 MAE，但 direct/high-score 样本仍只有个位数，融合权重会过拟合。

### 实现层面待改进项（代码评审发现）

以下问题在代码层面已存在，按"低风险优先"排列，可在做 P2 项时一并处理：

1. **`modelAgreement()` 让小一永远拿不到 `safe`**（`index.html:1926-1928`）。`usable.length < 2` 直接返回 `单模型/watch`，而小一只有 `recentTrendPrediction` 一个模型，导致小一预测永远显示 watch 色。"单模型"只是无法交叉验证，不等于"需警惕"。建议给单模型一个中性 tone（如 `info`），或在文案上区分"无法交叉验证"与"模型分歧"。
2. **分歧判定只看首年**（`firstForecastsForModels()`，`index.html:1915`）。只取 `forecasts[0]` 算极差，但 cohort 用对应年份真实小一数据、trend 用线性外推，第 2、3 年发散往往远大于首年，远期完全不进入 `modelAgreement`/`showRange` 判定。建议远期年份也算一次极差，或对 `forecast[1]`/`forecast[2]` 标注"远期不确定性放大"。
3. **阈值 5/6 与 agreement 不完全自洽**。`MODEL_SPREAD_RANGE_THRESHOLD=5` 触发显示区间、`MODEL_SPREAD_RISK_THRESHOLD=6` 触发标红；spread ∈ [5,6) 且方向一致时会"显示区间但 agreement 仍为 safe"。两常量仅差 1 分、区分意义不大且易混。建议合并为单阈值，或让 agreement 在 `spread >= RANGE_THRESHOLD` 时也降到 `watch`。
4. ~~**`groupedPrimaryCohortPrediction` 的 delta 是单年单点**~~ **已于 2026-07 处理**：grouped cohort 改为配对均线变化口径（不再依赖单点 delta 与漂移均线），并已输出留一回测 MAE（24 样本，5.30）。
5. ~~**异常 delta 用绝对阈值 10，未考虑分数量级**~~ **已于 2026-07 部分处理**：全部 delta 超阈值但方向一致（≥2 届）的学校改用自身中位数（`consistent_outlier`），解决了智民实验学校类系统性偏移被误杀的问题；MAD/相对阈值仍等样本量增长后再评估。

## 五、优化优先级

| 优先级 | 事项 | 涉及文件 | 当前判断 |
|--------|------|----------|----------|
| P0 | 趋势模型参数扫描 | `scripts/build_data.py` / `index.html` | 已实施 |
| P0 | 趋势回测大误差样本诊断 | `scripts/build_data.py` | 已实施 |
| P0 | direct cohort 异常 delta 自动降级 | `index.html` | 已实施 |
| P1 | cohort 诊断统计输出 | `scripts/build_data.py` / `data/admission-data.json` | 已实施 |
| P1 | 模型分歧时展示预测区间 | `index.html` | 已实施 |
| P1 | direct cohort 多对加权均值 | `scripts/build_data.py` / `index.html` | 已实施 |
| P1 | direct cohort 留一回测 | `scripts/build_data.py` / `data/admission-data.json` | 已实施 |
| P1 | 模型一致性加入首年预测极差判定 | `index.html` | 已实施 |
| P1 | 高分民办竞争池 cohort | `index.html` / `scripts/export_2026_predictions.js` | 已实施 |
| P1 | grouped / 高分池模型留一回测（`model_backtests`） | `scripts/build_data.py` / `data/admission-data.json` | 已实施（2026-07） |
| P1 | 主模型按回测 MAE 数据驱动选择 | `index.html` / `scripts/export_2026_predictions.js` | 已实施（2026-07） |
| P1 | 首年置信区间（± MAE × 1.5） | `index.html` / `scripts/export_2026_predictions.js` | 已实施（2026-07） |
| P1 | 同向大差值学校用自身 delta 中位数 | `scripts/build_data.py` / `index.html` | 已实施（2026-07） |
| P1 | grouped / 高分池均线改配对口径 | `scripts/build_data.py` / `index.html` / `scripts/export_2026_predictions.js` | 已实施（2026-07） |
| P1 | 趋势模型结构性断点截断 | `scripts/build_data.py` / `index.html` | 已实施（2026-07） |
| P2 | 趋势远期预测衰减 | `index.html` / `scripts/build_data.py` 离线校准 | **下一步优先（精度收益明确）**；上线前须做 1/2/3 年分年回测，样本不足时仅作"保守收敛展示"，不宣称提精度 |
| P2 | 预测参数配置随数据同步 | `scripts/build_data.py` / `data/admission-data.json` / `index.html` | **下一步优先（纯工程，零统计风险）**；当前 json 仅有 `parameter_scan.current/best`，无前端可读 `prediction_config`。输出显式采用参数，不直接自动套用扫描 best |
| P2 | grouped cohort 分档实验 | `scripts/build_data.py` | 先验证样本量，不直接上线 |
| P3 | 趋势模型均值回归 | `scripts/build_data.py` 离线实验 | 参数较多，避免先上线 |
| P3 | 加权模型融合 | 暂不实施 | 等 cohort 有跨年 MAE 后再评估 |

## 六、实施计划

### 第一阶段：已实施

目标：先处理已知风险，并为参数优化建立可靠诊断。

实施状态：

- 已在 `scripts/build_data.py` 增加趋势回测异常样本输出，当前阈值为 `abs_error >= 20`。
- 已增加趋势参数扫描，扫描结果显示 `TREND_DECAY = 0.8`、`TREND_MAX_YEARLY_CHANGE = 3` 为当前网格下最佳组合。
- 已同步修改 Python 和前端趋势常量，并重新生成 `data/admission-data.json`、`data/admission-data.js`。
- 已增加 cohort delta 诊断统计，当前 `abs(cohort_delta) > 10` 的异常 pair 包括承翰学校与智民实验学校。
- 已在前端增加 direct cohort 异常剔除；若无有效 pair，则自动降级。

实现细节：

1. 在 `scripts/build_data.py` 增加趋势回测异常样本输出。
   - 列出误差超过阈值的样本，例如 `abs_error > 20`。
   - 输出学校、学段、年份、实际值、预测值、误差、历史依据。
   - 人工判断是数据质量问题，还是模型在真实突变场景下失效。

2. 在 `scripts/build_data.py` 增加趋势参数扫描。
   - 扫描 `TREND_DECAY`，建议范围 `0.3-0.9`。
   - 扫描 `TREND_MAX_YEARLY_CHANGE`，建议范围 `3-10`。
   - 输出总体、小一、初一、公办、民办的 MAE 和最大绝对误差。
   - 不只按总体 MAE 选参数，避免牺牲某个学段或办学性质。

3. 在 `scripts/build_data.py` 增加 cohort 诊断统计。
   - 输出 pair 数、共同学校数、每校 pair 数。
   - 输出 delta 的均值、中位数、标准差、最小值、最大值。
   - 输出异常学校清单，例如 `abs(cohort_delta) > 10`。

4. 在 `index.html` 增加 direct cohort 异常降级。
   - 建议先用 `abs(cohort_delta) > 10` 作为保护阈值。
   - 超阈值 pair 不进入多届加权 delta；若该校没有有效 pair，则不使用 direct cohort 作为主预测，自动降级到 grouped cohort 或 recent trend。
   - UI 明确说明处理原因，例如“该校有 1 届 cohort delta 超过 10 分，已从加权 delta 中剔除。”

### 第二阶段：已实施

目标：让用户看到模型分歧，而不是只看到一个看似精确的预测分数。

实施状态：

- 已在 `predictionForTarget()` 中保留所有可用模型结果。
- 已在模型分歧大或首年预测差距达到阈值时展示预测区间。
- 已在计算明细中展示所有可用模型的首年预测线和依据。
- 已对 direct cohort 单 pair、多 pair 加权和异常 delta 增加提示。
- 已对 100 分以上高分民办初中增加高积分择校生源池模型，避免只按普通民办小学均线估计。

实现细节：

1. 在 `predictionForTarget()` 中保留所有可用模型的首年预测值和未来三年预测值。
2. 在 `renderCalculatorResult()` 中增加预测区间展示。
   - 当 `agreement.tone === "risk"` 时展示区间。
   - 或当多个模型首年预测线最大差值 `>= 5` 分时展示区间。
3. 在计算明细中展示所有模型的首年预测线、模型名称和依据。
4. 对 direct cohort 的样本情况增加提示：“仅 1 届有效 cohort 样本”或“X 届有效 cohort 样本”。

### 第三阶段：已实施

目标：利用 2017-2025 更新数据，重新评估 cohort 是否能成为更可靠的初一普通线主模型。

实施状态：

- 已更新数据源为 `小一17-25.xlsx`、`初一17-25.xlsx`。
- 已形成 19 个 direct cohort pair，覆盖 9 个同校同办学性质组合。
- 已对有两届以上有效 pair 的学校启用时间加权 delta，当前 `COHORT_DELTA_WEIGHT_DECAY = 0.75`。
- 已将 `abs(cohort_delta) > 10` 的 pair 从加权 delta 中剔除。
- 已增加 direct cohort 逐年留一回测（含同向大差值中位数路径后样本数 10，MAE 4.12，最大绝对误差 9.20）。
- 暂不做 MAE 反比加权融合，direct cohort 与高分池回测样本仍是个位数。

### 第四阶段：2026-07 算法修订（已实施）

目标：用数据驱动的模型选择取代固定优先级，修复已知统计缺陷，并给用户直接的不确定度表达。

实施内容与回测结果：

1. **四个模型全部纳入留一回测**，结果写入 `cohort_model.model_backtests`：

   | 模型 | 样本数 | MAE | 分段 MAE |
   |------|--------|-----|----------|
   | direct cohort | 10 | 4.12 | 公办 2.67 / 民办 4.48 |
   | 高分民办竞争池 | 2 | 4.18 | 民办 4.18 |
   | grouped cohort | 24 | 5.30 | 公办 4.43 / 民办 6.17 |
   | recent trend | 216 | 4.50 | 公办 4.13 / 民办 4.86 |

2. **主模型按 MAE 升序选择**（优先同办学性质分段，样本 `>= 2` 才参与），取代固定优先级链。数据显示 grouped cohort 是最差模型，已自然退为辅助参考。
3. **同向大差值学校改用自身中位数**：智民实验学校三届 delta（+36.75/+19.45/+35.40）同向且量级相近，属系统性生源差异，不再整体弃用（新增 `delta_mode = consistent_outlier`）。承翰学校单届异常仍剔除。
4. **grouped / 高分池均线改配对口径**：只统计两年共有学校的均值变化，池成员由基准年固定，消除学校集合逐年进出造成的成分漂移。
5. **趋势模型结构性断点截断**：相邻年跳变超过 20 分只用断点后历史并标注低置信度；大误差样本确认全部来自民办政策跳变年。
6. **首年置信区间**：预测值 ± 主模型 MAE × 1.5，随回测数据自动加宽/收窄；导出脚本同步输出 `predicted_interval`。

### 第五阶段：候选模型实验

目标：在有诊断和回测基础后，再引入更复杂模型。

1. 模型一致性的数值极差判定。
   - 已实施。
   - 在 `modelAgreement()` 中先计算所有可用模型的首年预测线极差。
   - 若极差 `>= 6` 分，即使所有模型方向同为上涨或下降，也不返回“一致”。
   - 极差 `>= 5` 分时展示预测区间；极差 `>= 6` 分时标记为“分歧大”。
   - UI 文案说明“模型首年预测差距较大”，不暗示某个模型必然正确。

2. 趋势远期预测衰减实验。
   - 当前 recent trend 将同一个 `weightedChange` 逐年延展到未来三年，虽然单年变化已经截尾，但连续上涨或下跌时仍可能累计过度外推。
   - 可实验多步衰减：第 1 年使用完整加权变化，第 2 年、第 3 年分别乘以 `gamma`、`gamma^2`，例如先把 `gamma = 0.6` 作为候选值。
   - 该机制只适合用于 recent trend 的远期展示，不应影响 direct cohort 或 grouped cohort，因为 cohort 使用的是对应年份的小一真实数据或均线。
   - 上线前应扩展回测，至少比较 1 年、2 年、3 年预测误差；若没有足够远期回测样本，应在文案中定位为“保守收敛展示”，而不是“精度提升”。

3. 预测参数配置随数据同步。
   - `scripts/build_data.py` 已输出 `backtest.parameter_scan.best`，但前端仍保留本地硬编码常量，后续容易出现数据侧最优参数与前端实际参数不一致。
   - 建议在 `data/admission-data.json` 的 `meta` 或独立 `prediction_config` 中输出“当前采用参数”，例如 `trend_decay`、`trend_max_yearly_change`、`trend_forecast_decay`、`model_spread_risk_threshold`。
   - 前端优先读取“当前采用参数”，缺失时再回退到本地默认值。
   - 不建议前端直接自动使用 `parameter_scan.best`，因为小样本年度更新可能导致参数过拟合和行为漂移；是否采用 best 应由生成脚本或人工评审明确决定。

4. grouped cohort 分档实验。
   - 按高分段、中分段、低分段试算均线。
   - 先检查每年每档样本量，避免只剩 1-2 所学校。
   - 与未分档 grouped cohort、recent trend 做离线对比。

5. 趋势模型均值回归实验。
   - 将片区同类型均值作为回归锚点。
   - 扫描趋势权重、回归强度和回归周期。
   - 只在明显降低 MAE 且不增加解释成本时考虑上线。

6. 加权融合实验。
   - 仅在 direct cohort、grouped cohort、recent trend 都有可比较回测 MAE 后考虑。
   - 不把融合结果包装成确定答案，仍需展示区间和风险提示。

## 七、验收与测试要求

算法相关改动完成后，至少执行：

```powershell
python scripts/build_data.py
python -m py_compile scripts/build_data.py
node -e "const fs=require('fs'); const h=fs.readFileSync('index.html','utf8'); [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].forEach(m=>new Function(m[1])); console.log('ok')"
```

人工验证重点：

- 试算积分和预测线仍按 60-110 分区间处理。
- 公办和民办 cohort 不混用。
- 承翰学校、智民实验学校等异常 delta 学校会触发剔除、降级或明确提示。
- 模型分歧时能看到预测区间。
- 页面文案仍明确说明预测仅作填报参考，不保证录取。

## 八、风险边界

预测模型不能消除以下不确定性：

- 政策规则或学区边界调整。
- 新建校、扩招、缩招导致的供需变化。
- 学校改名、合并、办学性质变化造成的历史记录不可比。
- 个别年份录取线异常跳变。
- cohort 样本不足导致的模型不稳定。

因此，算法展示应坚持两个原则：

- 不把预测表述为保证录取。
- 当样本不足、模型分歧或异常值存在时，优先展示不确定性，而不是给出单一精确结论。

## 九、预测备份与实绩验证

### 9.1 预测快照

每年新数据入库前，运行以下命令备份当年的模型预测：

```powershell
node scripts/export_2026_predictions.js --year 2026
```

脚本会**完整复制** `index.html` 中的预测逻辑（direct cohort / high-score private cohort / grouped cohort / trend EWMA），对所有学校组合生成指定年份预测，输出到 `data/predictions-<year>.json` 和 `data/predictions-<year>.js`。未传 `--year` 时默认导出 2026 年。

文件结构：
- `meta` — 生成时间、数据快照、采用的预测常量
- `summary` — 预测方法分布统计
- `predictions[]` — 每个学校组合的预测，包含 `predicted_score`、`predicted_interval`（按主模型回测 MAE × 1.5）、`forecast_horizon`、`primary_method`、`primary_model_key`、`primary_backtest_mae`、**所有模型**的完整预测（含未来三年、各自回测 MAE）和依据

`2026.html` 会读取 `data/predictions-2026.js`，用于展示 2026 年预测清单和分数分布。

### 9.2 实绩对比

当年实际录取分数录入后（更新 Excel → `python scripts/build_data.py`），运行：

```powershell
node scripts/compare_2026_predictions.js --year 2026
```

脚本会：
- 从 `admission-data.json` 提取当年实际录取线
- 与 `predictions-<year>.json` 逐校对比
- 输出终端摘要：总体 MAE/RMSE、误差分布、偏差方向、按学段/方法分组指标、各模型独立 MAE、最大误差 TOP 5
- 当实际数据已存在时输出 `data/comparison-<year>.json` 完整对比数据（含每个模型在各校的独立误差）

此举是验证预测精度的唯一客观方式，也是后续参数调整的依据。

若 `admission-data.json` 中尚无目标年份实际数据，对比脚本只给出提示，不生成占位 `comparison` 文件，避免把 `actual = null` 的文件误当作实绩验证结果。

### 9.3 年度流程

```text
当前年份数据出炉
    │
    ▼
1. 更新 Excel 数据源
    │
    ▼
2. python scripts/build_data.py          ← 重新生成 admission-data.json
    │
    ▼
3a. node scripts/compare_2026_predictions.js --year 2026   ← 对比去年预测 vs 今年实际
    │
    ▼
3b. node scripts/export_2026_predictions.js --year 2027    ← 备份今年新预测
    │
    ▼
4. 根据对比结果评估是否需要调整参数/模型
```

## 十、后续维护建议

本文件作为预测算法主文档维护。后续若算法、参数或数据源发生变化，应同步更新：

- 当前模型优先级。
- 回测样本数与 MAE。
- cohort pair 数和异常 delta。
- 已实施和待实施计划状态。
- 预测备份与对比结果摘要。

`prediction-algorithm-review.md` 和 `prediction-algorithm-feasibility.md` 可作为历史评审记录保留；后续讨论和实现建议优先引用本文档。
