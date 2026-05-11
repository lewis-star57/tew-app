import { CHINESE_MINI_CONVERSATIONS } from './chineseMiniConversations';
import { MINI_CONVERSATIONS } from './miniConversations';
import type { LearningLanguage } from '../types/language';
import type { MiniConversation } from '../types/miniConversation';

export const getMiniConversationsByLanguage = (
  language: LearningLanguage
): MiniConversation[] => {
  return language === 'chinese' ? CHINESE_MINI_CONVERSATIONS : MINI_CONVERSATIONS;
};
