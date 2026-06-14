import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  homeCards as defaultHomeCards,
  discipleshipSteps as defaultDiscipleshipSteps,
  creationCards as defaultCreationCards,
  faithDefinitions as defaultFaithDefinitions,
  assuranceGospelSections as defaultAssuranceGospelSections,
  quietTimeStudyItems as defaultQuietTimeStudyItems,
  lessonRoutes as rawDefaultLessonRoutes,
} from '../data/appContent';
import type {
  HomeCard,
  JourneyStep,
  LessonRoute,
  StudyModule,
  GospelSection,
} from '../types/content';

export interface CustomScreenTexts {
  [key: string]: string;
}

const DEFAULT_CUSTOM_TEXTS: CustomScreenTexts = {
  'home:hero-title': '基督門徒訓練',
  'home:hero-subtitle': '在信仰中成長的旅程，一步一腳印。',
  'home:footer-text': '每週更新課程',
  'journey:title': '門徒生命成長路徑',
  'journey:subtitle': 'Discipleship Journey',
  'journey:progress-label': '你的栽培進度',
  'creation:hero-title': '起初，萬物和諧',
  'creation:hero-desc': '在世界的起源，創造主與受造物之間存在著一個完美的連結。',
  'problem:hero-title': '失落的光輝',
  'problem:hero-desc': '在造物主最初的計畫中，人本是尊貴的，直到黑暗遮蔽了視線。',
  'problem:chasm-title': '人的罪使人與神分隔',
  'problem:chasm-desc': '罪惡就像一道無法逾越的鴻溝，攔阻了我們尋求神，也掩蓋了祂對我們的祝福。',
  'problem:gavel-title': '罪的工價就是死',
  'problem:gavel-desc': '罪不僅破壞了現世的生命，更帶來了終極的結局。死後，每個人都必須面對造物主公義的審判。',
  'problem:chasm-death-title': '永遠沉淪',
  'problem:chasm-death-desc': '無論人如何努力，行善、道德或宗教，都無法洗淨靈魂的污點，脫離這必然的結局。',
  'problem:chasm-death-rescue': '無法自救的絕路',
  'problem:footer-title': '縱然人違背了神，神仍是愛人的。',
  'problem:footer-desc': '在黑暗的盡頭，祂為我們預備了一條出路。祂不願一人沉淪，乃願萬人悔改，重新回到祂的懷抱。',
  'bridge:hero-title': '起死回生的橋梁',
  'bridge:hero-desc': '耶穌基督在十字架上的死與復活，搭起了神與人之間唯一的橋樑。',
  'bridge:decision-title': '輪到你了',
  'bridge:decision-desc': '若你願意相信並接受耶穌基督的救贖，歸回神的身邊，你要向神清楚表明你的決定。',
  'salvation:prayer-title': '決志禱告：接受耶穌基督的拯救',
  'salvation:prayer-body': '「神啊，我承認自己是一個有罪的人，違背了你。我知道你愛我，又相信你已藉著耶穌基督為我準備了救贖。我誠心接受耶穌基督為我的救主，求你照你所應許的，赦免我的罪，讓我重新成為你的兒女。又求你今後引導我的生命，讓你賜給我的新生命繼續成長。奉耶穌基督的名禱告，阿們。」',
};

