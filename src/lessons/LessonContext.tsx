import React, { useEffect, useRef } from 'react';
import type { LessonProgram } from './types';
import { useLessonStore } from './useLessonStore';

// We export useLesson here as a backward compatibility proxy to useLessonStore,
// although components can now directly import useLessonStore with a selector.
export const useLesson = () => useLessonStore();

const AUTO_PLAY_DELAY_MS = 1200;

export const LessonProvider: React.FC<{ lesson: LessonProgram; children: React.ReactNode }> = ({
  lesson,
  children,
}) => {
  const initLesson = useLessonStore(s => s.initLesson);
  const isPlaying = useLessonStore(s => s.isPlaying);
  const goNext = useLessonStore(s => s.goNext);
  const isComplete = useLessonStore(s => s.isComplete);
  const playSpeed = useLessonStore(s => s.playSpeed);
  const currentStepIndex = useLessonStore(s => s.currentStepIndex);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    initLesson(lesson);
  }, [lesson, initLesson]);

  // Auto-playback logic — subscribes to currentStepIndex to step through all animation steps
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    if (isPlaying && !isComplete) {
      const delay = AUTO_PLAY_DELAY_MS / playSpeed;
      timerRef.current = setTimeout(() => {
        goNext();
      }, delay);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, isComplete, goNext, playSpeed, currentStepIndex]);

  return <>{children}</>;
};
