import { addDays, subDays } from 'date-fns';
import { RaceBreeze } from '@/types/performance';

const tracks = ['Belmont Park', 'Churchill Downs', 'Santa Anita', 'Saratoga', 'Del Mar', 'Keeneland'];
const surfaces = ['Dirt', 'Turf', 'Synthetic'];
const distances = ['5f', '6f', '7f', '1m', '1m 1f', '1m 2f', '1m 4f'];

const generateVelocityData = () => {
  const data = [];
  for (let i = 0; i <= 100; i++) {
    const time = i / 10;
    // More realistic velocity curve - starts slower, peaks around 3-4 seconds, then maintains
    const baseVelocity = Math.min(35 + (time * 8) - (Math.pow(time - 4, 2) * 0.5), 45);
    const velocity = Math.max(0, baseVelocity + (Math.random() - 0.5) * 3);
    data.push({ time, velocity: Math.round(velocity * 10) / 10 });
  }
  return data;
};

const generateSpeedData = () => {
  const data = [];
  for (let i = 0; i <= 30; i++) {
    const time = i;
    const speed = 35 + Math.random() * 15;
    data.push({ time, speed: Math.round(speed * 10) / 10 });
  }
  return data;
};

export const generateMockData = (): RaceBreeze[] => {
  const entries: RaceBreeze[] = [];
  
  // Generate data over the past 2 years
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 2);
  
  let currentDate = new Date(startDate);
  let entryId = 1;
  
  // Track previous scores for more realistic percentage changes
  let lastPerformanceScore = 85;
  let lastWellnessScore = 80;
  
  while (currentDate <= endDate) {
    // Random chance of having an event (about 15% chance per week)
    if (Math.random() < 0.15) {
      const isRace = Math.random() < 0.7; // 70% chance of race, 30% breeze
      
      // Generate more realistic score changes
      const hasWelfareAlert = Math.random() < 0.1; // 10% chance of welfare alert
      
      // Limit score changes to realistic ranges
      const perfChange = hasWelfareAlert ? 
        (Math.random() - 0.5) * 16 : // -8 to +8 with welfare alert
        (Math.random() - 0.5) * 10;  // -5 to +5 normally
        
      const wellChange = hasWelfareAlert ?
        (Math.random() - 0.5) * 16 : // -8 to +8 with welfare alert
        (Math.random() - 0.5) * 10;  // -5 to +5 normally
      
      const performanceScore = Math.max(70, Math.min(100, lastPerformanceScore + perfChange));
      const wellnessScore = Math.max(50, Math.min(100, lastWellnessScore + wellChange));
      
      const entry: RaceBreeze = {
        id: `entry_${entryId++}`,
        date: currentDate.toISOString().split('T')[0],
        track: tracks[Math.floor(Math.random() * tracks.length)],
        distance: distances[Math.floor(Math.random() * distances.length)],
        type: isRace ? 'race' : 'breeze',
        performanceScore: Math.round(performanceScore),
        wellnessScore: Math.round(wellnessScore),
        welfareAlert: hasWelfareAlert,
        surface: surfaces[Math.floor(Math.random() * surfaces.length)],
        velocityData: generateVelocityData(),
        speedData: generateSpeedData(),
      };

      if (isRace) {
        entry.position = Math.floor(Math.random() * 12) + 1;
        entry.totalRunners = Math.floor(Math.random() * 8) + 8;
        entry.conditions = ['Allowance', 'Claiming', 'Maiden', 'Stakes'][Math.floor(Math.random() * 4)];
        entry.jockey = ['J. Rodriguez', 'M. Smith', 'L. Saez', 'I. Ortiz Jr.'][Math.floor(Math.random() * 4)];
        entry.weather = ['Clear', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 3)];
        entry.trackConditions = ['Fast', 'Good', 'Muddy'][Math.floor(Math.random() * 3)];
      } else {
        entry.time = `${Math.floor(Math.random() * 2) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}.${Math.floor(Math.random() * 100)}`;
      }

      entries.push(entry);
      
      // Update last scores for next iteration
      lastPerformanceScore = performanceScore;
      lastWellnessScore = wellnessScore;
    }
    
    // Move to next week
    currentDate.setDate(currentDate.getDate() + 7);
  }
  
  // Sort by date (newest first)
  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
