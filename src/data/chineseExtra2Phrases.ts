import type { Phrase, PhraseDifficulty } from '../types/phrase';

type ChineseExtra2PhraseSeed = Omit<Phrase, 'language' | 'english' | 'choices'> & {
  difficulty: PhraseDifficulty;
};

const stableShuffle = <T,>(items: T[], seed: number): T[] => {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = (seed + index * 17) % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
};

const buildChoices = (
  phrase: ChineseExtra2PhraseSeed,
  index: number,
  allPhrases: ChineseExtra2PhraseSeed[]
): string[] => {
  const sameCategoryChoices = allPhrases
    .filter((item) => item.category === phrase.category && item.id !== phrase.id)
    .map((item) => item.text);
  const fallbackChoices = allPhrases
    .filter((item) => item.id !== phrase.id)
    .map((item) => item.text);
  const pool = sameCategoryChoices.length >= 3 ? sameCategoryChoices : fallbackChoices;
  const wrongChoices: string[] = [];
  const start = (phrase.text.length + index * 7) % pool.length;

  for (let offset = 0; wrongChoices.length < 3 && offset < pool.length; offset += 1) {
    const candidate = pool[(start + offset * 5) % pool.length];

    if (candidate !== phrase.text && !wrongChoices.includes(candidate)) {
      wrongChoices.push(candidate);
    }
  }

  return stableShuffle([phrase.text, ...wrongChoices], phrase.id.length + phrase.text.length);
};

