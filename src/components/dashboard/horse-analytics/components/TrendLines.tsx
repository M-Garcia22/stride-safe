
import { scoreToPosition } from "../utils/nonLinearScale";
import { TrendsEvent, ChartConfig } from "../types/trendsChart";

interface ExtendedTrendsEvent extends TrendsEvent {
  performanceTrend?: number;
  wellnessTrend?: number;
  positionRatio?: number;
}

interface TrendLinesProps {
  chartDataWithTrends: ExtendedTrendsEvent[];
  selectedMetrics: 'both' | 'performance' | 'wellness';
  barCenterPositions: Array<{ performance: number; wellness: number }>;
  chartConfig: ChartConfig;
  width: number;
  height: number;
}

/**
 * Convert wellness risk category (1-5) to a normalized position (0-1).
 * Risk 1 (lowest) = 0 (bottom of chart)
 * Risk 5 (highest) = 1 (top of chart)
 */
const wellnessScoreToPosition = (riskCategory: number): number => {
  const clampedRisk = Math.max(1, Math.min(5, riskCategory));
  return (clampedRisk - 1) / 4;
};

const TrendLines = ({
  chartDataWithTrends,
  selectedMetrics,
  barCenterPositions,
  chartConfig,
  width,
  height
}: TrendLinesProps) => {
  if (chartDataWithTrends.length <= 1) return null;

  // Use the same config as the chart for consistent positioning
  const { padding, chartHeight } = chartConfig;

  return (
    <svg 
      width={width} 
      height={height} 
      className="block"
      style={{ width, height }}
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        <filter id="drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      {/* Performance (Fatigue) trend line - Blue - positioned on blue/performance bar */}
      {(selectedMetrics === 'both' || selectedMetrics === 'performance') && (
        <g>
          <polyline
            points={chartDataWithTrends.map((event, index) => {
              const x = barCenterPositions[index]?.wellness || 0;
              const normalizedPosition = scoreToPosition(event.performanceScore);
              const y = padding.top + chartHeight - (normalizedPosition * chartHeight);
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {chartDataWithTrends.map((event, index) => {
            const x = barCenterPositions[index]?.wellness || 0;
            const normalizedPosition = scoreToPosition(event.performanceScore);
            const y = padding.top + chartHeight - (normalizedPosition * chartHeight);
            
            return (
              <circle
                key={`perf-${index}`}
                cx={x}
                cy={y}
                r="3"
                fill="#3B82F6"
                stroke="white"
                strokeWidth="2"
                filter="url(#drop-shadow)"
              />
            );
          })}
        </g>
      )}

      {/* Wellness (Welfare) trend line - Red - positioned on gradient/wellness bar */}
      {(selectedMetrics === 'both' || selectedMetrics === 'wellness') && (
        <g>
          <polyline
            points={chartDataWithTrends.map((event, index) => {
              const x = barCenterPositions[index]?.performance || 0;
              // Use wellness-specific scale (1-5 risk category)
              const normalizedPosition = wellnessScoreToPosition(event.wellnessScore);
              const y = padding.top + chartHeight - (normalizedPosition * chartHeight);
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="#DC2626"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {chartDataWithTrends.map((event, index) => {
            const x = barCenterPositions[index]?.performance || 0;
            // Use wellness-specific scale (1-5 risk category)
            const normalizedPosition = wellnessScoreToPosition(event.wellnessScore);
            const y = padding.top + chartHeight - (normalizedPosition * chartHeight);
            
            return (
              <circle
                key={`well-${index}`}
                cx={x}
                cy={y}
                r="3"
                fill="#DC2626"
                stroke="white"
                strokeWidth="2"
                filter="url(#drop-shadow)"
              />
            );
          })}
        </g>
      )}
    </svg>
  );
};

export default TrendLines;
