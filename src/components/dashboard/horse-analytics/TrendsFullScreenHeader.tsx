
import TrendsControlsBar from "./TrendsControlsBar";

interface TrendsFullScreenHeaderProps {
  selectedMetrics: 'both' | 'performance' | 'wellness';
  eventTypes: 'both' | 'race' | 'breeze';
  timeframe: '3m' | '6m' | '9m' | '12m' | 'all';
  showTrendLine: boolean;
  splitView: boolean;
  onMetricsChange: (value: 'both' | 'performance' | 'wellness') => void;
  onEventTypesChange: (value: 'both' | 'race' | 'breeze') => void;
  onTimeframeChange: (value: '3m' | '6m' | '9m' | '12m' | 'all') => void;
  onTrendLineChange: (value: boolean) => void;
  onSplitViewChange: (value: boolean) => void;
  onExport: (format: 'csv' | 'pdf' | 'json') => void;
}

const TrendsFullScreenHeader = ({
  selectedMetrics,
  eventTypes,
  timeframe,
  showTrendLine,
  splitView,
  onMetricsChange,
  onEventTypesChange,
  onTimeframeChange,
  onTrendLineChange,
  onSplitViewChange,
  onExport
}: TrendsFullScreenHeaderProps) => {
  return (
    <TrendsControlsBar
      selectedMetrics={selectedMetrics}
      timeframe={timeframe}
      eventTypes={eventTypes}
      showTrendLine={showTrendLine}
      splitView={splitView}
      onMetricsChange={onMetricsChange}
      onTimeframeChange={onTimeframeChange}
      onEventTypesChange={onEventTypesChange}
      onTrendLineChange={onTrendLineChange}
      onSplitViewChange={onSplitViewChange}
      onExport={onExport}
    />
  );
};

export default TrendsFullScreenHeader;
