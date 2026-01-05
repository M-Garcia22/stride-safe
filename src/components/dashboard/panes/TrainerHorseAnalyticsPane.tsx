import { useState, useEffect } from "react";
import { TrainerHorse } from "@/types/horse";
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

const TrainerHorseAnalyticsPane = ({ 
  onPaneChange, 
  selectedHorse: selectedTrainerHorse, 
  selectedHorseName,
  selectedReport 
}: TrainerHorseAnalyticsPaneProps) => {
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [shouldShowLastReport, setShouldShowLastReport] = useState(false);

  // Fetch all trainer horses to look up by name if needed
  const { loading: horsesLoading, findByName } = useTrainerHorses();

  // Use the passed horse, or find by name from the fetched list
  const effectiveHorse = selectedTrainerHorse || 
    (selectedHorseName ? findByName(selectedHorseName) : undefined);

  // Convert TrainerHorse to analytics format
  const analyticsHorse = effectiveHorse 
    ? trainerHorseToAnalyticsHorse(effectiveHorse) 
    : null;

  // Effect to handle horse selection
  useEffect(() => {
    if (selectedTrainerHorse || selectedHorseName) {
      setShouldShowLastReport(true);
    }
  }, [selectedTrainerHorse, selectedHorseName]);

  const handleSearchClick = () => {
    setShowSearchDialog(true);
  };

  const renderHorseInfo = () => {
    // Show loading while fetching horses (only if we need to look up by name)
    if (!selectedTrainerHorse && selectedHorseName && horsesLoading) {
      return <LoadingSpinner message="Loading horse data..." />;
    }

    // If we have full horse data (either passed or found by name), show the analytics
    if (analyticsHorse) {
      return (
        <div className="space-y-3">
          <HorseBasicInfoCard horse={analyticsHorse} />
          <HorseAnalyticsTabs 
            horse={analyticsHorse} 
            defaultTab={shouldShowLastReport ? "last-report" : undefined}
            selectedReport={selectedReport}
          />
        </div>
      );
    }

    // If we only have horse name but couldn't find in list, show minimal info
    if (selectedHorseName && selectedReport) {
      const minimalHorse = createMinimalHorse(String(selectedReport.id), selectedHorseName);

      return (
        <div className="space-y-3">
          <HorseBasicInfoCard horse={minimalHorse} />
          <HorseAnalyticsTabs 
            horse={minimalHorse} 
            defaultTab="last-report"
            selectedReport={selectedReport}
          />
        </div>
      );
    }

    return <NoHorseSelected />;
  };

  return (
    <div className="space-y-3">
      {/* Header with Search Field on the right */}
      <div className="flex items-center justify-end">
        <div className="relative max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search horses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={handleSearchClick}
            className="pl-8 cursor-pointer"
            readOnly
          />
        </div>
      </div>

      {renderHorseInfo()}

      <HorseSearchDialog
        open={showSearchDialog}
        onOpenChange={setShowSearchDialog}
        onSelectHorse={() => {}} // TODO: implement search selection
      />
    </div>
  );
};

export default TrainerHorseAnalyticsPane;
