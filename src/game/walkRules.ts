import { WALK_SPOTS } from '../data/walkSpots';
import type { Phrase } from '../types/phrase';
import type { LearningProgress, LessonMode, SpotStudyMap } from '../types/progress';
import type { RecommendedWalkSpot, SpotId } from '../types/walk';
import type { LearningLanguage } from '../types/language';

export const WALK_POINTS_PER_SPOT = 2;
export const HOME_SPOT_ID: SpotId = 'home';

const SPOT_IDS = WALK_SPOTS.map((spot) => spot.id);

const RECOMMENDATION_MESSAGES: Record<SpotId, string> = {
  home: 'あいさつと自己紹介を少し整えよう！',
  park: '天気や散歩のひとことを覚えよう！',
  cafe: '注文フレーズを少し覚えよう！',
  station: '道案内と電車のフレーズを練習しよう！',
  convenience_store: '買い物と支払いのフレーズに慣れよう！',
  restaurant: '食事と会計の表現を練習しよう！',
  office: '仕事の基本会話を少し進めよう！',
  hotel: '旅行とチェックインのフレーズを復習しよう！',
};

export const createEmptySpotStudyMap = (): SpotStudyMap => {
  return WALK_SPOTS.reduce((map, spot) => {
    map[spot.id] = [];
    return map;
  }, {} as SpotStudyMap);
};

const uniqueValidSpotIds = (spotIds: SpotId[]): SpotId[] => {
  return Array.from(new Set(spotIds)).filter((spotId) => SPOT_IDS.includes(spotId));
};

const isValidSpotId = (spotId: string | null | undefined): spotId is SpotId => {
  return Boolean(spotId && SPOT_IDS.includes(spotId as SpotId));
};

const syncSpotStudyMap = (spotStudiedPhraseIds?: Partial<SpotStudyMap>): SpotStudyMap => {
  const emptyMap = createEmptySpotStudyMap();

  return WALK_SPOTS.reduce((map, spot) => {
    map[spot.id] = Array.from(
      new Set([...(emptyMap[spot.id] ?? []), ...(spotStudiedPhraseIds?.[spot.id] ?? [])])
    );
    return map;
  }, {} as SpotStudyMap);
};

const getPhraseLanguage = (phrases: Phrase[]): LearningLanguage => {
  return phrases[0]?.language ?? 'english';
};

const getCompletedSpotIdsForLanguage = (
  progress: LearningProgress,
  language: LearningLanguage
): SpotId[] => {
  if (progress.completedSpotIdsByLanguage?.[language]) {
    return progress.completedSpotIdsByLanguage[language];
  }

  return language === 'english' ? progress.completedSpotIds ?? [] : [];
};

export const getUnlockedSpotIds = (walkPoints: number): SpotId[] => {
  const unlockedCount = Math.min(
    WALK_SPOTS.length,
    Math.floor(Math.max(0, walkPoints) / WALK_POINTS_PER_SPOT) + 1
  );

  return WALK_SPOTS.slice(0, unlockedCount).map((spot) => spot.id);
};

export const syncWalkProgress = (progress: LearningProgress): LearningProgress => {
  const unlockedSpotIds = getUnlockedSpotIds(progress.walkPoints);
  const visitedSpotIds = uniqueValidSpotIds([
    HOME_SPOT_ID,
    ...(progress.visitedSpotIds ?? []),
  ]);
  const completedSpotIds = uniqueValidSpotIds(progress.completedSpotIds ?? []);
  const completedSpotIdsByLanguage = {
    english: uniqueValidSpotIds([
      ...completedSpotIds,
      ...(progress.completedSpotIdsByLanguage?.english ?? []),
    ]),
    chinese: uniqueValidSpotIds(progress.completedSpotIdsByLanguage?.chinese ?? []),
  };
  const currentSpotId = unlockedSpotIds.includes(progress.currentSpotId)
    ? progress.currentSpotId
    : unlockedSpotIds[unlockedSpotIds.length - 1] ?? HOME_SPOT_ID;

  return {
    ...progress,
    unlockedSpotIds,
    currentSpotId,
    visitedSpotIds,
    completedSpotIds,
    completedSpotIdsByLanguage,
    spotStudiedPhraseIds: syncSpotStudyMap(progress.spotStudiedPhraseIds),
  };
};

