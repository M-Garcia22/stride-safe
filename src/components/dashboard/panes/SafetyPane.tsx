import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import DateSelector from "../postrace/DateSelector";
import OverviewMetrics from "../postrace/OverviewMetrics";
import RiskCategoryAnalytics from "../postrace/RiskCategoryAnalytics";
import RaceReportsControls from "../postrace/RaceReportsControls";
import RaceReportsContent from "../postrace/RaceReportsContent";
import CreatePDFReportDialog from "../dialogs/CreatePDFReportDialog";
import { usePostRaceData } from "../../../hooks/usePostRaceData";
import { usePostRaceWorkflow } from "../../../hooks/usePostRaceWorkflow";
import { usePostRaceSelection } from "../../../hooks/usePostRaceSelection";
import { usePostRaceDataManager } from "../../../hooks/usePostRaceDataManager";
import { PostRaceColumnKey } from "../../../data/postRaceData";
import { PostRaceSensitivitySettings } from "../postrace/PostRaceSensitivitySettings";

interface SafetyPaneProps {
  onHistoricReports?: (horseName: string) => void;
}

const SafetyPane = ({ onHistoricReports }: SafetyPaneProps) => {
  const [activeMainTab, setActiveMainTab] = useState("overview");
  const [activeRaceTab, setActiveRaceTab] = useState("all");
  const [viewMode, setViewMode] = useState<'single' | 'split'>('split');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showPDFDialog, setShowPDFDialog] = useState(false);

  // Sensitivity settings state
  const [sensitivitySettings, setSensitivitySettings] = useState<PostRaceSensitivitySettings>({
    category3: 'medium',
    category4: 'high',
    category5: 'high',
    trendAlertThreshold: 10,
    enableTrendAlerts: true,
    highlightAnomalies: true,
    showConfidenceIntervals: false
  });

  // Data management
  const { horses, getHorseById } = usePostRaceDataManager();

  // Custom hooks
  const { 
    allHorses, 
    welfareAlertHorses, 
    finishedHorses,
    dnfHorses,
    getHorsesByWorkflow,
    getHorsesByRaceAndWorkflow
  } = usePostRaceData(horses);

  const { workflowView, setWorkflowView } = usePostRaceWorkflow();
  
  const { 
    selectedHorse, 
    handleHorseSelect, 
    clearSelection 
  } = usePostRaceSelection(getHorseById);

  // Computed values
  const hasWelfareAlerts = welfareAlertHorses.length > 0;
  const workflowHorses = getHorsesByWorkflow(workflowView);
  
  // Column configuration for different view modes
  const getSplitViewColumns = (): PostRaceColumnKey[] => [
    'race', 'finish', 'welfare', 'risk', 'welfareAlert'
  ];

  const getSingleViewColumns = (): PostRaceColumnKey[] => [
    'race', 'finish', 'welfare', 'risk', 'cFx', 'sFx', 'lf', 'rf', 'bf', 'hl', 'welfareAlert'
  ];

  const visibleColumns = viewMode === 'split' ? getSplitViewColumns() : getSingleViewColumns();

  const counts = {
    welfareAlerts: welfareAlertHorses.length
  };

  // Calculate overview metrics
  const totalRaces = [...new Set(allHorses.map(horse => horse.raceNumber))].length;
  const totalHorses = allHorses.length;
  const horsesFinished = finishedHorses.length;
  const horsesDNF = dnfHorses.length;
  const catastrophicInjuries = allHorses.filter(horse => 
    horse.welfareReports.some(report => 
      report.alerts.includes('C-Fx') && report.riskCategory === 5
    )
  ).length;

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

  // Mock dates with available reports (in a real app, this would come from your data)
  const availableReportDates = [
    new Date(2024, 0, 15), // January 15, 2024
    new Date(2024, 0, 10), // January 10, 2024
    new Date(2024, 0, 5),  // January 5, 2024
    new Date(), // Today
  ];

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="space-y-6 h-full">
      {/* Date Card and PDF Report Button Row */}
      <div className="flex items-center justify-between">
        <DateSelector
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          availableReportDates={availableReportDates}
        />
        
        <Button
          variant="outline"
          onClick={() => setShowPDFDialog(true)}
          className="flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Create PDF Report
        </Button>
      </div>

      <div className="flex-1 min-h-0">
        <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="race-reports">Race Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 flex-1 space-y-6">
            {/* Overview Cards */}
            <OverviewMetrics
              totalRaces={totalRaces}
              totalHorses={totalHorses}
              horsesFinished={horsesFinished}
              horsesDNF={horsesDNF}
              catastrophicInjuries={catastrophicInjuries}
              welfareAlertsCount={welfareAlertHorses.length}
              hasWelfareAlerts={hasWelfareAlerts}
            />

            {/* Risk Category Analytics with Sensitivity Settings */}
            <RiskCategoryAnalytics 
              horses={allHorses} 
              sensitivitySettings={sensitivitySettings}
              onSensitivityChange={setSensitivitySettings}
            />

            <div className="text-center py-8 text-muted-foreground">
              <p className="text-lg mb-2">Overview Dashboard</p>
              <p className="text-sm">Summary of today's post-race data and welfare monitoring</p>
            </div>
          </TabsContent>

          <TabsContent value="race-reports" className="mt-6 flex-1 min-h-0 flex flex-col">
            {/* Controls Row - Workflow buttons left, View mode buttons right */}
            <div className="flex-shrink-0 mb-6">
              <RaceReportsControls
                workflowView={workflowView}
                onWorkflowChange={handleWorkflowChange}
                counts={counts}
                hasWelfareAlerts={hasWelfareAlerts}
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
                selectedDate={selectedDate}
                hidePDFButton={true}
              />
            </div>

            <div className="flex-1 min-h-0">
              <RaceReportsContent
                viewMode={viewMode}
                activeRaceTab={activeRaceTab}
                onRaceTabChange={setActiveRaceTab}
                workflowHorses={workflowHorses}
                getHorsesByRaceAndWorkflow={(raceNumber) => getHorsesByRaceAndWorkflow(raceNumber, workflowView)}
                visibleColumns={visibleColumns}
                selectedHorse={selectedHorse}
                onHorseSelect={handleHorseSelect}
                onClearSelection={clearSelection}
                onHistoricReports={onHistoricReports}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CreatePDFReportDialog 
        open={showPDFDialog}
        onOpenChange={setShowPDFDialog}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default SafetyPane;
