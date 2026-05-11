import { CATEGORY_ORDER } from '../constants/categories';
import type { LearningLanguage } from '../types/language';
import type { Phrase, QuizQuestion } from '../types/phrase';
import type { LanguageMissionState, LearningProgress, QuizMode } from '../types/progress';

const hashString = (value: string): number => {
  return value.split('').reduce((hash, char) => {
    return Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0;
  }, 2166136261);
};

const seededRandom = (seed: number) => {
  let value = seed >>> 0;

  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
};

const randomShuffle = <T,>(items: T[], seed: number): T[] => {
  const shuffled = [...items];
  const random = seededRandom(seed);

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
};

const getUniqueTexts = (items: string[]): string[] => {
  const seen = new Set<string>();

  return items.filter((item) => {
    const text = item.trim();

    if (!text || seen.has(text)) {
      return false;
    }

    seen.add(text);
    return true;
  });
};

const buildChoiceSeed = (dateKey: string, quizMode: QuizMode, phraseId: string): number => {
  return hashString(`${dateKey}-${quizMode}-${phraseId}`);
};

const buildShuffledChoices = (
  phrase: Phrase,
  allPhrases: Phrase[],
  seed: number
): string[] => {
  const correctChoice = phrase.text;
  const savedWrongChoices = getUniqueTexts(phrase.choices).filter((choice) => choice !== correctChoice);
  const sameCategoryChoices = allPhrases
    .filter((item) => item.category === phrase.category && item.id !== phrase.id)
    .map((item) => item.text);
  const fallbackChoices = allPhrases.filter((item) => item.id !== phrase.id).map((item) => item.text);
  const wrongChoicePool = getUniqueTexts([
    ...savedWrongChoices,
    ...sameCategoryChoices,
    ...fallbackChoices,
  ]).filter((choice) => choice !== correctChoice);
  const wrongChoices = randomShuffle(wrongChoicePool, hashString(`${seed}-wrong`)).slice(0, 3);
  const choices = getUniqueTexts([correctChoice, ...wrongChoices]).slice(0, 4);

  return randomShuffle(choices, hashString(`${seed}-display`));
};

const getMasteredPhraseIdSet = (progress?: LearningProgress): Set<string> => {
  return new Set(progress?.masteredPhraseIds ?? []);
};

const getUnmasteredPhrases = (phrases: Phrase[], progress?: LearningProgress): Phrase[] => {
  const masteredPhraseIdSet = getMasteredPhraseIdSet(progress);
  return phrases.filter((phrase) => !masteredPhraseIdSet.has(phrase.id));
};

const canAvoidMastered = (
  phrases: Phrase[],
  progress: LearningProgress,
  count: number
): boolean => {
  return getUnmasteredPhrases(phrases, progress).length >= count;
};

const getPreferredPhraseIds = (phrases: Phrase[], progress?: LearningProgress): string[] => {
  const unmasteredPhrases = getUnmasteredPhrases(phrases, progress);
  const preferredPhrases = unmasteredPhrases.length > 0 ? unmasteredPhrases : phrases;
  const masteredPhraseIdSet = getMasteredPhraseIdSet(progress);
  const masteredPhraseIds = phrases
    .filter((phrase) => masteredPhraseIdSet.has(phrase.id))
    .map((phrase) => phrase.id);

  return Array.from(new Set([...preferredPhrases.map((phrase) => phrase.id), ...masteredPhraseIds]));
};

const getPhraseLanguage = (phrases: Phrase[], progress: LearningProgress): LearningLanguage => {
  return phrases[0]?.language ?? progress.learningLanguage ?? 'english';
};

const createEmptyMissionByLanguage = (): Record<LearningLanguage, LanguageMissionState> => ({
  english: {
    dateJst: null,
    newPhraseIds: [],
    missionPhraseIds: [],
  },
  chinese: {
    dateJst: null,
    newPhraseIds: [],
    missionPhraseIds: [],
  },
});