const enrichDefaultRoutes = (routes: LessonRoute[]): LessonRoute[] => {
  return routes.map((route) => {
    if (route.id === 'lesson-salvation-assurance') {
      return {
        ...route,
        modules: [
          {
            id: 'salvation-intro',
            kind: 'content-section',
            title: '得救的確據',
            body: '神為我們預備了耶穌基督的救恩。聖經清楚解釋了這救恩，稱之為「福音」。基督徒就是聽了福音、認罪悔改、憑信心接受耶穌基督為救主的人。請溫習 附件A 的「福音」內容摘要。',
            visual: { accent: 'primary', surface: 'elevated', imageStyle: 'max-w-2xl', eyebrow: 'min-h-auto' }
          },
          {
            id: 'salvation-q1',
            kind: 'reflection-prompt',
            number: '1',
            prompt: '你何時決定憑信心接受耶穌基督為救主？為什麼你會作此決定？',
            storageKey: 'assurance-q1',
            responseMode: 'textarea',
            visual: { accent: 'surface', surface: 'elevated', imageStyle: 'max-w-2xl', eyebrow: 'min-h-auto' }
          },
          {
            id: 'salvation-q2-intro',
            kind: 'content-section',
            title: '哥林多後書 5:17 說：',
            body: '當你接受耶穌基督救恩的那一刻,你的新生命就已經開始了。請記下以下經文如何描述你新生命的狀況。',
            scriptures: [
              {
                book: '哥林多後書',
                reference: '2Cor 5:17',
                chinese: '若有人在基督裏，他就是新造的人。舊事已過，都變成新的了。',
                english: 'So if anyone is in Christ, there is a new creation: everything old has passed away; see, everything has become new!'
              }
            ],
            visual: { accent: 'surface', surface: 'elevated', imageStyle: 'max-w-2xl', eyebrow: 'min-h-auto' }
          },
          {
            id: 'salvation-q2a',
            kind: 'reflection-prompt',
            number: '2a',
            prompt: '約翰福音 5: 24: 關於你的罪和罪所帶來的結果',
            scriptures: [
              {
                book: '約翰福音',
                reference: 'John 5: 24',
                chinese: '我實實在在的告訴你們，那聽我話、又信差我來者的，就有永生，不至於定罪，是已經出死入生了。',
                english: 'Very truly, I tell you, anyone who hears my word and believes him who sent me has eternal life, and does not come under judgment, but has passed from death to life.'
              }
            ],
            storageKey: 'assurance-q2-sin',
            responseMode: 'textarea',
            visual: { accent: 'surface', surface: 'elevated', imageStyle: 'max-w-2xl', eyebrow: 'min-h-auto' }
          },
          {
            id: 'salvation-q2b',
            kind: 'reflection-prompt',
            number: '2b',
            prompt: '約翰一書 5:11-12 及 約翰福音 1:12 關於你與神的關係',
            scriptures: [
              {
                book: '約翰一書',
                reference: '1John 5:11-13',
                chinese: '這見證，就是神賜給我們永生，這永生也是在他兒子裡面。人有了神的兒子就有生命。沒有神的兒子就沒有生命。',
                english: 'And this is the testimony: God gave us eternal life, and this life is in his Son. Whoever has the Son has life; whoever does not have the Son of God, does not have life.'
              },
              {
                book: '約翰福音',
                reference: 'John 1:12',
                chinese: '凡接待他的，就是信他名的人，他就賜他們權柄，作神的兒女。',
                english: 'But to all who received him, who believed in his name, he gave power to become children of God.'
              }
            ],
            storageKey: 'assurance-q2-relationship',
            responseMode: 'textarea',
            visual: { accent: 'surface', surface: 'elevated', imageStyle: 'max-w-2xl', eyebrow: 'min-h-auto' }
          },
          {
            id: 'salvation-q3',
            kind: 'reflection-prompt',
            number: '3',
            prompt: '用自己的文字改寫 約翰一書 5:13',
            scriptures: [
              {
                book: '約翰一書',
                reference: '1John 5:13',
                chinese: '我將這些話寫給你們信奉神兒子之名的人，要叫你們知道自己有永生。',
                english: 'I write these things to you who believe in the name of the Son of God, so that you may know that you have eternal life.'
              }
            ],
            storageKey: 'assurance-q3',
            responseMode: 'textarea',
            visual: { accent: 'surface', surface: 'elevated', imageStyle: 'max-w-2xl', eyebrow: 'min-h-auto' }
          },
          {
            id: 'salvation-q4',
            kind: 'reflection-prompt',
            number: '4',
            prompt: '在 約翰一書 5:13 中，神不僅應許你已經擁有永生，祂更要你對此有確切的把握。你認為確信自己有永生為什麼如此重要呢？',
            storageKey: 'assurance-q4',
            responseMode: 'textarea',
            visual: { accent: 'surface', surface: 'elevated', imageStyle: 'max-w-2xl', eyebrow: 'min-h-auto' }
          },
          {
            id: 'salvation-gospel-review',
            kind: 'appendix',
            title: '附件A : 與神和好的褔音',
            display: 'modal',
            visual: { accent: 'tertiary', surface: 'glass', imageStyle: 'max-w-2xl', eyebrow: 'min-h-auto' }
          },
          {
            id: 'salvation-prayer',
            kind: 'prayer',
            title: '決志禱告：接受耶穌基督的拯救',
            body: '「神啊，我承認自己是一個有罪的人，違背了你。我知道你愛我，又相信你已藉著耶穌基督為我準備了救贖。我誠心接受耶穌基督為我的救主，求你照你所應許的，赦免我的罪，讓我重新成為你的兒女。又求你今後引導我的生命，讓你賜給我的新生命繼續成長。奉耶穌基督的名禱告，阿們。」',
            visual: { accent: 'surface', surface: 'elevated', imageStyle: 'max-w-2xl', eyebrow: 'min-h-auto' }
          },
          {
            id: 'salvation-extension-a',
            kind: 'extension-card',
            title: '你到底得救了嗎？',
            route: '/journey/salvation-assurance/are-you-saved',
            description: '延伸學習得救確據的反思、引文與教導架構。',
            visual: { accent: 'surface', surface: 'elevated', imageStyle: 'max-w-2xl', eyebrow: 'min-h-auto' }
          },
          {
            id: 'salvation-extension-b',
            kind: 'extension-card',
            title: '確信 vs 迷信',
            route: '/journey/salvation-assurance/faith-vs-superstition',
            description: '延伸學習信心、確據與迷信之間的分辨。',
            visual: { accent: 'surface', surface: 'elevated', imageStyle: 'max-w-2xl', eyebrow: 'min-h-auto' }
          }
        ]
      };
    }
    if (route.id === 'lesson-quiet-time') {
      return {
        ...route,
        modules: [
          {
            id: 'quiet-time-intro',
            kind: 'content-section',
            title: '靈修',
            body: '「靈修」是指基督徒透過讀聖經和禱告親近神，與神溝通。有規律的靈修能幫助你與神建立更親密的關係，促進新生命成長。',
            visual: { accent: 'primary', surface: 'elevated', imageStyle: 'max-w-2xl', eyebrow: 'min-h-auto' }
          },
          {
            id: 'quiet-time-q1',
            kind: 'reflection-prompt',
            number: '1',
            prompt: '從以下經文可見，親近神和遠離神的生活會帶來甚麼不同的結果？ (約翰福音 1:12 說 : 凡接待他的，就是信他名的人，他就賜他們權柄，作神的兒女。)',
            scriptures: [
              {
                book: '約翰福音',
                reference: 'John 1:12',
                chinese: '凡接待他的，就是信他名的人，他就賜他們權柄， 作神的兒女。'
              },
              {
                book: '雅各書',
                reference: 'Jam 4:8',
                chinese: '你們親近神，神就必親近你們。',
                english: 'Draw near to God, and he will draw near to you.'
              },
              {
                book: '以賽亞',
                reference: 'Isa 40:31',
                chinese: '但那等候耶和華的 , 必從新得力，他們必如鷹展翅上騰，他們奔跑卻不困倦，行走卻不疲乏。',
                english: 'But those who wait for the Lord shall renew their strength, they shall mount up with wings like eagles, they shall run and not be weary, they shall walk and not faint.'
              },
              {
                book: '約翰福音',
                reference: 'John 15:5',
                chinese: '我是葡萄樹，你們是枝子，常在我裡面的，我也常在他裡面，這人就多結果子，因為離了我，你們就不能作甚麼。',
                english: 'I am the vine, you are the branches. Those who abide in me and I in them bear much fruit, because apart from me you can do nothing.'
              }
            ],
            storageKey: 'quiet-time-q1',
            responseMode: 'textarea',
            visual: { accent: 'surface', surface: 'elevated', imageStyle: 'max-w-2xl', eyebrow: 'min-h-auto' }
          },
          {
            id: 'quiet-time-q2a',
            kind: 'reflection-prompt',
            number: '2a',
            prompt: '聖經記載了甚麼？研讀聖經能給你甚麼幫助？ 提摩太後書 3:16-17',
            scriptures: [
              {
                book: '提摩太後書',
                reference: '2Tim 3:16-17',
                chinese: '聖經都是神所默示的，於教訓、督責、使人歸正、教導人學義，都是有益的，叫屬神的人得以完全，預備行各樣的善事。'
              }
            ],
            storageKey: 'quiet-time-q2a',
            responseMode: 'textarea',
            visual: { accent: 'surface', surface: 'elevated', imageStyle: 'max-w-2xl', eyebrow: 'min-h-auto' }
          },
          {
            id: 'quiet-time-q2b',
            kind: 'reflection-prompt',
            number: '2b',
            prompt: '什麼是禱告?你為什麼要向神禱告？ 約翰福音 16:24；腓立比書 4:6-7',
            scriptures: [
              {
                book: '約翰福音',
                reference: 'John 16:24',
                chinese: '向來你們沒有奉我的名求甚麼， 如今你們求就必得著，叫你們的喜樂可以滿足。',
                english: 'Until now you have not asked for anything in my name. Ask and you will receive, so that your joy may be complete.'
              },
              {
                book: '腓立比書',
                reference: 'Phil 4:6-7',
                chinese: '應當一無掛慮，只要凡事藉著禱告、祈求、和感謝，將你們所要的告訴神。神所賜出人意外的平安，必在基督耶穌裡保守你們的心懷意念。',
                english: 'Do not worry about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.'
              }
            ],
            storageKey: 'quiet-time-q2b',
            responseMode: 'textarea',
            visual: { accent: 'surface', surface: 'elevated', imageStyle: 'max-w-2xl', eyebrow: 'min-h-auto' }
          },
          {
            id: 'quiet-time-q3',
            kind: 'reflection-prompt',
            number: '3',
            prompt: '從 馬可福音 1:35，可見主耶穌如何親近神 (時間、地方、方式、處境)：',
            scriptures: [
              {
                book: '馬可福音',
                reference: 'Mark 1:35',
                chinese: '次日早晨，天未亮的時候，耶穌起來到曠野地方去，在那裡禱告。',
                english: 'In the morning, while it was still very dark, he got up and went out to a deserted place, and there he prayed.'
              }
            ],
            storageKey: 'quiet-time-q3-time-place',
            responseMode: 'textarea',
            visual: { accent: 'surface', surface: 'elevated', imageStyle: 'max-w-2xl', eyebrow: 'min-h-auto' }
          },
          {
            id: 'quiet-time-q4',
            kind: 'reflection-prompt',
            number: '4',
            prompt: '請查看 附件A 的聖經書卷目錄與縮寫，並在下方寫下你翻閱聖經或默想經文的感受。',
            storageKey: 'quiet-time-q4',
            responseMode: 'textarea',
            visual: { accent: 'surface', surface: 'elevated', imageStyle: 'max-w-2xl', eyebrow: 'min-h-auto' }
          },
          {
            id: 'quiet-time-bible-books',
            kind: 'appendix',
            title: '附件A : 聖經書卷目錄與縮寫',
            display: 'inline',
            visual: { accent: 'tertiary', surface: 'glass', imageStyle: 'max-w-2xl', eyebrow: 'min-h-auto' }
          },
          {
            id: 'quiet-time-extension-a',
            kind: 'extension-card',
            title: '七分鐘與神獨處',
            route: '/journey/quiet-time/seven-minutes-with-god',
            description: '延伸學習 ACTS 禱告步驟、七分鐘摘要表與 Cambridge Seven 材料。',
            visual: { accent: 'surface', surface: 'elevated', imageStyle: 'max-w-2xl', eyebrow: 'min-h-auto' }
          },
          {
            id: 'quiet-time-extension-b',
            kind: 'extension-card',
            title: 'If Quiet Time is New to You',
            route: '/journey/quiet-time/new-to-you',
            description: 'English extension article with practical suggestions and problem/solution sections.',
            visual: { accent: 'surface', surface: 'elevated', imageStyle: 'max-w-2xl', eyebrow: 'min-h-auto' }
          }
        ]
      };
    }
    return route;
  });
};

