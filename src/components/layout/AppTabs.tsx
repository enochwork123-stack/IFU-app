import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTE_REGISTRY } from '../../app/routes';

export const AppTabs: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { label: '認識福音', path: ROUTE_REGISTRY.CREATION },
    { label: '初信栽培', path: ROUTE_REGISTRY.JOURNEY },
  ] as const;

  return (
    <div className="sticky top-0 z-40 flex w-full space-x-6 border-b border-[#efe9dd] bg-[#fbf9f5] px-4 pt-3">
      {tabs.map((tab) => {
        const isActive =
          location.pathname.startsWith(tab.path) ||
          (tab.path === ROUTE_REGISTRY.CREATION &&
            location.pathname === ROUTE_REGISTRY.HOME);

        return (
          <button
            key={tab.path}
            type="button"
            onClick={() => navigate(tab.path)}
            className={`relative pb-2 text-sm font-medium transition-all ${
              isActive
                ? 'font-bold text-[#3e4c31]'
                : 'text-[#3e4c31]/50 hover:text-[#3e4c31]/80'
            }`}
          >
            {tab.label}
            {isActive ? (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#c68a4c]" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
};

export default AppTabs;
