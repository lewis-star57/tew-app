const JST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

const pad2 = (value: number) => String(value).padStart(2, '0');

export const getJstDateKey = (date = new Date()): string => {
  const shifted = new Date(date.getTime() + JST_OFFSET_MS);
  const year = shifted.getUTCFullYear();
  const month = pad2(shifted.getUTCMonth() + 1);
  const day = pad2(shifted.getUTCDate());
  return `${year}-${month}-${day}`;
};

export const getJstYesterdayKey = (date = new Date()): string => {
  return getJstDateKey(new Date(date.getTime() - DAY_MS));
};

export const getJstDateKeyWithOffset = (offsetDays: number, date = new Date()): string => {
  return getJstDateKey(new Date(date.getTime() + offsetDays * DAY_MS));
};

export const getPreviousDateKey = (dateKey: string): string => {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() - 1);

  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
};

export const getDateKeyWithOffset = (dateKey: string, offsetDays: number): string => {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + offsetDays);

  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
};

export const getJstHour = (date = new Date()): number => {
  const shifted = new Date(date.getTime() + JST_OFFSET_MS);
  return shifted.getUTCHours();
};

export const isTodayJst = (dateKey: string | null, date = new Date()): boolean => {
  return dateKey === getJstDateKey(date);
};

export const getDailySeed = (dateKey: string): number => {
  return dateKey.split('').reduce((seed, char) => seed + char.charCodeAt(0), 0);
};
