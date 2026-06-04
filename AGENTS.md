# Repository Guidelines

## 项目结构与模块组织

本仓库是一个布吉片区义务教育录取分析静态工具。

- `index.html`：完整前端页面，包含样式、筛选、积分试算和录取预测逻辑。
- `scripts/build_data.py`：从 Excel/PDF 原始资料抽取并生成结构化数据。
- `data/admission-data.json`：便于检查的结构化数据。
- `data/admission-data.js`：前端读取的数据文件，暴露为 `window.ADMISSION_DATA`。
- `小一19-25.xlsx`、`初一19-25.xlsx`、`2025小一录取规则.pdf`、`2025初一录取规则.pdf`：当前数据源。
- `.codex_deps/`：本地 Python 依赖目录，不要手动修改。

## 构建、测试与本地运行

```powershell
python scripts/build_data.py
```

重新生成 `data/admission-data.json` 和 `data/admission-data.js`。

```powershell
python -m py_compile scripts/build_data.py
```

检查 Python 脚本语法。

```powershell
node -e "const fs=require('fs'); const h=fs.readFileSync('index.html','utf8'); [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].forEach(m=>new Function(m[1])); console.log('ok')"
```

检查页面内嵌 JavaScript 语法。日常使用可直接用浏览器打开 `index.html`。

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

提交信息使用简短祈使句，例如 `更新 cohort 预测逻辑`、`重新生成录取数据`。PR 需说明数据源变化、生成文件变化、执行过的验证命令；涉及 UI 时附截图或说明主要交互变化。

## 数据与配置注意事项

不要提交 Excel 锁文件 `~$*.xlsx`、`__pycache__/`、浏览器临时配置目录或无关生成物。涉及政策文本时保留来源文件名和行/页信息，方便后续追溯。
