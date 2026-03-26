# 🇪🇸 ConjugaES · 西语变位训练器 MVP 功能需求文档 v1.1

| 项目 | 内容 |
| :--- | :--- |
| **产品形态** | H5 单页应用（手机浏览器 / 微信内直接打开） |
| **核心功能** | 西语动词变位混淆专项训练 + 悬浮特殊字符键盘 + 三大差异化功能 |
| **目标用户** | 西语专业学生 / DELE 备考党 / 西语自学者 |
| **开发周期** | 2 个周末（原有功能）+ 3 个周末（新增三大功能） |
| **部署方式** | Cloudflare Pages 免费托管（大陆访问速度优于 Vercel/Netlify） |
| **文档版本** | v1.1 · 在 v1.0 基础上新增功能二、功能四、功能六 |
| **版本说明** | 本文档在原版 v1.0 基础上合并了三大差异化功能。原有章节（第一至七章）内容保持不变；新增内容统一用「NEW」标签标注，插入对应章节末尾或作为独立新章节（第八至十章）。 |

---

## 第一章 产品概述

### 1.1 一句话定位
一个专为手机设计的西语动词变位「混淆专项」练习工具——不只是填空，而是专攻「总是分不清的那几对时态」，每道题答完都能明白为什么。

### 1.2 解决的核心问题
* **针对现有工具（如 Linguno）在手机端输入特殊字符（á é ñ）极度痛苦的问题**。
* **解决答错后不解释"为什么用这个时态"的问题**。
* **消除全英文界面对中国学习者造成的额外认知消耗**。

**对应的产品解法：**
* **悬浮特殊字符键盘**：点一下插入 á/é/ñ，提升手机端输入体验。
* **中文规律口诀**：每题答完给出「一句话中文规律口诀」，并显示典型错误分析。
* **全中文界面**：句子附带中文翻译，零门槛上手。

### 1.3 不做什么（MVP 边界）
以下功能在 MVP 阶段暂不实现，待验证需求后再考虑：
* 用户注册 / 登录 / 账号系统。
* 学习进度保存（刷新页面数据重置）。
* SRS 间隔重复算法。
* 后端 API 和数据库。
* 付费功能。
* 小程序（首选 H5 验证）。

---

## 第二章 功能需求详细说明

### 2.1 页面结构总览
整个应用采用单页架构，通过两种「视图状态」切换：
1. **首页 / 训练包选择**：进入页面时展示训练包卡片。
2. **答题视图**：选择包后进入，包含题目、输入框及反馈。

### 2.2 视图一：首页（训练包选择）
* **训练包卡片规格**：提供三个不同难度和主题的训练包（Indefinido vs Imperfecto、Presente 不规则、Subjuntivo vs Indicativo）。
* **数据存储**：本次会话的练习总数和最高连击数仅存于内存，刷新即重置。

### 2.3 视图二：答题视图
* **布局**：顶部显示返回按钮、题目进度及进度条。
* **题目展示**：显示包含挖空的西语例句及其中文翻译，提供时态提示和目标人称。
* **反馈机制**：
    * **答对**：显示绿色反馈、口诀及当前连击数。
    * **答错**：显示红色反馈、正确答案对比及错误类型解释。
    * **重音警告（黄灯）**：拼写正确但缺少重音时，给予提醒且不计入错误。

### 2.4 【NEW】新增：三大差异化功能入口（v1.1）

在原有「混淆专项训练」基础上，新增三个差异化功能模块，通过以下入口进入：

| 入口位置 | 对应功能 | 触发方式 |
| :--- | :--- | :--- |
| 首页训练包卡片下方 | 功能二：完整变位表速填 | 点击「完整变位表 →」按钮 |
| 答题视图：答错后反馈卡片 | 功能四：干扰项主动生成 | 答错时自动展示，无需额外操作 |
| 答题视图：连续答对后自动弹出 | 功能六：变位规律归纳卡片 | 同一规律连续答对 5 次后自动触发 |

