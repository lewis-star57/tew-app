import { getJstDateKey, isTodayJst } from './dateRules';
import { addDailyRewardStats, addStudyDate } from './studyCalendarRules';
import {
  addWalkPoints,
  createEmptySpotStudyMap,
  getWalkPointsForLesson,
  syncWalkProgress,
} from './walkRules';
import type { LearningLanguage } from '../types/language';
import type { PhraseDifficulty } from '../types/phrase';
import type { LearningProgress, LessonMode, LessonResult } from '../types/progress';
import type { SpotId } from '../types/walk';
import { DEFAULT_DISPLAY_NAME } from '../utils/displayName';

const LEVEL_XP = 120;
const CORRECT_XP = 8;
const WEAK_CORRECT_XP = 12;
const VIEW_ONLY_TREATS = 1;
const DAILY_MISSION_TREATS = 2;
const EXTRA_QUIZ_TREATS = 2;
const EXTRA_QUIZ_BONUS_TREATS = 1;
const EXTRA_QUIZ_BONUS_CORRECT_COUNT = 8;
const DAILY_REVIEW_XP = 10;
const DAILY_REVIEW_TREATS = 1;
const DAILY_REVIEW_MOOD_POINTS = 1;
const RETRY_QUIZ_XP = 5;
const RETRY_QUIZ_MOOD_POINTS = 1;
const MAX_EXTRA_HISTORY = 50;
const DEFAULT_LANGUAGE: LearningLanguage = 'english';
export const DEFAULT_DIFFICULTY: PhraseDifficulty = 'normal';

export const createInitialCompletedMissionDatesByLanguage = (): Record<LearningLanguage, string | null> => ({
  english: null,
  chinese: null,
});

export const createInitialDailyPhraseByLanguage = () => ({
  english: {
    dateJst: null,
    phraseId: null,
    difficulty: null,
  },
  chinese: {
    dateJst: null,
    phraseId: null,
    difficulty: null,
  },
});

export const createInitialSpokenPhraseDatesByLanguage = (): Record<LearningLanguage, string[]> => ({
  english: [],
  chinese: [],
});

export const createInitialMissionByLanguage = () => ({
  english: {
    dateJst: null,
    newPhraseIds: [],
    missionPhraseIds: [],
    difficulty: null,
  },
  chinese: {
    dateJst: null,
    newPhraseIds: [],
    missionPhraseIds: [],
    difficulty: null,
  },
});

export const createInitialCompletedSpotIdsByLanguage = (): Record<LearningLanguage, SpotId[]> => ({
  english: [],
  chinese: [],
});

export const createInitialCompletedDailyReviewDatesByLanguage = (): Record<LearningLanguage, string[]> => ({
  english: [],
  chinese: [],
});

export const getLearningLanguage = (progress: LearningProgress): LearningLanguage => {
  return progress.learningLanguage ?? DEFAULT_LANGUAGE;
};

export const getSelectedDifficulty = (progress: LearningProgress): PhraseDifficulty => {
  return progress.selectedDifficulty ?? DEFAULT_DIFFICULTY;
};

export const syncCompletedMissionDatesByLanguage = (
  progress: LearningProgress
): Record<LearningLanguage, string | null> => {
  return {
    ...createInitialCompletedMissionDatesByLanguage(),
    ...(progress.completedMissionDatesByLanguage ?? {}),
    english: progress.completedMissionDatesByLanguage?.english ?? progress.completedMissionDateJst ?? null,
  };
};

export const getCompletedMissionDate = (
  progress: LearningProgress,
  language: LearningLanguage
): string | null => {
  return syncCompletedMissionDatesByLanguage(progress)[language] ?? null;
};

