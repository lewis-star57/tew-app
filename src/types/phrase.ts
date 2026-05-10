import type { SpotId } from './walk';

export type PhraseCategory = 'daily' | 'travel' | 'business';

export interface Phrase {
  id: string;
  category: PhraseCategory;
  spotId: SpotId;
  english: string;
  text: string;
  japanese: string;
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