const chineseExtra2PhraseSeeds: ChineseExtra2PhraseSeed[] = [
  { id: 'zh-extra2-001', text: '大家好。', pinyin: 'dà jiā hǎo', japanese: 'みなさん、こんにちは。', kana: 'ダー ジャー ハオ', scene: '複数人にあいさつする', category: 'greeting', spotId: 'home', difficulty: 'easy' },
  { id: 'zh-extra2-002', text: '下午好。', pinyin: 'xià wǔ hǎo', japanese: 'こんにちは。', kana: 'シア ウー ハオ', scene: '午後のあいさつ', category: 'greeting', spotId: 'home', difficulty: 'easy' },
  { id: 'zh-extra2-003', text: '晚安。', pinyin: 'wǎn ān', japanese: 'おやすみなさい。', kana: 'ワン アン', scene: '夜の別れのあいさつ', category: 'greeting', spotId: 'home', difficulty: 'easy' },
  { id: 'zh-extra2-004', text: '明天再见。', pinyin: 'míng tiān zài jiàn', japanese: 'また明日会いましょう。', kana: 'ミン ティエン ザイ ジエン', scene: '明日また会う時', category: 'greeting', spotId: 'home', difficulty: 'easy' },
  { id: 'zh-extra2-005', text: '一会儿见。', pinyin: 'yí huìr jiàn', japanese: 'またあとで。', kana: 'イー ホイ アール ジエン', scene: '軽い別れのあいさつ', category: 'greeting', spotId: 'home', difficulty: 'easy' },
  { id: 'zh-extra2-006', text: '你可以叫我{userName}。', pinyin: 'nǐ kě yǐ jiào wǒ {userName}', japanese: '{userName}と呼んでください。', kana: 'ニー クー イー ジャオ ウォ {userName}', scene: '自分の名前を伝える', category: 'self_intro', spotId: 'home', difficulty: 'easy' },
  { id: 'zh-extra2-007', text: '我从日本来。', pinyin: 'wǒ cóng rì běn lái', japanese: '日本から来ました。', kana: 'ウォ ツォン リー ベン ライ', scene: '出身を伝える', category: 'self_intro', spotId: 'home', difficulty: 'easy' },
  { id: 'zh-extra2-008', text: '我住在附近。', pinyin: 'wǒ zhù zài fù jìn', japanese: '近くに住んでいます。', kana: 'ウォ ジュー ザイ フー ジン', scene: '住んでいる場所を伝える', category: 'self_intro', spotId: 'home', difficulty: 'easy' },
  { id: 'zh-extra2-009', text: '我喜欢音乐。', pinyin: 'wǒ xǐ huan yīn yuè', japanese: '音楽が好きです。', kana: 'ウォ シー ファン イン ユエ', scene: '好きなことを話す', category: 'self_intro', spotId: 'home', difficulty: 'easy' },
  { id: 'zh-extra2-010', text: '我有一只狗。', pinyin: 'wǒ yǒu yì zhī gǒu', japanese: '犬を飼っています。', kana: 'ウォ ヨウ イー ジー ゴウ', scene: '自分のことを話す', category: 'self_intro', spotId: 'home', difficulty: 'easy' },
  { id: 'zh-extra2-011', text: '是的。', pinyin: 'shì de', japanese: 'はい、そうです。', kana: 'シー ダ', scene: '肯定する', category: 'daily', spotId: 'home', difficulty: 'easy' },
  { id: 'zh-extra2-012', text: '不用了，谢谢。', pinyin: 'bú yòng le, xiè xie', japanese: '結構です、ありがとうございます。', kana: 'ブー ヨン ラ シエ シエ', scene: 'ていねいに断る', category: 'daily', spotId: 'restaurant', difficulty: 'easy' },
  { id: 'zh-extra2-013', text: '我还不错。', pinyin: 'wǒ hái bú cuò', japanese: 'まあまあ元気です。', kana: 'ウォ ハイ ブー ツオ', scene: '調子を答える', category: 'feelings', spotId: 'home', difficulty: 'easy' },
  { id: 'zh-extra2-014', text: '我很开心。', pinyin: 'wǒ hěn kāi xīn', japanese: 'うれしいです。', kana: 'ウォ ヘン カイ シン', scene: 'うれしい気持ちを伝える', category: 'feelings', spotId: 'park', difficulty: 'easy' },
  { id: 'zh-extra2-015', text: '我有点困。', pinyin: 'wǒ yǒu diǎn kùn', japanese: '少し眠いです。', kana: 'ウォ ヨウ ディエン クン', scene: '眠気を伝える', category: 'feelings', spotId: 'home', difficulty: 'easy' },
  { id: 'zh-extra2-016', text: '我有点冷。', pinyin: 'wǒ yǒu diǎn lěng', japanese: '少し寒いです。', kana: 'ウォ ヨウ ディエン ラン', scene: '寒さを伝える', category: 'feelings', spotId: 'park', difficulty: 'easy' },
  { id: 'zh-extra2-017', text: '我有点热。', pinyin: 'wǒ yǒu diǎn rè', japanese: '少し暑いです。', kana: 'ウォ ヨウ ディエン ルー', scene: '暑さを伝える', category: 'feelings', spotId: 'park', difficulty: 'easy' },
  { id: 'zh-extra2-018', text: '我很忙。', pinyin: 'wǒ hěn máng', japanese: '忙しいです。', kana: 'ウォ ヘン マン', scene: '忙しさを伝える', category: 'daily', spotId: 'office', difficulty: 'easy' },
  { id: 'zh-extra2-019', text: '我现在方便。', pinyin: 'wǒ xiàn zài fāng biàn', japanese: '今なら大丈夫です。', kana: 'ウォ シエン ザイ ファン ビエン', scene: '都合がよいと伝える', category: 'daily', spotId: 'home', difficulty: 'easy' },
  { id: 'zh-extra2-020', text: '真好。', pinyin: 'zhēn hǎo', japanese: 'いいですね。', kana: 'ジェン ハオ', scene: '相手の話に反応する', category: 'small_talk', spotId: 'park', difficulty: 'easy' },
  { id: 'zh-extra2-021', text: '真的吗？', pinyin: 'zhēn de ma', japanese: '本当ですか？', kana: 'ジェン ダ マ', scene: '驚いて聞き返す', category: 'small_talk', spotId: 'park', difficulty: 'easy' },
  { id: 'zh-extra2-022', text: '我懂了。', pinyin: 'wǒ dǒng le', japanese: '分かりました。', kana: 'ウォ ドン ラ', scene: '理解した時に言う', category: 'daily', spotId: 'office', difficulty: 'easy' },
  { id: 'zh-extra2-023', text: '我也是。', pinyin: 'wǒ yě shì', japanese: '私もです。', kana: 'ウォ イエ シー', scene: '同じ気持ちを伝える', category: 'small_talk', spotId: 'home', difficulty: 'easy' },
  { id: 'zh-extra2-024', text: '再说一遍，好吗？', pinyin: 'zài shuō yí biàn, hǎo ma', japanese: 'もう一度言ってもらえますか？', kana: 'ザイ シュオ イー ビエン ハオ マ', scene: '聞き返す', category: 'request', spotId: 'home', difficulty: 'easy' },
  { id: 'zh-extra2-025', text: '请说慢一点。', pinyin: 'qǐng shuō màn yì diǎn', japanese: 'ゆっくり話してください。', kana: 'チン シュオ マン イー ディエン', scene: 'ゆっくり話してほしい時', category: 'request', spotId: 'station', difficulty: 'easy' },
  { id: 'zh-extra2-026', text: '我想要这个。', pinyin: 'wǒ xiǎng yào zhè ge', japanese: 'これがほしいです。', kana: 'ウォ シアン ヤオ ジョー ガ', scene: '商品を選ぶ', category: 'shopping', spotId: 'convenience_store', difficulty: 'easy' },
  { id: 'zh-extra2-027', text: '给您。', pinyin: 'gěi nín', japanese: 'どうぞ。', kana: 'ゲイ ニン', scene: '物を渡す', category: 'daily', spotId: 'convenience_store', difficulty: 'easy' },
  { id: 'zh-extra2-028', text: '没事。', pinyin: 'méi shì', japanese: '大丈夫です。', kana: 'メイ シー', scene: '相手を安心させる', category: 'thanks_apology', spotId: 'home', difficulty: 'easy' },
  { id: 'zh-extra2-029', text: '太感谢你了。', pinyin: 'tài gǎn xiè nǐ le', japanese: '本当にありがとうございます。', kana: 'タイ ガン シエ ニー ラ', scene: '感謝する', category: 'thanks_apology', spotId: 'home', difficulty: 'easy' },
  { id: 'zh-extra2-030', text: '请帮帮我。', pinyin: 'qǐng bāng bang wǒ', japanese: '助けてください。', kana: 'チン バン バン ウォ', scene: '困った時に助けを求める', category: 'emergency', spotId: 'station', difficulty: 'easy' },
  { id: 'zh-extra2-031', text: '你最近好吗？', pinyin: 'nǐ zuì jìn hǎo ma', japanese: '最近元気ですか？', kana: 'ニー ズイ ジン ハオ マ', scene: '近況を聞く', category: 'greeting', spotId: 'home', difficulty: 'normal' },
  { id: 'zh-extra2-032', text: '很久没见了。', pinyin: 'hěn jiǔ méi jiàn le', japanese: '久しぶりですね。', kana: 'ヘン ジョウ メイ ジエン ラ', scene: '久しぶりに会う', category: 'greeting', spotId: 'home', difficulty: 'normal' },
  { id: 'zh-extra2-033', text: '请稍等一下。', pinyin: 'qǐng shāo děng yí xià', japanese: '少々お待ちください。', kana: 'チン シャオ ドン イー シア', scene: '少し待ってもらう', category: 'request', spotId: 'office', difficulty: 'normal' },
  { id: 'zh-extra2-034', text: '我等一下联系你。', pinyin: 'wǒ děng yí xià lián xì nǐ', japanese: '後で連絡します。', kana: 'ウォ ドン イー シア リエン シー ニー', scene: '後で連絡すると伝える', category: 'daily', spotId: 'office', difficulty: 'normal' },
  { id: 'zh-extra2-035', text: '我可以和你一起吗？', pinyin: 'wǒ kě yǐ hé nǐ yì qǐ ma', japanese: '一緒にいてもいいですか？', kana: 'ウォ クー イー フー ニー イー チー マ', scene: '相手に加わりたい時', category: 'small_talk', spotId: 'cafe', difficulty: 'normal' },
  { id: 'zh-extra2-036', text: '你常来这里吗？', pinyin: 'nǐ cháng lái zhè lǐ ma', japanese: 'ここによく来ますか？', kana: 'ニー チャン ライ ジョー リー マ', scene: '雑談で聞く', category: 'small_talk', spotId: 'park', difficulty: 'normal' },
  { id: 'zh-extra2-037', text: '天气变得真快。', pinyin: 'tiān qì biàn de zhēn kuài', japanese: '天気が変わるのが早いですね。', kana: 'ティエン チー ビエン ダ ジェン クアイ', scene: '天気の雑談', category: 'small_talk', spotId: 'park', difficulty: 'normal' },
  { id: 'zh-extra2-038', text: '这里有点挤。', pinyin: 'zhè lǐ yǒu diǎn jǐ', japanese: 'ここは少し混んでいます。', kana: 'ジョー リー ヨウ ディエン ジー', scene: '混雑について話す', category: 'small_talk', spotId: 'station', difficulty: 'normal' },
  { id: 'zh-extra2-039', text: '我现在好多了。', pinyin: 'wǒ xiàn zài hǎo duō le', japanese: '今はだいぶ良くなりました。', kana: 'ウォ シエン ザイ ハオ ドゥオ ラ', scene: '体調が良くなった時', category: 'feelings', spotId: 'home', difficulty: 'normal' },
  { id: 'zh-extra2-040', text: '我头疼。', pinyin: 'wǒ tóu téng', japanese: '頭が痛いです。', kana: 'ウォ トウ トン', scene: '体調不良を伝える', category: 'feelings', spotId: 'hotel', difficulty: 'normal' },
  { id: 'zh-extra2-041', text: '我肚子疼。', pinyin: 'wǒ dù zi téng', japanese: 'お腹が痛いです。', kana: 'ウォ ドゥ ズ トン', scene: '体調不良を伝える', category: 'feelings', spotId: 'hotel', difficulty: 'normal' },
  { id: 'zh-extra2-042', text: '我想坐一会儿。', pinyin: 'wǒ xiǎng zuò yí huìr', japanese: '少し座りたいです。', kana: 'ウォ シアン ズオ イー ホイ アール', scene: '疲れた時', category: 'feelings', spotId: 'hotel', difficulty: 'normal' },
  { id: 'zh-extra2-043', text: '可以写下来吗？', pinyin: 'kě yǐ xiě xià lái ma', japanese: '書いてもらえますか？', kana: 'クー イー シエ シア ライ マ', scene: '聞き取りにくい時', category: 'request', spotId: 'station', difficulty: 'normal' },
  { id: 'zh-extra2-044', text: '能给我看看吗？', pinyin: 'néng gěi wǒ kàn kan ma', japanese: '見せてもらえますか？', kana: 'ノン ゲイ ウォ カン カン マ', scene: '商品を見たい時', category: 'shopping', spotId: 'convenience_store', difficulty: 'normal' },
  { id: 'zh-extra2-045', text: '有什么推荐？', pinyin: 'yǒu shén me tuī jiàn', japanese: 'おすすめは何ですか？', kana: 'ヨウ シェン マ トゥイ ジエン', scene: 'おすすめを聞く', category: 'restaurant', spotId: 'restaurant', difficulty: 'normal' },
  { id: 'zh-extra2-046', text: '有小一点的吗？', pinyin: 'yǒu xiǎo yì diǎn de ma', japanese: 'もう少し小さいものはありますか？', kana: 'ヨウ シャオ イー ディエン ダ マ', scene: 'サイズを聞く', category: 'shopping', spotId: 'convenience_store', difficulty: 'normal' },
  { id: 'zh-extra2-047', text: '外面有座位吗？', pinyin: 'wài miàn yǒu zuò wèi ma', japanese: '外の席はありますか？', kana: 'ワイ ミエン ヨウ ズオ ウェイ マ', scene: 'カフェで席を聞く', category: 'cafe', spotId: 'cafe', difficulty: 'normal' },
  { id: 'zh-extra2-048', text: '少放糖。', pinyin: 'shǎo fàng táng', japanese: '砂糖を少なめにしてください。', kana: 'シャオ ファン タン', scene: '飲み物を注文する', category: 'cafe', spotId: 'cafe', difficulty: 'normal' },
  { id: 'zh-extra2-049', text: '我要一样的。', pinyin: 'wǒ yào yí yàng de', japanese: '同じものをください。', kana: 'ウォ ヤオ イー ヤン ダ', scene: '追加注文する', category: 'cafe', spotId: 'cafe', difficulty: 'normal' },
  { id: 'zh-extra2-050', text: '这是我点的。', pinyin: 'zhè shì wǒ diǎn de', japanese: 'これは私が注文したものです。', kana: 'ジョー シー ウォ ディエン ダ', scene: '注文内容を伝える', category: 'restaurant', spotId: 'restaurant', difficulty: 'normal' },
  { id: 'zh-extra2-051', text: '这不是我点的。', pinyin: 'zhè bú shì wǒ diǎn de', japanese: 'これは私の注文ではありません。', kana: 'ジョー ブー シー ウォ ディエン ダ', scene: '注文違いを伝える', category: 'restaurant', spotId: 'restaurant', difficulty: 'normal' },
  { id: 'zh-extra2-052', text: '可以坐窗边吗？', pinyin: 'kě yǐ zuò chuāng biān ma', japanese: '窓側に座れますか？', kana: 'クー イー ズオ チュアン ビエン マ', scene: '席の希望を伝える', category: 'restaurant', spotId: 'restaurant', difficulty: 'normal' },
  { id: 'zh-extra2-053', text: '服务费包括在内吗？', pinyin: 'fú wù fèi bāo kuò zài nèi ma', japanese: 'サービス料は含まれていますか？', kana: 'フー ウー フェイ バオ クオ ザイ ネイ マ', scene: '会計前に確認する', category: 'restaurant', spotId: 'restaurant', difficulty: 'normal' },
  { id: 'zh-extra2-054', text: '出口怎么走？', pinyin: 'chū kǒu zěn me zǒu', japanese: '出口はどう行きますか？', kana: 'チュー コウ ゼン マ ゾウ', scene: '出口を探す', category: 'direction', spotId: 'station', difficulty: 'normal' },
  { id: 'zh-extra2-055', text: '还有几站？', pinyin: 'hái yǒu jǐ zhàn', japanese: 'あと何駅ですか？', kana: 'ハイ ヨウ ジー ジャン', scene: '電車やバスで聞く', category: 'direction', spotId: 'station', difficulty: 'normal' },
  { id: 'zh-extra2-056', text: '这辆公交车去市中心吗？', pinyin: 'zhè liàng gōng jiāo chē qù shì zhōng xīn ma', japanese: 'このバスは中心街へ行きますか？', kana: 'ジョー リャン ゴン ジャオ チュー チュー シー ジョン シン マ', scene: '移動中に確認する', category: 'travel', spotId: 'station', difficulty: 'normal' },
  { id: 'zh-extra2-057', text: '到了请告诉我。', pinyin: 'dào le qǐng gào su wǒ', japanese: '着いたら教えてください。', kana: 'ダオ ラ チン ガオ ス ウォ', scene: '降りる場所を教えてもらう', category: 'travel', spotId: 'station', difficulty: 'normal' },
  { id: 'zh-extra2-058', text: '我想买一日票。', pinyin: 'wǒ xiǎng mǎi yí rì piào', japanese: '一日券を買いたいです。', kana: 'ウォ シアン マイ イー リー ピャオ', scene: '交通チケットを買う', category: 'travel', spotId: 'station', difficulty: 'normal' },
  { id: 'zh-extra2-059', text: '我在找三号门。', pinyin: 'wǒ zài zhǎo sān hào mén', japanese: '3番ゲートを探しています。', kana: 'ウォ ザイ ジャオ サン ハオ メン', scene: '駅や空港で探す', category: 'travel', spotId: 'station', difficulty: 'normal' },
  { id: 'zh-extra2-060', text: '附近有便利店吗？', pinyin: 'fù jìn yǒu biàn lì diàn ma', japanese: '近くにコンビニはありますか？', kana: 'フー ジン ヨウ ビエン リー ディエン マ', scene: '近くのお店を聞く', category: 'shopping', spotId: 'convenience_store', difficulty: 'normal' },
  { id: 'zh-extra2-061', text: '这里卖电池吗？', pinyin: 'zhè lǐ mài diàn chí ma', japanese: 'ここで電池は売っていますか？', kana: 'ジョー リー マイ ディエン チー マ', scene: '商品があるか聞く', category: 'shopping', spotId: 'convenience_store', difficulty: 'normal' },
  { id: 'zh-extra2-062', text: '可以退货吗？', pinyin: 'kě yǐ tuì huò ma', japanese: '返品できますか？', kana: 'クー イー トゥイ フオ マ', scene: '返品したい時', category: 'shopping', spotId: 'convenience_store', difficulty: 'normal' },
  { id: 'zh-extra2-063', text: '我先看看。', pinyin: 'wǒ xiān kàn kan', japanese: '先に見てみます。', kana: 'ウォ シエン カン カン', scene: '買い物中に声をかけられた時', category: 'shopping', spotId: 'convenience_store', difficulty: 'normal' },
  { id: 'zh-extra2-064', text: '可以试穿吗？', pinyin: 'kě yǐ shì chuān ma', japanese: '試着できますか？', kana: 'クー イー シー チュアン マ', scene: '服を試着したい時', category: 'shopping', spotId: 'convenience_store', difficulty: 'normal' },
  { id: 'zh-extra2-065', text: '有别的颜色吗？', pinyin: 'yǒu bié de yán sè ma', japanese: '別の色はありますか？', kana: 'ヨウ ビエ ダ イェン スー マ', scene: '色違いを聞く', category: 'shopping', spotId: 'convenience_store', difficulty: 'normal' },
  { id: 'zh-extra2-066', text: '我有预订，名字是{userName}。', pinyin: 'wǒ yǒu yù dìng, míng zi shì {userName}', japanese: '{userName}の名前で予約しています。', kana: 'ウォ ヨウ ユー ディン ミン ズ シー {userName}', scene: 'ホテルで予約名を伝える', category: 'hotel', spotId: 'hotel', difficulty: 'normal' },
  { id: 'zh-extra2-067', text: '可以把行李放这里吗？', pinyin: 'kě yǐ bǎ xíng li fàng zhè lǐ ma', japanese: '荷物をここに置いてもいいですか？', kana: 'クー イー バー シン リ ファン ジョー リー マ', scene: 'ホテルで荷物を置きたい時', category: 'hotel', spotId: 'hotel', difficulty: 'normal' },
  { id: 'zh-extra2-068', text: '空调好像坏了。', pinyin: 'kōng tiáo hǎo xiàng huài le', japanese: 'エアコンが壊れているみたいです。', kana: 'コン ティアオ ハオ シアン ホワイ ラ', scene: 'ホテルで設備の不調を伝える', category: 'hotel', spotId: 'hotel', difficulty: 'normal' },
  { id: 'zh-extra2-069', text: '可以换房间吗？', pinyin: 'kě yǐ huàn fáng jiān ma', japanese: '部屋を変えられますか？', kana: 'クー イー ホワン ファン ジエン マ', scene: 'ホテルで部屋変更をお願いする', category: 'hotel', spotId: 'hotel', difficulty: 'normal' },
  { id: 'zh-extra2-070', text: '早餐在哪里吃？', pinyin: 'zǎo cān zài nǎ lǐ chī', japanese: '朝食はどこで食べますか？', kana: 'ザオ ツァン ザイ ナー リー チー', scene: 'ホテルで朝食場所を聞く', category: 'hotel', spotId: 'hotel', difficulty: 'normal' },
  { id: 'zh-extra2-071', text: '我需要看医生。', pinyin: 'wǒ xū yào kàn yī shēng', japanese: '医者に診てもらいたいです。', kana: 'ウォ シュー ヤオ カン イー ション', scene: '体調が悪い時', category: 'emergency', spotId: 'hotel', difficulty: 'normal' },
  { id: 'zh-extra2-072', text: '我的手机丢了。', pinyin: 'wǒ de shǒu jī diū le', japanese: '携帯をなくしました。', kana: 'ウォ ダ ショウ ジー ディウ ラ', scene: '紛失を伝える', category: 'emergency', spotId: 'station', difficulty: 'normal' },
  { id: 'zh-extra2-073', text: '我的钱包不见了。', pinyin: 'wǒ de qián bāo bú jiàn le', japanese: '財布が見つかりません。', kana: 'ウォ ダ チエン バオ ブー ジエン ラ', scene: '紛失を伝える', category: 'emergency', spotId: 'station', difficulty: 'normal' },
  { id: 'zh-extra2-074', text: '能帮我找一下吗？', pinyin: 'néng bāng wǒ zhǎo yí xià ma', japanese: '探すのを手伝ってもらえますか？', kana: 'ノン バン ウォ ジャオ イー シア マ', scene: '探し物を手伝ってもらう', category: 'emergency', spotId: 'station', difficulty: 'normal' },
  { id: 'zh-extra2-075', text: '我不太舒服。', pinyin: 'wǒ bú tài shū fu', japanese: '体調があまりよくありません。', kana: 'ウォ ブー タイ シュー フ', scene: '体調不良を伝える', category: 'emergency', spotId: 'home', difficulty: 'normal' },
  { id: 'zh-extra2-076', text: '我还在学习，请说慢一点。', pinyin: 'wǒ hái zài xué xí, qǐng shuō màn yì diǎn', japanese: 'まだ学習中なので、ゆっくり話してください。', kana: 'ウォ ハイ ザイ シュエ シー チン シュオ マン イー ディエン', scene: '会話の前にお願いする', category: 'request', spotId: 'home', difficulty: 'challenge' },
  { id: 'zh-extra2-077', text: '能帮我选一个简单的吗？', pinyin: 'néng bāng wǒ xuǎn yí ge jiǎn dān de ma', japanese: '簡単なものを選ぶのを手伝ってもらえますか？', kana: 'ノン バン ウォ シュエン イー ガ ジエン ダン ダ マ', scene: '買い物や注文で迷った時', category: 'shopping', spotId: 'cafe', difficulty: 'challenge' },
  { id: 'zh-extra2-078', text: '我想要不太甜的。', pinyin: 'wǒ xiǎng yào bú tài tián de', japanese: '甘すぎないものがいいです。', kana: 'ウォ シアン ヤオ ブー タイ ティエン ダ', scene: 'カフェで好みを伝える', category: 'cafe', spotId: 'cafe', difficulty: 'challenge' },
  { id: 'zh-extra2-079', text: '可以分开结账吗？', pinyin: 'kě yǐ fēn kāi jié zhàng ma', japanese: 'お会計を分けられますか？', kana: 'クー イー フェン カイ ジエ ジャン マ', scene: '食事の会計でお願いする', category: 'restaurant', spotId: 'restaurant', difficulty: 'challenge' },
  { id: 'zh-extra2-080', text: '我觉得我们坐错车了。', pinyin: 'wǒ jué de wǒ men zuò cuò chē le', japanese: '違う乗り物に乗ったと思います。', kana: 'ウォ ジュエ ダ ウォ メン ズオ ツオ チュー ラ', scene: '移動中に間違いに気づく', category: 'direction', spotId: 'station', difficulty: 'challenge' },
  { id: 'zh-extra2-081', text: '能在地图上指给我看吗？', pinyin: 'néng zài dì tú shang zhǐ gěi wǒ kàn ma', japanese: '地図で指して見せてもらえますか？', kana: 'ノン ザイ ディー トゥー シャン ジー ゲイ ウォ カン マ', scene: '場所を地図で確認する', category: 'direction', spotId: 'station', difficulty: 'challenge' },
  { id: 'zh-extra2-082', text: '我想找个安静的座位。', pinyin: 'wǒ xiǎng zhǎo ge ān jìng de zuò wèi', japanese: '静かな席を探しています。', kana: 'ウォ シアン ジャオ ガ アン ジン ダ ズオ ウェイ', scene: 'カフェや施設で席を探す', category: 'cafe', spotId: 'cafe', difficulty: 'challenge' },
  { id: 'zh-extra2-083', text: '不好意思，我没听懂。', pinyin: 'bù hǎo yì si, wǒ méi tīng dǒng', japanese: 'すみません、聞き取れませんでした。', kana: 'ブー ハオ イー ス ウォ メイ ティン ドン', scene: '聞き返す', category: 'thanks_apology', spotId: 'office', difficulty: 'challenge' },
  { id: 'zh-extra2-084', text: '能再解释一遍吗？', pinyin: 'néng zài jiě shì yí biàn ma', japanese: 'もう一度説明してもらえますか？', kana: 'ノン ザイ ジエ シー イー ビエン マ', scene: '説明をもう一度お願いする', category: 'request', spotId: 'office', difficulty: 'challenge' },
  { id: 'zh-extra2-085', text: '我等会儿有事，但可以待一会儿。', pinyin: 'wǒ děng huìr yǒu shì, dàn kě yǐ dāi yí huìr', japanese: '後で予定がありますが、少しならいられます。', kana: 'ウォ ドン ホアル ヨウ シー ダン クー イー ダイ イー ホアル', scene: '予定を伝えながら話す', category: 'daily', spotId: 'cafe', difficulty: 'challenge' },
  { id: 'zh-extra2-086', text: '我有点紧张，但想试试。', pinyin: 'wǒ yǒu diǎn jǐn zhāng, dàn xiǎng shì shi', japanese: '少し緊張していますが、試してみたいです。', kana: 'ウォ ヨウ ディエン ジン ジャン ダン シアン シー シー', scene: '挑戦したい気持ちを伝える', category: 'feelings', spotId: 'home', difficulty: 'challenge' },
  { id: 'zh-extra2-087', text: '这比我想的难一点。', pinyin: 'zhè bǐ wǒ xiǎng de nán yì diǎn', japanese: '思ったより少し難しいです。', kana: 'ジョー ビー ウォ シアン ダ ナン イー ディエン', scene: '感想を伝える', category: 'feelings', spotId: 'home', difficulty: 'challenge' },
  { id: 'zh-extra2-088', text: '我今天来这里很高兴。', pinyin: 'wǒ jīn tiān lái zhè lǐ hěn gāo xìng', japanese: '今日ここに来られてうれしいです。', kana: 'ウォ ジン ティエン ライ ジョー リー ヘン ガオ シン', scene: '楽しい気持ちを伝える', category: 'small_talk', spotId: 'park', difficulty: 'challenge' },
  { id: 'zh-extra2-089', text: '附近有不错的地方吗？', pinyin: 'fù jìn yǒu bú cuò de dì fang ma', japanese: '近くに良い場所はありますか？', kana: 'フー ジン ヨウ ブー ツオ ダ ディー ファン マ', scene: 'おすすめの場所を聞く', category: 'travel', spotId: 'station', difficulty: 'challenge' },
  { id: 'zh-extra2-090', text: '如果我迷路了，我会给你打电话。', pinyin: 'rú guǒ wǒ mí lù le, wǒ huì gěi nǐ dǎ diàn huà', japanese: '迷ったらあなたに電話します。', kana: 'ルー グオ ウォ ミー ルー ラ ウォ ホイ ゲイ ニー ダー ディエン ホア', scene: '移動前に伝える', category: 'emergency', spotId: 'station', difficulty: 'challenge' },
];

export const CHINESE_EXTRA2_PHRASES: Phrase[] = chineseExtra2PhraseSeeds.map((phrase, index, allPhrases) => ({
  ...phrase,
  language: 'chinese',
  english: phrase.text,
  choices: buildChoices(phrase, index, allPhrases),
}));
