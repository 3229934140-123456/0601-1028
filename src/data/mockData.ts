import type { Article, Opinion, Rule, ScheduleItem, UserStats } from '@/types';

const sampleContent = `新媒体时代，品牌营销的方式正在发生深刻变化。传统的广告投放模式逐渐被内容营销所取代，用户更愿意接受有价值的内容而非生硬的广告。

根据最新的市场调研报告显示，超过70%的消费者表示更倾向于通过内容了解品牌，而非通过传统广告。这一趋势在年轻用户群体中尤为明显，Z世代用户对广告的敏感度越来越低，对优质内容的需求却在不断增长。

品牌需要重新思考自己的营销策略。首先，要深入了解目标用户的需求和痛点，创作真正有价值的内容。其次，要选择合适的内容分发渠道，不同的平台有不同的用户画像和内容调性。最后，要建立长效的内容运营机制，持续输出高质量内容。

在内容形式上，短视频、图文、直播等多种形式各有优势。品牌可以根据自身特点和目标受众选择合适的形式，或者采用组合策略，在不同平台分发不同形式的内容，形成立体化的内容矩阵。

值得注意的是，内容营销不是一蹴而就的事情，需要长期的积累和持续的投入。但只要坚持优质内容的输出，就一定能够获得用户的认可和品牌价值的提升。`;

const sampleContent2 = sampleContent.replace('深刻变化', '根本性转变').replace('内容营销所取代', '更复杂的营销生态取代').replace('70%', '65%');

export const categories = ['全部', '时政新闻', '社会民生', '财经科技', '文化娱乐', '体育健康', '教育职场'];

export const priorityLabels: Record<string, string> = {
  high: '高优先级',
  medium: '中优先级',
  low: '低优先级',
};

export const riskLevelLabels: Record<string, string> = {
  high: '高风险',
  medium: '中风险',
  low: '低风险',
};

