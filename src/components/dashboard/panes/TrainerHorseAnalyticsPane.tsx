import { useState, useEffect, useCallback } from "react";
import { TrainerHorse, HorseReport } from "@/types/horse";
import { Report } from "@/types/report";
import HorseBasicInfoCard from "@/components/dashboard/horse-analytics/HorseBasicInfoCard";
import HorseAnalyticsTabs from "@/components/dashboard/horse-analytics/HorseAnalyticsTabs";
import NoHorseSelected from "@/components/dashboard/horse-analytics/NoHorseSelected";
import HorseSearchDialog from "@/components/dashboard/dialogs/HorseSearchDialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { TrainerDashboardPane } from "@/pages/TrainerDashboard";
import { useTrainerHorses } from "@/hooks/useTrainerHorses";
import { trainerHorseToAnalyticsHorse, createMinimalHorse } from "@/lib/horseMappers";

interface TrainerHorseAnalyticsPaneProps {
  onPaneChange: (pane: TrainerDashboardPane) => void;
  selectedHorse?: TrainerHorse | null;
  selectedHorseName?: string | null;
  selectedReport?: Report | null;
}

/** Convert a HorseReport to a Report object */
const toReport = (report: HorseReport, horseName: string): Report => ({
  ...report,
  horseName,
  isNew: false,
  welfareRiskCategory: report.welfareRiskCategory ?? 1,
  fatigueScore: report.fatigueScore ?? 50,
});

const TrainerHorseAnalyticsPane = ({ 
  onPaneChange, 
  selectedHorse: parentHorse, 
  selectedHorseName: parentHorseName,
  selectedReport: parentReport 
}: TrainerHorseAnalyticsPaneProps) => {
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  
  // Local state for search-selected horse (overrides parent when set)
  const [localHorse, setLocalHorse] = useState<TrainerHorse | null>(null);
  const [localReport, setLocalReport] = useState<Report | null>(null);

  const { loading: horsesLoading, findByName } = useTrainerHorses();

  // Reset local selection when parent selection changes
  useEffect(() => {
    if (parentHorse || parentHorseName) {
      setLocalHorse(null);
      setLocalReport(null);
    }
  }, [parentHorse, parentHorseName]);

  // Determine which horse/report to display (local overrides parent)
  const activeHorse = localHorse ?? parentHorse ?? (parentHorseName ? findByName(parentHorseName) : null);
  const activeReport = localReport ?? parentReport;
  const analyticsHorse = activeHorse ? trainerHorseToAnalyticsHorse(activeHorse) : null;

  const handleSearchSelect = useCallback((horse: TrainerHorse) => {
    setLocalHorse(horse);
    
    // Use most recent report if available
    const mostRecent = horse.recentReports?.[0];
    setLocalReport(mostRecent ? toReport(mostRecent, horse.name) : null);
  }, []);

  // Loading state
  if (!parentHorse && parentHorseName && horsesLoading) {
    return <LoadingSpinner message="Loading horse data..." />;
  }

  return (
    <div className="space-y-3">
      {/* Search Header */}
      <div className="flex items-center justify-end">
        <div className="relative max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search horses..."
            onClick={() => setShowSearchDialog(true)}
            className="pl-8 cursor-pointer"
            readOnly
          />
        </div>
      </div>

      {/* Horse Content */}
      {analyticsHorse ? (
        <div className="space-y-3" key={analyticsHorse.id}>
          <HorseBasicInfoCard horse={analyticsHorse} />
          <HorseAnalyticsTabs 
            horse={analyticsHorse} 
            defaultTab="last-report"
            selectedReport={activeReport}
          />
        </div>
      ) : parentHorseName && parentReport ? (
        <div className="space-y-3">
          <HorseBasicInfoCard horse={createMinimalHorse(String(parentReport.id), parentHorseName)} />
          <HorseAnalyticsTabs 
            horse={createMinimalHorse(String(parentReport.id), parentHorseName)} 
            defaultTab="last-report"
            selectedReport={parentReport}
          />
        </div>
      ) : (
        <NoHorseSelected />
      )}

      <HorseSearchDialog
        open={showSearchDialog}
        onOpenChange={setShowSearchDialog}
        onSelectHorse={handleSearchSelect}
      />
    </div>
  );
};

export default TrainerHorseAnalyticsPane;
