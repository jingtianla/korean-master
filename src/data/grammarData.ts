import type { GrammarPoint } from '@/types/korean';

export const GRAMMAR_LIST: GrammarPoint[] = [
  {
    id: 'gm-beg-1',
    pattern: 'N + 입니다 / 입니까?',
    level: 'beginner',
    meaningZh: '是…… / 是……吗？（正式尊敬阶体言终结词尾）',
    attachRule: '直接接在名词（N）后，无论有无收音均接 입니다（陈述）或 입니까?（疑问）。',
    detailExplanation:
      '韩语入门第一课核心语法，用于正式场合（自我介绍、新闻、演讲、职场）。注意发音时“입니다”中的收音 ㅂ 遇 ㄴ 会发生鼻音化，实际读作 [임니다]。',
    exampleKo: '저는 중국 사람입니다.',
    exampleZh: '我是中国人。',
    quiz: {
      question: '请选择正确的句子完成自我介绍：“我是大学生。”（正式场合）',
      options: [
        '저는 대학생입니다.',
        '저는 대학생를 입니다.',
        '저는 대학생합니다.',
        '저는 대학생입니까?',
      ],
      correctIndex: 0,
      explanation: '名词“대학생（大学生）”后直接加陈述式正式终结词尾“입니다”，中间不加宾格助词。',
    },
  },
  {
    id: 'gm-beg-2',
    pattern: 'V/A + -아/어요',
    level: 'beginner',
    meaningZh: '日常非格式体尊敬阶终结词尾',
    attachRule: '词干末音节元音为 ㅏ/ㅗ 时接 -아요；其他元音接 -어요；以 하 结尾的词干变为 해요。',
    detailExplanation:
      '韩国人日常生活中使用频率最高的礼貌语尾，语气亲切柔和。例如：가다 -> 가요，먹다 -> 먹어요，공부하다 -> 공부해요。',
    exampleKo: '매일 아침 커피를 마셔요.',
    exampleZh: '每天早上喝咖啡。',
    quiz: {
      question: '动词“먹다（吃）”变成 -아/어요 形式，哪一项是正确的？',
      options: ['먹아요', '먹어요', '먹해요', '먹여요'],
      correctIndex: 1,
      explanation:
        '“먹”的元音是 ㅓ（非 ㅏ/ㅗ），因此应该接 -어요，写作“먹어요”，连音读作 [머거요]。',
    },
  },
  {
    id: 'gm-int-1',
    pattern: 'V/A + -(으)니까',
    level: 'intermediate',
    meaningZh: '因为……所以……（主观看法、命令或共动句前的原因）',
    attachRule: '词干无收音或收音为 ㄹ 时接 -니까；有收音（非 ㄹ）时接 -으니까。',
    detailExplanation:
      '与“-아/어서”不同，“-(으)니까”强调说话人主观认定的理由，且后句可以使用命令句（-(으)세요）或共动句（-(으)ㅂ시다 / -자）。',
    exampleKo: '비가 오니까 우산을 가져가세요.',
    exampleZh: '因为下雨了，请带把伞去吧。',
    quiz: {
      question: '“天气很冷，请多穿点衣服。”后半句为祈使句，前半句应选哪个连接词尾？',
      options: ['날씨가 추워서', '날씨가 추우니까', '날씨가 춥고', '날씨가 춥지만'],
      correctIndex: 1,
      explanation:
        '后句是祈使/建议句（옷을 따뜻하게 입으세요）时，前句表示原因必须用 -(으)니까，不能用 -아/어서；且 춥다 为 ㅂ 不规则音变，变为 추우니까。',
    },
  },
  {
    id: 'gm-adv-1',
    pattern: 'V/A + -(으)ㄹ 뿐만 아니라',
    level: 'advanced',
    meaningZh: '不仅……而且……（递进关系）',
    attachRule: '动词/形容词词干无收音或 ㄹ 收音接 -ㄹ 뿐만 아니라；有收音接 -을 뿐만 아니라。',
    detailExplanation:
      'TOPIK 中高级写作与阅读高频句型，用于在前一事实基础上递进补充另一层优势或情况，后句常搭配“도（也）”呼应。',
    exampleKo: '그분은 한국어를 잘할 뿐만 아니라 한국 역사도 깊이 알고 있다.',
    exampleZh: '那位不仅韩语说得好，而且对韩国历史也了解很深。',
    quiz: {
      question:
        '填空：“이 휴대폰은 디자인이 예쁠 (      ) 기능도 다양하다.”（这部手机不仅设计漂亮，功能也丰富。）',
      options: ['뿐만 아니라', '수밖에 없다', '리 만무하다', '바에야'],
      correctIndex: 0,
      explanation: '“-(으)ㄹ 뿐만 아니라”表示“不仅……而且……”，与后句的“기능도（功能也）”完美呼应。',
    },
  },
];
