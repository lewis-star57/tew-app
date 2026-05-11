import type { Phrase } from '../types/phrase';

type ChinesePhraseSeed = Pick<Phrase, 'id' | 'text' | 'japanese' | 'pinyin' | 'scene' | 'kana'>;

const chinesePhraseSeeds: ChinesePhraseSeed[] = [
  {
    id: 'zh-daily-001',
    text: '你好。',
    japanese: 'こんにちは。',
    pinyin: 'nǐ hǎo',
    scene: 'あいさつをする',
    kana: 'ニー ハオ',
  },
  {
    id: 'zh-daily-002',
    text: '早上好。',
    japanese: 'おはようございます。',
    pinyin: 'zǎo shang hǎo',
    scene: '朝のあいさつ',
    kana: 'ザオ シャン ハオ',
  },
  {
    id: 'zh-daily-003',
    text: '晚上好。',
    japanese: 'こんばんは。',
    pinyin: 'wǎn shang hǎo',
    scene: '夜のあいさつ',
    kana: 'ワン シャン ハオ',
  },
  {
    id: 'zh-daily-004',
    text: '谢谢。',
    japanese: 'ありがとう。',
    pinyin: 'xiè xie',
    scene: 'お礼を言う',
    kana: 'シエ シエ',
  },
  {
    id: 'zh-daily-005',
    text: '不客气。',
    japanese: 'どういたしまして。',
    pinyin: 'bú kè qi',
    scene: 'お礼に返す',
    kana: 'ブー クー チー',
  },
  {
    id: 'zh-daily-006',
    text: '对不起。',
    japanese: 'ごめんなさい。',
    pinyin: 'duì bu qǐ',
    scene: '謝る',
    kana: 'ドゥイ ブ チー',
  },
  {
    id: 'zh-daily-007',
    text: '没关系。',
    japanese: '大丈夫です。',
    pinyin: 'méi guān xi',
    scene: '相手を安心させる',
    kana: 'メイ グアン シー',
  },
  {
    id: 'zh-daily-008',
    text: '再见。',
    japanese: 'さようなら。',
    pinyin: 'zài jiàn',
    scene: '別れる時',
    kana: 'ザイ ジエン',
  },
  {
    id: 'zh-daily-009',
    text: '我叫Kiyo。',
    japanese: '私はKiyoです。',
    pinyin: 'wǒ jiào Kiyo',
    scene: '自己紹介をする',
    kana: 'ウォ ジャオ キヨ',
  },
  {
    id: 'zh-daily-010',
    text: '很高兴认识你。',
    japanese: 'お会いできてうれしいです。',
    pinyin: 'hěn gāo xìng rèn shi nǐ',
    scene: '初対面のあいさつ',
    kana: 'ヘン ガオ シン レン シー ニー',
  },
  {
    id: 'zh-daily-011',
    text: '你好吗？',
    japanese: '元気ですか？',
    pinyin: 'nǐ hǎo ma',
    scene: '相手の調子を聞く',
    kana: 'ニー ハオ マ',
  },
  {
    id: 'zh-daily-012',
    text: '我很好。',
    japanese: '元気です。',
    pinyin: 'wǒ hěn hǎo',
    scene: '調子を答える',
    kana: 'ウォ ヘン ハオ',
  },
  {
    id: 'zh-daily-013',
    text: '我有点累。',
    japanese: '少し疲れています。',
    pinyin: 'wǒ yǒu diǎn lèi',
    scene: '体調を伝える',
    kana: 'ウォ ヨウ ディエン レイ',
  },
  {
    id: 'zh-daily-014',
    text: '我明白了。',
    japanese: 'わかりました。',
    pinyin: 'wǒ míng bai le',
    scene: '理解したと伝える',
    kana: 'ウォ ミン バイ ラ',
  },
  {
    id: 'zh-daily-015',
    text: '我不明白。',
    japanese: 'わかりません。',
    pinyin: 'wǒ bù míng bai',
    scene: '理解できない時',
    kana: 'ウォ ブー ミン バイ',
  },
  {
    id: 'zh-daily-016',
    text: '请再说一遍。',
    japanese: 'もう一度言ってください。',
    pinyin: 'qǐng zài shuō yí biàn',
    scene: '聞き返す',
    kana: 'チン ザイ シュオ イー ビエン',
  },
  {
    id: 'zh-daily-017',
    text: '请慢一点。',
    japanese: '少しゆっくりお願いします。',
    pinyin: 'qǐng màn yì diǎn',
    scene: 'ゆっくり話してほしい時',
    kana: 'チン マン イー ディエン',
  },
  {
    id: 'zh-daily-018',
    text: '这个多少钱？',
    japanese: 'これはいくらですか？',
    pinyin: 'zhè ge duō shao qián',
    scene: '値段を聞く',
    kana: 'ジョー ガ ドゥオ シャオ チエン',
  },
  {
    id: 'zh-daily-019',
    text: '我要这个。',
    japanese: 'これをください。',
    pinyin: 'wǒ yào zhè ge',
    scene: '買い物や注文をする',
    kana: 'ウォ ヤオ ジョー ガ',
  },
  {
    id: 'zh-daily-020',
    text: '不要袋子。',
    japanese: '袋はいりません。',
    pinyin: 'bú yào dài zi',
    scene: '買い物で袋を断る',
    kana: 'ブー ヤオ ダイ ズ',
  },
  {
    id: 'zh-daily-021',
    text: '请给我水。',
    japanese: '水をください。',
    pinyin: 'qǐng gěi wǒ shuǐ',
    scene: '飲み物をお願いする',
    kana: 'チン ゲイ ウォ シュイ',
  },
  {
    id: 'zh-daily-022',
    text: '我想喝咖啡。',
    japanese: 'コーヒーを飲みたいです。',
    pinyin: 'wǒ xiǎng hē kā fēi',
    scene: '飲みたいものを伝える',
    kana: 'ウォ シアン フー カー フェイ',
  },
  {
    id: 'zh-daily-023',
    text: '这里有Wi-Fi吗？',
    japanese: 'ここにWi-Fiはありますか？',
    pinyin: 'zhè lǐ yǒu Wi-Fi ma',
    scene: 'Wi-Fiを聞く',
    kana: 'ジョー リー ヨウ ワイファイ マ',
  },
  {
    id: 'zh-daily-024',
    text: '洗手间在哪里？',
    japanese: 'トイレはどこですか？',
    pinyin: 'xǐ shǒu jiān zài nǎ lǐ',
    scene: '場所を聞く',
    kana: 'シー ショウ ジエン ザイ ナー リー',
  },
  {
    id: 'zh-daily-025',
    text: '请帮我一下。',
    japanese: '少し手伝ってください。',
    pinyin: 'qǐng bāng wǒ yí xià',
    scene: '助けをお願いする',
    kana: 'チン バン ウォ イー シア',
  },
  {
    id: 'zh-daily-026',
    text: '没问题。',
    japanese: '問題ありません。',
    pinyin: 'méi wèn tí',
    scene: '了承する',
    kana: 'メイ ウェン ティー',
  },
  {
    id: 'zh-daily-027',
    text: '今天很热。',
    japanese: '今日は暑いです。',
    pinyin: 'jīn tiān hěn rè',
    scene: '天気の話をする',
    kana: 'ジン ティエン ヘン ルー',
  },
  {
    id: 'zh-daily-028',
    text: '今天有点冷。',
    japanese: '今日は少し寒いです。',
    pinyin: 'jīn tiān yǒu diǎn lěng',
    scene: '天気の話をする',
    kana: 'ジン ティエン ヨウ ディエン ラン',
  },
  {
    id: 'zh-daily-029',
    text: '我们走吧。',
    japanese: '行きましょう。',
    pinyin: 'wǒ men zǒu ba',
    scene: '一緒に出発する',
    kana: 'ウォ メン ゾウ バ',
  },
  {
    id: 'zh-daily-030',
    text: '明天见。',
    japanese: 'また明日。',
    pinyin: 'míng tiān jiàn',
    scene: '明日また会う時',
    kana: 'ミン ティエン ジエン',
  },
];

const buildChoices = (phrase: ChinesePhraseSeed, index: number): string[] => {
  const wrongChoices: string[] = [];

  for (let offset = 1; wrongChoices.length < 3 && offset < chinesePhraseSeeds.length; offset += 1) {
    const candidate = chinesePhraseSeeds[(index + offset * 7) % chinesePhraseSeeds.length].text;

    if (candidate !== phrase.text && !wrongChoices.includes(candidate)) {
      wrongChoices.push(candidate);
    }
  }

  return [phrase.text, ...wrongChoices].sort((first, second) => {
    return (first.length + index) - (second.length + index);
  });
};

export const CHINESE_PHRASES: Phrase[] = chinesePhraseSeeds.map((phrase, index) => ({
  ...phrase,
  language: 'chinese',
  category: 'daily',
  spotId: 'home',
  english: phrase.text,
  choices: buildChoices(phrase, index),
}));
