import { TaffyCharacter, type TaffyMood } from '../components/TaffyCharacter';
import { getDedicatedSpotPhrases, getSpotPhrases, WALK_POINTS_PER_SPOT } from '../game/walkRules';
import type { Phrase } from '../types/phrase';
import type { LearningProgress, LessonResult } from '../types/progress';
import type { SpotCompleteReward, SpotId, WalkSpot } from '../types/walk';

interface WalkMapScreenProps {
  progress: LearningProgress;
  lastResult: LessonResult | null;
  spots: WalkSpot[];
  phrases: Phrase[];
  spotCompleteReward?: SpotCompleteReward | null;
  onPracticeSpot: (spotId: SpotId) => void;
  onPracticeMiniConversation: (spotId: SpotId) => void;
  onUnlockAllSpots: () => void;
  onAddWalkPoints: () => void;
  onResetWalkPoints: () => void;
  onResetUnlockedSpots: () => void;
  onMoveToSpot: (spotId: SpotId) => void;
}

const getRepresentativePhrases = (phrases: Phrase[], spotId: SpotId): Phrase[] => {
  return getSpotPhrases(phrases, spotId).slice(0, 3);
};

export function WalkMapScreen({
  progress,
  lastResult,
  spots,
  phrases,
  spotCompleteReward,
  onPracticeSpot,
  onPracticeMiniConversation,
  onUnlockAllSpots,
  onAddWalkPoints,
  onResetWalkPoints,
  onResetUnlockedSpots,
  onMoveToSpot,
}: WalkMapScreenProps) {
  const phraseLanguage = phrases[0]?.language ?? 'english';
  const completedSpotIds =
    progress.completedSpotIdsByLanguage?.[phraseLanguage] ??
    (phraseLanguage === 'english' ? progress.completedSpotIds : []);
  const newlyUnlockedSpotIds = progress.unlockedSpotIds.filter(
    (spotId) => !progress.visitedSpotIds.includes(spotId)
  );
  const pointRemainder = progress.walkPoints % WALK_POINTS_PER_SPOT;
  const pointsToNext = pointRemainder === 0 ? WALK_POINTS_PER_SPOT : WALK_POINTS_PER_SPOT - pointRemainder;

  return (
    <main className="screen">
      <header className="screenHeader">
        <p className="eyebrow">Taffyと散歩</p>
        <h1>散歩マップ</h1>
      </header>
      <section className="panel walkSummary">
        <div>
          <span>散歩ポイント</span>
          <strong>{progress.walkPoints}</strong>
        </div>
        <p>
          {progress.unlockedSpotIds.length >= spots.length
            ? 'すべてのスポットを解放済みです。Taffyと好きな場所を復習できます。'
            : `次のスポットまであと ${pointsToNext} ポイントです。`}
        </p>
      </section>
      {spotCompleteReward ? (
        <section className="panel spotRewardPanel">
          <p className="eyebrow">この場所をコンプリート！</p>
          <h2>{spotCompleteReward.spotName}をコンプリート！</h2>
          <p>Taffyと一緒に、この場所の会話をマスターしたよ！</p>
          <strong>
            おやつ +{spotCompleteReward.treatsGained} / XP（経験値） +{spotCompleteReward.xpGained}
          </strong>
        </section>
      ) : null}
      <div className="walkCourse" aria-label="散歩コース">
        {spots.map((spot, index) => {
          const isUnlocked = progress.unlockedSpotIds.includes(spot.id);
          const isCurrent = progress.currentSpotId === spot.id;
          const isNewlyUnlocked = newlyUnlockedSpotIds.includes(spot.id);
          const representativePhrases = getRepresentativePhrases(phrases, spot.id);
          const dedicatedPhrases = getDedicatedSpotPhrases(phrases, spot.id);
          const studiedPhraseIdSet = new Set(progress.spotStudiedPhraseIds?.[spot.id] ?? []);
          const studiedPhraseCount = dedicatedPhrases.filter((phrase) =>
            studiedPhraseIdSet.has(phrase.id)
          ).length;
          const totalSpotPhraseCount = dedicatedPhrases.length;
          const progressPercent =
            totalSpotPhraseCount > 0
              ? Math.round((studiedPhraseCount / totalSpotPhraseCount) * 100)
              : 0;
          const isComplete =
            completedSpotIds.includes(spot.id) ||
            (totalSpotPhraseCount > 0 && studiedPhraseCount === totalSpotPhraseCount);
          const requiredPoints = index * WALK_POINTS_PER_SPOT;
          const spotClassName = `spot-${spot.id.replace(/_/g, '-')}`;
          const shouldShowTired =
            !isNewlyUnlocked &&
            lastResult?.totalQuestions !== undefined &&
            lastResult.totalQuestions >= 5 &&
            lastResult.mode !== 'viewOnly';
          const taffyMood: TaffyMood = isComplete
            ? 'celebrate'
            : isNewlyUnlocked
              ? 'jump'
              : shouldShowTired
                ? 'tired'
                : 'happy';

          return (
            <section
              className={[
                'panel',
                'walkSpotCard',
                spotClassName,
                isUnlocked ? 'unlocked' : 'locked',
                isCurrent ? 'current' : '',
                isComplete ? 'complete' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              key={spot.id}
            >
              <div className="walkSpotHeader">
                <div className="walkSpotTitleRow">
                  <span className="spotIcon" aria-hidden="true">{spot.icon}</span>
                  <div>
                    <p className="eyebrow">{index + 1}つ目の場所</p>
                    <h2>{spot.name}</h2>
                  </div>
                </div>
                <span className={isUnlocked ? 'spotBadge unlocked' : 'spotBadge locked'}>
                  {isUnlocked ? (isCurrent ? '現在地' : '解放済み') : `${requiredPoints}ptで解放`}
                </span>
              </div>
              {isCurrent ? (
                <TaffyCharacter
                  compact
                  mood={taffyMood}
                  message={
                    isNewlyUnlocked
                      ? '新しい場所に到着！Taffyもジャンプしています。'
                      : isComplete
                        ? 'コンプリート！Taffyもお祝いしています。'
                      : shouldShowTired
                        ? '今日もよく歩きました。Taffyも少し休憩したそうです。'
                      : 'ここが今のTaffyの散歩スポットです。'
                  }
                />
              ) : null}
              <p className="walkDescription">{spot.description}</p>
              <div className="walkTheme">
                <span>テーマ</span>
                <strong>{spot.theme}</strong>
              </div>
              <div className="spotProgress">
                <div className="spotProgressHeader">
                  <span>
                    {studiedPhraseCount} / {totalSpotPhraseCount} フレーズ学習済み
                  </span>
                  <strong>達成率 {progressPercent}%</strong>
                </div>
                <div className="spotProgressTrack" aria-hidden="true">
                  <span style={{ width: `${progressPercent}%` }} />
                </div>
                {isComplete ? <p className="spotCompleteBadge">✅ コンプリート</p> : null}
              </div>
              <div className="walkPhraseList">
                <span>代表フレーズ</span>
                {representativePhrases.map((phrase) => (
                  <p key={phrase.id}>
                    {phrase.text}
                    {phrase.language === 'chinese' && phrase.pinyin ? <small>{phrase.pinyin}</small> : null}
                  </p>
                ))}
              </div>
              <button
                className={isUnlocked ? 'primaryButton' : 'secondaryButton'}
                type="button"
                disabled={!isUnlocked}
                onClick={() => onPracticeSpot(spot.id)}
              >
                この場所の会話を練習する
              </button>
              <button
                className="secondaryButton"
                type="button"
                disabled={!isUnlocked}
                onClick={() => onPracticeMiniConversation(spot.id)}
              >
                ミニ会話を練習する
              </button>
            </section>
          );
        })}
      </div>
      <details className="panel walkDevPanel">
        <summary>開発用：散歩マップテスト</summary>
        <div className="walkDevStatus">
          <span>walkPoints: {progress.walkPoints}</span>
          <span>解放: {progress.unlockedSpotIds.length} / {spots.length}</span>
          <span>現在地: {progress.currentSpotId}</span>
        </div>
        <div className="walkDevButtons">
          <button className="moodButton" type="button" onClick={onUnlockAllSpots}>
            全スポットを解放
          </button>
          <button className="moodButton" type="button" onClick={onAddWalkPoints}>
            walkPointsを+2
          </button>
          <button className="moodButton" type="button" onClick={onResetWalkPoints}>
            walkPointsをリセット
          </button>
          <button className="moodButton" type="button" onClick={onResetUnlockedSpots}>
            unlockedSpotIdsをリセット
          </button>
          {spots.map((spot) => (
            <button
              className="moodButton"
              key={spot.id}
              type="button"
              onClick={() => onMoveToSpot(spot.id)}
            >
              {spot.name}へ移動
            </button>
          ))}
        </div>
      </details>
    </main>
  );
}
