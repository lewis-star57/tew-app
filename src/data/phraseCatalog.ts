import { CHINESE_EXTRA2_PHRASES } from './chineseExtra2Phrases';
import { CHINESE_EXTRA_PHRASES } from './chineseExtraPhrases';
import { CHINESE_PHRASES } from './chinesePhrases';
import { CHINESE_SPOT_PHRASES } from './chineseSpotPhrases';
import { ENGLISH_EXTRA_PHRASES } from './englishExtraPhrases';
import { PHRASES } from './phrases';
import type { LearningLanguage } from '../types/language';
import type { Phrase } from '../types/phrase';

export const ALL_CHINESE_PHRASES: Phrase[] = [
  ...CHINESE_PHRASES,
  ...CHINESE_SPOT_PHRASES,
  ...CHINESE_EXTRA_PHRASES,
  ...CHINESE_EXTRA2_PHRASES,
];

export const ALL_ENGLISH_PHRASES: Phrase[] = [
  ...PHRASES,
  ...ENGLISH_EXTRA_PHRASES,
];

export const getPhrasesByLanguage = (language: LearningLanguage): Phrase[] => {
  return language === 'chinese' ? ALL_CHINESE_PHRASES : ALL_ENGLISH_PHRASES;
};
