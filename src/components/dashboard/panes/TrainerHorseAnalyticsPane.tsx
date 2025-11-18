import { useState, useEffect } from "react";
import { Horse } from "@/types/horse";
import { Report } from "@/types/report";
import HorseBasicInfoCard from "@/components/dashboard/horse-analytics/HorseBasicInfoCard";
import HorseAnalyticsTabs from "@/components/dashboard/horse-analytics/HorseAnalyticsTabs";
import NoHorseSelected from "@/components/dashboard/horse-analytics/NoHorseSelected";
import HorseSearchDialog from "@/components/dashboard/dialogs/HorseSearchDialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { TrainerDashboardPane } from "@/pages/TrainerDashboard";

interface TrainerHorseAnalyticsPaneProps {
  onPaneChange: (pane: TrainerDashboardPane) => void;
  selectedHorse?: string | null;
  selectedReport?: Report | null;
}

const TrainerHorseAnalyticsPane = ({ onPaneChange, selectedHorse: selectedHorseName, selectedReport }: TrainerHorseAnalyticsPaneProps) => {
  // Mock horse data - in real app this would come from an API
  const mockHorses: { [key: string]: Horse } = {
    "Midnight Approval": {
      id: "1",
      name: "Midnight Approval",
      yearOfBirth: 2022,
      sex: "Colt",
      color: "Bay",
      wellnessScore: 88,
      performanceScore: 92,
      welfareAlert: false,
      sire: "Sire Name",
      dam: "Dam Name",
      paternalGrandfather: "PG Father",
      paternalGrandmother: "PG Mother",
      maternalGrandfather: "MG Father",
      maternalGrandmother: "MG Mother",
      trainer: "Trainer Name",
      owner: "Owner Name",
      daysSinceLastReport: 3,
      sharedWithVets: ["vet1", "vet3"] // Shared with Dr. Sarah Johnson and Dr. Emily Rodriguez
    },
    "Thunder Strike": {
      id: "2",
      name: "Thunder Strike",
      yearOfBirth: 2021,
      sex: "Colt",
      color: "Chestnut",
      wellnessScore: 76,
      performanceScore: 84,
      welfareAlert: false,
      sire: "Thunder Sire",
      dam: "Strike Dam",
      paternalGrandfather: "Thunder PG Father",
      paternalGrandmother: "Thunder PG Mother",
      maternalGrandfather: "Strike MG Father",
      maternalGrandmother: "Strike MG Mother",
      trainer: "Trainer Name",
      owner: "Owner Name",
      daysSinceLastReport: 1,
      sharedWithVets: ["vet2"] // Shared with Dr. Michael Thompson
    },
    "Golden Arrow": {
      id: "3",
      name: "Golden Arrow",
      yearOfBirth: 2023,
      sex: "Filly",
      color: "Golden",
      wellnessScore: 94,
      performanceScore: 78,
      welfareAlert: true,
      sire: "Golden Sire",
      dam: "Arrow Dam",
      paternalGrandfather: "Golden PG Father",
      paternalGrandmother: "Golden PG Mother",
      maternalGrandfather: "Arrow MG Father",
      maternalGrandmother: "Arrow MG Mother",
      trainer: "Trainer Name",
      owner: "Owner Name",
      daysSinceLastReport: 2,
      sharedWithVets: [] // Not shared with any vets yet
    }
  };

  // Default horse to display when opening the pane (if no horse is selected from overview)
  const defaultHorse: Horse = {
    id: "1",
    name: "Midnight Approval",
    yearOfBirth: 2022,
    sex: "Colt",
    color: "Bay",
    wellnessScore: 88,
    performanceScore: 92,
    welfareAlert: false,
    sire: "Sire Name",
    dam: "Dam Name",
    paternalGrandfather: "PG Father",
    paternalGrandmother: "PG Mother",
    maternalGrandfather: "MG Father",
    maternalGrandmother: "MG Mother",
    trainer: "Trainer Name",
    owner: "Owner Name",
    daysSinceLastReport: 3,
    sharedWithVets: ["vet1", "vet3"]
  };

  const [selectedHorse, setSelectedHorse] = useState<Horse | null>(null);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [shouldShowLastReport, setShouldShowLastReport] = useState(false);

  // Effect to handle horse selection from overview pane
  useEffect(() => {
    if (selectedHorseName && mockHorses[selectedHorseName]) {
      setSelectedHorse(mockHorses[selectedHorseName]);
      setShouldShowLastReport(true);
    } else if (!selectedHorse) {
      setSelectedHorse(defaultHorse);
    }
  }, [selectedHorseName]);

  const handleSelectHorse = (horse: Horse) => {
    setSelectedHorse(horse);
    setShouldShowLastReport(false);
  };

  const handleSearchClick = () => {
    setShowSearchDialog(true);
  };

  const renderHorseInfo = () => {
    if (!selectedHorse) {
      return <NoHorseSelected />;
    }

    return (
      <div className="space-y-3">
        <HorseBasicInfoCard horse={selectedHorse} />
        <HorseAnalyticsTabs 
          horse={selectedHorse} 
          defaultTab={shouldShowLastReport ? "last-report" : undefined}
          selectedReport={selectedReport}
        />
      </div>
    );
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
        onSelectHorse={handleSelectHorse}
      />
    </div>
  );
};

export default TrainerHorseAnalyticsPane;
