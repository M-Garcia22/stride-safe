import { useState, useMemo } from "react";
import { Horse } from "@/types/horse";
import { useHorseHistory } from "@/hooks/useHorseHistory";
import TrendsControlsBar from "./TrendsControlsBar";
import TrendsMainContent from "./TrendsMainContent";
import { useTrendsExport } from "./hooks/useTrendsExport";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AlertCircle } from "lucide-react";

interface TrendsAnalysisPaneProps {
  horse: Horse;
}

// Convert timeframe to days for API
const timeframeToDays = (timeframe: '3m' | '6m' | '9m' | '12m' | 'all'): number => {
  switch (timeframe) {
    case '3m': return 90;
    case '6m': return 180;
    case '9m': return 270;
    case '12m': return 365;
    case 'all': return 0; // 0 = all time
    default: return 180;
  }
};

const TrendsAnalysisPane = ({ horse }: TrendsAnalysisPaneProps) => {
  const [selectedMetrics, setSelectedMetrics] = useState<'both' | 'performance' | 'wellness'>('both');
  const [timeframe, setTimeframe] = useState<'3m' | '6m' | '9m' | '12m' | 'all'>('6m');
  const [eventTypes, setEventTypes] = useState<'both' | 'race' | 'breeze'>('both');
  const [showTrendLine, setShowTrendLine] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [highlightedEventId, setHighlightedEventId] = useState<string | null>(null);
  const [splitView, setSplitView] = useState(false);

  // Fetch real data from API
  const days = useMemo(() => timeframeToDays(timeframe), [timeframe]);
  const { events: trendsData, loading, error } = useHorseHistory({
    horseId: horse.id,
    days,
  });

  const { handleExport } = useTrendsExport(trendsData, horse.name);

  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId);
    setHighlightedEventId(eventId);
  };

  const handleEventHighlight = (eventId: string | null) => {
    setHighlightedEventId(eventId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner message="Loading welfare & fatigue data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <div>
            <p className="font-medium text-foreground">Failed to load data</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-screen overflow-hidden">
      {/* Controls */}
      <TrendsControlsBar
        selectedMetrics={selectedMetrics}
        timeframe={timeframe}
        eventTypes={eventTypes}
        showTrendLine={showTrendLine}
        splitView={splitView}
        onMetricsChange={setSelectedMetrics}
        onTimeframeChange={setTimeframe}
        onEventTypesChange={setEventTypes}
        onTrendLineChange={setShowTrendLine}
        onSplitViewChange={setSplitView}
        onExport={handleExport}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <TrendsMainContent
          horse={horse}
          trendsData={trendsData}
          selectedMetrics={selectedMetrics}
          timeframe={timeframe}
          eventTypes={eventTypes}
          showTrendLine={showTrendLine}
          highlightedEventId={highlightedEventId}
          selectedEventId={selectedEventId}
          splitView={splitView}
          onEventHighlight={handleEventHighlight}
          onEventSelect={handleEventSelect}
        />
      </div>
    </div>
  );
};

export default TrendsAnalysisPane;
