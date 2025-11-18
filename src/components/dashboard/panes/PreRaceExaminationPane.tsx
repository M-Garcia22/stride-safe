
import { useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import PreRaceHeader from "../prerace/PreRaceHeader";
import WorkflowNavigation from "../prerace/WorkflowNavigation";
import RaceTabsContainer from "../prerace/RaceTabsContainer";
import PreRaceHorseDetails from "../prerace/PreRaceHorseDetails";
import { usePreRaceData } from "../../../hooks/usePreRaceData";
import { usePreRaceWorkflow } from "../../../hooks/usePreRaceWorkflow";
import { usePreRaceSelection } from "../../../hooks/usePreRaceSelection";
import { usePreRaceDataManager } from "../../../hooks/usePreRaceDataManager";
import { getSplitViewColumns, getSingleViewColumns } from "../../../utils/preRaceHelpers";
import { SensitivitySettings } from "../../../data/preRaceData";
import { getCurrentRiskCategory, isRedFlaggedCategory } from "../../../data/preRaceData";

// Re-export types for compatibility
export type { PreRaceHorse, RaceInfo } from "../../../data/preRaceData";

const PreRaceExaminationPane = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<'single' | 'split'>('split');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [sensitivitySettings, setSensitivitySettings] = useState<SensitivitySettings>({
    category3: 'medium',
    category4: 'high',
    category5: 'high'
  });

  // Data management
  const { 
    horses, 
    handleExaminationAction: dataManagerExaminationAction, 
    getHorseById 
  } = usePreRaceDataManager();

  // Custom hooks
  const { 
    allHorses, 
    welfareAlertHorses, 
    toExamineHorses, 
    passedHorses, 
    scratchedHorses,
    categoryCounts,
    getHorsesByWorkflow,
    getHorsesByCategory,
    getCombinedFilters,
    getHorsesByRaceAndWorkflow,
    getHorsesByRaceAndCategory
  } = usePreRaceData(horses);

  const { workflowView, setWorkflowView } = usePreRaceWorkflow();
  
  const { 
    selectedHorse, 
    handleHorseSelect, 
    handleExaminationAction, 
    clearSelection 
  } = usePreRaceSelection(getHorseById, dataManagerExaminationAction);

  // Computed values
  const hasWelfareAlerts = welfareAlertHorses.length > 0;
  
  // Get horses based on current filters
  const getFilteredHorses = () => {
    if (selectedCategories.length > 0) {
      return getCombinedFilters(workflowView, selectedCategories);
    }
    return getHorsesByWorkflow(workflowView);
  };

  const workflowHorses = getFilteredHorses();
  const visibleColumns = viewMode === 'split' ? getSplitViewColumns() : getSingleViewColumns();

  const counts = {
    toExamine: toExamineHorses.length,
    passed: passedHorses.length,
    scratched: scratchedHorses.length,
    welfareAlerts: welfareAlertHorses.length
  };

  const handleWorkflowChange = (view: typeof workflowView) => {
    setWorkflowView(view);
    clearSelection();
  };

  const handleViewModeChange = (mode: 'single' | 'split') => {
    setViewMode(mode);
    if (mode === 'single') {
      clearSelection();
    }
  };

  const handleCategoryChange = (categories: number[]) => {
    setSelectedCategories(categories);
    clearSelection();
  };

  const handleSensitivityChange = (settings: SensitivitySettings) => {
    setSensitivitySettings(settings);
  };

  const renderContent = () => {
    if (viewMode === 'split') {
      return (
        <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-300px)]">
          <ResizablePanel defaultSize={50} minSize={30} className="flex flex-col">
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-4">
                <RaceTabsContainer
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  workflowHorses={workflowHorses}
                  getHorsesByRaceAndWorkflow={(raceNumber) => {
                    if (selectedCategories.length > 0) {
                      return getCombinedFilters(workflowView, selectedCategories, raceNumber);
                    }
                    return getHorsesByRaceAndWorkflow(raceNumber, workflowView);
                  }}
                  visibleColumns={visibleColumns}
                  viewMode={viewMode}
                  selectedHorse={selectedHorse}
                  onHorseSelect={handleHorseSelect}
                  onExaminationAction={handleExaminationAction}
                  sensitivitySettings={sensitivitySettings}
                />
              </div>
            </ScrollArea>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={50} minSize={30} className="flex flex-col">
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-4">
                {selectedHorse ? (
                  <PreRaceHorseDetails
                    horse={selectedHorse}
                    onClose={clearSelection}
                    onExaminationAction={handleExaminationAction}
                    sensitivitySettings={sensitivitySettings}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <p className="text-lg mb-2">Select a horse to view details</p>
                      <p className="text-sm">Click on any horse in the table to see examination information</p>
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
      <RaceTabsContainer
        activeTab={activeTab}
        onTabChange={setActiveTab}
        workflowHorses={workflowHorses}
        getHorsesByRaceAndWorkflow={(raceNumber) => {
          if (selectedCategories.length > 0) {
            return getCombinedFilters(workflowView, selectedCategories, raceNumber);
          }
          return getHorsesByRaceAndWorkflow(raceNumber, workflowView);
        }}
        visibleColumns={visibleColumns}
        viewMode={viewMode}
        selectedHorse={selectedHorse}
        onHorseSelect={handleHorseSelect}
        onExaminationAction={handleExaminationAction}
        sensitivitySettings={sensitivitySettings}
      />
    );
  };

  return (
    <div className="space-y-6">
      <PreRaceHeader
        totalHorses={allHorses.length}
        welfareAlertsCount={welfareAlertHorses.length}
        hasWelfareAlerts={hasWelfareAlerts}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />

      <WorkflowNavigation
        workflowView={workflowView}
        onWorkflowChange={handleWorkflowChange}
        counts={counts}
        hasWelfareAlerts={hasWelfareAlerts}
        totalHorses={allHorses.length}
        selectedCategories={selectedCategories}
        onCategoryChange={handleCategoryChange}
        categoryCounts={categoryCounts}
        sensitivitySettings={sensitivitySettings}
        onSensitivityChange={handleSensitivityChange}
        showCategoryFilter={showCategoryFilter}
        onToggleCategoryFilter={() => setShowCategoryFilter(!showCategoryFilter)}
      />

      {renderContent()}
    </div>
  );
};

export default PreRaceExaminationPane;
