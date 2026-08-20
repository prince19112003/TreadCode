import type { LessonProgram } from './types';

// Hardcode language stats to avoid loading massive chunks on the home screen
const languageStats: Record<string, { topicsCount: number; programsCount: number }> = {
  python: { topicsCount: 16, programsCount: 100 },
  c: { topicsCount: 13, programsCount: 45 },
  cpp: { topicsCount: 14, programsCount: 50 },
  java: { topicsCount: 13, programsCount: 46 },
  dsa: { topicsCount: 21, programsCount: 24 },
};

export const getLanguageStats = (languageId: string): { topicsCount: number; programsCount: number } => {
  return languageStats[languageId] || { topicsCount: 0, programsCount: 0 };
};

// Async lazy loading of language chunks to keep initial bundle size tiny
export const getLessonAsync = async (languageId: string, topicId: string, programId: string): Promise<LessonProgram | undefined> => {
  try {
    let registry: Record<string, any>;
    
    switch (languageId) {
      case 'python':
        registry = (await import('./python/registry')).pythonRegistry;
        break;
      case 'c':
        registry = (await import('./c/registry')).cRegistry;
        break;
      case 'cpp':
        registry = (await import('./cpp/registry')).cppRegistry;
        break;
      case 'java':
        registry = (await import('./java/registry')).javaRegistry;
        break;
      case 'dsa':
        registry = (await import('./dsa/registry')).dsaRegistry;
        break;
      default:
        return undefined;
    }

    // 1. Direct topic & program lookup
    const topic = registry[topicId] || (topicId === 'variables' ? registry['t1'] : undefined);
    if (topic && (topic[programId] || topic[`dsa_${programId}`])) {
      return topic[programId] || topic[`dsa_${programId}`];
    }

    // 2. Fallback search across all topics in the language registry
    const allProgramsInLang = Object.values(registry).flatMap((t: any) => Object.values(t));
    const found = allProgramsInLang.find((p: any) => p && (p.id === programId || p.id === `dsa_${programId}`));
    if (found) return found as LessonProgram;

    return undefined;
  } catch (error) {
    console.error(`Failed to load chunk for language: ${languageId}`, error);
    return undefined;
  }
};
