import { PageHeader } from '../components/PageHeader';
import { Icon } from '../components/Icon';

export function LibraryScreen() {
  return (
    <>
      <PageHeader title="媒體庫" />
      <main className="px-6 pb-36 pt-8">
        <section className="rounded-[2rem] bg-surface-container-lowest p-8 shadow-[0_20px_48px_rgba(40,53,28,0.08)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-fixed">
            <Icon name="collections_bookmark" className="text-[28px]" />
          </div>
          <h2 className="mt-6 font-headline text-[2rem] text-primary">
            靈修與學習資源
          </h2>
          <p className="mt-4 leading-7 text-on-surface-variant">
            路由與主題樣式已經就位，這裡可繼續接上講章、查經材料、音訊與影片等內容模組。
          </p>
          <div className="mt-8 rounded-[1.5rem] bg-surface-container-low p-5">
            <p className="font-body text-sm font-extrabold tracking-[0.18em] text-secondary">
              READY FOR NEXT BUILD
            </p>
            <p className="mt-2 leading-7 text-on-surface-variant">
              目前先保留為佔位頁，方便我們之後把媒體庫接進同一套導航。
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