const defaultEnrichedLessonRoutes = enrichDefaultRoutes(rawDefaultLessonRoutes);

interface ContentState {
  homeCards: HomeCard[];
  discipleshipSteps: JourneyStep[];
  creationCards: typeof defaultCreationCards;
  faithDefinitions: typeof defaultFaithDefinitions;
  assuranceGospelSections: GospelSection[];
  quietTimeStudyItems: typeof defaultQuietTimeStudyItems;
  lessonRoutes: LessonRoute[];
  customScreenTexts: CustomScreenTexts;
}

interface ContentContextType extends ContentState {
  updateHomeCards: (cards: HomeCard[]) => void;
  updateDiscipleshipSteps: (steps: JourneyStep[]) => void;
  updateCreationCards: (cards: typeof defaultCreationCards) => void;
  updateGospelSections: (sections: GospelSection[]) => void;
  updateLessonRoutes: (routes: LessonRoute[]) => void;
  updateCustomText: (key: string, value: string) => void;
  updateCustomTexts: (texts: CustomScreenTexts) => void;
  
  // Dynamic Module management per lesson page
  addCardToLesson: (lessonId: string, index: number, module: StudyModule) => void;
  updateCardInLesson: (lessonId: string, moduleId: string, module: Partial<StudyModule>) => void;
  deleteCardFromLesson: (lessonId: string, moduleId: string) => void;
  reorderCardsInLesson: (lessonId: string, indexA: number, indexB: number) => void;

