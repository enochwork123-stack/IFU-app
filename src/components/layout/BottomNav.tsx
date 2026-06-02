import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTE_REGISTRY } from '../../app/routes';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: '首頁', icon: 'home', path: ROUTE_REGISTRY.JOURNEY },
    { label: '自修學習', icon: 'menu_book', path: ROUTE_REGISTRY.LIBRARY },
  ] as const;

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-[#efe9dd] bg-[#fbf9f5]/80 px-4 backdrop-blur-md">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;

        return (
          <button
            key={item.path}
            type="button"
            onClick={() => navigate(item.path)}
            className={`flex h-12 w-12 flex-col items-center justify-center transition-colors ${
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
