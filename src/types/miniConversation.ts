import type { SpotId } from './walk';

export interface MiniConversationLine {
  role: 'taffy' | 'you';
  speaker: string;
  english: string;
  japanese: string;
  kana: string;
}

export interface MiniConversation {
  id: string;
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
