import { DataManagementPanel } from '../components/DataManagementPanel';
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
  onBackupProgress: () => void;
  onRestoreProgress: (file: File) => Promise<string | null>;
  onShowTutorial: () => void;
  onResetProgress: () => void;
}

export function ReviewScreen({
  weakPhrases,
  masteredPhrases,
  onRemoveWeakPhrase,
  onMarkPhraseMastered,
  onUnmarkPhraseMastered,
  onStartLesson,
  onBackupProgress,
  onRestoreProgress,
  onShowTutorial,
  onResetProgress,
}: ReviewScreenProps) {
  const hasWeakPhrases = weakPhrases.length > 0;
  const hasMasteredPhrases = masteredPhrases.length > 0;

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
            ? '苦手は宝物だよ。少しずつ覚えよう🐶'
            : '今の苦手フレーズはありません。今日の足あとを増やそう🐾'
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
          <p>クイズで迷ったフレーズが出たら、ここに足あととして残ります🐾</p>
          <button className="primaryButton" type="button" onClick={onStartLesson}>
            今日のミッションへ
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
          <p className="masteredEmptyText">まだマスター済みフレーズはありません。少しずつ増やそう🐾</p>
        )}
      </details>
      <DataManagementPanel
        onBackupProgress={onBackupProgress}
        onRestoreProgress={onRestoreProgress}
        onShowTutorial={onShowTutorial}
        onResetProgress={onResetProgress}
      />
      <TaffyMoodPreview />
    </main>
  );
}
