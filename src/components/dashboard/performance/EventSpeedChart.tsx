
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RaceBreeze } from '@/types/performance';

interface EventSpeedChartProps {
  entry: RaceBreeze;
}

const EventSpeedChart = ({ entry }: EventSpeedChartProps) => {
  if (!entry.speedData || entry.speedData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/30">
        <div className="text-center text-muted-foreground">
          <p className="font-medium">Speed Over Event</p>
          <p className="text-sm">No speed data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h5 className="text-sm font-medium">Speed Over Event</h5>
      <div className="h-64 border rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={entry.speedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: 'Speed (mph)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(1)} mph`, 'Speed']}
              labelFormatter={(time: number) => `Time: ${time}s`}
            />
            <Line 
              type="monotone" 
              dataKey="speed" 
              stroke="#22C55E" 
              strokeWidth={2}
              dot={{ fill: '#22C55E', strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EventSpeedChart;
