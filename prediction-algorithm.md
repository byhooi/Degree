# 录取预测算法说明与优化计划

> 更新日期：2026-06-19  
> 适用范围：`index.html` 前端预测逻辑、`scripts/build_data.py` 数据生成与回测逻辑、`data/admission-data.json` 结构化数据  
> 文档来源：整合 `prediction-algorithm-review.md` 与 `prediction-algorithm-feasibility.md`

## 一、当前算法概览

系统目前有 3 类预测模型。小一只使用近年趋势模型；初一优先使用小一到初一的 cohort 信号，在 cohort 信号不可用时逐级降级。

```text
初一预测：direct cohort -> grouped cohort -> recent trend
小一预测：recent trend
```

核心常量如下：

| 常量 | 当前值 | 位置 | 含义 |
|------|--------|------|------|
| `MAX_ADMISSION_SCORE` | 110 | `index.html` / `scripts/build_data.py` | 试算积分和预测线封顶值 |
| `TREND_DECAY` | 0.8 | `index.html` / `scripts/build_data.py` | 近年趋势 EWMA 衰减系数 |
| `TREND_MAX_YEARLY_CHANGE` | 3 | `index.html` / `scripts/build_data.py` | 单年趋势变化截尾值 |
| `FORECAST_YEAR_COUNT` | 3 | `index.html` | 前端展示未来预测年数 |
| `cohort lag_years` | 6 | `scripts/build_data.py` | 小一到初一 cohort 滞后年数 |

## 二、数据现状与约束

当前结构化数据覆盖 2019-2025 年：

| 学段 | 有效录取线记录 | 学校组合数 | 年份 |
|------|----------------|------------|------|
| 小一 | 168 | 25 | 2019-2025 |
| 初一 | 94 | 15 | 2019-2025 |

cohort 使用 6 年滞后映射，因此目前只能形成一届真实映射：`小一2019 -> 初一2025`。这带来三个重要约束：

- direct cohort 当前不能做真正的跨年留一回测。
- 每所学校只有 1 个有效 cohort pair，当前无法实现有实际收益的多对 delta 加权均值。
- 需要等 2026 初一实际录取线进入数据后，才会形成 `小一2020 -> 初一2026` 的第二届 pair。

## 三、模型说明与问题

### 3.1 Direct Cohort

direct cohort 是初一预测的最高优先级模型。它使用同一学校、同一办学性质的 `小一 N 年 -> 初一 N+6 年` 配对，计算：

```text
cohort_delta = 初一(N+6) - 小一(N)
预测 初一(N+7) = 小一(N+1) + cohort_delta
```

当前有效 pair 共 8 对，全部是 `小一2019 -> 初一2025`：

| 学校 | 办学性质 | 映射 | cohort_delta | projected_change |
|------|----------|------|-------------:|-----------------:|
| 爱义学校 | 民办 | 小一2019 -> 初一2025 | -2.60 | +0.60 |
| 承翰学校 | 民办 | 小一2019 -> 初一2025 | -1.65 | -0.85 |
| 贤义外国语学校 | 公办 | 小一2019 -> 初一2025 | +1.20 | -0.75 |
| 木棉湾实验 | 民办 | 小一2019 -> 初一2025 | +1.25 | -0.20 |
| 科城实验学校 | 民办 | 小一2019 -> 初一2025 | +2.20 | -1.80 |
| 东升学校 | 民办 | 小一2019 -> 初一2025 | +3.95 | -0.85 |
| 龙岭学校 | 民办 | 小一2019 -> 初一2025 | +6.25 | +0.80 |
| 智民实验学校 | 民办 | 小一2019 -> 初一2025 | +44.50 | -0.25 |

主要问题：

- 单点脆弱：每所学校只有 1 个 pair，异常年份会直接影响主预测。
- delta 恒定性假设过强：模型默认同校 cohort delta 在不同届之间稳定，但目前没有第二届数据验证。
- 智民实验学校 `+44.50` 是极端异常值，若直接用于主预测会明显误导用户。
- 当前没有 direct cohort 的可靠 MAE，不能用于模型加权融合。

