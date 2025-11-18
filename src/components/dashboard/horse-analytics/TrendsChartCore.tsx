
import { useMemo } from "react";
import CustomTrendsBarChart from "./CustomTrendsBarChart";
import TrendLines from "./components/TrendLines";
import { useBarPositions } from "./hooks/useBarPositions";

interface TrendsEvent {
  id: string;
  date: string;
  type: 'race' | 'breeze';
  location: string;
  distance: string;
  performanceScore: number;
  wellnessScore: number;
  welfareAlert: boolean;
}

interface ProcessedEvent extends TrendsEvent {
  performanceChange: number;
  wellnessChange: number;
  formattedDate: string;
  index: number;
  performanceTrend?: number;
  wellnessTrend?: number;
  positionRatio?: number;
}

interface TrendData {
  performance: {
    color: string;
    data: number[];
  };
  wellness: {
    color: string;
    data: number[];
  };
}

interface TrendsChartCoreProps {
  processedData: ProcessedEvent[];
  trendData: TrendData | null;
  selectedMetrics: 'both' | 'performance' | 'wellness';
  showTrendLine: boolean;
  highlightedEventId: string | null;
  onMouseEnter: (data: any, index: number) => void;
  onMouseLeave: () => void;
  onBarClick: (data: any, index: number) => void;
  width: number;
  height: number;
  useTimeBasedPositioning?: boolean;
  showDaysBetween?: boolean;
}

const TrendsChartCore = ({
  processedData,
  trendData,
  selectedMetrics,
  showTrendLine,
  highlightedEventId,
  onMouseEnter,
  onMouseLeave,
  onBarClick,
  width,
  height,
  useTimeBasedPositioning = false,
  showDaysBetween = false
}: TrendsChartCoreProps) => {
  const chartDataWithTrends = useMemo(() => {
    if (!trendData) return processedData;
    
    return processedData.map((item, index) => ({
      ...item,
      performanceTrend: trendData.performance.data[index],
      wellnessTrend: trendData.wellness.data[index],
      xIndex: index
    }));
  }, [processedData, trendData]);

  const barCenterPositions = useBarPositions(
    width,
    height,
    processedData.length,
    selectedMetrics,
    useTimeBasedPositioning
  );

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ width, height }}>
      {/* Custom Bar Chart */}
      <div className="absolute inset-0">
        <CustomTrendsBarChart
          data={processedData}
          selectedMetrics={selectedMetrics}
          highlightedEventId={highlightedEventId}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onBarClick={onBarClick}
          width={width}
          height={height}
          showTrendLine={showTrendLine}
          useTimeBasedPositioning={useTimeBasedPositioning}
          showDaysBetween={showDaysBetween}
        />
      </div>

      {/* Point-to-Point Trend Lines Overlay */}
      {showTrendLine && trendData && chartDataWithTrends.length > 1 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <TrendLines
            chartDataWithTrends={chartDataWithTrends}
            selectedMetrics={selectedMetrics}
            barCenterPositions={barCenterPositions}
            width={width}
            height={height}
          />
        </div>
      )}
    </div>
  );
};

export default TrendsChartCore;