const syncMissionByLanguage = (
  progress: LearningProgress
): Record<LearningLanguage, LanguageMissionState> => ({
  ...createEmptyMissionByLanguage(),
  ...(progress.currentMissionByLanguage ?? {}),
  english: progress.currentMissionByLanguage?.english ?? {
    dateJst: progress.currentMissionDateJst,
    newPhraseIds: progress.currentNewPhraseIds ?? [],
    missionPhraseIds: progress.currentMissionPhraseIds ?? [],
  },
});

export const selectDailyMissionPhraseIds = (
  phrases: Phrase[],
  dateKey: string,
  count = 3,
  progress?: LearningProgress
): string[] => {
  const selectedIds = new Set<string>();
  const unmasteredPhrases = getUnmasteredPhrases(phrases, progress);
  const preferredPhrases = unmasteredPhrases.length > 0 ? unmasteredPhrases : phrases;
  const categories = CATEGORY_ORDER.filter((category) =>
    preferredPhrases.some((phrase) => phrase.category === category)
  );
  const categoryOrder = categories.length > 0 ? categories : CATEGORY_ORDER;

  categoryOrder.forEach((category) => {
    if (selectedIds.size >= count) {
      return;
    }

    const categoryPhrases = preferredPhrases.filter((phrase) => phrase.category === category);
    const shuffled = randomShuffle(categoryPhrases, hashString(`${dateKey}-${category}`));
    const selected = shuffled.find((phrase) => !selectedIds.has(phrase.id));

    if (selected) {
      selectedIds.add(selected.id);
    }
  });

  if (selectedIds.size < count) {
    const fallback = randomShuffle(preferredPhrases, hashString(`${dateKey}-fallback`));

    fallback.forEach((phrase) => {
      if (selectedIds.size < count) {
        selectedIds.add(phrase.id);
      }
    });
  }

  if (selectedIds.size < count) {
    const fallback = randomShuffle(phrases, hashString(`${dateKey}-mastered-fallback`));

    fallback.forEach((phrase) => {
      if (selectedIds.size < count) {
        selectedIds.add(phrase.id);
      }
    });
  }

  return randomShuffle(Array.from(selectedIds), hashString(`${dateKey}-display`)).slice(0, count);
};

const addUniqueIds = (target: Set<string>, ids: string[], count: number) => {
  ids.forEach((id) => {
    if (target.size < count) {
      target.add(id);
    }
  });
};

const getValidPhraseIds = (phrases: Phrase[], ids: string[]): string[] => {
  const phraseIds = new Set(phrases.map((phrase) => phrase.id));
  return ids.filter((id) => phraseIds.has(id));
};

const fillFromPool = (
  selectedIds: Set<string>,
  poolIds: string[],
  seed: number,
  targetCount: number
) => {
  const shuffled = randomShuffle(
    poolIds.filter((id) => !selectedIds.has(id)),
    seed
  );
  addUniqueIds(selectedIds, shuffled, targetCount);
};

const selectReviewPhraseIds = (
  phrases: Phrase[],
  progress: LearningProgress,
  dateKey: string,
  excludedIds: string[],
  count: number
): string[] => {
  const selectedIds = new Set<string>();
  const excludedSet = new Set(excludedIds);
  const masteredPhraseIdSet = getMasteredPhraseIdSet(progress);
  const excludeMastered = (id: string) => !masteredPhraseIdSet.has(id);
  const weakIds = getValidPhraseIds(phrases, progress.weakPhraseIds).filter(
    (id) => !excludedSet.has(id) && excludeMastered(id)
  );
  const studiedIds = getValidPhraseIds(phrases, progress.studiedPhraseIds).filter(
    (id) => !excludedSet.has(id) && excludeMastered(id)
  );
  const preferredFallbackIds = getPreferredPhraseIds(phrases, progress).filter(
    (id) => !excludedSet.has(id) && excludeMastered(id)
  );
  const fallbackIds = phrases.map((phrase) => phrase.id).filter((id) => !excludedSet.has(id));

  fillFromPool(selectedIds, weakIds, hashString(`${dateKey}-mission-weak`), count);
  fillFromPool(selectedIds, studiedIds, hashString(`${dateKey}-mission-studied`), count);
  fillFromPool(selectedIds, preferredFallbackIds, hashString(`${dateKey}-mission-preferred`), count);
  fillFromPool(selectedIds, fallbackIds, hashString(`${dateKey}-mission-fallback`), count);

  return Array.from(selectedIds).slice(0, count);
};

