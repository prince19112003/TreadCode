import type { DeviceTier } from './types';

/**
 * Defensive Hardware Profiler
 * Safely inspects client capabilities without throwing in older Android WebViews.
 */
export function detectDeviceTier(): DeviceTier {
  if (typeof window === 'undefined') return 'DESKTOP';

  try {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const nav = navigator as unknown as { deviceMemory?: number; hardwareConcurrency?: number };
    const memoryGb = nav.deviceMemory || 2;
    const cores = nav.hardwareConcurrency || 2;

    // Globus / ViewSonic SmartBoards running Android 7-9 with <=2GB RAM
    if (isAndroid || memoryGb <= 2 || cores <= 2) {
      return 'LOW_SMARTBOARD';
    }

    if (memoryGb <= 4 || cores <= 4) {
      return 'MID_RANGE';
    }

    return 'DESKTOP';
  } catch {
    return 'LOW_SMARTBOARD';
  }
}

/**
 * Returns safe execution boundaries based on hardware tier
 */
export function getHardwareConstraints(tier: DeviceTier) {
  switch (tier) {
    case 'LOW_SMARTBOARD':
      return {
        maxExecutionSteps: 500,
        maxExecutionTimeMs: 1200,
        maxArrayLength: 50,
      };
    case 'MID_RANGE':
      return {
        maxExecutionSteps: 1500,
        maxExecutionTimeMs: 2000,
        maxArrayLength: 200,
      };
    case 'DESKTOP':
      return {
        maxExecutionSteps: 3000,
        maxExecutionTimeMs: 3500,
        maxArrayLength: 1000,
      };
  }
}
