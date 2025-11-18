
import { subDays, format } from 'date-fns';

export interface TrendsEvent {
  id: string;
  date: string;
  type: 'race' | 'breeze';
  location: string;
  distance: string;
  performanceScore: number;
  wellnessScore: number;
  welfareAlert: boolean;
}

export const generateTrendsData = (horseId: string): TrendsEvent[] => {
  // Use horseId as seed for consistent data
  const seed = horseId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const seededRandom = (min: number, max: number, index: number = 0) => {
    const x = Math.sin(seed + index) * 10000;
    return min + (x - Math.floor(x)) * (max - min);
  };

  const tracks = [
    'Churchill Downs', 'Belmont Park', 'Santa Anita', 'Del Mar', 'Keeneland',
    'Saratoga', 'Gulfstream Park', 'Oaklawn Park', 'Fair Grounds', 'Woodbine'
  ];

  const distances = ['5f', '6f', '7f', '1m', '1m 1/16', '1m 1/8', '1m 1/4', '1.5m'];

  const events: TrendsEvent[] = [];
  const today = new Date();
  
  // Create specific race records as requested
  const raceRecords = [
    {
      date: today, // Most recent race - today
      performanceScore: 88,
      wellnessScore: 115, // Above 110 as requested
      welfareAlert: false
    },
    {
      date: subDays(today, 21), // ~3 weeks ago
      performanceScore: 85,
      wellnessScore: 92,
      welfareAlert: false
    },
    {
      date: subDays(today, 45), // ~6 weeks ago  
      performanceScore: 82,
      wellnessScore: 88,
      welfareAlert: false
    },
    {
      date: subDays(today, 78), // ~11 weeks ago
      performanceScore: 87,
      wellnessScore: 95,
      welfareAlert: false
    },
    {
      date: new Date(today.getFullYear(), 1, 17), // February 17 - new record with welfare below 50
      performanceScore: 118, // Above 115 as requested (fatigue score)
      wellnessScore: 45, // Below 50 as requested (Risk Category 1)
      welfareAlert: false
    }
  ];
  
  // Generate race events from the specific records
  raceRecords.forEach((record, i) => {
    events.push({
      id: `${horseId}-race-${i}`,
      date: format(record.date, 'yyyy-MM-dd'),
      type: 'race',
      location: tracks[Math.floor(seededRandom(0, tracks.length, i + 100))],
      distance: distances[Math.floor(seededRandom(0, distances.length, i + 110))],
      performanceScore: record.performanceScore,
      wellnessScore: record.wellnessScore,
      welfareAlert: record.welfareAlert
    });
  });
  
  // Add some breeze events between races
  for (let i = 0; i < 8; i++) {
    const daysAgo = Math.floor(seededRandom(7, 180, i + 200));
    const eventDate = subDays(today, daysAgo);
    
    // Skip if too close to race events
    const tooCloseToRace = events.some(event => 
      Math.abs(new Date(event.date).getTime() - eventDate.getTime()) < 3 * 24 * 60 * 60 * 1000
    );
    
    if (tooCloseToRace) continue;
    
    const basePerformanceScore = 85 + seededRandom(-10, 15, i + 250);
    const baseWellnessScore = 88 + seededRandom(-12, 12, i + 260);
    
    const performanceVariation = seededRandom(-2, 2, i + 250);
    const wellnessVariation = seededRandom(-3, 3, i + 260);
    
    const currentPerformanceScore = Math.max(1, Math.min(140, 
      basePerformanceScore + performanceVariation
    ));
    
    const currentWellnessScore = Math.max(1, Math.min(140, 
      baseWellnessScore + wellnessVariation
    ));
    
    events.push({
      id: `${horseId}-breeze-${i}`,
      date: format(eventDate, 'yyyy-MM-dd'),
      type: 'breeze',
      location: tracks[Math.floor(seededRandom(0, tracks.length, i + 300))],
      distance: distances[Math.floor(seededRandom(0, distances.length, i + 310))],
      performanceScore: Math.round(currentPerformanceScore),
      wellnessScore: Math.round(currentWellnessScore),
      welfareAlert: false
    });
  }
  
  // Sort by date (newest first) - this ensures today's race is first
  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
