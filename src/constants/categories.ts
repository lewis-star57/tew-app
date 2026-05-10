import type { PhraseCategory } from '../types/phrase';

export const CATEGORY_LABELS: Record<PhraseCategory, string> = {
  daily: '日常',
  travel: '旅行',
  business: '仕事',
};

export const CATEGORY_DESCRIPTIONS: Record<PhraseCategory, string> = {
  daily: '毎日の会話で使うやさしい英語',
  travel: '移動、買い物、ホテルで使う英語',
  business: '仕事の場面で使う初級英語',
};

export const CATEGORY_ORDER: PhraseCategory[] = ['daily', 'travel', 'business'];

export const FUTURE_CATEGORY_HINTS = [
  'realEstate: 不動産英語を追加する場所',
  'walkMap: XPを使って散歩マップに広げる場所',
  'outfits: Taffyの着せ替えに広げる場所',
];
