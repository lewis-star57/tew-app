import { CHINESE_EXTRA_PHRASES } from './chineseExtraPhrases';
import { CHINESE_PHRASES } from './chinesePhrases';
import { CHINESE_SPOT_PHRASES } from './chineseSpotPhrases';
import { PHRASES } from './phrases';
import type { LearningLanguage } from '../types/language';
import type { Phrase } from '../types/phrase';

export const ALL_CHINESE_PHRASES: Phrase[] = [
  ...CHINESE_PHRASES,
  ...CHINESE_SPOT_PHRASES,
  ...CHINESE_EXTRA_PHRASES,
];

export const getPhrasesByLanguage = (language: LearningLanguage): Phrase[] => {
  return language === 'chinese' ? ALL_CHINESE_PHRASES : PHRASES;
};
