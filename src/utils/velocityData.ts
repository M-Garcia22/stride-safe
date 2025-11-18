
import { format, subDays } from "date-fns";
import { VelocityEvent, VelocityDataPoint } from "@/types/velocity";

const generateFirst10SecondsData = (): VelocityDataPoint[] => {
  const data: VelocityDataPoint[] = [];
  
  // Much smoother, physics-based acceleration curve for realistic horse acceleration
  const maxVelocity = 42 + Math.random() * 6; // 42-48 mph max
  
  for (let i = 0; i <= 100; i++) {
    const time = i / 10; // 0 to 10 seconds in 0.1 second intervals
    let velocity = 0;
    
    if (time > 0) {
      // Smooth exponential approach to max velocity
      // Peak velocity reached around 8-10 seconds with smooth acceleration curve
      const k = 0.6; // Controls rate of approach to max velocity
      velocity = maxVelocity * (1 - Math.exp(-k * time));
      
      // Add very minimal smoothing variation (much less than before)
      const smoothVariation = Math.sin(time * 0.5) * 0.3;
      velocity += smoothVariation;
      
      // Ensure smooth progression and no negative values
      velocity = Math.max(0, velocity);
    }
    
    data.push({ time, velocity });
  }
  
  // Additional smoothing pass to ensure completely smooth curve
  for (let i = 1; i < data.length - 1; i++) {
    const prev = data[i - 1].velocity;
    const curr = data[i].velocity;
    const next = data[i + 1].velocity;
    
    // Weighted smoothing to maintain curve shape
    data[i].velocity = (prev * 0.25 + curr * 0.5 + next * 0.25);
  }
  
  return data;
};

const generateFullRaceData = (raceDistance: string): VelocityDataPoint[] => {
  const data: VelocityDataPoint[] = [];
  const baseDistance = parseFloat(raceDistance.split(' ')[0]) || 1.0;
  const raceDuration = baseDistance * 60 + Math.random() * 20; // More consistent race time
  
  for (let i = 0; i <= 200; i++) {
    const time = (i / 200) * raceDuration;
    let velocity = 0;
    
    if (time > 0) {
      const racePhase = time / raceDuration;
      
      // Much smoother race phases with realistic transitions
      if (racePhase < 0.15) {
        // Initial acceleration phase - smooth exponential curve
        const accelerationProgress = racePhase / 0.15;
        velocity = 35 * (1 - Math.exp(-3 * accelerationProgress));
      }
      else if (racePhase < 0.75) {
        // Mid-race cruising phase - steady speed with gentle variations
        const baseSpeed = 32 + Math.random() * 4; // 32-36 mph base
        const gentleVariation = Math.sin((racePhase - 0.15) * Math.PI * 2) * 1.5;
        velocity = baseSpeed + gentleVariation;
      }
      else {
        // Final phase - either maintain speed or slight increase/decrease
        const endPhaseProgress = (racePhase - 0.75) / 0.25;
        const baseEndSpeed = 33 + Math.random() * 6; // 33-39 mph
        
        // Smooth transition in final phase
        const finalAdjustment = Math.sin(endPhaseProgress * Math.PI) * 2;
        velocity = baseEndSpeed + finalAdjustment;
      }
      
      // Ensure positive velocity
      velocity = Math.max(25, velocity);
    }
    
    data.push({ time, velocity });
  }
  
  // Comprehensive smoothing for completely smooth race profile
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 2; i < data.length - 2; i++) {
      const values = [
        data[i - 2].velocity,
        data[i - 1].velocity,
        data[i].velocity,
        data[i + 1].velocity,
        data[i + 2].velocity
      ];
      
      // 5-point moving average for ultra-smooth curve
      data[i].velocity = values.reduce((sum, v) => sum + v, 0) / 5;
    }
  }
  
  return data;
};

export const generateVelocityData = (horseId: string): VelocityEvent[] => {
  const events: VelocityEvent[] = [];
  const distances = ["1.0 mile", "1.25 miles", "0.75 mile", "1.5 miles", "0.5 mile"];
  const tracks = ["Churchill Downs", "Belmont Park", "Santa Anita", "Keeneland", "Del Mar"];
  
  for (let i = 0; i < 15; i++) {
    const date = subDays(new Date(), Math.floor(Math.random() * 180));
    const distance = distances[Math.floor(Math.random() * distances.length)];
    const location = tracks[Math.floor(Math.random() * tracks.length)];
    
    const first10SecondsData = generateFirst10SecondsData();
    const fullRaceData = generateFullRaceData(distance);
    
    const maxVelocity = Math.max(...fullRaceData.map(d => d.velocity));
    const avgVelocity = fullRaceData.reduce((sum, d) => sum + d.velocity, 0) / fullRaceData.length;
    
    events.push({
      id: `${horseId}-velocity-${i}`,
      date: date.toISOString(),
      type: 'race',
      location,
      distance,
      maxVelocity: Math.round(maxVelocity * 10) / 10,
      avgVelocity: Math.round(avgVelocity * 10) / 10,
      raceTime: `${Math.floor(Math.random() * 30 + 60)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      first10SecondsData,
      fullRaceData,
      welfareAlert: Math.random() < 0.1,
      formattedDate: format(date, 'MMM dd'),
      index: i
    });
  }
  
  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
