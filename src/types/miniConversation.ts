import type { SpotId } from './walk';
import type { LearningLanguage } from './language';

export interface MiniConversationLine {
  role: 'taffy' | 'you';
  speaker: string;
  english: string;
  text?: string;
  japanese: string;
  pinyin?: string;
  kana: string;
}

export interface MiniConversation {
  id: string;
  language?: LearningLanguage;
  spotId: SpotId;
  title: string;
  scene: string;
  lines: MiniConversationLine[];
}

export interface MiniConversationReward {
  id: number;
  conversationId: string;
  title: string;
  didReward: boolean;
  isFirstCompletion: boolean;
  xpGained: number;
  treatsGained: number;
  moodPointsGained: number;
}