export const getWalkPointsForLesson = (
  mode: LessonMode,
  alreadyCompletedToday: boolean
): number => {
  if (mode === 'dailyQuiz') {
    return alreadyCompletedToday ? 0 : 1;
  }

  if (mode === 'extraQuiz') {
    return 2;
  }

  return 0;
};

export const addWalkPoints = (
  progress: LearningProgress,
  walkPointsGained: number
): { progress: LearningProgress; newlyUnlockedSpotIds: SpotId[] } => {
  const beforeUnlockedSpotIds = syncWalkProgress(progress).unlockedSpotIds;
  const walkPoints = progress.walkPoints + walkPointsGained;
  const nextProgress = syncWalkProgress({
    ...progress,
    walkPoints,
  });
  const newlyUnlockedSpotIds = nextProgress.unlockedSpotIds.filter(
    (spotId) => !beforeUnlockedSpotIds.includes(spotId)
  );

  if (newlyUnlockedSpotIds.length === 0) {
    return { progress: nextProgress, newlyUnlockedSpotIds };
  }

  return {
    progress: {
      ...nextProgress,
      currentSpotId: newlyUnlockedSpotIds[newlyUnlockedSpotIds.length - 1],
    },
    newlyUnlockedSpotIds,
  };
};

export const visitSpot = (progress: LearningProgress, spotId: SpotId): LearningProgress => {
  if (!progress.unlockedSpotIds.includes(spotId)) {
    return progress;
  }

  return {
    ...progress,
    currentSpotId: spotId,
    visitedSpotIds: uniqueValidSpotIds([...progress.visitedSpotIds, spotId]),
  };
};

export const getSpotPhrases = (phrases: Phrase[], spotId: SpotId): Phrase[] => {
  return phrases
    .filter((phrase) => phrase.spotId === spotId)
    .sort((first, second) => {
      const firstIsSpotPhrase = first.id.startsWith('spot-');
      const secondIsSpotPhrase = second.id.startsWith('spot-');

      if (firstIsSpotPhrase === secondIsSpotPhrase) {
        return 0;
      }

      return firstIsSpotPhrase ? -1 : 1;
    });
};

export const getDedicatedSpotPhrases = (phrases: Phrase[], spotId: SpotId): Phrase[] => {
  return getSpotPhrases(phrases, spotId).filter((phrase) => phrase.id.startsWith('spot-'));
};

export const markSpotPhrasesStudied = (
  progress: LearningProgress,
  spotId: SpotId,
  phraseIds: string[],
  phrases: Phrase[]
): LearningProgress => {
  const dedicatedPhraseIds = new Set(getDedicatedSpotPhrases(phrases, spotId).map((phrase) => phrase.id));
  const studiedPhraseIds = phraseIds.filter((phraseId) => dedicatedPhraseIds.has(phraseId));

  if (studiedPhraseIds.length === 0) {
    return progress;
  }

  const spotStudiedPhraseIds = syncSpotStudyMap(progress.spotStudiedPhraseIds);
  const previousIds = spotStudiedPhraseIds[spotId] ?? [];
  const nextIds = Array.from(new Set([...previousIds, ...studiedPhraseIds]));

  if (nextIds.length === previousIds.length) {
    return progress;
  }

  return {
    ...progress,
    spotStudiedPhraseIds: {
      ...spotStudiedPhraseIds,
      [spotId]: nextIds,
    },
  };
};

export const isSpotComplete = (
  progress: LearningProgress,
  spotId: SpotId,
  phrases: Phrase[]
): boolean => {
  const dedicatedPhrases = getDedicatedSpotPhrases(phrases, spotId);
  const studiedPhraseIdSet = new Set(progress.spotStudiedPhraseIds?.[spotId] ?? []);

  return dedicatedPhrases.length > 0 && dedicatedPhrases.every((phrase) => studiedPhraseIdSet.has(phrase.id));
};

