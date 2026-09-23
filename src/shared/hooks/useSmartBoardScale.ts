import { useEffect, useState } from 'react';

/**
 * Baseline 16:9 Canvas Dimensions
 * 1920x1080 represents the industry standard reference resolution for
 * interactive flat panels (IFPs) and classroom projectors.
 */
const BASELINE_WIDTH = 1920;
const BASELINE_HEIGHT = 1080;

export interface SmartBoardScaleInfo {
  scale: number;
  width: number;
  height: number;
  isLandscape: boolean;
  is4KOrHigher: boolean;
  touchTargetMultiplier: number;
}

/**
 * useSmartBoardScale
 * 
 * Provides dynamic viewport scaling metrics so visualizer stages, smartboard canvas,
 * and UI docks scale up or down proportionally without needing manual media queries.
 */
export function useSmartBoardScale(): SmartBoardScaleInfo {
  const [scaleInfo, setScaleInfo] = useState<SmartBoardScaleInfo>(() => {
    if (typeof window === 'undefined') {
      return {
        scale: 1,
        width: BASELINE_WIDTH,
        height: BASELINE_HEIGHT,
        isLandscape: true,
        is4KOrHigher: false,
        touchTargetMultiplier: 1,
      };
    }

    const w = window.innerWidth;
    const h = window.innerHeight;
    const s = Math.min(w / BASELINE_WIDTH, h / BASELINE_HEIGHT);
    const is4K = w >= 3840 || h >= 2160;

    return {
      scale: s,
      width: w,
      height: h,
      isLandscape: w >= h,
      is4KOrHigher: is4K,
      touchTargetMultiplier: is4K ? 1.5 : s < 0.8 ? 1.1 : 1,
    };
  });

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const s = Math.min(w / BASELINE_WIDTH, h / BASELINE_HEIGHT);
      const is4K = w >= 3840 || h >= 2160;

      // Update CSS custom properties on :root for global stylesheet consumption
      document.documentElement.style.setProperty('--sb-scale', s.toFixed(4));
      document.documentElement.style.setProperty('--sb-vw', `${w}px`);
      document.documentElement.style.setProperty('--sb-vh', `${h}px`);

      setScaleInfo({
        scale: s,
        width: w,
        height: h,
        isLandscape: w >= h,
        is4KOrHigher: is4K,
        touchTargetMultiplier: is4K ? 1.5 : s < 0.8 ? 1.1 : 1,
      });
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);

    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return scaleInfo;
}
