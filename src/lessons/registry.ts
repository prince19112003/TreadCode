import type { LessonProgram } from './types';
import { useModuleStore } from '../shared/hooks/useModuleStore';

// Hardcode language stats to avoid loading massive chunks on the home screen
const languageStats: Record<string, { topicsCount: number; programsCount: number }> = {
  python: { topicsCount: 16, programsCount: 100 },
  c: { topicsCount: 16, programsCount: 72 },
  cpp: { topicsCount: 14, programsCount: 48 },
  java: { topicsCount: 15, programsCount: 60 },
  dsa: { topicsCount: 31, programsCount: 31 },
  ml: { topicsCount: 24, programsCount: 24 },
  networking: { topicsCount: 8, programsCount: 8 },
};

export const getLanguageStats = (languageId: string): { topicsCount: number; programsCount: number } => {
  return languageStats[languageId] || { topicsCount: 0, programsCount: 0 };
};

// Languages that are PACK-based (require install)
// Note: ml & networking have compiled-in renderers but still require install unlock
const PACK_LANGUAGES = new Set(['c', 'cpp', 'java', 'dsa', 'ml', 'networking']);

// Find a program within a flat registry object (nested: { topicId: { programId: LessonProgram } })
function findInRegistry(
  registry: Record<string, any>,
  topicId: string,
  programId: string
): LessonProgram | undefined {
  // 1. Direct topic & program lookup
  const topic = registry[topicId] || (topicId === 'variables' ? registry['t1'] : undefined);
  if (topic && (topic[programId] || topic[`dsa_${programId}`])) {
    return topic[programId] || topic[`dsa_${programId}`];
  }

  // 2. Fallback scan across all topics
  const allPrograms = Object.values(registry).flatMap((t: any) => Object.values(t));
  const found = allPrograms.find((p: any) => p && (p.id === programId || p.id === `dsa_${programId}`));
  if (found) return found as LessonProgram;

  return undefined;
}

// Async lazy loading: Python & C & DSA use compiled bundle; everything else reads from IndexedDB pack
export const getLessonAsync = async (languageId: string, topicId: string, programId: string): Promise<LessonProgram | undefined> => {
  try {
    // ── Python: Always compiled in the bundle ───────────────────────────────
    if (languageId === 'python') {
      const registry = (await import('./python/registry')).pythonRegistry;
      const topic = registry[topicId];
      if (topic && topic[programId]) return topic[programId];

      // Fallback scan
      const all = Object.values(registry).flatMap((t: any) => Object.values(t));
      return all.find((p: any) => p && p.id === programId) as LessonProgram | undefined;
    }

    // ── C: Directly compiled bundle for instant hot reload ───────────────────
    if (languageId === 'c') {
      const registry = (await import('./c/registry')).cRegistry;
      const topic = registry[topicId];
      if (topic && topic[programId]) return topic[programId];

      // Fallback scan
      const all = Object.values(registry).flatMap((t: any) => Object.values(t));
      return all.find((p: any) => p && p.id === programId) as LessonProgram | undefined;
    }

    // ── DSA: Directly compiled bundle for instant hot reload ─────────────────
    if (languageId === 'dsa') {
      const registry = (await import('./dsa/registry')).dsaRegistry;
      const topic = registry[topicId];
      if (topic && (topic[programId] || topic[`dsa_${programId}`])) {
        return topic[programId] || topic[`dsa_${programId}`];
      }

      // Fallback scan
      const all = Object.values(registry).flatMap((t: any) => Object.values(t));
      return all.find((p: any) => p && (p.id === programId || p.id === `dsa_${programId}`)) as LessonProgram | undefined;
    }

    // ── ML: Directly compiled bundle for instant hot reload ───────────────────
    if (languageId === 'ml') {
      const registry = (await import('./ml/registry')).mlRegistry;
      const topic = registry[topicId];
      if (topic && (topic[programId] || topic[`ml_${topicId}`] || topic[`ml_${programId}`])) {
        return topic[programId] || topic[`ml_${topicId}`] || topic[`ml_${programId}`];
      }

      // Fallback scan
      const all = Object.values(registry).flatMap((t: any) => Object.values(t));
      return all.find((p: any) => p && (p.id === programId || p.id === `ml_${programId}` || p.topic === topicId)) as LessonProgram | undefined;
    }

    // ── Pack Languages: Read from IndexedDB via ModuleStore ─────────────────
    if (PACK_LANGUAGES.has(languageId)) {
      const moduleStore = useModuleStore.getState();
      const status = moduleStore.moduleStatus[languageId];

      // Not installed — return undefined (caller shows install prompt)
      if (status !== 'installed') return undefined;

      const registry = await moduleStore.getPackRegistry(languageId);
      if (!registry) return undefined;

      return findInRegistry(registry, topicId, programId);
    }

    return undefined;
  } catch (error) {
    console.error(`Failed to load lesson for language: ${languageId}`, error);
    return undefined;
  }
};

// Sync check: Is a language module available right now? (Used for UI gating)
export const isModuleInstalled = (languageId: string): boolean => {
  if (languageId === 'python' || languageId === 'c' || languageId === 'dsa' || languageId === 'ml') return true;
  if (!PACK_LANGUAGES.has(languageId)) return true; // ML, Networking etc. have their own renderers
  const status = useModuleStore.getState().moduleStatus[languageId];
  return status === 'installed';
};
