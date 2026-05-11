import type { SpotId } from './walk';
import type { LearningLanguage } from './language';

export type PhraseCategory = 'daily' | 'travel' | 'business';

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
