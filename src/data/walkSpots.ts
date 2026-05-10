import type { WalkSpot } from '../types/walk';

export const WALK_SPOTS: WalkSpot[] = [
  {
    id: 'home',
    name: 'Home',
    icon: '🏠',
    description: 'あいさつや自己紹介を練習するスタート地点です。',
    theme: 'あいさつ・自己紹介',
  },
  {
    id: 'park',
    name: 'Park',
    icon: '🌳',
    description: 'Taffyと散歩しながら、天気や雑談を練習します。',
    theme: '天気・散歩・雑談',
  },
  {
    id: 'cafe',
    name: 'Cafe',
    icon: '☕',
    description: '飲み物を頼んだり、お願いしたりする会話を練習します。',
    theme: '注文・お願い',
  },
  {
    id: 'station',
    name: 'Station',
    icon: '🚃',
    description: '道案内や電車で使う短い英語を練習します。',
    theme: '道案内・電車',
  },
  {
    id: 'convenience_store',
    name: 'Convenience Store',
    icon: '🛒',
    description: '買い物や支払いで使いやすい表現を練習します。',
    theme: '買い物・支払い',
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    icon: '🍽️',
    description: '食事の注文や会計で使う英語を練習します。',
    theme: '食事・注文・会計',
  },
  {
    id: 'office',
    name: 'Office',
    icon: '💼',
    description: '仕事でよく使う基本の会話を練習します。',
    theme: '仕事の基本会話',
  },
  {
    id: 'hotel',
    name: 'Hotel',
    icon: '🏨',
    description: '旅行先のチェックインやホテルで使う英語を練習します。',
    theme: '旅行・チェックイン',
  },
];
