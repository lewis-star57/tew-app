import { RewardPanel } from '../components/RewardPanel';
import { StatusPanel } from '../components/StatusPanel';
import { TaffyCharacter, type TaffyMood } from '../components/TaffyCharacter';
import type { LearningProgress, LessonResult } from '../types/progress';
import type { SpotCompleteReward } from '../types/walk';

interface ResultScreenProps {
  progress: LearningProgress;
  result: LessonResult | null;
  spotCompleteReward?: SpotCompleteReward | null;
  completedToday: boolean;
  todayKey: string;
  onBackHome: () => void;
  onReview: () => void;
}

export function ResultScreen({
  progress,
  result,
  spotCompleteReward,
  completedToday,
  todayKey,
  onBackHome,
  onReview,
}: ResultScreenProps) {
  const taffyMood: TaffyMood = !result
    ? 'main'
    : spotCompleteReward
      ? 'celebrate'
    : result.leveledUp
      ? 'celebrate'
      : result.mode === 'viewOnly'
        ? 'sleepy'
        : result.mode === 'extraQuiz' && result.bonusTreatsGained > 0
          ? 'celebrate'
          : result.mode === 'extraQuiz'
            ? 'jump'
            : result.mode === 'dailyQuiz' &&
                result.totalQuestions > 0 &&
                result.correctCount === result.totalQuestions
              ? 'proud'
              : result.mode === 'dailyQuiz' && !result.alreadyCompletedToday
                ? 'cheer'
                : result.totalQuestions >= 5
                  ? 'tired'
                : 'cheer';

  return (
    <main className="screen">
      <header className="screenHeader">
        <p className="eyebrow">結果</p>
        <h1>今日の小さな前進</h1>
      </header>
      <TaffyCharacter result mood={taffyMood} message={result?.gentleMessage ?? '短い時間でも、開いたことがいちばんの成果です。'} />
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
      {result ? (
        <RewardPanel result={result} />
      ) : (
        <section className="panel">
          <h2>まだ結果はありません</h2>
          <p>ホームから今日のミッションを始めると、ここに結果が表示されます。</p>
        </section>
      )}
      <StatusPanel progress={progress} completedToday={completedToday} todayKey={todayKey} />
      <div className="buttonStack">
        <button className="primaryButton" type="button" onClick={onBackHome}>
          ホームへ
        </button>
        <button className="secondaryButton" type="button" onClick={onReview}>
          苦手フレーズを見る
        </button>
      </div>
    </main>
  );
}
