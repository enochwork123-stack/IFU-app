import { PageHeader } from '../components/PageHeader';
import { Icon } from '../components/Icon';

export function ProfileScreen() {
  return (
    <>
      <PageHeader title="個人檔案" />
      <main className="px-6 pb-36 pt-8">
        <section className="rounded-[2rem] bg-primary p-8 text-white shadow-[0_24px_64px_rgba(40,53,28,0.22)]">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/12">
              <Icon name="person" filled className="text-4xl text-secondary-fixed" />
            </div>
            <div>
              <p className="font-headline text-[1.7rem]">同行中的門徒</p>
              <p className="mt-1 text-sm text-on-primary-container">你的旅程、進度與回應會集中在這裡。</p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4">
          {[
            { label: '目前進度', value: '福音旅程 / Step 3' },
            { label: '下一步', value: '完成決定相信與初信栽培第一課' },
            { label: '設計系統', value: 'Moss Green + Ochre / Serif + Sans' },
          ].map((item) => (
            <article
              key={item.label}
              className="rounded-[1.7rem] bg-surface-container-lowest p-6 shadow-[0_16px_38px_rgba(40,53,28,0.06)]"
            >
              <p className="font-body text-[11px] font-extrabold tracking-[0.22em] text-secondary/80">
                {item.label}
              </p>
              <p className="mt-3 text-[1rem] leading-7 text-on-surface">
                {item.value}
              </p>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
