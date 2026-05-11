import { getJstDateKey } from './dateRules';
import type { LearningProgress } from '../types/progress';

const TREAT_REACTIONS = [
  'わーい！ありがとう🐶',
  'しっぽブンブンだよ🐶',
  'おやつ、おいしいね🐶',
  '今日も一緒にがんばろう🐶',
  'また会えてうれしいよ🐶',
];

type TaffyMoodStage = {
  minPoints: number;
  label: string;
  levelUpMessage: string | null;
};

const TAFFY_MOOD_STAGES: TaffyMoodStage[] = [
  {
    minPoints: 30,
    label: 'Taffy大よろこび',
    levelUpMessage: 'Taffy大よろこび！もっとなついてきたね🐶',
  },
  {
    minPoints: 15,
    label: 'しっぽブンブン',
    levelUpMessage: 'しっぽブンブンになったよ🐶',
  },
  {
    minPoints: 5,
    label: 'ごきげん',
    levelUpMessage: 'ごきげんレベルアップ！Taffyがもっとなついてきたよ🐶',
  },
  {
    minPoints: 0,
    label: 'のんびり',
    levelUpMessage: null,
  },
];

export interface GiveTreatResult {
  progress: LearningProgress;
  didGiveTreat: boolean;
  didMoodLevelUp: boolean;
  message: string;
  moodLevelMessage: string | null;
}

const getTaffyMoodStage = (taffyMoodPoints: number): TaffyMoodStage => {
  return TAFFY_MOOD_STAGES.find((stage) => taffyMoodPoints >= stage.minPoints) ?? TAFFY_MOOD_STAGES[3];
};

export const getTaffyMoodLevel = (taffyMoodPoints: number): string => {
  return getTaffyMoodStage(taffyMoodPoints).label;
};

export const giveTreatToTaffy = (
  progress: LearningProgress,
  dateKey: string = getJstDateKey()
): GiveTreatResult => {
  if (progress.treats <= 0) {
    return {
      progress,
      didGiveTreat: false,
      didMoodLevelUp: false,
      message: 'おやつ…ある？🐶 5問で集めよう🐾',
      moodLevelMessage: null,
    };
  }

  const nextMoodPoints = progress.taffyMoodPoints + 1;
  const totalTreatsGiven = progress.totalTreatsGiven + 1;
  const previousStage = getTaffyMoodStage(progress.taffyMoodPoints);
  const nextStage = getTaffyMoodStage(nextMoodPoints);
  const didMoodLevelUp = previousStage.label !== nextStage.label;
  const reaction = TREAT_REACTIONS[(totalTreatsGiven - 1) % TREAT_REACTIONS.length];
  const moodLevelMessage = didMoodLevelUp ? nextStage.levelUpMessage : null;

  return {
    progress: {
      ...progress,
      treats: progress.treats - 1,
      totalTreatsGiven,
      taffyMoodPoints: nextMoodPoints,
      lastTreatGivenDateJst: dateKey,
    },
    didGiveTreat: true,
    didMoodLevelUp,
    message: moodLevelMessage ?? reaction,
    moodLevelMessage,
  };
};
