import type {
  GospelSection,
  HomeCard,
  JourneyStep,
  LessonRoute,
} from '../types/content';

export const homeCards = [
  {
    id: 'home-gospel',
    title: '認識福音',
    description: '踏出信仰生活的第一步。',
    icon: 'sunny',
    route: '/journey/creation',
    accent: 'secondary',
    visual: {
      tone: 'creation',
      surface: 'elevated',
      prefersTonalSeparation: true,
    },
  },
  {
    id: 'home-discipleship',
    title: '初信栽培',
    description: '掌握聖經的教導，使你在基督裡的新生命健康成長。',
    icon: 'footprint',
    route: '/journey',
    accent: 'primary',
    visual: {
      tone: 'quiet-authority',
      surface: 'elevated',
      prefersGlass: true,
    },
  },
  {
    id: 'home-library',
    title: '查經學習',
    description: '深入探索神的話語。',
    icon: 'menu_book',
    route: '/library',
    accent: 'surface',
    visual: {
      tone: 'reverent',
      surface: 'tonal',
    },
  },
] satisfies HomeCard[];

export const discipleshipSteps = [
  {
    id: 'salvation-assurance',
    order: 1,
    title: '得救的確據',
    subtitle: 'Assurance of Salvation',
    description: '了解上帝的應許與新生命的真實性，確信永生的禮物。',
    icon: 'verified_user',
    status: 'active',
    route: '/journey/salvation-assurance',
    visual: {
      tone: 'salvation',
      accent: 'secondary',
      surface: 'elevated',
      allowAmbientMotion: true,
    },
  },
  {
    id: 'quiet-time',
    order: 2,
    title: '靈修',
    subtitle: 'Quiet Time',
    description: '學習如何每天花時間與神親近。',
    icon: 'auto_stories',
    status: 'available',
    route: '/journey/quiet-time',
    prerequisiteIds: ['salvation-assurance'],
    visual: {
      tone: 'reflection',
      accent: 'primary',
      surface: 'elevated',
    },
  },
  {
    id: 'prayer-assurance',
    order: 3,
    title: '禱告的確據',
    subtitle: 'Assurance of Prayer',
    description: '確信上帝垂聽並回應屬祂兒女的呼求。',
    icon: 'prayer_times',
    status: 'locked',
    prerequisiteIds: ['quiet-time'],
  },
  {
    id: 'forgiveness-assurance',
    order: 4,
    title: '赦罪的確據',
    subtitle: 'Assurance of Forgiveness',
    description: '經歷基督寶血帶來的平安與過犯的赦免。',
    icon: 'favorite',
    status: 'locked',
    prerequisiteIds: ['prayer-assurance'],
  },
  {
    id: 'victory-assurance',
    order: 5,
    title: '得勝的確據',
    subtitle: 'Assurance of Victory',
    description: '在基督裡勝過試探與挑戰的生活。',
    icon: 'military_tech',
    status: 'locked',
    prerequisiteIds: ['forgiveness-assurance'],
  },
  {
    id: 'bible-authority',
    order: 6,
    title: '聖經的權威',
    subtitle: 'Authority of Bible',
    description: '承認上帝的話語是我們生活的最高準則。',
    icon: 'menu_book',
    status: 'locked',
    prerequisiteIds: ['victory-assurance'],
  },
  {
    id: 'bible-intake',
    order: 7,
    title: '持守神的話',
    subtitle: 'Intake of Bible',
    description: '建立恆常讀經、默想與背經的習慣。',
    icon: 'import_contacts',
    status: 'locked',
    prerequisiteIds: ['bible-authority'],
  },
  {
    id: 'effective-prayer',
    order: 8,
    title: '有效的祈禱',
    subtitle: 'Effective Prayer',
    description: '學習有根有基的禱告生活與秘訣。',
    icon: 'chat_bubble',
    status: 'locked',
    prerequisiteIds: ['bible-intake'],
  },
  {
    id: 'fellowship',
    order: 9,
    title: '團契互助',
    subtitle: 'Fellowship',
    description: '在信徒社群中彼此相愛、互相扶持。',
    icon: 'groups',
    status: 'locked',
    prerequisiteIds: ['effective-prayer'],
  },
  {
    id: 'witnessing',
    order: 10,
    title: '見證主',
    subtitle: 'Witnessing',
    description: '活出基督的樣式，與人分享福音的好消息。',
    icon: 'record_voice_over',
    status: 'locked',
    prerequisiteIds: ['fellowship'],
  },
  {
    id: 'life-goal',
    order: 11,
    title: '人生目的',
    subtitle: 'Life Goal',
    description: '發現神在你生命中的獨特呼召與計劃。',
    icon: 'explore',
    status: 'locked',
    prerequisiteIds: ['witnessing'],
  },
  {
    id: 'spiritual-growth',
    order: 12,
    title: '屬靈生命的成長',
    subtitle: 'Spiritual Growth',
    description: '持續追求生命成熟，結出屬靈的果子。',
    icon: 'trending_up',
    status: 'locked',
    prerequisiteIds: ['life-goal'],
  },
] satisfies JourneyStep[];

