import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine, ReferenceDot } from "recharts";
import { VelocityDataPoint } from "@/types/velocity";

interface VelocityFullRaceChartProps {
  data: VelocityDataPoint[];
  timeToPeak: number;
  velocityAtPeak: number;
  timeToTarget: number;
  velocityAtTarget: number;
}

const VelocityFullRaceChart = ({
  data,
  timeToPeak,
  velocityAtPeak,
  timeToTarget,
  velocityAtTarget
}: VelocityFullRaceChartProps) => {
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="velocityGradientGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="time" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            domain={[0, 'dataMax']}
            tickFormatter={(value) => `${value}`}
          />
          
          <Area
            type="monotone"
            dataKey="velocity"
            stroke="#10B981"
            strokeWidth={2}
            fill="url(#velocityGradientGreen)"
            activeDot={{ r: 4, fill: '#10B981' }}
          />
          
          {/* Peak reference line */}
          <ReferenceLine 
            x={timeToPeak} 
            stroke="#3B82F6" 
            strokeWidth={2} 
            strokeDasharray="5,5"
          />
          
          {/* Target (52 fps) reference line */}
          <ReferenceLine 
            x={timeToTarget} 
            stroke="#F97316" 
            strokeWidth={2} 
            strokeDasharray="5,5"
          />
          
          {/* Peak intersection dot */}
          <ReferenceDot 
            x={timeToPeak} 
            y={velocityAtPeak}
            r={4}
            fill="#3B82F6"
            stroke="#ffffff"
            strokeWidth={2}
          />
          
          {/* Target intersection dot */}
          <ReferenceDot 
            x={timeToTarget} 
            y={velocityAtTarget}
            r={4}
            fill="#F97316"
            stroke="#ffffff"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VelocityFullRaceChart;
