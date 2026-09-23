import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Search, Settings, ChevronRight, Home, Clock, Sun, Moon } from 'lucide-react';
import { useUpdateChecker, isNativeApp } from '@shared/hooks/useUpdateChecker';
import { useThemeStore } from '@shared/hooks/useThemeStore';
import { UpdateModal } from '@shared/components/ui/UpdateBanner';
import { motion, AnimatePresence } from 'motion/react';
import { TreadCodeLogo } from '@shared/components/ui/MindTraceLogo';
import { LicenseContext } from '../App';
import { SmartBoardSideDock } from './SmartBoardSideDock';
const SmartBoardModal = React.lazy(() => import('../../features/smartboard/SmartBoardModal').then(m => ({ default: m.SmartBoardModal })));
import { fuzzySearchCatalog, type SearchProgram } from '@shared/data/searchCatalog';

interface CrumbItem {
  label: string;
  path: string;
}

const GithubIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
  </svg>
);

function useBreadcrumbs(): CrumbItem[] {
  const location = useLocation();
  const parts = location.pathname.split('/').filter(Boolean);
  const crumbs: CrumbItem[] = [{ label: 'Home', path: '/languages' }];

  if (parts[0] === 'settings') {
    crumbs.push({ label: 'Settings', path: '/settings' });
  } else if (parts[0] === 'topics' && parts[1]) {
    const lang = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    crumbs.push({ label: lang, path: `/topics/${parts[1]}` });
    if (parts[2] === 'programs' && parts[3]) {
      const topic = parts[3].replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      crumbs.push({ label: topic, path: `/topics/${parts[1]}/programs/${parts[3]}` });
    }
  } else if (parts[0] === 'visualizer' && parts[1] && parts[2] && parts[3]) {
    const isDsa = parts[1] === 'dsa';
    const lang = isDsa ? 'DSA' : parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    crumbs.push({ label: lang, path: `/topics/${parts[1]}` });
    const topic = parts[2].replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    if (isDsa) {
      crumbs.push({ label: topic, path: location.pathname });
    } else {
      crumbs.push({ label: topic, path: `/topics/${parts[1]}/programs/${parts[2]}` });
      const prog = parts[3].replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      crumbs.push({ label: prog, path: location.pathname });
    }
  }

  return crumbs;
}

/* =========================================================
   GLOBAL SEARCH MODAL
   ========================================================= */
interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(0);

  const hasQuery = query.trim().length > 0;

  // Pure fuzzy search directly across all programs without clutter
  const results = React.useMemo(() => {
    return fuzzySearchCatalog(query);
  }, [query]);

  useEffect(() => {
    setFocused(0);
  }, [query]);

  const handleSelect = useCallback((prog: SearchProgram) => {
    navigate(`/visualizer/${prog.lang}/${prog.topicId}/${prog.id}`);
    onClose();
    setQuery('');
  }, [navigate, onClose]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setFocused(0);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocused(f => Math.min(f + 1, Math.max(0, results.length - 1)));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocused(f => Math.max(f - 1, 0));
      }
      if (e.key === 'Enter' && results[focused]) {
        e.preventDefault();
        handleSelect(results[focused]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, results, focused, onClose, handleSelect]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-1000 flex items-start justify-center pt-[14vh] px-4 bg-black/60 backdrop-blur-md select-none"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: -6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: -6 }}
        transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl rounded-xs border border-white/10 bg-[#0c0e14]/85 backdrop-blur-xl text-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(255,255,255,0.08)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Apple Spotlight Glass Search Bar */}
        <div className={`flex items-center gap-3.5 px-4 py-3 ${hasQuery ? 'border-b border-white/8' : ''}`}>
          <Search className="w-4 h-4 shrink-0 text-white/40" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search programs, algorithms, or topics..."
            className="flex-1 bg-transparent outline-none text-[15px] font-normal tracking-tight text-white placeholder:text-white/35"
          />
          {hasQuery && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-[11px] font-medium px-2 py-0.5 rounded-xs text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
          <kbd
            onClick={onClose}
            className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-xs bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-colors cursor-pointer select-none"
          >
            ESC
          </kbd>
        </div>

        {/* Results List: ONLY shown when user types (hasQuery) */}
        {hasQuery && (
          <>
            <div className="max-h-95 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
              {results.length === 0 ? (
                <div className="py-8 px-4 text-center">
                  <p className="text-[13px] text-white/40 font-normal">
                    No results found for &ldquo;{query}&rdquo;
                  </p>
                </div>
              ) : (
                results.map((prog, i) => {
                  const isSelected = i === focused;
                  return (
                    <button
                      key={`${prog.lang}-${prog.topicId}-${prog.id}`}
                      type="button"
                      onClick={() => handleSelect(prog)}
                      onMouseEnter={() => setFocused(i)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xs text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#007aff] text-white shadow-xs'
                          : 'text-zinc-200 hover:bg-white/5'
                      }`}
                    >
                      {/* Compact Language Badge */}
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-xs border shrink-0 ${
                          isSelected
                            ? 'bg-white/20 text-white border-white/30'
                            : 'bg-white/5 text-zinc-300 border-white/10'
                        }`}
                      >
                        {prog.langLabel}
                      </span>

                      {/* Clean Program Name */}
                      <span className={`text-[13px] font-medium tracking-tight truncate flex-1 ${
                        isSelected ? 'text-white' : 'text-zinc-100'
                      }`}>
                        {prog.name}
                      </span>

                      {/* Topic Category */}
                      <span className={`text-[11px] truncate shrink-0 ${
                        isSelected ? 'text-blue-100' : 'text-zinc-400'
                      }`}>
                        {prog.topicName}
                      </span>

                      {/* Return Key Symbol on Selected */}
                      {isSelected && (
                        <span className="text-xs font-mono shrink-0 ml-1 text-white">
                          ↵
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Apple Spotlight Status Footer */}
            {results.length > 0 && (
              <div className="px-4 py-2 border-t border-white/6 bg-white/2 flex items-center justify-between text-[11px] text-zinc-400 select-none">
                <div className="flex items-center gap-2">
                  <span>Use <kbd className="font-mono font-medium text-zinc-300">↑↓</kbd> to navigate</span>
                  <span>•</span>
                  <span><kbd className="font-mono font-medium text-zinc-300">↵</kbd> to open</span>
                  <span>•</span>
                  <span><kbd className="font-mono font-medium text-zinc-300">esc</kbd> to close</span>
                </div>
                <span className="font-medium text-zinc-400">
                  {results.length} {results.length === 1 ? 'result' : 'results'}
                </span>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

/* =========================================================
   GLOBAL APP SHELL
   ========================================================= */
export const GlobalAppShell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '/languages';
  const breadcrumbs = useBreadcrumbs();
  const [searchOpen, setSearchOpen] = useState(false);
  const [smartBoardOpen, setSmartBoardOpen] = useState(false);
  const licenseContext = React.useContext(LicenseContext);
  const { hasUpdate } = useUpdateChecker();
  const [showUpdateModal, setShowUpdateModal] = React.useState(false);
  const { isLight, toggleTheme } = useThemeStore();
  const [dismissedAnnouncement, setDismissedAnnouncement] = useState<string | null>(() => {
    return localStorage.getItem('flowtrace_dismissed_announcement');
  });

  const rawAnnouncement = licenseContext?.settings?.announcementText?.trim() || '';
  const isAnnouncementVisible = Boolean(rawAnnouncement && rawAnnouncement !== dismissedAnnouncement);

  const handleDismissAnnouncement = () => {
    if (rawAnnouncement) {
      localStorage.setItem('flowtrace_dismissed_announcement', rawAnnouncement);
      setDismissedAnnouncement(rawAnnouncement);
    }
  };

  const handleBack = useCallback(() => {
    if (isHome) return;
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/languages');
    }
  }, [isHome, navigate]);

  // If new announcement text arrives from Admin Panel, reset dismissal so user sees it
  useEffect(() => {
    if (rawAnnouncement && dismissedAnnouncement && rawAnnouncement !== dismissedAnnouncement) {
      // Admin changed the message to something new
      setDismissedAnnouncement(null);
    }
  }, [rawAnnouncement, dismissedAnnouncement]);

  // When Firebase signals an update, auto-show the modal (ONLY in native app)
  React.useEffect(() => {
    if (hasUpdate && isNativeApp()) setShowUpdateModal(true);
  }, [hasUpdate]);

  // Real-time Telemetry Heartbeat & Remote Admin Command Listeners
  useEffect(() => {
    const hwid = licenseContext?.hwid || 'unknown-device';
    const key = licenseContext?.licenseDetails?.licenseKey || 'Unregistered';

    // 1. Heartbeat Ping every 25 seconds (includes exact installed app version)
    const interval = setInterval(async () => {
      try {
        const { db } = await import('@shared/config/firebase');
        const { ref, set } = await import('firebase/database');

        let versionStr = '1.0.8';
        if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
          try {
            const { getVersion } = await import('@tauri-apps/api/app');
            versionStr = await getVersion();
          } catch (e) { }
        }

        await set(ref(db, `installations/${hwid}/lastSeen`), new Date().toISOString());
        await set(ref(db, `installations/${hwid}/activeKey`), key);
        await set(ref(db, `installations/${hwid}/currentPath`), location.pathname);
        await set(ref(db, `installations/${hwid}/appVersion`), versionStr);
      } catch (e) { }
    }, 25000);

    return () => clearInterval(interval);
  }, [licenseContext, location.pathname]);

  // Global Shortcuts & Trackpad/Gesture Navigation (Alt+Left: Back, Alt+Right: Forward, Alt+Home: Home, Esc: Back, Mouse Side Buttons)
  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setSmartBoardOpen(prev => !prev);
      }
      // Alt+Left or Cmd+Left -> Back
      if ((e.altKey || e.metaKey) && e.key === 'ArrowLeft') {
        e.preventDefault();
        handleBack();
      }
      // Alt+Right or Cmd+Right -> Forward
      if ((e.altKey || e.metaKey) && e.key === 'ArrowRight') {
        e.preventDefault();
        navigate(1);
      }
      // Alt+Home -> Home
      if (e.altKey && e.key === 'Home') {
        e.preventDefault();
        navigate('/languages');
      }
      // Esc -> Back (when not on home, search & smartboard are closed, and not typing in input)
      if (e.key === 'Escape') {
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        const isInput = activeTag === 'input' || activeTag === 'textarea' || (document.activeElement as HTMLElement)?.isContentEditable;
        if (!isInput && !searchOpen && !smartBoardOpen && location.pathname !== '/' && location.pathname !== '/languages') {
          e.preventDefault();
          handleBack();
        }
      }
    };

    // Trackpad / Gaming Mouse Back & Forward side buttons
    const mouseHandler = (e: MouseEvent) => {
      if (e.button === 3) {
        e.preventDefault();
        handleBack();
      } else if (e.button === 4) {
        e.preventDefault();
        navigate(1);
      }
    };

    window.addEventListener('keydown', keyHandler);
    window.addEventListener('mouseup', mouseHandler);
    return () => {
      window.removeEventListener('keydown', keyHandler);
      window.removeEventListener('mouseup', mouseHandler);
    };
  }, [navigate, handleBack, searchOpen, smartBoardOpen, location.pathname]);

  return (
    <div
      className="h-screen flex flex-col relative overflow-hidden transition-colors duration-150"
      style={{ background: isLight ? '#f1f5f9' : '#0a0b0f', fontFamily: "'Inter', sans-serif" }}
    >
      {/* === HEADER (Clean Top Bar) === */}
      <header
        data-tauri-drag-region
        className={`h-13 sticky top-0 z-50 shrink-0 flex items-center justify-between px-3 md:px-5 select-none shadow-xs transition-colors duration-150 ${isLight
            ? 'bg-white border-b border-slate-300 text-slate-900'
            : 'bg-[#0b0d13] border-b border-slate-800 text-white'
          }`}
      >
        {/* LEFT: Persistent Logo Icon + Morphing Brand / Back Navigation Button */}
        <div className="flex items-center gap-2 shrink-0" data-tauri-drag-region>
          <button
            onClick={() => navigate('/languages')}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all cursor-pointer group shrink-0 ${isLight ? 'hover:bg-slate-100' : 'hover:bg-white/10'
              }`}
            title={isHome ? "TreadCode Home" : "Home (Go to Languages)"}
          >
            <div className="w-8 h-8 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <TreadCodeLogo size={28} />
            </div>
          </button>

          <button
            onClick={() => navigate('/languages')}
            className={`flex items-center group py-1 px-1.5 rounded-lg transition-all select-none cursor-pointer ${
              isLight ? 'hover:bg-slate-100' : 'hover:bg-white/5'
            }`}
            title="TreadCode Home"
          >
            <span className="font-extrabold text-[17px] tracking-tight select-none">
              <span className={isLight ? "text-slate-900" : "text-white"}>Tread</span>
              <span className={isLight ? "text-blue-600" : "text-indigo-400"}>Code</span>
            </span>
          </button>
        </div>

        {/* CENTER: Breadcrumb (Always Perfectly Centered in Header) */}
        <nav className="hidden md:flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2 max-w-[45vw] overflow-hidden pointer-events-auto justify-center">
          <div className="flex items-center gap-1.5 max-w-full overflow-hidden truncate justify-center">
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={crumb.path}>
                {i > 0 && (
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-slate-400' : 'text-slate-600'}`} />
                )}
                <button
                  onClick={() => i < breadcrumbs.length - 1 ? navigate(crumb.path) : undefined}
                  className={`text-[13px] font-medium transition-all px-2 py-1 rounded-md truncate max-w-32 ${i === breadcrumbs.length - 1
                      ? (isLight ? 'text-slate-900 font-bold' : 'text-white font-semibold')
                      : (isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white')
                    }`}
                  title={crumb.label}
                >
                  {i === 0 && <Home className="w-3.5 h-3.5 inline mr-1 -mt-0.5 opacity-70" />}
                  <span className="truncate">{crumb.label}</span>
                </button>
              </React.Fragment>
            ))}
          </div>
        </nav>

        {/* RIGHT: SmartBoard + Search + GitHub Glass + Theme Toggle + Settings */}
        <div className="flex items-center gap-2 shrink-0">
          {!licenseContext?.settings?.disableSmartBoard && (
            <button
              onClick={() => setSmartBoardOpen(true)}
              title="Open Interactive Smart Board"
              className={`h-9 flex items-center gap-2 px-3.5 rounded-md text-[13px] font-semibold transition-colors cursor-pointer select-none ${isLight
                  ? 'bg-white hover:bg-slate-50 border border-slate-300 text-amber-700 shadow-xs'
                  : 'bg-[#161922] hover:bg-[#202534] border border-[#2d3548] text-amber-300'
                }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-4 h-4 shrink-0 ${isLight ? 'text-amber-600' : 'text-amber-400'}`}>
                <rect x="3" y="3" width="18" height="12" rx="1" />
                <path d="M7 7h10" />
                <path d="M7 10h5" />
                <path d="M5 21l3-6" />
                <path d="M19 21l-3-6" />
              </svg>
              <span>Board</span>
            </button>
          )}

          <button
            onClick={() => setSearchOpen(true)}
            title="Search"
            className={`h-9 flex items-center gap-2 px-3.5 rounded-md text-[13px] font-semibold transition-colors cursor-pointer select-none ${isLight
                ? 'bg-transparent hover:bg-slate-100 border border-slate-300 text-slate-900'
                : 'bg-transparent hover:bg-white/10 border border-white/20 text-white'
              }`}
          >
            <Search className={`w-4 h-4 shrink-0 ${isLight ? 'text-slate-800' : 'text-white'}`} />
            <span>Search</span>
          </button>

          <style>{`
            @keyframes githubGlassShine {
              0% { left: -150%; }
              35% { left: 150%; }
              100% { left: 150%; }
            }
            .github-shine-btn {
              position: relative;
              overflow: hidden;
            }
            .github-shine-btn::after {
              content: '';
              position: absolute;
              top: 0;
              width: 45px;
              height: 100%;
              background: linear-gradient(
                to right,
                transparent,
                rgba(255, 255, 255, 0.4),
                transparent
              );
              transform: skewX(-25deg);
              animation: githubGlassShine 3.5s infinite ease-in-out;
              pointer-events: none;
            }
          `}</style>

          {/* Native Desktop 3-Day Keyless Trial Pill (Desktop only, if trial is active & no paid key) */}
          {isNativeApp() && !licenseContext?.activated && licenseContext?.trialInfo?.isTrialActive && (
            <button
              onClick={() => navigate('/settings')}
              title="3-Day Desktop Trial Active (All 287 Courses & Domains Unlocked). Click to view plans."
              className={`h-9 flex items-center gap-2 px-3 rounded-md text-[13px] font-mono font-medium transition-colors cursor-pointer ${isLight
                  ? 'bg-amber-50 border border-amber-300 text-amber-800'
                  : 'bg-[#181a20] border border-amber-500/40 text-amber-300'
                }`}
            >
              <Clock size={14} className="text-amber-500 shrink-0" />
              <span>
                3-Day Trial: {licenseContext.trialInfo.daysRemaining > 0
                  ? `${licenseContext.trialInfo.daysRemaining}d Left`
                  : `${licenseContext.trialInfo.hoursRemaining}h Left`}
              </span>
            </button>
          )}

          {/* Update Ready indicator — minimal, professional pinkish-orange */}
          {hasUpdate && (
            <button
              onClick={() => setShowUpdateModal(true)}
              title="A new version of TreadCode is ready to install."
              className={`h-9 flex items-center gap-2 px-3 rounded-md text-[13px] font-semibold transition-colors cursor-pointer border ${
                isLight
                  ? 'bg-[#fff5f3] border-[#fa5a3f]/30 text-[#c73820] hover:bg-[#fa5a3f]/10'
                  : 'bg-[#181112] border-[#fa5a3f]/40 text-[#ff8a75] hover:border-[#fa5a3f]/70 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#fa5a3f] shrink-0" />
              <span>Update Ready</span>
            </button>
          )}

          <a
            href="https://github.com/prince19112003"
            target="_blank"
            rel="noopener noreferrer"
            onClick={async (e) => {
              e.preventDefault();
              const targetUrl = "https://github.com/prince19112003";
              try {
                const { open } = await import('@tauri-apps/plugin-shell');
                await open(targetUrl);
              } catch (err) {
                window.open(targetUrl, "_blank", "noopener,noreferrer");
              }
            }}
            title="GitHub Profile (prince19112003)"
            className={`w-9.5 h-9.5 flex items-center justify-center rounded-xl transition-all github-shine-btn shadow-sm cursor-pointer ${isLight
                ? 'text-slate-700 hover:text-slate-900 bg-slate-100 border border-slate-300 hover:bg-slate-200'
                : 'text-slate-200 hover:text-white bg-white/5 border border-white/10 hover:border-indigo-400/50'
              }`}
          >
            <GithubIcon className="w-5.5 h-5.5" />
          </a>

          {/* THEME TOGGLE BUTTON */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors cursor-pointer ${isLight
                ? 'bg-white hover:bg-slate-50 border border-slate-300 text-blue-600 shadow-xs'
                : 'bg-[#161922] hover:bg-[#202534] border border-[#2d3548] text-amber-400'
              }`}
          >
            {isLight ? (
              <Moon className="w-4.5 h-4.5" />
            ) : (
              <Sun className="w-4.5 h-4.5" />
            )}
          </button>

          <button
            onClick={() => navigate('/settings')}
            title="Settings"
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors group relative cursor-pointer ${isLight
                ? 'bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 shadow-xs'
                : 'bg-[#161922] hover:bg-[#202534] border border-[#2d3548] text-slate-300 hover:text-white'
              }`}
          >
            <Settings className="w-4.5 h-4.5 transition-transform duration-300 ease-out group-hover:rotate-90" />
            {hasUpdate && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#fa5a3f]" />
            )}
          </button>
        </div>
      </header>

      {/* === BROADCAST BANNER — minimal, professional, pinkish-orange accent bar === */}
      <AnimatePresence>
        {isAnnouncementVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`z-40 shrink-0 overflow-hidden border-b ${
              isLight
                ? 'bg-[#fff8f6] border-[#fa5a3f]/25'
                : 'bg-[#140e0f] border-[#fa5a3f]/30'
            }`}
          >
            {/* Left pinkish-orange minimal color bar */}
            <div className="flex">
              <div className="w-0.75 shrink-0 bg-[#fa5a3f]" />
              <div className="flex-1 px-4 py-2.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className={`text-[10px] font-bold uppercase tracking-widest font-mono shrink-0 px-2 py-0.5 rounded border ${
                    isLight
                      ? 'bg-[#fa5a3f]/10 text-[#d03c20] border-[#fa5a3f]/25'
                      : 'bg-[#fa5a3f]/15 text-[#ff8773] border-[#fa5a3f]/30'
                  }`}>
                    Notice
                  </span>
                  <p className={`text-[12.5px] font-medium leading-snug ${
                    isLight ? 'text-slate-800' : 'text-slate-100'
                  }`}>
                    {rawAnnouncement}
                  </p>
                </div>

                <button
                  onClick={handleDismissAnnouncement}
                  title="Dismiss notice"
                  className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded cursor-pointer transition-colors border ${
                    isLight
                      ? 'border-[#fa5a3f]/30 text-[#c73820] hover:bg-[#fa5a3f]/10'
                      : 'border-[#fa5a3f]/35 text-[#ff8773] hover:bg-[#fa5a3f]/15 hover:text-white'
                  }`}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Update Modal — opened by header button or auto when hasUpdate fires */}
      {showUpdateModal && (
        <UpdateModal forceShow={false} onClosePreview={() => setShowUpdateModal(false)} />
      )}

      {/* === GLOBAL SEARCH & SMART BOARD MODALS === */}
      <AnimatePresence>
        {searchOpen && <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>

      <React.Suspense fallback={null}>
        <SmartBoardModal isOpen={smartBoardOpen} onClose={() => setSmartBoardOpen(false)} />
      </React.Suspense>

      {/* === SMARTBOARD SIDE DOCK (Auto-collapsible Smartboard toolbar) === */}
      {!licenseContext?.settings?.disableSmartBoard && (
        <SmartBoardSideDock
          isHome={isHome}
          isLight={isLight}
          onOpenBoard={() => setSmartBoardOpen(true)}
          onBack={handleBack}
          onHome={() => navigate('/languages')}
        />
      )}

      {/* === MAIN CONTENT === */}
      <main className="relative z-0 flex-1 overflow-hidden flex flex-col">
        <Outlet />
      </main>

      {/* Portal roots */}
      <div id="notification-root" className="fixed top-20 right-4 z-1060 flex flex-col gap-2 pointer-events-none" />
      <div id="dialog-root" className="relative z-1050" />
      <div id="tooltip-root" className="fixed inset-0 pointer-events-none z-1040" />
    </div>
  );
};
