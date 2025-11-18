
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RaceBreeze } from '@/types/performance';

interface TrendVelocityChartProps {
  data: RaceBreeze[];
}

const TrendVelocityChart = ({ data }: TrendVelocityChartProps) => {
  const [hoveredEntry, setHoveredEntry] = useState<string | null>(null);

  // Filter to only race events and sort by date
  const raceEvents = data
    .filter(entry => entry.type === 'race' && entry.velocityData && entry.velocityData.length > 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (raceEvents.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center border rounded-lg bg-muted/30">
        <div className="text-center text-muted-foreground">
          <p className="font-semibold text-lg">Trends: Velocity/Acceleration</p>
          <p className="text-sm mt-2">No race events with velocity data in selected timeframe</p>
        </div>
      </div>
    );
  }

  const mostRecentEntry = raceEvents[raceEvents.length - 1];
  
  // Check if most recent event is a breeze
  const mostRecentOverall = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  if (mostRecentOverall?.type === 'breeze') {
    return (
      <div className="h-80 flex items-center justify-center border rounded-lg bg-muted/30">
        <div className="text-center text-muted-foreground">
          <p className="font-semibold text-lg">Trends: Velocity/Acceleration</p>
          <p className="text-sm mt-2">Most recent event is a breeze - velocity data not available</p>
        </div>
      </div>
    );
  }

  // Combine all velocity data with entry identification
  const combinedData: Array<{
    time: number;
    [key: string]: number;
  }> = [];

  // Create time points from 0 to 10 seconds
  for (let i = 0; i <= 100; i++) {
    const timePoint = i / 10; // 0.0 to 10.0 seconds
    const dataPoint: any = { time: timePoint };
    
    raceEvents.forEach((entry, index) => {
      const velocityPoint = entry.velocityData?.find(v => Math.abs(v.time - timePoint) < 0.05);
      if (velocityPoint) {
        dataPoint[`entry_${entry.id}`] = velocityPoint.velocity;
      }
    });
    
    combinedData.push(dataPoint);
  }

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold">Trends: Velocity/Acceleration (First 10 Seconds)</h4>
      <div className="h-80 border rounded-lg p-4 bg-background">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={combinedData}
            onMouseLeave={() => setHoveredEntry(null)}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="time" 
              label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -10 }}
              tick={{ fontSize: 12 }}
              stroke="#64748b"
            />
            <YAxis 
              label={{ value: 'Velocity (mph)', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
              stroke="#64748b"
            />
            <Tooltip 
              formatter={(value: number, name: string) => {
                const entryId = name.replace('entry_', '');
                const entry = raceEvents.find(e => e.id === entryId);
                const date = entry ? new Date(entry.date).toLocaleDateString() : '';
                return [`${value?.toFixed(1)} mph`, `${date}`];
              }}
              labelFormatter={(time: number) => `Time: ${time}s`}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            
            {/* Historical race events in grey */}
            {raceEvents.slice(0, -1).map((entry) => (
              <Line
                key={`historical_${entry.id}`}
                type="monotone"
                dataKey={`entry_${entry.id}`}
                stroke={hoveredEntry === entry.id ? "#6B7280" : "#D1D5DB"}
                strokeWidth={hoveredEntry === entry.id ? 3 : 2}
                dot={false}
                connectNulls={false}
                onMouseEnter={() => setHoveredEntry(entry.id)}
              />
            ))}
            
            {/* Most recent race event in color */}
            {mostRecentEntry && (
              <Line
                key={`recent_${mostRecentEntry.id}`}
                type="monotone"
                dataKey={`entry_${mostRecentEntry.id}`}
                stroke="#3B82F6"
                strokeWidth={4}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
                connectNulls={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-blue-500 rounded"></div>
          <span>Most Recent Race</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-gray-300 rounded"></div>
          <span>Historical Races</span>
        </div>
      </div>
    </div>
  );
};

export default TrendVelocityChart;