**设计原则**：三个功能形成学习闭环：完整变位表（系统训练）→ 干扰项解释（错误分析）→ 规律卡片（规律内化）。功能四和功能六无需用户主动操作，均在答题流程中自然触发。

---

## 第三章 关键组件详细规格

### 3.1 核心组件要求
* **顶部进度条**：高度 6px，使用训练包主题色，带平滑过渡动画。
* **题目卡片**：16px 圆角白色背景，西语例句 20px 粗体。
* **输入框**：52px 高度，聚焦时显示主题色边框，需禁用自动更正和首字母大写。
* **特殊字符悬浮键盘**：固定在系统键盘顶部，点击按钮需将字符插入光标当前位置（非末尾追加）。
* **键盘高度适配**：监听 `visualViewport` 变化，动态计算悬浮键盘位置，确保不遮挡输入框。

### 3.2 结果反馈与动画
* **反馈卡片**：从底部滑入，包含图标动画。
* **连击计数器**：连续答对时增加，答错清零；连击数达到阈值时触发视觉抖动或特效。

### 3.3 【NEW】新增组件规格（v1.1）

**完整变位表格组件（功能二）**

| 属性 | 规格 |
| :--- | :--- |
| 格子数量 | 6 个输入格，对应 yo/tú/él/nosotros/vosotros/ellos |
| 聚焦切换 | Tab 键 / 点击切换，Shift+Tab 回退 |
| 判断时机 | 全部提交后统一判断，不做离格实时判断（防止用户边填边参考答案） |
| 对错颜色 | ✅ 绿色背景 #F0FFF4 \| ⚠️ 橙色背景 #FFFBF0 \| ❌ 红色背景 #FFF5F5 |
| 人称标签宽度 | 左侧固定 90px，右侧输入框占剩余宽度 |
| 允许部分提交 | 是，空格计为错误，不强制全填才能提交 |

**干扰项反馈卡片（功能四）**

| 属性 | 规格 |
| :--- | :--- |
| 触发条件 | 用户提交答案为 error 状态时自动展示，替换原有简单错误反馈 |
| 展示内容 | ① 错误类型标签（如「正字法变化遗漏」）② 错误原因中文解释 ③ 2-3 个同规律动词举例 ④ 一句话口诀 |
| 卡片高度 | 内容自适应，无固定高度，最多显示 3 个同类动词 |
| 与原反馈关系 | 完全替换原有「答错仅显示正确答案」逻辑，不叠加显示 |

**规律归纳卡片（功能六）**

| 属性 | 规格 |
| :--- | :--- |
| 触发条件 | 同一 rule_tag 连续答对 5 次，且该规律本次会话内未触发过 |
| 展示方式 | 全屏遮罩卡片，从底部滑入（translateY 动画，300ms ease-out） |
| 背景效果 | `backdrop-filter: blur(4px)`，强调特殊节点感 |
| 内容结构 | 规律标题 + 完整规律解释 + 3 个同规律动词示例 + 延伸动词列表 |
| 操作按钮 | 「保存这条规律」（复制文字到剪贴板）+ 「继续练习 →」 |
| 重复触发 | 同一会话内每条规律只触发一次，不重复打扰 |

---

## 第四章 题库数据结构

### 4.1 单题 JSON Schema

v1.1 在原有字段基础上新增功能四和功能六所需字段，原有字段全部保留：

