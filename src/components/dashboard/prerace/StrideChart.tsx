
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "recharts";

interface StrideChartProps {
  data: number[][][];
  isFullScreen?: boolean;
  fullScreenMode?: 'single' | 'grid' | 'horizontal';
  layoutMode?: 'rows' | 'grid' | 'horizontal';
}

const StrideChart = ({ 
  data, 
  isFullScreen = false, 
  fullScreenMode = 'single',
  layoutMode = 'rows' 
}: StrideChartProps) => {
  const strideColors = {
    stride1: '#3B82F6',
    stride2: '#10B981',
    stride3: '#F59E0B',
    stride4: '#EF4444',
    stride5: '#8B5CF6'
  };

  const chartConfig = {
    stride1: { label: "Stride 1", color: strideColors.stride1 },
    stride2: { label: "Stride 2", color: strideColors.stride2 },
    stride3: { label: "Stride 3", color: strideColors.stride3 },
    stride4: { label: "Stride 4", color: strideColors.stride4 },
    stride5: { label: "Stride 5", color: strideColors.stride5 },
  };

  const formatGraphData = (strideData: number[][][]) => {
    const points = strideData[0]?.length || 101;
    return Array.from({ length: points }, (_, i) => {
      const point: any = { point: i };
      strideData.forEach((stride, index) => {
        point[`stride${index + 1}`] = stride[i]?.[1] || 0;
      });
      return point;
    });
  };

  const getChartContainerClasses = () => {
    if (isFullScreen && fullScreenMode === 'grid') {
      return "h-full w-full";
    }
    if (isFullScreen && fullScreenMode === 'horizontal') {
      return "h-full w-full";
    }
    if (isFullScreen && fullScreenMode === 'single') {
      return "h-full w-full";
    }
    if (layoutMode === 'grid') {
      return "flex-1 min-h-0 aspect-[4/3]";
    }
    return "w-full h-80";
  };

  const getMargins = () => {
    if (isFullScreen && fullScreenMode === 'grid') {
      return { top: 5, right: 5, left: 15, bottom: 5 };
    }
    if (isFullScreen && fullScreenMode === 'horizontal') {
      return { top: 5, right: 10, left: 20, bottom: 5 };
    }
    if (isFullScreen && fullScreenMode === 'single') {
      return { top: 10, right: 20, left: 20, bottom: 10 };
    }
    if (layoutMode === 'grid' && !isFullScreen) {
      return { top: 5, right: 5, left: 10, bottom: 5 };
    }
    return { top: 20, right: 20, left: 15, bottom: 20 };
  };

  const getFontSize = () => {
    if (isFullScreen && fullScreenMode === 'grid') {
      return 8;
    }
    if (isFullScreen && fullScreenMode === 'horizontal') {
      return 8;
    }
    if (layoutMode === 'grid' && !isFullScreen) {
      return 8;
    }
    return 10;
  };

  const getTickCount = () => {
    if (isFullScreen && fullScreenMode === 'grid') {
      return { x: 4, y: 5 };
    }
    if (isFullScreen && fullScreenMode === 'horizontal') {
      return { x: 4, y: 4 };
    }
    if (layoutMode === 'grid' && !isFullScreen) {
      return { x: 3, y: 4 };
    }
    return { x: 6, y: 8 };
  };

  const getStrokeWidth = () => {
    if (isFullScreen && (fullScreenMode === 'grid' || fullScreenMode === 'horizontal')) {
      return 1.5;
    }
    if (layoutMode === 'grid' && !isFullScreen) {
      return 1;
    }
    return 2;
  };

  const getYAxisWidth = () => {
    if (isFullScreen && (fullScreenMode === 'grid' || fullScreenMode === 'horizontal')) {
      return 20;
    }
    if (layoutMode === 'grid' && !isFullScreen) {
      return 15;
    }
    return 30;
  };

  const chartData = formatGraphData(data);
  const fontSize = getFontSize();
  const tickCounts = getTickCount();
  const strokeWidth = getStrokeWidth();
  const yAxisWidth = getYAxisWidth();
  
  return (
    <ChartContainer config={chartConfig} className={getChartContainerClasses()}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <LineChart 
          data={chartData} 
          margin={getMargins()}
        >
          <XAxis 
            dataKey="point" 
            type="number"
            domain={[0, 100]}
            tickCount={tickCounts.x}
            fontSize={fontSize}
            axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
            tickLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            domain={[-14, 14]}
            tickCount={tickCounts.y}
            fontSize={fontSize}
            width={yAxisWidth}
            axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
            tickLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" strokeWidth={1} />
          <ChartTooltip 
            content={<ChartTooltipContent 
              formatter={(value, name) => [
                `${Number(value).toFixed(2)}`,
                chartConfig[name as keyof typeof chartConfig]?.label || name
              ]}
              labelFormatter={(label) => `Point: ${label}`}
            />} 
          />
          {Object.entries(strideColors).map(([strideKey, color]) => (
            <Line
              key={strideKey}
              type="monotone"
              dataKey={strideKey}
              stroke={color}
              strokeWidth={strokeWidth}
              dot={false}
              connectNulls
              strokeOpacity={0.9}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default StrideChart;
