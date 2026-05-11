import { getJstDateKey, isTodayJst } from './dateRules';
import { addDailyRewardStats, addStudyDate } from './studyCalendarRules';
import {
  addWalkPoints,
  createEmptySpotStudyMap,
  getWalkPointsForLesson,
  syncWalkProgress,
} from './walkRules';
import type { LearningProgress, LessonMode, LessonResult } from '../types/progress';

const LEVEL_XP = 120;
const CORRECT_XP = 8;
const WEAK_CORRECT_XP = 12;
const VIEW_ONLY_TREATS = 1;
const DAILY_MISSION_TREATS = 2;
const EXTRA_QUIZ_TREATS = 2;
const EXTRA_QUIZ_BONUS_TREATS = 1;
const EXTRA_QUIZ_BONUS_CORRECT_COUNT = 8;
const MAX_EXTRA_HISTORY = 50;

export const createInitialProgress = (): LearningProgress => ({
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
  streakDays: 0,
  lastStudyDateJst: null,
  studyDates: [],
  completedMissionDateJst: null,
  weakPhraseIds: [],
  masteredPhraseIds: [],
  viewOnlyDates: [],
  dailyPhraseDateJst: null,
  dailyPhraseId: null,
  spokenPhraseDates: [],
  completedMiniConversationIds: [],
  completedMiniConversationDates: [],
  currentMissionDateJst: null,
  currentNewPhraseIds: [],
  currentMissionPhraseIds: [],
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
    return 'レベルアップ！Taffyもびっくりしてるよ！';
  }

  if (walkPointsGained > 0) {
    return `散歩ポイント +${walkPointsGained}！Taffyと少し先へ進めたよ。`;
  }

  if (mode === 'viewOnly') {
    return '今日も来てくれてありがとう。見るだけでもえらいよ。';
  }

  if (mode === 'spotQuiz') {
    return 'Taffyと新しい場所を歩けたね。今日の会話、少しずつなじんでいます。';
  }

  if (mode === 'extraQuiz' && bonusTreatsGained > 0) {
    return 'すごい！8問以上正解です。Taffyもジャンプして喜んでいます。';
  }

  if (mode === 'extraQuiz') {
    return 'おかわり10問完了！Taffyが元気に歩いています。';
  }

  if (treatsGained > 0 && correctCount === totalQuestions) {
    return 'やったね！Taffyがおやつをゲットしたよ！';
  }

  if (correctCount === totalQuestions) {
    return '全問いい感じです。Taffyと一緒に、今日の5問ミッション完了です。';
  }

  return '惜しい！Taffyと一緒にもう一回覚えよう。';
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
  }
): { progress: LearningProgress; result: LessonResult } => {
  const now = options.now ?? new Date();
  const today = options.dateKey ?? getJstDateKey(now);
  const progressWithWalkDefaults = syncWalkProgress(progress);
  const alreadyCompletedToday =
    options.mode === 'dailyQuiz' &&
    (options.dateKey
      ? progressWithWalkDefaults.completedMissionDateJst === today
      : isTodayJst(progressWithWalkDefaults.completedMissionDateJst, now));
  const alreadyUsedViewOnlyToday =
    options.mode === 'viewOnly' && progressWithWalkDefaults.viewOnlyDates.includes(today);
  const correctCount = options.correctPhraseIds.length;
  const incorrectCount = options.incorrectPhraseIds.length;
  const totalQuestions = options.questionPhraseIds.length;
  const masteredPhraseIdSet = new Set(progressWithWalkDefaults.masteredPhraseIds ?? []);
  const nextWeakPhraseIds = mergeUnique(progressWithWalkDefaults.weakPhraseIds, options.incorrectPhraseIds).filter(
    (id) => !masteredPhraseIdSet.has(id)
  );
  const xpGained =
    options.mode === 'viewOnly'
      ? 0
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
    options.mode === 'dailyQuiz' || options.mode === 'extraQuiz' || options.mode === 'spotQuiz';
  const nextProgressBeforeStudyDate: LearningProgress = {
    ...progressWithWalkDefaults,
    xp: nextXp,
    level: levelAfter,
    treats: progressWithWalkDefaults.treats + treatsGained,
    lastStudyDateJst: today,
    completedMissionDateJst:
      options.mode === 'dailyQuiz' && !alreadyCompletedToday
        ? today
        : progressWithWalkDefaults.completedMissionDateJst,
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
      options.mode === 'dailyQuiz' || options.mode === 'extraQuiz' || options.mode === 'spotQuiz'
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
