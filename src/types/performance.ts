import { VelocityDataPoint } from './velocity';

export type { VelocityDataPoint };

export interface SpeedDataPoint {
  time: number;
  speed: number;
}

export interface RaceBreeze {
  id: string;
  date: string;
  type: 'race' | 'breeze';
  track: string;
  distance: string;
  surface: string;
  performanceScore: number;
  wellnessScore: number;
  welfareAlert: boolean;
  position?: number;
  totalRunners?: number;
  conditions?: string;
  weather?: string;
  trackConditions?: string;
  time?: string;
  jockey?: string;
  velocityData?: VelocityDataPoint[];
  speedData?: SpeedDataPoint[];
}
