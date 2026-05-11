import type { Phrase, PhraseDifficulty } from '../types/phrase';

type EnglishExtraPhraseSeed = Omit<Phrase, 'language' | 'text' | 'pinyin' | 'choices'> & {
  difficulty: PhraseDifficulty;
};

const stableShuffle = <T,>(items: T[], seed: number): T[] => {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = (seed + index * 13) % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
};

const buildChoices = (
  phrase: EnglishExtraPhraseSeed,
  index: number,
  allPhrases: EnglishExtraPhraseSeed[]
): string[] => {
  const sameCategoryChoices = allPhrases
    .filter((item) => item.category === phrase.category && item.id !== phrase.id)
    .map((item) => item.english);
  const fallbackChoices = allPhrases
    .filter((item) => item.id !== phrase.id)
    .map((item) => item.english);
  const pool = sameCategoryChoices.length >= 3 ? sameCategoryChoices : fallbackChoices;
  const wrongChoices: string[] = [];
  const start = (phrase.english.length + index * 7) % pool.length;

  for (let offset = 0; wrongChoices.length < 3 && offset < pool.length; offset += 1) {
    const candidate = pool[(start + offset * 5) % pool.length];

    if (candidate !== phrase.english && !wrongChoices.includes(candidate)) {
      wrongChoices.push(candidate);
    }
  }

  return stableShuffle([phrase.english, ...wrongChoices], phrase.id.length + phrase.english.length);
};

