
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { format, parseISO } from "date-fns";

interface PerformanceScoreChartProps {
  data: Array<{
    date: string;
    performanceScore: number;
    type: 'race' | 'breeze';
    location: string;
  }>;
  onClick?: () => void;
}

const PerformanceScoreChart = ({ data, onClick }: PerformanceScoreChartProps) => {
  const chartData = data.map(item => ({
    ...item,
    formattedDate: format(parseISO(item.date), 'MMM dd'),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow-lg text-xs">
          <p className="font-medium">{format(parseISO(data.date), 'MMM dd, yyyy')}</p>
          <p className="text-yellow-600">Performance Score: {data.performanceScore}</p>
          <p className="text-muted-foreground capitalize">{data.type} at {data.location}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-24 w-full cursor-pointer" onClick={onClick}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <XAxis 
            dataKey="formattedDate" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#6B7280' }}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="performanceScore" 
            fill="#ca8a04"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceScoreChart;
