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


  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);

  useEffect(() => {
    initLesson(lesson);
  }, [lesson, initLesson]);

  // Auto-playback logic — uses requestAnimationFrame for buttery smooth syncing
  // decoupled from currentStepIndex to avoid teardown/setup on every step
  useEffect(() => {
    if (!isPlaying || isComplete) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTickRef.current = 0;
      return;
    }

    const loop = (timestamp: number) => {
      if (lastTickRef.current === 0) lastTickRef.current = timestamp;
      const elapsed = timestamp - lastTickRef.current;
      const delay = AUTO_PLAY_DELAY_MS / playSpeed;

      if (elapsed >= delay) {
        goNext();
        // Carry over remainder to prevent drift
        lastTickRef.current = timestamp - (elapsed % delay);
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, isComplete, goNext, playSpeed]);

  return <>{children}</>;
};
