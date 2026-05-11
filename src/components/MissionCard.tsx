import type { Phrase } from '../types/phrase';
import { SpeechButtons } from './SpeechButtons';

export type MissionPhraseKind = 'new' | 'review' | 'fill';

export interface MissionPhraseItem {
  phrase: Phrase;
  kind: MissionPhraseKind;
}

interface MissionCardProps {
  missionPhraseItems: MissionPhraseItem[];
  completedToday: boolean;
  onStartLesson: () => void;
  onStartDailyQuiz: () => void;
  onStartExtraQuiz: () => void;
  onCompleteViewOnly: () => void;
  onOpenReview: () => void;
}

const KIND_LABELS: Record<MissionPhraseKind, string> = {
  new: '新規',
  review: '復習',
  fill: 'おさらい',
};

export function MissionCard({
  missionPhraseItems,
  completedToday,
  onStartLesson,
  onStartDailyQuiz,
  onStartExtraQuiz,
  onCompleteViewOnly,
  onOpenReview,
}: MissionCardProps) {
  const newCount = missionPhraseItems.filter((item) => item.kind === 'new').length;
  const reviewCount = missionPhraseItems.filter((item) => item.kind === 'review').length;
  const fillCount = missionPhraseItems.filter((item) => item.kind === 'fill').length;

  return (
    <section className="panel missionPanel">
      <div className="sectionHeader">
        <p className="eyebrow">今日の5問ミッション</p>
        <h2>{completedToday ? '今日の5問は達成済みです' : '今日の5問ミッション'}</h2>
        <p className="missionSummary">
          新規 {newCount}問 / 復習 {reviewCount}問
          {fillCount > 0 ? ` / おさらい ${fillCount}問` : ''}
        </p>
      </div>
      <ol className="miniPhraseList" aria-label="今日の5問ミッション">
        {missionPhraseItems.map(({ phrase, kind }) => (
          <li className="miniPhraseItem" key={phrase.id}>
            <div className="miniPhraseMain">
              <div className="miniPhraseTextBlock">
                <span className="miniPhraseEnglish">{phrase.text}</span>
                {phrase.language === 'chinese' && phrase.pinyin ? (
                  <span className="miniPhrasePinyin">{phrase.pinyin}</span>
                ) : null}
                {phrase.language === 'chinese' ? (
                  <>
                    <span className="miniPhraseJapanese">{phrase.japanese}</span>
                    <span className="miniPhraseMeta">{phrase.kana}</span>
                    <span className="miniPhraseMeta">{phrase.scene}</span>
                  </>
                ) : null}
              </div>
              <span className={`missionPhraseTag ${kind}`}>{KIND_LABELS[kind]}</span>
            </div>
            <SpeechButtons text={phrase.text} language={phrase.language} compact />
          </li>
        ))}
      </ol>
      <div className="buttonStack">
        <button className="primaryButton" type="button" onClick={onStartDailyQuiz}>
          {completedToday ? 'もう一度5問チャレンジ' : '今日の5問チャレンジ'}
        </button>
        <button className="secondaryButton" type="button" onClick={onStartExtraQuiz}>
          おかわり10問
        </button>
        <button className="calmButton" type="button" onClick={onCompleteViewOnly}>
          今日は見るだけ
        </button>
        <button className="primaryButton" type="button" onClick={onStartLesson}>
          新規3フレーズを見る
        </button>
        <button className="textButton" type="button" onClick={onOpenReview}>
          苦手フレーズを復習
        </button>
      </div>
    </section>
  );
}
