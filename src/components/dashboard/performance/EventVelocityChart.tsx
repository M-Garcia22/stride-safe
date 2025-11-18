
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RaceBreeze } from '@/types/performance';

interface EventVelocityChartProps {
  entry: RaceBreeze;
}

const EventVelocityChart = ({ entry }: EventVelocityChartProps) => {
  if (entry.type === 'breeze') {
    return (
      <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/30">
        <div className="text-center text-muted-foreground">
          <p className="font-medium">Velocity/Acceleration Data</p>
          <p className="text-sm">Not available for breeze events</p>
        </div>
      </div>
    );
  }

  if (!entry.velocityData || entry.velocityData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/30">
        <div className="text-center text-muted-foreground">
          <p className="font-medium">Velocity/Acceleration Data</p>
          <p className="text-sm">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h5 className="text-sm font-medium">Velocity/Acceleration (First 10 Seconds)</h5>
      <div className="h-64 border rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={entry.velocityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: 'Velocity (mph)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(1)} mph`, 'Velocity']}
              labelFormatter={(time: number) => `Time: ${time}s`}
            />
            <Line 
              type="monotone" 
              dataKey="velocity" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EventVelocityChart;
