
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StrideMetricsChartProps {
  data: Array<{
    date: string;
    dvStraight: number;
    dvTurn: number;
    symmetryIndex: number;
    strideLength: number;
    strideFrequency: number;
  }>;
}

const StrideMetricsChart = ({ data }: StrideMetricsChartProps) => {
  const chartConfig = {
    dvStraight: { label: "DV Straight", color: "#3B82F6" },
    dvTurn: { label: "DV Turn", color: "#10B981" },
    symmetryIndex: { label: "Symmetry Index", color: "#F59E0B" },
    strideLength: { label: "Stride Length", color: "#EF4444" },
    strideFrequency: { label: "Stride Frequency", color: "#8B5CF6" },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">StrideSAFE Metrics Trend</CardTitle>
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
              <YAxis fontSize={10} />
              <ChartTooltip 
                content={<ChartTooltipContent 
                  formatter={(value, name) => [
                    `${Number(value).toFixed(3)}`,
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
                dataKey="dvStraight"
                stroke={chartConfig.dvStraight.color}
                strokeWidth={2}
                dot={{ r: 2 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="dvTurn"
                stroke={chartConfig.dvTurn.color}
                strokeWidth={2}
                dot={{ r: 2 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="symmetryIndex"
                stroke={chartConfig.symmetryIndex.color}
                strokeWidth={2}
                dot={{ r: 2 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default StrideMetricsChart;
