import { calculateLevel } from './progressRules';
import { addDailyRewardStats, addStudyDate } from './studyCalendarRules';
import type { LearningLanguage } from '../types/language';
import type { Phrase } from '../types/phrase';
import type { LanguageDailyPhraseState, LearningProgress } from '../types/progress';

const DAILY_PHRASE_XP = 5;
const DAILY_PHRASE_MOOD_POINTS = 1;

const getDateSeed = (dateKey: string): number => {
  return Array.from(dateKey).reduce((seed, char) => seed + char.charCodeAt(0), 0);
};

const getPhraseLanguage = (phrases: Phrase[], progress: LearningProgress): LearningLanguage => {
  return phrases[0]?.language ?? progress.learningLanguage ?? 'english';
};

const createEmptyDailyPhraseByLanguage = (): Record<LearningLanguage, LanguageDailyPhraseState> => ({
  english: {
    dateJst: null,
    phraseId: null,
  },
  chinese: {
    dateJst: null,
    phraseId: null,
  },
});

const syncDailyPhraseByLanguage = (
  progress: LearningProgress
): Record<LearningLanguage, LanguageDailyPhraseState> => ({
  ...createEmptyDailyPhraseByLanguage(),
  ...(progress.dailyPhraseByLanguage ?? {}),
  english: progress.dailyPhraseByLanguage?.english ?? {
    dateJst: progress.dailyPhraseDateJst,
    phraseId: progress.dailyPhraseId,
  },
});

const syncSpokenPhraseDatesByLanguage = (
  progress: LearningProgress
): Record<LearningLanguage, string[]> => ({
  english: progress.spokenPhraseDatesByLanguage?.english ?? progress.spokenPhraseDates ?? [],
  chinese: progress.spokenPhraseDatesByLanguage?.chinese ?? [],
});

export const getSpokenPhraseDatesForLanguage = (
  progress: LearningProgress,
  language: LearningLanguage
): string[] => {
  return syncSpokenPhraseDatesByLanguage(progress)[language] ?? [];
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
  const language = getPhraseLanguage(phrases, progress);
  const dailyPhraseByLanguage = syncDailyPhraseByLanguage(progress);
  const savedState = dailyPhraseByLanguage[language];
  const selectablePhraseIds = new Set(getDailyPhrasePool(phrases, progress).map((phrase) => phrase.id));
  const savedPhraseExists = Boolean(savedState.phraseId && selectablePhraseIds.has(savedState.phraseId));

  if (savedState.dateJst === dateKey && savedState.phraseId && savedPhraseExists) {
    return {
      ...progress,
      learningLanguage: language,
      dailyPhraseByLanguage,
      dailyPhraseDateJst: savedState.dateJst,
      dailyPhraseId: savedState.phraseId,
      spokenPhraseDatesByLanguage: syncSpokenPhraseDatesByLanguage(progress),
    };
  }

  const phraseId = selectDailyPhrase(phrases, dateKey, progress).id;
  const nextDailyPhraseByLanguage = {
    ...dailyPhraseByLanguage,
    [language]: {
      dateJst: dateKey,
      phraseId,
    },
  };

  return {
    ...progress,
    learningLanguage: language,
    dailyPhraseByLanguage: nextDailyPhraseByLanguage,
    dailyPhraseDateJst: dateKey,
    dailyPhraseId: phraseId,
    spokenPhraseDatesByLanguage: syncSpokenPhraseDatesByLanguage(progress),
    spokenPhraseDates: syncSpokenPhraseDatesByLanguage(progress)[language] ?? [],
  };
};

export const completeDailyPhraseSpeaking = (
  progress: LearningProgress,
  dateKey: string,
  language: LearningLanguage = progress.learningLanguage ?? 'english'
): { progress: LearningProgress; didReward: boolean } => {
  const spokenPhraseDatesByLanguage = syncSpokenPhraseDatesByLanguage(progress);
  const spokenDates = spokenPhraseDatesByLanguage[language] ?? [];

  if (spokenDates.includes(dateKey)) {
    return { progress, didReward: false };
  }

  const nextXp = progress.xp + DAILY_PHRASE_XP;
  const nextSpokenDates = [...spokenDates, dateKey];
  const nextSpokenPhraseDatesByLanguage = {
    ...spokenPhraseDatesByLanguage,
    [language]: nextSpokenDates,
  };

  return {
    progress: addStudyDate(
      addDailyRewardStats(
        {
          ...progress,
          xp: nextXp,
          level: calculateLevel(nextXp),
          taffyMoodPoints: progress.taffyMoodPoints + DAILY_PHRASE_MOOD_POINTS,
          spokenPhraseDatesByLanguage: nextSpokenPhraseDatesByLanguage,
          spokenPhraseDates: nextSpokenDates,
        },
        dateKey,
        { xp: DAILY_PHRASE_XP }
      ),
      dateKey
    ),
    didReward: true,
  };
};
