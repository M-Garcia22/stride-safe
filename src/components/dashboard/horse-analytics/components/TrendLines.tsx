
import { useMemo } from "react";
import { scoreToPosition } from "../utils/nonLinearScale";

interface TrendsEvent {
  id: string;
  date: string;
  type: 'race' | 'breeze';
  location: string;
  distance: string;
  performanceScore: number;
  wellnessScore: number;
  welfareAlert: boolean;
  formattedDate: string;
  index: number;
  performanceTrend?: number;
  wellnessTrend?: number;
  positionRatio?: number;
}

interface TrendLinesProps {
  chartDataWithTrends: TrendsEvent[];
  selectedMetrics: 'both' | 'performance' | 'wellness';
  barCenterPositions: Array<{ performance: number; wellness: number }>;
  width: number;
  height: number;
}

const TrendLines = ({
  chartDataWithTrends,
  selectedMetrics,
  barCenterPositions,
  width,
  height
}: TrendLinesProps) => {
  if (chartDataWithTrends.length <= 1) return null;

  const padding = { top: 20, right: 20, bottom: 60, left: 60 };
  const chartHeight = height - padding.top - padding.bottom;

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
      
      {/* Performance (Fatigue) trend line - Blue */}
      {(selectedMetrics === 'both' || selectedMetrics === 'performance') && (
        <g>
          <polyline
            points={chartDataWithTrends.map((event, index) => {
              const x = barCenterPositions[index]?.performance || 0;
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
            const x = barCenterPositions[index]?.performance || 0;
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

      {/* Wellness (Welfare) trend line - Red */}
      {(selectedMetrics === 'both' || selectedMetrics === 'wellness') && (
        <g>
          <polyline
            points={chartDataWithTrends.map((event, index) => {
              const x = barCenterPositions[index]?.wellness || 0;
              const normalizedPosition = scoreToPosition(event.wellnessScore);
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
            const x = barCenterPositions[index]?.wellness || 0;
            const normalizedPosition = scoreToPosition(event.wellnessScore);
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
