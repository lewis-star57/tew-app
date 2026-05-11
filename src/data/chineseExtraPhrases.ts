import type { Phrase } from '../types/phrase';

type ChineseExtraPhraseSeed = Omit<Phrase, 'language' | 'english' | 'choices'>;

const chineseExtraPhraseSeeds: ChineseExtraPhraseSeed[] = [
  { id: 'zh-extra-001', text: '嗨。', pinyin: 'hāi', japanese: 'やあ。', kana: 'ハイ', scene: '親しいあいさつ', category: 'greeting', spotId: 'home' },
  { id: 'zh-extra-002', text: '早上好。', pinyin: 'zǎo shang hǎo', japanese: 'おはようございます。', kana: 'ザオ シャン ハオ', scene: '朝のあいさつ', category: 'greeting', spotId: 'home' },
  { id: 'zh-extra-003', text: '晚上见。', pinyin: 'wǎn shang jiàn', japanese: '夜に会いましょう。', kana: 'ワン シャン ジエン', scene: '夜に会う約束をする', category: 'greeting', spotId: 'home' },
  { id: 'zh-extra-004', text: '好久不见。', pinyin: 'hǎo jiǔ bú jiàn', japanese: 'お久しぶりです。', kana: 'ハオ ジョウ ブー ジエン', scene: '久しぶりに会う', category: 'greeting', spotId: 'home' },
  { id: 'zh-extra-005', text: '最近怎么样？', pinyin: 'zuì jìn zěn me yàng', japanese: '最近どうですか？', kana: 'ズイ ジン ゼン マ ヤン', scene: '近況を聞く', category: 'greeting', spotId: 'home' },
  { id: 'zh-extra-006', text: '今天过得好吗？', pinyin: 'jīn tiān guò de hǎo ma', japanese: '今日はどうでしたか？', kana: 'ジン ティエン グオ ダ ハオ マ', scene: '一日の様子を聞く', category: 'greeting', spotId: 'home' },
  { id: 'zh-extra-007', text: '很高兴见到你。', pinyin: 'hěn gāo xìng jiàn dào nǐ', japanese: '会えてうれしいです。', kana: 'ヘン ガオ シン ジエン ダオ ニー', scene: '会えた喜びを伝える', category: 'greeting', spotId: 'home' },
  { id: 'zh-extra-008', text: '欢迎你。', pinyin: 'huān yíng nǐ', japanese: 'ようこそ。', kana: 'ホワン イン ニー', scene: '相手を迎える', category: 'greeting', spotId: 'home' },
  { id: 'zh-extra-009', text: '请进。', pinyin: 'qǐng jìn', japanese: 'どうぞ入ってください。', kana: 'チン ジン', scene: '家や部屋へ招く', category: 'greeting', spotId: 'home' },
  { id: 'zh-extra-010', text: '回头见。', pinyin: 'huí tóu jiàn', japanese: 'またあとで。', kana: 'ホイ トウ ジエン', scene: '軽く別れる', category: 'greeting', spotId: 'home' },
  { id: 'zh-extra-011', text: '我是{userName}。', pinyin: 'wǒ shì {userName}', japanese: '私は{userName}です。', kana: 'ウォ シー {userName}', scene: '名前を伝える', category: 'self_intro', spotId: 'home' },
  { id: 'zh-extra-012', text: '我来自日本。', pinyin: 'wǒ lái zì rì běn', japanese: '日本から来ました。', kana: 'ウォ ライ ズー リー ベン', scene: '出身を伝える', category: 'self_intro', spotId: 'home' },
  { id: 'zh-extra-013', text: '我住在东京。', pinyin: 'wǒ zhù zài dōng jīng', japanese: '東京に住んでいます。', kana: 'ウォ ジュー ザイ ドン ジン', scene: '住んでいる場所を伝える', category: 'self_intro', spotId: 'home' },
  { id: 'zh-extra-014', text: '我喜欢散步。', pinyin: 'wǒ xǐ huan sàn bù', japanese: '散歩が好きです。', kana: 'ウォ シー ホワン サン ブー', scene: '好きなことを話す', category: 'self_intro', spotId: 'park' },
  { id: 'zh-extra-015', text: '我喜欢学习中文。', pinyin: 'wǒ xǐ huan xué xí zhōng wén', japanese: '中国語を学ぶのが好きです。', kana: 'ウォ シー ホワン シュエ シー ジョン ウェン', scene: '学習について話す', category: 'self_intro', spotId: 'home' },
  { id: 'zh-extra-016', text: '这是我的狗。', pinyin: 'zhè shì wǒ de gǒu', japanese: 'これは私の犬です。', kana: 'ジョー シー ウォ ダ ゴウ', scene: '愛犬を紹介する', category: 'self_intro', spotId: 'home' },
  { id: 'zh-extra-017', text: '他叫Taffy。', pinyin: 'tā jiào Taffy', japanese: '彼はTaffyといいます。', kana: 'ター ジャオ タフィー', scene: 'Taffyの名前を紹介する', category: 'self_intro', spotId: 'home' },
  { id: 'zh-extra-018', text: '他很聪明。', pinyin: 'tā hěn cōng míng', japanese: '彼はとても賢いです。', kana: 'ター ヘン ツォン ミン', scene: 'Taffyのことを話す', category: 'self_intro', spotId: 'park' },
  { id: 'zh-extra-019', text: '我们一起学习。', pinyin: 'wǒ men yì qǐ xué xí', japanese: '私たちは一緒に学びます。', kana: 'ウォ メン イー チー シュエ シー', scene: '一緒に学ぶことを話す', category: 'self_intro', spotId: 'home' },
  { id: 'zh-extra-020', text: '请多指教。', pinyin: 'qǐng duō zhǐ jiào', japanese: 'よろしくお願いします。', kana: 'チン ドゥオ ジー ジャオ', scene: '自己紹介の締め', category: 'self_intro', spotId: 'home' },
  { id: 'zh-extra-021', text: '谢谢你。', pinyin: 'xiè xie nǐ', japanese: 'ありがとう。', kana: 'シエ シエ ニー', scene: 'お礼を言う', category: 'thanks_apology', spotId: 'home' },
  { id: 'zh-extra-022', text: '非常感谢。', pinyin: 'fēi cháng gǎn xiè', japanese: '本当にありがとうございます。', kana: 'フェイ チャン ガン シエ', scene: '丁寧に感謝する', category: 'thanks_apology', spotId: 'office' },
  { id: 'zh-extra-023', text: '太谢谢你了。', pinyin: 'tài xiè xie nǐ le', japanese: '本当にありがとうございます。', kana: 'タイ シエ シエ ニー ラ', scene: '強く感謝する', category: 'thanks_apology', spotId: 'home' },
  { id: 'zh-extra-024', text: '不好意思。', pinyin: 'bù hǎo yì si', japanese: 'すみません。', kana: 'ブー ハオ イー ス', scene: '軽く謝る・声をかける', category: 'thanks_apology', spotId: 'station' },
  { id: 'zh-extra-025', text: '对不起，我迟到了。', pinyin: 'duì bu qǐ, wǒ chí dào le', japanese: '遅れてすみません。', kana: 'ドゥイ ブ チー ウォ チー ダオ ラ', scene: '遅刻を謝る', category: 'thanks_apology', spotId: 'office' },
  { id: 'zh-extra-026', text: '没事。', pinyin: 'méi shì', japanese: '大丈夫です。', kana: 'メイ シー', scene: '相手を安心させる', category: 'thanks_apology', spotId: 'home' },
  { id: 'zh-extra-027', text: '不用担心。', pinyin: 'bú yòng dān xīn', japanese: '心配しないでください。', kana: 'ブー ヨン ダン シン', scene: '安心させる', category: 'thanks_apology', spotId: 'home' },
  { id: 'zh-extra-028', text: '对不起。', pinyin: 'duì bu qǐ', japanese: 'ごめんなさい。', kana: 'ドゥイ ブ チー', scene: '日常で謝る', category: 'thanks_apology', spotId: 'home' },
  { id: 'zh-extra-029', text: '麻烦你了。', pinyin: 'má fan nǐ le', japanese: 'お手数をおかけします。', kana: 'マー ファン ニー ラ', scene: 'お願いした後に言う', category: 'thanks_apology', spotId: 'office' },
  { id: 'zh-extra-030', text: '辛苦了。', pinyin: 'xīn kǔ le', japanese: 'お疲れさまです。', kana: 'シン クー ラ', scene: '相手をねぎらう', category: 'thanks_apology', spotId: 'office' },
  { id: 'zh-extra-031', text: '能帮我一下吗？', pinyin: 'néng bāng wǒ yí xià ma', japanese: '少し手伝ってもらえますか？', kana: 'ノン バン ウォ イー シア マ', scene: '助けをお願いする', category: 'request', spotId: 'home' },
  { id: 'zh-extra-032', text: '请稍等。', pinyin: 'qǐng shāo děng', japanese: '少々お待ちください。', kana: 'チン シャオ ドン', scene: '少し待ってもらう', category: 'request', spotId: 'office' },
  { id: 'zh-extra-033', text: '请慢一点说。', pinyin: 'qǐng màn yì diǎn shuō', japanese: '少しゆっくり話してください。', kana: 'チン マン イー ディエン シュオ', scene: '聞き取りたい時', category: 'request', spotId: 'station' },
  { id: 'zh-extra-034', text: '请写下来。', pinyin: 'qǐng xiě xià lái', japanese: '書いてください。', kana: 'チン シエ シア ライ', scene: '文字で確認したい時', category: 'request', spotId: 'office' },
  { id: 'zh-extra-035', text: '请给我这个。', pinyin: 'qǐng gěi wǒ zhè ge', japanese: 'これをください。', kana: 'チン ゲイ ウォ ジョー ガ', scene: '商品をお願いする', category: 'request', spotId: 'convenience_store' },
  { id: 'zh-extra-036', text: '可以帮我拍照吗？', pinyin: 'kě yǐ bāng wǒ pāi zhào ma', japanese: '写真を撮ってもらえますか？', kana: 'クー イー バン ウォ パイ ジャオ マ', scene: '写真をお願いする', category: 'request', spotId: 'park' },
  { id: 'zh-extra-037', text: '可以再说一遍吗？', pinyin: 'kě yǐ zài shuō yí biàn ma', japanese: 'もう一度言ってもらえますか？', kana: 'クー イー ザイ シュオ イー ビエン マ', scene: '聞き返す', category: 'request', spotId: 'station' },
  { id: 'zh-extra-038', text: '请告诉我。', pinyin: 'qǐng gào su wǒ', japanese: '教えてください。', kana: 'チン ガオ ス ウォ', scene: '情報を聞く', category: 'request', spotId: 'office' },
  { id: 'zh-extra-039', text: '请给我一点时间。', pinyin: 'qǐng gěi wǒ yì diǎn shí jiān', japanese: '少し時間をください。', kana: 'チン ゲイ ウォ イー ディエン シー ジエン', scene: '考える時間がほしい時', category: 'request', spotId: 'office' },
  { id: 'zh-extra-040', text: '可以帮我吗？', pinyin: 'kě yǐ bāng wǒ ma', japanese: '手伝ってもらえますか？', kana: 'クー イー バン ウォ マ', scene: '助けを求める', category: 'request', spotId: 'home' },
  { id: 'zh-extra-041', text: '我想买这个。', pinyin: 'wǒ xiǎng mǎi zhè ge', japanese: 'これを買いたいです。', kana: 'ウォ シアン マイ ジョー ガ', scene: '買いたいものを伝える', category: 'shopping', spotId: 'convenience_store' },
  { id: 'zh-extra-042', text: '这个有折扣吗？', pinyin: 'zhè ge yǒu zhé kòu ma', japanese: 'これは割引がありますか？', kana: 'ジョー ガ ヨウ ジョー コウ マ', scene: '割引を聞く', category: 'shopping', spotId: 'convenience_store' },
  { id: 'zh-extra-043', text: '太贵了。', pinyin: 'tài guì le', japanese: '高すぎます。', kana: 'タイ グイ ラ', scene: '値段の感想を言う', category: 'shopping', spotId: 'convenience_store' },
  { id: 'zh-extra-044', text: '便宜一点可以吗？', pinyin: 'pián yi yì diǎn kě yǐ ma', japanese: '少し安くできますか？', kana: 'ピエン イー イー ディエン クー イー マ', scene: '値引きを聞く', category: 'shopping', spotId: 'convenience_store' },
  { id: 'zh-extra-045', text: '我看看别的。', pinyin: 'wǒ kàn kan bié de', japanese: '他のものを見ます。', kana: 'ウォ カン カン ビエ ダ', scene: '別の商品を見る', category: 'shopping', spotId: 'convenience_store' },
  { id: 'zh-extra-046', text: '有小号吗？', pinyin: 'yǒu xiǎo hào ma', japanese: '小さいサイズはありますか？', kana: 'ヨウ シャオ ハオ マ', scene: 'サイズを聞く', category: 'shopping', spotId: 'convenience_store' },
  { id: 'zh-extra-047', text: '有大号吗？', pinyin: 'yǒu dà hào ma', japanese: '大きいサイズはありますか？', kana: 'ヨウ ダー ハオ マ', scene: 'サイズを聞く', category: 'shopping', spotId: 'convenience_store' },
  { id: 'zh-extra-048', text: '我可以试试吗？', pinyin: 'wǒ kě yǐ shì shi ma', japanese: '試してもいいですか？', kana: 'ウォ クー イー シー シ マ', scene: '試着や試用を聞く', category: 'shopping', spotId: 'convenience_store' },
  { id: 'zh-extra-049', text: '我要两个。', pinyin: 'wǒ yào liǎng ge', japanese: '2つください。', kana: 'ウォ ヤオ リャン ガ', scene: '数量を伝える', category: 'shopping', spotId: 'convenience_store' },
  { id: 'zh-extra-050', text: '现金可以吗？', pinyin: 'xiàn jīn kě yǐ ma', japanese: '現金でいいですか？', kana: 'シエン ジン クー イー マ', scene: '支払い方法を聞く', category: 'shopping', spotId: 'convenience_store' },
  { id: 'zh-extra-051', text: '我要热咖啡。', pinyin: 'wǒ yào rè kā fēi', japanese: 'ホットコーヒーをください。', kana: 'ウォ ヤオ ルー カー フェイ', scene: 'ホットを注文する', category: 'cafe', spotId: 'cafe' },
  { id: 'zh-extra-052', text: '我要冰咖啡。', pinyin: 'wǒ yào bīng kā fēi', japanese: 'アイスコーヒーをください。', kana: 'ウォ ヤオ ビン カー フェイ', scene: 'アイスを注文する', category: 'cafe', spotId: 'cafe' },
  { id: 'zh-extra-053', text: '少冰。', pinyin: 'shǎo bīng', japanese: '氷少なめで。', kana: 'シャオ ビン', scene: '氷の量を伝える', category: 'cafe', spotId: 'cafe' },
  { id: 'zh-extra-054', text: '不要糖。', pinyin: 'bú yào táng', japanese: '砂糖なしで。', kana: 'ブー ヤオ タン', scene: '甘さを伝える', category: 'cafe', spotId: 'cafe' },
  { id: 'zh-extra-055', text: '可以外带吗？', pinyin: 'kě yǐ wài dài ma', japanese: 'テイクアウトできますか？', kana: 'クー イー ワイ ダイ マ', scene: '持ち帰りを聞く', category: 'cafe', spotId: 'cafe' },
  { id: 'zh-extra-056', text: '在这里喝。', pinyin: 'zài zhè lǐ hē', japanese: 'ここで飲みます。', kana: 'ザイ ジョー リー フー', scene: '店内利用を伝える', category: 'cafe', spotId: 'cafe' },
  { id: 'zh-extra-057', text: '有豆奶吗？', pinyin: 'yǒu dòu nǎi ma', japanese: '豆乳はありますか？', kana: 'ヨウ ドウ ナイ マ', scene: 'ミルクの種類を聞く', category: 'cafe', spotId: 'cafe' },
  { id: 'zh-extra-058', text: '请给我吸管。', pinyin: 'qǐng gěi wǒ xī guǎn', japanese: 'ストローをください。', kana: 'チン ゲイ ウォ シー グアン', scene: 'ストローをお願いする', category: 'cafe', spotId: 'cafe' },
  { id: 'zh-extra-059', text: '这个很香。', pinyin: 'zhè ge hěn xiāng', japanese: 'いい香りです。', kana: 'ジョー ガ ヘン シアン', scene: '飲み物の感想を言う', category: 'cafe', spotId: 'cafe' },
  { id: 'zh-extra-060', text: '我想坐这里。', pinyin: 'wǒ xiǎng zuò zhè lǐ', japanese: 'ここに座りたいです。', kana: 'ウォ シアン ズオ ジョー リー', scene: '席について聞く', category: 'cafe', spotId: 'cafe' },
  { id: 'zh-extra-061', text: '请给我筷子。', pinyin: 'qǐng gěi wǒ kuài zi', japanese: '箸をください。', kana: 'チン ゲイ ウォ クアイ ズ', scene: '食器をお願いする', category: 'restaurant', spotId: 'restaurant' },
  { id: 'zh-extra-062', text: '请给我勺子。', pinyin: 'qǐng gěi wǒ sháo zi', japanese: 'スプーンをください。', kana: 'チン ゲイ ウォ シャオ ズ', scene: '食器をお願いする', category: 'restaurant', spotId: 'restaurant' },
  { id: 'zh-extra-063', text: '有推荐菜吗？', pinyin: 'yǒu tuī jiàn cài ma', japanese: 'おすすめ料理はありますか？', kana: 'ヨウ トゥイ ジエン ツァイ マ', scene: 'おすすめを聞く', category: 'restaurant', spotId: 'restaurant' },
  { id: 'zh-extra-064', text: '我不吃肉。', pinyin: 'wǒ bù chī ròu', japanese: '肉は食べません。', kana: 'ウォ ブー チー ロウ', scene: '食べられないものを伝える', category: 'restaurant', spotId: 'restaurant' },
  { id: 'zh-extra-065', text: '我不吃辣。', pinyin: 'wǒ bù chī là', japanese: '辛いものは食べません。', kana: 'ウォ ブー チー ラー', scene: '辛さを避けたい時', category: 'restaurant', spotId: 'restaurant' },
  { id: 'zh-extra-066', text: '这个菜很好吃。', pinyin: 'zhè ge cài hěn hǎo chī', japanese: 'この料理はとてもおいしいです。', kana: 'ジョー ガ ツァイ ヘン ハオ チー', scene: '料理の感想を言う', category: 'restaurant', spotId: 'restaurant' },
  { id: 'zh-extra-067', text: '可以分开付吗？', pinyin: 'kě yǐ fēn kāi fù ma', japanese: '別々に払えますか？', kana: 'クー イー フェン カイ フー マ', scene: '会計を分けたい時', category: 'restaurant', spotId: 'restaurant' },
  { id: 'zh-extra-068', text: '请打包。', pinyin: 'qǐng dǎ bāo', japanese: '持ち帰りにしてください。', kana: 'チン ダー バオ', scene: '残りを持ち帰る', category: 'restaurant', spotId: 'restaurant' },
  { id: 'zh-extra-069', text: '我想预约。', pinyin: 'wǒ xiǎng yù yuē', japanese: '予約したいです。', kana: 'ウォ シアン ユー ユエ', scene: '予約をする', category: 'restaurant', spotId: 'restaurant' },
  { id: 'zh-extra-070', text: '有空位吗？', pinyin: 'yǒu kòng wèi ma', japanese: '空席はありますか？', kana: 'ヨウ コン ウェイ マ', scene: '席があるか聞く', category: 'restaurant', spotId: 'restaurant' },
  { id: 'zh-extra-071', text: '请问，地铁站在哪里？', pinyin: 'qǐng wèn, dì tiě zhàn zài nǎ lǐ', japanese: 'すみません、地下鉄の駅はどこですか？', kana: 'チン ウェン ディー ティエ ジャン ザイ ナー リー', scene: '地下鉄駅を聞く', category: 'direction', spotId: 'station' },
  { id: 'zh-extra-072', text: '往左走。', pinyin: 'wǎng zuǒ zǒu', japanese: '左へ行きます。', kana: 'ワン ズオ ゾウ', scene: '道順を言う', category: 'direction', spotId: 'station' },
  { id: 'zh-extra-073', text: '往右走。', pinyin: 'wǎng yòu zǒu', japanese: '右へ行きます。', kana: 'ワン ヨウ ゾウ', scene: '道順を言う', category: 'direction', spotId: 'station' },
  { id: 'zh-extra-074', text: '一直走。', pinyin: 'yì zhí zǒu', japanese: 'まっすぐ行きます。', kana: 'イー ジー ゾウ', scene: '道順を言う', category: 'direction', spotId: 'station' },
  { id: 'zh-extra-075', text: '在前面。', pinyin: 'zài qián miàn', japanese: '前にあります。', kana: 'ザイ チエン ミエン', scene: '場所を説明する', category: 'direction', spotId: 'station' },
  { id: 'zh-extra-076', text: '在后面。', pinyin: 'zài hòu miàn', japanese: '後ろにあります。', kana: 'ザイ ホウ ミエン', scene: '場所を説明する', category: 'direction', spotId: 'station' },
  { id: 'zh-extra-077', text: '离这里远吗？', pinyin: 'lí zhè lǐ yuǎn ma', japanese: 'ここから遠いですか？', kana: 'リー ジョー リー ユエン マ', scene: '距離を聞く', category: 'direction', spotId: 'station' },
  { id: 'zh-extra-078', text: '走路五分钟。', pinyin: 'zǒu lù wǔ fēn zhōng', japanese: '歩いて5分です。', kana: 'ゾウ ルー ウー フェン ジョン', scene: '所要時間を言う', category: 'direction', spotId: 'station' },
  { id: 'zh-extra-079', text: '我在找车站。', pinyin: 'wǒ zài zhǎo chē zhàn', japanese: '駅を探しています。', kana: 'ウォ ザイ ジャオ チュー ジャン', scene: '探している場所を伝える', category: 'direction', spotId: 'station' },
  { id: 'zh-extra-080', text: '请带我去这里。', pinyin: 'qǐng dài wǒ qù zhè lǐ', japanese: 'ここへ連れて行ってください。', kana: 'チン ダイ ウォ チュー ジョー リー', scene: '行き先を見せてお願いする', category: 'direction', spotId: 'station' },
  { id: 'zh-extra-081', text: '我想换房间。', pinyin: 'wǒ xiǎng huàn fáng jiān', japanese: '部屋を変えたいです。', kana: 'ウォ シアン ホワン ファン ジエン', scene: '部屋の変更をお願いする', category: 'hotel', spotId: 'hotel' },
  { id: 'zh-extra-082', text: '空调不能用。', pinyin: 'kōng tiáo bù néng yòng', japanese: 'エアコンが使えません。', kana: 'コン ティアオ ブー ノン ヨン', scene: '設備の不具合を伝える', category: 'hotel', spotId: 'hotel' },
  { id: 'zh-extra-083', text: '房间很干净。', pinyin: 'fáng jiān hěn gān jìng', japanese: '部屋はきれいです。', kana: 'ファン ジエン ヘン ガン ジン', scene: '部屋の感想を言う', category: 'hotel', spotId: 'hotel' },
  { id: 'zh-extra-084', text: '有早餐吗？', pinyin: 'yǒu zǎo cān ma', japanese: '朝食はありますか？', kana: 'ヨウ ザオ ツァン マ', scene: '朝食を聞く', category: 'hotel', spotId: 'hotel' },
  { id: 'zh-extra-085', text: '早餐几点开始？', pinyin: 'zǎo cān jǐ diǎn kāi shǐ', japanese: '朝食は何時からですか？', kana: 'ザオ ツァン ジー ディエン カイ シー', scene: '朝食時間を聞く', category: 'hotel', spotId: 'hotel' },
  { id: 'zh-extra-086', text: '我需要毛巾。', pinyin: 'wǒ xū yào máo jīn', japanese: 'タオルが必要です。', kana: 'ウォ シュ ヤオ マオ ジン', scene: '備品をお願いする', category: 'hotel', spotId: 'hotel' },
  { id: 'zh-extra-087', text: '请打扫一下房间。', pinyin: 'qǐng dǎ sǎo yí xià fáng jiān', japanese: '部屋を掃除してください。', kana: 'チン ダー サオ イー シア ファン ジエン', scene: '清掃をお願いする', category: 'hotel', spotId: 'hotel' },
  { id: 'zh-extra-088', text: '可以晚点退房吗？', pinyin: 'kě yǐ wǎn diǎn tuì fáng ma', japanese: '遅めにチェックアウトできますか？', kana: 'クー イー ワン ディエン トゥイ ファン マ', scene: 'チェックアウト時間を相談する', category: 'hotel', spotId: 'hotel' },
  { id: 'zh-extra-089', text: '前台在哪里？', pinyin: 'qián tái zài nǎ lǐ', japanese: 'フロントはどこですか？', kana: 'チエン タイ ザイ ナー リー', scene: 'フロントの場所を聞く', category: 'hotel', spotId: 'hotel' },
  { id: 'zh-extra-090', text: '我把钥匙丢了。', pinyin: 'wǒ bǎ yào shi diū le', japanese: '鍵をなくしました。', kana: 'ウォ バー ヤオ シ ディウ ラ', scene: '鍵をなくした時', category: 'hotel', spotId: 'hotel' },
  { id: 'zh-extra-091', text: '我今天在家工作。', pinyin: 'wǒ jīn tiān zài jiā gōng zuò', japanese: '今日は在宅勤務です。', kana: 'ウォ ジン ティエン ザイ ジャー ゴン ズオ', scene: '勤務場所を伝える', category: 'business_basic', spotId: 'office' },
  { id: 'zh-extra-092', text: '我现在有空。', pinyin: 'wǒ xiàn zài yǒu kòng', japanese: '今、空いています。', kana: 'ウォ シエン ザイ ヨウ コン', scene: '空き時間を伝える', category: 'business_basic', spotId: 'office' },
  { id: 'zh-extra-093', text: '我现在有点忙。', pinyin: 'wǒ xiàn zài yǒu diǎn máng', japanese: '今、少し忙しいです。', kana: 'ウォ シエン ザイ ヨウ ディエン マン', scene: '忙しいことを伝える', category: 'business_basic', spotId: 'office' },
  { id: 'zh-extra-094', text: '我会发邮件给你。', pinyin: 'wǒ huì fā yóu jiàn gěi nǐ', japanese: 'メールを送ります。', kana: 'ウォ ホイ ファー ヨウ ジエン ゲイ ニー', scene: '連絡方法を伝える', category: 'business_basic', spotId: 'office' },
  { id: 'zh-extra-095', text: '请确认一下。', pinyin: 'qǐng què rèn yí xià', japanese: '確認してください。', kana: 'チン チュエ レン イー シア', scene: '確認をお願いする', category: 'business_basic', spotId: 'office' },
  { id: 'zh-extra-096', text: '会议几点开始？', pinyin: 'huì yì jǐ diǎn kāi shǐ', japanese: '会議は何時に始まりますか？', kana: 'ホイ イー ジー ディエン カイ シー', scene: '会議時間を聞く', category: 'business_basic', spotId: 'office' },
  { id: 'zh-extra-097', text: '我同意。', pinyin: 'wǒ tóng yì', japanese: '賛成です。', kana: 'ウォ トン イー', scene: '同意を伝える', category: 'business_basic', spotId: 'office' },
  { id: 'zh-extra-098', text: '我有一个问题。', pinyin: 'wǒ yǒu yí ge wèn tí', japanese: '質問があります。', kana: 'ウォ ヨウ イー ガ ウェン ティー', scene: '質問したい時', category: 'business_basic', spotId: 'office' },
  { id: 'zh-extra-099', text: '可以改时间吗？', pinyin: 'kě yǐ gǎi shí jiān ma', japanese: '時間を変更できますか？', kana: 'クー イー ガイ シー ジエン マ', scene: '時間変更を相談する', category: 'business_basic', spotId: 'office' },
  { id: 'zh-extra-100', text: '今天辛苦了。', pinyin: 'jīn tiān xīn kǔ le', japanese: '今日はお疲れさまでした。', kana: 'ジン ティエン シン クー ラ', scene: '仕事終わりのあいさつ', category: 'business_basic', spotId: 'office' },
];

