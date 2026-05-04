import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';

function getActiveTab(pathname) {
  if (pathname.startsWith('/journey')) {
    return 'journey';
  }
  if (pathname.startsWith('/library')) {
    return 'library';
  }
  if (pathname.startsWith('/profile')) {
    return 'profile';
  }
  return 'home';
}

export function AppShell() {
  const location = useLocation();
  const activeTab = getActiveTab(location.pathname);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(121,89,0,0.08),_transparent_34%),linear-gradient(180deg,_#fdfbf8_0%,_#fbf9f5_40%,_#f1ede6_100%)] px-4 py-6 text-on-surface sm:px-6">
      <div className="mx-auto min-h-[calc(100vh-3rem)] max-w-[430px] overflow-hidden rounded-[2.4rem] bg-surface shadow-[0_32px_90px_rgba(40,53,28,0.14)] ring-1 ring-white/70">
        <div className="relative min-h-[calc(100vh-3rem)] overflow-x-hidden">
          <div className="organic-blur bg-secondary/12 right-[-18%] top-8" />
          <div className="organic-blur bg-primary/12 bottom-28 left-[-22%]" />
          <Outlet />
          <BottomNav activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
}
