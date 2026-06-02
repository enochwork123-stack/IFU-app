import React from 'react';

interface ShellFrameProps {
  children: React.ReactNode;
}

export const ShellFrame: React.FC<ShellFrameProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#fbf9f5] p-0 font-sans text-[#3e4c31] antialiased md:p-4">
      {/* Mobile-first structural canvas with crisp desktop aspect bounding constraint */}
      <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#fbf9f5] md:h-[844px] md:w-[390px] md:rounded-[40px] md:border md:border-[#efe9dd] md:shadow-2xl">
        {/* Persistent Viewport Frame Content */}
        <main className="scrollbar-none w-full flex-1 overflow-y-auto pb-24">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ShellFrame;
