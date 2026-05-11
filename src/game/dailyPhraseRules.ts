import { calculateLevel } from './progressRules';
import { addDailyRewardStats, addStudyDate } from './studyCalendarRules';
import type { Phrase } from '../types/phrase';
import type { LearningProgress } from '../types/progress';

const DAILY_PHRASE_XP = 5;
const DAILY_PHRASE_MOOD_POINTS = 1;

const getDateSeed = (dateKey: string): number => {
  return Array.from(dateKey).reduce((seed, char) => seed + char.charCodeAt(0), 0);
};

const getDailyPhrasePool = (phrases: Phrase[], progress?: LearningProgress): Phrase[] => {
  const masteredPhraseIdSet = new Set(progress?.masteredPhraseIds ?? []);
  const dailyPhrases = phrases.filter((phrase) => phrase.category === 'daily');
  const dailyUnmasteredPhrases = dailyPhrases.filter((phrase) => !masteredPhraseIdSet.has(phrase.id));
  const unmasteredPhrases = phrases.filter((phrase) => !masteredPhraseIdSet.has(phrase.id));

  if (dailyUnmasteredPhrases.length > 0) {
    return dailyUnmasteredPhrases;
  }

  if (unmasteredPhrases.length > 0) {
    return unmasteredPhrases;
  }

  return dailyPhrases.length > 0 ? dailyPhrases : phrases;
};

export const selectDailyPhrase = (
  phrases: Phrase[],
  dateKey: string,
  progress?: LearningProgress
): Phrase => {
  const pool = getDailyPhrasePool(phrases, progress);
  const index = (getDateSeed(dateKey) * 17) % pool.length;
  return pool[index];
};

export const ensureDailyPhraseProgress = (
  progress: LearningProgress,
  phrases: Phrase[],
  dateKey: string
): LearningProgress => {
  const selectablePhraseIds = new Set(getDailyPhrasePool(phrases, progress).map((phrase) => phrase.id));
  const savedPhraseExists = Boolean(progress.dailyPhraseId && selectablePhraseIds.has(progress.dailyPhraseId));

  if (progress.dailyPhraseDateJst === dateKey && progress.dailyPhraseId && savedPhraseExists) {
    return progress;
  }

  return {
    ...progress,
    dailyPhraseDateJst: dateKey,
    dailyPhraseId: selectDailyPhrase(phrases, dateKey, progress).id,
    spokenPhraseDates: progress.spokenPhraseDates ?? [],
  };
};

export const completeDailyPhraseSpeaking = (
  progress: LearningProgress,
  dateKey: string
): { progress: LearningProgress; didReward: boolean } => {
  if (progress.spokenPhraseDates.includes(dateKey)) {
    return { progress, didReward: false };
  }

  const nextXp = progress.xp + DAILY_PHRASE_XP;

  return {
    progress: addStudyDate(
      addDailyRewardStats(
        {
          ...progress,
          xp: nextXp,
          level: calculateLevel(nextXp),
          taffyMoodPoints: progress.taffyMoodPoints + DAILY_PHRASE_MOOD_POINTS,
          spokenPhraseDates: [...progress.spokenPhraseDates, dateKey],
        },
        dateKey,
        { xp: DAILY_PHRASE_XP }
      ),
      dateKey
    ),
    didReward: true,
  };
};
