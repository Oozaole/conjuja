// 规律卡片数据（功能六）
export const ruleCards = [
  {
    rule_tag: "orthographic_gar",
    title: "-gar 动词简单过去时 yo 的正字法变化",
    explanation: "-gar 结尾动词变位后，g 前如果是 e，需要加 u（llegu-）保持硬 /g/ 发音，否则 ge 会读成 /xe/",
    pattern: "-gar → -gué（yo）",
    examples: [
      { verb: "llegar", yo_form: "llegué", meaning: "到达" },
      { verb: "pagar", yo_form: "pagué", meaning: "付钱" },
      { verb: "jugar", yo_form: "jugué", meaning: "玩/打球" }
    ],
    extended_verbs: ["colgar", "apagar", "entregar", "negar"],
    trigger_count: 5,
    difficulty: "A2"
  },
  {
    rule_tag: "orthographic_car",
    title: "-car 动词简单过去时 yo 的正字法变化",
    explanation: "-car 结尾动词变位后，c 在 e 前需变为 qu（busqu-）保持硬 /k/ 发音，否则 ce 会读成 /θe/",
    pattern: "-car → -qué（yo）",
    examples: [
      { verb: "buscar", yo_form: "busqué", meaning: "寻找" },
      { verb: "tocar", yo_form: "toqué", meaning: "触碰/弹奏" },
      { verb: "sacar", yo_form: "saqué", meaning: "取出" }
    ],
    extended_verbs: ["explicar", "practicar", "dedicar"],
    trigger_count: 5,
    difficulty: "A2"
  },
  {
    rule_tag: "orthographic_zar",
    title: "-zar 动词简单过去时 yo 的正字法变化",
    explanation: "-zar 结尾动词变位后，z 在 e 前需变为 c（empec-），西语中 ze/zi 组合极罕见",
    pattern: "-zar → -cé（yo）",
    examples: [
      { verb: "empezar", yo_form: "empecé", meaning: "开始" },
      { verb: "alcanzar", yo_form: "alcancé", meaning: "到达/达到" },
      { verb: "cruzar", yo_form: "crucé", meaning: "穿越" }
    ],
    extended_verbs: ["utilizar", "organizar", "realizar"],
    trigger_count: 5,
    difficulty: "A2"
  },
  {
    rule_tag: "stem_eie_pres",
    title: "词干变音 e→ie（陈述式现在时）",
    explanation: "部分动词在重读音节中 e 变 ie，但 nosotros/vosotros 不变（因为重音不在词干上）",
    pattern: "e → ie（yo/tú/él/ellos）",
    examples: [
      { verb: "tener", yo_form: "tiene", meaning: "有/拥有" },
      { verb: "querer", yo_form: "quiere", meaning: "想要/爱" },
      { verb: "entender", yo_form: "entiende", meaning: "理解" }
    ],
    extended_verbs: ["pensar", "preferir", "sentir", "perder"],
    trigger_count: 5,
    difficulty: "A2"
  },
  {
    rule_tag: "stem_oue_pres",
    title: "词干变音 o→ue（陈述式现在时）",
    explanation: "部分动词在重读音节中 o 变 ue，同样 nosotros/vosotros 不变",
    pattern: "o → ue（yo/tú/él/ellos）",
    examples: [
      { verb: "poder", yo_form: "puede", meaning: "能够" },
      { verb: "dormir", yo_form: "duerme", meaning: "睡觉" },
      { verb: "volver", yo_form: "vuelve", meaning: "回来" }
    ],
    extended_verbs: ["encontrar", "recordar", "contar", "morir"],
    trigger_count: 5,
    difficulty: "A2"
  },
  {
    rule_tag: "yo_irregular_pres",
    title: "yo 形式不规则（陈述式现在时）",
    explanation: "一些常用动词只有 yo 形式不规则，其他人称正常变位。这些动词需要单独记忆",
    pattern: "yo 形式特殊，不遵循规则变位",
    examples: [
      { verb: "hacer", yo_form: "hago", meaning: "做" },
      { verb: "salir", yo_form: "salgo", meaning: "出去" },
      { verb: "poner", yo_form: "pongo", meaning: "放" }
    ],
    extended_verbs: ["traer", "caer", "valer", "decir"],
    trigger_count: 5,
    difficulty: "B1"
  },
  {
    rule_tag: "fully_irregular_indef",
    title: "完全不规则动词（简单过去时）",
    explanation: "ser/ir/tener/hacer/haber 等动词在简单过去时有完全不规则的变位形式，无法套用任何规则",
    pattern: "词根完全变化，需单独记忆",
    examples: [
      { verb: "ser/ir", yo_form: "fui", meaning: "是/去" },
      { verb: "tener", yo_form: "tuve", meaning: "有" },
      { verb: "hacer", yo_form: "hice", meaning: "做" }
    ],
    extended_verbs: ["haber", "estar", "poder", "saber"],
    trigger_count: 5,
    difficulty: "B1"
  },
  {
    rule_tag: "accent_indef_yo_el",
    title: "简单过去时 yo/él 重音规则",
    explanation: "规则动词的简单过去时，yo 和 él/ella 是重音区分意义的关键：yo 重音在最后音节（hablé），él 也在最后（habló）",
    pattern: "yo: -é / -í → él: -ó / -ió",
    examples: [
      { verb: "hablar", yo_form: "hablé → habló", meaning: "说话" },
      { verb: "comer", yo_form: "comí → comió", meaning: "吃" },
      { verb: "vivir", yo_form: "viví → vivió", meaning: "生活" }
    ],
    extended_verbs: ["cantar", "bailar", "escribir"],
    trigger_count: 5,
    difficulty: "A2"
  },
  {
    rule_tag: "imperfect_regular",
    title: "过去未完成时规则变位",
    explanation: "-ar 动词用 -aba 结尾，-er/-ir 动词用 -ía 结尾。规则动词无例外",
    pattern: "-ar → -aba / -er,-ir → -ía",
    examples: [
      { verb: "hablar", yo_form: "hablaba", meaning: "说话" },
      { verb: "comer", yo_form: "comía", meaning: "吃" },
      { verb: "vivir", yo_form: "vivía", meaning: "生活" }
    ],
    extended_verbs: ["cantar", "estudiar", "escribir", "dormir"],
    trigger_count: 5,
    difficulty: "A2"
  },
  {
    rule_tag: "subj_present_regular",
    title: "虚拟式现在时规则变位",
    explanation: "虚拟式规则：-ar 动词词尾换成 -e 系列，-er/-ir 动词词尾换成 -a 系列，即元音交换",
    pattern: "-ar → -e / -er,-ir → -a（元音互换）",
    examples: [
      { verb: "hablar", yo_form: "hable", meaning: "说话" },
      { verb: "comer", yo_form: "coma", meaning: "吃" },
      { verb: "vivir", yo_form: "viva", meaning: "生活" }
    ],
    extended_verbs: ["estudiar", "trabajar", "escribir"],
    trigger_count: 5,
    difficulty: "B1"
  },
  {
    rule_tag: "reflexive_pres",
    title: "反身动词现在时变位",
    explanation: "反身动词需要在变位前加上反身代词 me/te/se/nos/os/se，代词随人称变化",
    pattern: "-se 动词：代词 + 变位动词",
    examples: [
      { verb: "levantarse", yo_form: "me levanto", meaning: "起床" },
      { verb: "ducharse", yo_form: "me ducho", meaning: "洗澡" },
      { verb: "acostarse", yo_form: "me acuesto", meaning: "上床睡觉" }
    ],
    extended_verbs: ["vestirse", "llamarse", "sentarse"],
    trigger_count: 5,
    difficulty: "A2"
  },
  {
    rule_tag: "ser_ir_same_indef",
    title: "ser 和 ir 简单过去时完全相同",
    explanation: "ser（是）和 ir（去）在简单过去时的变位形式完全一模一样：fui, fuiste, fue, fuimos, fuisteis, fueron。靠上下文区分含义",
    pattern: "ser = ir → fui/fuiste/fue/fuimos/fuisteis/fueron",
    examples: [
      { verb: "ser", yo_form: "fui", meaning: "我是/我曾是" },
      { verb: "ir", yo_form: "fui", meaning: "我去了" },
      { verb: "ser (él)", yo_form: "fue", meaning: "他是/他去了" }
    ],
    extended_verbs: [],
    trigger_count: 5,
    difficulty: "B1"
  }
];
