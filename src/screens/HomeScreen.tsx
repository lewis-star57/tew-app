import { MissionCard, type MissionPhraseItem } from '../components/MissionCard';
import { StatusPanel } from '../components/StatusPanel';
import { SpeechButtons } from '../components/SpeechButtons';
import { TaffyCarePanel } from '../components/TaffyCarePanel';
import { TaffyCharacter, type TaffyMood } from '../components/TaffyCharacter';
import { getJstHour, getPreviousDateKey } from '../game/dateRules';
import { getMonthlyStudyStats, getStudyDateStreak } from '../game/studyCalendarRules';
import type { Phrase } from '../types/phrase';
import type { LearningProgress } from '../types/progress';
import type { RecommendedWalkSpot, SpotId } from '../types/walk';

interface HomeScreenProps {
  progress: LearningProgress;
  missionPhraseItems: MissionPhraseItem[];
  recommendedWalkSpot: RecommendedWalkSpot;
  dailyPhrase: Phrase;
  todayKey: string;
  hasSpokenDailyPhrase: boolean;
  didSpeakDailyPhrase: boolean;
  completedToday: boolean;
  treatReactionMessage: string | null;
  didGiveTreat: boolean;
  didMoodLevelUp: boolean;
  treatReactionId: number;
  onGiveTreat: () => void;
  onStartLesson: () => void;
  onStartDailyQuiz: () => void;
  onStartExtraQuiz: () => void;
  onStartRecommendedWalk: (spotId: SpotId) => void;
  onSpeakDailyPhrase: () => void;
  onCompleteViewOnly: () => void;
  onOpenCalendar: () => void;
  onOpenReview: () => void;
}

