export function ScriptureCard({
  reference,
  verse,
  tone = 'light',
  accent = 'secondary',
  className = '',
}) {
  const tones = {
    light:
      'bg-surface-container-low border border-white/70 text-primary shadow-[0_18px_40px_rgba(40,53,28,0.08)]',
    dark:
      'bg-primary/90 text-white border border-white/10 shadow-[0_18px_40px_rgba(20,30,12,0.28)]',
    glass:
      'bg-white/68 text-primary backdrop-blur-xl border border-white/65 shadow-[0_18px_42px_rgba(40,53,28,0.16)]',
  };

  const accents = {
    secondary: 'border-l-secondary',
    primary: 'border-l-primary',
    soft: 'border-l-white/50',
  };

  return (
    <div
      className={`rounded-[1.65rem] border-l-4 p-5 ${tones[tone]} ${accents[accent]} ${className}`}
    >
      <p className="font-body text-[11px] font-extrabold uppercase tracking-[0.22em] text-secondary/85">
        {reference}
      </p>
      <p className="mt-3 font-headline text-[1.08rem] leading-8">{verse}</p>
    </div>
  );
}
