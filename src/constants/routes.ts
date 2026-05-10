export type ScreenName =
  | 'home'
  | 'lesson'
  | 'quiz'
  | 'result'
  | 'map'
  | 'miniConversation'
  | 'calendar'
  | 'review';

export const ROUTES: Record<ScreenName, ScreenName> = {
  home: 'home',
  lesson: 'lesson',
  quiz: 'quiz',
  result: 'result',
  map: 'map',
  miniConversation: 'miniConversation',
  calendar: 'calendar',
  review: 'review',
};
