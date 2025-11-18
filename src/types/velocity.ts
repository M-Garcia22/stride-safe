
export interface VelocityDataPoint {
  time: number;
  velocity: number;
}

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
