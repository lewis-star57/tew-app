import { useEffect, useState } from 'react';
import { DataManagementPanel } from '../components/DataManagementPanel';
import { LearningDashboard } from '../components/LearningDashboard';
import { TaffyCharacter, type TaffyMood } from '../components/TaffyCharacter';
import { getJstDateKeyWithOffset } from '../game/dateRules';
import {
  getCurrentMonthCalendarCells,
  getMonthlyStudyStats,
  getStudyDateStreak,
} from '../game/studyCalendarRules';
import type { LearningProgress } from '../types/progress';

interface CalendarScreenProps {
  progress: LearningProgress;
  todayKey: string;
  onSetDebugDate: (dateKey: string | null) => void;
  onResetTodayCompletionState: () => void;
  onResetDailyPhraseCompletion: () => void;
  onResetDailyMissionCompletion: () => void;
  onResetDailyRecommendedWalkCompletion: () => void;
  onSetDailyRecommendedWalkToNineOfTen: () => void;
  onResetDailyRecommendedWalkTestState: () => void;
  onCompleteDailyRecommendedWalkForTest: () => void;
  onResetTreatGiven: () => void;
  onResetDailyRewardStats: () => void;
  onUpdateDisplayName: (displayName: string) => void;
  onToggleDeveloperTools: (showDeveloperTools: boolean) => void;
  onBackupProgress: () => void;
  onRestoreProgress: (file: File) => Promise<string | null>;
  onShowTutorial: () => void;
  onResetProgress: () => void;
  onBackHome: () => void;
}

const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];

interface DateDebugPanelProps {
  activeDateKey: string;
  debugDateKey: string | null;
  onSetDebugDate: (dateKey: string | null) => void;
  onResetTodayCompletionState: () => void;
  onResetDailyPhraseCompletion: () => void;
  onResetDailyMissionCompletion: () => void;
  onResetDailyRecommendedWalkCompletion: () => void;
  onSetDailyRecommendedWalkToNineOfTen: () => void;
  onResetDailyRecommendedWalkTestState: () => void;
  onCompleteDailyRecommendedWalkForTest: () => void;
  onResetTreatGiven: () => void;
  onResetDailyRewardStats: () => void;
}

function DateDebugPanel({
  activeDateKey,
  debugDateKey,
  onSetDebugDate,
  onResetTodayCompletionState,
  onResetDailyPhraseCompletion,
  onResetDailyMissionCompletion,
  onResetDailyRecommendedWalkCompletion,
  onSetDailyRecommendedWalkToNineOfTen,
  onResetDailyRecommendedWalkTestState,
  onCompleteDailyRecommendedWalkForTest,
  onResetTreatGiven,
  onResetDailyRewardStats,
}: DateDebugPanelProps) {
  return (
    <details className="panel dateDebugPanel">
      <summary>開発用：日付テスト</summary>
      <div className="dateDebugStatus">
        <span>開発用日付：{debugDateKey ?? '未設定'}</span>
        <strong>現在の判定日：{activeDateKey}</strong>
      </div>
      <div className="dateDebugButtons">
        <button className="moodButton" type="button" onClick={() => onSetDebugDate(getJstDateKeyWithOffset(0))}>
          今日としてテスト
        </button>
        <button className="moodButton" type="button" onClick={() => onSetDebugDate(getJstDateKeyWithOffset(-1))}>
          昨日としてテスト
        </button>
        <button className="moodButton" type="button" onClick={() => onSetDebugDate(getJstDateKeyWithOffset(1))}>
          明日としてテスト
        </button>
        <button className="moodButton" type="button" onClick={() => onSetDebugDate(getJstDateKeyWithOffset(3))}>
          3日後としてテスト
        </button>
        <button className="secondaryButton" type="button" onClick={() => onSetDebugDate(null)}>
          テスト日付をリセット
        </button>
      </div>
      <div className="dateDebugResetArea">
        <p>表示・完了判定だけを日付単位でリセットします。</p>
        <div className="dateDebugButtons dateDebugResetButtons">
          <button className="moodButton" type="button" onClick={onResetTodayCompletionState}>
            今日の完了状態をリセット
          </button>
          <button className="moodButton" type="button" onClick={onResetDailyPhraseCompletion}>
            今日のひとこと完了をリセット
          </button>
          <button className="moodButton" type="button" onClick={onResetDailyMissionCompletion}>
            今日の5問完了をリセット
          </button>
          <button className="moodButton" type="button" onClick={onResetDailyRecommendedWalkCompletion}>
            今日のおすすめ散歩完了をリセット
          </button>
          <button className="moodButton" type="button" onClick={onSetDailyRecommendedWalkToNineOfTen}>
            今日のおすすめ散歩を 9/10 にする
          </button>
          <button className="moodButton" type="button" onClick={onResetDailyRecommendedWalkTestState}>
            今日のおすすめ散歩を未完了に戻す
          </button>
          <button className="moodButton" type="button" onClick={onCompleteDailyRecommendedWalkForTest}>
            今日のおすすめ散歩を完了済みにする
          </button>
          <button className="moodButton" type="button" onClick={onResetTreatGiven}>
            今日のおやつ済みをリセット
          </button>
          <button className="moodButton" type="button" onClick={onResetDailyRewardStats}>
            今日のdailyRewardStatsをリセット
          </button>
        </div>
      </div>
    </details>
  );
}

