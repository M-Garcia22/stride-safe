
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { RaceBreeze } from '@/types/performance';

interface VelocityChangeChartProps {
  data: RaceBreeze[];
}

const VelocityChangeChart = ({ data }: VelocityChangeChartProps) => {
  // Filter to only race events and sort by date (newest first)
  const raceEvents = data
    .filter(entry => entry.type === 'race' && entry.velocityData && entry.velocityData.length > 0)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (raceEvents.length < 4) {
    return (
      <div className="h-80 flex items-center justify-center border rounded-lg bg-muted/30">
        <div className="text-center text-muted-foreground">
          <p className="font-semibold text-lg">Velocity Change Analysis</p>
          <p className="text-sm mt-2">Need at least 4 race events to show velocity change comparison</p>
        </div>
      </div>
    );
  }

  // Get the most recent race and 3 previous races for comparison
  const mostRecentRace = raceEvents[0];
  const comparisonRaces = raceEvents.slice(1, 4); // Next 3 races

  // Calculate average velocity at each time point for the 3 comparison races
  const timePoints = Array.from({ length: 101 }, (_, i) => i / 10); // 0.0 to 10.0 seconds
  
  const chartData = timePoints.map(timePoint => {
    // Get velocity from most recent race
    const recentVelocity = mostRecentRace.velocityData?.find(v => Math.abs(v.time - timePoint) < 0.05)?.velocity || 0;
    
    // Calculate average velocity from comparison races at this time point
    const comparisonVelocities = comparisonRaces
      .map(race => race.velocityData?.find(v => Math.abs(v.time - timePoint) < 0.05)?.velocity)
      .filter(v => v !== undefined) as number[];
    
    const avgComparisonVelocity = comparisonVelocities.length > 0 
      ? comparisonVelocities.reduce((sum, v) => sum + v, 0) / comparisonVelocities.length 
      : 0;
    
    // Calculate percentage change
    const percentageChange = avgComparisonVelocity !== 0 
      ? ((recentVelocity - avgComparisonVelocity) / avgComparisonVelocity) * 100 
      : 0;
    
    return {
      time: timePoint,
      percentageChange: Math.round(percentageChange * 10) / 10,
      recentVelocity,
      avgComparisonVelocity
    };
  });

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-semibold">Velocity Change vs Previous 3 Races</h4>
        <p className="text-sm text-muted-foreground mt-1">
          Percentage change in velocity compared to average of 3 most recent races
        </p>
      </div>
      
      <div className="h-80 border rounded-lg p-4 bg-background">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={chartData}
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
              label={{ value: 'Change (%)', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
              stroke="#64748b"
              tickFormatter={(value) => `${value}%`}
            />
            <ReferenceLine y={0} stroke="#94A3B8" strokeDasharray="2 2" />
            <ReferenceLine y={5} stroke="#EF4444" strokeDasharray="1 1" opacity={0.5} />
            <ReferenceLine y={-5} stroke="#EF4444" strokeDasharray="1 1" opacity={0.5} />
            
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Velocity Change']}
              labelFormatter={(time: number) => `Time: ${time}s`}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            
            <Line
              type="monotone"
              dataKey="percentageChange"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-green-500 rounded"></div>
          <span>Velocity Change %</span>
        </div>
        <div className="text-xs">
          <span>Positive values indicate improvement over previous races</span>
        </div>
      </div>
    </div>
  );
};

export default VelocityChangeChart;
