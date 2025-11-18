
import { useMemo } from "react";
import ChartGradients from "./ChartGradients";
import ChartYAxis from "./ChartYAxis";
import PerformanceBar from "./PerformanceBar";
import { useChartConfig } from "../hooks/useChartConfig";
import { format } from "date-fns";

interface FatigueColumnChartProps {
  fatigueScore: number;
  width: number;
  height: number;
}

const FatigueColumnChart = ({ fatigueScore, width, height }: FatigueColumnChartProps) => {
  // Create a single data point for the fatigue score
  const singleDataPoint = useMemo(() => [{
    id: 'current-fatigue',
    date: new Date().toISOString().split('T')[0],
    type: 'race' as const,
    location: 'Current',
    distance: '',
    performanceScore: fatigueScore,
    wellnessScore: 0,
    welfareAlert: false,
    formattedDate: format(new Date(), 'MMM dd'),
    index: 0
  }], [fatigueScore]);

  const chartConfig = useChartConfig(width, height, 1, 'performance', false);

  // Calculate center position for single column
  const columnX = chartConfig.padding.left + (chartConfig.chartWidth - chartConfig.barWidth) / 2;

  return (
    <div className="w-full overflow-hidden" style={{ height }}>
      <svg width={width} height={height} className="overflow-visible">
        <ChartGradients />
        
        <ChartYAxis chartConfig={chartConfig} width={width} />
        
        <PerformanceBar
          event={singleDataPoint[0]}
          eventIndex={0}
          groupX={columnX}
          chartConfig={chartConfig}
          highlightedEventId={null}
          showTrendLine={false}
          barOpacity={1}
          onMouseEnter={() => {}}
          onBarClick={() => {}}
          isWellnessFirst={false}
        />
      </svg>
    </div>
  );
};

export default FatigueColumnChart;
