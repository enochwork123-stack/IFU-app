import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import { useAuth } from '../context/AuthContext';
import { assetPath } from '../utils/assets';

/**
 * @param {object} props
 * @param {string} props.title
 * @param {string} [props.backTo]
 * @param {string} [props.backLabel]
 * @param {any} [props.action]
 * @param {boolean} [props.compact]
 */
export function PageHeader({
  title,
  backTo,
  backLabel = '返回',
  action,
  compact = false,
}) {
  const { user, profile } = useAuth();

  return (
    <header className="ifu-page-header glass-topbar sticky top-0 z-[60] shrink-0">
      <div
        className={`flex items-center justify-between px-8 ${
          compact ? 'h-16' : 'h-[4.35rem]'
        }`}
      >
        <div className="flex items-center gap-4">
          {backTo ? (
            <Link
              to={backTo}
              aria-label={backLabel}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-primary transition-transform active:scale-95"
            >
              <Icon name="arrow_back" className="text-[22px]" />
            </Link>
          ) : (
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/5 text-primary">
              <Icon name="menu_book" className="text-[20px]" />
            </span>
          )}
          <h1 className="font-headline text-[1.35rem] font-bold tracking-tight text-primary">
            {title}
          </h1>
        </div>
        
        {action !== undefined ? action : (
          user ? (
            <Link
              to="/profile"
              aria-label="個人檔案"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest overflow-hidden transition active:scale-95 shrink-0"
            >
              <img
                src={profile?.avatar_url || assetPath('assets/default_avatar.png')}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            </Link>
          ) : (
            <Link
              to="/login"
              aria-label="登錄"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest text-secondary transition active:scale-95 shrink-0"
            >
              <Icon name="account_circle" className="text-[20px]" />
            </Link>
          )
        )}
      </div>
      <div className="h-px bg-[rgba(40,53,28,0.05)]" />
    </header>
  );
}

