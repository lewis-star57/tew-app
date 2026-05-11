import { useState } from 'react';
import { PhraseCard } from '../components/PhraseCard';
import { TaffyCharacter } from '../components/TaffyCharacter';
import { TaffyMoodPreview } from '../components/TaffyMoodPreview';
import type { Phrase } from '../types/phrase';

interface ReviewScreenProps {
  weakPhrases: Phrase[];
  masteredPhrases: Phrase[];
  onRemoveWeakPhrase: (phraseId: string) => void;
  onMarkPhraseMastered: (phraseId: string) => void;
  onUnmarkPhraseMastered: (phraseId: string) => void;
  onStartLesson: () => void;
  onResetProgress: () => void;
}

export function ReviewScreen({
  weakPhrases,
  masteredPhrases,
  onRemoveWeakPhrase,
  onMarkPhraseMastered,
  onUnmarkPhraseMastered,
  onStartLesson,
  onResetProgress,
}: ReviewScreenProps) {
  const hasWeakPhrases = weakPhrases.length > 0;
  const hasMasteredPhrases = masteredPhrases.length > 0;
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  return (
    <main className="screen">
      <header className="screenHeader">
        <p className="eyebrow">復習</p>
        <h1>苦手フレーズ置き場</h1>
      </header>
      <TaffyCharacter
        compact
        mood="thinking"
        message={
          hasWeakPhrases
            ? 'ここはできなかった場所ではなく、もう一度会えるフレーズの場所です。'
            : '今は苦手フレーズがありません。今日のミッションから始めましょう。'
        }
      />
      {hasWeakPhrases ? (
        <div className="reviewList">
          {weakPhrases.map((phrase) => (
            <div className="reviewItem" key={phrase.id}>
              <PhraseCard phrase={phrase} onMarkMastered={onMarkPhraseMastered} />
              <button className="calmButton" type="button" onClick={() => onRemoveWeakPhrase(phrase.id)}>
                覚えた🐶
              </button>
            </div>
          ))}
        </div>
      ) : (
        <section className="panel emptyPanel">
          <h2>復習リストは空です</h2>
          <p>クイズで迷ったフレーズが出たら、ここに自動で保存されます。</p>
          <button className="primaryButton" type="button" onClick={onStartLesson}>
            今日のレッスンへ
          </button>
        </section>
      )}
      <details className="panel masteredPhrasePanel">
        <summary>マスター済みフレーズ {masteredPhrases.length}</summary>
        {hasMasteredPhrases ? (
          <div className="reviewList">
            {masteredPhrases.map((phrase) => (
              <div className="reviewItem" key={phrase.id}>
                <PhraseCard phrase={phrase} isMastered />
                <button
                  className="secondaryButton"
                  type="button"
                  onClick={() => onUnmarkPhraseMastered(phrase.id)}
                >
                  もう一度出題する
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="masteredEmptyText">まだマスター済みフレーズはありません。</p>
        )}
      </details>
      <details className="panel resetPanel">
        <summary>データ管理</summary>
        <div className="resetPanelContent">
          <h2>学習データをリセット</h2>
          <p>XP（経験値）、レベル、おやつ、連続日数、苦手フレーズを最初からに戻せます。</p>
          {isConfirmingReset ? (
            <div className="resetActions">
              <button className="dangerButton" type="button" onClick={onResetProgress}>
                本当にリセットする
              </button>
              <button className="secondaryButton" type="button" onClick={() => setIsConfirmingReset(false)}>
                キャンセル
              </button>
            </div>
          ) : (
            <button className="dangerButton" type="button" onClick={() => setIsConfirmingReset(true)}>
              学習データをリセット
            </button>
          )}
        </div>
      </details>
      <TaffyMoodPreview />
    </main>
  );
}
