import { getStudyDateStreak } from '../game/studyCalendarRules';
import type { LearningProgress } from '../types/progress';

interface StatusPanelProps {
  progress: LearningProgress;
  completedToday: boolean;
  todayKey: string;
}

export function StatusPanel({ progress, completedToday, todayKey }: StatusPanelProps) {
  const studyDateStreak = getStudyDateStreak(progress.studyDates ?? [], todayKey);

  return (
    <section className="statusGrid" aria-label="学習ステータス">
      <div className="statusItem">
        <span className="statusLabel">レベル</span>
        <strong>{progress.level}</strong>
      </div>
      <div className="statusItem">
        <span className="statusLabel">XP（経験値）</span>
        <strong>{progress.xp}</strong>
      </div>
      <div className="statusItem">
        <span className="statusLabel">おやつ</span>
        <strong>{progress.treats}</strong>
      </div>
      <div className="statusItem">
        <span className="statusLabel">連続</span>
        <strong>{studyDateStreak}日</strong>
      </div>
      <div className={completedToday ? 'todayBadge complete' : 'todayBadge'}>
        {completedToday ? '今日のミッション完了' : '今日のミッションはまだ'}
      </div>
    </section>
  );
}