interface DisplayNamePanelProps {
  displayName: string;
  onUpdateDisplayName: (displayName: string) => void;
}

function DisplayNamePanel({ displayName, onUpdateDisplayName }: DisplayNamePanelProps) {
  const [draftName, setDraftName] = useState(displayName);

  useEffect(() => {
    setDraftName(displayName);
  }, [displayName]);

  const handleSave = () => {
    onUpdateDisplayName(draftName);
  };

  return (
    <details className="panel displayNamePanel">
      <summary>名前設定</summary>
      <div className="displayNameContent">
        <p>今の名前：{displayName}</p>
        <label>
          <span>表示する名前</span>
          <input
            aria-label="表示する名前"
            type="text"
            value={draftName}
            maxLength={24}
            onChange={(event) => setDraftName(event.target.value)}
          />
        </label>
        <button className="primaryButton" type="button" onClick={handleSave}>
          名前を保存
        </button>
        <p className="displayNameHelp">空欄で保存すると Kiyo に戻ります。</p>
      </div>
    </details>
  );
}

export function CalendarScreen({
  progress,
  todayKey,
  onSetDebugDate,
  onResetTodayCompletionState,
  onResetDailyPhraseCompletion,
  onResetDailyMissionCompletion,
  onResetDailyRecommendedWalkCompletion,
  onSetDailyRecommendedWalkToNineOfTen,
  onResetDailyRecommendedWalkTestState,
  onCompleteDailyRecommendedWalkForTest,
  onResetTreatGiven,
  onResetDailyRewardStats,
  onUpdateDisplayName,
  onToggleDeveloperTools,
  onBackupProgress,
  onRestoreProgress,
  onShowTutorial,
  onResetProgress,
  onBackHome,
}: CalendarScreenProps) {
  const stats = getMonthlyStudyStats(progress.studyDates, todayKey);
  const calendarCells = getCurrentMonthCalendarCells(progress.studyDates, todayKey);
  const studyDateStreak = getStudyDateStreak(progress.studyDates, stats.todayKey);
  const studiedToday = progress.studyDates.includes(stats.todayKey);
  const hasManyStudyDays = stats.studyDays >= 7 || stats.achievementRate >= 50;
  const taffyMood: TaffyMood =
    stats.achievementRate >= 80 ? 'celebrate' : studiedToday && hasManyStudyDays ? 'proud' : 'happy';
  const taffyMessage =
    stats.achievementRate >= 80
      ? '今月かなりいいペース！Taffyもお祝いしてるよ🐶'
      : studiedToday
        ? '今日の足あと、ちゃんとついてるよ🐾'
        : '今日も少しだけことばさんぽしよう。1つできたら足あとがつくよ🐾';

  return (
    <main className="screen">
      <header className="screenHeader">
        <p className="eyebrow">学習カレンダー</p>
        <h1>記録</h1>
      </header>
      {progress.showDeveloperTools && progress.debugCurrentDateJst ? (
        <p className="dateDebugBadge">開発用日付：{progress.debugCurrentDateJst}</p>
      ) : null}
      <TaffyCharacter compact mood={taffyMood} message={taffyMessage} />
      <section className="panel calendarSummaryPanel">
        <div>
          <p className="eyebrow">{stats.year}年 {stats.month}月</p>
          <h2>今月のことばさんぽ</h2>
        </div>
        <div className="calendarSummaryStats">
          <div>
            <span>今月の学習日数</span>
            <strong>{stats.studyDays}日</strong>
          </div>
          <div>
            <span>連続学習日数</span>
            <strong>{studyDateStreak}日</strong>
          </div>
          <div>
            <span>今月の達成率</span>
            <strong>{stats.achievementRate}%</strong>
          </div>
        </div>
      </section>
      <LearningDashboard progress={progress} />
      <section className="panel calendarPanel">
        <div className="calendarHeader">
          <div>
            <p className="eyebrow">肉球カレンダー</p>
            <h2>学習した日は🐾</h2>
          </div>
          <span>今日: {stats.month}/{stats.todayDay}</span>
        </div>
        <div className="calendarGrid calendarWeekdays" aria-hidden="true">
          {WEEKDAY_LABELS.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        <div className="calendarGrid">
          {calendarCells.map((cell) => (
            <div
              key={cell.key}
              className={[
                'calendarDay',
                cell.day ? '' : 'empty',
                cell.isToday ? 'today' : '',
                cell.isStudied ? 'studied' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {cell.day ? (
                <>
                  <span>{cell.day}</span>
                  {cell.isStudied ? <strong aria-label="学習済み">🐾</strong> : null}
                </>
              ) : null}
            </div>
          ))}
        </div>
        <p className="calendarNote">
          5問、おかわり、今日のひとこと、ミニ会話、スポット練習を完了すると足あとがつきます🐾
        </p>
      </section>
      <button className="calmButton" type="button" onClick={onBackHome}>
        ホームへ戻る
      </button>
      <DisplayNamePanel
        displayName={progress.displayName}
        onUpdateDisplayName={onUpdateDisplayName}
      />
      <DataManagementPanel
        showDeveloperTools={progress.showDeveloperTools}
        onToggleDeveloperTools={onToggleDeveloperTools}
        onBackupProgress={onBackupProgress}
        onRestoreProgress={onRestoreProgress}
        onShowTutorial={onShowTutorial}
        onResetProgress={onResetProgress}
      />
      {progress.showDeveloperTools ? (
        <DateDebugPanel
          activeDateKey={todayKey}
          debugDateKey={progress.debugCurrentDateJst}
          onSetDebugDate={onSetDebugDate}
          onResetTodayCompletionState={onResetTodayCompletionState}
          onResetDailyPhraseCompletion={onResetDailyPhraseCompletion}
          onResetDailyMissionCompletion={onResetDailyMissionCompletion}
          onResetDailyRecommendedWalkCompletion={onResetDailyRecommendedWalkCompletion}
          onSetDailyRecommendedWalkToNineOfTen={onSetDailyRecommendedWalkToNineOfTen}
          onResetDailyRecommendedWalkTestState={onResetDailyRecommendedWalkTestState}
          onCompleteDailyRecommendedWalkForTest={onCompleteDailyRecommendedWalkForTest}
          onResetTreatGiven={onResetTreatGiven}
          onResetDailyRewardStats={onResetDailyRewardStats}
        />
      ) : null}
    </main>
  );
}
