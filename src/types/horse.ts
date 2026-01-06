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
  sex: string;
  sire: string | null;
  dam: string | null;
  sireSire: string | null;
  damSire: string | null;
  breeder: string | null;
  owner: string | null;
  daysSinceLastRace: number | null;
  riskHistory: number[];
  recentFatigue: number | null;
  hasAlert: boolean;
  totalRaces: number;
  recentReports: HorseReport[];
}

/**
 * Report data included with horse - compatible with Report type
 * Can be cast to Report by adding horseName and isNew
 */
export interface HorseReport extends Omit<Report, 'horseName' | 'isNew' | 'welfareRiskCategory' | 'fatigueScore'> {
  welfareRiskCategory: number | null;
  fatigueScore: number | null;
}

export interface Vet {
  id: string;
  name: string;
  practice: string;
  location: string;
  licenseNumber: string;
}
