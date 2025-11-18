
export interface Report {
  id: number;
  date: string;
  track: string;
  raceNo: number;
  distance: string;
  surface: string;
  welfareRiskCategory: number;
  fatigueScore: number;
  welfareAlert: boolean;
  isNew: boolean;
  horseName: string;
  // Individual welfare markers
  condylarFx: boolean;
  sesamoidFx: boolean;
  leftFront: boolean;
  rightFront: boolean;
  bothFront: boolean;
  hindLimb: boolean;
}
