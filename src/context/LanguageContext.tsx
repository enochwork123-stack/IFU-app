import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { convertToSimplified } from '../utils/chineseConverter';

export type Language = 'zh-TW' | 'zh-CN' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (text: string) => string;
  tContent: (obj: any, field: string) => any;
  translateText: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Dictionary for English translations of static Chinese UI texts
const UI_TRANSLATIONS: Record<string, string> = {
  // Navigation / Shell
  '首頁': 'Home',
  '栽培': 'Journey',
  '查經': 'Study',
  '檔案': 'Profile',
  '個人檔案': 'Profile',
  '登錄': 'Login',
  '登出此帳號': 'Log Out',
  '返回': 'Back',
  '下一頁': 'Next',
  '上一頁': 'Previous',
  '關閉': 'Close',

  // Home Screen
  '基督門徒訓練': 'Christian Discipleship',
  '在信仰中成長的旅程，一步一腳印。': 'A journey of growth in faith, step by step.',
  '開啟你的旅程': 'Start Your Journey',
  '每週更新課程': 'Weekly updated lessons',
  '認識福音': 'Understand the Gospel',
  '踏出信仰生活的第一步。': 'Take the first step in your faith life.',
  '初信栽培': 'New Believer Discipleship',
  '掌握聖經的教導，使你在基督裡的新生命健康成長。': 'Master biblical teachings to grow your new life in Christ.',
  '查經學習': 'Bible Study',
  '深入探索神的話語。': 'Explore God\'s Word deeply.',

  // Profile Screen
  '個人檔案': 'Profile',
  '個人中心': 'Profile Center',
  '同行中的門徒': 'Disciple on the Journey',
  '進入內容管理後台': 'Content Administration',
  '帳戶設定與資訊': 'Account Settings & Info',
  '語系偏好 (Language)': 'Language Preference',
  '目前系統所顯示的語言': 'The language currently displayed by the system',
  '加入時間': 'Joined Date',
  '您開始使用此門徒訓練系統的日期': 'The date you started using this discipleship system',
  '靈修卡片': 'Quiet Times',
  '栽培進度': 'Discipleship Progress',
  '每日靈修': 'Daily Devotion',
  '天': 'days',
  '剛加入': 'Just joined',

  // Journey Overview
  '門徒生命成長路徑': 'Discipleship Journey',
  '你的栽培進度': 'Your Progress',
  '已完成': 'Completed',
  '未解鎖': 'Locked',
  '開始學習': 'Start',
  '繼續學習': 'Continue',

  // Library / Bible Study
  '搜尋研讀卡片或章節...': 'Search study cards or chapters...',
  '全部主題': 'All Topics',

  // General UI labels
  '已自動儲存': 'Saved',
  '你的答案': 'Your Answer',
  '在這裡輸入你的答案...': 'Enter your answer here...',
  '查看附件': 'View Appendix',
  '開始延伸學習': 'Start Extension Study',
  '聖經引錄': 'Bible Passage',
  '神的話語': 'God\'s Word',
  '聖經書卷目錄與縮寫': 'Bible Books & Abbreviations',
  '舊約聖經書卷 (共39)': 'Old Testament Books (39)',
  '新約聖經書卷 (共27)': 'New Testament Books (27)',
  '縮寫': 'Abbreviation',
  '中文書名': 'Chinese Title',
  '加載中或無此課程...': 'Loading or lesson not found...',

  // Scripture Card titles & specific scriptures that are hardcoded
  '彼得前書 3:18': '1 Peter 3:18',
  '基督也曾一次為罪受苦，就是義的代替不義的，為要引我們到神面前。': 'For Christ also suffered once for sins, the righteous for the unrighteous, to bring you to God.',
  '哥林多前書 15:3-6': '1 Corinthians 15:3-6',
  '基督照聖經所說，為我們的罪死了，而且埋葬了，又照聖經所說，第三天復活了。': 'Christ died for our sins according to the Scriptures, and that he was buried, and that he was raised on the third day according to the Scriptures.',
  '約翰福音 5:24': 'John 5:24',
  '那聽我話、又信差我來者的，就有永生，不至於定罪，是已經出死入生了。': 'Anyone who hears my word and believes him who sent me has eternal life, and does not come under judgment, but has passed from death to life.',
  '創世記 1:26-27': 'Genesis 1:26-27',
  '神說：我們要照著我們的形像、按著我們的樣式造人……神就照著自己的形像造人，乃是照著他的形像造男造女。': 'God said, "Let us make humankind in our image, according to our likeness..." So God created humankind in his image, in the image of God he created them; male and female he created them.',
  '諸天述說神的榮耀，穹蒼傳揚他的手段。': 'The heavens are telling the glory of God; and the firmament proclaims his handiwork.',
  '詩篇 19:1': 'Psalm 19:1',
  '唯一的橋樑': 'The Only Bridge',
  '然而神與人之間的鴻溝極大，只有神所預備的唯一橋樑才能跨越，把人救贖。': 'However, the chasm between God and man is vast, and only the unique bridge prepared by God can span it to redeem mankind.',
  '神救贖人的計劃是：祂親自以人的身份來到世上，稱為神的兒子耶穌基督，為我們的罪被釘死在十字架上，三日後復活。': 'God\'s plan of redemption is: He came to earth in human form, known as Jesus Christ the Son of God, was crucified on the cross for our sins, and rose again on the third day.',
  '耶穌的救贖': 'Redemption of Jesus',
  '耶穌以死來替我們擔負罪的刑罰。祂的復活顯明祂是神，而且戰勝了死亡和罪惡。': 'Jesus died to bear the penalty of our sins. His resurrection demonstrates that He is God and has triumphed over death and sin.',
  '神已建好了救贖的橋樑': 'God Has Built the Bridge of Redemption',
  '但到底哪些人才有資格通過？下一步會看聖經如何說明人的回應。': 'But who is qualified to cross it? Next we will see what the Bible says about human response.',
  'STEP 3 / 4': 'STEP 3 / 4',
  'STEP 4 / 4': 'STEP 4 / 4',
  'Next: 人的問題': 'Next: The Human Problem',
  'Next: 人的回應': 'Next: The Human Response',
  '神的創造': 'God\'s Creation',
  '人的問題': 'The Human Problem',
  '人的回應': 'The Human Response',
  '聖潔 HOLY': 'HOLY',
  '罪人 SINNER': 'SINNER',
  '可惜人選擇了犯罪離開神，像與神分隔在': 'Regrettably, humans chose to sin and leave God, separated as if on opposite sides of a ',
  '懸崖的兩邊。': 'cliff.',
  '那些聽到福音、願意悔改歸回神身邊的人，只要信，就是相信並接受，就能得到耶穌的拯救，與神重建關係。': 'Those who hear the gospel and are willing to repent and return to God, if they believe—that is, accept and trust—can receive Jesus\' salvation and rebuild their relationship with God.',
  '經文根基': 'Scriptural Foundation',
  '何為「信」？': 'What is "Faith"?',
  '出死入生': 'From Death to Life',
  '任何人若誠心相信接受耶穌基督的拯救，他便立刻得到這拯救，就是罪得赦免，已經出死入生，成為神的兒女，有永遠與神一起的新生命。': 'Anyone who sincerely believes and accepts Jesus Christ\'s salvation receives it immediately: sins forgiven, passed from death to life, becoming a child of God, with eternal new life in Him.',
  '決志禱告：接受耶穌基督的拯救': 'Decision Prayer: Accepting Jesus Christ\'s Salvation',
  '「神啊，我承認自己是一個有罪的人，違背了你。我知道你愛我，又相信你已藉著耶穌基督為我準備了救贖。我誠心接受耶穌基督為我的救主，求你照你所應許的，赦免我的罪，讓我重新成為你的兒女。又求你今後引導我的生命，讓你賜給我的新生命繼續成長。奉耶穌基督的名禱告，阿們。」': '"God, I admit that I am a sinner and have gone against you. I know you love me, and I believe you have prepared redemption for me through Jesus Christ. I sincerely accept Jesus Christ as my Savior, and ask that you forgive my sins, as you promised, and make me your child again. Please guide my life from now on, so that the new life you have given me continues to grow. In Jesus\' name, Amen."',
  '輪到你了': 'It\'s Your Turn',
  '若你願意相信並接受耶穌基督的救贖，歸回神的身邊，你要向神清楚表明你的決定。': 'If you are willing to believe and accept Jesus Christ\'s redemption and return to God, you should make your decision clear to Him.',
  '恭喜你完成了這部分的學習！': 'Congratulations on completing this section of study!',
  '你已經掌握了福音的核心內容。': 'You have mastered the core contents of the gospel.',
  '回到栽培首頁': 'Back to Discipleship',
  '開啟下一章節': 'Start Next Chapter',
  '得救的確據': 'Assurance of Salvation',
  '靈修': 'Quiet Time',
  '七分鐘與神獨處': 'Seven Minutes with God',
  'If Quiet Time is New to You': 'If Quiet Time is New to You',
  '確信 vs 迷信': 'Assurance vs Superstition',
  '你何時決定憑信心接受耶穌基督為救主？為什麼你會作此決定？': 'When did you decide to accept Jesus Christ as your Savior by faith? Why did you make this decision?',
  '已自動儲存': 'Saved',
  '約翰福音 1:12 說 : 凡接待他的，就是信他名的人，他就賜他們權柄，作神的兒女。': 'John 1:12: But to all who received him, who believed in his name, he gave power to become children of God.',
  '雅各書 4:8 說 : 你們親近神，神就必親近你們。': 'James 4:8: Draw near to God, and he will draw near to you.',
  '以賽亞書 40:31 說 : 但那等候耶和華的，必從新得力...': 'Isaiah 40:31: But those who wait for the Lord shall renew their strength...',
  '約翰福音 15:5 說 : 我是葡萄樹，你們是枝子...': 'John 15:5: I am the vine, you are the branches...',
  '提摩太後書 3:16-17 說 : 聖經都是神所默示的...': '2 Timothy 3:16-17: All scripture is inspired by God...',
  '約翰福音 16:24 說 : 向來你們沒有奉我的名求什麼...': 'John 16:24: Until now you have not asked for anything...',
  '腓立比書 4:6-7 說 : 應當一無掛慮...': 'Philippians 4:6-7: Do not worry about anything...',
  '馬可福音 1:35 說 : 次日早晨，天未亮的時候...': 'Mark 1:35: In the morning, while it was still very dark...',
  '請查看 附件A 的聖經書卷目錄與縮寫，並在下方寫下你翻閱聖經或默想經文的感受。': 'Please read the Bible Books directory and abbreviations in Appendix A, and write down your feelings about reading or meditating on the scriptures below.',
  '七分鐘與神獨處': 'Seven Minutes with God',
  '延伸學習 ACTS 禱告步驟、七分鐘摘要表與 Cambridge Seven 材料。': 'Extended study on the ACTS prayer steps, seven-minute summary table, and Cambridge Seven materials.',
  'English extension article with practical suggestions and problem/solution sections.': 'English extension article with practical suggestions and problem/solution sections.',
  '延伸學習得救確據的反思、引文與教導架構。': 'Extended study on reflections, citations, and teaching structures for the assurance of salvation.',
  '延伸學習信心、確據與迷信之間的分辨。': 'Extended study on distinguishing faith, assurance, and superstition.',
  '你到底得救了嗎？': 'Are You Saved?',
  '神': 'God',
  '人': 'Man',
  '起初，萬物和諧': 'In the beginning, all was harmony',
  '在世界的起源，創造主與受造物之間存在著一個完美的連結。': 'At the origin of the world, a perfect connection existed between the Creator and the creation.',
  '「諸天述說神的榮耀，穹蒼傳揚他的手段。」(詩篇 19:1)': '"The heavens are telling the glory of God; and the firmament proclaims his handiwork." (Psalm 19:1)',
  '失落的光輝': 'The Lost Splendor',
  '在造物主最初的計畫中，人本是尊貴的，直到黑暗遮蔽了視線。': 'In the Creator\'s original plan, man was noble, until darkness obscured his vision.',
  '罪': 'Sin',
  '世人都犯了罪': 'All Have Sinned',
  '聖經指出人人人犯了罪，就是在思想和行為上違背神，偏離了祂良善的標準。': 'The Bible points out that everyone has sinned, going against God in thought and deed, deviating from His good standard.',
  '羅馬書 3:23': 'Romans 3:23',
  '因為世人都犯了罪，虧缺了神的榮耀。': 'for all have sinned and fall short of the glory of God,',
  '以賽亞書 59:2': 'Isaiah 59:2',
  '但你們的罪孽使你們與神隔絕；你們的罪惡使他掩面不聽你們。': 'but your iniquities have made a separation between you and your God, and your sins have hidden his face from you so that he does not hear.',
  '人的罪使人與神分隔': 'Human Sin Separates Man from God',
  '罪惡就像一道無法逾越 of 鴻溝，攔阻了我們尋求神，也掩蓋了祂對我們的祝福。': 'Sin is like an impassable gulf, blocking us from seeking God and hiding His blessings from us.',
  '罪的工價使人與神分隔': 'Human Sin Separates Man from God',
  '罪的工價就是死': 'The Wages of Sin Is Death',
  '罪不僅破壞了現世的生命，更帶來了終極的結局。死後，每個人都必須面對造物主公義的審判。': 'Sin not only destroys this earthly life but brings the ultimate consequence. After death, everyone must face the righteous judgment of the Creator.',
  '羅馬書 6:23': 'Romans 6:23',
  '因為罪的工價乃是死；惟有神的恩賜，在我們的主基督耶穌裡，乃是永生。': 'For the wages of sin is death, but the free gift of God is eternal life in Christ Jesus our Lord.',
  '希伯來書 9:27': 'Hebrews 9:27',
  '按著定命，人人人有一死，死後且有審判。': 'And just as it is appointed for man to die once, and after that comes judgment,',
  '帖撒羅尼迦後書 1:8-9': '2 Thessalonians 1:8-9',
  '要報應那不認識神和那不聽從我主耶穌福音的人。': 'inflicting vengeance on those who do not know God and on those who do not obey the gospel of our Lord Jesus,',
  '永遠沉淪': 'Eternal Perdition',
  '無法自救的絕路': 'The Dead End of Self-Rescue',
  '無論人如何努力，行善、道德或宗教，都無法洗淨靈魂的污點，脫離這必然的結局。': 'No matter how hard humans try, through good deeds, morality, or religion, they cannot wash away the stain of the soul or escape this inevitable end.',
  '縱然人違背了神，神仍是愛人的。': 'Even though man went against God, God still loves him.',
  '在黑暗的盡頭，祂為我們預備了一條出路。祂不願一人沉淪，乃願萬人悔改，重新回到祂的懷抱。': 'At the end of darkness, He prepared a way out for us. He does not wish for any to perish, but all to come to repentance, returning to His embrace.',
  'NEXT: 神的拯救': 'NEXT: God\'s Salvation',
  '初信栽培': 'New Believer Discipleship',
  '掌握聖經的教導，使你在基督裡的新生命健康成長。': 'Master biblical teachings to grow your new life in Christ.',
  '栽培進度': 'Progress',
  '已完成': 'Completed',
  '開始學習': 'Start',
  '神的拯救': 'God\'s Salvation',
  '神拯救人的計劃': 'God\'s Plan of Salvation',
  '羅馬書 5:8': 'Romans 5:8',
  '惟有基督在我們還作罪人的時候為我們死，神的愛就在此向我們顯明了。': 'But God shows his love for us in that while we were still sinners, Christ died for us.',
  '哥林多前書 15:3-6': '1 Corinthians 15:3-6',
  '基督照聖經所說，為我們的罪死了，而且埋葬了，又照聖經所說，第三天復活了，並且顯給磯法看，然後顯給十二使徒看，後來一時顯給五百多弟兄看。': 'that Christ died for our sins in accordance with the Scriptures, that he was buried, that he was raised on the third day in accordance with the Scriptures, and that he appeared to Cephas, then to the twelve. Then he appeared to more than five hundred brothers at one time,',
  '因基督也曾一次為罪受苦，就是義的代替不義的，為要引我們到神面前。按著肉體說，他被治死；按著靈性說，他復活了。': 'For Christ also suffered once for sins, the righteous for the unrighteous, that he might bring us to God, being put to death in the flesh but made alive in the spirit,',
  '誠心祈求 · 開啟新生命': 'Sincere Prayer · Open New Life',
  '約翰福音 1:12': 'John 1:12',
  '凡接待他的，就是信他名的人，他就賜他們權柄，作神的兒女。': 'But to all who did receive him, who believed in his name, he gave the right to become children of God,',
  '我實實在在地告訴你們：那聽我話、又信差我來者的，就有永生，不至於定罪，是已經出死入生了。': 'Truly, truly, I say to you, whoever hears my word and believes him who sent me has eternal life. He does not come into judgment, but has passed from death to life.',
  '何為「信」？': 'What is "Faith"?',
  '出死入生': 'From Death to Life',
  '罪惡就像一道無法逾越的鴻溝，攔阻了我們尋求神，也掩蓋了祂對我們的祝福。': 'Sin is like an impassable gulf, blocking us from seeking God and hiding His blessings from us.',
  '決志禱告：接受耶穌基督的拯救': 'Decision Prayer: Accepting Jesus Christ\'s Salvation',
  '「神啊，我承認自己是一個有罪的人，違背了你。我知道你愛我，又相信你已藉著耶穌基督為我準備了救贖。我誠心接受耶穌基督為我的救主，求你照你所應許的，赦免我的罪，讓我重新成為你的兒女。又求你今後引導我的生命，讓你賜給我的新生命繼續成長。奉耶穌基督的名禱告，阿們。」': '"God, I admit that I am a sinner and have gone against you. I know you love me, and I believe you have prepared redemption for me through Jesus Christ. I sincerely accept Jesus Christ as my Savior, and ask that you forgive my sins, as you promised, and make me your child again. Please guide my life from now on, so that the new life you have given me continues to grow. In Jesus\' name, Amen."',
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const [language, setLanguageState] = useState<Language>(() => {
    const local = localStorage.getItem('ifu:language');
    if (local === 'zh-TW' || local === 'zh-CN' || local === 'en') {
      return local;
    }
    return 'zh-TW';
  });

  // Sync state with profile language if loaded
  useEffect(() => {
    if (profile?.language) {
      const dbLang = profile.language as Language;
      if (dbLang === 'zh-TW' || dbLang === 'zh-CN' || dbLang === 'en') {
        setLanguageState(dbLang);
        localStorage.setItem('ifu:language', dbLang);
      }
    }
  }, [profile]);

  const setLanguage = async (newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem('ifu:language', newLang);
    if (user) {
      try {
        await supabase
          .from('profiles')
          .update({ language: newLang })
          .eq('id', user.id);
      } catch (err) {
        console.error('Error updating profile language in Supabase:', err);
      }
    }
  };

  const translateText = (text: string, overrideLang?: Language): string => {
    if (!text) return '';
    const lang = overrideLang || language;
    if (lang === 'zh-CN') {
      return convertToSimplified(text);
    }
    return text;
  };

  // Translate static UI labels
  const t = (text: string, overrideLang?: Language): string => {
    if (!text) return '';
    const lang = overrideLang || language;
    if (lang === 'en') {
      return UI_TRANSLATIONS[text] || text;
    }
    if (lang === 'zh-CN') {
      return convertToSimplified(text);
    }
    return text;
  };

  // Retrieve localized content fields (handling fallback and Simplified conversion)
  const tContent = (obj: any, field: string, overrideLang?: Language): any => {
    if (!obj) return '';
    const lang = overrideLang || language;

    let val = '';
    if (lang === 'en') {
      const enField = `${field}_en`;
      if (obj[enField]) {
        val = obj[enField];
      } else {
        const rawVal = obj[field] || '';
        val = typeof rawVal === 'string' ? t(rawVal, 'en') : rawVal;
      }
    } else {
      val = obj[field] || '';
    }

    if (typeof val === 'string') {
      if (lang === 'zh-CN') {
        return convertToSimplified(val);
      }
      return val;
    }

    if (Array.isArray(val)) {
      return val.map((item) => {
        if (typeof item === 'string') {
          return lang === 'zh-CN' ? convertToSimplified(item) : (lang === 'en' ? t(item, 'en') : item);
        }
        if (typeof item === 'object' && item !== null) {
          // Deep clone and translate text field recursively if it's a LessonPoint or similar
          const newItem = { ...item };
          if ('text' in newItem) {
            newItem.text = tContent(newItem, 'text', lang);
          }
          return newItem;
        }
        return item;
      });
    }

    return val;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tContent, translateText }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
export default LanguageContext;
