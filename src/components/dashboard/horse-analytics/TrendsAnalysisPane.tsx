import { useState } from "react";
import { Horse } from "@/types/horse";
import { generateTrendsData } from "@/utils/trendsData";
import TrendsControlsBar from "./TrendsControlsBar";
import TrendsMainContent from "./TrendsMainContent";
import { useTrendsExport } from "./hooks/useTrendsExport";

interface TrendsAnalysisPaneProps {
  horse: Horse;
}

const TrendsAnalysisPane = ({ horse }: TrendsAnalysisPaneProps) => {
  const [selectedMetrics, setSelectedMetrics] = useState<'both' | 'performance' | 'wellness'>('both');
  const [timeframe, setTimeframe] = useState<'3m' | '6m' | '9m' | '12m' | 'all'>('6m');
  const [eventTypes, setEventTypes] = useState<'both' | 'race' | 'breeze'>('both');
  const [showTrendLine, setShowTrendLine] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [highlightedEventId, setHighlightedEventId] = useState<string | null>(null);
  const [splitView, setSplitView] = useState(false);

  // Generate sample data once and keep it stable
  const [trendsData] = useState(() => generateTrendsData(horse.id));

  const { handleExport } = useTrendsExport(trendsData, horse.name);

  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId);
    setHighlightedEventId(eventId);
  };

  const handleEventHighlight = (eventId: string | null) => {
    setHighlightedEventId(eventId);
  };

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
