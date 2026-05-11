import { createInitialProgress } from '../game/progressRules';
import type { LearningProgress } from '../types/progress';

const STORAGE_KEY = 'tew-learning-progress-v1';
const BACKUP_VERSION = 1;
const BACKUP_APP_NAME = 'Taffy Everyday Words';

export interface LearningProgressBackup {
  backupVersion: number;
  appName: string;
  storageKey: string;
  exportedAt: string;
  exportedDateJst: string;
  progress: LearningProgress;
}

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

export const normalizeProgress = (value: unknown): LearningProgress | null => {
  return isProgress(value) ? { ...createInitialProgress(), ...value } : null;
};

export const loadProgress = (): LearningProgress => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return createInitialProgress();
    }

    const parsed = JSON.parse(saved);
    return normalizeProgress(parsed) ?? createInitialProgress();
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

export const createProgressBackup = (
  progress: LearningProgress,
  exportedDateJst: string
): LearningProgressBackup => ({
  backupVersion: BACKUP_VERSION,
  appName: BACKUP_APP_NAME,
  storageKey: STORAGE_KEY,
  exportedAt: new Date().toISOString(),
  exportedDateJst,
  progress,
});

export const parseProgressBackup = (value: unknown): LearningProgress | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const backup = value as Partial<LearningProgressBackup>;

  if (
    backup.backupVersion !== BACKUP_VERSION ||
    backup.appName !== BACKUP_APP_NAME ||
    backup.storageKey !== STORAGE_KEY
  ) {
    return null;
  }

  return normalizeProgress(backup.progress);
};
