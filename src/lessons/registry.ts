import type { LessonProgram } from './types';

// Hardcode language stats to avoid loading massive chunks on the home screen
const languageStats: Record<string, { topicsCount: number; programsCount: number }> = {
  python: { topicsCount: 16, programsCount: 95 }, // Approximations based on old registry count
  c: { topicsCount: 13, programsCount: 42 },
  cpp: { topicsCount: 14, programsCount: 44 },
  java: { topicsCount: 13, programsCount: 39 },
  dsa: { topicsCount: 17, programsCount: 22 },
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

    // Support fallback for old format 't1' vs 'variables'
    const topic = registry[topicId] || (topicId === 'variables' ? registry['t1'] : undefined);
    if (!topic) return undefined;

    return topic[programId];
  } catch (error) {
    console.error(`Failed to load chunk for language: ${languageId}`, error);
    return undefined;
  }
};