```json
{
  // ── 原有字段（v1.0，保持不变）──────────────────
  "id":               "indef_042",
  "pack":             "indef_vs_imp",
  "sentence":         "Cuando _____ (llegar) a casa, mi madre cocinaba.",
  "translation":      "当我到家时，我妈妈正在做饭。",
  "verb":             "llegar",
  "person":           "yo",
  "tense":            "indefinido",
  "answer":           "llegué",
  "answer_no_accent": "llegue",
  "rule":             "cuando + 时间点动作 → Indefinido，背景持续用 Imperfecto",
  "distractor":       "llegaba",
  "distractor_error": "llegaba 是 Imperfecto，描述当时的背景状态",
  "trigger_word":     "cuando",
  "difficulty":       "A2",

  // ── 功能四新增字段（v1.1）────────────────────────
  "error_type":         "orthographic",
  "error_type_cn":      "正字法变化遗漏",
  "distractor_2":       "llegó",
  "distractor_2_error": "llegó 是 él/ella 的形式，不是 yo",
  "distractor_2_type":  "person_confusion",
  "similar_verbs": [
    { "verb": "buscar",  "yo_form": "busqué"  },
    { "verb": "pagar",   "yo_form": "pagué"   },
    { "verb": "empezar", "yo_form": "empecé"  }
  ],

  // ── 功能六新增字段（v1.1）────────────────────────
  "rule_tag": "orthographic_gar"
}
```

### 4.2 判断逻辑（伪代码）
1. 执行 `trim()` 并转为 `toLowerCase()`。
2. 若与 `answer` 完全一致，状态为 `correct`。
3. 若与 `answer_no_accent` 一致，状态为 `warning`（黄灯）。
4. 否则状态为 `error`，触发功能四干扰项反馈展示。

### 4.3 【NEW】新增：完整变位表数据结构（功能二）

完整变位表使用独立数据文件，与混淆专项题库分开存放：

```javascript
// 文件路径：/src/data/conjugation_tables.js
{
  "verb":       "tener",
  "tense":      "indefinido",
  "tense_cn":   "简单过去时",
  "is_irregular": true,
  "difficulty": "B1",
  "rule_tag":   "fully_irregular_indef",
  "conjugation_table": {
    "yo":       { "answer": "tuve",      "answer_no_accent": "tuve"      },
    "tu":       { "answer": "tuviste",   "answer_no_accent": "tuviste"   },
    "el":       { "answer": "tuvo",      "answer_no_accent": "tuvo"      },
    "nosotros": { "answer": "tuvimos",   "answer_no_accent": "tuvimos"   },
    "vosotros": { "answer": "tuvisteis", "answer_no_accent": "tuvisteis" },
    "ellos":    { "answer": "tuvieron",  "answer_no_accent": "tuvieron"  }
  },
  "common_mistake_persons": ["vosotros", "ellos"]
}
```

**数据量**：MVP 阶段：30 个高频动词 × 3 个基础时态 = 90 张完整变位表。AI 批量生成，约 30 分钟完成。

### 4.4 【NEW】新增：规律卡片数据结构（功能六）

```javascript
// 文件路径：/src/data/rule_cards.js
{
  "rule_tag":    "orthographic_gar",
  "title":       "-gar 动词简单过去时 yo 的正字法变化",
  "explanation": "-gar 结尾动词变位后，g 前如果是 e，需要加 u（llegu-）保持硬 /g/ 发音，否则 ge 会读成 /xe/",
  "pattern":     "-gar → -gué（yo）",
  "examples": [
    { "verb": "llegar",  "yo_form": "llegué",  "meaning": "到达" },
    { "verb": "pagar",   "yo_form": "pagué",   "meaning": "付钱" },
    { "verb": "jugar",   "yo_form": "jugué",   "meaning": "玩/打球" }
  ],
  "extended_verbs": ["colgar", "apagar", "entregar", "negar"],
  "trigger_count": 5,
  "difficulty":  "A2"
}
```

### 4.5 文件结构总览（v1.1）

