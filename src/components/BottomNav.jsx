import { NavLink } from 'react-router-dom';
import { Icon } from './Icon';

const items = [
  { key: 'home', label: '首頁', icon: 'home', to: '/' },
  { key: 'journey', label: '旅程', icon: 'map', to: '/journey' },
  { key: 'library', label: '媒體庫', icon: 'menu_book', to: '/library' },
  { key: 'profile', label: '個人檔案', icon: 'person', to: '/profile' },
];

export function BottomNav({ activeTab }) {
  return (
    <nav className="bottom-nav-glass fixed inset-x-0 bottom-6 z-40 mx-auto flex w-[calc(100%-2rem)] max-w-[398px] items-center justify-around rounded-[2rem] px-6 pb-7 pt-4">
      {items.map((item) => {
        const isActive = activeTab === item.key;

        return (
          <NavLink
            key={item.key}
            to={item.to}
            className={`relative flex min-w-16 flex-col items-center justify-center transition-all duration-300 active:scale-90 ${
              isActive ? 'text-secondary' : 'text-primary/58 hover:text-secondary'
            }`}
          >
            <Icon
              name={item.icon}
              filled={isActive}
              className="text-[22px]"
            />
            <span className="mt-1 font-body text-[11px] font-extrabold tracking-[0.18em]">
              {item.label}
            </span>
            {isActive ? (
              <span className="absolute -bottom-2 h-1.5 w-1.5 rounded-full bg-secondary" />
            ) : null}
          </NavLink>
        );
      })}
    </nav>
  );
}
