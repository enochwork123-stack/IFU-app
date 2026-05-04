export function ScreenSectionTitle({ eyebrow, title, description, align = 'left' }) {
  return (
    <div className={align === 'center' ? 'text-center' : ''}>
      {eyebrow ? (
        <p className="mb-3 font-body text-[11px] font-extrabold tracking-[0.28em] text-secondary/80">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-headline text-[1.9rem] leading-tight text-primary">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-[0.97rem] leading-7 text-on-surface-variant">
          {description}
        </p>
      ) : null}
    </div>
  );
}
