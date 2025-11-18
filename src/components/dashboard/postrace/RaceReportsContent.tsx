
import { useState, useEffect } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import PostRaceTabsContainer from "./PostRaceTabsContainer";
import PostRaceHorseDetails from "./PostRaceHorseDetails";
import { PostRaceHorse, PostRaceColumnKey } from "../../../data/postRaceData";

interface RaceReportsContentProps {
  viewMode: 'single' | 'split';
  activeRaceTab: string;
  onRaceTabChange: (value: string) => void;
  workflowHorses: PostRaceHorse[];
  getHorsesByRaceAndWorkflow: (raceNumber: number) => PostRaceHorse[];
  visibleColumns: PostRaceColumnKey[];
  selectedHorse: PostRaceHorse | null;
  onHorseSelect: (horse: PostRaceHorse) => void;
  onClearSelection: () => void;
  onHistoricReports?: (horseName: string) => void;
}

const RaceReportsContent = ({
  viewMode,
  activeRaceTab,
  onRaceTabChange,
  workflowHorses,
  getHorsesByRaceAndWorkflow,
  visibleColumns,
  selectedHorse,
  onHorseSelect,
  onClearSelection,
  onHistoricReports
}: RaceReportsContentProps) => {
  const [isManuallyResized, setIsManuallyResized] = useState(false);
  const [panelKey, setPanelKey] = useState(0);

  // Force re-render with new default sizes when selection changes
  useEffect(() => {
    if (!isManuallyResized) {
      setPanelKey(prev => prev + 1);
    }
  }, [selectedHorse, isManuallyResized]);

  const handlePanelResize = () => {
    setIsManuallyResized(true);
  };

  // Reset manual resize flag when view mode changes
  useEffect(() => {
    setIsManuallyResized(false);
    setPanelKey(prev => prev + 1);
  }, [viewMode]);

  if (viewMode === 'split') {
    return (
      <ResizablePanelGroup 
        key={panelKey}
        direction="horizontal" 
        className="h-[calc(100vh-380px)] min-h-[500px] w-full"
        onLayout={handlePanelResize}
      >
        <ResizablePanel 
          defaultSize={50}
          minSize={35} 
          maxSize={70}
          className="flex flex-col min-w-0"
        >
          <ScrollArea className="flex-1 h-full">
            <div className="p-3">
              <PostRaceTabsContainer
                activeTab={activeRaceTab}
                onTabChange={onRaceTabChange}
                workflowHorses={workflowHorses}
                getHorsesByRaceAndWorkflow={getHorsesByRaceAndWorkflow}
                visibleColumns={visibleColumns}
                viewMode={viewMode}
                selectedHorse={selectedHorse}
                onHorseSelect={onHorseSelect}
              />
            </div>
          </ScrollArea>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel 
          defaultSize={50}
          minSize={35} 
          maxSize={70}
          className="flex flex-col min-w-0"
        >
          <ScrollArea className="flex-1 h-full">
            <div className="p-3 h-full">
              {selectedHorse ? (
                <PostRaceHorseDetails
                  horse={selectedHorse}
                  onClose={onClearSelection}
                  onHistoricReports={onHistoricReports}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center max-w-md px-4">
                    <p className="text-lg mb-2">Select a horse to view post-race details</p>
                    <p className="text-sm">Click on any horse in the table to see race analysis and examination information</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  }

  return (
    <div className="h-[calc(100vh-380px)] min-h-[500px]">
      <PostRaceTabsContainer
        activeTab={activeRaceTab}
        onTabChange={onRaceTabChange}
        workflowHorses={workflowHorses}
        getHorsesByRaceAndWorkflow={getHorsesByRaceAndWorkflow}
        visibleColumns={visibleColumns}
        viewMode={viewMode}
        selectedHorse={selectedHorse}
        onHorseSelect={onHorseSelect}
      />
    </div>
  );
};

export default RaceReportsContent;