```
src/
├── data/
│   ├── pack_indef_vs_imp.js      // 混淆专项题库（功能一 + 功能四字段）
│   ├── pack_presente_irreg.js    // 混淆专项题库
│   ├── pack_subj_vs_ind.js       // 混淆专项题库
│   ├── conjugation_tables.js     // 完整变位表数据（功能二）★新增
│   └── rule_cards.js             // 规律卡片数据（功能六）★新增
├── components/
│   ├── FloatKeyboard.jsx         // 悬浮键盘（原有）
│   ├── QuestionCard.jsx          // 题目卡片（原有）
│   ├── FeedbackCard.jsx          // 基础反馈卡片（原有，被功能四扩展）
│   ├── DistractorFeedback.jsx    // 干扰项反馈卡片（功能四）★新增
│   ├── ConjugationTable.jsx      // 完整变位表组件（功能二）★新增
│   └── RuleCard.jsx              // 规律归纳卡片（功能六）★新增
├── hooks/
│   └── useRuleProgress.js        // 规律计数器 hook（功能六）★新增
└── App.jsx                       // 主逻辑，视图切换
```

---

## 第五章 交互状态机与兼容性

### 5.1 状态转移（原有）
答题视图的核心状态机：

**Idle**（等待输入）→ **Typing**（输入中）→ **Correct / Warning / Error** → **Finished**（结算页）

### 5.2 微信内置浏览器兼容
* 使用 `visualViewport` 降级方案获取键盘高度。
* 处理 iOS 微信键盘收起后的页面滚动恢复问题。
* 建议采用 `position: fixed` 布局防止安卓端页面错乱。

### 5.3 【NEW】新增状态（v1.1）

| 新增状态 | 触发条件 | UI 表现 | 退出方式 |
| :--- | :--- | :--- | :--- |
| `table_mode`（变位表模式） | 用户点击「完整变位表」按钮 | 切换为六格变位表填写界面，隐藏普通答题视图 | 点击「返回答题」或完成提交 |
| `distractor_shown`（干扰项展示） | 答题状态为 error | FeedbackCard 扩展为 DistractorFeedback，展示错误类型 + 同类动词 | 点击「下一题」 |
| `rule_card_shown`（规律卡片弹出） | 同一 rule_tag 连续答对 5 次 | 全屏规律卡片遮罩出现 | 点击「继续练习」 |

**规律计数器状态逻辑：**

```javascript
// /src/hooks/useRuleProgress.js
const ruleProgress = {};      // { rule_tag: 连续答对次数 }
const triggeredRules = new Set(); // 本次会话已触发过的规律

// 答对时调用
function onCorrect(question) {
  const tag = question.rule_tag;
  if (!tag) return null;
  ruleProgress[tag] = (ruleProgress[tag] || 0) + 1;
  const card = ruleCards.find(r => r.rule_tag === tag);
  const threshold = card?.trigger_count || 5;
  if (ruleProgress[tag] >= threshold && !triggeredRules.has(tag)) {
    triggeredRules.add(tag);
    return tag; // 返回 tag，由调用方展示卡片
  }
  return null;
}

// 答错时调用
function onError(question) {
  if (question.rule_tag) ruleProgress[question.rule_tag] = 0;
}
```

---

## 第六章 技术选型与部署

### 6.1 推荐技术栈
* **框架**：React（Vite 脚手架）
* **样式**：Tailwind CSS
* **题库数据**：静态 JS 文件直接 import，无需后端
* **部署**：Cloudflare Pages（免费，大陆访问速度优于 Vercel/Netlify）

### 6.2 【NEW】部署方式更新：Cloudflare Pages（v1.1）

原文档建议使用 Vercel / Netlify，根据大陆访问速度测试，调整为 Cloudflare Pages：

| 平台 | 大陆访问速度 | 免费额度 | 调整说明 |
| :--- | :--- | :--- | :--- |
| Netlify | ❌ 慢（500ms+） | 充足 | 不推荐 |
| Vercel | ✅ 可用（100-200ms） | 充足 | 备用方案 |
| Cloudflare Pages | ✅✅ 最优（50-100ms） | 充足 | ★ 推荐，本项目使用此方案 |

