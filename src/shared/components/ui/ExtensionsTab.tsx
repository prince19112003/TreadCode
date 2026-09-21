import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package, Download, Trash2, CheckCircle2,
  AlertCircle, HardDrive, RefreshCw
} from 'lucide-react';
import { useModuleStore, MODULE_CATALOG, type ModuleStatus } from '../../hooks/useModuleStore';

// ─── Status Pill ─────────────────────────────────────────────────────────────

const StatusPill: React.FC<{ status: ModuleStatus; progress?: number }> = ({ status, progress = 0 }) => {
  if (status === 'installed') {
    return (
      <span className="text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full"
        style={{ color: '#4ade80', background: 'rgba(74,222,128,0.10)', border: '1px solid rgba(74,222,128,0.28)' }}>
        Installed
      </span>
    );
  }
  if (status === 'downloading') {
    return (
      <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full"
        style={{ color: '#60a5fa', background: 'rgba(96,165,250,0.10)', border: '1px solid rgba(96,165,250,0.28)' }}>
        <RefreshCw size={10} className="animate-spin" />
        {progress > 0 ? `${progress}%` : 'Starting'}
      </span>
    );
  }
  if (status === 'error') {
    return (
      <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full"
        style={{ color: '#f87171', background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.28)' }}>
        <AlertCircle size={10} />
        Failed
      </span>
    );
  }
  return null;
};

// ─── Progress Bar ─────────────────────────────────────────────────────────────

const ProgressBar: React.FC<{ progress: number; visible: boolean }> = ({ progress, visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        exit={{ opacity: 0, scaleY: 0 }}
        className="mt-3 h-1 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #4f46e5, #818cf8)' }}
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Module Row ───────────────────────────────────────────────────────────────

const ModuleRow: React.FC<{
  name: string;
  topics: number;
  programs: number;
  sizeKB: number;
  status: ModuleStatus;
  progress: number;
  onInstall: () => void;
  onUninstall: () => void;
}> = ({ name, topics, programs, sizeKB, status, progress, onInstall, onUninstall }) => {
  const isDownloading = status === 'downloading';
  const isInstalled = status === 'installed';
  const isError = status === 'error';

  return (
    <div
      className="rounded-xl px-4 py-3.5 transition-all duration-200"
      style={{
        background: isInstalled ? 'rgba(74,222,128,0.03)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isInstalled ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.07)'}`,
      }}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Icon + Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: isInstalled ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {isInstalled
              ? <CheckCircle2 size={15} className="text-emerald-400" />
              : <Package size={15} className="text-slate-400" />
            }
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-white leading-none">{name}</span>
              <StatusPill status={status} progress={progress} />
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">
              {topics} topics · {programs} programs
              {isInstalled
                ? ` · ${sizeKB >= 1024 ? (sizeKB / 1024).toFixed(1) + ' MB' : sizeKB + ' KB'} on disk`
                : ` · ~${sizeKB >= 1024 ? (sizeKB / 1024).toFixed(1) + ' MB' : sizeKB + ' KB'} download`
              }
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="shrink-0 flex items-center gap-2">
          {isInstalled ? (
            <button
              onClick={onUninstall}
              title="Uninstall & free space"
              className="w-7 h-7 flex items-center justify-center rounded-lg transition-all cursor-pointer hover:bg-red-500/10 text-slate-500 hover:text-red-400"
              style={{ border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <Trash2 size={13} />
            </button>
          ) : (
            <button
              onClick={isDownloading ? undefined : (isError ? onInstall : onInstall)}
              disabled={isDownloading}
              title={isError ? 'Retry download' : 'Download module'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                ${isDownloading
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer hover:brightness-110 active:scale-95'}
              `}
              style={{
                background: isError ? 'rgba(248,113,113,0.12)' : 'rgba(99,102,241,0.15)',
                border: isError ? '1px solid rgba(248,113,113,0.3)' : '1px solid rgba(99,102,241,0.35)',
                color: isError ? '#f87171' : '#818cf8',
              }}
            >
              {isDownloading ? (
                <RefreshCw size={11} className="animate-spin" />
              ) : isError ? (
                <AlertCircle size={11} />
              ) : (
                <Download size={11} />
              )}
              <span>{isDownloading ? 'Downloading' : isError ? 'Retry' : 'Download'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar progress={progress} visible={isDownloading} />
    </div>
  );
};

// ─── Main ExtensionsTab ───────────────────────────────────────────────────────

export const ExtensionsTab: React.FC = () => {
  const {
    moduleStatus,
    downloadProgress,
    storageUsedKB,
    isInitialized,
    init,
    installModule,
    uninstallModule,
  } = useModuleStore();

  useEffect(() => {
    init();
  }, [init]);

  const installedCount = MODULE_CATALOG.filter(m => moduleStatus[m.id] === 'installed').length;

  const storageLabel = storageUsedKB >= 1024
    ? `${(storageUsedKB / 1024).toFixed(1)} MB`
    : storageUsedKB > 0
      ? `${storageUsedKB} KB`
      : '0 KB';

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500 text-sm">
        <RefreshCw size={14} className="animate-spin mr-2" /> Loading...
      </div>
    );
  }

  return (
    <motion.div
      key="extensions"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
      style={{ background: '#090b15', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.5rem' }}
    >
      {/* Header */}
      <div className="border-b pb-4" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <h2 className="text-lg font-black text-white flex items-center gap-2">
          <Package size={18} className="text-indigo-400" />
          <span>Module Extensions</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Install language modules on-demand. Python is always built-in and requires no installation.
        </p>
      </div>

      {/* Storage Summary */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-xl"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-2.5 text-xs text-slate-400">
          <HardDrive size={14} className="text-slate-500" />
          <span>
            <strong className="text-slate-200 font-bold">{installedCount}</strong>
            {installedCount === 1 ? ' module' : ' modules'} installed
            {storageUsedKB > 0 && (
              <span className="ml-1.5 font-mono text-slate-500">· {storageLabel} used</span>
            )}
          </span>
        </div>

        {installedCount > 0 && (
          <button
            onClick={() => {
              MODULE_CATALOG.forEach(m => {
                if (moduleStatus[m.id] === 'installed') uninstallModule(m.id);
              });
            }}
            className="text-[10px] font-bold text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Built-in Python — static readonly row */}
      <div>
        <p className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-500 mb-3">Built-in</p>
        <div
          className="rounded-xl px-4 py-3.5"
          style={{ background: 'rgba(74,222,128,0.03)', border: '1px solid rgba(74,222,128,0.10)' }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)' }}>
                <CheckCircle2 size={15} className="text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white leading-none">Python</span>
                  <span className="text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ color: '#4ade80', background: 'rgba(74,222,128,0.10)', border: '1px solid rgba(74,222,128,0.28)' }}>
                    Built-in
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">16 topics · 100 programs · Always available</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Downloadable Modules */}
      <div>
        <p className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-500 mb-3">Downloadable Modules</p>
        <div className="space-y-2">
          {MODULE_CATALOG.map(mod => (
            <ModuleRow
              key={mod.id}
              name={mod.name}
              topics={mod.topics}
              programs={mod.programs}
              sizeKB={mod.sizeKB}
              status={moduleStatus[mod.id] || 'not_installed'}
              progress={downloadProgress[mod.id] || 0}
              onInstall={() => installModule(mod.id)}
              onUninstall={() => uninstallModule(mod.id)}
            />
          ))}
        </div>
      </div>

      {/* Footer note */}
      <p className="text-[10px] text-slate-600 font-mono text-center pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
        Modules are stored locally on your device. No reinstall needed after closing the app.
      </p>
    </motion.div>
  );
};
