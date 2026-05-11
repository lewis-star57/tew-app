import { useEffect, useState } from 'react';
import { PhraseCard } from '../components/PhraseCard';
import { TaffyCharacter } from '../components/TaffyCharacter';
import type { Phrase } from '../types/phrase';
import type { SpotCompleteReward } from '../types/walk';

interface LessonScreenProps {
  title?: string;
  message?: string;
  missionPhrases: Phrase[];
  masteredPhraseIds: string[];
  onCompleteViewOnly: () => void;
  onStartQuiz: () => void;
  onViewPhrase?: (phraseId: string) => void;
  onMarkPhraseMastered?: (phraseId: string) => void;
  spotPracticeProgress?: {
    studiedCount: number;
    totalCount: number;
    walkTitle: string;
    isTodayRecommended: boolean;
    isTodayRecommendedComplete: boolean;
    isReviewWalk: boolean;
  };
  spotCompleteReward?: SpotCompleteReward | null;
  viewOnlyButtonLabel?: string;
}

export function LessonScreen({
  title = '今日の3フレーズ',
  message = '英文、日本語訳、使う場面、カタカナ目安をゆっくり見ます。',
  missionPhrases,
  masteredPhraseIds,
  onCompleteViewOnly,
  onStartQuiz,
  onViewPhrase,
  onMarkPhraseMastered,
  spotPracticeProgress,
  spotCompleteReward,
  viewOnlyButtonLabel = '今日は見るだけで完了',
}: LessonScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPhrase = missionPhrases[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === missionPhrases.length - 1;
  const remainingSpotPhrases = spotPracticeProgress
    ? Math.max(spotPracticeProgress.totalCount - spotPracticeProgress.studiedCount, 0)
    : 0;

  useEffect(() => {
    if (currentPhrase) {
      onViewPhrase?.(currentPhrase.id);
    }
  }, [currentPhrase?.id]);

  if (!currentPhrase) {
    return (
      <main className="screen">
        <header className="screenHeader">
          <p className="eyebrow">レッスン</p>
          <h1>{title}</h1>
        </header>
        <TaffyCharacter compact mood="thinking" message="表示できるフレーズを準備しています。" />
      </main>
    );
  }

  return (
    <main className="screen">
      <header className="screenHeader">
        <p className="eyebrow">レッスン</p>
        <h1>{title}</h1>
      </header>
      <TaffyCharacter
        compact
        mood={spotCompleteReward ? 'celebrate' : 'happy'}
        message={spotCompleteReward ? 'コンプリート！Taffyもお祝いしています。' : message}
      />
      {spotCompleteReward ? (
        <section className="panel spotRewardPanel">
          <p className="eyebrow">この場所をコンプリート！</p>
          <h2>{spotCompleteReward.spotName}をコンプリート！</h2>
          <p>Taffyと一緒に、この場所の英会話をマスターしたよ！</p>
          <strong>
            おやつ +{spotCompleteReward.treatsGained} / XP（経験値） +{spotCompleteReward.xpGained}
          </strong>
        </section>
      ) : null}
      {spotPracticeProgress ? (
        <section className="panel spotPracticeProgressPanel">
          <p className="eyebrow">
            {spotPracticeProgress.isTodayRecommendedComplete
              ? spotPracticeProgress.walkTitle
              : spotPracticeProgress.isTodayRecommended
                ? `${spotPracticeProgress.walkTitle}中！`
                : 'スポット練習中'}
          </p>
          <h2>
            {spotPracticeProgress.isTodayRecommendedComplete
              ? `${spotPracticeProgress.walkTitle}は完了済みだよ🐶`
              : spotPracticeProgress.isTodayRecommended && !spotPracticeProgress.isReviewWalk
                ? remainingSpotPhrases > 0
                  ? `あと${remainingSpotPhrases}フレーズで今日の散歩完了だよ🐶`
                  : '10 / 10 まで進みました！'
                : 'この場所を少しずつ見ていこう'}
          </h2>
          <p>
            この場所は {spotPracticeProgress.studiedCount} / {spotPracticeProgress.totalCount} フレーズ学習済み
          </p>
          <p>
            {spotPracticeProgress.isTodayRecommendedComplete
              ? '復習として気軽に見ていこう！'
              : spotPracticeProgress.isTodayRecommended && spotPracticeProgress.isReviewWalk
                ? '「今日はここまでにする」を押すと、今日の復習散歩が完了します。'
                : spotPracticeProgress.isTodayRecommended
                  ? 'この場所を10/10まで進めると、今日のおすすめ散歩が完了します。'
                  : '10 / 10 でこの場所をコンプリート！'}
          </p>
        </section>
      ) : null}
      <PhraseCard
        phrase={currentPhrase}
        isMastered={masteredPhraseIds.includes(currentPhrase.id)}
        onMarkMastered={onMarkPhraseMastered}
      />
      <div className="stepControls">
        <button
          className="secondaryButton"
          type="button"
          onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
          disabled={isFirst}
        >
          前へ
        </button>
        <span>
          {currentIndex + 1} / {missionPhrases.length}
        </span>
        <button
          className="secondaryButton"
          type="button"
          onClick={() => setCurrentIndex((index) => Math.min(missionPhrases.length - 1, index + 1))}
          disabled={isLast}
        >
          次へ
        </button>
      </div>
      <div className="buttonStack">
        <button className="primaryButton" type="button" onClick={onStartQuiz}>
          クイズに進む
        </button>
        <button className="calmButton" type="button" onClick={onCompleteViewOnly}>
          {viewOnlyButtonLabel}
        </button>
      </div>
    </main>
  );
}