```bash
# 构建命令
npm run build

# Cloudflare Pages 配置
# 在 Cloudflare Dashboard 连接 GitHub 仓库
# 构建命令：npm run build
# 输出目录：dist

# 后续需要后端时（如用户登录/小程序）迁移至腾讯云
```

---

## 第七章 上线验证标准

### 7.1 功能验收（原有）
* 确认三个训练包正常运行，特殊字符插入光标位置准确。
* 答对 / 答错 / 黄灯三种状态反馈正确。
* 回车键触发提交，连击计数正常。

### 7.2 容错验收（原有）
* **空格处理**：`trim()` 正确去除首尾空格。
* **全角字符转换**：全角字母转半角后比对。
* **重音检测**：`answer_no_accent` 黄灯逻辑正确。

### 7.3 成功信号（原有）
* 平均每会话完成题数 > 15。
* 收到用户主动反馈新功能需求。

### 7.4 【NEW】新增：三大功能验收清单（v1.1）

**功能二：完整变位表**
- [ ] 首页训练包卡片下方「完整变位表」按钮可见并可点击
- [ ] 六个输入格按顺序聚焦，Tab 键切换正常
- [ ] 全部提交后每格独立判断颜色反馈正确
- [ ] 部分空格提交时空格计为错误，不报错崩溃
- [ ] 重新填表按钮清空所有格子并重置颜色

**功能四：干扰项主动生成**
- [ ] 答错后显示 DistractorFeedback 而非普通错误卡片
- [ ] 错误类型标签（如「正字法变化遗漏」）正确对应题目的 `error_type_cn` 字段
- [ ] 同类动词举例（`similar_verbs`）正确展示，最多 3 个
- [ ] 答对 / 黄灯状态不触发 DistractorFeedback，显示原有反馈

**功能六：规律归纳卡片**
- [ ] 同一 `rule_tag` 连续答对第 5 次时触发规律卡片弹出
- [ ] 答错后该 `rule_tag` 计数正确清零为 0
- [ ] 同一规律在一次会话中只弹出一次，不重复触发
- [ ] 「继续练习」按钮关闭卡片并恢复答题视图
- [ ] `rule_tag` 为空的题目不影响计数逻辑，不报错

---

## 第八章 【NEW】完整变位表速填（功能二）详细规格

> 本章为 v1.1 新增内容，在原文档基础上补充功能二的完整交互流程和界面规格。

### 8.1 交互流程

**Step 1：选择动词和时态**
```
┌──────────────────────────────────────────────────┐
│  📋 完整变位表速填                               │
│                                                  │
│  选择动词：                                      │
│  ┌────────────────────────────────────┐          │
│  │  tener  ▾                          │          │
│  └────────────────────────────────────┘          │
│                                                  │
│  选择时态：                                      │
│  ● 陈述式现在时  ○ 简单过去时  ○ 过去未完成时    │
│                                                  │
│  难度：⭐⭐⭐⭐  不规则动词  DELE B1             │
│                                                  │
│                   [ 开始填表 → ]                 │
└──────────────────────────────────────────────────┘
```

**Step 2：填写六格变位表**
```
┌──────────────────────────────────────────────────┐
│  tener · 简单过去时                              │
│  ████████████░░░░░░░  待提交                    │
├──────────────────────────────────────────────────┤
│                                                  │
│   yo         [ tuve_      ]  ← 当前聚焦          │
│   tú         [            ]                      │
│   él/ella    [            ]                      │
│   nosotros   [            ]                      │
│   vosotros   [            ]                      │
│   ellos      [            ]                      │
│                                                  │
│  [ á ][ é ][ í ][ ó ][ ú ][ ü ][ ñ ]            │
│                                                  │
│                   [ 全部提交 ✓ ]                 │
└──────────────────────────────────────────────────┘
```