export const mockArticles: Article[] = [
  {
    id: '1',
    title: '2026年新媒体营销趋势深度分析报告',
    author: '张明远',
    category: '财经科技',
    priority: 'high',
    status: 'pending',
    submitTime: '2026-06-08 09:30',
    deadline: '2026-06-08 18:00',
    isOverdue: false,
    contentType: 'article',
    content: sampleContent,
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20digital%20marketing%20concept%20with%20smartphone&image_size=landscape_16_9',
    ],
    versions: [
      {
        id: 'v1',
        version: 1,
        content: sampleContent2,
        submitTime: '2026-06-07 14:00',
        editor: '李编辑',
      },
      {
        id: 'v2',
        version: 2,
        content: sampleContent,
        submitTime: '2026-06-08 09:30',
        editor: '王编辑',
      },
    ],
    sensitiveSections: [
      {
        id: 's1',
        startIndex: 150,
        endIndex: 153,
        type: '数据引用',
        ruleId: 'r3',
        description: '引用数据需注明来源，建议补充调研机构名称',
      },
      {
        id: 's2',
        startIndex: 280,
        endIndex: 282,
        type: '敏感词',
        ruleId: 'r1',
        description: '表述可能存在风险，建议修改为更中性的表达',
      },
    ],
    riskLevel: 'medium',
  },
  {
    id: '2',
    title: '城市夜经济发展新模式探索',
    author: '李思琪',
    category: '社会民生',
    priority: 'medium',
    status: 'pending',
    submitTime: '2026-06-08 10:15',
    deadline: '2026-06-09 12:00',
    isOverdue: false,
    contentType: 'article',
    content: sampleContent.replace('品牌营销', '城市发展').replace('内容营销', '夜间经济'),
    versions: [
      {
        id: 'v1',
        version: 1,
        content: sampleContent,
        submitTime: '2026-06-08 10:15',
        editor: '李思琪',
      },
    ],
    sensitiveSections: [],
    riskLevel: 'low',
  },
  {
    id: '3',
    title: '【紧急】重大政策调整公告',
    author: '政策研究室',
    category: '时政新闻',
    priority: 'high',
    status: 'pending',
    submitTime: '2026-06-08 07:00',
    deadline: '2026-06-08 12:00',
    isOverdue: true,
    contentType: 'article',
    content: sampleContent,
    versions: [
      {
        id: 'v1',
        version: 1,
        content: sampleContent,
        submitTime: '2026-06-08 07:00',
        editor: '政策室',
      },
    ],
    sensitiveSections: [
      {
        id: 's1',
        startIndex: 100,
        endIndex: 105,
        type: '政策表述',
        ruleId: 'r2',
        description: '涉及政策解读，需核实准确性',
      },
    ],
    riskLevel: 'high',
  },
  {
    id: '4',
    title: '春季运动会精彩瞬间回顾',
    author: '体育组',
    category: '体育健康',
    priority: 'low',
    status: 'pending',
    submitTime: '2026-06-07 16:30',
    deadline: '2026-06-09 18:00',
    isOverdue: false,
    contentType: 'image',
    content: '本次春季运动会精彩纷呈，各项赛事圆满成功。运动员们展现了顽强拼搏的精神风貌，多项赛事纪录被刷新。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sports%20competition%20athletes%20running%20track&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=medal%20ceremony%20sports%20event&image_size=landscape_16_9',
    ],
    versions: [
      {
        id: 'v1',
        version: 1,
        content: '春季运动会精彩回顾',
        submitTime: '2026-06-07 16:30',
        editor: '体育组',
      },
    ],
    sensitiveSections: [],
    riskLevel: 'low',
  },
  {
    id: '5',
    title: '校园文化节活动宣传片',
    author: '宣传中心',
    category: '文化娱乐',
    priority: 'medium',
    status: 'pending',
    submitTime: '2026-06-08 11:00',
    deadline: '2026-06-10 12:00',
    isOverdue: false,
    contentType: 'video',
    content: '校园文化节即将开幕，精彩活动等你来参与！本次文化节包含文艺演出、书画展览、创意市集等多个板块，为师生们带来丰富多彩的文化体验。',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    versions: [
      {
        id: 'v1',
        version: 1,
        content: '校园文化节宣传片',
        submitTime: '2026-06-08 11:00',
        editor: '宣传中心',
      },
    ],
    sensitiveSections: [],
    riskLevel: 'low',
  },
  {
    id: '6',
    title: '人工智能在教育领域的应用前景',
    author: '王晓东',
    category: '教育职场',
    priority: 'medium',
    status: 'pending',
    submitTime: '2026-06-08 08:45',
    deadline: '2026-06-09 17:00',
    isOverdue: false,
    contentType: 'article',
    content: sampleContent.replace('品牌营销', 'AI教育').replace('内容营销', '智能教学'),
    versions: [
      {
        id: 'v1',
        version: 1,
        content: sampleContent,
        submitTime: '2026-06-08 08:45',
        editor: '王晓东',
      },
    ],
    sensitiveSections: [],
    riskLevel: 'low',
  },
  {
    id: '7',
    title: '健康饮食指南：科学搭配每日营养',
    author: '健康生活',
    category: '体育健康',
    priority: 'low',
    status: 'pending',
    submitTime: '2026-06-07 20:00',
    deadline: '2026-06-10 12:00',
    isOverdue: false,
    contentType: 'article',
    content: sampleContent.replace('品牌营销', '健康饮食').replace('内容营销', '营养搭配'),
    versions: [
      {
        id: 'v1',
        version: 1,
        content: sampleContent,
        submitTime: '2026-06-07 20:00',
        editor: '健康组',
      },
    ],
    sensitiveSections: [],
    riskLevel: 'low',
  },
  {
    id: '8',
    title: '金融科技监管新规解读',
    author: '财经组',
    category: '财经科技',
    priority: 'high',
    status: 'pending',
    submitTime: '2026-06-08 06:30',
    deadline: '2026-06-08 15:00',
    isOverdue: true,
    contentType: 'article',
    content: sampleContent.replace('品牌营销', '金融监管').replace('内容营销', '合规管理'),
    versions: [
      {
        id: 'v1',
        version: 1,
        content: sampleContent,
        submitTime: '2026-06-08 06:30',
        editor: '财经组',
      },
    ],
    sensitiveSections: [
      {
        id: 's1',
        startIndex: 200,
        endIndex: 205,
        type: '金融敏感',
        ruleId: 'r4',
        description: '涉及金融监管政策表述，需专业审核',
      },
    ],
    riskLevel: 'high',
  },
];

export const mockOpinions: Opinion[] = [
  {
    id: 'op1',
    content: '内容质量良好，符合栏目定位，建议通过。',
    category: '通过类',
    usageCount: 128,
    isFavorite: true,
  },
  {
    id: 'op2',
    content: '标题需要更吸引眼球，建议修改后重审。',
    category: '修改类',
    usageCount: 89,
    isFavorite: true,
  },
  {
    id: 'op3',
    content: '内容涉及敏感话题，请相关专业审核人员复核。',
    category: '转交类',
    usageCount: 45,
    isFavorite: false,
  },
  {
    id: 'op4',
    content: '数据引用来源不明确，请补充说明。',
    category: '修改类',
    usageCount: 67,
    isFavorite: false,
  },
  {
    id: 'op5',
    content: '图片质量较好，配文与主题契合度高。',
    category: '通过类',
    usageCount: 56,
    isFavorite: true,
  },
  {
    id: 'op6',
    content: '内容与事实有出入，建议核实后重新提交。',
    category: '驳回类',
    usageCount: 34,
    isFavorite: false,
  },
  {
    id: 'op7',
    content: '整体结构清晰，建议微调部分段落顺序。',
    category: '修改类',
    usageCount: 78,
    isFavorite: false,
  },
  {
    id: 'op8',
    content: '违反内容规范第三条，不予通过。',
    category: '驳回类',
    usageCount: 23,
    isFavorite: false,
  },
];

