import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTE_REGISTRY, type AppRoutePath } from '../../app/routes';

interface BottomNavItem {
  label: string;
  icon: string;
  path: AppRoutePath;
  activeExactPaths: readonly AppRoutePath[];
  activeSectionPaths?: readonly AppRoutePath[];
}

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: readonly BottomNavItem[] = [
    {
      label: '首頁',
      icon: 'home',
      path: ROUTE_REGISTRY.HOME,
      activeExactPaths: [ROUTE_REGISTRY.HOME],
    },
    {
      label: '認識福音',
      icon: 'auto_stories',
      path: ROUTE_REGISTRY.CREATION,
      activeExactPaths: [
        ROUTE_REGISTRY.CREATION,
        ROUTE_REGISTRY.PROBLEM,
        ROUTE_REGISTRY.BRIDGE,
        ROUTE_REGISTRY.RESPONSE,
      ],
    },
    {
      label: '初信栽培',
      icon: 'signpost',
      path: ROUTE_REGISTRY.JOURNEY,
      activeExactPaths: [
        ROUTE_REGISTRY.JOURNEY,
        ROUTE_REGISTRY.SALVATION_ASSURANCE,
        ROUTE_REGISTRY.QUIET_TIME,
        ROUTE_REGISTRY.PRAYER_ASSURANCE,
      ],
      activeSectionPaths: [
        ROUTE_REGISTRY.SALVATION_ASSURANCE,
        ROUTE_REGISTRY.QUIET_TIME,
        ROUTE_REGISTRY.PRAYER_ASSURANCE,
      ],
    },
    {
      label: '自修學習',
      icon: 'menu_book',
      path: ROUTE_REGISTRY.LIBRARY,
      activeExactPaths: [ROUTE_REGISTRY.LIBRARY],
    },
  ];

  return (
    <nav className="ifu-bottom-nav z-[70] flex min-h-16 shrink-0 items-center justify-around border-t border-[#efe9dd] bg-[#fbf9f5]/88 px-2 backdrop-blur-md">
      {navItems.map((item) => {
        const isActive =
          item.activeExactPaths.some((path) => location.pathname === path) ||
          item.activeSectionPaths?.some((path) =>
            location.pathname.startsWith(`${path}/`)
          ) === true;

        return (
          <button
            key={item.path}
            type="button"
            onClick={() => navigate(item.path)}
            aria-current={isActive ? 'page' : undefined}
            className={`flex h-12 min-w-16 flex-col items-center justify-center rounded-2xl transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c68a4c] ${
              isActive ? 'text-[#c68a4c]' : 'text-[#3e4c31]/60'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">
              {item.icon}
            </span>
            <span className="mt-0.5 text-[10px] font-medium">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