const isSpotMastered = (
  progress: LearningProgress,
  spotId: SpotId,
  phrases: Phrase[]
): boolean => {
  const language = getPhraseLanguage(phrases);
  return getCompletedSpotIdsForLanguage(progress, language).includes(spotId) || isSpotComplete(progress, spotId, phrases);
};

export const areAllWalkSpotsComplete = (
  progress: LearningProgress,
  phrases: Phrase[]
): boolean => {
  const syncedProgress = syncWalkProgress(progress);
  return WALK_SPOTS.every((spot) => isSpotMastered(syncedProgress, spot.id, phrases));
};

export const getSpotStudyProgress = (
  progress: LearningProgress,
  spotId: SpotId,
  phrases: Phrase[]
): { studiedCount: number; totalCount: number; progressPercent: number } => {
  const dedicatedPhrases = getDedicatedSpotPhrases(phrases, spotId);
  const studiedPhraseIdSet = new Set(progress.spotStudiedPhraseIds?.[spotId] ?? []);
  const studiedCount = dedicatedPhrases.filter((phrase) => studiedPhraseIdSet.has(phrase.id)).length;
  const totalCount = dedicatedPhrases.length;

  return {
    studiedCount,
    totalCount,
    progressPercent: totalCount > 0 ? Math.round((studiedCount / totalCount) * 100) : 0,
  };
};

const getDateSeed = (dateKey: string): number => {
  return Array.from(dateKey).reduce((seed, char) => seed + char.charCodeAt(0), 0);
};

const buildRecommendation = (
  progress: LearningProgress,
  spot: (typeof WALK_SPOTS)[number],
  phrases: Phrase[],
  isReview = false
): RecommendedWalkSpot => {
  const spotProgress = getSpotStudyProgress(progress, spot.id, phrases);

  return {
    spot,
    ...spotProgress,
    title: isReview ? '今日の復習散歩' : '今日のおすすめ散歩',
    message: isReview
      ? `今日は${spot.name}をもう一度おさらいしよう。`
      : RECOMMENDATION_MESSAGES[spot.id],
    completionHint: isReview
      ? '復習できたら今日のおすすめ散歩完了！'
      : '10/10を目指して、この場所の会話を少しずつ覚えよう。',
    isReview,
  };
};

export const getRecommendedWalkSpot = (
  progress: LearningProgress,
  phrases: Phrase[],
  dateKey: string
): RecommendedWalkSpot => {
  const syncedProgress = syncWalkProgress(progress);
  const unlockedSpots = WALK_SPOTS.filter((spot) => syncedProgress.unlockedSpotIds.includes(spot.id));
  const allSpotsComplete = areAllWalkSpotsComplete(syncedProgress, phrases);
  const incompleteSpots = unlockedSpots.filter(
    (spot) => !isSpotMastered(syncedProgress, spot.id, phrases)
  );
  const partialSpots = incompleteSpots
    .filter((spot) => {
      const spotProgress = getSpotStudyProgress(syncedProgress, spot.id, phrases);
      return spotProgress.studiedCount > 0 && spotProgress.studiedCount < spotProgress.totalCount;
    })
    .sort((first, second) => {
      const firstProgress = getSpotStudyProgress(syncedProgress, first.id, phrases);
      const secondProgress = getSpotStudyProgress(syncedProgress, second.id, phrases);
      return secondProgress.studiedCount - firstProgress.studiedCount;
    });

  if (partialSpots.length > 0) {
    return buildRecommendation(syncedProgress, partialSpots[0], phrases);
  }

  const unstudiedSpots = incompleteSpots.filter(
    (spot) => getSpotStudyProgress(syncedProgress, spot.id, phrases).studiedCount === 0
  );

  if (unstudiedSpots.length > 0) {
    return buildRecommendation(syncedProgress, unstudiedSpots[0], phrases);
  }

  if (incompleteSpots.length > 0) {
    return buildRecommendation(syncedProgress, incompleteSpots[0], phrases);
  }

  if (!allSpotsComplete) {
    const fallbackSpots = unlockedSpots.length > 0 ? unlockedSpots : [WALK_SPOTS[0]];
    const fallbackSpot = fallbackSpots[getDateSeed(dateKey) % fallbackSpots.length];
    return buildRecommendation(syncedProgress, fallbackSpot, phrases);
  }

  const reviewSpots = WALK_SPOTS;
  const reviewSpot = reviewSpots[getDateSeed(dateKey) % reviewSpots.length];
  return buildRecommendation(syncedProgress, reviewSpot, phrases, true);
};

