import type { SpotId } from './walk';

export type LessonMode = 'dailyQuiz' | 'extraQuiz' | 'viewOnly' | 'spotQuiz';
export type QuizMode = 'dailyQuiz' | 'extraQuiz' | 'spotQuiz';

export interface ExtraQuizHistoryItem {
  dateJst: string;
  phraseIds: string[];
  correctCount: number;
  incorrectCount: number;
}

export type SpotStudyMap = Record<SpotId, string[]>;

export interface DailyRewardStat {
  xp: number;
  treats: number;
}

export interface LearningProgress {
  xp: number;
  level: number;
  treats: number;
  taffyMoodPoints: number;
  totalTreatsGiven: number;
  lastTreatGivenDateJst: string | null;
  walkPoints: number;
  unlockedSpotIds: SpotId[];
  currentSpotId: SpotId;
  visitedSpotIds: SpotId[];
  completedSpotIds: SpotId[];
  streakDays: number;
  lastStudyDateJst: string | null;
  studyDates: string[];
  completedMissionDateJst: string | null;
  weakPhraseIds: string[];
  masteredPhraseIds: string[];
  viewOnlyDates: string[];
  dailyPhraseDateJst: string | null;
  dailyPhraseId: string | null;
  spokenPhraseDates: string[];
  completedMiniConversationIds: string[];
  completedMiniConversationDates: string[];
  currentMissionDateJst: string | null;
  currentNewPhraseIds: string[];
  currentMissionPhraseIds: string[];
  extraQuizHistory: ExtraQuizHistoryItem[];
  dailyRewardStats: Record<string, DailyRewardStat>;
  dailyRecommendedWalkDateJst: string | null;
  dailyRecommendedWalkSpotId: SpotId | null;
  completedDailyRecommendedWalkDates: string[];
  studiedPhraseIds: string[];
  spotStudiedPhraseIds: SpotStudyMap;
  correctAnswerCount: number;
  incorrectAnswerCount: number;
  totalLessons: number;
  totalQuizzes: number;
  debugCurrentDateJst: string | null;
}

export interface LessonResult {
  mode: LessonMode;
  xpGained: number;
  treatsGained: number;
  bonusTreatsGained: number;
  correctCount: number;
  incorrectCount: number;
  totalQuestions: number;
  completedDateJst: string;
  alreadyCompletedToday: boolean;
  leveledUp: boolean;
  walkPointsGained: number;
  newlyUnlockedSpotIds: SpotId[];
  levelBefore: number;
  levelAfter: number;
  gentleMessage: string;
}
