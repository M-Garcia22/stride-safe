
import ChartGradients from "./components/ChartGradients";
import ChartYAxis from "./components/ChartYAxis";
import ChartWelfareRiskAxis from "./components/ChartWelfareRiskAxis";
import ChartBars from "./components/ChartBars";
import { useChartConfig } from "./hooks/useChartConfig";
import { CustomTrendsBarChartProps } from "./types/trendsChart";

const CustomTrendsBarChart = ({
  data,
  selectedMetrics,
  highlightedEventId,
  onMouseEnter,
  onMouseLeave,
  onBarClick,
  width,
  height,
  showTrendLine = false,
  useTimeBasedPositioning = false,
  showDaysBetween = false
}: CustomTrendsBarChartProps) => {
  const chartConfig = useChartConfig(width, height, data.length, selectedMetrics, useTimeBasedPositioning);

  return (
    <div className="w-full overflow-hidden" style={{ height }}>
      <svg width={width} height={height} className="overflow-visible">
        <ChartGradients />
        
        <ChartYAxis chartConfig={chartConfig} width={width} />
        
        {/* Show welfare risk axis only when wellness metrics are displayed */}
        {(selectedMetrics === 'both' || selectedMetrics === 'wellness') && (
          <ChartWelfareRiskAxis chartConfig={chartConfig} width={width} />
        )}
        
        <ChartBars
          data={data}
          chartConfig={chartConfig}
          selectedMetrics={selectedMetrics}
          highlightedEventId={highlightedEventId}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onBarClick={onBarClick}
          height={height}
          showTrendLine={showTrendLine}
          showDaysBetween={showDaysBetween}
        />
      </svg>
    </div>
  );
};

export default CustomTrendsBarChart;
