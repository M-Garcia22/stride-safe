
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Horse } from "@/types/horse";
import TrendsChartsView from "./TrendsChartsView";
import TrendsHistoryTable from "./TrendsHistoryTable";
import { BaseTrendsEvent } from "./types/trendsChart";

interface TrendsMainContentProps {
  horse: Horse;
  trendsData: BaseTrendsEvent[];
  selectedMetrics: 'both' | 'performance' | 'wellness';
  timeframe: '3m' | '6m' | '9m' | '12m' | 'all';
  eventTypes: 'both' | 'race' | 'breeze';
  showTrendLine: boolean;
  highlightedEventId: string | null;
  selectedEventId: string | null;
  splitView: boolean;
  onEventHighlight: (eventId: string | null) => void;
  onEventSelect: (eventId: string) => void;
}

const TrendsMainContent = ({
  horse,
  trendsData,
  selectedMetrics,
  timeframe,
  eventTypes,
  showTrendLine,
  highlightedEventId,
  selectedEventId,
  splitView,
  onEventHighlight,
  onEventSelect
}: TrendsMainContentProps) => {
  if (splitView) {
    return (
      <div className="h-full">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={50} minSize={30} className="min-w-0">
            <div className="h-full overflow-hidden">
              <TrendsChartsView
                data={trendsData}
                selectedMetrics={selectedMetrics}
                timeframe={timeframe}
                eventTypes={eventTypes}
                showTrendLine={showTrendLine}
                highlightedEventId={highlightedEventId}
                onEventHighlight={onEventHighlight}
                onEventSelect={onEventSelect}
                fullScreen={false}
                horse={horse}
              />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={30} className="min-w-0">
            <div className="h-full overflow-hidden">
              <TrendsHistoryTable
                data={trendsData}
                timeframe={timeframe}
                eventTypes={eventTypes}
                selectedEventId={selectedEventId}
                highlightedEventId={highlightedEventId}
                onEventSelect={onEventSelect}
                onEventHighlight={onEventHighlight}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden">
      <TrendsChartsView
        data={trendsData}
        selectedMetrics={selectedMetrics}
        timeframe={timeframe}
        eventTypes={eventTypes}
        showTrendLine={showTrendLine}
        highlightedEventId={highlightedEventId}
        onEventHighlight={onEventHighlight}
        onEventSelect={onEventSelect}
        fullScreen={false}
        horse={horse}
      />
    </div>
  );
};

export default TrendsMainContent;