export const markDailyRecommendedWalkCompleted = (
  progress: LearningProgress,
  spotId: SpotId,
  dateKey: string
): LearningProgress => {
  const completedDailyRecommendedWalkDates = progress.completedDailyRecommendedWalkDates ?? [];

  if (
    progress.dailyRecommendedWalkDateJst !== dateKey ||
    progress.dailyRecommendedWalkSpotId !== spotId ||
    completedDailyRecommendedWalkDates.includes(dateKey)
  ) {
    return progress;
  }

  return {
    ...progress,
    completedDailyRecommendedWalkDates: [
      ...completedDailyRecommendedWalkDates,
      dateKey,
    ],
  };
};

export const ensureDailyRecommendedWalkProgress = (
  progress: LearningProgress,
  phrases: Phrase[],
  dateKey: string
): LearningProgress => {
  const syncedProgress = syncWalkProgress(progress);
  const savedSpotId = syncedProgress.dailyRecommendedWalkSpotId;
  const savedSpotIsUsable =
    syncedProgress.dailyRecommendedWalkDateJst === dateKey &&
    isValidSpotId(savedSpotId) &&
    syncedProgress.unlockedSpotIds.includes(savedSpotId);

  const spotId = savedSpotIsUsable
    ? savedSpotId
    : getRecommendedWalkSpot(syncedProgress, phrases, dateKey).spot.id;

  const progressWithDailyRecommendation: LearningProgress = {
    ...syncedProgress,
    dailyRecommendedWalkDateJst: dateKey,
    dailyRecommendedWalkSpotId: spotId,
    completedDailyRecommendedWalkDates:
      syncedProgress.completedDailyRecommendedWalkDates ?? [],
  };

  return progressWithDailyRecommendation;
};

export const getDailyRecommendedWalkSpot = (
  progress: LearningProgress,
  phrases: Phrase[],
  dateKey: string
): RecommendedWalkSpot => {
  const progressWithDailyRecommendation = ensureDailyRecommendedWalkProgress(
    progress,
    phrases,
    dateKey
  );
  const spotId = progressWithDailyRecommendation.dailyRecommendedWalkSpotId ?? HOME_SPOT_ID;
  const spot = WALK_SPOTS.find((item) => item.id === spotId) ?? WALK_SPOTS[0];
  const isReview = areAllWalkSpotsComplete(progressWithDailyRecommendation, phrases);

  return buildRecommendation(progressWithDailyRecommendation, spot, phrases, isReview);
};

export const isDailyRecommendedWalkReview = (
  progress: LearningProgress,
  phrases: Phrase[],
  dateKey: string
): boolean => {
  const progressWithDailyRecommendation = ensureDailyRecommendedWalkProgress(progress, phrases, dateKey);

  return areAllWalkSpotsComplete(progressWithDailyRecommendation, phrases);
};

export const getSpotPracticePhraseIds = (
  phrases: Phrase[],
  spotId: SpotId,
  count = 5,
  progress?: LearningProgress
): string[] => {
  const masteredPhraseIdSet = new Set(progress?.masteredPhraseIds ?? []);
  const isUnmastered = (phrase: Phrase) => !masteredPhraseIdSet.has(phrase.id);
  const spotPhrases = getSpotPhrases(phrases, spotId);
  const spotPhraseIds = spotPhrases.filter(isUnmastered).map((phrase) => phrase.id);
  const fallbackIds = phrases.filter(isUnmastered).map((phrase) => phrase.id);
  const masteredFallbackIds = phrases.map((phrase) => phrase.id);

  return Array.from(new Set([...spotPhraseIds, ...fallbackIds, ...masteredFallbackIds])).slice(0, count);
};
