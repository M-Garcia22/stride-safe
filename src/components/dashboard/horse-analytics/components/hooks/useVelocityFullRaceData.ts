
import { useMemo } from "react";

export const useVelocityFullRaceData = () => {
  // Mock velocity data for full race (6 furlongs ≈ 75 seconds) - converted to fps
  const fullRaceData = useMemo(() => [
    { time: 0, velocity: 0 },
    { time: 5, velocity: 51.3 }, // ~35 mph to fps
    { time: 10, velocity: 71.9 }, // ~49 mph to fps
    { time: 15, velocity: 74.8 }, // ~51 mph to fps
    { time: 20, velocity: 76.3 }, // ~52 mph to fps
    { time: 25, velocity: 77.8 }, // ~53 mph to fps
    { time: 30, velocity: 77.0 }, // ~52.5 mph to fps
    { time: 35, velocity: 76.3 }, // ~52 mph to fps
    { time: 40, velocity: 75.5 }, // ~51.5 mph to fps
    { time: 45, velocity: 74.8 }, // ~51 mph to fps
    { time: 50, velocity: 73.4 }, // ~50 mph to fps
    { time: 55, velocity: 71.9 }, // ~49 mph to fps
    { time: 60, velocity: 69.0 }, // ~47 mph to fps
    { time: 65, velocity: 66.0 }, // ~45 mph to fps
    { time: 70, velocity: 61.6 }, // ~42 mph to fps
    { time: 75, velocity: 58.7 }  // ~40 mph to fps
  ], []);

  const metrics = useMemo(() => {
    const maxVelocity = Math.max(...fullRaceData.map(d => d.velocity));
    const peakDataPoint = fullRaceData.find(d => d.velocity === maxVelocity);
    const timeToPeak = peakDataPoint ? peakDataPoint.time : 0;
    const velocityAtPeak = maxVelocity;
    
    // Find time to reach 52 fps (approximately 35.4 mph)
    const targetVelocity = 52;
    const timeToTarget = fullRaceData.find(d => d.velocity >= targetVelocity)?.time || 0;
    const velocityAtTarget = fullRaceData.find(d => d.velocity >= targetVelocity)?.velocity || 0;

    return {
      timeToPeak,
      velocityAtPeak,
      timeToTarget,
      velocityAtTarget,
      targetVelocity
    };
  }, [fullRaceData]);

  return {
    fullRaceData,
    ...metrics
  };
};
