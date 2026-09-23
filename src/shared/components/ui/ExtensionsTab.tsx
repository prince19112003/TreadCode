import React, { useEffect } from 'react';
import { Download, Trash2, CheckCircle2 } from 'lucide-react';
import { Codicon } from './Codicon';
import { useModuleStore, MODULE_CATALOG, MODULE_SIZE_MAP } from '../../hooks/useModuleStore';
import { useThemeStore } from '../../hooks/useThemeStore';

export const ExtensionsTab: React.FC = () => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

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
      <div className={`flex items-center justify-center py-20 text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
        Loading modules...
      </div>
    );
  }

  return (
    <div
      className="space-y-5 rounded-lg p-6 border transition-colors"
      style={{
        background: isLight ? '#ffffff' : '#0b0d13',
        borderColor: isLight ? '#cbd5e1' : '#1e2433',
        boxShadow: isLight ? '0 1px 3px 0 rgba(15, 23, 42, 0.08)' : 'none',
      }}
    >
      {/* Header */}
      <div className="border-b pb-4" style={{ borderColor: isLight ? '#e2e8f0' : '#1e2433' }}>
        <h2 className={`text-base font-bold tracking-tight flex items-center gap-2.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
          <Codicon name="package" size={18} className={isLight ? 'text-blue-600' : 'text-blue-400'} />
          <span>Module Extensions</span>
        </h2>
        <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          Manage and download language modules for offline code execution and visual tracing.
        </p>
      </div>

      {/* Storage Summary (Only if modules installed) */}
      {installedCount > 0 && (
        <div
          className="flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-xs"
          style={{
            background: isLight ? '#f8fafc' : '#0f121a',
            borderColor: isLight ? '#e2e8f0' : '#1e2433',
          }}
        >
          <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>
            {installedCount} installed · {storageLabel} on disk
          </span>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Uninstall all downloaded module packages?')) {
                MODULE_CATALOG.forEach(m => {
                  if (moduleStatus[m.id] === 'installed') uninstallModule(m.id);
                });
              }
            }}
            className="text-xs text-rose-500 hover:text-rose-600 font-medium cursor-pointer transition-colors"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Downloadable Extension Modules */}
      <div
        className="rounded-lg border overflow-hidden divide-y"
        style={{
          borderColor: isLight ? '#cbd5e1' : '#1e2433',
        }}
      >
        {MODULE_CATALOG.map(mod => {
          const isInstalled = moduleStatus[mod.id] === 'installed';
          const isDownloading = moduleStatus[mod.id] === 'downloading';
          const progress = downloadProgress[mod.id] || 0;
          const formattedSize = MODULE_SIZE_MAP[mod.id] || `${mod.sizeKB} KB`;

          return (
            <div
              key={mod.id}
              className="px-4 py-3.5 flex items-center justify-between gap-3"
              style={{
                background: isLight ? '#ffffff' : '#0f121a',
                borderColor: isLight ? '#e2e8f0' : '#1e2433',
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 border ${
                  isInstalled
                    ? isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                    : isLight ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-white/5 border-white/10 text-slate-400'
                }`}>
                  {isInstalled ? <CheckCircle2 size={16} /> : <Codicon name="package" size={16} />}
                </div>

                <div className="min-w-0">
                  <span className={`text-sm font-semibold block leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {mod.name}
                  </span>
                  {!isInstalled && (
                    <span className={`text-xs font-mono mt-0.5 block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {formattedSize}
                    </span>
                  )}
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                {isDownloading ? (
                  <div className="w-24 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full" style={{ width: `${progress}%` }} />
                  </div>
                ) : isInstalled ? (
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Installed
                    </span>
                    <button
                      type="button"
                      onClick={() => uninstallModule(mod.id)}
                      title="Uninstall"
                      className={`p-1 rounded cursor-pointer transition-colors ${
                        isLight ? 'text-slate-400 hover:text-rose-600' : 'text-slate-500 hover:text-rose-400'
                      }`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => installModule(mod.id)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white cursor-pointer transition-colors"
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <p className={`text-xs text-center pt-2 border-t ${isLight ? 'text-slate-500 border-slate-200' : 'text-slate-500 border-[#1e2433]'}`}>
        Modules are stored locally in offline cache. No re-download needed after restarting the app.
      </p>
    </div>
  );
};
