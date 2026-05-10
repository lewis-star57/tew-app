import { calculateLevel } from './progressRules';
import { addDailyRewardStats, addStudyDate } from './studyCalendarRules';
import type { MiniConversation, MiniConversationReward } from '../types/miniConversation';
import type { LearningProgress } from '../types/progress';
import type { SpotId } from '../types/walk';

const MINI_CONVERSATION_XP = 10;
const MINI_CONVERSATION_TREATS = 1;
const MINI_CONVERSATION_MOOD_POINTS = 1;

export const getMiniConversationsBySpot = (
  conversations: MiniConversation[],
  spotId: SpotId
): MiniConversation[] => {
  return conversations.filter((conversation) => conversation.spotId === spotId);
};

export const getMiniConversationDateKey = (conversationId: string, dateKey: string): string => {
  return `${dateKey}:${conversationId}`;
};

export const completeMiniConversation = (
  progress: LearningProgress,
  conversation: MiniConversation,
  dateKey: string
): { progress: LearningProgress; reward: MiniConversationReward } => {
  const completedTodayKey = getMiniConversationDateKey(conversation.id, dateKey);
  const alreadyCompletedToday = progress.completedMiniConversationDates.includes(completedTodayKey);
  const alreadyCompletedEver = progress.completedMiniConversationIds.includes(conversation.id);

  if (alreadyCompletedToday) {
    return {
      progress,
      reward: {
        id: Date.now(),
        conversationId: conversation.id,
        title: conversation.title,
        didReward: false,
        isFirstCompletion: false,
        xpGained: 0,
        treatsGained: 0,
        moodPointsGained: 0,
      },
    };
  }

  const nextXp = progress.xp + MINI_CONVERSATION_XP;

  return {
    progress: addStudyDate(
      addDailyRewardStats(
        {
          ...progress,
          xp: nextXp,
          level: calculateLevel(nextXp),
          treats: progress.treats + MINI_CONVERSATION_TREATS,
          taffyMoodPoints: progress.taffyMoodPoints + MINI_CONVERSATION_MOOD_POINTS,
          completedMiniConversationIds: alreadyCompletedEver
            ? progress.completedMiniConversationIds
            : [...progress.completedMiniConversationIds, conversation.id],
          completedMiniConversationDates: [...progress.completedMiniConversationDates, completedTodayKey],
        },
        dateKey,
        { xp: MINI_CONVERSATION_XP, treats: MINI_CONVERSATION_TREATS }
      ),
      dateKey
    ),
    reward: {
      id: Date.now(),
      conversationId: conversation.id,
      title: conversation.title,
      didReward: true,
      isFirstCompletion: !alreadyCompletedEver,
      xpGained: MINI_CONVERSATION_XP,
      treatsGained: MINI_CONVERSATION_TREATS,
      moodPointsGained: MINI_CONVERSATION_MOOD_POINTS,
    },
  };
};
