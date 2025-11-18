
import { Horse } from "@/types/horse";
import { VelocityEvent } from "@/types/velocity";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import VelocityChartsView from "./VelocityChartsView";
import VelocityHistoryTable from "./VelocityHistoryTable";

type DisplayMode = 'both' | 'first10' | 'fullRace';

interface VelocityMainContentProps {
  horse: Horse;
  data: VelocityEvent[];
  splitView: boolean;
  highlightedEventId: string | null;
  selectedEventId: string | null;
  onEventHighlight: (eventId: string | null) => void;
  onEventSelect: (eventId: string) => void;
  displayMode: DisplayMode;
  isComparisonMode: boolean;
  selectedComparisonIds: string[];
}

const VelocityMainContent = ({
  horse,
  data,
  splitView,
  highlightedEventId,
  selectedEventId,
  onEventHighlight,
  onEventSelect,
  displayMode,
  isComparisonMode,
  selectedComparisonIds
}: VelocityMainContentProps) => {
  if (!splitView) {
    return (
      <div className="h-full">
        <VelocityChartsView
          data={data}
          highlightedEventId={highlightedEventId}
          selectedEventId={selectedEventId}
          onEventSelect={onEventSelect}
          displayMode={displayMode}
          isComparisonMode={isComparisonMode}
          selectedComparisonIds={selectedComparisonIds}
        />
      </div>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel defaultSize={50} minSize={30}>
        <VelocityChartsView
          data={data}
          highlightedEventId={highlightedEventId}
          selectedEventId={selectedEventId}
          onEventSelect={onEventSelect}
          displayMode={displayMode}
          isComparisonMode={isComparisonMode}
          selectedComparisonIds={selectedComparisonIds}
        />
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      <ResizablePanel defaultSize={50} minSize={30}>
        <VelocityHistoryTable
          data={data}
          selectedEventId={selectedEventId}
          onEventSelect={onEventSelect}
          onEventHighlight={onEventHighlight}
          isComparisonMode={isComparisonMode}
          selectedComparisonIds={selectedComparisonIds}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default VelocityMainContent;
