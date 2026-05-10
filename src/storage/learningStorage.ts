import { createInitialProgress } from '../game/progressRules';
import type { LearningProgress } from '../types/progress';

const STORAGE_KEY = 'tew-learning-progress-v1';

const isProgress = (value: unknown): value is LearningProgress => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const progress = value as Partial<LearningProgress>;
  return (
    typeof progress.xp === 'number' &&
    typeof progress.level === 'number' &&
    typeof progress.treats === 'number' &&
    typeof progress.streakDays === 'number' &&
    Array.isArray(progress.weakPhraseIds)
  );
};

export const loadProgress = (): LearningProgress => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return createInitialProgress();
    }

    const parsed = JSON.parse(saved);
    return isProgress(parsed) ? { ...createInitialProgress(), ...parsed } : createInitialProgress();
  } catch {
    return createInitialProgress();
  }
};

export const saveProgress = (progress: LearningProgress) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

export const resetProgress = () => {
  window.localStorage.removeItem(STORAGE_KEY);
};

export const getStorageKey = () => STORAGE_KEY;
