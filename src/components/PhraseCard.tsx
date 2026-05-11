import { CATEGORY_LABELS } from '../constants/categories';
import { SpeechButtons } from './SpeechButtons';
import type { Phrase } from '../types/phrase';

interface PhraseCardProps {
  phrase: Phrase;
  isMastered?: boolean;
  onMarkMastered?: (phraseId: string) => void;
}

export function PhraseCard({ phrase, isMastered = false, onMarkMastered }: PhraseCardProps) {
  return (
    <article className="phraseCard">
      <span className={`categoryPill ${phrase.category}`}>{CATEGORY_LABELS[phrase.category]}</span>
      <h3>{phrase.text}</h3>
      {phrase.language === 'chinese' && phrase.pinyin ? (
        <p className="phrasePinyin">{phrase.pinyin}</p>
      ) : null}
      <p className="translation">{phrase.japanese}</p>
      <dl className="phraseDetails">
        <div>
          <dt>カタカナ目安</dt>
          <dd>{phrase.kana}</dd>
        </div>
        <div>
          <dt>使う場面</dt>
          <dd>{phrase.scene}</dd>
        </div>
      </dl>
      <SpeechButtons text={phrase.text} language={phrase.language} />
      {onMarkMastered || isMastered ? (
        <div className="phraseCardActions">
          {isMastered ? (
            <span className="masteredBadge">マスター済み🐶</span>
          ) : onMarkMastered ? (
            <button className="calmButton" type="button" onClick={() => onMarkMastered(phrase.id)}>
              完全に覚えた🐶
            </button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
