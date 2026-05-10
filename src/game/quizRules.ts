import { CATEGORY_ORDER } from '../constants/categories';
import type { Phrase, QuizQuestion } from '../types/phrase';
import type { LearningProgress } from '../types/progress';

const stableShuffle = <T,>(items: T[], seed: number): T[] => {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = (seed + index * 7) % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
};

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

export const selectDailyMissionPhraseIds = (
  phrases: Phrase[],
  dateKey: string,
  count = 3
): string[] => {
  const selectedIds = new Set<string>();

  CATEGORY_ORDER.forEach((category) => {
    if (selectedIds.size >= count) {
      return;
    }

    const categoryPhrases = phrases.filter((phrase) => phrase.category === category);
    const shuffled = randomShuffle(categoryPhrases, hashString(`${dateKey}-${category}`));
    const selected = shuffled.find((phrase) => !selectedIds.has(phrase.id));

    if (selected) {
      selectedIds.add(selected.id);
    }
  });

  if (selectedIds.size < count) {
    const fallback = randomShuffle(phrases, hashString(`${dateKey}-fallback`));

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
  const weakIds = getValidPhraseIds(phrases, progress.weakPhraseIds).filter((id) => !excludedSet.has(id));
  const studiedIds = getValidPhraseIds(phrases, progress.studiedPhraseIds).filter(
    (id) => !excludedSet.has(id)
  );
  const fallbackIds = phrases.map((phrase) => phrase.id).filter((id) => !excludedSet.has(id));

  fillFromPool(selectedIds, weakIds, hashString(`${dateKey}-mission-weak`), count);
  fillFromPool(selectedIds, studiedIds, hashString(`${dateKey}-mission-studied`), count);
  fillFromPool(selectedIds, fallbackIds, hashString(`${dateKey}-mission-fallback`), count);

  return Array.from(selectedIds).slice(0, count);
};

export const selectFiveQuestionMissionPhraseIds = (
  phrases: Phrase[],
  progress: LearningProgress,
  dateKey: string,
  newPhraseIds: string[]
): string[] => {
  const selectedIds = new Set(newPhraseIds);
  const reviewIds = selectReviewPhraseIds(phrases, progress, dateKey, newPhraseIds, 2);

  addUniqueIds(selectedIds, reviewIds, 5);
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
  const newPhraseIds =
    progress.currentNewPhraseIds.length === 3
      ? progress.currentNewPhraseIds
      : selectDailyMissionPhraseIds(phrases, dateKey, 3);

  addUniqueIds(selectedIds, newPhraseIds, 10);

  const weakIds = getValidPhraseIds(phrases, progress.weakPhraseIds).filter((id) => !selectedIds.has(id));
  const studiedIds = getValidPhraseIds(phrases, progress.studiedPhraseIds).filter(
    (id) => !selectedIds.has(id)
  );
  const fallbackIds = phrases.map((phrase) => phrase.id).filter((id) => !selectedIds.has(id));

  fillFromPool(selectedIds, weakIds, hashString(`${seedPrefix}-weak`), Math.min(10, selectedIds.size + 4));
  fillFromPool(selectedIds, studiedIds, hashString(`${seedPrefix}-studied`), 10);
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
  const phraseIds = new Set(phrases.map((phrase) => phrase.id));
  const savedNewIdsAreValid =
    progress.currentNewPhraseIds.length === 3 &&
    progress.currentNewPhraseIds.every((id) => phraseIds.has(id));
  const savedIdsAreValid =
    progress.currentMissionPhraseIds.length === 5 &&
    progress.currentMissionPhraseIds.every((id) => phraseIds.has(id));

  if (progress.currentMissionDateJst === dateKey && savedNewIdsAreValid && savedIdsAreValid) {
    return progress;
  }

  const currentNewPhraseIds = selectDailyMissionPhraseIds(phrases, dateKey, 3);

  return {
    ...progress,
    currentMissionDateJst: dateKey,
    currentNewPhraseIds,
    currentMissionPhraseIds: selectFiveQuestionMissionPhraseIds(
      phrases,
      progress,
      dateKey,
      currentNewPhraseIds
    ),
  };
};

export const getDailyMissionPhrases = (
  phrases: Phrase[],
  dateKey: string,
  count = 3
): Phrase[] => {
  return getMissionPhrasesByIds(phrases, selectDailyMissionPhraseIds(phrases, dateKey, count));
};

export const buildQuizQuestions = (missionPhrases: Phrase[], allPhrases: Phrase[]): QuizQuestion[] => {
  return missionPhrases.map((phrase, index) => {
    const savedChoices = Array.from(new Set(phrase.choices));
    const hasSavedChoices = savedChoices.length >= 4 && savedChoices.includes(phrase.english);
    const sameCategoryChoices = allPhrases
      .filter((item) => item.category === phrase.category && item.id !== phrase.id)
      .map((item) => item.english);
    const fallbackChoices = allPhrases.filter((item) => item.id !== phrase.id).map((item) => item.english);
    const wrongChoices = sameCategoryChoices.length >= 3 ? sameCategoryChoices : fallbackChoices;
    const choices = hasSavedChoices
      ? savedChoices.slice(0, 4)
      : stableShuffle(
          [phrase.english, ...stableShuffle(wrongChoices, index + phrase.id.length).slice(0, 3)],
          phrase.english.length + index
        );

    return {
      phrase,
      prompt: `「${phrase.japanese}」に合う英語は？`,
      choices,
      correctChoice: phrase.english,
    };
  });
};
