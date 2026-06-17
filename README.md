# 布吉街道义务教育录取分析

## 使用

直接打开 `index.html`，即可查看布吉街道/布吉片区的小一、初一历年录取线分析。

## 线上部署

项目已从 GitHub Pages 迁移到 Cloudflare Pages。当前站点是纯静态页面，不需要安装依赖或执行构建命令；Cloudflare Pages 直接发布仓库根目录即可。

推荐 Cloudflare Pages 配置：

- Framework preset：`None` 或静态 HTML
- Build command：留空
- Build output directory：`/`
- Production branch：以 Cloudflare Pages 控制台当前绑定为准

页面资源均使用相对路径，例如 `data/admission-data.js`，适合在 Cloudflare Pages 的自定义域名或 `*.pages.dev` 域名下发布。自定义域名、DNS 和重定向规则在 Cloudflare Pages 控制台维护；仓库根目录的 `CNAME` 文件仅为历史 GitHub Pages 配置，不参与 Cloudflare Pages 发布配置。

## 更新数据

手动调整本地 Excel 或 PDF 数据源后，在当前目录运行：

```powershell
python scripts/build_data.py
```

脚本会重新生成：

- `data/admission-data.json`
- `data/admission-data.js`

`index.html` 会自动读取最新生成的数据文件。

运行前需确认项目根目录存在 `小一19-25.xlsx`、`初一19-25.xlsx`、`2026小一录取规则.pdf`、`2026初一录取规则.pdf`。这些原始数据源已被 `.gitignore` 排除，不提交到仓库。

## 当前范围

- 学段：小一、初一
- 区域：布吉街道、布吉片区
- 年份：2019-2025
- 数据源：本地 `小一19-25.xlsx`、`初一19-25.xlsx`、`2026小一录取规则.pdf`、`2026初一录取规则.pdf`
- 内容：录取分数线、初一民办直升分数线、2026 录取规则摘要与布吉相关 PDF 原文片段

## 积分试算与预测口径

- 积分试算按 2026 规则：先匹配基础类别，再按产权、租赁备案、学区户籍、社保月份等计算加分，加分合计按 10 分封顶。
- 小一支持“优享学区第一志愿”加分开关，当前按 2.5 分纳入加分封顶。
- 录取预测先比较试算积分与目标学校最新录取线。
- 初一预测优先使用“同校同办学性质小一录取线滞后 6 年映射初一录取线”的 cohort 模型，例如 `小一2019 -> 初一2025`。
- 无初中到小学映射表时，公办初中使用布吉公办小学均线作为 cohort 主参考，民办初中使用民办小学均线，不混合公办和民办。
- 初中自身近年录取线趋势只作为辅助惯性参考；只有小学 cohort 信号缺失时才兜底使用。
- 试算积分和预测录取线均按 110 分封顶。
- 预测只作为填报参考，不代表实际录取结果。
