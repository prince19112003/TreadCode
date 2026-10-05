import React, { Suspense, lazy } from 'react';

const SolarSystemScene = lazy(() =>
  import('../scenes/SolarSystemScene').then((m) => ({ default: m.SolarSystemScene }))
);

const Loader: React.FC = () => (
  <div
    style={{
      position: 'fixed', inset: 0, background: '#000005',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}
  >
    <span style={{ color: 'rgba(160,210,255,0.6)', fontFamily: 'monospace', fontSize: 12, letterSpacing: '0.1em' }}>
      INITIALIZING ENGINE...
    </span>
  </div>
);

/**
 * Full-page Solar System viewer.
 * Rendered completely outside GlobalAppShell (no navbar, no header).
 * Pure cinema viewport — only the 3D canvas + HUD overlay.
 */
export const SolarSystemPage: React.FC = () => (
  <Suspense fallback={<Loader />}>
    <SolarSystemScene />
  </Suspense>
);
