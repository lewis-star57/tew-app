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
  | 'shopping'
  | 'cafe'
  | 'restaurant'
  | 'direction'
  | 'hotel'
  | 'business_basic';

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
}

export interface QuizQuestion {
  phrase: Phrase;
  prompt: string;
  choices: string[];
  correctChoice: string;
}
