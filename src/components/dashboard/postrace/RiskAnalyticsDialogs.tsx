
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CustomReportBuilder, { ReportConfig } from "./CustomReportBuilder";
import DataExportOptions, { ExportOptions } from "./DataExportOptions";
import AutomatedReporting, { ScheduledReportConfig } from "./AutomatedReporting";

interface RiskAnalyticsDialogsProps {
  showReportsDialog: boolean;
  setShowReportsDialog: (value: boolean) => void;
  showExportDialog: boolean;
  setShowExportDialog: (value: boolean) => void;
  showAutomationDialog: boolean;
  setShowAutomationDialog: (value: boolean) => void;
  selectedDataPoint: any;
  setSelectedDataPoint: (value: any) => void;
  isFullscreenLocal: boolean;
  setIsFullscreenLocal: (value: boolean) => void;
  horses: any[];
  historicalData: any[];
  onCustomReportGenerate: (config: ReportConfig) => void;
  onDataExport: (format: string, options: ExportOptions) => Promise<any>;
  onScheduleReport: (config: ScheduledReportConfig) => void;
  RiskCategoryAnalyticsComponent: React.ComponentType<any>;
}

const RiskAnalyticsDialogs = ({
  showReportsDialog,
  setShowReportsDialog,
  showExportDialog,
  setShowExportDialog,
  showAutomationDialog,
  setShowAutomationDialog,
  selectedDataPoint,
  setSelectedDataPoint,
  isFullscreenLocal,
  setIsFullscreenLocal,
  horses,
  historicalData,
  onCustomReportGenerate,
  onDataExport,
  onScheduleReport,
  RiskCategoryAnalyticsComponent
}: RiskAnalyticsDialogsProps) => {
  return (
    <>
      {/* Dialog boxes for Reports, Export, and Automation */}
      <Dialog open={showReportsDialog} onOpenChange={setShowReportsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Custom Report Builder</DialogTitle>
          </DialogHeader>
          <CustomReportBuilder onGenerateReport={onCustomReportGenerate} />
        </DialogContent>
      </Dialog>

      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Data Export Options</DialogTitle>
          </DialogHeader>
          <DataExportOptions 
            data={historicalData} 
            onExport={onDataExport}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showAutomationDialog} onOpenChange={setShowAutomationDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Automated Reporting</DialogTitle>
          </DialogHeader>
          <AutomatedReporting onScheduleReport={onScheduleReport} />
        </DialogContent>
      </Dialog>

      {/* Drill-down dialog */}
      {selectedDataPoint && (
        <Dialog open={!!selectedDataPoint} onOpenChange={() => setSelectedDataPoint(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Category {selectedDataPoint.category} Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Current Risk Level</div>
                  <div className="text-2xl font-bold">{selectedDataPoint.percentage?.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Horse Count</div>
                  <div className="text-2xl font-bold">{selectedDataPoint.count}</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Click on data points in the chart to see detailed analysis for specific time periods.
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Fullscreen modal */}
      {isFullscreenLocal && (
        <Dialog open={isFullscreenLocal} onOpenChange={setIsFullscreenLocal}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0">
            <div className="flex-1 p-6 overflow-auto">
              <RiskCategoryAnalyticsComponent horses={horses} isFullscreen={true} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default RiskAnalyticsDialogs;
