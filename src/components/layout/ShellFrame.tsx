import React, { useEffect, useState } from 'react';

interface ShellFrameProps {
  children: React.ReactNode;
}

type UiMode = 'mobile' | 'desktop';

const UI_MODE_STORAGE_KEY = 'ifu-ui-mode';

function readInitialUiMode(): UiMode {
  if (typeof window === 'undefined') {
    return 'mobile';
  }

  const storedMode = window.localStorage.getItem(UI_MODE_STORAGE_KEY);
  return storedMode === 'desktop' || storedMode === 'mobile'
    ? storedMode
    : 'mobile';
}

export const ShellFrame: React.FC<ShellFrameProps> = ({ children }) => {
  const [uiMode, setUiMode] = useState<UiMode>(readInitialUiMode);
  const isDesktopMode = uiMode === 'desktop';

  useEffect(() => {
    window.localStorage.setItem(UI_MODE_STORAGE_KEY, uiMode);
  }, [uiMode]);

  function handleToggleUiMode() {
    setUiMode((currentMode) =>
      currentMode === 'mobile' ? 'desktop' : 'mobile',
    );
  }

  return (
    <div
      data-ui-mode={uiMode}
      className={`ifu-shell flex w-full overflow-hidden bg-surface font-sans text-primary antialiased ${
        isDesktopMode
          ? 'items-stretch justify-stretch p-0'
          : 'items-center justify-center p-0 md:p-4'
      }`}
    >
      <button
        type="button"
        onClick={handleToggleUiMode}
        className="glass-topbar fixed right-4 top-4 z-[9999] inline-flex items-center gap-2 rounded-full border border-outline-variant/60 px-4 py-2 text-xs font-extrabold tracking-[0.12em] text-primary shadow-[0_12px_32px_rgba(40,53,28,0.12)] transition hover:bg-surface-container-lowest active:scale-95"
        aria-label={`Switch to ${isDesktopMode ? 'mobile' : 'desktop'} layout`}
      >
        <span className="material-symbols-outlined text-[18px]">
          {isDesktopMode ? 'smartphone' : 'desktop_windows'}
        </span>
        <span>{isDesktopMode ? 'Mobile' : 'Desktop'}</span>
      </button>

      <div
        className={`ifu-app-canvas relative flex flex-col overflow-hidden bg-surface ${
          isDesktopMode
            ? 'h-full w-full rounded-none border-none shadow-none'
            : 'h-full w-full md:h-[844px] md:max-h-[calc(100dvh-2rem)] md:w-[390px] md:rounded-[40px] md:border md:border-[#efe9dd] md:shadow-2xl'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default ShellFrame;