  resetToDefaults: () => void;
  exportConfig: () => void;
  importConfig: (jsonString: string) => boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'ifu:content_overrides';

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ContentState>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          homeCards: parsed.homeCards || defaultHomeCards,
          discipleshipSteps: parsed.discipleshipSteps || defaultDiscipleshipSteps,
          creationCards: parsed.creationCards || defaultCreationCards,
          faithDefinitions: parsed.faithDefinitions || defaultFaithDefinitions,
          assuranceGospelSections: parsed.assuranceGospelSections || defaultAssuranceGospelSections,
          quietTimeStudyItems: parsed.quietTimeStudyItems || defaultQuietTimeStudyItems,
          lessonRoutes: (parsed.lessonRoutes && parsed.lessonRoutes.length >= defaultEnrichedLessonRoutes.length)
            ? parsed.lessonRoutes
            : defaultEnrichedLessonRoutes,
          customScreenTexts: { ...DEFAULT_CUSTOM_TEXTS, ...(parsed.customScreenTexts || {}) },
        };
      }
    } catch (e) {
      console.error('Error loading content overrides from localStorage', e);
    }
    return {
      homeCards: defaultHomeCards,
      discipleshipSteps: defaultDiscipleshipSteps,
      creationCards: defaultCreationCards,
      faithDefinitions: defaultFaithDefinitions,
      assuranceGospelSections: defaultAssuranceGospelSections,
      quietTimeStudyItems: defaultQuietTimeStudyItems,
      lessonRoutes: defaultEnrichedLessonRoutes,
      customScreenTexts: DEFAULT_CUSTOM_TEXTS,
    };
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateHomeCards = (homeCards: HomeCard[]) => {
    setState((prev) => ({ ...prev, homeCards }));
  };

  const updateDiscipleshipSteps = (discipleshipSteps: JourneyStep[]) => {
    setState((prev) => ({ ...prev, discipleshipSteps }));
  };

  const updateCreationCards = (creationCards: typeof defaultCreationCards) => {
    setState((prev) => ({ ...prev, creationCards }));
  };

  const updateGospelSections = (assuranceGospelSections: GospelSection[]) => {
    setState((prev) => ({ ...prev, assuranceGospelSections }));
  };

  const updateLessonRoutes = (lessonRoutes: LessonRoute[]) => {
    setState((prev) => ({ ...prev, lessonRoutes }));
  };

  const updateCustomText = (key: string, value: string) => {
    setState((prev) => ({
      ...prev,
      customScreenTexts: {
        ...prev.customScreenTexts,
        [key]: value,
      },
    }));
  };

  const updateCustomTexts = (texts: CustomScreenTexts) => {
    setState((prev) => ({
      ...prev,
      customScreenTexts: {
        ...prev.customScreenTexts,
        ...texts,
      },
    }));
  };

  const addCardToLesson = (lessonId: string, index: number, module: StudyModule) => {
    setState((prev) => {
      const nextRoutes = prev.lessonRoutes.map((route) => {
        if (route.id === lessonId) {
          const nextModules = [...route.modules];
          nextModules.splice(index, 0, module);
          return { ...route, modules: nextModules };
        }
        return route;
      });
      return { ...prev, lessonRoutes: nextRoutes };
    });
  };

  const updateCardInLesson = (lessonId: string, moduleId: string, moduleUpdate: Partial<StudyModule>) => {
    setState((prev) => {
      const nextRoutes = prev.lessonRoutes.map((route) => {
        if (route.id === lessonId) {
          const nextModules = route.modules.map((mod) => {
            if (mod.id === moduleId) {
              return { ...mod, ...moduleUpdate } as StudyModule;
            }
            return mod;
          });
          return { ...route, modules: nextModules };
        }
        return route;
      });
      return { ...prev, lessonRoutes: nextRoutes };
    });
  };

  const deleteCardFromLesson = (lessonId: string, moduleId: string) => {
    setState((prev) => {
      const nextRoutes = prev.lessonRoutes.map((route) => {
        if (route.id === lessonId) {
          const nextModules = route.modules.filter((mod) => mod.id !== moduleId);
          return { ...route, modules: nextModules };
        }
        return route;
      });
      return { ...prev, lessonRoutes: nextRoutes };
    });
  };

  const reorderCardsInLesson = (lessonId: string, indexA: number, indexB: number) => {
    setState((prev) => {
      const nextRoutes = prev.lessonRoutes.map((route) => {
        if (route.id === lessonId) {
          const nextModules = [...route.modules];
          const temp = nextModules[indexA];
          if (temp) {
            nextModules[indexA] = nextModules[indexB]!;
            nextModules[indexB] = temp;
          }
          return { ...route, modules: nextModules };
        }
        return route;
      });
      return { ...prev, lessonRoutes: nextRoutes };
    });
  };

  const resetToDefaults = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setState({
      homeCards: defaultHomeCards,
      discipleshipSteps: defaultDiscipleshipSteps,
      creationCards: defaultCreationCards,
      faithDefinitions: defaultFaithDefinitions,
      assuranceGospelSections: defaultAssuranceGospelSections,
      quietTimeStudyItems: defaultQuietTimeStudyItems,
      lessonRoutes: defaultEnrichedLessonRoutes,
      customScreenTexts: DEFAULT_CUSTOM_TEXTS,
    });
  };

  const exportConfig = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'ifu_content_config.json');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importConfig = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      setState({
        homeCards: parsed.homeCards || defaultHomeCards,
        discipleshipSteps: parsed.discipleshipSteps || defaultDiscipleshipSteps,
        creationCards: parsed.creationCards || defaultCreationCards,
        faithDefinitions: parsed.faithDefinitions || defaultFaithDefinitions,
        assuranceGospelSections: parsed.assuranceGospelSections || defaultAssuranceGospelSections,
        quietTimeStudyItems: parsed.quietTimeStudyItems || defaultQuietTimeStudyItems,
        lessonRoutes: parsed.lessonRoutes || defaultEnrichedLessonRoutes,
        customScreenTexts: { ...DEFAULT_CUSTOM_TEXTS, ...(parsed.customScreenTexts || {}) },
      });
      return true;
    } catch (e) {
      console.error('Error importing config JSON', e);
      return false;
    }
  };

  return (
    <ContentContext.Provider
      value={{
        ...state,
        updateHomeCards,
        updateDiscipleshipSteps,
        updateCreationCards,
        updateGospelSections,
        updateLessonRoutes,
        updateCustomText,
        updateCustomTexts,
        addCardToLesson,
        updateCardInLesson,
        deleteCardFromLesson,
        reorderCardsInLesson,
        resetToDefaults,
        exportConfig,
        importConfig,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useAppContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useAppContent must be used within a ContentProvider');
  }
  return context;
};
