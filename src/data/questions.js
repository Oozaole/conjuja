export const trainingPacks = [
  {
    id: 'indef_vs_imp',
    title: 'Indefinido vs Imperfecto',
    description: '区分简单过去时与过去未完成时',
    difficulty: 'B1',
    theme: 'blue'
  },
  {
    id: 'presente_irr',
    title: 'Presente 不规则变化',
    description: '陈述式现在时的高频不规则动词',
    difficulty: 'A2',
    theme: 'teal'
  },
  {
    id: 'subj_vs_ind',
    title: 'Subjuntivo vs Indicativo',
    description: '虚拟式与陈述式选用规律',
    difficulty: 'B2',
    theme: 'indigo'
  }
];

export const questionsBank = {
  indef_vs_imp: [
    {
      id: "indef_001",
      sentence: "Cuando _____ (llegar) a casa, mi madre cocinaba.",
      translation: "当我到家时，我妈妈正在做饭。",
      verb: "llegar",
      person: "yo",
      tense: "indefinido",
      answer: "llegué",
      answer_no_accent: "llegue",
      rule: "cuando + 时间点动作 → Indefinido",
      distractor: "llegaba",
      distractor_error: "llegaba 是 Imperfecto，描述当时的背景状态",
      difficulty: "A2"
    },
    {
      id: "imp_001",
      sentence: "Antes yo _____ (vivir) en Madrid.",
      translation: "以前我住在马德里。",
      verb: "vivir",
      person: "yo",
      tense: "imperfecto",
      answer: "vivía",
      answer_no_accent: "vivia",
      rule: "antes + 过去的习惯/状态 → Imperfecto",
      distractor: "viví",
      distractor_error: "viví 是 Indefinido，指过去某次特定的动作",
      difficulty: "A2"
    }
  ],
  presente_irr: [
    {
      id: "pres_001",
      sentence: "Yo no _____ (saber) la respuesta.",
      translation: "我不知道答案。",
      verb: "saber",
      person: "yo",
      tense: "presente",
      answer: "sé",
      answer_no_accent: "se",
      rule: "saber 的第一人称单数不规则为 sé",
      distractor: "sabo",
      distractor_error: "sabo 属于典型的规则错误拼写",
      difficulty: "A1"
    }
  ],
  subj_vs_ind: [
    {
      id: "subj_001",
      sentence: "Espero que tú _____ (venir) a mi fiesta.",
      translation: "我希望你能来我的派对。",
      verb: "venir",
      person: "tú",
      tense: "subjuntivo",
      answer: "vengas",
      answer_no_accent: "vengas",
      rule: "espero que + 主干意愿表示 -> 从句用虚拟式 (Subjuntivo)",
      distractor: "vienes",
      distractor_error: "vienes 是 Indicativo，表达主观意愿需用虚拟式",
      difficulty: "B1"
    }
  ]
};
