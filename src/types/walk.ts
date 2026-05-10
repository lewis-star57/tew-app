export type SpotId =
  | 'home'
  | 'park'
  | 'cafe'
  | 'station'
  | 'convenience_store'
  | 'restaurant'
  | 'office'
  | 'hotel';

export interface WalkSpot {
  id: SpotId;
  name: string;
  icon: string;
  description: string;
  theme: string;
}

export interface SpotCompleteReward {
  id: number;
  spotId: SpotId;
  spotName: string;
  xpGained: number;
  treatsGained: number;
  walkPointsGained: number;
}

export interface RecommendedWalkSpot {
  spot: WalkSpot;
  studiedCount: number;
  totalCount: number;
  progressPercent: number;
  message: string;
  title: string;
  completionHint: string;
  isReview: boolean;
}
