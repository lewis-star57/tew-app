import type { SpotId } from './walk';
import type { LearningLanguage } from './language';

export type PhraseCategory =
  | 'daily'
  | 'travel'
  | 'business'
  | 'greeting'
  | 'self_intro'
  | 'thanks_apology'
  | 'request'
  | 'feelings'
  | 'shopping'
  | 'cafe'
  | 'restaurant'
  | 'direction'
  | 'hotel'
  | 'small_talk'
  | 'emergency'
  | 'business_basic';

export type PhraseDifficulty = 'easy' | 'normal' | 'challenge';

export const PHRASE_DIFFICULTY_LABELS: Record<PhraseDifficulty, string> = {
  easy: 'かんたん',
  normal: 'ふつう',
  challenge: 'チャレンジ',
};

export interface Phrase {
  id: string;
  language: LearningLanguage;
  category: PhraseCategory;
  spotId: SpotId;
  english: string;
  text: string;
  japanese: string;
  pinyin?: string;
  scene: string;
  kana: string;
  choices: string[];
  difficulty?: PhraseDifficulty;
}

export interface QuizQuestion {
  phrase: Phrase;
  prompt: string;
  choices: string[];
  correctChoice: string;
}
