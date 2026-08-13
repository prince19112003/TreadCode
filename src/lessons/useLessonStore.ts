import { create } from 'zustand';
import type { LessonProgram, ExecutionStep } from './types';

export interface LessonStoreType {
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
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  hasEdited: boolean;
  setHasEdited: (b: boolean) => void;
  playSpeed: number;
  setPlaySpeed: (speed: number) => void;
  customSteps: ExecutionStep[] | null;
  setCustomSteps: (steps: ExecutionStep[] | null | ((prev: ExecutionStep[] | null) => ExecutionStep[] | null)) => void;
  
  // Internal actions to init/update state from LessonProvider
  initLesson: (lesson: LessonProgram) => void;
  updateActiveSteps: () => void;
}

const getDefaultEditableValues = (lesson: LessonProgram | null) => {
  const vals: Record<string, any> = {};
  if (lesson && lesson.editableVariables) {
    Object.entries(lesson.editableVariables).forEach(([name, def]) => {
      vals[name] = def.default;
    });
  }
  return vals;
};

export const useLessonStore = create<LessonStoreType>((set, get) => ({
  lesson: null,
  activeSteps: [],
  currentStepIndex: 0,
  currentStep: null,
  totalSteps: 0,
  isPlaying: false,
  isComplete: false,
  language: 'en',
  editableValues: {},
  isFullScreen: false,
  zoom: 1,
  hasEdited: false,
  playSpeed: 1.0,
  customSteps: null,

  initLesson: (lesson: LessonProgram) => {
    const editableValues = getDefaultEditableValues(lesson);
    const activeSteps = lesson.generateSteps ? lesson.generateSteps(editableValues) : lesson.executionSteps;
    const totalSteps = activeSteps.length + 1;
    set({
      lesson,
      editableValues,
      activeSteps,
      currentStepIndex: 0,
      currentStep: null,
      totalSteps,
      isComplete: false,
      isPlaying: false,
      customSteps: null,
      hasEdited: false,
    });
  },

  updateActiveSteps: () => {
    const state = get();
    if (!state.lesson) return;
    const activeSteps = state.customSteps
      ? state.customSteps
      : (state.lesson.generateSteps ? state.lesson.generateSteps(state.editableValues) : state.lesson.executionSteps);
    const totalSteps = activeSteps.length + 1;
    const currentStep = state.currentStepIndex === 0 ? null : activeSteps[state.currentStepIndex - 1] ?? null;
    const isComplete = state.currentStepIndex >= totalSteps - 1;
    
    set({ activeSteps, totalSteps, currentStep, isComplete });
  },

  setEditableValue: (name, value) => {
    set((state) => ({
      editableValues: { ...state.editableValues, [name]: value },
      isPlaying: false,
      currentStepIndex: 0,
      hasEdited: true,
    }));
    get().updateActiveSteps();
  },

  goNext: () => {
    const state = get();
    const nextIndex = Math.min(state.currentStepIndex + 1, state.totalSteps - 1);
    set({
      currentStepIndex: nextIndex,
      currentStep: nextIndex === 0 ? null : state.activeSteps[nextIndex - 1] ?? null,
      isComplete: nextIndex >= state.totalSteps - 1
    });
  },

  goPrev: () => {
    const state = get();
    const nextIndex = Math.max(state.currentStepIndex - 1, 0);
    set({
      isPlaying: false,
      currentStepIndex: nextIndex,
      currentStep: nextIndex === 0 ? null : state.activeSteps[nextIndex - 1] ?? null,
      isComplete: nextIndex >= state.totalSteps - 1
    });
  },

  goToStep: (index) => {
    const state = get();
    const nextIndex = Math.max(0, Math.min(index, state.totalSteps - 1));
    set({
      isPlaying: false,
      currentStepIndex: nextIndex,
      currentStep: nextIndex === 0 ? null : state.activeSteps[nextIndex - 1] ?? null,
      isComplete: nextIndex >= state.totalSteps - 1
    });
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  toggleLanguage: () => set((state) => ({ language: state.language === 'en' ? 'hi' : 'en' })),
  toggleFullScreen: () => set((state) => ({ isFullScreen: !state.isFullScreen })),
  
  reset: () => {
    set({
      currentStepIndex: 0,
      currentStep: null,
      isPlaying: false,
      isComplete: false,
      customSteps: null,
    });
    get().updateActiveSteps();
  },

  setZoom: (updater) => {
    set((state) => ({ zoom: typeof updater === 'function' ? updater(state.zoom) : updater }));
  },
  
  setHasEdited: (hasEdited) => set({ hasEdited }),
  
  setPlaySpeed: (playSpeed) => set({ playSpeed }),
  
  setCustomSteps: (updater) => {
    set((state) => ({
      customSteps: typeof updater === 'function' ? updater(state.customSteps) : updater
    }));
    get().updateActiveSteps();
  },
}));