export const mockRules: Rule[] = [
  {
    id: 'r1',
    title: '敏感词汇使用规范',
    category: '内容安全',
    description: '内容中禁止使用违反相关法律法规的敏感词汇，包括但不限于政治敏感词、低俗词汇、暴力相关表述等。对于可能存在歧义的表述，应采用更中性、客观的表达方式。',
    examples: [
      '避免使用带有强烈感情色彩的极端词汇',
      '涉及敏感话题时保持中立客观的表述',
      '不确定的词汇可以先进行替换处理',
    ],
  },
  {
    id: 'r2',
    title: '政策解读内容审核标准',
    category: '内容安全',
    description: '涉及政策解读的内容必须准确无误，不得随意解读或夸大政策内容。引用政策原文需标注出处，解读部分需明确标注为个人观点或官方解读。',
    examples: [
      '政策原文引用必须一字不差',
      '解读部分需与原文明确区分',
      '重大政策需转交专业审核人员复核',
    ],
  },
  {
    id: 'r3',
    title: '数据引用规范',
    category: '内容质量',
    description: '文章中引用的数据必须有可靠来源，并在文中或文末注明数据来源和发布时间。数据使用应准确，不得断章取义或篡改数据。',
    examples: [
      '数据来源需注明具体机构名称',
      '统计数据需标注统计时间范围',
      '对比数据需保持统计口径一致',
    ],
  },
  {
    id: 'r4',
    title: '金融内容审核标准',
    category: '专业审核',
    description: '涉及金融、投资、理财等内容需经过专业审核，不得承诺收益，不得推荐具体投资产品，风险提示必须充分醒目。',
    examples: [
      '禁止使用"稳赚不赔""高收益"等表述',
      '必须包含充分的风险提示',
      '金融专业内容需持证人员审核',
    ],
  },
  {
    id: 'r5',
    title: '图片视频内容规范',
    category: '内容安全',
    description: '图片和视频内容必须健康向上，不得包含违法违规内容。图片需注意版权问题，使用网络图片需获得授权或使用免费商用素材。',
    examples: [
      '人物图片需获得肖像权授权',
      '避免使用模糊不清的图片素材',
      '视频内容需完整审核全部时长',
    ],
  },
  {
    id: 'r6',
    title: '标题撰写规范',
    category: '内容质量',
    description: '标题应准确概括文章内容，不得使用夸张、误导性的标题吸引点击。标题党行为将被严格审核，严重者将被驳回。',
    examples: [
      '禁止使用"震惊""竟然"等夸张词汇',
      '标题不得与内容严重不符',
      '数字类标题需确保数据准确',
    ],
  },
];

const generateSchedule = (): ScheduleItem[] => {
  const items: ScheduleItem[] = [];
  const cats = ['时政新闻', '社会民生', '财经科技', '文化娱乐', '体育健康'];
  for (let i = 0; i < 20; i++) {
    const day = Math.floor(i / 4) + 1;
    items.push({
      id: `sch${i}`,
      title: `排期稿件 ${i + 1}`,
      category: cats[i % cats.length],
      publishTime: `2026-06-${String(day).padStart(2, '0')} ${9 + (i % 4) * 2}:00`,
      status: day < 8 ? 'published' : 'scheduled',
    });
  }
  return items;
};

export const mockSchedule: ScheduleItem[] = generateSchedule();

export const mockUserStats: UserStats = {
  todayCount: 12,
  weekCount: 68,
  monthCount: 256,
  approvalRate: 72.5,
  categoryStats: [
    { category: '时政新闻', count: 45 },
    { category: '社会民生', count: 68 },
    { category: '财经科技', count: 52 },
    { category: '文化娱乐', count: 38 },
    { category: '体育健康', count: 32 },
    { category: '教育职场', count: 21 },
  ],
  weeklyData: [
    { day: '周一', count: 15 },
    { day: '周二', count: 12 },
    { day: '周三', count: 18 },
    { day: '周四', count: 10 },
    { day: '周五', count: 13 },
    { day: '周六', count: 6 },
    { day: '周日', count: 4 },
  ],
};

export const reviewGroups = [
  '时政审核组',
  '财经审核组',
  '文娱审核组',
  '技术审核组',
];

export const reviewReviewers: Record<string, string[]> = {
  '时政审核组': ['李专业审核', '王资深审核'],
  '财经审核组': ['张财经审核', '陈财务专家'],
  '文娱审核组': ['刘文娱审核', '赵创意审核'],
  '技术审核组': ['孙技术审核', '周安全专家'],
};