export const creationCards = [
  {
    icon: 'public',
    eyebrow: 'Creation',
    title: '萬物的源頭',
    text: '聖經記載人和世界萬物都是神所創造。這世界並非巧合，而是出於一位偉大藝術家的精心設計。',
    imageStyle:
      'bg-[radial-gradient(circle_at_30%_30%,_rgba(255,223,160,0.95),_transparent_32%),radial-gradient(circle_at_72%_30%,_rgba(62,76,49,0.35),_transparent_24%),linear-gradient(135deg,_#eef2e6_0%,_#d8e8c4_52%,_#f8f4ea_100%)]',
  },
  {
    icon: 'psychology',
    eyebrow: 'Freedom',
    title: '自由意志',
    text: '神不是把我們造成機械人一般來操控我們；祂賜給我們自由意志、良知、智慧與感情。沒有選擇的愛不是真愛。',
    imageStyle:
      'bg-[radial-gradient(circle_at_30%_28%,_rgba(121,89,0,0.4),_transparent_24%),radial-gradient(circle_at_60%_60%,_rgba(62,76,49,0.55),_transparent_26%),linear-gradient(135deg,_#fbf9f5_0%,_#efe9dd_100%)]',
  },
  {
    icon: 'family_history',
    eyebrow: 'Relationship',
    title: '情同父子',
    text: '神是聖潔、公義的。祂愛我們，原本與我們有情同父子(女)的關係，享受純粹的團契。',
    imageStyle:
      'bg-[radial-gradient(circle_at_50%_22%,_rgba(255,223,160,0.62),_transparent_22%),linear-gradient(135deg,_#f4ebd8_0%,_#dfe8d3_55%,_#fbf9f5_100%)]',
  },
];

export const faithDefinitions = [
  {
    icon: 'verified_user',
    title: '相信',
    text: '相信耶穌是神，是我們的救主。',
  },
  {
    icon: 'volunteer_activism',
    title: '接受',
    text: '認罪、接受耶穌基督的救贖。',
  },
];