当前判断：direct cohort 可继续作为候选模型，但必须增加异常保护和样本置信提示。

### 3.2 Grouped Primary Cohort

grouped cohort 是初一预测的第二优先级模型。它不区分具体小学，而是按办学性质计算布吉片区同类型小学均线：

```text
cohort_delta = 目标初中最新线 - 同类型小学滞后 6 年均线
预测下一年初一 = 同类型小学下一年均线 + cohort_delta
```

主要问题：

- 同办学性质内学校差异仍然很大，均值会抹平高分校、低分校和九年一贯制学校差异。
- 公办/民办分离是必要条件，但不是充分条件。
- 当前同样没有可靠回测，不能证明它优于趋势模型。

当前判断：grouped cohort 适合作为 direct cohort 不可用或异常时的替代参考，但分档优化应先离线验证样本量。

### 3.3 Recent Trend

recent trend 是小一唯一模型，也是初一 cohort 不可用时的兜底模型。它取最近最多 4 年逐年变化，按 EWMA 加权，并把单年变化截尾在 `±3` 分内：

```text
weighted_change = sum(clamp(change_i) * weight_i) / sum(weight_i)
预测(year+1) = latest_score + weighted_change
```

当前回测结果：

| 范围 | 样本数 | MAE | 最大绝对误差 |
|------|--------|-----|--------------|
| 全部 | 181 | 4.73 | 48.85 |
| 初一 | 63 | 5.27 | 48.85 |
| 小一 | 118 | 4.45 | 45.30 |

主要问题：

- MAE 约 5 分，在积分录取场景中偏高。
- 最大绝对误差达到 47-48 分，说明存在数据异常、学校变更、政策突变或模型完全失效样本。
- 参数扫描已将 `TREND_DECAY` 调整为 `0.8`，`TREND_MAX_YEARLY_CHANGE` 调整为 `3`，但仍需持续观察新数据表现。
- 线性外推缺少均值回归，连续上涨或下跌后不会自然收敛。

当前判断：recent trend 是目前唯一有足够样本可量化优化的模型，应优先做参数扫描和异常样本诊断。

## 四、模型融合与展示现状

当前 `modelAgreement()` 只判断模型方向是否一致，不做数值融合：

| 判定 | 条件 | 标注 |
|------|------|------|
| 一致 | 所有可用模型方向相同 | safe |
| 有分歧 | 多数模型方向相同 | watch |
| 分歧大 | 模型方向分散 | risk |

当前 UI 主要展示最高优先级模型的预测值，只展示一个辅助模型说明。这会带来一个问题：当 direct cohort 来自单一异常 pair，而 grouped cohort 和 trend 给出不同方向时，用户仍然会优先看到 direct cohort 的主预测。

后续展示策略应调整为：

- 保留优先级模型作为主预测，但异常 direct cohort 必须自动降级。
- 当模型方向分歧大，或首年预测线最大差值达到阈值时，展示所有模型预测区间。
- 暂不做加权融合，因为 direct cohort 和 grouped cohort 还没有可靠 MAE。

## 五、优化优先级

| 优先级 | 事项 | 涉及文件 | 当前判断 |
|--------|------|----------|----------|
| P0 | 趋势模型参数扫描 | `scripts/build_data.py` / `index.html` | 已实施 |
| P0 | 趋势回测大误差样本诊断 | `scripts/build_data.py` | 已实施 |
| P0 | direct cohort 异常 delta 自动降级 | `index.html` | 已实施 |
| P1 | cohort 诊断统计输出 | `scripts/build_data.py` / `data/admission-data.json` | 已实施 |
| P1 | 模型分歧时展示预测区间 | `index.html` | 已实施 |
| P2 | grouped cohort 分档实验 | `scripts/build_data.py` | 先验证样本量，不直接上线 |
| P2 | direct cohort 多对均值 | `index.html` | 等 2026 初一数据后才有实际收益 |
| P3 | 趋势模型均值回归 | `scripts/build_data.py` 离线实验 | 参数较多，避免先上线 |
| P3 | 加权模型融合 | 暂不实施 | 等 cohort 有跨年 MAE 后再评估 |