const englishExtraPhraseSeeds: EnglishExtraPhraseSeed[] = [
  { id: 'en-extra-001', english: 'Hello there.', japanese: 'こんにちは。', kana: 'ハロー ゼア', scene: '気軽にあいさつする', category: 'greeting', spotId: 'home', difficulty: 'easy' },
  { id: 'en-extra-002', english: 'Good evening.', japanese: 'こんばんは。', kana: 'グッド イーブニング', scene: '夜のあいさつ', category: 'greeting', spotId: 'home', difficulty: 'easy' },
  { id: 'en-extra-003', english: 'Good night.', japanese: 'おやすみなさい。', kana: 'グッド ナイト', scene: '寝る前や別れ際', category: 'greeting', spotId: 'home', difficulty: 'easy' },
  { id: 'en-extra-004', english: 'See you soon.', japanese: 'またすぐ会いましょう。', kana: 'シー ユー スーン', scene: '近いうちに会う相手へ', category: 'greeting', spotId: 'home', difficulty: 'easy' },
  { id: 'en-extra-005', english: 'Take care.', japanese: '気をつけてね。', kana: 'テイク ケア', scene: '別れ際にやさしく言う', category: 'greeting', spotId: 'home', difficulty: 'easy' },
  { id: 'en-extra-006', english: "I'm {userName}.", japanese: '私は{userName}です。', kana: 'アイム {userName}', scene: '自分の名前を伝える', category: 'self_intro', spotId: 'home', difficulty: 'easy' },
  { id: 'en-extra-007', english: "I'm from Japan.", japanese: '日本から来ました。', kana: 'アイム フロム ジャパン', scene: '出身を伝える', category: 'self_intro', spotId: 'home', difficulty: 'easy' },
  { id: 'en-extra-008', english: 'I live nearby.', japanese: '近くに住んでいます。', kana: 'アイ リブ ニアバイ', scene: '住んでいる場所を簡単に伝える', category: 'self_intro', spotId: 'home', difficulty: 'easy' },
  { id: 'en-extra-009', english: 'I like music.', japanese: '音楽が好きです。', kana: 'アイ ライク ミュージック', scene: '好きなことを話す', category: 'self_intro', spotId: 'home', difficulty: 'easy' },
  { id: 'en-extra-010', english: 'I have a dog.', japanese: '犬を飼っています。', kana: 'アイ ハブ ア ドッグ', scene: '自分のことを話す', category: 'self_intro', spotId: 'home', difficulty: 'easy' },
  { id: 'en-extra-011', english: 'Yes, please.', japanese: 'はい、お願いします。', kana: 'イエス プリーズ', scene: 'すすめられた時に答える', category: 'daily', spotId: 'cafe', difficulty: 'easy' },
  { id: 'en-extra-012', english: 'No, thank you.', japanese: 'いいえ、結構です。', kana: 'ノー サンキュー', scene: 'ていねいに断る', category: 'daily', spotId: 'restaurant', difficulty: 'easy' },
  { id: 'en-extra-013', english: "I'm okay.", japanese: '大丈夫です。', kana: 'アイム オーケー', scene: '問題ないと伝える', category: 'feelings', spotId: 'home', difficulty: 'easy' },
  { id: 'en-extra-014', english: "I'm happy.", japanese: 'うれしいです。', kana: 'アイム ハッピー', scene: '気持ちを伝える', category: 'feelings', spotId: 'park', difficulty: 'easy' },
  { id: 'en-extra-015', english: "I'm sleepy.", japanese: '眠いです。', kana: 'アイム スリーピー', scene: '眠気を伝える', category: 'feelings', spotId: 'home', difficulty: 'easy' },
  { id: 'en-extra-016', english: "I'm cold.", japanese: '寒いです。', kana: 'アイム コールド', scene: '体感を伝える', category: 'feelings', spotId: 'park', difficulty: 'easy' },
  { id: 'en-extra-017', english: "I'm hot.", japanese: '暑いです。', kana: 'アイム ホット', scene: '体感を伝える', category: 'feelings', spotId: 'park', difficulty: 'easy' },
  { id: 'en-extra-018', english: "I'm busy.", japanese: '忙しいです。', kana: 'アイム ビジー', scene: '今の状況を伝える', category: 'daily', spotId: 'office', difficulty: 'easy' },
  { id: 'en-extra-019', english: "I'm free now.", japanese: '今は空いています。', kana: 'アイム フリー ナウ', scene: '時間があると伝える', category: 'daily', spotId: 'home', difficulty: 'easy' },
  { id: 'en-extra-020', english: "That's nice.", japanese: 'いいですね。', kana: 'ザッツ ナイス', scene: '相手の話に反応する', category: 'small_talk', spotId: 'park', difficulty: 'easy' },
  { id: 'en-extra-021', english: 'Really?', japanese: '本当ですか？', kana: 'リアリー', scene: '驚いた時に聞き返す', category: 'small_talk', spotId: 'park', difficulty: 'easy' },
  { id: 'en-extra-022', english: 'I see.', japanese: 'なるほど。', kana: 'アイ シー', scene: '理解した時に言う', category: 'daily', spotId: 'office', difficulty: 'easy' },
  { id: 'en-extra-023', english: 'Me too.', japanese: '私もです。', kana: 'ミー トゥー', scene: '同じ気持ちを伝える', category: 'small_talk', spotId: 'home', difficulty: 'easy' },
  { id: 'en-extra-024', english: 'One more time?', japanese: 'もう一回いいですか？', kana: 'ワン モア タイム', scene: '聞き返す', category: 'request', spotId: 'home', difficulty: 'easy' },
  { id: 'en-extra-025', english: 'Slowly, please.', japanese: 'ゆっくりお願いします。', kana: 'スローリー プリーズ', scene: 'ゆっくり話してほしい時', category: 'request', spotId: 'station', difficulty: 'easy' },
  { id: 'en-extra-026', english: 'This one, please.', japanese: 'これをお願いします。', kana: 'ディス ワン プリーズ', scene: '商品を選ぶ', category: 'shopping', spotId: 'convenience_store', difficulty: 'easy' },
  { id: 'en-extra-027', english: 'Here you go.', japanese: 'どうぞ。', kana: 'ヒア ユー ゴー', scene: '物を渡す', category: 'daily', spotId: 'convenience_store', difficulty: 'easy' },
  { id: 'en-extra-028', english: "It's okay.", japanese: '大丈夫です。', kana: 'イッツ オーケー', scene: '相手を安心させる', category: 'thanks_apology', spotId: 'home', difficulty: 'easy' },
  { id: 'en-extra-029', english: 'Thanks a lot.', japanese: '本当にありがとう。', kana: 'サンクス ア ロット', scene: '感謝する', category: 'thanks_apology', spotId: 'home', difficulty: 'easy' },
  { id: 'en-extra-030', english: 'Sorry about that.', japanese: 'それはすみません。', kana: 'ソーリー アバウト ザット', scene: '軽く謝る', category: 'thanks_apology', spotId: 'home', difficulty: 'easy' },
  { id: 'en-extra-031', english: 'Where is it?', japanese: 'それはどこですか？', kana: 'ウェア イズ イット', scene: '場所を聞く', category: 'direction', spotId: 'station', difficulty: 'easy' },
  { id: 'en-extra-032', english: 'Is it open?', japanese: '開いていますか？', kana: 'イズ イット オープン', scene: 'お店が開いているか聞く', category: 'shopping', spotId: 'convenience_store', difficulty: 'easy' },
  { id: 'en-extra-033', english: 'Is it closed?', japanese: '閉まっていますか？', kana: 'イズ イット クローズド', scene: 'お店が閉まっているか聞く', category: 'shopping', spotId: 'convenience_store', difficulty: 'easy' },
  { id: 'en-extra-034', english: 'I need water.', japanese: '水が必要です。', kana: 'アイ ニード ウォーター', scene: '水がほしい時', category: 'emergency', spotId: 'cafe', difficulty: 'easy' },
  { id: 'en-extra-035', english: 'Help, please.', japanese: '助けてください。', kana: 'ヘルプ プリーズ', scene: '困った時に助けを求める', category: 'emergency', spotId: 'station', difficulty: 'easy' },
  { id: 'en-extra-036', english: "I'm lost.", japanese: '道に迷いました。', kana: 'アイム ロスト', scene: '迷子になった時', category: 'emergency', spotId: 'station', difficulty: 'easy' },
  { id: 'en-extra-037', english: 'A coffee, please.', japanese: 'コーヒーをお願いします。', kana: 'ア コーヒー プリーズ', scene: 'カフェで注文する', category: 'cafe', spotId: 'cafe', difficulty: 'easy' },
  { id: 'en-extra-038', english: 'The menu, please.', japanese: 'メニューをお願いします。', kana: 'ザ メニュー プリーズ', scene: 'レストランでメニューを頼む', category: 'restaurant', spotId: 'restaurant', difficulty: 'easy' },
  { id: 'en-extra-039', english: 'Could I have my room key, please?', japanese: '部屋の鍵をいただけますか？', kana: 'クッド アイ ハブ マイ ルーム キー プリーズ', scene: 'ホテルで鍵を受け取る', category: 'hotel', spotId: 'hotel', difficulty: 'easy' },
  { id: 'en-extra-040', english: "I'm checking out.", japanese: 'チェックアウトします。', kana: 'アイム チェッキング アウト', scene: 'ホテルでチェックアウトする', category: 'hotel', spotId: 'hotel', difficulty: 'easy' },
  { id: 'en-extra-041', english: 'How have you been?', japanese: '元気にしていましたか？', kana: 'ハウ ハブ ユー ビーン', scene: '久しぶりに会った時', category: 'greeting', spotId: 'home', difficulty: 'normal' },
  { id: 'en-extra-042', english: "It's been a while.", japanese: '久しぶりですね。', kana: 'イッツ ビーン ア ワイル', scene: '久しぶりに会う', category: 'greeting', spotId: 'home', difficulty: 'normal' },
  { id: 'en-extra-043', english: 'Please call me later.', japanese: '後で電話してください。', kana: 'プリーズ コール ミー レイター', scene: '後で連絡してほしい時', category: 'daily', spotId: 'home', difficulty: 'normal' },
  { id: 'en-extra-044', english: "I'll call you later.", japanese: '後で電話します。', kana: 'アイル コール ユー レイター', scene: '後で連絡すると伝える', category: 'daily', spotId: 'office', difficulty: 'normal' },
  { id: 'en-extra-045', english: 'Can I join you?', japanese: '一緒に入ってもいいですか？', kana: 'キャン アイ ジョイン ユー', scene: '相手に加わりたい時', category: 'small_talk', spotId: 'cafe', difficulty: 'normal' },
  { id: 'en-extra-046', english: 'Do you come here often?', japanese: 'ここによく来ますか？', kana: 'ドゥ ユー カム ヒア オーフン', scene: '雑談で聞く', category: 'small_talk', spotId: 'park', difficulty: 'normal' },
  { id: 'en-extra-047', english: 'The weather changed quickly.', japanese: '天気が急に変わりました。', kana: 'ザ ウェザー チェンジド クイックリー', scene: '天気の雑談', category: 'small_talk', spotId: 'park', difficulty: 'normal' },
  { id: 'en-extra-048', english: "It's a little crowded.", japanese: '少し混んでいます。', kana: 'イッツ ア リトル クラウディッド', scene: '混雑について話す', category: 'small_talk', spotId: 'station', difficulty: 'normal' },
  { id: 'en-extra-049', english: 'I feel much better now.', japanese: '今はだいぶ良くなりました。', kana: 'アイ フィール マッチ ベター ナウ', scene: '体調が良くなった時', category: 'feelings', spotId: 'home', difficulty: 'normal' },
  { id: 'en-extra-050', english: 'I have a headache.', japanese: '頭が痛いです。', kana: 'アイ ハブ ア ヘッドエイク', scene: '体調不良を伝える', category: 'feelings', spotId: 'hotel', difficulty: 'normal' },
  { id: 'en-extra-051', english: 'My stomach hurts.', japanese: 'お腹が痛いです。', kana: 'マイ スタマック ハーツ', scene: '体調不良を伝える', category: 'feelings', spotId: 'hotel', difficulty: 'normal' },
  { id: 'en-extra-052', english: 'I need to rest.', japanese: '休む必要があります。', kana: 'アイ ニード トゥ レスト', scene: '疲れた時', category: 'feelings', spotId: 'hotel', difficulty: 'normal' },
  { id: 'en-extra-053', english: 'Could you speak more slowly?', japanese: 'もう少しゆっくり話してもらえますか？', kana: 'クッド ユー スピーク モア スローリー', scene: '聞き取りにくい時', category: 'request', spotId: 'station', difficulty: 'normal' },
  { id: 'en-extra-054', english: 'Could you show me that?', japanese: 'それを見せてもらえますか？', kana: 'クッド ユー ショウ ミー ザット', scene: '商品を見たい時', category: 'shopping', spotId: 'convenience_store', difficulty: 'normal' },
  { id: 'en-extra-055', english: 'Could you recommend something?', japanese: '何かおすすめしてもらえますか？', kana: 'クッド ユー レコメンド サムシング', scene: 'おすすめを聞く', category: 'restaurant', spotId: 'restaurant', difficulty: 'normal' },
  { id: 'en-extra-056', english: 'Could I get a smaller size?', japanese: '小さいサイズをもらえますか？', kana: 'クッド アイ ゲット ア スモーラー サイズ', scene: 'サイズを聞く', category: 'shopping', spotId: 'convenience_store', difficulty: 'normal' },
  { id: 'en-extra-057', english: 'Is there a seat outside?', japanese: '外の席はありますか？', kana: 'イズ ゼア ア シート アウトサイド', scene: 'カフェで席を聞く', category: 'cafe', spotId: 'cafe', difficulty: 'normal' },
  { id: 'en-extra-058', english: 'Can I have it without sugar?', japanese: '砂糖なしにできますか？', kana: 'キャン アイ ハブ イット ウィズアウト シュガー', scene: '飲み物を注文する', category: 'cafe', spotId: 'cafe', difficulty: 'normal' },
  { id: 'en-extra-059', english: 'Can I have the same one?', japanese: '同じものをもらえますか？', kana: 'キャン アイ ハブ ザ セイム ワン', scene: '追加注文する', category: 'cafe', spotId: 'cafe', difficulty: 'normal' },
  { id: 'en-extra-060', english: 'I ordered this.', japanese: '私はこれを注文しました。', kana: 'アイ オーダード ディス', scene: '注文内容を伝える', category: 'restaurant', spotId: 'restaurant', difficulty: 'normal' },
  { id: 'en-extra-061', english: 'This is not my order.', japanese: 'これは私の注文ではありません。', kana: 'ディス イズ ノット マイ オーダー', scene: '注文違いを伝える', category: 'restaurant', spotId: 'restaurant', difficulty: 'normal' },
  { id: 'en-extra-062', english: 'Could we sit by the window?', japanese: '窓側に座れますか？', kana: 'クッド ウィー シット バイ ザ ウィンドウ', scene: '席の希望を伝える', category: 'restaurant', spotId: 'restaurant', difficulty: 'normal' },
  { id: 'en-extra-063', english: 'Is the service charge included?', japanese: 'サービス料は含まれていますか？', kana: 'イズ ザ サービス チャージ インクルーデッド', scene: '会計前に確認する', category: 'restaurant', spotId: 'restaurant', difficulty: 'normal' },
  { id: 'en-extra-064', english: 'Which way is the exit?', japanese: '出口はどちらですか？', kana: 'ウィッチ ウェイ イズ ジ エグジット', scene: '出口を探す', category: 'direction', spotId: 'station', difficulty: 'normal' },
  { id: 'en-extra-065', english: 'How many stops is it?', japanese: '何駅ですか？', kana: 'ハウ メニー ストップス イズ イット', scene: '電車やバスで聞く', category: 'direction', spotId: 'station', difficulty: 'normal' },
  { id: 'en-extra-066', english: 'Does this bus go downtown?', japanese: 'このバスは中心街へ行きますか？', kana: 'ダズ ディス バス ゴー ダウンタウン', scene: '移動中に確認する', category: 'travel', spotId: 'station', difficulty: 'normal' },
  { id: 'en-extra-067', english: 'Could you tell me when to get off?', japanese: '降りる時に教えてもらえますか？', kana: 'クッド ユー テル ミー ウェン トゥ ゲット オフ', scene: 'バスや電車でお願いする', category: 'travel', spotId: 'station', difficulty: 'normal' },
  { id: 'en-extra-068', english: 'I want to buy a day pass.', japanese: '一日券を買いたいです。', kana: 'アイ ワント トゥ バイ ア デイ パス', scene: '交通チケットを買う', category: 'travel', spotId: 'station', difficulty: 'normal' },
  { id: 'en-extra-069', english: "I'm looking for gate three.", japanese: '3番ゲートを探しています。', kana: 'アイム ルッキング フォー ゲイト スリー', scene: '駅や空港で探す', category: 'travel', spotId: 'station', difficulty: 'normal' },
  { id: 'en-extra-070', english: 'Is there a convenience store nearby?', japanese: '近くにコンビニはありますか？', kana: 'イズ ゼア ア コンビニエンス ストア ニアバイ', scene: '近くのお店を聞く', category: 'shopping', spotId: 'convenience_store', difficulty: 'normal' },
  { id: 'en-extra-071', english: 'Do you sell batteries?', japanese: '電池は売っていますか？', kana: 'ドゥ ユー セル バッテリーズ', scene: '商品があるか聞く', category: 'shopping', spotId: 'convenience_store', difficulty: 'normal' },
  { id: 'en-extra-072', english: 'Can I return this?', japanese: 'これは返品できますか？', kana: 'キャン アイ リターン ディス', scene: '返品したい時', category: 'shopping', spotId: 'convenience_store', difficulty: 'normal' },
  { id: 'en-extra-073', english: "I'm just looking, thanks.", japanese: '見ているだけです、ありがとう。', kana: 'アイム ジャスト ルッキング サンクス', scene: '買い物中に声をかけられた時', category: 'shopping', spotId: 'convenience_store', difficulty: 'normal' },
  { id: 'en-extra-074', english: 'Could I try this on?', japanese: 'これを試着できますか？', kana: 'クッド アイ トライ ディス オン', scene: '服を試着したい時', category: 'shopping', spotId: 'convenience_store', difficulty: 'normal' },
  { id: 'en-extra-075', english: 'Do you have another color?', japanese: '別の色はありますか？', kana: 'ドゥ ユー ハブ アナザー カラー', scene: '色違いを聞く', category: 'shopping', spotId: 'convenience_store', difficulty: 'normal' },
  { id: 'en-extra-076', english: 'I have a reservation under {userName}.', japanese: '{userName}の名前で予約しています。', kana: 'アイ ハブ ア レザベーション アンダー {userName}', scene: 'ホテルで予約名を伝える', category: 'hotel', spotId: 'hotel', difficulty: 'normal' },
  { id: 'en-extra-077', english: 'Could I leave my suitcase here?', japanese: 'ここにスーツケースを預けられますか？', kana: 'クッド アイ リーブ マイ スーツケース ヒア', scene: 'ホテルで荷物を預ける', category: 'hotel', spotId: 'hotel', difficulty: 'normal' },
  { id: 'en-extra-078', english: 'The air conditioner is not working.', japanese: 'エアコンが動きません。', kana: 'ジ エア コンディショナー イズ ノット ワーキング', scene: 'ホテルで設備の不調を伝える', category: 'hotel', spotId: 'hotel', difficulty: 'normal' },
  { id: 'en-extra-079', english: 'Could you change my room?', japanese: '部屋を変えてもらえますか？', kana: 'クッド ユー チェンジ マイ ルーム', scene: 'ホテルで部屋変更をお願いする', category: 'hotel', spotId: 'hotel', difficulty: 'normal' },
  { id: 'en-extra-080', english: 'What time is breakfast served?', japanese: '朝食は何時に提供されますか？', kana: 'ワット タイム イズ ブレックファスト サーブド', scene: 'ホテルで朝食時間を聞く', category: 'hotel', spotId: 'hotel', difficulty: 'normal' },
  { id: 'en-extra-081', english: 'I need a doctor.', japanese: '医者が必要です。', kana: 'アイ ニード ア ドクター', scene: '体調が悪い時', category: 'emergency', spotId: 'hotel', difficulty: 'normal' },
  { id: 'en-extra-082', english: 'I lost my phone.', japanese: '携帯をなくしました。', kana: 'アイ ロスト マイ フォーン', scene: '紛失を伝える', category: 'emergency', spotId: 'station', difficulty: 'normal' },
  { id: 'en-extra-083', english: 'My wallet is missing.', japanese: '財布が見つかりません。', kana: 'マイ ウォレット イズ ミッシング', scene: '紛失を伝える', category: 'emergency', spotId: 'station', difficulty: 'normal' },
  { id: 'en-extra-084', english: 'Could you help me find it?', japanese: 'それを探すのを手伝ってもらえますか？', kana: 'クッド ユー ヘルプ ミー ファインド イット', scene: '探し物を手伝ってもらう', category: 'emergency', spotId: 'station', difficulty: 'normal' },
  { id: 'en-extra-085', english: "I don't feel well.", japanese: '体調がよくありません。', kana: 'アイ ドント フィール ウェル', scene: '体調不良を伝える', category: 'emergency', spotId: 'home', difficulty: 'normal' },
  { id: 'en-extra-086', english: "Let's meet at the entrance.", japanese: '入口で会いましょう。', kana: 'レッツ ミート アット ジ エントランス', scene: '待ち合わせ場所を決める', category: 'direction', spotId: 'station', difficulty: 'normal' },
  { id: 'en-extra-087', english: "I'll be there in ten minutes.", japanese: '10分で着きます。', kana: 'アイル ビー ゼア イン テン ミニッツ', scene: '到着時間を伝える', category: 'daily', spotId: 'station', difficulty: 'normal' },
  { id: 'en-extra-088', english: "I'm running a little late.", japanese: '少し遅れています。', kana: 'アイム ランニング ア リトル レイト', scene: '遅れることを伝える', category: 'daily', spotId: 'office', difficulty: 'normal' },
  { id: 'en-extra-089', english: 'Thank you for waiting.', japanese: '待ってくれてありがとうございます。', kana: 'サンキュー フォー ウェイティング', scene: '待ってもらった後', category: 'thanks_apology', spotId: 'office', difficulty: 'normal' },
  { id: 'en-extra-090', english: 'Sorry to keep you waiting.', japanese: '待たせてすみません。', kana: 'ソーリー トゥ キープ ユー ウェイティング', scene: '待たせた時に謝る', category: 'thanks_apology', spotId: 'office', difficulty: 'normal' },
  { id: 'en-extra-091', english: 'That sounds fun.', japanese: '楽しそうですね。', kana: 'ザット サウンズ ファン', scene: '雑談で反応する', category: 'small_talk', spotId: 'park', difficulty: 'normal' },
  { id: 'en-extra-092', english: "I'm not sure yet.", japanese: 'まだよく分かりません。', kana: 'アイム ノット シュア イェット', scene: 'まだ決まっていない時', category: 'daily', spotId: 'home', difficulty: 'normal' },
  { id: 'en-extra-093', english: 'Let me think about it.', japanese: '少し考えさせてください。', kana: 'レット ミー シンク アバウト イット', scene: 'すぐ決められない時', category: 'daily', spotId: 'office', difficulty: 'normal' },
  { id: 'en-extra-094', english: "I'll check and tell you.", japanese: '確認して伝えます。', kana: 'アイル チェック アンド テル ユー', scene: '後で確認すると伝える', category: 'daily', spotId: 'office', difficulty: 'normal' },
  { id: 'en-extra-095', english: 'Could you say that in another way?', japanese: '別の言い方で言ってもらえますか？', kana: 'クッド ユー セイ ザット イン アナザー ウェイ', scene: '分かりにくい時に聞く', category: 'request', spotId: 'office', difficulty: 'normal' },
  { id: 'en-extra-096', english: "I'm practicing English.", japanese: '英語を練習しています。', kana: 'アイム プラクティシング イングリッシュ', scene: '学習中だと伝える', category: 'self_intro', spotId: 'home', difficulty: 'normal' },
  { id: 'en-extra-097', english: 'I want to learn every day.', japanese: '毎日学びたいです。', kana: 'アイ ワント トゥ ラーン エブリ デイ', scene: '学習の目標を伝える', category: 'self_intro', spotId: 'home', difficulty: 'normal' },
  { id: 'en-extra-098', english: 'This is my first time here.', japanese: 'ここは初めてです。', kana: 'ディス イズ マイ ファースト タイム ヒア', scene: '初めて来た場所で', category: 'travel', spotId: 'hotel', difficulty: 'normal' },
  { id: 'en-extra-099', english: "I'm traveling alone.", japanese: '一人で旅行しています。', kana: 'アイム トラベリング アローン', scene: '旅行中に伝える', category: 'travel', spotId: 'hotel', difficulty: 'normal' },
  { id: 'en-extra-100', english: "I'm here for sightseeing.", japanese: '観光で来ています。', kana: 'アイム ヒア フォー サイトシーイング', scene: '旅行目的を伝える', category: 'travel', spotId: 'hotel', difficulty: 'normal' },
  { id: 'en-extra-101', english: "I'm still learning, so please speak slowly.", japanese: 'まだ学習中なので、ゆっくり話してください。', kana: 'アイム スティル ラーニング ソー プリーズ スピーク スローリー', scene: '会話の前にお願いする', category: 'request', spotId: 'home', difficulty: 'challenge' },
  { id: 'en-extra-102', english: 'Could you help me choose a simple drink?', japanese: '簡単な飲み物を選ぶのを手伝ってもらえますか？', kana: 'クッド ユー ヘルプ ミー チューズ ア シンプル ドリンク', scene: 'カフェで注文に迷った時', category: 'cafe', spotId: 'cafe', difficulty: 'challenge' },
  { id: 'en-extra-103', english: "I'd like something not too sweet.", japanese: '甘すぎないものがいいです。', kana: 'アイド ライク サムシング ノット トゥー スウィート', scene: 'カフェで好みを伝える', category: 'cafe', spotId: 'cafe', difficulty: 'challenge' },
  { id: 'en-extra-104', english: 'Could you split the bill, please?', japanese: 'お会計を分けてもらえますか？', kana: 'クッド ユー スプリット ザ ビル プリーズ', scene: '食事の会計でお願いする', category: 'restaurant', spotId: 'restaurant', difficulty: 'challenge' },
  { id: 'en-extra-105', english: 'I think we took the wrong train.', japanese: '私たちは違う電車に乗ったと思います。', kana: 'アイ シンク ウィー トゥック ザ ロング トレイン', scene: '移動中に間違いに気づく', category: 'direction', spotId: 'station', difficulty: 'challenge' },
  { id: 'en-extra-106', english: 'Could you point it out on the map?', japanese: '地図で指してもらえますか？', kana: 'クッド ユー ポイント イット アウト オン ザ マップ', scene: '場所を地図で確認する', category: 'direction', spotId: 'station', difficulty: 'challenge' },
  { id: 'en-extra-107', english: "I'm looking for a quiet place to sit.", japanese: '静かに座れる場所を探しています。', kana: 'アイム ルッキング フォー ア クワイエット プレイス トゥ シット', scene: 'カフェや施設で席を探す', category: 'cafe', spotId: 'cafe', difficulty: 'challenge' },
  { id: 'en-extra-108', english: "I'm sorry, I didn't catch that.", japanese: 'すみません、聞き取れませんでした。', kana: 'アイム ソーリー アイ ディドント キャッチ ザット', scene: '聞き返す', category: 'thanks_apology', spotId: 'office', difficulty: 'challenge' },
  { id: 'en-extra-109', english: 'Could you explain that one more time?', japanese: 'それをもう一度説明してもらえますか？', kana: 'クッド ユー エクスプレイン ザット ワン モア タイム', scene: '説明をもう一度お願いする', category: 'request', spotId: 'office', difficulty: 'challenge' },
  { id: 'en-extra-110', english: 'I have plans later, but I can stay for a bit.', japanese: '後で予定がありますが、少しならいられます。', kana: 'アイ ハブ プランズ レイター バット アイ キャン ステイ フォー ア ビット', scene: '予定を伝えながら話す', category: 'daily', spotId: 'cafe', difficulty: 'challenge' },
  { id: 'en-extra-111', english: 'I feel nervous, but I want to try.', japanese: '緊張していますが、やってみたいです。', kana: 'アイ フィール ナーバス バット アイ ワント トゥ トライ', scene: '挑戦したい気持ちを伝える', category: 'feelings', spotId: 'home', difficulty: 'challenge' },
  { id: 'en-extra-112', english: 'This is harder than I expected.', japanese: '思ったより難しいです。', kana: 'ディス イズ ハーダー ザン アイ エクスペクテッド', scene: '感想を伝える', category: 'feelings', spotId: 'home', difficulty: 'challenge' },
  { id: 'en-extra-113', english: "I'm glad I came here today.", japanese: '今日ここに来てよかったです。', kana: 'アイム グラッド アイ ケイム ヒア トゥデイ', scene: '楽しい気持ちを伝える', category: 'small_talk', spotId: 'park', difficulty: 'challenge' },
  { id: 'en-extra-114', english: 'Do you know a good place nearby?', japanese: '近くに良い場所を知っていますか？', kana: 'ドゥ ユー ノウ ア グッド プレイス ニアバイ', scene: 'おすすめの場所を聞く', category: 'travel', spotId: 'station', difficulty: 'challenge' },
  { id: 'en-extra-115', english: 'Could you make it a little less spicy?', japanese: '少し辛さを控えめにできますか？', kana: 'クッド ユー メイク イット ア リトル レス スパイシー', scene: '料理の辛さを調整したい時', category: 'restaurant', spotId: 'restaurant', difficulty: 'challenge' },
  { id: 'en-extra-116', english: "I'd like to change my reservation.", japanese: '予約を変更したいです。', kana: 'アイド ライク トゥ チェンジ マイ レザベーション', scene: 'ホテルで予約を変える', category: 'hotel', spotId: 'hotel', difficulty: 'challenge' },
  { id: 'en-extra-117', english: 'Could you keep my luggage until evening?', japanese: '夕方まで荷物を預かってもらえますか？', kana: 'クッド ユー キープ マイ ラゲッジ アンティル イーブニング', scene: 'ホテルで荷物を預ける', category: 'hotel', spotId: 'hotel', difficulty: 'challenge' },
  { id: 'en-extra-118', english: "If I get lost, I'll call you.", japanese: '迷ったら電話します。', kana: 'イフ アイ ゲット ロスト アイル コール ユー', scene: '移動前に伝える', category: 'emergency', spotId: 'station', difficulty: 'challenge' },
  { id: 'en-extra-119', english: 'I need help because my phone battery died.', japanese: '携帯の充電が切れたので助けが必要です。', kana: 'アイ ニード ヘルプ ビコーズ マイ フォーン バッテリー ダイド', scene: '困った状況を説明する', category: 'emergency', spotId: 'station', difficulty: 'challenge' },
  { id: 'en-extra-120', english: 'Thank you for explaining it so clearly.', japanese: 'とても分かりやすく説明してくれてありがとうございます。', kana: 'サンキュー フォー エクスプレイニング イット ソー クリアリー', scene: '説明してくれた相手へ感謝する', category: 'thanks_apology', spotId: 'office', difficulty: 'challenge' },
];

export const ENGLISH_EXTRA_PHRASES: Phrase[] = englishExtraPhraseSeeds.map((phrase, index, allPhrases) => ({
  ...phrase,
  language: 'english',
  text: phrase.english,
  choices: buildChoices(phrase, index, allPhrases),
}));