export const selectFiveQuestionMissionPhraseIds = (
  phrases: Phrase[],
  progress: LearningProgress,
  dateKey: string,
  newPhraseIds: string[]
): string[] => {
  const masteredPhraseIdSet = getMasteredPhraseIdSet(progress);
  const selectedIds = new Set(newPhraseIds.filter((id) => !masteredPhraseIdSet.has(id)));
  const reviewIds = selectReviewPhraseIds(phrases, progress, dateKey, newPhraseIds, 2);
  const preferredPhraseIds = getPreferredPhraseIds(phrases, progress).filter(
    (id) => !masteredPhraseIdSet.has(id)
  );

  addUniqueIds(selectedIds, reviewIds, 5);
  fillFromPool(selectedIds, preferredPhraseIds, hashString(`${dateKey}-mission-fill-preferred`), 5);
  fillFromPool(selectedIds, phrases.map((phrase) => phrase.id), hashString(`${dateKey}-mission-fill`), 5);

  return randomShuffle(Array.from(selectedIds), hashString(`${dateKey}-mission-display`)).slice(0, 5);
};

export const selectExtraQuizPhraseIds = (
  phrases: Phrase[],
  progress: LearningProgress,
  dateKey: string
): string[] => {
  const attemptCountToday = progress.extraQuizHistory.filter((item) => item.dateJst === dateKey).length;
  const seedPrefix = `${dateKey}-extra-${attemptCountToday}`;
  const selectedIds = new Set<string>();
  const masteredPhraseIdSet = getMasteredPhraseIdSet(progress);
  const excludeMastered = (id: string) => !masteredPhraseIdSet.has(id);
  const newPhraseIds =
    progress.currentNewPhraseIds.length === 3
      ? progress.currentNewPhraseIds
      : selectDailyMissionPhraseIds(phrases, dateKey, 3, progress);

  addUniqueIds(selectedIds, newPhraseIds.filter(excludeMastered), 10);

  const weakIds = getValidPhraseIds(phrases, progress.weakPhraseIds).filter(
    (id) => !selectedIds.has(id) && excludeMastered(id)
  );
  const studiedIds = getValidPhraseIds(phrases, progress.studiedPhraseIds).filter(
    (id) => !selectedIds.has(id) && excludeMastered(id)
  );
  const preferredFallbackIds = getPreferredPhraseIds(phrases, progress).filter(
    (id) => !selectedIds.has(id) && excludeMastered(id)
  );
  const fallbackIds = phrases.map((phrase) => phrase.id).filter((id) => !selectedIds.has(id));

  fillFromPool(selectedIds, weakIds, hashString(`${seedPrefix}-weak`), Math.min(10, selectedIds.size + 4));
  fillFromPool(selectedIds, studiedIds, hashString(`${seedPrefix}-studied`), 10);
  fillFromPool(selectedIds, preferredFallbackIds, hashString(`${seedPrefix}-preferred`), 10);
  fillFromPool(selectedIds, fallbackIds, hashString(`${seedPrefix}-fallback`), 10);

  return randomShuffle(Array.from(selectedIds), hashString(`${seedPrefix}-display`)).slice(0, 10);
};

export const getMissionPhrasesByIds = (phrases: Phrase[], phraseIds: string[]): Phrase[] => {
  const phraseMap = new Map(phrases.map((phrase) => [phrase.id, phrase]));
  return phraseIds.flatMap((id) => {
    const phrase = phraseMap.get(id);
    return phrase ? [phrase] : [];
  });
};