export function HomeScreen({
  progress,
  missionPhraseItems,
  recommendedWalkSpot,
  dailyPhrase,
  todayKey,
  hasSpokenDailyPhrase,
  didSpeakDailyPhrase,
  completedToday,
  treatReactionMessage,
  didGiveTreat,
  didMoodLevelUp,
  treatReactionId,
  onGiveTreat,
  onStartLesson,
  onStartDailyQuiz,
  onStartExtraQuiz,
  onStartRecommendedWalk,
  onSpeakDailyPhrase,
  onCompleteViewOnly,
  onOpenCalendar,
  onOpenReview,
}: HomeScreenProps) {
  const monthlyStudyStats = getMonthlyStudyStats(progress.studyDates, todayKey);
  const studyDateStreak = getStudyDateStreak(progress.studyDates, todayKey);
  const hasGivenTreatToday = progress.lastTreatGivenDateJst === todayKey;
  const recommendedWalkComplete = (progress.completedDailyRecommendedWalkDates ?? []).includes(
    monthlyStudyStats.todayKey
  );
  const recommendedWalkTitle = recommendedWalkSpot.title;
  const recommendedWalkButtonLabel = recommendedWalkSpot.isReview ? '復習散歩へ' : 'おすすめ散歩へ';
  const recommendedWalkPracticeLabel = recommendedWalkSpot.isReview
    ? 'この場所を復習する'
    : 'この場所を練習する';
  const recommendedWalkMessage = recommendedWalkComplete
    ? `${recommendedWalkTitle}は完了したよ！`
    : recommendedWalkSpot.message;
  const recommendedWalkHint = recommendedWalkComplete
    ? 'Taffyとこの場所を歩ききったね🐶 明日は次の場所へ行こう！'
    : recommendedWalkSpot.completionHint;
  const canGiveTreat = progress.treats > 0;
  const todayRewardStats = progress.dailyRewardStats?.[monthlyStudyStats.todayKey] ?? {
    xp: 0,
    treats: 0,
  };
  const studyDateSet = new Set(progress.studyDates ?? []);
  const hasStudiedToday = studyDateSet.has(monthlyStudyStats.todayKey);
  const studiedYesterday = studyDateSet.has(getPreviousDateKey(todayKey));
  const todayMenuCompletedCount = [
    hasSpokenDailyPhrase,
    completedToday,
    recommendedWalkComplete,
    hasGivenTreatToday,
  ].filter(Boolean).length;
  const isTodayWalkComplete = todayMenuCompletedCount === 4;
  const isStreakAtRisk = !hasStudiedToday && studiedYesterday;
  const shouldShowLateReminder = isStreakAtRisk && getJstHour() >= 21;
  const taffyMood: TaffyMood = didMoodLevelUp
    ? 'celebrate'
    : didGiveTreat
      ? 'love'
      : didSpeakDailyPhrase
        ? 'love'
      : completedToday
        ? 'cheer'
        : shouldShowLateReminder
          ? 'sad'
          : 'happy';
  const taffyMessage =
    treatReactionMessage ??
    (didSpeakDailyPhrase
      ? 'いい声です！Taffyもにこにこ聞いています。'
      : null) ??
    (completedToday
      ? '今日も来てくれてありがとう。Taffyもにこにこです。'
      : shouldShowLateReminder
        ? '今日もTaffyと少しだけ英語さんぽしよう。見るだけでもOKだよ！'
        : '今日の5問、いっしょにゆっくり行こう！見るだけでもOKだよ。');

  return (
    <main className="screen">
      <header className="appHeader">
        <p className="appKicker">TEW</p>
        <h1>Taffy English Walk</h1>
      </header>
      <TaffyCharacter
        mood={taffyMood}
        message={taffyMessage}
        celebrate={didGiveTreat}
        celebrationId={treatReactionId}
        celebrationBadge={didGiveTreat ? 'ごきげん +1' : undefined}
      />
      <section className="panel todayMenuPanel">
        <div className="sectionHeader">
          <p className="eyebrow">今日のメニュー</p>
          <h2>今日のおすすめメニュー</h2>
        </div>
        <div className="todayMenuList">
          <article className={completedToday ? 'todayMenuItem complete' : 'todayMenuItem'}>
            <div className="todayMenuText">
              <span className="todayMenuTitle">
                {completedToday ? '✅ ' : ''}今日の5問ミッション
              </span>
              <span className={completedToday ? 'todayMenuStatus complete' : 'todayMenuStatus'}>
                {completedToday ? '完了' : '未完了'}
              </span>
            </div>
            <button className="primaryButton" type="button" onClick={onStartDailyQuiz}>
              5問チャレンジへ
            </button>
          </article>
          <article className={recommendedWalkComplete ? 'todayMenuItem complete' : 'todayMenuItem'}>
            <div className="todayMenuText">
              <span className="todayMenuTitle">
                {recommendedWalkComplete ? '✅ ' : ''}
                {recommendedWalkTitle}
              </span>
              <span className={recommendedWalkComplete ? 'todayMenuStatus complete' : 'todayMenuStatus ready'}>
                {recommendedWalkComplete ? '完了' : 'できる'}
              </span>
            </div>
            <button
              className="primaryButton"
              type="button"
              onClick={() => onStartRecommendedWalk(recommendedWalkSpot.spot.id)}
            >
              {recommendedWalkButtonLabel}
            </button>
          </article>
          <article className={hasGivenTreatToday ? 'todayMenuItem complete' : 'todayMenuItem'}>
            <div className="todayMenuText">
              <span className="todayMenuTitle">
                {hasGivenTreatToday ? '✅ ' : ''}Taffyにおやつ
              </span>
              <span
                className={[
                  'todayMenuStatus',
                  hasGivenTreatToday ? 'complete' : canGiveTreat ? 'ready' : 'empty',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {hasGivenTreatToday ? '完了' : canGiveTreat ? 'できる' : 'おやつなし'}
              </span>
            </div>
            <button
              className={canGiveTreat ? 'calmButton' : 'secondaryButton'}
              type="button"
              onClick={onGiveTreat}
              disabled={!canGiveTreat}
            >
              {canGiveTreat ? 'おやつをあげる' : 'おやつなし'}
            </button>
          </article>
        </div>
        {!isTodayWalkComplete ? (
          <p className="todayMenuProgressMessage">
            あと{4 - todayMenuCompletedCount}つで今日の英語さんぽ完了！ひとこと英会話は下のカードでできます。
          </p>
        ) : null}
      </section>
      {isTodayWalkComplete ? (
        <section className="panel todayCompletePanel">
          <TaffyCharacter
            compact
            mood="celebrate"
            message="Taffyも大よろこび！"
            celebrate
            celebrationId={todayRewardStats.xp + todayRewardStats.treats}
            celebrationBadge="今日の英語さんぽ完了"
          />
          <div className="sectionHeader">
            <p className="eyebrow">Complete</p>
            <h2>今日の英語さんぽ完了！</h2>
            <p className="todayCompleteMessage">Kiyo、今日もよくできたね🐶</p>
          </div>
          <div className="todayCompleteStats">
            <div>
              <span>今日の獲得XP（経験値）</span>
              <strong>+{todayRewardStats.xp}</strong>
            </div>
            <div>
              <span>今日獲得したおやつ</span>
              <strong>+{todayRewardStats.treats}</strong>
            </div>
          </div>
          <p className="todayCompletePaw">カレンダーに🐾がついたよ</p>
        </section>
      ) : null}
      <section className="panel dailyPhrasePanel">
        <p className="eyebrow">今日のひとこと英会話</p>
        <h2>{dailyPhrase.text}</h2>
        <SpeechButtons text={dailyPhrase.text} />
        <p className="translation">{dailyPhrase.japanese}</p>
        <dl className="phraseDetails">
          <div>
            <dt>使う場面</dt>
            <dd>{dailyPhrase.scene}</dd>
          </div>
          <div>
            <dt>カタカナ目安</dt>
            <dd>{dailyPhrase.kana}</dd>
          </div>
        </dl>
        <button
          className={hasSpokenDailyPhrase ? 'calmButton' : 'primaryButton'}
          type="button"
          onClick={onSpeakDailyPhrase}
          disabled={hasSpokenDailyPhrase}
        >
          {hasSpokenDailyPhrase ? '今日は声に出したよ' : '声に出した！'}
        </button>
        <p className="dailyPhraseReward">
          {hasSpokenDailyPhrase
            ? '今日のごほうび受け取り済み。英語さんぽ完了にも近づきました。'
            : '声に出すと XP（経験値） +5 / ごきげん +1。今日の英語さんぽ完了にも必要です。'}
        </p>
      </section>
      <MissionCard
        missionPhraseItems={missionPhraseItems}
        completedToday={completedToday}
        onStartLesson={onStartLesson}
        onStartDailyQuiz={onStartDailyQuiz}
        onStartExtraQuiz={onStartExtraQuiz}
        onCompleteViewOnly={onCompleteViewOnly}
        onOpenReview={onOpenReview}
      />
      <section className="panel recommendedWalkPanel">
        <div className="recommendedWalkHeader">
          <div>
            <p className="eyebrow">{recommendedWalkTitle}</p>
            <h2>{recommendedWalkSpot.spot.name}</h2>
          </div>
          <span className="recommendedWalkIcon" aria-hidden="true">
            {recommendedWalkSpot.spot.icon}
          </span>
        </div>
        <p className="recommendedWalkMessage">{recommendedWalkMessage}</p>
        <p className="recommendedWalkHint">{recommendedWalkHint}</p>
        <div className="recommendedWalkProgress">
          <span>
            進捗: {recommendedWalkSpot.studiedCount} / {recommendedWalkSpot.totalCount}
          </span>
          <strong>{recommendedWalkSpot.progressPercent}%</strong>
        </div>
        <div className="spotProgressTrack" aria-hidden="true">
          <span style={{ width: `${recommendedWalkSpot.progressPercent}%` }} />
        </div>
        <button
          className="primaryButton"
          type="button"
          onClick={() => onStartRecommendedWalk(recommendedWalkSpot.spot.id)}
        >
          {recommendedWalkPracticeLabel}
        </button>
      </section>
      <TaffyCarePanel
        progress={progress}
        showSatisfiedAfterTreat={didGiveTreat}
        onGiveTreat={onGiveTreat}
      />
      <StatusPanel progress={progress} completedToday={completedToday} todayKey={todayKey} />
      <section className="panel studySummaryPanel">
        <div>
          <p className="eyebrow">今月の記録</p>
          <h2>英語さんぽカレンダー</h2>
        </div>
        <div className="studySummaryStats">
          <div>
            <span>今月の学習日数</span>
            <strong>{monthlyStudyStats.studyDays}日</strong>
          </div>
          <div>
            <span>連続記録</span>
            <strong>{studyDateStreak}日</strong>
          </div>
          <div>
            <span>今月の肉球</span>
            <strong>{monthlyStudyStats.pawCount}個</strong>
          </div>
        </div>
        <button className="secondaryButton" type="button" onClick={onOpenCalendar}>
          記録を見る
        </button>
      </section>
    </main>
  );
}
