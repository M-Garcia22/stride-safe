
import { useMemo } from "react";
import ChartGradients from "./ChartGradients";
import ChartYAxis from "./ChartYAxis";
import ChartWelfareRiskAxis from "./ChartWelfareRiskAxis";
import WellnessBar from "./WellnessBar";
import { useChartConfig } from "../hooks/useChartConfig";
import { format } from "date-fns";

interface WelfareColumnChartProps {
  welfareScore: number;
  width: number;
  height: number;
}

const WelfareColumnChart = ({ welfareScore, width, height }: WelfareColumnChartProps) => {
  // Create a single data point for the welfare score
  const singleDataPoint = useMemo(() => [{
    id: 'current-welfare',
    date: new Date().toISOString().split('T')[0],
    type: 'race' as const,
    location: 'Current',
    distance: '',
    performanceScore: 0,
    wellnessScore: welfareScore,
    welfareAlert: false,
    formattedDate: format(new Date(), 'MMM dd'),
    index: 0
  }], [welfareScore]);

  const chartConfig = useChartConfig(width, height, 1, 'wellness', false);

  // Calculate center position for single column
  const columnX = chartConfig.padding.left + (chartConfig.chartWidth - chartConfig.barWidth) / 2;

  return (
    <div className="w-full overflow-hidden" style={{ height }}>
      <svg width={width} height={height} className="overflow-visible">
        <ChartGradients />
        
        <ChartYAxis chartConfig={chartConfig} width={width} />
        <ChartWelfareRiskAxis chartConfig={chartConfig} width={width} />
        
        <WellnessBar
          event={singleDataPoint[0]}
          eventIndex={0}
          groupX={columnX}
          chartConfig={chartConfig}
          selectedMetrics="wellness"
          highlightedEventId={null}
          showTrendLine={false}
          barOpacity={1}
          onMouseEnter={() => {}}
          onBarClick={() => {}}
          isWellnessFirst={true}
        />
      </svg>
    </div>
  );
};

export default WelfareColumnChart;
