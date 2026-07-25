import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { LessonProgram, ExecutionStep } from './types';

interface LessonContextType {
  lesson: LessonProgram | null;
  activeSteps: ExecutionStep[];
  currentStepIndex: number;
  currentStep: ExecutionStep | null;
  totalSteps: number;
  isPlaying: boolean;
  isComplete: boolean;
  language: 'en' | 'hi';
  editableValues: Record<string, any>;
  setEditableValue: (name: string, value: any) => void;
  goNext: () => void;
  goPrev: () => void;
  goToStep: (index: number) => void;
  togglePlay: () => void;
  toggleLanguage: () => void;
  toggleFullScreen: () => void;
  reset: () => void;
  isFullScreen: boolean;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  hasEdited: boolean;
  setHasEdited: (b: boolean) => void;
  playSpeed: number;
  setPlaySpeed: (speed: number) => void;
  customSteps: ExecutionStep[] | null;
  setCustomSteps: React.Dispatch<React.SetStateAction<ExecutionStep[] | null>>;
}

const LessonContext = createContext<LessonContextType>({
  lesson: null,
  activeSteps: [],
  currentStepIndex: 0,
  currentStep: null,
  totalSteps: 0,
  isPlaying: false,
  isComplete: false,
  language: 'en',
  editableValues: {},
  setEditableValue: () => {},
  goNext: () => {},
  goPrev: () => {},
  goToStep: () => {},
  togglePlay: () => {},
  toggleLanguage: () => {},
  toggleFullScreen: () => {},
  reset: () => {},
  isFullScreen: false,
  zoom: 1,
  setZoom: () => {},
  hasEdited: false,
  setHasEdited: () => {},
  playSpeed: 1.0,
  setPlaySpeed: () => {},
  customSteps: null,
  setCustomSteps: () => {},
});

export const useLesson = () => useContext(LessonContext);

const AUTO_PLAY_DELAY_MS = 2500;

export const LessonProvider: React.FC<{ lesson: LessonProgram; children: React.ReactNode }> = ({
  lesson,
  children,
}) => {
  // Build initial editable values from lesson defaults
  const getDefaultEditableValues = useCallback((l: LessonProgram) => {
    const vals: Record<string, any> = {};
    if (l.editableVariables) {
       Object.entries(l.editableVariables).forEach(([name, def]) => {
        vals[name] = def.default;
      });
    }
    return vals;
  }, []);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [editableValues, setEditableValues] = useState<Record<string, any>>(
    () => getDefaultEditableValues(lesson)
  );
  const [hasEdited, setHasEdited] = useState(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1.0);
  const [customSteps, setCustomSteps] = useState<ExecutionStep[] | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Derive active steps: use customSteps if set, otherwise generateSteps or executionSteps
  const activeSteps: ExecutionStep[] = customSteps
    ? customSteps
    : (lesson.generateSteps ? lesson.generateSteps(editableValues) : lesson.executionSteps);

  const totalSteps = activeSteps.length + 1; // +1 for the empty step-0 canvas
  const currentStep = currentStepIndex === 0 ? null : activeSteps[currentStepIndex - 1] ?? null;
  const isComplete = currentStepIndex >= totalSteps - 1;

  // Reset step index and customSteps when lesson changes
  useEffect(() => {
    setCurrentStepIndex(0);
    setCustomSteps(null);
    setEditableValues(getDefaultEditableValues(lesson));
  }, [lesson.id, getDefaultEditableValues]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const setEditableValue = useCallback((name: string, value: any) => {
    setEditableValues(prev => ({ ...prev, [name]: value }));
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setHasEdited(true); // User changed a value, activate retry indicator
  }, []);

  const goNext = useCallback(() => {
    setCurrentStepIndex(prev => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const goPrev = useCallback(() => {
    setIsPlaying(false);
    clearTimer();
    setCurrentStepIndex(prev => Math.max(prev - 1, 0));
  }, [clearTimer]);

  const goToStep = useCallback((index: number) => {
    setIsPlaying(false);
    clearTimer();
    setCurrentStepIndex(Math.max(0, Math.min(index, totalSteps - 1)));
  }, [totalSteps, clearTimer]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => (prev === 'en' ? 'hi' : 'en'));
  }, []);

  const toggleFullScreen = useCallback(() => {
    setIsFullScreen(prev => !prev);
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    clearTimer();
    setCurrentStepIndex(0);
    setHasEdited(false); // Reset the warning state
  }, [clearTimer]);

  // Auto-play engine
  useEffect(() => {
    if (!isPlaying) {
      clearTimer();
      return;
    }
    if (isComplete) {
      setIsPlaying(false);
      return;
    }
    timerRef.current = setTimeout(() => {
      goNext();
    }, AUTO_PLAY_DELAY_MS / playSpeed);

    return clearTimer;
  }, [isPlaying, isComplete, currentStepIndex, goNext, clearTimer, playSpeed]);

  return (
    <LessonContext.Provider
      value={{
        lesson,
        activeSteps,
        currentStepIndex,
        currentStep,
        totalSteps,
        isPlaying,
        isComplete,
        language,
        editableValues,
        setEditableValue,
        goNext,
        goPrev,
        goToStep,
        togglePlay,
        toggleLanguage,
        toggleFullScreen,
        reset,
        isFullScreen,
        zoom,
        setZoom,
        hasEdited,
        setHasEdited,
        playSpeed,
        setPlaySpeed,
        customSteps,
        setCustomSteps,
      }}
    >
      {children}
    </LessonContext.Provider>
  );
};

