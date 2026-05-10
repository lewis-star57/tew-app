import { CATEGORY_LABELS } from '../constants/categories';
import { SpeechButtons } from './SpeechButtons';
import type { Phrase } from '../types/phrase';

interface PhraseCardProps {
  phrase: Phrase;
}

export function PhraseCard({ phrase }: PhraseCardProps) {
  return (
    <article className="phraseCard">
      <span className={`categoryPill ${phrase.category}`}>{CATEGORY_LABELS[phrase.category]}</span>
      <h3>{phrase.text}</h3>
      <SpeechButtons text={phrase.text} />
      <p className="translation">{phrase.japanese}</p>
      <dl className="phraseDetails">
        <div>
          <dt>使う場面</dt>
          <dd>{phrase.scene}</dd>
        </div>
        <div>
          <dt>カタカナ目安</dt>
          <dd>{phrase.kana}</dd>
        </div>
      </dl>
    </article>
  );
}
