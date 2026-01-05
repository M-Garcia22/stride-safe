
import { TrendsEvent, ChartConfig } from "../types/trendsChart";

interface ChartLabelsProps {
  event: TrendsEvent;
  eventIndex: number;
  groupX: number;
  chartConfig: ChartConfig;
  selectedMetrics: 'both' | 'performance' | 'wellness';
  height: number;
  showDaysBetween: boolean;
  data: TrendsEvent[];
}

const ChartLabels = ({
  event,
  eventIndex,
  groupX,
  chartConfig,
  selectedMetrics,
  height,
  showDaysBetween,
  data
}: ChartLabelsProps) => {
  // Calculate the center position for date labels based on new column order (wellness first)
  const getLabelCenterX = () => {
    if (selectedMetrics === 'both') {
      // Center between wellness and performance bars
      return groupX + chartConfig.barWidth + chartConfig.barSpacing / 2;
    } else {
      // Center of single bar
      return groupX + chartConfig.barWidth / 2;
    }
  };

  // Calculate position for days between badge - centered between current and next event
  const getDaysBetweenX = () => {
    if (eventIndex > 0) { // Changed from < data.length - 1 since we now show days to previous event
      const currentEventX = groupX + chartConfig.barGroupWidth / 2;
      
      if (chartConfig.useTimeBasedPositioning) {
        // For time-based positioning, calculate the midpoint to the previous event
        const prevEvent = data[eventIndex - 1] as any; // Changed from next to previous
        const sixMonthsInDays = 180;
        const availableWidth = chartConfig.chartWidth - chartConfig.barGroupWidth;
        const prevEventDaysFromToday = prevEvent.daysFromToday || 0;
        // Reverse the position calculation for right-to-left display
        const prevEventPositionRatio = Math.min(prevEventDaysFromToday / sixMonthsInDays, 1);
        const prevEventX = chartConfig.padding.left + ((1 - prevEventPositionRatio) * availableWidth) + chartConfig.barGroupWidth / 2;
        
        return (currentEventX + prevEventX) / 2;
      } else {
        // For evenly spaced positioning
        const availableWidth = chartConfig.chartWidth - (data.length - 1) * chartConfig.groupSpacing;
        const barGroupWidth = availableWidth / data.length;
        const prevEventX = chartConfig.padding.left + (eventIndex - 1) * (barGroupWidth + chartConfig.groupSpacing) + barGroupWidth / 2; // Changed from +1 to -1
        
        return (currentEventX + prevEventX) / 2;
      }
    }
    return groupX + chartConfig.barGroupWidth / 2;
  };

  return (
    <g>
      {/* Date label - positioned below the risk category badge */}
      <text
        x={getLabelCenterX()}
        y={height - chartConfig.padding.bottom + 28}
        textAnchor="middle"
        className="text-xs font-medium fill-gray-700"
      >
        {event.formattedDate}
      </text>

      {/* Race course name label */}
      <text
        x={getLabelCenterX()}
        y={height - chartConfig.padding.bottom + 42}
        textAnchor="middle"
        className="text-xs fill-gray-500"
      >
        {event.location}
      </text>

      {/* Days Between Badge - Centered between events */}
      {showDaysBetween && event.daysBetween && eventIndex > 0 && ( // Changed from < data.length - 1 to > 0
        <g>
          {/* Background rectangle for badge - positioned between current and previous bar */}
          <rect
            x={getDaysBetweenX() - 25}
            y={chartConfig.padding.top + chartConfig.chartHeight / 2 - 15}
            width="50"
            height="30"
            fill="rgba(255, 255, 255, 0.85)"
            stroke="rgba(156, 163, 175, 0.3)"
            strokeWidth="1"
            rx="15"
            ry="15"
            className="drop-shadow-sm opacity-80"
          />
          
          {/* Days count text */}
          <text
            x={getDaysBetweenX()}
            y={chartConfig.padding.top + chartConfig.chartHeight / 2 - 2}
            textAnchor="middle"
            className="text-xs font-medium fill-gray-500"
          >
            {event.daysBetween}
          </text>
          
          {/* "days" label */}
          <text
            x={getDaysBetweenX()}
            y={chartConfig.padding.top + chartConfig.chartHeight / 2 + 10}
            textAnchor="middle"
            className="text-xs fill-gray-400"
          >
            days
          </text>
        </g>
      )}
    </g>
  );
};

export default ChartLabels;
