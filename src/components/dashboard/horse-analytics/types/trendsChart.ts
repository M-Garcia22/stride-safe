/**
 * Base trends event from API - raw data without processing
 */
export interface BaseTrendsEvent {
  id: string;
  date: string;
  type: 'race' | 'breeze';
  location: string;
  distance: string;
  performanceScore: number;
  wellnessScore: number;
  welfareAlert: boolean;
}

/**
 * Processed trends event with additional display properties
 */
export interface TrendsEvent extends BaseTrendsEvent {
  formattedDate: string;
  index: number;
  daysBetween?: number | null;
  daysFromToday?: number;
}

export interface ChartConfig {
  padding: { top: number; right: number; bottom: number; left: number };
  chartWidth: number;
  chartHeight: number;
  barWidth: number;
  groupSpacing: number;
  barSpacing: number;
  barGroupWidth: number;
  useTimeBasedPositioning: boolean;
}

export interface CustomTrendsBarChartProps {
  data: TrendsEvent[];
  selectedMetrics: 'both' | 'performance' | 'wellness';
  highlightedEventId: string | null;
  onMouseEnter: (data: any, index: number) => void;
  onMouseLeave: () => void;
  onBarClick: (data: any, index: number) => void;
  width: number;
  height: number;
  showTrendLine?: boolean;
  useTimeBasedPositioning?: boolean;
  showDaysBetween?: boolean;
}