export const createInitialProgress = (): LearningProgress => ({
  hasSeenTutorial: false,
  displayName: DEFAULT_DISPLAY_NAME,
  learningLanguage: DEFAULT_LANGUAGE,
  selectedDifficulty: DEFAULT_DIFFICULTY,
  showDeveloperTools: false,
  xp: 0,
  level: 1,
  treats: 0,
  taffyMoodPoints: 0,
  totalTreatsGiven: 0,
  lastTreatGivenDateJst: null,
  walkPoints: 0,
  unlockedSpotIds: ['home'],
  currentSpotId: 'home',
  visitedSpotIds: ['home'],
  completedSpotIds: [],
  completedSpotIdsByLanguage: createInitialCompletedSpotIdsByLanguage(),
  streakDays: 0,
  lastStudyDateJst: null,
  studyDates: [],
  completedMissionDateJst: null,
  completedMissionDatesByLanguage: createInitialCompletedMissionDatesByLanguage(),
  completedDailyReviewDatesByLanguage: createInitialCompletedDailyReviewDatesByLanguage(),
  weakPhraseIds: [],
  masteredPhraseIds: [],
  viewOnlyDates: [],
  dailyPhraseDateJst: null,
  dailyPhraseId: null,
  dailyPhraseByLanguage: createInitialDailyPhraseByLanguage(),
  spokenPhraseDates: [],
  spokenPhraseDatesByLanguage: createInitialSpokenPhraseDatesByLanguage(),
  completedMiniConversationIds: [],
  completedMiniConversationDates: [],
  currentMissionDateJst: null,
  currentNewPhraseIds: [],
  currentMissionPhraseIds: [],
  currentMissionByLanguage: createInitialMissionByLanguage(),
  extraQuizHistory: [],
  dailyRewardStats: {},
  dailyRecommendedWalkDateJst: null,
  dailyRecommendedWalkSpotId: null,
  completedDailyRecommendedWalkDates: [],
  studiedPhraseIds: [],
  spotStudiedPhraseIds: createEmptySpotStudyMap(),
  correctAnswerCount: 0,
  incorrectAnswerCount: 0,
  totalLessons: 0,
  totalQuizzes: 0,
  debugCurrentDateJst: null,
});

export const calculateLevel = (xp: number): number => {
  return Math.floor(xp / LEVEL_XP) + 1;
};

const mergeUnique = (current: string[], additions: string[]): string[] => {
  return Array.from(new Set([...current, ...additions]));
};

const calculateQuizXp = (
  correctPhraseIds: string[],
  weakPhraseIds: string[]
): { xpGained: number; weakCorrectCount: number } => {
  const weakSet = new Set(weakPhraseIds);
  const weakCorrectCount = correctPhraseIds.filter((id) => weakSet.has(id)).length;
  const regularCorrectCount = correctPhraseIds.length - weakCorrectCount;

  return {
    xpGained: regularCorrectCount * CORRECT_XP + weakCorrectCount * WEAK_CORRECT_XP,
    weakCorrectCount,
  };
};

const calculateTreats = (
  mode: LessonMode,
  correctCount: number,
  alreadyCompletedToday: boolean,
  alreadyUsedViewOnlyToday: boolean
): { treatsGained: number; bonusTreatsGained: number } => {
  if (mode === 'viewOnly') {
    return {
      treatsGained: alreadyUsedViewOnlyToday ? 0 : VIEW_ONLY_TREATS,
      bonusTreatsGained: 0,
    };
  }

  if (mode === 'dailyQuiz') {
    return {
      treatsGained: alreadyCompletedToday ? 0 : DAILY_MISSION_TREATS,
      bonusTreatsGained: 0,
    };
  }

  if (mode === 'dailyReview') {
    return {
      treatsGained: alreadyCompletedToday ? 0 : DAILY_REVIEW_TREATS,
      bonusTreatsGained: 0,
    };
  }

  if (mode === 'retryQuiz') {
    return {
      treatsGained: 0,
      bonusTreatsGained: 0,
    };
  }

  if (mode === 'spotQuiz') {
    return {
      treatsGained: 0,
      bonusTreatsGained: 0,
    };
  }

  const bonusTreatsGained =
    correctCount >= EXTRA_QUIZ_BONUS_CORRECT_COUNT ? EXTRA_QUIZ_BONUS_TREATS : 0;

  return {
    treatsGained: EXTRA_QUIZ_TREATS + bonusTreatsGained,
    bonusTreatsGained,
  };
};

const getGentleMessage = (
  mode: LessonMode,
  correctCount: number,
  totalQuestions: number,
  treatsGained: number,
  bonusTreatsGained: number,
  leveledUp: boolean,
  walkPointsGained: number
) => {
  if (leveledUp) {
    return 'レベルアップ！Taffyもびっくりしてるよ🐶';
  }

  if (walkPointsGained > 0) {
    return `散歩ポイント +${walkPointsGained}！今日も1歩前進🐾`;
  }

  if (mode === 'viewOnly') {
    return '今日も来てくれてありがとう。見るだけでもえらいよ🐶';
  }

  if (mode === 'spotQuiz') {
    return 'この場所を歩ききったね！すごいよ🐶';
  }

  if (mode === 'dailyReview') {
    return '今日の復習できたね！Taffyも安心してるよ🐶';
  }

  if (mode === 'retryQuiz') {
    return correctCount === totalQuestions
      ? '再チャレンジ完了！おさらいできたね🐾'
      : '間違いは宝物だよ。Taffyと一緒にもう一回🐶';
  }

  if (mode === 'extraQuiz' && bonusTreatsGained > 0) {
    return 'すごい！8問以上正解。Taffyもジャンプしてるよ🐶';
  }

  if (mode === 'extraQuiz') {
    return 'おかわり10問完了！足あとがぐっと増えたよ🐾';
  }

  if (treatsGained > 0 && correctCount === totalQuestions) {
    return 'やったね！Taffyがおやつをゲットしたよ🐶';
  }

  if (correctCount === totalQuestions) {
    return 'すごい！Taffyもドヤ顔だよ🐶';
  }

  return '大丈夫。Taffyと一緒にもう一回覚えよう🐶';
};

