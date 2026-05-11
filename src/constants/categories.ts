import type { PhraseCategory } from '../types/phrase';

export const CATEGORY_LABELS: Record<PhraseCategory, string> = {
  daily: '日常',
  travel: '旅行',
  business: '仕事',
  greeting: 'あいさつ',
  self_intro: '自己紹介',
  thanks_apology: '感謝・謝罪',
  request: 'お願い',
  shopping: '買い物',
  cafe: 'カフェ',
  restaurant: 'レストラン',
  direction: '道案内',
  hotel: 'ホテル',
  business_basic: '仕事基本',
};

export const CATEGORY_DESCRIPTIONS: Record<PhraseCategory, string> = {
  daily: '毎日の会話で使うやさしいフレーズ',
  travel: '移動、買い物、ホテルで使うフレーズ',
  business: '仕事の場面で使う初級フレーズ',
  greeting: 'あいさつで使う短いフレーズ',
  self_intro: '自己紹介で使う短いフレーズ',
  thanks_apology: '感謝や謝罪を伝えるフレーズ',
  request: 'お願いしたい時のフレーズ',
  shopping: '買い物で使うフレーズ',
  cafe: 'カフェで使うフレーズ',
  restaurant: 'レストランで使うフレーズ',
  direction: '道案内で使うフレーズ',
  hotel: 'ホテルで使うフレーズ',
  business_basic: '仕事で使う基本フレーズ',
};

export const CATEGORY_ORDER: PhraseCategory[] = [
  'greeting',
  'self_intro',
  'thanks_apology',
  'request',
  'shopping',
  'cafe',
  'restaurant',
  'direction',
  'hotel',
  'business_basic',
  'daily',
  'travel',
  'business',
];

export const FUTURE_CATEGORY_HINTS = [
  'realEstate: 不動産英語を追加する場所',
  'walkMap: XPを使って散歩マップに広げる場所',
  'outfits: Taffyの着せ替えに広げる場所',
];
