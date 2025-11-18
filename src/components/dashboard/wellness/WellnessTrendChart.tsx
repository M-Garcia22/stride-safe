
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WellnessTrendChartProps {
  data: Array<{
    date: string;
    wellnessScore: number;
    performanceScore: number;
  }>;
}

const WellnessTrendChart = ({ data }: WellnessTrendChartProps) => {
  const chartConfig = {
    wellnessScore: { label: "Wellness Score", color: "#10B981" },
    performanceScore: { label: "Performance Score", color: "#3B82F6" },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">30-Day Wellness Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
              <XAxis 
                dataKey="date" 
                fontSize={10}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis domain={[0, 100]} fontSize={10} />
              <ReferenceLine y={60} stroke="#F59E0B" strokeDasharray="2 2" />
              <ReferenceLine y={80} stroke="#10B981" strokeDasharray="2 2" />
              <ChartTooltip 
                content={<ChartTooltipContent 
                  formatter={(value, name) => [
                    `${Number(value).toFixed(1)}`,
                    chartConfig[name as keyof typeof chartConfig]?.label || name
                  ]}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                />} 
              />
              <Line
                type="monotone"
                dataKey="wellnessScore"
                stroke={chartConfig.wellnessScore.color}
                strokeWidth={2}
                dot={{ r: 3 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="performanceScore"
                stroke={chartConfig.performanceScore.color}
                strokeWidth={2}
                dot={{ r: 3 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default WellnessTrendChart;
