import { Icon } from '../components/Icon';
import { JourneyPager } from '../components/JourneyPager';
import { PageHeader } from '../components/PageHeader';

const exampleQuestions = [
  '聖經中的預言是如何精確應驗的？',
  '為什麼相信耶穌是神？',
  '關於耶穌基督的彌賽亞預言，有哪些最具代表性的例子？',
];

function StepSection({ number, title, children }) {
  return (
    <section className="rounded-[2rem] bg-surface-container-lowest p-6 shadow-[0_18px_42px_rgba(40,53,28,0.08)]">
      <div className="flex items-center gap-3 text-secondary">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-fixed font-body text-sm font-extrabold text-on-secondary-fixed">
          {number}
        </span>
        <p className="font-body text-[11px] font-extrabold tracking-[0.2em]">
          STEP {number}
        </p>
      </div>
      <h2 className="mt-5 font-headline text-[1.65rem] leading-tight text-primary">
        {title}
      </h2>
      <div className="mt-5 space-y-5 text-[1.02rem] leading-8 text-on-surface-variant">
        {children}
      </div>
    </section>
  );
}

export function AssuranceFaithVsSuperstitionScreen() {
  return (
    <>
      <PageHeader title="確信 vs 迷信" backTo="/journey/salvation-assurance" />

      <main className="px-6 pb-36 pt-8">
        <section className="rounded-[2.35rem] bg-primary p-8 text-white shadow-[0_28px_72px_rgba(40,53,28,0.22)]">
          <div className="mb-7 inline-flex rounded-full bg-secondary-fixed px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-on-secondary-fixed">
            《得救的確據》延伸學習 (B)
          </div>
          <h1 className="font-headline text-[2.35rem] leading-tight">
            確信 vs 迷信
          </h1>
          <p className="mt-5 text-[1.05rem] leading-8 text-on-primary-container">
            虛假的宗教導人迷信，但耶穌基督的信仰卻有根有據。正如 提摩太前書 1:15 所說：「基督耶穌降世，為要拯救罪人。這話是可信的，是十分可佩服的。」
          </p>
          <p className="mt-4 text-[1.05rem] leading-8 text-on-primary-container">
            在追尋信仰的過程中，您也許已經思考過信耶穌的根據。若想進一步認識信仰的憑據，請試用《DT-Chat: Reasons to Believe》對話機器人作為學習工具。使用步驟如下：
          </p>
        </section>

        <div className="mt-8 grid gap-6">
          <StepSection number="1" title="開啟《DT-Chat: Reasons to Believe》">
            <p>
              在香港使用《DT-Chat: Reasons to Believe》，請先連接 VPN，然後按以下連結：NotebookLM DT-Chat: Reasons To Believe
            </p>
          </StepSection>

          <StepSection number="2" title="提問">
            <p>
              開啟《DT-Chat: Reasons to Believe》後，在對話窗提出你感興趣的問題，研讀答案，並可跟進提問。
            </p>
            <div className="rounded-[1.35rem] border border-dashed border-outline-variant bg-surface-container-low p-5 text-center">
              <Icon name="image" className="text-[32px] text-outline" />
              <p className="mt-2 text-sm font-bold text-outline">image.png</p>
            </div>
          </StepSection>

          <StepSection number="3" title="例子">
            <p>請嘗試以下提問，並檢視答覆：</p>
            <div className="grid gap-4">
              {exampleQuestions.map((question) => (
                <article
                  key={question}
                  className="rounded-[1.45rem] bg-surface-container-low p-5"
                >
                  <p className="font-headline text-[1.15rem] leading-8 text-primary">
                    {question}
                  </p>
                  <div className="mt-4 rounded-[1.2rem] border border-dashed border-outline-variant bg-white/70 p-4 text-center">
                    <Icon name="image" className="text-[28px] text-outline" />
                    <p className="mt-2 text-sm font-bold text-outline">image.png</p>
                  </div>
                </article>
              ))}
            </div>
            <p>
              如需《DT-Chat: Reasons to Believe》對話機器人的詳細使用說明及例子，請參閱：‣
            </p>
            <p>
              若你無法使用《DT-Chat: Reasons to Believe》，可閱讀以下文件，幫助你進一步認識信仰的憑據。文件輯錄了 16 個重要信仰理性問題的回答，這些回答由《DT-Chat: Reasons to Believe》人工智能對話機器人根據嚴謹資料生成。
            </p>
            <p>‣</p>
          </StepSection>
        </div>

        <section className="mt-8">
          <JourneyPager previous={{ to: '/journey/salvation-assurance', label: '得救的確據' }} />
        </section>
      </main>
    </>
  );
}
