/**
 * Core velocity data point - used for charts and API responses
 */
export interface VelocityDataPoint {
  time: number;
  velocity: number;
  acceleration?: number;
}

/**
 * Velocity metrics calculated from race data
 */
export interface VelocityMetrics {
  maxVelocity: number;
  timeToPeak: number;
  timeToTarget: number | null;
  velocityAtTarget: number | null;
  targetVelocity: number;
  totalDuration: number;
}

/**
 * API response from /api/velocity/{entryCode}
 */
export interface VelocityApiResponse {
  entryCode: number;
  fullRace: VelocityDataPoint[];
  first10Seconds: VelocityDataPoint[];
  metrics: VelocityMetrics;
  units?: {
    velocity: string;
    acceleration: string;
    time: string;
  };
}

/**
 * Velocity event for historical display / mock data, keeping this for now untill all mock data is removed
 * Contains display-formatted fields for UI components
 */
export interface VelocityEvent {
  id: string;
  date: string;
  type: 'race' | 'breeze';
  location: string;
  distance: string;
  maxVelocity: number;
  avgVelocity: number;
  raceTime: string;
  first10SecondsData: VelocityDataPoint[];
  fullRaceData: VelocityDataPoint[];
  welfareAlert: boolean;
  formattedDate: string;
  index: number;
}
