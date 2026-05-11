import type { LessonResult } from '../types/progress';

interface RewardPanelProps {
  result: LessonResult;
}

export function RewardPanel({ result }: RewardPanelProps) {
  const quizText =
    result.totalQuestions > 0
      ? `${result.totalQuestions}問中 ${result.correctCount}問、ふれられました🐾`
      : '今日は見るだけで完了しました🐾';
  const resultTitle =
    result.mode === 'extraQuiz'
      ? 'おかわり10問完了'
      : result.mode === 'dailyQuiz'
        ? result.alreadyCompletedToday
          ? '今日の5問をもう一度'
          : '今日の5問完了'
        : result.mode === 'spotQuiz'
          ? '散歩スポット練習'
          : '見るだけ完了';

  return (
    <section className="panel rewardPanel">
      <p className="eyebrow">今日の結果</p>
      <h2>{resultTitle}🐾</h2>
      <div className="rewardGrid">
        <div>
          <span>XP（経験値）</span>
          <strong>+{result.xpGained}</strong>
        </div>
        <div>
          <span>おやつ</span>
          <strong>+{result.treatsGained}</strong>
        </div>
      </div>
      {result.bonusTreatsGained > 0 ? (
        <p className="resultSmall">8問以上正解ボーナス: おやつ +{result.bonusTreatsGained}🐾</p>
      ) : null}
      {result.walkPointsGained > 0 ? (
        <p className="resultSmall">散歩ポイント +{result.walkPointsGained}🐾</p>
      ) : null}
      {result.newlyUnlockedSpotIds.length > 0 ? (
        <p className="resultSmall">新しい散歩スポットが解放されました🐾</p>
      ) : null}
      <p className="resultSmall">{quizText}</p>
      {result.incorrectCount > 0 ? (
        <p className="resultSmall">復習リストに {result.incorrectCount} フレーズを保存しました🐾</p>
      ) : null}
      <p className="resultDate">日本時間 {result.completedDateJst}</p>
    </section>
  );
}
