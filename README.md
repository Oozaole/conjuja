# 🇪🇸 ConjugaES — 西语变位训练器

一个专为手机设计的西语动词变位「混淆专项」练习工具——不只是填空，而是专攻「总是分不清的那几对时态」，每道题答完都能明白为什么。

## ✨ 核心功能

### 功能一：混淆专项训练
- 三大训练包：Indefinido vs Imperfecto、Presente 不规则、Subjuntivo vs Indicativo
- 答对/答错/重音警告（黄灯）三种反馈状态
- 连击计数系统，刷完自动结算

### 功能二：完整变位表速填 `v1.1`
- 选择动词 + 时态，填写 yo/tú/él/nosotros/vosotros/ellos 六格
- Tab 键 / 点击切换聚焦，全部提交后统一判断
- 支持部分提交（空格计为错误）

### 功能四：干扰项主动生成 `v1.1`
- 答错时展示**错误类型**（正字法遗漏、时态混淆、词干变音等）
- 列出 2-3 个**同类动词举例**
- 带一句话**中文规律口诀**

### 功能六：变位规律归纳卡片 `v1.1`
- 同一规律连续答对 5 次后自动弹出
- 展示规律标题、解释、示例动词、延伸动词列表
- 支持「保存规律」到剪贴板
- 每条规律每次会话只触发一次

### 通用特性
- 📱 **手机端优化**：悬浮特殊字符键盘（á é í ó ú ñ），支持光标位置插入
- 🇨🇳 **全中文界面**：例句附带中文翻译，零门槛上手
- 🔄 **纯前端**：数据存于内存，刷新即重置，无需后端

## 🛠 技术栈

| 技术 | 用途 |
|------|------|
| React | 前端框架 |
| Vite | 构建工具 |
| Tailwind CSS v4 | 样式系统 |
| Cloudflare Pages | 部署托管 |

## 📁 项目结构

```
src/
├── data/
│   ├── questions.js            # 混淆专项题库（含 v1.1 扩展字段）
│   ├── rule_cards.js           # 规律归纳卡片数据（12 条）
│   └── conjugation_tables.js   # 完整变位表数据
├── components/
│   ├── HomeScreen.jsx          # 首页（训练包选择 + 变位表入口）
│   ├── QuizScreen.jsx          # 答题核心视图
│   ├── FeedbackCard.jsx        # 答对/黄灯反馈卡片
│   ├── DistractorFeedback.jsx  # 答错干扰项反馈（功能四）
│   ├── RuleCard.jsx            # 规律归纳卡片（功能六）
│   ├── ConjugationTable.jsx    # 完整变位表（功能二）
│   └── SpecialKeyboard.jsx     # 特殊字符键盘
├── hooks/
│   └── useRuleProgress.js      # 规律计数器 Hook（功能六）
├── App.jsx                     # 主路由
├── main.jsx                    # 入口
└── index.css                   # 全局样式
scripts/
└── generate_questions.py       # 题库生成脚本（不部署）
spec/
├── ConjugaES_MVP_PRD.md        # 产品需求文档 v1.1
└── 题库扩充指南.md              # 题库扩充操作手册
```

## 🚀 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 📝 题库扩充

项目提供了 Python 脚本调用 DeepSeek API 批量生成题目：

```bash
# 配置 API Key
copy .env.example .env   # 然后编辑填入 Key

# 进入脚本目录并安装依赖
cd scripts
uv sync

# 生成混淆专项题目（先预览）
uv run python generate_questions.py questions --pack indef_vs_imp --count 20 --dry-run

# 确认无误后写入
uv run python generate_questions.py questions --pack indef_vs_imp --count 20

# 生成变位表
uv run python generate_questions.py tables --verbs "estar,poder,saber" --tense indefinido

# 回到项目根目录验证构建
cd ..
npm run build
```

> ⚠️ 生成后务必人工抽检答案正确性，特别是不规则动词变位。

详见 [题库扩充指南](spec/题库扩充指南.md)。

## 📄 License

MIT