export const completeLearningSession = (
  progress: LearningProgress,
  options: {
    mode: LessonMode;
    questionPhraseIds: string[];
    correctPhraseIds: string[];
    incorrectPhraseIds: string[];
    studiedPhraseIds?: string[];
    dateKey?: string;
    now?: Date;
    learningLanguage?: LearningLanguage;
  }
): { progress: LearningProgress; result: LessonResult } => {
  const now = options.now ?? new Date();
  const today = options.dateKey ?? getJstDateKey(now);
  const progressWithWalkDefaults = syncWalkProgress(progress);
  const learningLanguage = options.learningLanguage ?? getLearningLanguage(progressWithWalkDefaults);
  const completedMissionDatesByLanguage = syncCompletedMissionDatesByLanguage(progressWithWalkDefaults);
  const completedDailyReviewDatesByLanguage = {
    ...createInitialCompletedDailyReviewDatesByLanguage(),
    ...(progressWithWalkDefaults.completedDailyReviewDatesByLanguage ?? {}),
  };
  const alreadyCompletedDailyReviewToday = (
    completedDailyReviewDatesByLanguage[learningLanguage] ?? []
  ).includes(today);
  const alreadyCompletedToday =
    options.mode === 'dailyReview'
      ? alreadyCompletedDailyReviewToday
      : options.mode === 'dailyQuiz' &&
        (options.dateKey
          ? completedMissionDatesByLanguage[learningLanguage] === today
          : isTodayJst(completedMissionDatesByLanguage[learningLanguage], now));
  const alreadyUsedViewOnlyToday =
    options.mode === 'viewOnly' && progressWithWalkDefaults.viewOnlyDates.includes(today);
  const correctCount = options.correctPhraseIds.length;
  const incorrectCount = options.incorrectPhraseIds.length;
  const totalQuestions = options.questionPhraseIds.length;
  const masteredPhraseIdSet = new Set(progressWithWalkDefaults.masteredPhraseIds ?? []);
  const currentIncorrectPhraseIdSet = new Set(options.incorrectPhraseIds);
  const nextWeakPhraseIds = mergeUnique(
    progressWithWalkDefaults.weakPhraseIds.filter((id) => !currentIncorrectPhraseIdSet.has(id)),
    options.incorrectPhraseIds
  ).filter((id) => !masteredPhraseIdSet.has(id));
  const xpGained =
    options.mode === 'viewOnly'
      ? 0
      : options.mode === 'dailyReview'
        ? alreadyCompletedDailyReviewToday
          ? 0
          : DAILY_REVIEW_XP
        : options.mode === 'retryQuiz'
          ? RETRY_QUIZ_XP
        : calculateQuizXp(options.correctPhraseIds, progressWithWalkDefaults.weakPhraseIds).xpGained;
  const { treatsGained, bonusTreatsGained } = calculateTreats(
    options.mode,
    correctCount,
    alreadyCompletedToday,
    alreadyUsedViewOnlyToday
  );
  const walkPointsGained = getWalkPointsForLesson(options.mode, alreadyCompletedToday);
  const nextXp = progressWithWalkDefaults.xp + xpGained;
  const levelBefore = progressWithWalkDefaults.level;
  const levelAfter = calculateLevel(nextXp);
  const leveledUp = levelAfter > levelBefore;
  const studiedPhraseIds = options.studiedPhraseIds ?? options.questionPhraseIds;
  const nextExtraQuizHistory =
    options.mode === 'extraQuiz'
      ? [
          ...progressWithWalkDefaults.extraQuizHistory,
          {
            dateJst: today,
            phraseIds: options.questionPhraseIds,
            correctCount,
            incorrectCount,
          },
        ].slice(-MAX_EXTRA_HISTORY)
      : progressWithWalkDefaults.extraQuizHistory;

  const shouldRecordStudyDate =
    options.mode === 'dailyQuiz' ||
    options.mode === 'extraQuiz' ||
    options.mode === 'spotQuiz' ||
    options.mode === 'dailyReview' ||
    options.mode === 'retryQuiz';
  const nextCompletedMissionDatesByLanguage =
    options.mode === 'dailyQuiz' && !alreadyCompletedToday
      ? {
          ...completedMissionDatesByLanguage,
          [learningLanguage]: today,
        }
      : completedMissionDatesByLanguage;
  const nextCompletedDailyReviewDatesByLanguage =
    options.mode === 'dailyReview' && !alreadyCompletedDailyReviewToday
      ? {
          ...completedDailyReviewDatesByLanguage,
          [learningLanguage]: Array.from(
            new Set([...(completedDailyReviewDatesByLanguage[learningLanguage] ?? []), today])
          ),
        }
      : completedDailyReviewDatesByLanguage;
  const nextProgressBeforeStudyDate: LearningProgress = {
    ...progressWithWalkDefaults,
    learningLanguage,
    xp: nextXp,
    level: levelAfter,
    treats: progressWithWalkDefaults.treats + treatsGained,
    lastStudyDateJst: today,
    completedMissionDateJst:
      nextCompletedMissionDatesByLanguage[learningLanguage],
    completedMissionDatesByLanguage: nextCompletedMissionDatesByLanguage,
    completedDailyReviewDatesByLanguage: nextCompletedDailyReviewDatesByLanguage,
    taffyMoodPoints:
      options.mode === 'dailyReview' && !alreadyCompletedDailyReviewToday
        ? progressWithWalkDefaults.taffyMoodPoints + DAILY_REVIEW_MOOD_POINTS
        : options.mode === 'retryQuiz'
          ? progressWithWalkDefaults.taffyMoodPoints + RETRY_QUIZ_MOOD_POINTS
        : progressWithWalkDefaults.taffyMoodPoints,
    weakPhraseIds: nextWeakPhraseIds,
    viewOnlyDates:
      options.mode === 'viewOnly' && !progressWithWalkDefaults.viewOnlyDates.includes(today)
        ? [...progressWithWalkDefaults.viewOnlyDates, today]
        : progressWithWalkDefaults.viewOnlyDates,
    extraQuizHistory: nextExtraQuizHistory,
    studiedPhraseIds: mergeUnique(progressWithWalkDefaults.studiedPhraseIds, studiedPhraseIds),
    correctAnswerCount: progressWithWalkDefaults.correctAnswerCount + correctCount,
    incorrectAnswerCount: progressWithWalkDefaults.incorrectAnswerCount + incorrectCount,
    totalLessons: progressWithWalkDefaults.totalLessons + 1,
    totalQuizzes:
      options.mode === 'dailyQuiz' ||
      options.mode === 'extraQuiz' ||
      options.mode === 'spotQuiz' ||
      options.mode === 'dailyReview' ||
      options.mode === 'retryQuiz'
        ? progressWithWalkDefaults.totalQuizzes + 1
        : progressWithWalkDefaults.totalQuizzes,
  };
  const nextProgressWithRewardStats = addDailyRewardStats(nextProgressBeforeStudyDate, today, {
    xp: xpGained,
    treats: treatsGained,
  });
  const nextProgressBase = shouldRecordStudyDate
    ? addStudyDate(nextProgressWithRewardStats, today)
    : nextProgressWithRewardStats;
  const walkResult = addWalkPoints(nextProgressBase, walkPointsGained);
  const nextProgress = walkResult.progress;

  return {
    progress: nextProgress,
    result: {
      mode: options.mode,
      xpGained,
      treatsGained,
      bonusTreatsGained,
      correctCount,
      incorrectCount,
      totalQuestions,
      completedDateJst: today,
      alreadyCompletedToday,
      leveledUp,
      walkPointsGained,
      newlyUnlockedSpotIds: walkResult.newlyUnlockedSpotIds,
      levelBefore,
      levelAfter,
      gentleMessage: getGentleMessage(
        options.mode,
        correctCount,
        totalQuestions,
        treatsGained,
        bonusTreatsGained,
        leveledUp,
        walkPointsGained
      ),
    },
  };
};

export const completeDailyMission = completeLearningSession;

export const removeWeakPhrase = (
  progress: LearningProgress,
  phraseId: string
): LearningProgress => ({
  ...progress,
  weakPhraseIds: progress.weakPhraseIds.filter((id) => id !== phraseId),
});

export const markPhraseMastered = (
  progress: LearningProgress,
  phraseId: string
): LearningProgress => ({
  ...progress,
  masteredPhraseIds: Array.from(new Set([...(progress.masteredPhraseIds ?? []), phraseId])),
  weakPhraseIds: progress.weakPhraseIds.filter((id) => id !== phraseId),
});

export const unmarkPhraseMastered = (
  progress: LearningProgress,
  phraseId: string
): LearningProgress => ({
  ...progress,
  masteredPhraseIds: (progress.masteredPhraseIds ?? []).filter((id) => id !== phraseId),
});
