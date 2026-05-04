import { Link } from 'react-router-dom';
import { Icon } from './Icon';

export function JourneyPager({ previous, next }) {
  return (
    <div className="flex items-center justify-between gap-4 pt-2">
      {previous ? (
        <Link
          to={previous.to}
          className="inline-flex items-center gap-2 rounded-full bg-surface-container-low px-4 py-2.5 text-sm font-bold text-primary transition-all hover:bg-surface-container active:scale-95"
        >
          <Icon name="arrow_back" className="text-[18px]" />
          {previous.label}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          to={next.to}
          className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-bold text-white shadow-[0_14px_34px_rgba(121,89,0,0.22)] transition-all hover:brightness-105 active:scale-95"
        >
          {next.label}
          <Icon name="arrow_forward" className="text-[18px]" />
        </Link>
      ) : null}
    </div>
  );
}
