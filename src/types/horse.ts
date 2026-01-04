import { Report } from './report';

export interface Horse {
  id: string;
  name: string;
  yearOfBirth: number;
  sex: string;
  color: string;
  wellnessScore?: number;
  performanceScore?: number;
  welfareAlert?: boolean;
  sire: string;
  dam: string;
  paternalGrandfather: string;
  paternalGrandmother: string;
  maternalGrandfather: string;
  maternalGrandmother: string;
  trainer: string;
  owner: string;
  daysSinceLastReport?: number;
  breeder?: string;
  vet?: string;
  description?: string;
  sharedWithVets?: string[];
}

/**
 * Horse data from the trainer horses API endpoint
 * Contains horse info with recent race/welfare data
 */
export interface TrainerHorse {
  id: string;
  name: string;
  yearOfBirth: number | null;
  sire: string | null;
  dam: string | null;
  daysSinceLastRace: number | null;
  riskHistory: number[];
  recentFatigue: number | null;
  hasAlert: boolean;
  totalRaces: number;
  recentReports: HorseReport[];
}

/**
 * Simplified report data included with horse
 */
export interface HorseReport {
  id: number;
  date: string;
  track: string;
  raceNo: number;
  distance: string;
  surface: string;
  welfareRiskCategory: number | null;
  fatigueScore: number | null;
  welfareAlert: boolean;
  condylarFx: boolean;
  sesamoidFx: boolean;
  leftFront: boolean;
  rightFront: boolean;
  bothFront: boolean;
  hindLimb: boolean;
}

export interface Vet {
  id: string;
  name: string;
  practice: string;
  location: string;
  licenseNumber: string;
}