**Step 3：提交后结果**
```
┌──────────────────────────────────────────────────┐
│  tener · 简单过去时  结果                        │
│                                                  │
│   yo         tuve       ✅                       │
│   tú         tuviste    ✅                       │
│   él/ella    tuvó     ❌ → tuvo                  │
│   nosotros   tuvimos    ✅                       │
│   vosotros   tuvisteis  ⚠️ → tuvisteis          │
│   ellos      tuvieron   ✅                       │
│                                                  │
│  ┌────────────────────────────────────┐          │
│  │  本次得分：4/6  正确率 67%         │          │
│  │  ⚠ él/ella 人称出现多打重音错误   │          │
│  └────────────────────────────────────┘          │
│                                                  │
│  [ 重新填这张表 ]  [ 换一个动词 ]               │
└──────────────────────────────────────────────────┘
```

### 8.2 MVP 数据范围

| 维度 | 范围 | 数量 |
| :--- | :--- | :--- |
| 动词 | DELE A2-B1 核心高频动词 | 30 个 |
| 时态 | 陈述式现在时 / 简单过去时 / 过去未完成时 | 3 个 |
| 变位表总量 | 30 × 3 | 90 张 |
| 优先覆盖 | 完全不规则动词（ser/ir/tener/hacer/haber 等） | 15 个 |

---

## 第九章 【NEW】干扰项主动生成（功能四）详细规格

> 本章为 v1.1 新增内容，扩展原有答错反馈逻辑，增加错误归类和同类动词举例。

### 9.1 错误类型分类系统

| error_type | 中文名称 | 典型例子 | 出现时态 |
| :--- | :--- | :--- | :--- |
| `tense_confusion` | 时态混淆 | 填了 hablaba 而非 habló | indefinido/imperfecto |
| `orthographic` | 正字法变化遗漏 | 填了 llegé 而非 llegué | -gar/-car/-zar 动词 |
| `stem_change` | 词干变音遗漏 | 忘记 e→ie 或 o→ue 变化 | presente |
| `person_confusion` | 人称混用 | vosotros 填成 ellos 的形式 | 所有时态 |
| `accent_missing` | 重音缺失 | llegue 代替 llegué | indefinido yo/él |
| `wrong_paradigm` | 套用错误变位规则 | 不规则动词按规则变 | indefinido |

### 9.2 干扰项反馈界面

```
┌──────────────────────────────────────────────────┐
│  ❌  再想想                                      │
│                                                  │
│  你填的：llegé       正确答案：llegué            │
│                                                  │
├──────────────────────────────────────────────────┤
│  🔍 错误类型：正字法变化遗漏                     │
│                                                  │
│  llegar 是 -gar 结尾动词，yo 简单过去时           │
│  需要加 u（llegu-）保持 /g/ 发音                 │
│                                                  │
├──────────────────────────────────────────────────┤
│  ⚠ 同类动词，规律一样：                         │
│  buscar → busqué                                 │
│  pagar  → pagué                                  │
│  empezar→ empecé                                 │
│                                                  │
│  📌 口诀：-gar加u，-car变qu，-zar变c             │
│                                                  │
│                   [ 下一题 → ]                   │
└──────────────────────────────────────────────────┘
```

### 9.3 AI 生成扩展字段 Prompt 模板

在原有题目 JSON 基础上，补充以下字段：

1. `error_type`：从以下 6 种中选一个：`tense_confusion / orthographic / stem_change / person_confusion / accent_missing / wrong_paradigm`
2. `error_type_cn`：对应中文名称
3. `distractor_2`：第二种常见错误写法（与 `distractor` 不同错误类型）
4. `distractor_2_error`：解释为何错，≤ 40 字
5. `distractor_2_type`：同上 error_type 的类型值
6. `similar_verbs`：同类规律的 3 个动词示例，格式：`[{"verb":"buscar","yo_form":"busqué"}, ...]`，要求：必须与原题是同一类型错误的动词

---

## 第十章 【NEW】变位规律归纳卡片（功能六）详细规格

> 本章为 v1.1 新增内容，描述规律卡片的触发逻辑、展示内容和 MVP 规律列表。

### 10.1 触发条件

