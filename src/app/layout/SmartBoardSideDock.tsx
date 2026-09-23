import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Home, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';

export interface SmartBoardSideDockProps {
  isHome: boolean;
  isLight: boolean;
  onOpenBoard: () => void;
  onBack: () => void;
  onHome: () => void;
}

export const SmartBoardSideDock: React.FC<SmartBoardSideDockProps> = ({
  isHome,
  isLight,
  onOpenBoard,
  onBack,
  onHome,
}) => {
  // On home: always open, no collapse control.
  // On stages (!isHome): auto-collapse to screen edge with centered open/close tab.
  const [isRetracted, setIsRetracted] = useState<boolean>(() => !isHome);
  const dockRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isHome) {
      setIsRetracted(true);
    } else {
      setIsRetracted(false);
    }
  }, [isHome]);

  // When dock is open on a stage/inner screen (!isHome && !isRetracted),
  // auto-retract/hide when clicking outside or pressing Escape
  useEffect(() => {
    if (isHome || isRetracted) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (dockRef.current && !dockRef.current.contains(e.target as Node)) {
        setIsRetracted(true);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsRetracted(true);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isHome, isRetracted]);

  const toggleRetract = () => setIsRetracted((prev) => !prev);

  const handleExit = async () => {
    try {
      const { exit } = await import('@tauri-apps/plugin-process');
      await exit(0);
    } catch {
      try {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        await getCurrentWindow().close();
      } catch {
        if (window.confirm('Do you want to exit TreadCode?')) {
          window.close();
        }
      }
    }
  };

  // Surface colors matching header seamlessly — solid opaque, no glassmorphism
  const borderColor = isLight ? '#cbd5e1' : '#1e2433';
  const bgColor = isLight ? '#ffffff' : '#0b0d13';

  return (
    <aside
      ref={dockRef}
      aria-label="Smartboard Side Dock"
      className="fixed left-0 top-13 bottom-0 z-40 select-none transition-transform duration-200 ease-out"
      style={{
        transform: isRetracted ? 'translateX(-100%)' : 'translateX(0)',
      }}
    >
      {/* Full-Height Dock Container — Sharp Cornered, Attached to Navbar & Screen Edge */}
      <div
        className="w-24 h-full rounded-none border-r flex flex-col justify-between items-stretch overflow-hidden shadow-xs relative"
        style={{
          backgroundColor: bgColor,
          borderColor: borderColor,
        }}
      >
        {/* Even Height Distribution: Board, Back, Home (1/3 height each) */}
        <div className="flex-1 flex flex-col items-stretch">
          {/* 1. Board Button (Top 1/3) — Large 40px icon, clean text */}
          <button
            type="button"
            onClick={onOpenBoard}
            title="Open Smart Board"
            className={`flex-1 w-full flex flex-col items-center justify-center transition-colors cursor-pointer group active:scale-[0.98] ${
              isLight
                ? 'hover:bg-amber-50 text-amber-800'
                : 'hover:bg-amber-500/10 text-amber-300'
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`w-10 h-10 transition-transform group-hover:scale-105 ${
                isLight ? 'text-amber-600' : 'text-amber-400'
              }`}
            >
              <rect x="3" y="3" width="18" height="12" rx="1" />
              <path d="M7 7h10" />
              <path d="M7 10h5" />
              <path d="M5 21l3-6" />
              <path d="M19 21l-3-6" />
            </svg>
            <span className="text-xs font-semibold mt-2 tracking-tight">
              Board
            </span>
          </button>

          {/* 2. Back Button (Middle 1/3) — Large 36px icon */}
          {/* When on Home: completely non-workable, non-clickable, and faded without background box */}
          <button
            type="button"
            onClick={isHome ? undefined : onBack}
            disabled={isHome}
            aria-disabled={isHome}
            title={isHome ? 'Cannot go back from Home' : 'Go Back (Esc)'}
            className={`flex-1 w-full flex flex-col items-center justify-center transition-colors ${
              isHome
                ? 'cursor-default opacity-30 pointer-events-none select-none text-slate-400 dark:text-slate-600'
                : isLight
                  ? 'hover:bg-slate-100 text-slate-700 hover:text-slate-950 cursor-pointer active:scale-[0.98]'
                  : 'hover:bg-white/5 text-slate-300 hover:text-white cursor-pointer active:scale-[0.98]'
            }`}
          >
            <ArrowLeft
              className="w-9 h-9"
              strokeWidth={2.2}
            />
            <span className="text-xs font-semibold mt-2 tracking-tight">
              Back
            </span>
          </button>

          {/* 3. Home Button (Bottom 1/3) — Large 36px icon */}
          {/* When on Home: completely non-workable, non-clickable, and faded without background box */}
          <button
            type="button"
            onClick={isHome ? undefined : onHome}
            disabled={isHome}
            aria-disabled={isHome}
            title={isHome ? 'Current screen: Home' : 'Go to Home'}
            className={`flex-1 w-full flex flex-col items-center justify-center transition-colors ${
              isHome
                ? 'cursor-default opacity-30 pointer-events-none select-none text-slate-400 dark:text-slate-600'
                : isLight
                  ? 'hover:bg-slate-100 text-slate-700 hover:text-slate-950 cursor-pointer active:scale-[0.98]'
                  : 'hover:bg-white/5 text-slate-300 hover:text-white cursor-pointer active:scale-[0.98]'
            }`}
          >
            <Home
              className="w-9 h-9"
              strokeWidth={2.2}
            />
            <span className="text-xs font-semibold mt-2 tracking-tight">
              Home
            </span>
          </button>
        </div>

        {/* 4. Slick Exit Button at Bottom */}
        <button
          type="button"
          onClick={handleExit}
          title="Exit Application"
          className={`w-full py-4.5 flex flex-col items-center justify-center transition-colors cursor-pointer group shrink-0 ${
            isLight
              ? 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
              : 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10'
          }`}
        >
          <LogOut
            className="w-7 h-7 transition-transform group-hover:scale-105"
            strokeWidth={2.2}
          />
          <span className="text-[11px] font-semibold mt-1.5 tracking-tight">
            Exit
          </span>
        </button>
      </div>

      {/* Integrated Ergonomic Hardware Handle — ONLY ON STAGES (!isHome), VERTICALLY CENTERED */}
      {!isHome && (
        <button
          type="button"
          onClick={toggleRetract}
          title={isRetracted ? 'Open Navigation' : 'Close Navigation'}
          className={`absolute top-1/2 -translate-y-1/2 -right-6 w-6 h-20 rounded-r-2xl border-y border-r flex flex-col items-center justify-center gap-1 transition-all duration-150 cursor-pointer shadow-md group ${
            isLight
              ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-600 hover:text-slate-950 shadow-slate-200/60'
              : 'bg-[#0b0d13] hover:bg-[#161a24] border-slate-800 text-slate-400 hover:text-white shadow-black/40'
          }`}
        >
          {/* Subtle integrated tactile grip */}
          <span
            className={`w-1 h-3 rounded-full transition-colors ${
              isLight ? 'bg-slate-300 group-hover:bg-slate-500' : 'bg-slate-700 group-hover:bg-slate-400'
            }`}
          />
          {isRetracted ? (
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          ) : (
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          )}
          <span
            className={`w-1 h-3 rounded-full transition-colors ${
              isLight ? 'bg-slate-300 group-hover:bg-slate-500' : 'bg-slate-700 group-hover:bg-slate-400'
            }`}
          />
        </button>
      )}
    </aside>
  );
};