export const ensureDailyMissionProgress = (
  progress: LearningProgress,
  phrases: Phrase[],
  dateKey: string
): LearningProgress => {
  const language = getPhraseLanguage(phrases, progress);
  const currentMissionByLanguage = syncMissionByLanguage(progress);
  const savedMission = currentMissionByLanguage[language];
  const phraseIds = new Set(phrases.map((phrase) => phrase.id));
  const masteredPhraseIdSet = getMasteredPhraseIdSet(progress);
  const shouldAvoidMasteredNew = canAvoidMastered(phrases, progress, 3);
  const shouldAvoidMasteredMission = canAvoidMastered(phrases, progress, 5);
  const savedNewIdsAreValid =
    savedMission.newPhraseIds.length === 3 &&
    savedMission.newPhraseIds.every(
      (id) => phraseIds.has(id) && (!shouldAvoidMasteredNew || !masteredPhraseIdSet.has(id))
    );
  const savedIdsAreValid =
    savedMission.missionPhraseIds.length === 5 &&
    savedMission.missionPhraseIds.every(
      (id) => phraseIds.has(id) && (!shouldAvoidMasteredMission || !masteredPhraseIdSet.has(id))
    );

  if (savedMission.dateJst === dateKey && savedNewIdsAreValid && savedIdsAreValid) {
    return {
      ...progress,
      learningLanguage: language,
      currentMissionByLanguage,
      currentMissionDateJst: savedMission.dateJst,
      currentNewPhraseIds: savedMission.newPhraseIds,
      currentMissionPhraseIds: savedMission.missionPhraseIds,
    };
  }

  const currentNewPhraseIds = selectDailyMissionPhraseIds(phrases, dateKey, 3, progress);
  const currentMissionPhraseIds = selectFiveQuestionMissionPhraseIds(
    phrases,
    progress,
    dateKey,
    currentNewPhraseIds
  );
  const nextMissionByLanguage = {
    ...currentMissionByLanguage,
    [language]: {
      dateJst: dateKey,
      newPhraseIds: currentNewPhraseIds,
      missionPhraseIds: currentMissionPhraseIds,
    },
  };

  return {
    ...progress,
    learningLanguage: language,
    currentMissionByLanguage: nextMissionByLanguage,
    currentMissionDateJst: dateKey,
    currentNewPhraseIds,
    currentMissionPhraseIds,
  };
};

export const getDailyMissionPhrases = (
  phrases: Phrase[],
  dateKey: string,
  count = 3
): Phrase[] => {
  return getMissionPhrasesByIds(phrases, selectDailyMissionPhraseIds(phrases, dateKey, count));
};

interface BuildQuizQuestionsOptions {
  dateKey: string;
  quizMode: QuizMode;
}

export const buildQuizQuestions = (
  missionPhrases: Phrase[],
  allPhrases: Phrase[],
  options: BuildQuizQuestionsOptions
): QuizQuestion[] => {
  return missionPhrases.map((phrase) => {
    const choices = buildShuffledChoices(
      phrase,
      allPhrases,
      buildChoiceSeed(options.dateKey, options.quizMode, phrase.id)
    );

    return {
      phrase,
      prompt: `「${phrase.japanese}」に合う${phrase.language === 'chinese' ? '中国語' : '英語'}は？`,
      choices,
      correctChoice: phrase.text,
    };
  });
};

export const getQuizAnswerPositionDistribution = (
  missionPhrases: Phrase[],
  allPhrases: Phrase[],
  options: BuildQuizQuestionsOptions & { sampleCount?: number }
) => {
  const questions = buildQuizQuestions(
    missionPhrases.slice(0, options.sampleCount ?? 30),
    allPhrases,
    options
  );
  const counts = [0, 0, 0, 0];

  questions.forEach((question) => {
    const correctIndex = question.choices.indexOf(question.correctChoice);

    if (correctIndex >= 0) {
      counts[correctIndex] += 1;
    }
  });

  return {
    total: questions.length,
    positions: {
      '1番目': counts[0],
      '2番目': counts[1],
      '3番目': counts[2],
      '4番目': counts[3],
    },
  };
};
