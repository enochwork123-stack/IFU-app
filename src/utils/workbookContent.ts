/**
 * Complete Discipleship Workbook Content (All 12 Steps with Bible Verses & Questions)
 */

export interface WorkbookScripture {
  book: string;
  reference: string;
  chinese: string;
  english?: string;
}

export interface WorkbookQuestion {
  id: string;
  number: string;
  title: string;
  prompt: string;
  storageKeys: string[]; // Primary storage key and any aliases
  scriptures?: WorkbookScripture[];
}

export interface WorkbookStep {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  questions: WorkbookQuestion[];
}

export const COMPLETE_DISCIPLESHIP_WORKBOOK: WorkbookStep[] = [
  {
    id: 'salvation-assurance',
    order: 1,
    title: '得救的確據',
    subtitle: 'Assurance of Salvation',
    description: '了解上帝的應許與新生命的真實性，確信永生的禮物。',
    questions: [
      {
        id: 'salvation-q1',
        number: '1',
        title: '接受救恩的決定',
        prompt: '你何時決定憑信心接受耶穌基督為救主？為什麼你會作此決定？',
        storageKeys: ['ifu:assurance-q1', 'ifu:salvation-q1'],
      },
      {
        id: 'salvation-q2-corinthians',
        number: '2',
        title: '新生命的開始 (哥林多後書 5:17)',
        prompt: '當你接受耶穌基督救恩的那一刻，你的新生命就已經開始了。請記下以下經文如何描述你新生命的狀況。',
        storageKeys: ['ifu:assurance-q2-2cor-5-17', 'ifu:assurance-q2-corinthians', 'ifu:salvation-q2-intro'],
        scriptures: [
          {
            book: '哥林多後書',
            reference: '2Cor 5:17',
            chinese: '若有人在基督裏，他就是新造的人。舊事已過，都變成新的了。',
            english: 'So if anyone is in Christ, there is a new creation: everything old has passed away; see, everything has become new!',
          },
        ],
      },
      {
        id: 'salvation-q2a',
        number: '2a',
        title: '出死入生 (約翰福音 5:24)',
        prompt: '約翰福音 5:24：關於你的罪和罪所帶來的結果，經文如何說明？',
        storageKeys: ['ifu:assurance-q2-sin', 'ifu:salvation-q2a'],
        scriptures: [
          {
            book: '約翰福音',
            reference: 'John 5:24',
            chinese: '我實實在在的告訴你們，那聽我話、又信差我來者的，就有永生，不至於定罪，是已經出死入生了。',
            english: 'Very truly, I tell you, anyone who hears my word and believes him who sent me has eternal life, and does not come under judgment, but has passed from death to life.',
          },
        ],
      },
      {
        id: 'salvation-q2b',
        number: '2b',
        title: '神的兒女 (約翰一書 5:11-12 & 約翰福音 1:12)',
        prompt: '約翰一書 5:11-12 及 約翰福音 1:12：關於你與神的關係，經文有何應許？',
        storageKeys: ['ifu:assurance-q2-relationship', 'ifu:salvation-q2b', 'ifu:salvation-assurance:john-1-12'],
        scriptures: [
          {
            book: '約翰一書',
            reference: '1John 5:11-12',
            chinese: '這見證，就是神賜給我們永生，這永生也是在他兒子裡面。人有了神的兒子就有生命。沒有神的兒子就沒有生命。',
            english: 'And this is the testimony: God gave us eternal life, and this life is in his Son. Whoever has the Son has life; whoever does not have the Son of God, does not have life.',
          },
          {
            book: '約翰福音',
            reference: 'John 1:12',
            chinese: '凡接待他的，就是信他名的人，他就賜他們權柄，作神的兒女。',
            english: 'But to all who received him, who believed in his name, he gave power to become children of God.',
          },
        ],
      },
      {
        id: 'salvation-q3',
        number: '3',
        title: '知道自己有永生 (約翰一書 5:13)',
        prompt: '用自己的文字改寫 約翰一書 5:13，表達你對永生的確據：',
        storageKeys: ['ifu:assurance-q3', 'ifu:salvation-q3'],
        scriptures: [
          {
            book: '約翰一書',
            reference: '1John 5:13',
            chinese: '我將這些話寫給你們信奉神兒子之名的人，要叫你們知道自己有永生。',
            english: 'I write these things to you who believe in the name of the Son of God, so that you may know that you have eternal life.',
          },
        ],
      },
      {
        id: 'salvation-q4',
        number: '4',
        title: '永不滅亡的保障 (約翰福音 10:27-29)',
        prompt: '當你軟弱或懷疑時，這段經文給你甚麼安慰與確據？',
        storageKeys: ['ifu:assurance-q4', 'ifu:salvation-q4'],
        scriptures: [
          {
            book: '約翰福音',
            reference: 'John 10:27-29',
            chinese: '我的羊聽我的聲音，我也認識他們，他們也跟著我。我又賜給他們永生；他們永不滅亡，誰也不能從我手裡把他們奪去。我父把羊賜給我，他比萬有都大，誰也不能從我父手裡把他們奪去。',
            english: 'My sheep hear my voice. I know them, and they follow me. I give them eternal life, and they will never perish. No one will snatch them out of my hand.',
          },
        ],
      },
    ],
  },
  {
    id: 'quiet-time',
    order: 2,
    title: '靈修',
    subtitle: 'Quiet Time',
    description: '學習如何每天花時間與神親近。',
    questions: [
      {
        id: 'qt-q1',
        number: '1',
        title: '靈修的意義與目的',
        prompt: '你認為每天定時與神親近（靈修）對你的新生命有何重要性？',
        storageKeys: ['ifu:quiet-time:scripture-study', 'ifu:quiet-time-reflection-1', 'ifu:quiet-time-q1'],
        scriptures: [
          {
            book: '詩篇',
            reference: 'Psalm 119:105',
            chinese: '你的話是我腳前的燈，是我路上的光。',
            english: 'Your word is a lamp to my feet and a light to my path.',
          },
          {
            book: '馬可福音',
            reference: 'Mark 1:35',
            chinese: '次日早晨，天未亮的時候，耶穌起來，到曠野地方去，在那裡禱告。',
            english: 'In the morning, while it was still very dark, he got up and went out to a deserted place, and there he prayed.',
          },
        ],
      },
      {
        id: 'qt-q2',
        number: '2',
        title: '靈修中的讀經與祈禱',
        prompt: '在靈修過程中，讀經與禱告如何幫助你明白神的旨意並得著力量？',
        storageKeys: ['ifu:quiet-time:prayer-study', 'ifu:quiet-time-reflection-2', 'ifu:quiet-time-q2'],
        scriptures: [
          {
            book: '詩篇',
            reference: 'Psalm 5:3',
            chinese: '耶和華啊，早晨你必聽我的聲音；早晨我必向你陳明我的心意，並要警醒！',
            english: 'O Lord, in the morning you hear my voice; in the morning I plead my case to you, and watch.',
          },
        ],
      },
    ],
  },
  {
    id: 'prayer-assurance',
    order: 3,
    title: '禱告的確據',
    subtitle: 'Assurance of Prayer',
    description: '確信上帝垂聽並回應屬祂兒女的呼求。',
    questions: [
      {
        id: 'prayer-q1',
        number: '1',
        title: '隨時向神傾心吐意 (詩篇 62:8)',
        prompt: '根據詩篇 62:8，我們可以隨時向神做甚麼？為甚麼？',
        storageKeys: ['ifu:prayer-assurance:q1', 'ifu:prayer-assurance-q1'],
        scriptures: [
          {
            book: '詩篇',
            reference: 'Psalm 62:8',
            chinese: '你們眾民當時時倚靠他，在他面前傾心吐意，神是我們的避難所。',
            english: 'Trust in him at all times, O people; pour out your heart before him; God is a refuge for us.',
          },
        ],
      },
      {
        id: 'prayer-q2',
        number: '2',
        title: '天父將好東西賜給求祂的人 (馬太福音 7:9-11)',
        prompt: '根據馬太福音 7:9-11，耶穌怎樣形容天父回應兒女禱告的心意？',
        storageKeys: ['ifu:prayer-assurance:q2', 'ifu:prayer-assurance-q2'],
        scriptures: [
          {
            book: '馬太福音',
            reference: 'Matt 7:9-11',
            chinese: '你們中間誰有兒子求餅，反給他石頭呢？求魚，反給他蛇呢？你們雖然不好，尚且知道拿好東西給兒女，何況你們在天上的父，豈不更把好東西給求他的人嗎？',
            english: 'Is there anyone among you who, if your child asks for bread, will give a stone? Or if the child asks for a fish, will give a snake? If you then, who are evil, know how to give good gifts to your children, how much more will your Father in heaven give good things to those who ask him!',
          },
        ],
      },
      {
        id: 'prayer-q3',
        number: '3',
        title: '照神旨意祈求的坦然無懼 (約翰一書 5:14-15)',
        prompt: '根據約翰一書 5:14-15，蒙神垂聽禱告的關鍵條件是甚麼？',
        storageKeys: ['ifu:prayer-assurance:q3', 'ifu:prayer-assurance-q3'],
        scriptures: [
          {
            book: '約翰一書',
            reference: '1John 5:14-15',
            chinese: '我們若照他的旨意求甚麼，他就聽我們，這是我們向他所存坦然無懼的心。既然知道他聽我們一切所求的，就知道我們所求於他的，無不得著。',
            english: 'And this is the boldness we have in him, that if we ask anything according to his will, he hears us. And if we know that he hears us in whatever we ask, we know that we have obtained the requests made of him.',
          },
        ],
      },
      {
        id: 'prayer-q4',
        number: '4',
        title: '常在主裡面 (約翰福音 15:7)',
        prompt: '根據約翰福音 15:7，我們與主的關係如何影響我們的禱告？',
        storageKeys: ['ifu:prayer-assurance:q4-john15', 'ifu:prayer-assurance-q4', 'ifu:prayer-assurance:q4'],
        scriptures: [
          {
            book: '約翰福音',
            reference: 'John 15:7',
            chinese: '你們若常在我裏面，我的話也常在你們裏面，凡你們所願意的，祈求，就給你們成就。',
            english: 'If you abide in me, and my words abide in you, ask for whatever you wish, and it will be done for you.',
          },
        ],
      },
      {
        id: 'prayer-q5',
        number: '5',
        title: '凡事藉著禱告一無掛慮 (腓立比書 4:6-7)',
        prompt: '根據腓立比書 4:6-7，當我們將一切憂慮交託給神時，神應許賜下甚麼？',
        storageKeys: ['ifu:prayer-assurance:q5', 'ifu:prayer-assurance-q5'],
        scriptures: [
          {
            book: '腓立比書',
            reference: 'Phil 4:6-7',
            chinese: '應當一無掛慮，只要凡事藉著禱告、祈求，和感謝，將你們所要的告訴神。神所賜、出人意外的平安必在基督耶穌裏保守你們的心懷意念。',
            english: 'Do not worry about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.',
          },
        ],
      },
    ],
  },
  {
    id: 'forgiveness-assurance',
    order: 4,
    title: '赦罪的確據',
    subtitle: 'Assurance of Forgiveness',
    description: '經歷基督寶血帶來的平安與過犯的赦免。',
    questions: [
      {
        id: 'forgiveness-q1',
        number: '1',
        title: '認罪與赦免 (約翰一書 1:9)',
        prompt: '根據約翰一書 1:9，當我們向神承認自己的罪時，神基於甚麼屬性赦免我們？',
        storageKeys: ['ifu:forgiveness-assurance:q1', 'ifu:forgiveness-assurance-q1'],
        scriptures: [
          {
            book: '約翰一書',
            reference: '1John 1:9',
            chinese: '我們若認自己的罪，神是信實的，是公義的，必要赦免我們的罪，洗淨我們一切的不義。',
            english: 'If we confess our sins, he who is faithful and just will forgive us our sins and cleanse us from all unrighteousness.',
          },
        ],
      },
      {
        id: 'forgiveness-q2',
        number: '2',
        title: '過犯挪開有多遠 (詩篇 103:12)',
        prompt: '根據詩篇 103:12，神如何處理我們蒙赦免的過犯？',
        storageKeys: ['ifu:forgiveness-assurance:q2', 'ifu:forgiveness-assurance-q2'],
        scriptures: [
          {
            book: '詩篇',
            reference: 'Psalm 103:12',
            chinese: '東離西有多遠，他叫我們的過犯離我們也有多遠！',
            english: 'As far as the east is from the west, so far he removes our transgressions from us.',
          },
        ],
      },
      {
        id: 'forgiveness-q3',
        number: '3',
        title: '在基督裡不被定罪 (羅馬書 8:1)',
        prompt: '根據羅馬書 8:1，在基督耶穌裡的人處於甚麼樣的屬靈地位？',
        storageKeys: ['ifu:forgiveness-assurance:q3', 'ifu:forgiveness-assurance-q3'],
        scriptures: [
          {
            book: '羅馬書',
            reference: 'Rom 8:1',
            chinese: '如今，那些在基督耶穌裏的就不定罪了。',
            english: 'There is therefore now no condemnation for those who are in Christ Jesus.',
          },
        ],
      },
      {
        id: 'forgiveness-q4',
        number: '4',
        title: '愛子的血得蒙救贖 (以弗所書 1:7)',
        prompt: '根據以弗所書 1:7，我們是藉著甚麼得蒙救贖、過犯得赦？',
        storageKeys: ['ifu:forgiveness-assurance:q4', 'ifu:forgiveness-assurance-q4'],
        scriptures: [
          {
            book: '以弗所書',
            reference: 'Eph 1:7',
            chinese: '我們藉這愛子的血得蒙救贖，過犯得以赦免，乃是照他豐富的恩典。',
            english: 'In him we have redemption through his blood, the forgiveness of our trespasses, according to the riches of his grace.',
          },
        ],
      },
      {
        id: 'forgiveness-q5',
        number: '5',
        title: '律例字據釘在十字架上 (歌羅西書 2:13-14)',
        prompt: '根據歌羅西書 2:13-14，十字架如何徹底清除了我們一切的罪債？',
        storageKeys: ['ifu:forgiveness-assurance:q5', 'ifu:forgiveness-assurance-q5'],
        scriptures: [
          {
            book: '歌羅西書',
            reference: 'Col 2:13-14',
            chinese: '神赦免了你們一切過犯，便叫你們與基督一同活過來；又塗抹了在律例上所寫攻擊我們、有礙於我們的字據，把他撤去，釘在十字架上。',
            english: 'And when you were dead in trespasses... God made you alive together with him, when he forgave us all our trespasses, erasing the record that stood against us with its legal demands. He set this aside, nailing it to the cross.',
          },
        ],
      },
    ],
  },
  {
    id: 'victory-assurance',
    order: 5,
    title: '得勝的確據',
    subtitle: 'Assurance of Victory',
    description: '在基督裡勝過試探與挑戰的生活。',
    questions: [
      {
        id: 'victory-q1',
        number: '1',
        title: '神必開一條出路 (哥林多前書 10:13)',
        prompt: '根據哥林多前書 10:13，當我們面臨試探時，神給我們甚麼應許？',
        storageKeys: ['ifu:victory-assurance:q1', 'ifu:victory-assurance-q1'],
        scriptures: [
          {
            book: '哥林多前書',
            reference: '1Cor 10:13',
            chinese: '你們所遇見的試探，無非是人所能受的。神是信實的，必不叫你們受試探過於所能受的；在受試探的時候，總要給你們開一條出路，叫你們能忍受得住。',
            english: 'No testing has overtaken you that is not common to everyone. God is faithful, and he will not let you be tested beyond your strength, but with the testing he will also provide the way out so that you may be able to endure it.',
          },
        ],
      },
      {
        id: 'victory-q2',
        number: '2',
        title: '順服神與抵擋魔鬼 (雅各書 4:7)',
        prompt: '根據雅各書 4:7，勝過魔鬼攻擊與試探的秘訣是甚麼？',
        storageKeys: ['ifu:victory-assurance:q2', 'ifu:victory-assurance-q2'],
        scriptures: [
          {
            book: '雅各書',
            reference: 'Jam 4:7',
            chinese: '故此，你們要順服神。務要抵擋魔鬼，魔鬼就必離開你們逃跑了。',
            english: 'Submit yourselves therefore to God. Resist the devil, and he will flee from you.',
          },
        ],
      },
      {
        id: 'victory-q3',
        number: '3',
        title: '將神的話藏在心裡 (詩篇 119:9, 11)',
        prompt: '根據詩篇 119:9, 11，神的話語如何幫助我們遠離罪惡、過得勝生活？',
        storageKeys: ['ifu:victory-assurance:q3', 'ifu:victory-assurance-q3'],
        scriptures: [
          {
            book: '詩篇',
            reference: 'Psalm 119:9, 11',
            chinese: '少年人用甚麼潔淨他的行為呢？是要遵行你的話。我將你的話藏在心裡，免得我得罪你。',
            english: 'How can young people keep their way pure? By guarding it according to your word. I treasure your word in my heart, so that I may not sin against you.',
          },
        ],
      },
      {
        id: 'victory-q4',
        number: '4',
        title: '在我們裡面的比世界更大 (約翰一書 4:4)',
        prompt: '根據約翰一書 4:4，我們能勝過世界與仇敵的根據是甚麼？',
        storageKeys: ['ifu:victory-assurance:q4', 'ifu:victory-assurance-q4'],
        scriptures: [
          {
            book: '約翰一書',
            reference: '1John 4:4',
            chinese: '小子們哪，你們是屬神的，並且勝了他們；因為那在你們裏面的，比那在世界上的更大。',
            english: 'Little children, you are from God, and have conquered them; for the one who is in you is greater than the one who is in the world.',
          },
        ],
      },
      {
        id: 'victory-q5',
        number: '5',
        title: '靠主得勝有餘 (羅馬書 8:37)',
        prompt: '根據羅馬書 8:37，在面對各樣艱難與困境時，主賜給我們怎樣的得勝？',
        storageKeys: ['ifu:victory-assurance:q5', 'ifu:victory-assurance-q5'],
        scriptures: [
          {
            book: '羅馬書',
            reference: 'Rom 8:37',
            chinese: '然而，靠著愛我們的主，在這一切的事上已經得勝有餘了。',
            english: 'No, in all these things we are more than conquerors through him who loved us.',
          },
        ],
      },
    ],
  },
  {
    id: 'bible-authority',
    order: 6,
    title: '聖經的權威',
    subtitle: 'Authority of the Bible',
    description: '承認上帝的話語是我們生活的最高準則。',
    questions: [
      {
        id: 'bible-auth-q1',
        number: '1',
        title: '神所默示的聖經 (提摩太後書 3:16-17)',
        prompt: '根據提摩太後書 3:16-17，聖經的來源與對屬神之人的功用是甚麼？',
        storageKeys: ['ifu:bible-authority:q1', 'ifu:bible-authority-q1'],
        scriptures: [
          {
            book: '提摩太後書',
            reference: '2Tim 3:16-17',
            chinese: '聖經都是神所默示的，於教訓、督責、使人歸正、教導人學義都是有益的，叫屬神的人得以完全，預備行各樣的善事。',
            english: 'All scripture is inspired by God and is useful for teaching, for reproof, for correction, and for training in righteousness, so that everyone who belongs to God may be proficient, equipped for every good work.',
          },
        ],
      },
      {
        id: 'bible-auth-q2',
        number: '2',
        title: '聖靈感動人說出神的話 (彼得後書 1:20-21)',
        prompt: '根據彼得後書 1:20-21，先知預言是如何寫成的？',
        storageKeys: ['ifu:bible-authority:q2', 'ifu:bible-authority-q2'],
        scriptures: [
          {
            book: '彼得後書',
            reference: '2Pet 1:20-21',
            chinese: '因為預言從來沒有出於人意的，乃是人被聖靈感動，說出神的話來。',
            english: 'First of all you must understand this, that no prophecy of scripture is a matter of one’s own interpretation, because no prophecy ever came by human will, but men and women moved by the Holy Spirit spoke from God.',
          },
        ],
      },
      {
        id: 'bible-auth-q3',
        number: '3',
        title: '活潑有功效的神之道 (希伯來書 4:12)',
        prompt: '根據希伯來書 4:12，神的話語有何等穿透人心的力量？',
        storageKeys: ['ifu:bible-authority:q3', 'ifu:bible-authority-q3'],
        scriptures: [
          {
            book: '希伯來書',
            reference: 'Heb 4:12',
            chinese: '神的道是活潑的，是有功效的，比一切兩刃的劍更快，甚至魂與靈，骨節與骨髓，都能刺入、剖開，連心中的思念和主意都能辨明。',
            english: 'Indeed, the word of God is living and active, sharper than any two-edged sword, piercing until it divides soul from spirit, joints from marrow; it is able to judge the thoughts and intentions of the heart.',
          },
        ],
      },
    ],
  },
  {
    id: 'bible-intake',
    order: 7,
    title: '持守神的話',
    subtitle: 'Intake of the Bible',
    description: '建立恆常讀經、默想與背經的習慣。',
    questions: [
      {
        id: 'bible-intake-q1',
        number: '1',
        title: '聽道與基督的話 (羅馬書 10:17)',
        prompt: '根據羅馬書 10:17，信心是從何而來的？',
        storageKeys: ['ifu:bible-intake:q1', 'ifu:bible-intake-q1'],
        scriptures: [
          {
            book: '羅馬書',
            reference: 'Rom 10:17',
            chinese: '可見信道是從聽道來的，聽道是從基督的話來的。',
            english: 'So faith comes from what is heard, and what is heard comes through the word of Christ.',
          },
        ],
      },
      {
        id: 'bible-intake-q2',
        number: '2',
        title: '天天考查聖經 (使徒行傳 17:11)',
        prompt: '根據使徒行傳 17:11，庇哩亞人如何展現對神話語的認真與渴慕？',
        storageKeys: ['ifu:bible-intake:q2', 'ifu:bible-intake-q2'],
        scriptures: [
          {
            book: '使徒行傳',
            reference: 'Acts 17:11',
            chinese: '這地方的人賢於帖撒羅尼迦的人，甘心領受這道，天天考查聖經，要曉得這道是與不是。',
            english: 'These Jews were more receptive than those in Thessalonica, for they welcomed the message very eagerly and examined the scriptures every day to see whether these things were so.',
          },
        ],
      },
      {
        id: 'bible-intake-q3',
        number: '3',
        title: '晝夜思想的福分 (詩篇 1:2-3)',
        prompt: '根據詩篇 1:2-3，喜愛並晝夜思想神律法的人有何福分？',
        storageKeys: ['ifu:bible-intake:q3', 'ifu:bible-intake-q3'],
        scriptures: [
          {
            book: '詩篇',
            reference: 'Psalm 1:2-3',
            chinese: '惟喜愛耶和華的律法，晝夜思想，這人便為有福！他要像一棵樹栽在溪水旁，按時候結果子，葉子也不枯乾。凡他所做的盡都順利。',
            english: 'Their delight is in the law of the Lord, and on his law they meditate day and night. They are like trees planted by streams of water, which yield their fruit in its season, and their leaves do not wither. In all that they do, they prosper.',
          },
        ],
      },
    ],
  },
  {
    id: 'effective-prayer',
    order: 8,
    title: '有效的祈禱',
    subtitle: 'Effective Prayer',
    description: '學習有根有基的禱告生活與秘訣。',
    questions: [
      {
        id: 'eff-prayer-q1',
        number: '1',
        title: '奉主的名祈求 (約翰福音 16:24)',
        prompt: '根據約翰福音 16:24，耶穌吩咐我們當如何祈求以得著滿足的喜樂？',
        storageKeys: ['ifu:effective-prayer:q1', 'ifu:effective-prayer-q1'],
        scriptures: [
          {
            book: '約翰福音',
            reference: 'John 16:24',
            chinese: '向來你們沒有奉我的名求甚麼，如今你們求，就必得著，叫你們的喜樂可以滿足。',
            english: 'Until now you have not asked for anything in my name. Ask and you will receive, so that your joy may be complete.',
          },
        ],
      },
      {
        id: 'eff-prayer-q2',
        number: '2',
        title: '暗中的禱告與天父察看 (馬太福音 6:6)',
        prompt: '根據馬太福音 6:6，如何建立純全專注的個人禱告生活？',
        storageKeys: ['ifu:effective-prayer:q2', 'ifu:effective-prayer-q2'],
        scriptures: [
          {
            book: '馬太福音',
            reference: 'Matt 6:6',
            chinese: '你禱告的時候，要進你的內屋，關上門，禱告你在暗中的父；你父在暗中察看，必然報答你。',
            english: 'Whenever you pray, go into your room and shut the door and pray to your Father who is in secret; and your Father who sees in secret will reward you.',
          },
        ],
      },
      {
        id: 'eff-prayer-q3',
        number: '3',
        title: '義人祈禱的大功效 (雅各書 5:16)',
        prompt: '根據雅各書 5:16，彼此認罪與互相代求有何果效？',
        storageKeys: ['ifu:effective-prayer:q3', 'ifu:effective-prayer-q3'],
        scriptures: [
          {
            book: '雅各書',
            reference: 'Jam 5:16',
            chinese: '所以你們要彼此認罪，互相代求，使你們可以得醫治。義人祈禱所發的力量是大有功效的。',
            english: 'Therefore confess your sins to one another, and pray for one another, so that you may be healed. The prayer of the righteous is powerful and effective.',
          },
        ],
      },
      {
        id: 'eff-prayer-q4',
        number: '4',
        title: '不住的禱告與凡事謝恩 (帖撒羅尼迦前書 5:16-18)',
        prompt: '根據帖撒羅尼迦前書 5:16-18，神在基督耶穌裡向我們所定的旨意是甚麼？',
        storageKeys: ['ifu:effective-prayer:q4', 'ifu:effective-prayer-q4'],
        scriptures: [
          {
            book: '帖撒羅尼迦前書',
            reference: '1Thess 5:16-18',
            chinese: '要常常喜樂，不住的禱告，凡事謝恩；因為這是神在基督耶穌裏向你們所定的旨意。',
            english: 'Rejoice always, pray without ceasing, give thanks in all circumstances; for this is the will of God in Christ Jesus for you.',
          },
        ],
      },
      {
        id: 'eff-prayer-q5',
        number: '5',
        title: '靠著聖靈隨時多方祈求 (以弗所書 6:18)',
        prompt: '根據以弗所書 6:18，我們在屬靈爭戰中應當如何警醒禱告？',
        storageKeys: ['ifu:effective-prayer:q5', 'ifu:effective-prayer-q5'],
        scriptures: [
          {
            book: '以弗所書',
            reference: 'Eph 6:18',
            chinese: '靠著聖靈，隨時多方禱告祈求；並要在此警醒不倦，為眾聖徒祈求。',
            english: 'Pray in the Spirit at all times in every prayer and supplication. To that end keep alert and always persevere in supplication for all the saints.',
          },
        ],
      },
    ],
  },
  {
    id: 'fellowship',
    order: 9,
    title: '團契互助',
    subtitle: 'Fellowship',
    description: '在信徒社群中彼此相愛、互相扶持。',
    questions: [
      {
        id: 'fellowship-q1',
        number: '1',
        title: '彼此相顧與不可停止聚會 (希伯來書 10:24-25)',
        prompt: '根據希伯來書 10:24-25，基督徒為甚麼需要常常聚會並彼此相顧？',
        storageKeys: ['ifu:fellowship:q1', 'ifu:fellowship-q1'],
        scriptures: [
          {
            book: '希伯來書',
            reference: 'Heb 10:24-25',
            chinese: '又要彼此相顧，激發愛心，勉勵行善。你們不可停止聚會，好像那些停止慣了的人，倒要彼此勸勉；既知道那日子臨近，就更當如此。',
            english: 'And let us consider each other carefully for the purpose of sparking love and good deeds. Don’t stop meeting together with other believers, which some people have gotten into the habit of doing. Instead, encourage each other, especially as you see the day drawing near.',
          },
        ],
      },
      {
        id: 'fellowship-q2',
        number: '2',
        title: '彼此相愛的新命令 (約翰福音 13:34-35)',
        prompt: '根據約翰福音 13:34-35，世人如何能認出我們是耶穌的門徒？',
        storageKeys: ['ifu:fellowship:q2', 'ifu:fellowship-q2'],
        scriptures: [
          {
            book: '約翰福音',
            reference: 'John 13:34-35',
            chinese: '我賜給你們一條新命令，乃是叫你們彼此相愛；我怎樣愛你們，你們也要怎樣相愛。你們若有彼此相愛的心，眾人因此就認出你們是我的門徒了。',
            english: 'I give you a new commandment, that you love one another. Just as I have loved you, you also should love one another. By this everyone will know that you are my disciples, if you have love for one another.',
          },
        ],
      },
      {
        id: 'fellowship-q3',
        number: '3',
        title: '二人勝過一人 (傳道書 4:9-10)',
        prompt: '根據傳道書 4:9-10，在信仰道路上有同伴扶持的重要性是甚麼？',
        storageKeys: ['ifu:fellowship:q3', 'ifu:fellowship-q3'],
        scriptures: [
          {
            book: '傳道書',
            reference: 'Eccl 4:9-10',
            chinese: '兩個人總比一個人好，因為二人勞碌同得美好的果效。若是跌倒，這人可以扶起他的同伴；若是孤身一人，跌倒了，沒有別人扶起他來，這人就有禍了！',
            english: 'Two are better than one, because they have a good return for their labor: If either of them falls down, one can help the other up. But pity anyone who falls and has no one to help them up.',
          },
        ],
      },
      {
        id: 'fellowship-q4',
        number: '4',
        title: '在基督身體裡同受苦同得榮 (哥林多前書 12:26-27)',
        prompt: '根據哥林多前書 12:26-27，我們如何看待自己在教會大家庭中的角色與其他肢體的關係？',
        storageKeys: ['ifu:fellowship:q4', 'ifu:fellowship-q4'],
        scriptures: [
          {
            book: '哥林多前書',
            reference: '1Cor 12:26-27',
            chinese: '若一個肢體受苦，所有的肢體就一同受苦；若一個肢體得榮耀，所有的肢體就一同快樂。你們就是基督的身子，並且各自作肢體。',
            english: 'If one member suffers, all suffer together with it; if one member is honored, all rejoice together with it. Now you are the body of Christ and individually members of it.',
          },
        ],
      },
    ],
  },
  {
    id: 'witnessing',
    order: 10,
    title: '見證主',
    subtitle: 'Witnessing',
    description: '活出基督的樣式，與人分享福音的好消息。',
    questions: [
      {
        id: 'witnessing-q1',
        number: '1',
        title: '聖靈降臨得著能力作見證 (使徒行傳 1:8)',
        prompt: '根據使徒行傳 1:8，為耶穌作見證的能力來源是甚麼？範圍有多廣？',
        storageKeys: ['ifu:witnessing:q1', 'ifu:witnessing-q1'],
        scriptures: [
          {
            book: '使徒行傳',
            reference: 'Acts 1:8',
            chinese: '但聖靈降臨在你們身上，你們就必得著能力，並要在耶路撒冷、猶太全地，和撒瑪利亞，直到地極，作我的見證。',
            english: 'But you will receive power when the Holy Spirit has come upon you; and you will be my witnesses in Jerusalem, in all Judea and Samaria, and to the ends of the earth.',
          },
        ],
      },
      {
        id: 'witnessing-q2',
        number: '2',
        title: '常作準備回答人 (彼得前書 3:15)',
        prompt: '根據彼得前書 3:15，當別人問起我們心中盼望的緣由時，我們應當抱持甚麼態度回答？',
        storageKeys: ['ifu:witnessing:q2', 'ifu:witnessing-q2'],
        scriptures: [
          {
            book: '彼得前書',
            reference: '1Pet 3:15',
            chinese: '只要心裏尊主基督為聖。有人問你們心中盼望的緣由，就要常作準備，以溫柔、敬畏的心回答各人。',
            english: 'Always be ready to make your defense to anyone who demands from you an accounting for the hope that is in you; yet do it with gentleness and reverence.',
          },
        ],
      },
      {
        id: 'witnessing-q3',
        number: '3',
        title: '世上的光與榮耀天父 (馬太福音 5:14-16)',
        prompt: '根據馬太福音 5:14-16，我們的好行為如何引導人認識並榮耀神？',
        storageKeys: ['ifu:witnessing:q3', 'ifu:witnessing-q3'],
        scriptures: [
          {
            book: '馬太福音',
            reference: 'Matt 5:14-16',
            chinese: '你們是世上的光。城造在山上是不能隱藏的...你們的光也當這樣照在人前，叫他們看見你們的好行為，便將榮耀歸給你們在天上的父。',
            english: 'You are the light of the world. A city built on a hill cannot be hid... In the same way, let your light shine before others, so that they may see your good works and give glory to your Father in heaven.',
          },
        ],
      },
      {
        id: 'witnessing-profile-before',
        number: '4a',
        title: '我的見證：我信主前',
        prompt: '請簡述你信主前的生活、內心狀態或對生命的看法：',
        storageKeys: ['ifu:witnessing-profile-before'],
      },
      {
        id: 'witnessing-profile-process',
        number: '4b',
        title: '我的見證：後來我如何信主',
        prompt: '請分享你是如何聽見福音、因何契機決定接受耶穌基督：',
        storageKeys: ['ifu:witnessing-profile-process'],
      },
      {
        id: 'witnessing-profile-after',
        number: '4c',
        title: '我的見證：信主後我的改變',
        prompt: '請分享信主之後，神在你心靈、生活與價值觀上帶來的改變與盼望：',
        storageKeys: ['ifu:witnessing-profile-after'],
      },
    ],
  },
  {
    id: 'life-goal',
    order: 11,
    title: '人生目的',
    subtitle: 'Life Goal',
    description: '發現神在你生命中的獨特呼召與計劃。',
    questions: [
      {
        id: 'life-goal-q1',
        number: '1',
        title: '先求神的國和神的義 (馬太福音 6:33)',
        prompt: '根據馬太福音 6:33，基督徒生命的首要優先次序是甚麼？神的應許是甚麼？',
        storageKeys: ['ifu:life-goal:q1', 'ifu:life-goal-q1'],
        scriptures: [
          {
            book: '馬太福音',
            reference: 'Matt 6:33',
            chinese: '你們要先求他的國和他的義，這些東西都要加給你們了。',
            english: 'But strive first for the kingdom of God and his righteousness, and all these things will be given to you as well.',
          },
        ],
      },
      {
        id: 'life-goal-q2',
        number: '2',
        title: '將身體獻上當作活祭 (羅馬書 12:1-2)',
        prompt: '根據羅馬書 12:1-2，甚麼是神所喜悅的事奉？我們當如何心意更新而變化？',
        storageKeys: ['ifu:life-goal:q2', 'ifu:life-goal-q2'],
        scriptures: [
          {
            book: '羅馬書',
            reference: 'Rom 12:1-2',
            chinese: '所以弟兄們，我以神的慈悲勸你們，將身體獻上，當作活祭，是聖潔的，是神所喜悅的；你們如此事奉乃是理所當然的。不要效法這個世界，只要心意更新而變化，叫你們察驗何為神的善良、純全、可喜悅的旨意。',
            english: 'I appeal to you therefore, brothers and sisters, by the mercies of God, to present your bodies as a living sacrifice, holy and acceptable to God, which is your spiritual worship. Do not be conformed to this world, but be transformed by the renewing of your minds.',
          },
        ],
      },
      {
        id: 'life-goal-q3',
        number: '3',
        title: '無論做甚麼都為榮耀神 (哥林多前書 10:31)',
        prompt: '根據哥林多前書 10:31，我們在日常生活中的每個決定與行動的終極指引是甚麼？',
        storageKeys: ['ifu:life-goal:q3', 'ifu:life-goal-q3'],
        scriptures: [
          {
            book: '哥林多前書',
            reference: '1Cor 10:31',
            chinese: '所以，你們或吃或喝，無論做甚麼，都要為榮耀神而行。',
            english: 'So, whether you eat or drink, or whatever you do, do everything for the glory of God.',
          },
        ],
      },
      {
        id: 'life-goal-q4',
        number: '4',
        title: '打過美好的仗與公義冠冕 (提摩太後書 4:7-8)',
        prompt: '根據提摩太後書 4:7-8，保羅如何為一生的忠心奔跑作總結？這對你的人生有何激勵？',
        storageKeys: ['ifu:life-goal:q4', 'ifu:life-goal-q4'],
        scriptures: [
          {
            book: '提摩太後書',
            reference: '2Tim 4:7-8',
            chinese: '那美好的仗我已經打過了，當跑的路我已經跑盡了，所信的道我已經守住了。從此以後，有公義的冠冕為我存留，就是按著公義審判的主到了那日要賜給我的；不但賜給我，也賜給凡愛慕他顯現的人。',
            english: 'I have fought the good fight, I have finished the race, I have kept the faith. From now on there is reserved for me the crown of righteousness.',
          },
        ],
      },
      {
        id: 'life-goal-q5',
        number: '5',
        title: '我的基督徒人生目標與立志',
        prompt: '寫下你現階段在基督裡的人生目標、奉獻心志與禱告：',
        storageKeys: ['ifu:life-goal:q5', 'ifu:life-goal-q5'],
      },
    ],
  },
  {
    id: 'spiritual-growth',
    order: 12,
    title: '屬靈生命的成長',
    subtitle: 'Spiritual Growth',
    description: '持續追求生命成熟，結出屬靈的果子。',
    questions: [
      {
        id: 'growth-q1',
        number: '1',
        title: '在主的恩典和知識上有長進 (彼得後書 3:18)',
        prompt: '根據彼得後書 3:18，我們當如何在信仰生活中持續成長與追求？',
        storageKeys: ['ifu:spiritual-growth:q1', 'ifu:spiritual-growth-q1'],
        scriptures: [
          {
            book: '彼得後書',
            reference: '2Pet 3:18',
            chinese: '你們卻要在我們主—救主耶穌基督的恩典和知識上有長進。願榮耀歸給他，從今直到永遠。阿們！',
            english: 'Grow in the grace and knowledge of our Lord and Savior Jesus Christ. To him be the glory both now and to the day of eternity. Amen.',
          },
        ],
      },
      {
        id: 'growth-q2',
        number: '2',
        title: '聖靈的九種果子 (加拉太書 5:22-23)',
        prompt: '根據加拉太書 5:22-23，聖靈所結的果子有哪些？哪幾樣是你目前特別需要神操練與培育的？',
        storageKeys: ['ifu:spiritual-growth:q2', 'ifu:spiritual-growth-q2'],
        scriptures: [
          {
            book: '加拉太書',
            reference: 'Gal 5:22-23',
            chinese: '聖靈所結的果子，就是仁愛、喜樂、和平、忍耐、恩慈、良善、信實、溫柔、節制。這樣的事沒有律法禁止。',
            english: 'By contrast, the fruit of the Spirit is love, joy, peace, patience, kindness, generosity, faithfulness, gentleness, and self-control. There is no law against such things.',
          },
        ],
      },
      {
        id: 'growth-q3',
        number: '3',
        title: '長大成人滿有基督身量 (以弗所書 4:13-15)',
        prompt: '根據以弗所書 4:13-15，屬靈生命成熟的特徵是甚麼？',
        storageKeys: ['ifu:spiritual-growth:q3', 'ifu:spiritual-growth-q3'],
        scriptures: [
          {
            book: '以弗所書',
            reference: 'Eph 4:13-15',
            chinese: '直等到我們眾人在真道上同歸於一，認識神的兒子，得以長大成人，滿有基督長成的身量，使我們不再作小孩子，中了人的詭計和欺騙的法術...惟用愛心說誠實話，凡事長進，連於元首基督。',
            english: 'Until all of us come to the unity of the faith and of the knowledge of the Son of God, to maturity, to the measure of the full stature of Christ... speaking the truth in love, we must grow up in every way into him who is the head, into Christ.',
          },
        ],
      },
      {
        id: 'growth-q4',
        number: '4',
        title: '常在葡萄樹上多結果子 (約翰福音 15:5)',
        prompt: '根據約翰福音 15:5，我們持續結出豐盛生命果子的唯一秘訣是甚麼？',
        storageKeys: ['ifu:spiritual-growth:q4', 'ifu:spiritual-growth-q4'],
        scriptures: [
          {
            book: '約翰福音',
            reference: 'John 15:5',
            chinese: '我是葡萄樹，你們是枝子。常在我裏面的，我也常在他裏面，這人就多結果子；因為離了我，你們就不能做甚麼。',
            english: 'I am the vine, you are the branches. Those who abide in me and I in them bear much fruit, because apart from me you can do nothing.',
          },
        ],
      },
      {
        id: 'growth-q5',
        number: '5',
        title: '屬靈生命輪評估與反思',
        prompt: '根據你目前在讀經、禱告、團契、見證、順服等方面的狀況，請寫下你的反思與成長計畫：',
        storageKeys: ['ifu:spiritual-growth:q5', 'ifu:spiritual-growth-q5'],
      },
    ],
  },
];
