
import React from 'react';

interface VelocityCustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: number;
}

const VelocityCustomTooltip = ({ active, payload, label }: VelocityCustomTooltipProps) => {
  if (active && payload && payload.length) {
    // Determine if this is full race data (time > 15 seconds suggests full race)
    const isFullRace = (label || 0) > 15;
    
    const formatTime = (time: number) => {
      if (isFullRace) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${String(seconds).padStart(2, '0')}`;
      }
      return `${time.toFixed(1)}s`;
    };

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium">{`Time: ${formatTime(label || 0)}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value.toFixed(1)} mph`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default VelocityCustomTooltip;