export const assuranceGospelSections = [
  {
    id: 'gospel-creation',
    order: 1,
    title: '(1) 神的創造',
    icon: 'public',
    scriptures: [
      {
        reference: '創世記 Genesis 1:26-27',
        verse:
          '神說：「我們要照著我們的形像，按著我們的樣式造人，使他們管理海裡的魚、空中的鳥、地上的牲畜和全地，並地上所爬的一切昆蟲。」神就照著自己的形像造人，乃是照著他的形像造男造女。',
      },
    ],
    truths: [
      '聖經記載人和世界萬物都是神所創造的。',
      '神賜給我們自由意志、良知、智慧和感情，而不是把我們造成機械人來操控。',
      '神是聖潔、公義的，祂愛我們，原本與我們有情同父子(女)的關係。',
    ],
    note: '可惜人選擇了犯罪，離開神，與神分隔,像在懸崖的兩邊。',
    visual: {
      tone: 'creation',
      surface: 'tonal',
      allowAmbientMotion: true,
    },
  },
  {
    id: 'gospel-problem',
    order: 2,
    title: '(2) 人的問題',
    icon: 'warning',
    scriptures: [
      {
        reference: '以賽亞書 Isaiah 59:2',
        verse: '但你們的罪孽使你們與神隔絕。 你們的罪惡使他掩面不聽你們。',
      },
      {
        reference: '羅馬書 Romans 3:23',
        verse: '因為世人都犯了罪，虧缺了神的榮耀',
      },
      {
        reference: '羅馬書 Romans 6:23',
        verse: '因為罪的工價乃是死；惟有神的恩賜，在我們的主基督耶穌裡，乃是永生。',
      },
      {
        reference: '希伯來書 Hebrews 9:27',
        verse: '按著定命，人人都有一死，死後且有審判。',
      },
      {
        reference: '帖撒羅尼迦後書 2 Thessalonians 1:8-9',
        verse:
          '要報應那不認識神和那不聽從我主耶穌福音的人。他們要受刑罰，就是永遠沉淪，離開主的面和他權能的榮光。',
      },
    ],
    truths: [
      '聖經指出人人都犯了罪——就是在思想和行為上違背神。',
      '人的罪使人與聖潔的神分隔 (以賽亞書 59:2)。罪也帶來人與人之間種種問題。',
      '罪為人帶來肉體的死亡，而且死後還要面對神的審判。',
      '世人都走上永遠沉淪的絕路，而且無力自救。',
    ],
    note: '縱然人違背了神，神仍然愛人。祂盼望人悔改，與祂重建關係。',
    visual: {
      tone: 'separation',
      surface: 'immersive',
      allowAmbientMotion: true,
    },
  },
  {
    id: 'gospel-salvation',
    order: 3,
    title: '(3) 神的拯救',
    icon: 'volunteer_activism',
    scriptures: [
      {
        reference: '羅馬書 Romans 5:8',
        verse: '惟有基督在我們還作罪人的時候為我們死，神的愛就在此向我們顯明了。',
      },
      {
        reference: '哥林多前書 1 Corinthians 15:1-6',
        verse:
          '弟兄們，我如今把先前所傳給你們的福音，告訴你們知道。這福音你們也領受了，又靠著站立得住；並且你們若不是徒然相信，能以持守我所傳給你們的，就必因這福音得救。我當日所領受又傳給你們的，第一，就是基督照聖經所說，為我們的罪死了，而且埋葬了，又照聖經所說，第三天復活了，並且顯給磯法看，然後顯給十二使徒看，後來一時顯給五百多弟兄看，其中一大半到如今還在，卻也有已經睡了的。',
      },
      {
        reference: '彼得前書 1 Peter 3:18',
        verse:
          '因基督也曾一次為罪受苦，就是義的代替不義的，為要引我們到神面前。按著肉體說，他被治死；按著靈性說，他復活了。',
      },
    ],
    truths: [
      '然而,神與人之間的鴻溝極大，只有神所預備的唯一橋樑才能跨越，把人救贖。',
      '神救贖人的計劃是：祂親自以人的身份來到世上，稱為神的兒子「耶穌基督」，為我們的罪被釘死在十字架上，三日後復活了。',
      '耶穌以死替我們擔負了罪的刑罰。祂的復活顯明祂是神，並且戰勝了死亡和罪惡。',
    ],
    note: '神已建好了這救贖的橋樑，但哪些人才有資格通過？',
    visual: {
      tone: 'salvation',
      accent: 'secondary',
      surface: 'elevated',
    },
  },
  {
    id: 'gospel-response',
    order: 4,
    title: '(4) 人的回應',
    icon: 'directions_walk',
    scriptures: [
      {
        reference: '約翰福音 John 5:24',
        verse:
          '我實實在在地告訴你們：那聽我話、又信差我來者的，就有永生，不至於定罪，是已經出死入生了。',
      },
      {
        reference: '約翰福音 John 1:12',
        verse: '凡接待他的，就是信他名的人，他就賜他們權柄，作神的兒女。',
      },
    ],
    truths: [
      '凡聽到這福音、願意悔改歸回神身邊的人，只要信(相信接受)，就能得到耶穌的拯救，與神重建關係。',
      '信包括：\n   1. 相信 — 相信耶穌是神，是我們的救主\n   2. 接受 — 認罪、接受耶穌基督的拯救',
      '任何人若誠心相信並接受耶穌基督的拯救，就立刻得到這拯救 — 罪得赦免，已經出死入生，成為神的兒女，擁有與神永遠同在的新生命。',
      '若你願意相信並接受耶穌基督的拯救，歸回神的身邊，你需要向神清楚表明你的決定。請藉著以下的禱告，告訴神你願意相信並接受耶穌基督的拯救。',
    ],
    note: '決志禱告：接受耶穌基督的拯救',
    visual: {
      tone: 'salvation',
      accent: 'secondary',
      surface: 'glass',
      allowAmbientMotion: true,
    },
  },
] satisfies GospelSection[];

