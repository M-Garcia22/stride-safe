
import { TrendsEvent, ChartConfig } from "../types/trendsChart";
import { scoreToPosition } from "../utils/nonLinearScale";
import { getWelfareRiskCategory, getWelfareRiskCategoryColor, getWelfareRiskCategoryLabel } from "../utils/welfareRiskUtils";
import { getDynamicSizes } from "./utils/barSizing";

interface WellnessBarProps {
  event: TrendsEvent;
  eventIndex: number;
  groupX: number;
  chartConfig: ChartConfig;
  selectedMetrics: 'both' | 'performance' | 'wellness';
  highlightedEventId: string | null;
  showTrendLine: boolean;
  barOpacity: number;
  onMouseEnter: (data: any, index: number) => void;
  onBarClick: (data: any, index: number) => void;
  isWellnessFirst?: boolean;
}

const WellnessBar = ({
  event,
  eventIndex,
  groupX,
  chartConfig,
  selectedMetrics,
  highlightedEventId,
  showTrendLine,
  barOpacity,
  onMouseEnter,
  onBarClick,
  isWellnessFirst = false
}: WellnessBarProps) => {
  const getMarkerPosition = (score: number) => {
    const normalizedPosition = scoreToPosition(score);
    return chartConfig.chartHeight - (normalizedPosition * chartConfig.chartHeight);
  };

  const welfareRiskCategory = getWelfareRiskCategory(event.wellnessScore);
  const riskCategoryColor = getWelfareRiskCategoryColor(welfareRiskCategory);
  const riskCategoryLabel = getWelfareRiskCategoryLabel(welfareRiskCategory);
  const dynamicSizes = getDynamicSizes(chartConfig.barWidth);
  
  // Position wellness bar first when isWellnessFirst is true, otherwise after performance
  const barX = isWellnessFirst ? groupX : (selectedMetrics === 'both' ? groupX + chartConfig.barWidth + chartConfig.barSpacing : groupX);

  return (
    <g>
      {/* Full gradient bar with rounded corners */}
      <rect
        x={barX}
        y={chartConfig.padding.top}
        width={chartConfig.barWidth}
        height={chartConfig.chartHeight}
        fill="url(#wellnessGradient)"
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
      
      {/* Enhanced wellness score marker with consistent styling */}
      {!showTrendLine && (
        <g>
          {!dynamicSizes.shouldPlaceAbove ? (
            // Enhanced integrated marker design - consistent with performance marker
            <g>
              {/* Consistent 6px white line marker */}
              <rect
                x={barX + 2}
                y={chartConfig.padding.top + getMarkerPosition(event.wellnessScore) - 3}
                width={chartConfig.barWidth - 4}
                height="6"
                fill="white"
                stroke="#374151"
                strokeWidth="1"
                rx="2"
                ry="2"
                className="drop-shadow-sm pointer-events-none"
              />
              
              {/* Integrated white circular element - reduced outline weight */}
              <circle
                cx={barX + chartConfig.barWidth / 2}
                cy={chartConfig.padding.top + getMarkerPosition(event.wellnessScore)}
                r={dynamicSizes.circleRadius}
                fill="white"
                stroke="#374151"
                strokeWidth="0.5"
                className="drop-shadow-lg pointer-events-none"
              />
              
              {/* Enhanced risk category badge */}
              <circle
                cx={barX + chartConfig.barWidth / 2}
                cy={chartConfig.padding.top + getMarkerPosition(event.wellnessScore)}
                r={dynamicSizes.badgeRadius}
                fill={riskCategoryColor}
                className="drop-shadow-md pointer-events-none"
              />
              
              {/* Risk category number */}
              <text
                x={barX + chartConfig.barWidth / 2}
                y={chartConfig.padding.top + getMarkerPosition(event.wellnessScore) + 4}
                textAnchor="middle"
                className="font-bold fill-white pointer-events-none"
                style={{ fontSize: dynamicSizes.fontSize }}
              >
                {riskCategoryLabel}
              </text>
            </g>
          ) : (
            // Enhanced above-column placement for very narrow bars
            <g>
              {/* Consistent 6px white line marker on column */}
              <rect
                x={barX + 2}
                y={chartConfig.padding.top + getMarkerPosition(event.wellnessScore) - 3}
                width={chartConfig.barWidth - 4}
                height="6"
                fill="white"
                stroke="#374151"
                strokeWidth="1"
                rx="2"
                ry="2"
                className="drop-shadow-sm pointer-events-none"
              />
              
              {/* Enhanced badge above the column */}
              <circle
                cx={barX + chartConfig.barWidth / 2}
                cy={chartConfig.padding.top + getMarkerPosition(event.wellnessScore) - 25}
                r="14"
                fill="white"
                stroke="#374151"
                strokeWidth="0.5"
                className="drop-shadow-lg pointer-events-none"
              />
              
              <circle
                cx={barX + chartConfig.barWidth / 2}
                cy={chartConfig.padding.top + getMarkerPosition(event.wellnessScore) - 25}
                r="10"
                fill={riskCategoryColor}
                className="drop-shadow-md pointer-events-none"
              />
              
              <text
                x={barX + chartConfig.barWidth / 2}
                y={chartConfig.padding.top + getMarkerPosition(event.wellnessScore) - 21}
                textAnchor="middle"
                className="text-sm font-bold fill-white pointer-events-none"
              >
                {riskCategoryLabel}
              </text>
            </g>
          )}
        </g>
      )}
    </g>
  );
};

export default WellnessBar;
