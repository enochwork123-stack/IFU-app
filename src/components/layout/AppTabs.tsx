import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTE_REGISTRY } from '../../app/routes';
import type { AppRoutePath } from '../../app/routes';

interface AppTab {
  label: string;
  path: AppRoutePath;
  activeExactPaths: readonly AppRoutePath[];
  activeSectionPaths?: readonly AppRoutePath[];
}

export const AppTabs: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs: readonly AppTab[] = [
    {
      label: '認識福音',
      path: ROUTE_REGISTRY.CREATION,
      activeExactPaths: [
        ROUTE_REGISTRY.HOME,
        ROUTE_REGISTRY.CREATION,
        ROUTE_REGISTRY.PROBLEM,
        ROUTE_REGISTRY.BRIDGE,
      ],
    },
    {
      label: '初信栽培',
      path: ROUTE_REGISTRY.JOURNEY,
      activeExactPaths: [
        ROUTE_REGISTRY.JOURNEY,
        ROUTE_REGISTRY.SALVATION_ASSURANCE,
        ROUTE_REGISTRY.QUIET_TIME,
      ],
      activeSectionPaths: [
        ROUTE_REGISTRY.SALVATION_ASSURANCE,
        ROUTE_REGISTRY.QUIET_TIME,
      ],
    },
  ];

  return (
    <div className="z-40 flex w-full shrink-0 space-x-6 border-b border-[#efe9dd] bg-[#fbf9f5] px-4 pt-3">
      {tabs.map((tab) => {
        const isActive =
          tab.activeExactPaths.some((path) => location.pathname === path) ||
          tab.activeSectionPaths?.some((path) =>
            location.pathname.startsWith(`${path}/`)
          ) === true;

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