| 条件 | 规格 | 原因 |
| :--- | :--- | :--- |
| 连续答对次数 | 同一 rule_tag 连续答对 5 次 | 5 次足以证明初步掌握，不会过早触发 |
| 统计范围 | 混淆专项 + 完整变位表均计入 | 两种模式练习数据统一，不割裂 |
| 每规律触发次数 | 一次会话内只触发一次 | 避免重复打扰，保持心流 |
| 答错后 | 该 rule_tag 计数清零 | 确保触发基于真实掌握 |
| 无 rule_tag 的题目 | 不参与计数，直接跳过 | 混淆专项中的纯语境判断题无需归纳 |

### 10.2 规律卡片界面

```
┌──────────────────────────────────────────────────┐
│                                                  │
│         🧠  规律解锁！                           │
│                                                  │
│  你已连续答对 5 题，掌握了这条规律：             │
│                                                  │
│  ┌──────────────────────────────────────┐        │
│  │  -gar / -car / -zar 动词             │        │
│  │  简单过去时 yo 的正字法变化           │        │
│  │                                      │        │
│  │  -gar → -gué   llegar → llegué      │        │
│  │  -car → -qué   buscar → busqué      │        │
│  │  -zar → -cé    empezar→ empecé      │        │
│  └──────────────────────────────────────┘        │
│                                                  │
│  ✅ 学会这条规律，以下动词你也会了：             │
│     pagar / colgar / atacar / alcanzar           │
│                                                  │
│  ┌──────────────┐  ┌──────────────────┐          │
│  │  保存规律    │  │   继续练习 →     │          │
│  └──────────────┘  └──────────────────┘          │
└──────────────────────────────────────────────────┘
```

### 10.3 MVP 规律列表（12 条）

| rule_tag | 规律名称 | 典型动词 | DELE 级别 |
| :--- | :--- | :--- | :--- |
| `orthographic_gar` | -gar正字法 yo→-gué | llegar/pagar/jugar | A2 |
| `orthographic_car` | -car正字法 yo→-qué | buscar/tocar/sacar | A2 |
| `orthographic_zar` | -zar正字法 yo→-cé | empezar/alcanzar/cruzar | A2 |
| `stem_eie_pres` | 词干变音 e→ie（现在时） | tener/querer/entender | A2 |
| `stem_oue_pres` | 词干变音 o→ue（现在时） | poder/dormir/volver | A2 |
| `yo_irregular_pres` | yo形式不规则（现在时） | hacer/salir/traer/poner | B1 |
| `fully_irregular_indef` | 完全不规则（简单过去时） | ser/ir/tener/hacer/haber | B1 |
| `accent_indef_yo_el` | 过去时 yo/él 重音规则 | hablar (hablé/habló) | A2 |
| `reflexive_pres` | 反身动词现在时 | -se 动词规律 | A2 |
| `imperfect_regular` | 未完成时规则变位 | -aba/-ía 结尾规律 | A2 |
| `subj_present_regular` | 虚拟式现在时规则 | -e/-a 结尾交换 | B1 |
| `ser_ir_same_indef` | ser 和 ir 过去时完全相同 | fui/fuiste/fue... | B1 |

### 10.4 建议开发顺序

三个功能共用同一份题库数据，题库字段一次补全。前端功能按以下顺序独立上线，每个功能可单独验证用户反应：

| 顺序 | 功能 | 预估工作量 | 验证目标 |
| :--- | :--- | :--- | :--- |
| 第一步 | 功能四：干扰项主动生成 | 0.5 个周末 | 用户是否停下来看错误解释，而不是直接点下一题 |
| 第二步 | 功能六：规律归纳卡片 | 1 个周末 | 用户看到规律卡片时是否有「哦原来如此」的顿悟反应 |
| 第三步 | 功能二：完整变位表速填 | 1.5 个周末 | 用户是否主动选择「填整张表」而非只做随机混淆题 |
