import { getJstDateKey, getPreviousDateKey } from './dateRules';
import type { LearningProgress } from '../types/progress';

const pad2 = (value: number) => String(value).padStart(2, '0');

const resolveTodayKey = (todayKeyOrDate: string | Date = new Date()): string => {
  return typeof todayKeyOrDate === 'string' ? todayKeyOrDate : getJstDateKey(todayKeyOrDate);
};

export interface MonthlyStudyStats {
  todayKey: string;
  monthKey: string;
  year: number;
  month: number;
  todayDay: number;
  daysInMonth: number;
  elapsedDays: number;
  studyDays: number;
  pawCount: number;
  achievementRate: number;
}

export interface CalendarDayCell {
  key: string;
  day: number | null;
  dateKey: string | null;
  isToday: boolean;
  isStudied: boolean;
}

export const addStudyDate = (
  progress: LearningProgress,
  dateKey = getJstDateKey()
): LearningProgress => {
  const studyDates = progress.studyDates ?? [];

  if (studyDates.includes(dateKey)) {
    return {
      ...progress,
      studyDates,
    };
  }

  return {
    ...progress,
    studyDates: [...studyDates, dateKey].sort(),
  };
};

export const addDailyRewardStats = (
  progress: LearningProgress,
  dateKey: string,
  reward: { xp?: number; treats?: number }
): LearningProgress => {
  const xp = reward.xp ?? 0;
  const treats = reward.treats ?? 0;

  if (xp === 0 && treats === 0) {
    return progress;
  }

  const dailyRewardStats = progress.dailyRewardStats ?? {};
  const current = dailyRewardStats[dateKey] ?? { xp: 0, treats: 0 };

  return {
    ...progress,
    dailyRewardStats: {
      ...dailyRewardStats,
      [dateKey]: {
        xp: current.xp + xp,
        treats: current.treats + treats,
      },
    },
  };
};

export const getMonthlyStudyStats = (
  studyDates: string[] = [],
  todayKeyOrDate: string | Date = new Date()
): MonthlyStudyStats => {
  const todayKey = resolveTodayKey(todayKeyOrDate);
  const [yearText, monthText, dayText] = todayKey.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const todayDay = Number(dayText);
  const monthKey = `${yearText}-${monthText}`;
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const elapsedDays = Math.min(todayDay, daysInMonth);
  const monthStudyDates = Array.from(new Set(studyDates)).filter((dateKey) =>
    dateKey.startsWith(monthKey)
  );
  const achievementRate =
    elapsedDays > 0 ? Math.min(100, Math.round((monthStudyDates.length / elapsedDays) * 100)) : 0;

  return {
    todayKey,
    monthKey,
    year,
    month,
    todayDay,
    daysInMonth,
    elapsedDays,
    studyDays: monthStudyDates.length,
    pawCount: monthStudyDates.length,
    achievementRate,
  };
};

export const getStudyDateStreak = (
  studyDates: string[] = [],
  todayKey = getJstDateKey()
): number => {
  const studiedDateSet = new Set(studyDates);
  const startDateKey = studiedDateSet.has(todayKey) ? todayKey : getPreviousDateKey(todayKey);

  if (!studiedDateSet.has(startDateKey)) {
    return 0;
  }

  let streakDays = 0;
  let cursor = startDateKey;

  while (studiedDateSet.has(cursor)) {
    streakDays += 1;
    cursor = getPreviousDateKey(cursor);
  }

  return streakDays;
};

export const getCurrentMonthCalendarCells = (
  studyDates: string[] = [],
  todayKeyOrDate: string | Date = new Date()
): CalendarDayCell[] => {
  const stats = getMonthlyStudyStats(studyDates, todayKeyOrDate);
  const studiedDateSet = new Set(studyDates);
  const firstWeekday = new Date(Date.UTC(stats.year, stats.month - 1, 1)).getUTCDay();
  const cells: CalendarDayCell[] = [];

  for (let index = 0; index < firstWeekday; index += 1) {
    cells.push({
      key: `empty-start-${index}`,
      day: null,
      dateKey: null,
      isToday: false,
      isStudied: false,
    });
  }

  for (let day = 1; day <= stats.daysInMonth; day += 1) {
    const dateKey = `${stats.monthKey}-${pad2(day)}`;

    cells.push({
      key: dateKey,
      day,
      dateKey,
      isToday: dateKey === stats.todayKey,
      isStudied: studiedDateSet.has(dateKey),
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({
      key: `empty-end-${cells.length}`,
      day: null,
      dateKey: null,
      isToday: false,
      isStudied: false,
    });
  }

  return cells;
};
