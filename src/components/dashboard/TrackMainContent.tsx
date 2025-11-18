
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { DashboardPane } from "@/pages/TrackDashboard";
import HeaderActions from "./HeaderActions";
import OverviewPane from "./panes/OverviewPane";
import RacesPane from "./panes/RacesPane";
import HorsesPane from "./panes/HorsesPane";
import VeterinaryPane from "./panes/VeterinaryPane";
import IndividualAnalysisPane from "./panes/IndividualAnalysisPane";
import SafetyPane from "./panes/SafetyPane";
import SettingsPane from "./panes/SettingsPane";
import BlackBoxPane from "./panes/BlackBoxPane";
import TrackSAFEPane from "./panes/TrackSAFEPane";
import AlertHorsesPane from "./panes/AlertHorsesPane";
import StrideAnalysisPane from "./panes/StrideAnalysisPane";
import PreRaceExaminationPane from "./panes/PreRaceExaminationPane";
import { useState } from "react";

interface TrackMainContentProps {
  activePane: DashboardPane;
  onPaneChange: (pane: DashboardPane) => void;
}

const TrackMainContent = ({ activePane, onPaneChange }: TrackMainContentProps) => {
  const [strideAnalysisHorse, setStrideAnalysisHorse] = useState<string | null>(null);
  const [historicReportsHorse, setHistoricReportsHorse] = useState<string | null>(null);

  const handleStrideAnalysis = (horseName: string) => {
    setStrideAnalysisHorse(horseName);
  };

  const handleBackFromStrideAnalysis = () => {
    setStrideAnalysisHorse(null);
  };

  const handleHistoricReports = (horseName: string) => {
    setHistoricReportsHorse(horseName);
    onPaneChange("individual");
  };

  const handleBackFromHistoricReports = () => {
    setHistoricReportsHorse(null);
    onPaneChange("safety");
  };

  const renderPane = () => {
    // If we're showing stride analysis, render that pane
    if (strideAnalysisHorse) {
      return (
        <StrideAnalysisPane 
          horseName={strideAnalysisHorse} 
          onBack={handleBackFromStrideAnalysis} 
        />
      );
    }

    switch (activePane) {
      case "overview":
        return <OverviewPane onPaneChange={onPaneChange} />;
      case "races":
        return <RacesPane />;
      case "horses":
        return <HorsesPane onStrideAnalysis={handleStrideAnalysis} />;
      case "veterinary":
        return <PreRaceExaminationPane />;
      case "individual":
        return (
          <IndividualAnalysisPane 
            horseName={historicReportsHorse} 
            onBack={historicReportsHorse ? handleBackFromHistoricReports : undefined}
          />
        );
      case "safety":
        return <SafetyPane onHistoricReports={handleHistoricReports} />;
      case "blackbox":
        return <BlackBoxPane />;
      case "tracksafe":
        return <TrackSAFEPane />;
      case "alerts":
        return <AlertHorsesPane />;
      case "settings":
        return <SettingsPane />;
      default:
        return <OverviewPane onPaneChange={onPaneChange} />;
    }
  };

  const getPaneTitle = () => {
    if (strideAnalysisHorse) {
      return `Stride Analysis - ${strideAnalysisHorse}`;
    }

    if (historicReportsHorse && activePane === "individual") {
      return `Historic Reports - ${historicReportsHorse}`;
    }

    switch (activePane) {
      case "overview":
        return "Overview";
      case "races":
        return "Racecard";
      case "horses":
        return "Horse Registry";
      case "veterinary":
        return "Pre-race Examination";
      case "individual":
        return "Individual Analysis";
      case "safety":
        return "Post-race Reports";
      case "blackbox":
        return "BlackBox";
      case "tracksafe":
        return "TrackSAFE";
      case "alerts":
        return "Welfare Alerts";
      case "settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  const handleSettingsClick = () => {
    onPaneChange("settings");
  };

  return (
    <SidebarInset className="flex-1">
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1 text-foreground hover:bg-accent hover:text-accent-foreground" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h2 className="text-lg font-semibold text-foreground">{getPaneTitle()}</h2>
        </div>
        
        <HeaderActions onSettingsClick={handleSettingsClick} />
      </header>
      
      <main className="flex-1 p-6 bg-muted/30">
        {renderPane()}
      </main>
    </SidebarInset>
  );
};

export default TrackMainContent;
