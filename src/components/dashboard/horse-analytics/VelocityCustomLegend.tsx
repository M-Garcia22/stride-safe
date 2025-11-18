
import React from 'react';

interface VelocityCustomLegendProps {
  payload?: any[];
}

const VelocityCustomLegend = ({ payload }: VelocityCustomLegendProps) => {
  if (!payload || payload.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 justify-center mt-3 px-4">
      {payload.map((entry: any, index: number) => {
        const isMostRecent = entry.dataKey?.includes('Most Recent');
        return (
          <div
            key={index}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all ${
              isMostRecent 
                ? 'bg-blue-50 border border-blue-200 text-blue-800' 
                : 'bg-gray-50 border border-gray-200 text-gray-700'
            }`}
          >
            <div
              className="w-3 h-0.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="truncate max-w-[100px]" title={entry.value}>
              {entry.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default VelocityCustomLegend;
