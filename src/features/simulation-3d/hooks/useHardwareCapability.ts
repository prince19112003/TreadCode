import { useState, useEffect } from 'react';
import type { HardwareCapability } from '../types';

export function detectHardwareCapability(): HardwareCapability {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return { supported: false, renderer: 'SSR', vendor: 'Unknown', hasWebGL2: false };
  }

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;

    // Probe WebGL2 first, fallback to WebGL
    const gl2 = canvas.getContext('webgl2');
    const gl = gl2 || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) {
      return {
        supported: false,
        renderer: 'Hardware acceleration disabled or unsupported',
        vendor: 'Unknown',
        hasWebGL2: false,
      };
    }

    const castGl = gl as WebGLRenderingContext;
    const debugInfo = castGl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo
      ? castGl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      : castGl.getParameter(castGl.RENDERER) || 'Standard WebGL';
    const vendor = debugInfo
      ? castGl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
      : castGl.getParameter(castGl.VENDOR) || 'Standard Vendor';

    // Zero-impact: Release WebGL context immediately to free GPU memory
    const loseContext = castGl.getExtension('WEBGL_lose_context');
    if (loseContext) {
      loseContext.loseContext();
    }

    return {
      supported: true,
      renderer: typeof renderer === 'string' ? renderer : 'Compatible GPU',
      vendor: typeof vendor === 'string' ? vendor : 'GPU Vendor',
      hasWebGL2: Boolean(gl2),
    };
  } catch {
    return {
      supported: false,
      renderer: 'Probe failed',
      vendor: 'Unknown',
      hasWebGL2: false,
    };
  }
}

export function useHardwareCapability(): HardwareCapability & { isChecking: boolean } {
  const [capability, setCapability] = useState<HardwareCapability>({
    supported: false,
    renderer: 'Checking GPU...',
    vendor: '...',
    hasWebGL2: false,
  });
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const detected = detectHardwareCapability();
    setCapability(detected);
    setIsChecking(false);
  }, []);

  return { ...capability, isChecking };
}