## 六、实施计划

### 第一阶段：已实施

目标：先处理已知风险，并为参数优化建立可靠诊断。

实施状态：

- 已在 `scripts/build_data.py` 增加趋势回测异常样本输出，当前阈值为 `abs_error >= 20`。
- 已增加趋势参数扫描，扫描结果显示 `TREND_DECAY = 0.8`、`TREND_MAX_YEARLY_CHANGE = 3` 为当前网格下最佳组合。
- 已同步修改 Python 和前端趋势常量，并重新生成 `data/admission-data.json`、`data/admission-data.js`。
- 已增加 cohort delta 诊断统计，当前 `abs(cohort_delta) > 10` 的异常学校为智民实验学校。
- 已在前端增加 direct cohort 异常降级。

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
   - 超阈值时不使用 direct cohort 作为主预测，自动降级到 grouped cohort 或 recent trend。
   - UI 明确说明降级原因，例如“该校 cohort delta 为 +44.50，超出正常范围，已使用替代模型预测。”

### 第二阶段：已实施

目标：让用户看到模型分歧，而不是只看到一个看似精确的预测分数。

实施状态：

- 已在 `predictionForTarget()` 中保留所有可用模型结果。
- 已在模型分歧大或首年预测差距达到阈值时展示预测区间。
- 已在计算明细中展示所有可用模型的首年预测线和依据。
- 已对 direct cohort 单 pair 和异常 delta 增加提示。

实现细节：

1. 在 `predictionForTarget()` 中保留所有可用模型的首年预测值和未来三年预测值。
2. 在 `renderCalculatorResult()` 中增加预测区间展示。
   - 当 `agreement.tone === "risk"` 时展示区间。
   - 或当多个模型首年预测线最大差值 `>= 5` 分时展示区间。
3. 在计算明细中展示所有模型的首年预测线、模型名称和依据。
4. 对 direct cohort 的单 pair 情况增加提示：“仅 1 届 cohort 样本，delta = X.XX”。

### 第三阶段：数据更新后的 cohort 成熟化

目标：等 2026 初一实际录取线进入后，重新评估 cohort 是否能成为可靠主模型。

1. 更新 `初一19-25.xlsx` 或后续数据源，纳入 2026 初一实际录取线。
2. 运行 `python scripts/build_data.py`，形成 `小一2020 -> 初一2026` 第二届 pair。
3. 比较同一学校两届 delta 的稳定性。
4. 对有两届以上 pair 的学校启用多对加权均值。
5. 增加 direct cohort 留一回测，产出 MAE。
6. 若 grouped cohort 也能形成可比较回测，再评估是否做 MAE 反比加权融合。

### 第四阶段：候选模型实验

目标：在有诊断和回测基础后，再引入更复杂模型。

1. grouped cohort 分档实验。
   - 按高分段、中分段、低分段试算均线。
   - 先检查每年每档样本量，避免只剩 1-2 所学校。
   - 与未分档 grouped cohort、recent trend 做离线对比。

2. 趋势模型均值回归实验。
   - 将片区同类型均值作为回归锚点。
   - 扫描趋势权重、回归强度和回归周期。
   - 只在明显降低 MAE 且不增加解释成本时考虑上线。

3. 加权融合实验。
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

- 试算积分和预测线仍按 110 分封顶。
- 公办和民办 cohort 不混用。
- 智民实验学校等异常 delta 学校会触发降级或明确提示。
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

## 九、后续维护建议

本文件作为预测算法主文档维护。后续若算法、参数或数据源发生变化，应同步更新：

- 当前模型优先级。
- 回测样本数与 MAE。
- cohort pair 数和异常 delta。
- 已实施和待实施计划状态。

`prediction-algorithm-review.md` 和 `prediction-algorithm-feasibility.md` 可作为历史评审记录保留；后续讨论和实现建议优先引用本文档。
