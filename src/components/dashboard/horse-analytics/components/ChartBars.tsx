
import { TrendsEvent, ChartConfig } from "../types/trendsChart";
import PerformanceBar from "./PerformanceBar";
import WellnessBar from "./WellnessBar";
import ChartLabels from "./ChartLabels";

interface ChartBarsProps {
  data: TrendsEvent[];
  chartConfig: ChartConfig;
  selectedMetrics: 'both' | 'performance' | 'wellness';
  highlightedEventId: string | null;
  onMouseEnter: (data: any, index: number) => void;
  onMouseLeave: () => void;
  onBarClick: (data: any, index: number) => void;
  height: number;
  showTrendLine?: boolean;
  showDaysBetween?: boolean;
}

const ChartBars = ({
  data,
  chartConfig,
  selectedMetrics,
  highlightedEventId,
  onMouseEnter,
  onMouseLeave,
  onBarClick,
  height,
  showTrendLine = false,
  showDaysBetween = false
}: ChartBarsProps) => {
  // Calculate X position based on positioning mode
  const getGroupX = (eventIndex: number) => {
    if (chartConfig.useTimeBasedPositioning && data.length > 0) {
      // True time-based proportional positioning - reversed for right-to-left
      const sixMonthsInDays = 180;
      const availableWidth = chartConfig.chartWidth - chartConfig.barGroupWidth;
      
      // Get the event's days from today
      const event = data[eventIndex] as any;
      const daysFromToday = event.daysFromToday || 0;
      
      // Calculate proportional position (0 = today/rightmost, 180 = 6 months ago/leftmost)
      const positionRatio = Math.min(daysFromToday / sixMonthsInDays, 1);
      // Reverse the position: 1 - positionRatio so recent events go to the right
      const xPosition = chartConfig.padding.left + ((1 - positionRatio) * availableWidth);
      
      return xPosition;
    } else {
      // Original evenly spaced positioning - reversed for right-to-left
      // Index 0 (oldest race) positioned at leftmost, highest index (most recent) at rightmost
      const availableWidth = chartConfig.chartWidth - (data.length - 1) * chartConfig.groupSpacing;
      const barGroupWidth = availableWidth / data.length;
      
      // Direct calculation: index 0 gets position 0 (leftmost), highest index gets rightmost
      return chartConfig.padding.left + eventIndex * (barGroupWidth + chartConfig.groupSpacing);
    }
  };

  // Determine opacity for bars when trend lines are shown
  const barOpacity = showTrendLine ? 0.3 : 1;

  return (
    <g onMouseLeave={onMouseLeave}>
      {data.map((event, eventIndex) => {
        const groupX = getGroupX(eventIndex);
        const isLastEvent = eventIndex === data.length - 1; // Most recent race (rightmost)
        
        // Calculate fade opacity for non-recent records
        const fadeOpacity = isLastEvent ? 1 : 0.6;
        
        return (
          <g key={event.id}>
            {/* Wellness Bar - now displayed first (left) with fading */}
            {(selectedMetrics === 'both' || selectedMetrics === 'wellness') && (
              <WellnessBar
                event={event}
                eventIndex={eventIndex}
                groupX={groupX}
                chartConfig={chartConfig}
                selectedMetrics={selectedMetrics}
                highlightedEventId={highlightedEventId}
                showTrendLine={showTrendLine}
                barOpacity={barOpacity * fadeOpacity}
                onMouseEnter={onMouseEnter}
                onBarClick={onBarClick}
                isWellnessFirst={true}
              />
            )}

            {/* Performance Bar - now displayed second (right) with fading */}
            {(selectedMetrics === 'both' || selectedMetrics === 'performance') && (
              <PerformanceBar
                event={event}
                eventIndex={eventIndex}
                groupX={groupX}
                chartConfig={chartConfig}
                highlightedEventId={highlightedEventId}
                showTrendLine={showTrendLine}
                barOpacity={barOpacity * fadeOpacity}
                onMouseEnter={onMouseEnter}
                onBarClick={onBarClick}
                isWellnessFirst={true}
              />
            )}

            {/* Chart Labels and Badges */}
            <ChartLabels
              event={event}
              eventIndex={eventIndex}
              groupX={groupX}
              chartConfig={chartConfig}
              selectedMetrics={selectedMetrics}
              height={height}
              showDaysBetween={showDaysBetween}
              data={data}
            />
          </g>
        );
      })}
    </g>
  );
};

export default ChartBars;