export const quietTimeStudyItems = [
  {
    label: '(a)',
    title: '聖經記載了甚麼？研讀聖經能給你甚麼幫助？',
    reference: '提摩太後書 3:16-17',
    icon: 'menu_book',
  },
  {
    label: '(b)',
    title: '什麼是禱告?你為什麼要向神禱告？',
    reference: '約翰福音 16:24；腓立比書 4:6-7',
    icon: 'forum',
  },
];

const gospelProblemSection = assuranceGospelSections[1]!;
const gospelSalvationSection = assuranceGospelSections[2]!;
const scriptureStudyItem = quietTimeStudyItems[0]!;
const prayerStudyItem = quietTimeStudyItems[1]!;

export const lessonRoutes = [
  {
    id: 'lesson-creation',
    journeyStepId: 'salvation-assurance',
    route: '/journey/creation',
    title: '神的創造',
    subtitle: 'Creation',
    nextRoute: '/journey/problem',
    visual: {
      tone: 'creation',
      surface: 'immersive',
      allowAmbientMotion: true,
    },
    modules: [
      {
        id: 'creation-scripture',
        kind: 'scripture-reveal',
        title: '神的話語',
        scriptures: [
          {
            reference: '創世記 Genesis 1:26-27',
            verse:
              '神說：「我們要照著我們的形像，按著我們的樣式造人，使他們管理海裡的魚、空中的鳥、地上的牲畜和全地，並地上所爬的一切昆蟲。」神就照著自己的形像造人，乃是照著他的形像造男造女。',
          },
        ],
        defaultOpen: true,
        visual: {
          tone: 'creation',
          surface: 'tonal',
          accent: 'secondary',
        },
      },
      {
        id: 'creation-visual',
        kind: 'interactive-visual',
        title: '萬物的源頭',
        visualKind: 'creation-relationship',
        description: '呈現神、人與創造秩序之間原本親密而美好的關係。',
        labels: [
          { label: '神', description: 'Creator', position: 'left' },
          { label: '人', description: 'Created in God’s image', position: 'right' },
        ],
        reducedMotionFallback: '以靜態圖像呈現神與人原本情同父子的關係。',
        visual: {
          tone: 'creation',
          surface: 'immersive',
          allowAmbientMotion: true,
        },
      },
      {
        id: 'creation-summary',
        kind: 'summary-card',
        title: '創造摘要',
        body: '聖經記載人和世界萬物都是神所創造。神賜給人自由意志、良知、智慧與感情。',
        points: creationCards.map((card) => card.text),
        visual: {
          tone: 'quiet-authority',
          surface: 'elevated',
        },
      },
    ],
  },
  {
    id: 'lesson-problem',
    journeyStepId: 'salvation-assurance',
    route: '/journey/problem',
    title: '人的問題',
    subtitle: 'The Problem',
    previousRoute: '/journey/creation',
    nextRoute: '/journey/bridge',
    visual: {
      tone: 'separation',
      surface: 'immersive',
      allowAmbientMotion: true,
    },
    modules: [
      {
        id: 'problem-visual',
        kind: 'interactive-visual',
        title: '人的罪使人與神分隔',
        visualKind: 'separation-chasm',
        description: '以鴻溝視覺呈現罪帶來的分隔與無力自救。',
        labels: [
          { label: '人', position: 'left' },
          { label: '罪', position: 'center' },
          { label: '神', position: 'right' },
        ],
        reducedMotionFallback: '以靜態分隔圖呈現罪如鴻溝攔阻人親近神。',
        visual: {
          tone: 'separation',
          surface: 'immersive',
        },
      },
      {
        id: 'problem-scriptures',
        kind: 'scripture-reveal',
        title: '罪與審判',
        scriptures: gospelProblemSection.scriptures,
        allowMultipleOpen: true,
        visual: {
          tone: 'warning',
          surface: 'tonal',
        },
      },
      {
        id: 'problem-summary',
        kind: 'summary-card',
        title: '無法自救的絕路',
        body: gospelProblemSection.note ?? '',
        points: gospelProblemSection.truths,
        visual: {
          tone: 'warning',
          surface: 'elevated',
        },
      },
    ],
  },
  {
    id: 'lesson-bridge',
    journeyStepId: 'salvation-assurance',
    route: '/journey/bridge',
    title: '神的拯救',
    subtitle: 'The Bridge',
    previousRoute: '/journey/problem',
    nextRoute: '/journey/salvation-assurance',
    visual: {
      tone: 'salvation',
      accent: 'secondary',
      surface: 'immersive',
      allowAmbientMotion: true,
    },
    modules: [
      {
        id: 'bridge-visual',
        kind: 'interactive-visual',
        title: 'The Step of Faith',
        visualKind: 'faith-bridge',
        description: '以十字架橋樑呈現耶穌跨越神與人之間的鴻溝。',
        labels: [
          { label: '悔改', position: 'left' },
          { label: '耶穌', position: 'center' },
          { label: '入生', position: 'right' },
        ],
        reducedMotionFallback: '以靜態十字架橋樑呈現人因信靠耶穌出死入生。',
        visual: {
          tone: 'salvation',
          accent: 'secondary',
          surface: 'immersive',
        },
      },
      {
        id: 'bridge-scriptures',
        kind: 'scripture-reveal',
        title: '神的拯救',
        scriptures: gospelSalvationSection.scriptures,
        allowMultipleOpen: true,
        visual: {
          tone: 'salvation',
          surface: 'glass',
        },
      },
      {
        id: 'faith-definitions',
        kind: 'content-section',
        title: '信包括相信與接受',
        points: faithDefinitions.map((definition) => definition.text),
        visual: {
          tone: 'quiet-authority',
          accent: 'secondary',
          surface: 'tonal',
        },
      },
    ],
  },
  {
    id: 'lesson-salvation-assurance',
    journeyStepId: 'salvation-assurance',
    route: '/journey/salvation-assurance',
    title: '得救的確據',
    subtitle: 'Assurance of Salvation',
    previousRoute: '/journey/bridge',
    nextRoute: '/journey/quiet-time',
    visual: {
      tone: 'quiet-authority',
      accent: 'secondary',
      surface: 'page',
    },
    modules: [
      {
        id: 'salvation-john-1-12',
        kind: 'reflection-prompt',
        number: '1',
        prompt: '根據約翰福音 1:12，怎樣的人可以成為神的兒女？',
        storageKey: 'ifu:salvation-assurance:john-1-12',
        responseMode: 'textarea',
        scriptures: [
          {
            book: '約翰福音',
            reference: 'John 1:12',
            chinese: '凡接待他的，就是信他名的人，他就賜他們權柄， 作神的兒女。',
            english:
              'But to all who received him, who believed in his name, he gave power to become children of God.',
          },
        ],
        visual: {
          tone: 'reflection',
          surface: 'elevated',
        },
      },
      {
        id: 'salvation-gospel-review',
        kind: 'appendix',
        title: '附件A : 與神和好的褔音',
        display: 'modal',
        sections: assuranceGospelSections.map((section) => ({
          id: section.id,
          title: section.title,
          body: section.note,
          rows: section.truths.map((truth, index) => ({
            id: `${section.id}-truth-${index + 1}`,
            cells: [truth],
          })),
        })),
        visual: {
          tone: 'quiet-authority',
          surface: 'glass',
          prefersGlass: true,
        },
      },
      {
        id: 'salvation-extension-a',
        kind: 'extension-card',
        title: '你到底得救了嗎？',
        route: '/journey/salvation-assurance/are-you-saved',
        description: '延伸學習得救確據的反思、引文與教導架構。',
        source: 'A-2e5098befcef8060b12ceec548f69b93',
        ctaLabel: '延伸學習',
        visual: {
          tone: 'reflection',
          surface: 'elevated',
        },
      },
      {
        id: 'salvation-extension-b',
        kind: 'extension-card',
        title: '確信 vs 迷信',
        route: '/journey/salvation-assurance/faith-vs-superstition',
        description: '延伸學習信心、確據與迷信之間的分辨。',
        source: 'B-vs-2e5098befcef8008b7ffddcb2f8ce321',
        ctaLabel: '延伸學習',
        visual: {
          tone: 'reflection',
          surface: 'elevated',
        },
      },
    ],
  },
  {
    id: 'lesson-quiet-time',
    journeyStepId: 'quiet-time',
    route: '/journey/quiet-time',
    title: '靈修',
    subtitle: 'Quiet Time',
    previousRoute: '/journey/salvation-assurance',
    visual: {
      tone: 'reflection',
      accent: 'primary',
      surface: 'page',
    },
    modules: [
      {
        id: 'quiet-time-scripture-study',
        kind: 'reflection-prompt',
        number: '(a)',
        prompt: scriptureStudyItem.title,
        storageKey: 'ifu:quiet-time:scripture-study',
        responseMode: 'textarea',
        scriptures: [
          {
            reference: scriptureStudyItem.reference,
          },
        ],
        visual: {
          tone: 'reflection',
          surface: 'elevated',
        },
      },
      {
        id: 'quiet-time-prayer-study',
        kind: 'reflection-prompt',
        number: '(b)',
        prompt: prayerStudyItem.title,
        storageKey: 'ifu:quiet-time:prayer-study',
        responseMode: 'textarea',
        scriptures: [
          {
            reference: prayerStudyItem.reference,
          },
        ],
        visual: {
          tone: 'reflection',
          surface: 'elevated',
        },
      },
      {
        id: 'quiet-time-bible-books',
        kind: 'appendix',
        title: '附件A : 聖經書卷目錄與縮寫',
        display: 'inline',
        sections: [
          {
            id: 'old-testament-books',
            title: '舊約聖經書卷 (共39)',
            body: '三欄格式：中文簡稱、中文全名、英文全名。',
          },
          {
            id: 'new-testament-books',
            title: '新約聖經書卷 (共27)',
            body: '三欄格式：中文簡稱、中文全名、英文全名。',
          },
        ],
        visual: {
          tone: 'quiet-authority',
          surface: 'tonal',
        },
      },
      {
        id: 'quiet-time-extension-a',
        kind: 'extension-card',
        title: '七分鐘與神獨處',
        route: '/journey/quiet-time/seven-minutes-with-god',
        description: '延伸學習 ACTS 禱告步驟、七分鐘摘要表與 Cambridge Seven 材料。',
        source: 'A-2e5098befcef802d862ed566fbbb967d',
        ctaLabel: '延伸學習',
      },
      {
        id: 'quiet-time-extension-b',
        kind: 'extension-card',
        title: 'If Quiet Time is New to You',
        route: '/journey/quiet-time/new-to-you',
        description: 'English extension article with practical suggestions and problem/solution sections.',
        source: 'B-If-Quiet-Time-is-New-to-You-2e5098befcef8089ae2de060ea656789',
        ctaLabel: '延伸學習',
      },
    ],
  },
] satisfies LessonRoute[];
