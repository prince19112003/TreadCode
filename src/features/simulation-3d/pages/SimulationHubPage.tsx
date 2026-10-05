import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Orbit, Cpu } from 'lucide-react';
import { useHardwareCapability } from '../hooks/useHardwareCapability';
import { SimulationErrorBoundary } from '../components/SimulationErrorBoundary';
import { useThemeStore } from '@shared/hooks/useThemeStore';

const SolarSystemGraphic: React.FC = () => (
  <svg viewBox="0 0 160 160" className="w-full h-full" fill="none">
    {/* Concentric Orbits */}
    <circle cx="80" cy="80" r="28" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
    <circle cx="80" cy="80" r="46" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
    <circle cx="80" cy="80" r="64" stroke="#334155" strokeWidth="1" />
    
    {/* Sun at center */}
    <circle cx="80" cy="80" r="14" fill="#f59e0b" />
    <circle cx="80" cy="80" r="17" stroke="#fbbf24" strokeWidth="1" opacity="0.6" />

    {/* Planet 1 (Inner) */}
    <circle cx="98" cy="62" r="3.5" fill="#38bdf8" />
    {/* Planet 2 (Habitable) */}
    <circle cx="50" cy="98" r="4.5" fill="#10b981" />
    {/* Planet 3 (Gas Giant with Ring) */}
    <g transform="translate(126, 80)">
      <circle cx="0" cy="0" r="7" fill="#f97316" />
      <ellipse cx="0" cy="0" rx="12" ry="3.5" stroke="#fed7aa" strokeWidth="1.2" transform="rotate(-20)" />
    </g>
  </svg>
);

export const SimulationHubPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const isLight = theme === 'light';
  const hardware = useHardwareCapability();

  return (
    <SimulationErrorBoundary>
      <div className="flex flex-col flex-1 overflow-y-auto w-full relative">
        <div className="flex flex-col items-center pt-5 md:pt-7 pb-14 px-4 min-h-full max-w-5xl mx-auto w-full">
          
          {/* Header Navigation & Hardware Status */}
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b"
            style={{ borderColor: isLight ? '#e2e8f0' : '#1e2433' }}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/languages')}
                className={`p-2 rounded-lg border transition-colors cursor-pointer flex items-center justify-center ${
                  isLight
                    ? 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                    : 'border-slate-800 bg-[#0f121a] text-slate-300 hover:bg-[#151924]'
                }`}
                title="Back to Curriculum"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    3D Simulation Hub
                  </h1>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-semibold">
                    Sandboxed
                  </span>
                </div>
                <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Zero standby load. Hardware acceleration engages only upon entering an active visual.
                </p>
              </div>
            </div>

            {/* Hardware Capability Pill */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono self-start sm:self-auto ${
              hardware.supported
                ? isLight
                  ? 'border-slate-300 bg-slate-100 text-slate-700'
                  : 'border-[#1e2433] bg-[#0b0d13] text-slate-300'
                : 'border-amber-700/50 bg-amber-950/20 text-amber-300'
            }`}>
              <Cpu className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate max-w-50" title={hardware.renderer}>
                {hardware.isChecking ? 'Probing GPU...' : hardware.renderer}
              </span>
              <span className={`w-2 h-2 rounded-full shrink-0 ${hardware.supported ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </div>
          </div>

          {/* Simulations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
            
            {/* Card 1: Solar System */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => navigate('/simulation-3d/solar-system')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigate('/simulation-3d/solar-system');
                }
              }}
              className="relative flex flex-col justify-between overflow-hidden rounded-lg transition-all duration-200 min-h-60 p-5 group select-none cursor-pointer border"
              style={{
                background: isLight ? '#ffffff' : '#0b0d13',
                borderColor: isLight ? '#cbd5e1' : '#1e2433',
                boxShadow: isLight ? '0 1px 3px 0 rgba(15, 23, 42, 0.08)' : 'none',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(-2px)';
                el.style.borderColor = '#38bdf8';
                el.style.backgroundColor = isLight ? '#ffffff' : '#11141d';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(0)';
                el.style.borderColor = isLight ? '#cbd5e1' : '#1e2433';
                el.style.backgroundColor = isLight ? '#ffffff' : '#0b0d13';
              }}
            >
              {/* Top Status Tag */}
              <div className="absolute top-0 right-4 z-20">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border-x border-b rounded-b-md ${
                  isLight
                    ? 'text-sky-800 bg-sky-50 border-sky-300'
                    : 'text-sky-300 bg-[#092238] border-[#0e3b61]'
                }`}>
                  <Orbit className="w-2.5 h-2.5" />
                  Astronomy
                </span>
              </div>

              {/* Right Side Graphic */}
              <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-32 h-32 sm:w-36 sm:h-36 pointer-events-none transition-transform duration-300 flex items-center justify-center shrink-0 group-hover:scale-105 opacity-80 group-hover:opacity-100">
                <SolarSystemGraphic />
              </div>

              {/* Card Content */}
              <div className="relative z-10 pt-3 pr-28 mt-auto">
                <div className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold mb-1">
                  Physics & Kinematics
                </div>
                <h2 className={`text-2xl font-bold mb-1 tracking-tight transition-colors ${
                  isLight ? 'text-slate-950 group-hover:text-blue-600' : 'text-white group-hover:text-sky-300'
                }`}>
                  Solar System
                </h2>
                <p className={`text-xs font-medium mb-4 line-clamp-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Astronaut helmet POV, planetary orbits, scaled distances, and Earth surface exploration.
                </p>

                {/* Specs pill badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t"
                  style={{ borderColor: isLight ? '#f1f5f9' : '#161b26' }}
                >
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                    isLight
                      ? 'border-slate-200 bg-slate-100 text-slate-600'
                      : 'border-slate-800 bg-[#07090e] text-slate-400'
                  }`}>
                    WebGL2
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                    isLight
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-emerald-900/40 bg-emerald-950/20 text-emerald-400'
                  }`}>
                    0 MB Standby
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                    isLight
                      ? 'border-slate-200 bg-slate-100 text-slate-600'
                      : 'border-slate-800 bg-[#07090e] text-slate-400'
                  }`}>
                    60 FPS Target
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </SimulationErrorBoundary>
  );
};
