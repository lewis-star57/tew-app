import { useEffect, useMemo, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { ROUTES, type ScreenName } from './constants/routes';
import { MINI_CONVERSATIONS } from './data/miniConversations';
import { WALK_SPOTS } from './data/walkSpots';
import { PHRASES } from './data/phrases';
import { completeDailyPhraseSpeaking, ensureDailyPhraseProgress } from './game/dailyPhraseRules';
import { getJstDateKey } from './game/dateRules';
import { completeMiniConversation, getMiniConversationsBySpot } from './game/miniConversationRules';
import { calculateLevel, completeLearningSession, createInitialProgress, removeWeakPhrase } from './game/progressRules';
import { addDailyRewardStats, addStudyDate } from './game/studyCalendarRules';
import {
  ensureDailyMissionProgress,
  getMissionPhrasesByIds,
  selectExtraQuizPhraseIds,
} from './game/quizRules';
import { giveTreatToTaffy } from './game/taffyCareRules';
import {
  addWalkPoints,
  ensureDailyRecommendedWalkProgress,
  getDailyRecommendedWalkSpot,
  getDedicatedSpotPhrases,
  getSpotPracticePhraseIds,
  getSpotStudyProgress,
  isDailyRecommendedWalkReview,
  isSpotComplete,
  markDailyRecommendedWalkCompleted,
  markSpotPhrasesStudied,
  syncWalkProgress,
  visitSpot,
  WALK_POINTS_PER_SPOT,
} from './game/walkRules';
import { loadProgress, resetProgress, saveProgress } from './storage/learningStorage';
import { HomeScreen } from './screens/HomeScreen';
import { LessonScreen } from './screens/LessonScreen';
import { QuizScreen } from './screens/QuizScreen';
import { ResultScreen } from './screens/ResultScreen';
import { ReviewScreen } from './screens/ReviewScreen';
import { WalkMapScreen } from './screens/WalkMapScreen';
import { MiniConversationScreen } from './screens/MiniConversationScreen';
import { CalendarScreen } from './screens/CalendarScreen';
import type { MissionPhraseItem, MissionPhraseKind } from './components/MissionCard';
import type { MiniConversation, MiniConversationReward } from './types/miniConversation';
import type { LessonResult, LearningProgress, QuizMode } from './types/progress';
import type { SpotCompleteReward, SpotId } from './types/walk';

const SPOT_COMPLETE_XP = 50;
const SPOT_COMPLETE_TREATS = 5;
const SPOT_COMPLETE_WALK_POINTS = 1;

const prepareProgressForToday = (progress: LearningProgress, dateKey: string): LearningProgress => {
  return ensureDailyRecommendedWalkProgress(
    ensureDailyPhraseProgress(
      ensureDailyMissionProgress(progress, PHRASES, dateKey),
      PHRASES,
      dateKey
    ),
    PHRASES,
    dateKey
  );
};

interface TreatReactionState {
  id: number;
  message: string;
  didGiveTreat: boolean;
  didMoodLevelUp: boolean;
}

function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenName>(ROUTES.home);
  const [progress, setProgress] = useState<LearningProgress>(() => {
    const savedProgress = loadProgress();
    const dateKey = savedProgress.debugCurrentDateJst ?? getJstDateKey();
    return prepareProgressForToday(savedProgress, dateKey);
  });
  const [lastResult, setLastResult] = useState<LessonResult | null>(null);
  const [activeQuizMode, setActiveQuizMode] = useState<QuizMode>('dailyQuiz');
  const [activeLessonMode, setActiveLessonMode] = useState<'daily' | 'spot'>('daily');
  const [activeSpotId, setActiveSpotId] = useState<SpotId | null>(null);
  const [activeMiniConversationSpotId, setActiveMiniConversationSpotId] = useState<SpotId>('home');
  const [extraQuizPhraseIds, setExtraQuizPhraseIds] = useState<string[]>([]);
  const [spotPracticePhraseIds, setSpotPracticePhraseIds] = useState<string[]>([]);
  const [treatReaction, setTreatReaction] = useState<TreatReactionState | null>(null);
  const [spotCompleteReward, setSpotCompleteReward] = useState<SpotCompleteReward | null>(null);
  const [miniConversationReward, setMiniConversationReward] = useState<MiniConversationReward | null>(null);
  const [didSpeakDailyPhrase, setDidSpeakDailyPhrase] = useState(false);
  const todayKey = progress.debugCurrentDateJst ?? getJstDateKey();
  const completedToday = progress.completedMissionDateJst === todayKey;
  const newPhrasePhrases = useMemo(
    () => getMissionPhrasesByIds(PHRASES, progress.currentNewPhraseIds),
    [progress.currentNewPhraseIds]
  );
  const dailyQuizPhrases = useMemo(
    () => getMissionPhrasesByIds(PHRASES, progress.currentMissionPhraseIds),
    [progress.currentMissionPhraseIds]
  );
  const dailyMissionItems = useMemo<MissionPhraseItem[]>(() => {
    const newPhraseIdSet = new Set(progress.currentNewPhraseIds);
    const reviewPhraseIdSet = new Set([...progress.weakPhraseIds, ...progress.studiedPhraseIds]);

    return dailyQuizPhrases.map((phrase) => {
      const kind: MissionPhraseKind = newPhraseIdSet.has(phrase.id)
        ? 'new'
        : reviewPhraseIdSet.has(phrase.id)
          ? 'review'
          : 'fill';

      return { phrase, kind };
    });
  }, [
    dailyQuizPhrases,
    progress.currentNewPhraseIds,
    progress.weakPhraseIds,
    progress.studiedPhraseIds,
  ]);
  const extraQuizPhrases = useMemo(
    () => getMissionPhrasesByIds(PHRASES, extraQuizPhraseIds),
    [extraQuizPhraseIds]
  );
  const spotPracticePhrases = useMemo(
    () => getMissionPhrasesByIds(PHRASES, spotPracticePhraseIds),
    [spotPracticePhraseIds]
  );
  const activeLessonPhrases = activeLessonMode === 'spot' ? spotPracticePhrases : newPhrasePhrases;
  const activeQuizPhrases =
    activeQuizMode === 'extraQuiz'
      ? extraQuizPhrases
      : activeQuizMode === 'spotQuiz'
        ? spotPracticePhrases
        : dailyQuizPhrases;
  const weakPhrases = useMemo(
    () => PHRASES.filter((phrase) => progress.weakPhraseIds.includes(phrase.id)),
    [progress.weakPhraseIds]
  );
  const recommendedWalkSpot = useMemo(
    () => getDailyRecommendedWalkSpot(progress, PHRASES, todayKey),
    [progress, todayKey]
  );
  const activeSpotPracticeProgress = useMemo(() => {
    if (activeLessonMode !== 'spot' || !activeSpotId) {
      return undefined;
    }

    const spotProgress = getSpotStudyProgress(progress, activeSpotId, PHRASES);
    const isTodayRecommended =
      progress.dailyRecommendedWalkDateJst === todayKey &&
      progress.dailyRecommendedWalkSpotId === activeSpotId;
    const isTodayRecommendedComplete =
      isTodayRecommended && (progress.completedDailyRecommendedWalkDates ?? []).includes(todayKey);

    return {
      ...spotProgress,
      walkTitle: recommendedWalkSpot.title,
      isTodayRecommended,
      isTodayRecommendedComplete,
      isReviewWalk: recommendedWalkSpot.isReview,
    };
  }, [activeLessonMode, activeSpotId, progress, recommendedWalkSpot.isReview, recommendedWalkSpot.title, todayKey]);
  const dailyPhrase = useMemo(() => {
    return PHRASES.find((phrase) => phrase.id === progress.dailyPhraseId) ?? PHRASES[0];
  }, [progress.dailyPhraseId]);
  const hasSpokenDailyPhrase = progress.spokenPhraseDates.includes(todayKey);
  const activeMiniConversations = useMemo(
    () => getMiniConversationsBySpot(MINI_CONVERSATIONS, activeMiniConversationSpotId),
    [activeMiniConversationSpotId]
  );

  const completeAlreadyMasteredDailyRecommendedWalk = (
    currentProgress: LearningProgress
  ): LearningProgress => {
    if ((currentProgress.completedDailyRecommendedWalkDates ?? []).includes(todayKey)) {
      return currentProgress;
    }

    const progressWithRecommendation = ensureDailyRecommendedWalkProgress(currentProgress, PHRASES, todayKey);
    const spotId = progressWithRecommendation.dailyRecommendedWalkSpotId;

    if (!spotId || isDailyRecommendedWalkReview(progressWithRecommendation, PHRASES, todayKey)) {
      return currentProgress;
    }

    const recommendedSpotIsComplete =
      progressWithRecommendation.completedSpotIds.includes(spotId) ||
      isSpotComplete(progressWithRecommendation, spotId, PHRASES);

    if (!recommendedSpotIsComplete) {
      return currentProgress;
    }

    return markDailyRecommendedWalkCompleted(progressWithRecommendation, spotId, todayKey);
  };

  useEffect(() => {
    setProgress((current) => prepareProgressForToday(current, todayKey));
    setDidSpeakDailyPhrase(false);
  }, [todayKey]);

  useEffect(() => {
    setProgress((current) => completeAlreadyMasteredDailyRecommendedWalk(current));
  }, [progress, todayKey]);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const goToScreen = (screen: ScreenName) => {
    setTreatReaction(null);
    if (screen === ROUTES.lesson) {
      setActiveLessonMode('daily');
      setActiveSpotId(null);
    }
    setActiveScreen(screen);
  };

  const startMiniConversationPractice = (spotId: SpotId) => {
    setTreatReaction(null);
    setSpotCompleteReward(null);
    setMiniConversationReward(null);
    setActiveMiniConversationSpotId(spotId);
    setProgress((current) => visitSpot(syncWalkProgress(current), spotId));
    setActiveScreen(ROUTES.miniConversation);
  };

  const applySpotCompleteReward = (
    currentProgress: LearningProgress,
    spotId: SpotId
  ): { progress: LearningProgress; reward: SpotCompleteReward | null } => {
    const syncedProgress = syncWalkProgress(currentProgress);

    if (
      syncedProgress.completedSpotIds.includes(spotId) ||
      !isSpotComplete(syncedProgress, spotId, PHRASES)
    ) {
      return { progress: syncedProgress, reward: null };
    }

    const spot = WALK_SPOTS.find((item) => item.id === spotId);
    const nextXp = syncedProgress.xp + SPOT_COMPLETE_XP;
    const rewardedProgressBase = addStudyDate(
      addDailyRewardStats(
        {
          ...syncedProgress,
          xp: nextXp,
          level: calculateLevel(nextXp),
          treats: syncedProgress.treats + SPOT_COMPLETE_TREATS,
          completedSpotIds: [...syncedProgress.completedSpotIds, spotId],
        },
        todayKey,
        { xp: SPOT_COMPLETE_XP, treats: SPOT_COMPLETE_TREATS }
      ),
      todayKey
    );
    const walkResult = addWalkPoints(rewardedProgressBase, SPOT_COMPLETE_WALK_POINTS);
    const progressWithDailyRecommendation = markDailyRecommendedWalkCompleted(
      walkResult.progress,
      spotId,
      todayKey
    );

    return {
      progress: progressWithDailyRecommendation,
      reward: {
        id: Date.now(),
        spotId,
        spotName: spot?.name ?? spotId,
        xpGained: SPOT_COMPLETE_XP,
        treatsGained: SPOT_COMPLETE_TREATS,
        walkPointsGained: SPOT_COMPLETE_WALK_POINTS,
      },
    };
  };

  const handleGiveTreat = () => {
    const next = giveTreatToTaffy(progress, todayKey);
    setProgress(next.progress);
    setTreatReaction({
      id: Date.now(),
      message: next.message,
      didGiveTreat: next.didGiveTreat,
      didMoodLevelUp: next.didMoodLevelUp,
    });
  };

  const completeRecommendedReviewWalkIfNeeded = (
    currentProgress: LearningProgress,
    spotId: SpotId
  ): LearningProgress => {
    const progressWithRecommendation = ensureDailyRecommendedWalkProgress(currentProgress, PHRASES, todayKey);

    if (!isDailyRecommendedWalkReview(progressWithRecommendation, PHRASES, todayKey)) {
      return progressWithRecommendation;
    }

    return markDailyRecommendedWalkCompleted(progressWithRecommendation, spotId, todayKey);
  };

  const handleSpeakDailyPhrase = () => {
    const next = completeDailyPhraseSpeaking(progress, todayKey);

    setProgress(next.progress);
    setDidSpeakDailyPhrase(next.didReward);
    setTreatReaction(null);
  };

  const completeViewOnly = () => {
    setTreatReaction(null);
    const next = completeLearningSession(progress, {
      mode: 'viewOnly',
      questionPhraseIds: [],
      correctPhraseIds: [],
      incorrectPhraseIds: [],
      studiedPhraseIds: activeLessonMode === 'spot' ? spotPracticePhraseIds : progress.currentNewPhraseIds,
      dateKey: todayKey,
    });
    const nextProgress =
      activeLessonMode === 'spot' ? addStudyDate(next.progress, todayKey) : next.progress;
    const progressWithRecommendedWalk =
      activeLessonMode === 'spot' && activeSpotId
        ? completeRecommendedReviewWalkIfNeeded(nextProgress, activeSpotId)
        : nextProgress;

    setProgress(progressWithRecommendedWalk);
    setLastResult(next.result);
    setActiveScreen(ROUTES.result);
  };

  const startDailyQuiz = () => {
    setTreatReaction(null);
    setSpotCompleteReward(null);
    setMiniConversationReward(null);
    setActiveLessonMode('daily');
    setActiveSpotId(null);
    setActiveQuizMode('dailyQuiz');
    setActiveScreen(ROUTES.quiz);
  };

  const startExtraQuiz = () => {
    setTreatReaction(null);
    setSpotCompleteReward(null);
    setMiniConversationReward(null);
    const phraseIds = selectExtraQuizPhraseIds(PHRASES, progress, todayKey);
    setExtraQuizPhraseIds(phraseIds);
    setActiveQuizMode('extraQuiz');
    setActiveScreen(ROUTES.quiz);
  };

  const startSpotQuiz = () => {
    setTreatReaction(null);
    setActiveQuizMode('spotQuiz');
    setActiveScreen(ROUTES.quiz);
  };

  const startSpotPractice = (spotId: SpotId) => {
    const phraseIds = getSpotPracticePhraseIds(PHRASES, spotId, 10);
    setTreatReaction(null);
    setSpotCompleteReward(null);
    setMiniConversationReward(null);
    setSpotPracticePhraseIds(phraseIds);
    setActiveLessonMode('spot');
    setActiveSpotId(spotId);
    setProgress((current) => visitSpot(syncWalkProgress(current), spotId));
    setActiveScreen(ROUTES.lesson);
  };

  const markActiveSpotPhraseStudied = (phraseId: string) => {
    if (!activeSpotId) {
      return;
    }

    setProgress((current) => {
      const studiedProgress = markSpotPhrasesStudied(current, activeSpotId, [phraseId], PHRASES);
      const rewardResult = applySpotCompleteReward(studiedProgress, activeSpotId);

      if (rewardResult.reward) {
        setSpotCompleteReward(rewardResult.reward);
      }

      return rewardResult.progress;
    });
  };

  const unlockAllWalkSpots = () => {
    setProgress((current) => ({
      ...current,
      walkPoints: (WALK_SPOTS.length - 1) * WALK_POINTS_PER_SPOT,
      unlockedSpotIds: WALK_SPOTS.map((spot) => spot.id),
      visitedSpotIds: Array.from(new Set(['home', ...current.visitedSpotIds])),
    }));
  };

  const addWalkTestPoints = () => {
    setProgress((current) => addWalkPoints(syncWalkProgress(current), WALK_POINTS_PER_SPOT).progress);
  };

  const resetWalkPoints = () => {
    setProgress((current) => ({
      ...current,
      walkPoints: 0,
      unlockedSpotIds: ['home'],
      currentSpotId: 'home',
      visitedSpotIds: ['home'],
    }));
  };

  const resetUnlockedSpots = () => {
    setProgress((current) => ({
      ...current,
      unlockedSpotIds: ['home'],
      currentSpotId: 'home',
      visitedSpotIds: ['home'],
    }));
  };

  const moveToWalkSpot = (spotId: SpotId) => {
    setProgress((current) => ({
      ...current,
      currentSpotId: spotId,
      visitedSpotIds: Array.from(new Set(['home', ...current.visitedSpotIds, spotId])),
    }));
  };

  const completeQuiz = (data: {
    mode: QuizMode;
    questionPhraseIds: string[];
    correctPhraseIds: string[];
    incorrectPhraseIds: string[];
  }) => {
    setTreatReaction(null);
    const next = completeLearningSession(progress, {
      mode: data.mode,
      questionPhraseIds: data.questionPhraseIds,
      correctPhraseIds: data.correctPhraseIds,
      incorrectPhraseIds: data.incorrectPhraseIds,
      dateKey: todayKey,
    });

    let nextProgress = next.progress;
    let reward: SpotCompleteReward | null = null;

    if (data.mode === 'spotQuiz' && activeSpotId) {
      const studiedProgress = markSpotPhrasesStudied(next.progress, activeSpotId, data.questionPhraseIds, PHRASES);
      const rewardResult = applySpotCompleteReward(studiedProgress, activeSpotId);
      nextProgress = completeRecommendedReviewWalkIfNeeded(rewardResult.progress, activeSpotId);
      reward = rewardResult.reward;
    }

    setProgress(nextProgress);
    setSpotCompleteReward(reward);
    setLastResult(next.result);
    setActiveScreen(ROUTES.result);
  };

  const handleCompleteMiniConversation = (conversation: MiniConversation) => {
    const next = completeMiniConversation(progress, conversation, todayKey);
    const nextProgress = completeRecommendedReviewWalkIfNeeded(next.progress, conversation.spotId);

    setProgress(nextProgress);
    setMiniConversationReward(next.reward);
    setTreatReaction(null);
  };

  const markMastered = (phraseId: string) => {
    setProgress((current) => removeWeakPhrase(current, phraseId));
  };

  const setDebugCurrentDate = (dateKey: string | null) => {
    setProgress((current) => prepareProgressForToday(
      {
        ...current,
        debugCurrentDateJst: dateKey,
      },
      dateKey ?? getJstDateKey()
    ));
    setLastResult(null);
    setTreatReaction(null);
    setSpotCompleteReward(null);
    setMiniConversationReward(null);
    setDidSpeakDailyPhrase(false);
  };

  const clearTransientFeedback = () => {
    setLastResult(null);
    setTreatReaction(null);
    setSpotCompleteReward(null);
    setMiniConversationReward(null);
    setDidSpeakDailyPhrase(false);
  };

  const resetDailyPhraseCompletionForDate = (dateKey: string) => {
    setProgress((current) => ({
      ...current,
      spokenPhraseDates: current.spokenPhraseDates.filter((date) => date !== dateKey),
    }));
    clearTransientFeedback();
  };

  const resetDailyMissionCompletionForDate = (dateKey: string) => {
    setProgress((current) => ({
      ...current,
      completedMissionDateJst:
        current.completedMissionDateJst === dateKey ? null : current.completedMissionDateJst,
    }));
    clearTransientFeedback();
  };

  const resetDailyRecommendedWalkCompletionForDate = (dateKey: string) => {
    setProgress((current) => ({
      ...current,
      completedDailyRecommendedWalkDates: (current.completedDailyRecommendedWalkDates ?? []).filter(
        (date) => date !== dateKey
      ),
    }));
    clearTransientFeedback();
  };

  const setDailyRecommendedWalkToNineOfTen = () => {
    const targetDateKey = todayKey;

    setProgress((current) => {
      const progressWithRecommendation = ensureDailyRecommendedWalkProgress(current, PHRASES, targetDateKey);
      const spotId = progressWithRecommendation.dailyRecommendedWalkSpotId;

      if (!spotId) {
        return progressWithRecommendation;
      }

      const dedicatedPhraseIds = getDedicatedSpotPhrases(PHRASES, spotId)
        .slice(0, 10)
        .map((phrase) => phrase.id);
      const nearCompletePhraseIds = dedicatedPhraseIds.slice(1, 10);

      return {
        ...progressWithRecommendation,
        completedSpotIds: progressWithRecommendation.completedSpotIds.filter((completedSpotId) => completedSpotId !== spotId),
        completedDailyRecommendedWalkDates: (progressWithRecommendation.completedDailyRecommendedWalkDates ?? []).filter(
          (date) => date !== targetDateKey
        ),
        spotStudiedPhraseIds: {
          ...progressWithRecommendation.spotStudiedPhraseIds,
          [spotId]: nearCompletePhraseIds,
        },
      };
    });
    clearTransientFeedback();
  };

  const resetDailyRecommendedWalkTestState = () => {
    const targetDateKey = todayKey;

    setProgress((current) => {
      const progressWithRecommendation = ensureDailyRecommendedWalkProgress(current, PHRASES, targetDateKey);
      const spotId = progressWithRecommendation.dailyRecommendedWalkSpotId;

      if (!spotId) {
        return progressWithRecommendation;
      }

      return {
        ...progressWithRecommendation,
        completedSpotIds: progressWithRecommendation.completedSpotIds.filter((completedSpotId) => completedSpotId !== spotId),
        completedDailyRecommendedWalkDates: (progressWithRecommendation.completedDailyRecommendedWalkDates ?? []).filter(
          (date) => date !== targetDateKey
        ),
        spotStudiedPhraseIds: {
          ...progressWithRecommendation.spotStudiedPhraseIds,
          [spotId]: [],
        },
      };
    });
    clearTransientFeedback();
  };

  const completeDailyRecommendedWalkForTest = () => {
    const targetDateKey = todayKey;

    setProgress((current) => {
      const progressWithRecommendation = ensureDailyRecommendedWalkProgress(current, PHRASES, targetDateKey);
      const spotId = progressWithRecommendation.dailyRecommendedWalkSpotId;

      if (!spotId) {
        return progressWithRecommendation;
      }

      return {
        ...progressWithRecommendation,
        completedDailyRecommendedWalkDates: Array.from(
          new Set([...(progressWithRecommendation.completedDailyRecommendedWalkDates ?? []), targetDateKey])
        ),
      };
    });
    clearTransientFeedback();
  };

  const resetTreatGivenForDate = (dateKey: string) => {
    setProgress((current) => ({
      ...current,
      lastTreatGivenDateJst:
        current.lastTreatGivenDateJst === dateKey ? null : current.lastTreatGivenDateJst,
    }));
    clearTransientFeedback();
  };

  const resetDailyRewardStatsForDate = (dateKey: string) => {
    setProgress((current) => {
      const dailyRewardStats = { ...(current.dailyRewardStats ?? {}) };
      delete dailyRewardStats[dateKey];

      return {
        ...current,
        dailyRewardStats,
      };
    });
    clearTransientFeedback();
  };

  const resetTodayCompletionState = () => {
    const targetDateKey = todayKey;

    setProgress((current) => {
      const dailyRewardStats = { ...(current.dailyRewardStats ?? {}) };
      delete dailyRewardStats[targetDateKey];

      return {
        ...current,
        spokenPhraseDates: current.spokenPhraseDates.filter((date) => date !== targetDateKey),
        completedMissionDateJst:
          current.completedMissionDateJst === targetDateKey ? null : current.completedMissionDateJst,
        completedDailyRecommendedWalkDates: (current.completedDailyRecommendedWalkDates ?? []).filter(
          (date) => date !== targetDateKey
        ),
        lastTreatGivenDateJst:
          current.lastTreatGivenDateJst === targetDateKey ? null : current.lastTreatGivenDateJst,
        dailyRewardStats,
        studyDates: (current.studyDates ?? []).filter((date) => date !== targetDateKey),
      };
    });
    clearTransientFeedback();
  };

  const handleResetProgress = () => {
    resetProgress();
    const initialProgress = createInitialProgress();
    setProgress(prepareProgressForToday(initialProgress, initialProgress.debugCurrentDateJst ?? getJstDateKey()));
    setLastResult(null);
    setTreatReaction(null);
    setSpotCompleteReward(null);
    setMiniConversationReward(null);
    setDidSpeakDailyPhrase(false);
    setActiveLessonMode('daily');
    setActiveSpotId(null);
    setSpotPracticePhraseIds([]);
    setActiveScreen(ROUTES.home);
  };

  return (
    <div className="appShell">
      {activeScreen === ROUTES.home ? (
        <HomeScreen
          progress={progress}
          missionPhraseItems={dailyMissionItems}
          recommendedWalkSpot={recommendedWalkSpot}
          dailyPhrase={dailyPhrase}
          todayKey={todayKey}
          hasSpokenDailyPhrase={hasSpokenDailyPhrase}
          didSpeakDailyPhrase={didSpeakDailyPhrase}
          completedToday={completedToday}
          treatReactionMessage={treatReaction?.message ?? null}
          didGiveTreat={treatReaction?.didGiveTreat ?? false}
          didMoodLevelUp={treatReaction?.didMoodLevelUp ?? false}
          treatReactionId={treatReaction?.id ?? 0}
          onGiveTreat={handleGiveTreat}
          onStartLesson={() => {
            setActiveLessonMode('daily');
            setActiveSpotId(null);
            goToScreen(ROUTES.lesson);
          }}
          onStartDailyQuiz={startDailyQuiz}
          onStartExtraQuiz={startExtraQuiz}
          onStartRecommendedWalk={startSpotPractice}
          onSpeakDailyPhrase={handleSpeakDailyPhrase}
          onCompleteViewOnly={completeViewOnly}
          onOpenCalendar={() => goToScreen(ROUTES.calendar)}
          onOpenReview={() => goToScreen(ROUTES.review)}
        />
      ) : null}
      {activeScreen === ROUTES.lesson ? (
        <LessonScreen
          title={activeLessonMode === 'spot' ? 'この場所の会話レッスン' : '今日の3フレーズ'}
          message={
            activeLessonMode === 'spot'
              ? 'この場所で使いやすい英語を、Taffyと一緒にゆっくり見ます。'
              : '英文、日本語訳、使う場面、カタカナ目安をゆっくり見ます。'
          }
          missionPhrases={activeLessonPhrases}
          onCompleteViewOnly={completeViewOnly}
          onStartQuiz={activeLessonMode === 'spot' ? startSpotQuiz : startDailyQuiz}
          onViewPhrase={activeLessonMode === 'spot' ? markActiveSpotPhraseStudied : undefined}
          spotPracticeProgress={activeSpotPracticeProgress}
          spotCompleteReward={spotCompleteReward}
          viewOnlyButtonLabel={activeLessonMode === 'spot' ? '今日はここまでにする' : undefined}
        />
      ) : null}
      {activeScreen === ROUTES.quiz ? (
        <QuizScreen
          allPhrases={PHRASES}
          missionPhrases={activeQuizPhrases}
          quizMode={activeQuizMode}
          weakPhraseIds={progress.weakPhraseIds}
          onCompleteQuiz={completeQuiz}
        />
      ) : null}
      {activeScreen === ROUTES.result ? (
        <ResultScreen
          progress={progress}
          result={lastResult}
          spotCompleteReward={spotCompleteReward}
          completedToday={completedToday}
          todayKey={todayKey}
          onBackHome={() => goToScreen(ROUTES.home)}
          onReview={() => goToScreen(ROUTES.review)}
        />
      ) : null}
      {activeScreen === ROUTES.map ? (
        <WalkMapScreen
          progress={progress}
          lastResult={lastResult}
          spots={WALK_SPOTS}
          phrases={PHRASES}
          spotCompleteReward={spotCompleteReward}
          onPracticeSpot={startSpotPractice}
          onPracticeMiniConversation={startMiniConversationPractice}
          onUnlockAllSpots={unlockAllWalkSpots}
          onAddWalkPoints={addWalkTestPoints}
          onResetWalkPoints={resetWalkPoints}
          onResetUnlockedSpots={resetUnlockedSpots}
          onMoveToSpot={moveToWalkSpot}
        />
      ) : null}
      {activeScreen === ROUTES.miniConversation ? (
        <MiniConversationScreen
          conversations={activeMiniConversations}
          todayKey={todayKey}
          completedMiniConversationDates={progress.completedMiniConversationDates}
          reward={miniConversationReward}
          onCompleteConversation={handleCompleteMiniConversation}
          onBackToMap={() => goToScreen(ROUTES.map)}
        />
      ) : null}
      {activeScreen === ROUTES.calendar ? (
        <CalendarScreen
          progress={progress}
          todayKey={todayKey}
          onSetDebugDate={setDebugCurrentDate}
          onResetTodayCompletionState={resetTodayCompletionState}
          onResetDailyPhraseCompletion={() => resetDailyPhraseCompletionForDate(todayKey)}
          onResetDailyMissionCompletion={() => resetDailyMissionCompletionForDate(todayKey)}
          onResetDailyRecommendedWalkCompletion={() => resetDailyRecommendedWalkCompletionForDate(todayKey)}
          onSetDailyRecommendedWalkToNineOfTen={setDailyRecommendedWalkToNineOfTen}
          onResetDailyRecommendedWalkTestState={resetDailyRecommendedWalkTestState}
          onCompleteDailyRecommendedWalkForTest={completeDailyRecommendedWalkForTest}
          onResetTreatGiven={() => resetTreatGivenForDate(todayKey)}
          onResetDailyRewardStats={() => resetDailyRewardStatsForDate(todayKey)}
          onBackHome={() => goToScreen(ROUTES.home)}
        />
      ) : null}
      {activeScreen === ROUTES.review ? (
        <ReviewScreen
          weakPhrases={weakPhrases}
          onMarkMastered={markMastered}
          onStartLesson={() => {
            setActiveLessonMode('daily');
            setActiveSpotId(null);
            goToScreen(ROUTES.lesson);
          }}
          onResetProgress={handleResetProgress}
        />
      ) : null}
      <BottomNav activeScreen={activeScreen} onNavigate={goToScreen} />
    </div>
  );
}

export default App;
