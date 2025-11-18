
import { TrendsEvent, ChartConfig } from "../types/trendsChart";
import { scoreToPosition } from "../utils/nonLinearScale";

interface PerformanceBarProps {
  event: TrendsEvent;
  eventIndex: number;
  groupX: number;
  chartConfig: ChartConfig;
  highlightedEventId: string | null;
  showTrendLine: boolean;
  barOpacity: number;
  onMouseEnter: (data: any, index: number) => void;
  onBarClick: (data: any, index: number) => void;
  isWellnessFirst?: boolean;
}

const PerformanceBar = ({
  event,
  eventIndex,
  groupX,
  chartConfig,
  highlightedEventId,
  showTrendLine,
  barOpacity,
  onMouseEnter,
  onBarClick,
  isWellnessFirst = false
}: PerformanceBarProps) => {
  const getMarkerPosition = (score: number) => {
    const normalizedPosition = scoreToPosition(score);
    return chartConfig.chartHeight - (normalizedPosition * chartConfig.chartHeight);
  };

  // Position performance bar after wellness bar when wellness is first
  const barX = isWellnessFirst && chartConfig.barSpacing > 0 
    ? groupX + chartConfig.barWidth + chartConfig.barSpacing 
    : groupX;

  return (
    <g>
      {/* Full gradient bar with rounded corners */}
      <rect
        x={barX}
        y={chartConfig.padding.top}
        width={chartConfig.barWidth}
        height={chartConfig.chartHeight}
        fill="url(#performanceGradient)"
        stroke={event.welfareAlert ? "#EF4444" : "#D1D5DB"}
        strokeWidth={event.welfareAlert ? "2" : "1"}
        rx="3"
        ry="3"
        opacity={barOpacity}
        className={`cursor-pointer transition-all duration-200 hover:opacity-90 ${
          event.id === highlightedEventId ? 'stroke-blue-400 stroke-2' : ''
        }`}
        onMouseEnter={() => onMouseEnter(event, eventIndex)}
        onClick={() => onBarClick(event, eventIndex)}
      />
      
      {/* Performance score marker - consistent 6px height */}
      {!showTrendLine && (
        <rect
          x={barX + 2}
          y={chartConfig.padding.top + getMarkerPosition(event.performanceScore) - 3}
          width={chartConfig.barWidth - 4}
          height="6"
          fill="white"
          stroke="#374151"
          strokeWidth="1"
          rx="2"
          ry="2"
          className="drop-shadow-sm pointer-events-none"
        />
      )}
    </g>
  );
};

export default PerformanceBar;
