import React from 'react';
import { X } from 'lucide-react';

export type SimulationState = 'universe' | 'warp' | 'space' | 'approach' | 'entry' | 'surface';

interface HelmetHUDProps {
  simState: SimulationState;
  speed: number;           // units/s or km/s
  targetLabel: string;     // "Sun", "Earth", "Supermassive Black Hole", "Milky Way", etc.
  targetDistance: number;  // in km (for display)
  isLocked?: boolean;
  warningMessage?: string | null;
  canEnterSolarSystem?: boolean;
  onEnterSolarSystem?: () => void;
  canEnterEarth?: boolean;
  onEnterEarth?: () => void;
  altitudeKm?: number;
  heatShieldTemp?: number;
  entryProgress?: number;
  compassHeading?: number;
  compassPitch?: number;
  onAbortEntry?: () => void;
  onFocusTarget?: (targetKey: string) => void;
  onExit: () => void;
}

/**
 * Minimalist astronaut helmet visor HUD overlay.
 * Layered over the Three.js canvas with CSS absolute positioning.
 * Shows only essential telemetry — no clutter.
 */
export const HelmetHUD: React.FC<HelmetHUDProps> = ({
  simState,
  speed,
  targetLabel,
  targetDistance,
  isLocked = false,
  warningMessage = null,
  canEnterSolarSystem = false,
  onEnterSolarSystem,
  canEnterEarth = false,
  onEnterEarth,
  altitudeKm = 450,
  heatShieldTemp = 20,
  entryProgress = 0,
  compassHeading = 0,
  compassPitch = 0,
  onAbortEntry,
  onFocusTarget,
  onExit,
}) => {
  const getCompassCardinal = (deg: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };
  const fmtDist = (km: number): string => {
    // If astronomical intergalactic scale (1 ly = 9.461e12 km)
    if (km >= 9.461e12) {
      const ly = km / 9.461e12;
      if (ly >= 1e6) return `${(ly / 1e6).toFixed(1)} M ly`;
      if (ly >= 1000) return `${(ly / 1000).toFixed(1)} k ly`;
      return `${ly.toFixed(1)} ly`;
    }
    if (km >= 1e9) return `${(km / 1e9).toFixed(2)} bn km`;
    if (km >= 1e6) return `${(km / 1e6).toFixed(1)} M km`;
    if (km >= 1000) return `${(km / 1000).toFixed(0)} k km`;
    return `${Math.round(km)} km`;
  };

  const fmtSpeed = (s: number): string => {
    if (s >= 300_000) return `${(s / 300_000).toFixed(2)} c (Warp)`;
    if (s >= 1000) return `${(s / 1000).toFixed(1)} km/s`;
    return `${Math.round(s)} m/s`;
  };

  const getExitLabel = (): string => {
    if (simState === 'universe') return 'Exit to Hub';
    if (simState === 'surface') return 'Return to Orbit';
    return 'Exit to Universe';
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      {/* ── Subtle Helmet Glass Curvature Vignette ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '12% / 8%',
          border: '28px solid rgba(0,0,0,0.55)',
          boxSizing: 'border-box',
          pointerEvents: 'none',
        }}
      />
      {/* Inner glass rim highlight — single crisp edge */}
      <div
        style={{
          position: 'absolute',
          inset: 28,
          borderRadius: '8% / 6%',
          border: '1px solid rgba(160,210,255,0.12)',
          boxSizing: 'border-box',
          pointerEvents: 'none',
        }}
      />

      {/* ── Exit / Abort Button (top-right, pointer events enabled) ── */}
      {simState === 'entry' ? (
        <button
          type="button"
          onClick={onAbortEntry}
          style={{
            position: 'absolute',
            top: 48,
            right: 52,
            pointerEvents: 'all',
            background: 'rgba(153, 27, 27, 0.75)',
            border: '1px solid rgba(248, 113, 113, 0.85)',
            borderRadius: 6,
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            backdropFilter: 'blur(4px)',
          }}
        >
          <X size={13} />
          Abort Re-entry
        </button>
      ) : (
        <button
          type="button"
          id="hud-exit-btn"
          onClick={onExit}
          style={{
            position: 'absolute',
            top: 48,
            right: 52,
            pointerEvents: 'all',
            background: 'rgba(0,0,0,0.65)',
            border: '1px solid rgba(255,255,255,0.22)',
            borderRadius: 6,
            color: 'rgba(255,255,255,0.9)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            backdropFilter: 'blur(4px)',
          }}
        >
          <X size={13} />
          {getExitLabel()}
        </button>
      )}

      {/* ── Plasma Sheath Ionization Heat Glow Overlay (Visor Rim Incandescence) ── */}
      {simState === 'entry' && heatShieldTemp > 120 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '12% / 8%',
            boxShadow: `inset 0 0 ${Math.min(140, (heatShieldTemp / 2000) * 160)}px rgba(255, 90, 15, ${Math.min(0.85, (heatShieldTemp / 2000) * 0.95)}), inset 0 0 50px rgba(255, 220, 80, 0.55)`,
            pointerEvents: 'none',
            transition: 'box-shadow 0.2s ease-out',
          }}
        />
      )}

      {/* ── Cloud Piercing Mist Overlay (Atmospheric Vapor Rush) ── */}
      {simState === 'entry' && entryProgress >= 0.42 && entryProgress <= 0.82 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.45) 0%, rgba(200,225,255,0.75) 50%, rgba(255,255,255,0.85) 100%)',
            opacity: Math.sin(((entryProgress - 0.42) / 0.40) * Math.PI) * 0.85,
            pointerEvents: 'none',
            transition: 'opacity 0.15s ease',
          }}
        />
      )}

      {/* ── Atmospheric Entry Telemetry Card ── */}
      {simState === 'entry' && (
        <div
          style={{
            position: 'absolute',
            top: 90,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 20,
            padding: '8px 20px',
            background: 'rgba(10, 15, 28, 0.82)',
            border: '1px solid rgba(160, 210, 255, 0.35)',
            borderRadius: 6,
            fontFamily: 'monospace',
            fontSize: 11,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            backdropFilter: 'blur(5px)',
            pointerEvents: 'none',
          }}
        >
          <div>
            <span style={{ color: 'rgba(160,210,255,0.5)' }}>ALT </span>
            <span style={{ color: '#fff', fontWeight: 700 }}>{Math.round(altitudeKm)} km</span>
          </div>
          <div>
            <span style={{ color: 'rgba(160,210,255,0.5)' }}>VEL </span>
            <span style={{ color: '#fff', fontWeight: 700 }}>{fmtSpeed(speed)}</span>
          </div>
          <div>
            <span style={{ color: 'rgba(160,210,255,0.5)' }}>HEAT </span>
            <span style={{ color: heatShieldTemp > 1200 ? '#f87171' : '#fef08a', fontWeight: 700 }}>
              {Math.round(heatShieldTemp)} °C
            </span>
          </div>
          <div>
            <span style={{ color: 'rgba(160,210,255,0.5)' }}>CORRIDOR </span>
            <span style={{ color: '#4ade80', fontWeight: 700 }}>-6.2° NOM</span>
          </div>
        </div>
      )}

      {/* ── Surface Compass Ribbon & Environmental Sensors (Phase 4) ── */}
      {simState === 'surface' && (
        <>
          {/* Compass Ribbon (Top Center) */}
          <div
            style={{
              position: 'absolute',
              top: 48,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '6px 20px',
              background: 'rgba(8, 14, 26, 0.82)',
              border: '1px solid rgba(160, 210, 255, 0.35)',
              borderRadius: 6,
              color: '#ffffff',
              fontFamily: 'monospace',
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              backdropFilter: 'blur(5px)',
              pointerEvents: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: 'rgba(160,210,255,0.5)' }}>HDG</span>
              <span style={{ color: '#38bdf8', fontWeight: 700 }}>
                {String(Math.round(compassHeading)).padStart(3, '0')}° {getCompassCardinal(compassHeading)}
              </span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: 'rgba(160,210,255,0.5)' }}>PITCH</span>
              <span style={{ color: '#a7f3d0', fontWeight: 700 }}>
                {compassPitch >= 0 ? `+${Math.round(compassPitch)}°` : `${Math.round(compassPitch)}°`}
              </span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: 'rgba(160,210,255,0.5)' }}>STANCE</span>
              <span style={{ color: '#fde047', fontWeight: 700 }}>GROUNDED</span>
            </div>
          </div>

          {/* Environmental Sensor Bar (Bottom Center above guide) */}
          <div
            style={{
              position: 'absolute',
              bottom: 92,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 14,
              padding: '5px 16px',
              background: 'rgba(8, 14, 26, 0.75)',
              border: '1px solid rgba(160, 210, 255, 0.22)',
              borderRadius: 4,
              color: 'rgba(215, 235, 255, 0.85)',
              fontFamily: 'monospace',
              fontSize: 9,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              pointerEvents: 'none',
              backdropFilter: 'blur(4px)',
            }}
          >
            <span>ATM 1.013 BAR</span>
            <span>·</span>
            <span>O₂ 20.9% / N₂ 78.1%</span>
            <span>·</span>
            <span>GRAVITY 1.00 G</span>
            <span>·</span>
            <span>TEMP 21.4°C</span>
            <span>·</span>
            <span>ELEV 1,420 M</span>
          </div>
        </>
      )}

      {/* ── Simulation State Badge (top-left) ── */}
      <div
        style={{
          position: 'absolute',
          top: 48,
          left: 52,
          color: 'rgba(160,210,255,0.85)',
          fontFamily: 'monospace',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}
      >
        {simState === 'universe' && '⬡ Deep Universe · Intergalactic View'}
        {simState === 'warp'     && '⚡ Relativistic Hyper-Descent'}
        {simState === 'space'    && '◎ Solar System · Planetary Space'}
        {simState === 'approach' && '◎ Orbital Approach'}
        {simState === 'entry'    && '⟩ Atmospheric Entry · Re-entry Corridor'}
        {simState === 'surface'  && '▣ Surface Observation · Terra Firma Vantage'}
      </div>

      {/* ── Quick Target Navigation Strip ── */}
      {onFocusTarget && (simState === 'universe' || simState === 'space' || simState === 'approach') && (
        <div
          style={{
            position: 'absolute',
            top: 74,
            left: 52,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
            pointerEvents: 'all',
            maxWidth: 'calc(100% - 104px)',
            zIndex: 10,
          }}
        >
          {simState === 'universe' ? (
            <>
              <button
                type="button"
                id="hud-target-milkyway"
                onClick={() => onFocusTarget('milkyway')}
                style={{
                  padding: '4px 10px',
                  background: 'rgba(10, 16, 28, 0.75)',
                  border: '1px solid rgba(160, 210, 255, 0.3)',
                  borderRadius: 4,
                  color: 'rgba(215, 235, 255, 0.9)',
                  fontFamily: 'monospace',
                  fontSize: 10,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  backdropFilter: 'blur(4px)',
                }}
              >
                🌌 Milky Way
              </button>
              <button
                type="button"
                id="hud-target-blackhole"
                onClick={() => onFocusTarget('blackhole')}
                style={{
                  padding: '4px 10px',
                  background: 'rgba(28, 12, 12, 0.75)',
                  border: '1px solid rgba(248, 113, 113, 0.4)',
                  borderRadius: 4,
                  color: '#fca5a5',
                  fontFamily: 'monospace',
                  fontSize: 10,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  backdropFilter: 'blur(4px)',
                }}
              >
                🕳️ Black Hole
              </button>
              <button
                type="button"
                id="hud-target-andromeda"
                onClick={() => onFocusTarget('andromeda')}
                style={{
                  padding: '4px 10px',
                  background: 'rgba(10, 16, 28, 0.75)',
                  border: '1px solid rgba(160, 210, 255, 0.3)',
                  borderRadius: 4,
                  color: 'rgba(215, 235, 255, 0.9)',
                  fontFamily: 'monospace',
                  fontSize: 10,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  backdropFilter: 'blur(4px)',
                }}
              >
                ✨ Andromeda
              </button>
              <button
                type="button"
                id="hud-target-sombrero"
                onClick={() => onFocusTarget('sombrero')}
                style={{
                  padding: '4px 10px',
                  background: 'rgba(10, 16, 28, 0.75)',
                  border: '1px solid rgba(160, 210, 255, 0.3)',
                  borderRadius: 4,
                  color: 'rgba(215, 235, 255, 0.9)',
                  fontFamily: 'monospace',
                  fontSize: 10,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  backdropFilter: 'blur(4px)',
                }}
              >
                💫 Sombrero
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                id="hud-target-sun"
                onClick={() => onFocusTarget('sun')}
                style={{
                  padding: '4px 10px',
                  background: 'rgba(28, 20, 8, 0.75)',
                  border: '1px solid rgba(251, 191, 36, 0.4)',
                  borderRadius: 4,
                  color: '#fef08a',
                  fontFamily: 'monospace',
                  fontSize: 10,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  backdropFilter: 'blur(4px)',
                }}
              >
                ☀️ Sun
              </button>
              {['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'].map((pId) => (
                <button
                  key={pId}
                  type="button"
                  id={`hud-target-${pId}`}
                  onClick={() => onFocusTarget(pId)}
                  style={{
                    padding: '4px 9px',
                    background: pId === 'earth' ? 'rgba(6, 40, 30, 0.75)' : 'rgba(10, 16, 28, 0.75)',
                    border: pId === 'earth' ? '1px solid rgba(52, 211, 153, 0.5)' : '1px solid rgba(160, 210, 255, 0.25)',
                    borderRadius: 4,
                    color: pId === 'earth' ? '#6ee7b7' : 'rgba(215, 235, 255, 0.85)',
                    fontFamily: 'monospace',
                    fontSize: 10,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  {pId === 'saturn' ? '🪐 Saturn' : pId === 'earth' ? '🌍 Earth' : pId}
                </button>
              ))}
            </>
          )}
        </div>
      )}

      {/* ── Gravitational Tidal Anomaly Warning (Top Center) ── */}
      {warningMessage && (
        <div
          style={{
            position: 'absolute',
            top: 48,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 18px',
            background: 'rgba(220, 38, 38, 0.22)',
            border: '1px solid rgba(239, 68, 68, 0.65)',
            borderRadius: 6,
            color: '#fca5a5',
            fontFamily: 'monospace',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            backdropFilter: 'blur(4px)',
            pointerEvents: 'none',
          }}
        >
          <span>⚠</span>
          <span>{warningMessage}</span>
        </div>
      )}

      {/* ── Earth Atmospheric Entry Trigger (Center Prompt in Approach State) ── */}
      {simState === 'approach' && canEnterEarth && (
        <div
          style={{
            position: 'absolute',
            bottom: 115,
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'all',
          }}
        >
          <button
            type="button"
            id="hud-entry-btn"
            onClick={onEnterEarth}
            style={{
              padding: '10px 24px',
              background: 'rgba(16, 185, 129, 0.28)',
              border: '1px solid rgba(52, 211, 153, 0.85)',
              borderRadius: 6,
              color: '#ffffff',
              fontFamily: 'monospace',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <span>🌍</span>
            <span>Initiate Atmospheric Entry</span>
          </button>
        </div>
      )}

      {/* ── Solar System Descent Trigger (Center Prompt in Universe State) ── */}
      {simState === 'universe' && canEnterSolarSystem && (
        <div
          style={{
            position: 'absolute',
            bottom: 115,
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'all',
          }}
        >
          <button
            type="button"
            id="hud-descent-btn"
            onClick={onEnterSolarSystem}
            style={{
              padding: '10px 22px',
              background: 'rgba(30, 58, 138, 0.75)',
              border: '1px solid rgba(96, 165, 250, 0.8)',
              borderRadius: 6,
              color: '#ffffff',
              fontFamily: 'monospace',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 0 16px rgba(59, 130, 246, 0.4)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <span>🚀</span>
            <span>Initiate Solar System Descent</span>
          </button>
        </div>
      )}

      {/* ── Target Crosshair (center, minimal) ── */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 24,
          height: 24,
          pointerEvents: 'none',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <line x1="12" y1="0" x2="12" y2="8" stroke="rgba(160,210,255,0.5)" strokeWidth="1" />
          <line x1="12" y1="16" x2="12" y2="24" stroke="rgba(160,210,255,0.5)" strokeWidth="1" />
          <line x1="0" y1="12" x2="8" y2="12" stroke="rgba(160,210,255,0.5)" strokeWidth="1" />
          <line x1="16" y1="12" x2="24" y2="12" stroke="rgba(160,210,255,0.5)" strokeWidth="1" />
          <circle cx="12" cy="12" r="1.5" fill="rgba(160,210,255,0.7)" />
        </svg>
      </div>

      {/* ── Center Pointer Lock Activation Hint ── */}
      {!isLocked && (
        <div
          style={{
            position: 'absolute',
            top: 50,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '5px 14px',
            background: 'rgba(8, 12, 22, 0.72)',
            border: '1px solid rgba(160, 210, 255, 0.25)',
            borderRadius: 4,
            color: 'rgba(215, 235, 255, 0.85)',
            fontFamily: 'monospace',
            fontSize: 10,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            pointerEvents: 'none',
            backdropFilter: 'blur(3px)',
          }}
        >
          Click Viewport to Engage Look · ESC to Release
        </div>
      )}

      {/* ── Bottom Controls Guide ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 54,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 12,
          color: 'rgba(160, 210, 255, 0.45)',
          fontFamily: 'monospace',
          fontSize: 9,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}
      >
        {simState === 'surface' ? (
          <>
            <span>360° Mouse Look</span>
            <span>·</span>
            <span>Boots Grounded (Locked Stance)</span>
            <span>·</span>
            <span>Zenith & Horizon View</span>
          </>
        ) : (
          <>
            <span>WASD Move</span>
            <span>·</span>
            <span>Q/E Vertical</span>
            <span>·</span>
            <span>Shift Turbo (×12)</span>
            <span>·</span>
            <span>Ctrl Ultra (×120)</span>
          </>
        )}
      </div>

      {/* ── Bottom Telemetry Bar ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 52,
          left: 52,
          right: 52,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}
      >
        {/* Speed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ color: 'rgba(160,210,255,0.45)', fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Velocity
          </span>
          <span style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'monospace', fontSize: 14, fontWeight: 700 }}>
            {fmtSpeed(speed)}
          </span>
        </div>

        {/* Target */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'right' }}>
          <span style={{ color: 'rgba(160,210,255,0.45)', fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Target
          </span>
          <span style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'monospace', fontSize: 14, fontWeight: 700 }}>
            {targetLabel}
          </span>
          <span style={{ color: 'rgba(160,210,255,0.55)', fontFamily: 'monospace', fontSize: 10 }}>
            {fmtDist(targetDistance)}
          </span>
        </div>
      </div>
    </div>
  );
};