const buildChoices = (
  phrase: ChineseExtraPhraseSeed,
  index: number,
  allPhrases: ChineseExtraPhraseSeed[]
): string[] => {
  const sameCategoryChoices = allPhrases
    .filter((candidate) => candidate.category === phrase.category && candidate.id !== phrase.id)
    .map((candidate) => candidate.text);
  const sameSpotChoices = allPhrases
    .filter((candidate) => candidate.spotId === phrase.spotId && candidate.id !== phrase.id)
    .map((candidate) => candidate.text);
  const fallbackChoices = allPhrases
    .filter((candidate) => candidate.id !== phrase.id)
    .map((candidate) => candidate.text);
  const candidates = [...sameCategoryChoices, ...sameSpotChoices, ...fallbackChoices];
  const wrongChoices: string[] = [];

  for (let offset = 1; wrongChoices.length < 3 && offset <= candidates.length * 2; offset += 1) {
    const candidate = candidates[(index + offset * 5) % candidates.length];

    if (candidate !== phrase.text && !wrongChoices.includes(candidate)) {
      wrongChoices.push(candidate);
    }
  }

  return [phrase.text, ...wrongChoices];
};

export const CHINESE_EXTRA_PHRASES: Phrase[] = chineseExtraPhraseSeeds.map((phrase, index, allPhrases) => ({
  ...phrase,
  language: 'chinese',
  english: phrase.text,
  choices: buildChoices(phrase, index, allPhrases),
}));
