# Repository Guidelines

## 项目结构与模块组织

本仓库是一个布吉片区义务教育录取分析静态工具。

- `index.html`：完整前端页面，包含样式、筛选、积分试算和录取预测逻辑。
- `scripts/build_data.py`：从 Excel/PDF 原始资料抽取并生成结构化数据。
- `data/admission-data.json`：便于检查的结构化数据。
- `data/admission-data.js`：前端读取的数据文件，暴露为 `window.ADMISSION_DATA`。
- `小一19-25.xlsx`、`初一19-25.xlsx`、`2025小一录取规则.pdf`、`2025初一录取规则.pdf`：本地原始数据源，已被 `.gitignore` 排除，不提交到仓库。
- `CNAME`：历史 GitHub Pages 自定义域名配置。当前生产部署已迁移到 Cloudflare Pages，Cloudflare Pages 不依赖该文件。
- `.codex_deps/`：本地 Python 依赖目录，不要手动修改。

## 构建、测试与本地运行

```powershell
python scripts/build_data.py
```

使用本地原始 Excel/PDF 数据源重新生成 `data/admission-data.json` 和 `data/admission-data.js`。运行前需确认工作区根目录存在 `小一19-25.xlsx`、`初一19-25.xlsx`、`2025小一录取规则.pdf`、`2025初一录取规则.pdf`。

```powershell
python -m py_compile scripts/build_data.py
```

检查 Python 脚本语法。

```powershell
node -e "const fs=require('fs'); const h=fs.readFileSync('index.html','utf8'); [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].forEach(m=>new Function(m[1])); console.log('ok')"
```

检查页面内嵌 JavaScript 语法。日常使用可直接用浏览器打开 `index.html`。

## 部署与发布

当前项目部署在 Cloudflare Pages，不再以 GitHub Pages 作为生产发布方式。本项目是纯静态站点，Cloudflare Pages 配置应保持无构建命令，发布目录为仓库根目录 `/`。

更新 `index.html`、`data/admission-data.json`、`data/admission-data.js` 或文档后，提交并推送到 Cloudflare Pages 控制台绑定的生产分支，由 Cloudflare Pages 自动发布。自定义域名、DNS、重定向和缓存策略在 Cloudflare Pages 控制台维护，不通过仓库根目录的 `CNAME` 文件配置。

## 编码风格与命名约定

Python 使用 4 空格缩进，函数保持小而明确。数据字段使用语义化命名，例如 `school_key`、`score_value`、`cohort_model`。前端元素 ID 需要稳定，因为页面逻辑直接依赖这些 ID。

## 预测逻辑约定

积分试算按 2025 规则执行，基础分加各项加分，加分合计封顶 10 分，试算总分和预测线均封顶 110 分。

初一预测优先级如下：

1. 同校同办学性质 `小一 -> 初一` 6 年 cohort。
2. 无映射表时，公办初中使用布吉公办小学均线，民办初中使用民办小学均线。
3. 初中自身近年趋势只作辅助参考；小学 cohort 数据缺失时才兜底使用。

预测仅用于填报参考，不得表述为保证录取。

## 测试要求

改动数据源后必须运行 `python scripts/build_data.py`。提交前至少运行 Python 语法检查和前端脚本语法检查，并手动验证积分封顶、公办/民办分离和预测说明是否正确。

## 提交与 PR 规范

提交信息使用简短祈使句，例如 `更新 cohort 预测逻辑`、`重新生成录取数据`。PR 需说明数据源变化、生成文件变化、执行过的验证命令；涉及 UI 或 Cloudflare Pages 发布配置时附截图或说明主要交互、部署影响。

## 数据与配置注意事项

不要提交原始 Excel/PDF 数据源、Excel 锁文件 `~$*.xlsx`、`__pycache__/`、浏览器临时配置目录或无关生成物。涉及政策文本时保留来源文件名和行/页信息，方便后续追溯。
