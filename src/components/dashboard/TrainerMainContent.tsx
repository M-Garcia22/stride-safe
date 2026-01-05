import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { TrainerDashboardPane } from "@/pages/TrainerDashboard";
import TrainerHeaderActions from "./TrainerHeaderActions";
import TrainerOverviewPane from "./panes/TrainerOverviewPane";
import TrainerStablePane from "./panes/TrainerStablePane";
import TrainerHorseAnalyticsPane from "./panes/TrainerHorseAnalyticsPane";
import TrainerAccessManagerPane from "./panes/TrainerAccessManagerPane";
import TrainerHorsesPane from "./panes/TrainerHorsesPane";
import { useState } from "react";
import { Report } from "@/types/report";
import { TrainerHorse } from "@/types/horse";
import { useToast } from "@/hooks/use-toast";

interface TrainerMainContentProps {
  activePane: TrainerDashboardPane;
  onPaneChange: (pane: TrainerDashboardPane) => void;
}

const TrainerMainContent = ({ activePane, onPaneChange }: TrainerMainContentProps) => {
  const [selectedHorse, setSelectedHorse] = useState<TrainerHorse | null>(null);
  const [selectedHorseName, setSelectedHorseName] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const { toast } = useToast();

  const handleSelectHorse = (horse: TrainerHorse) => {
    setSelectedHorse(horse);
    setSelectedHorseName(horse.name);
  };

  // For panes that only have horse name (from reports)
  const handleSelectHorseName = (horseName: string) => {
    setSelectedHorseName(horseName);
    setSelectedHorse(null);
  };

  const handleSelectReport = (report: Report) => {
    setSelectedReport(report);
  };

  const handleSettingsClick = () => {
    toast({
      title: "Coming Soon",
      description: "Settings will be available in a future update.",
    });
  };

  const renderPane = () => {
    switch (activePane) {
      case "overview":
        return <TrainerOverviewPane onPaneChange={onPaneChange} onSelectHorseName={handleSelectHorseName} onSelectReport={handleSelectReport} />;
      case "horses":
        return <TrainerHorsesPane onPaneChange={onPaneChange} onSelectHorse={handleSelectHorse} onSelectReport={handleSelectReport} />;
      case "stable":
        return <TrainerStablePane onPaneChange={onPaneChange} />;
      case "analytics":
        return <TrainerHorseAnalyticsPane onPaneChange={onPaneChange} selectedHorse={selectedHorse} selectedHorseName={selectedHorseName} selectedReport={selectedReport} />;
      case "access-manager":
        return <TrainerAccessManagerPane />;
      default:
        return <TrainerOverviewPane onPaneChange={onPaneChange} onSelectHorseName={handleSelectHorseName} onSelectReport={handleSelectReport} />;
    }
  };

  const getPaneTitle = () => {
    switch (activePane) {
      case "overview":
        return "Overview";
      case "horses":
        return "My Horses";
      case "stable":
        return "My Stable";
      case "analytics":
        return "Horse Analysis";
      case "access-manager":
        return "Access Manager";
      default:
        return "Dashboard";
    }
  };

  return (
    <SidebarInset className="flex-1">
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1 text-foreground hover:bg-accent hover:text-accent-foreground" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h2 className="text-lg font-semibold text-foreground">{getPaneTitle()}</h2>
        </div>
        
        <TrainerHeaderActions onSettingsClick={handleSettingsClick} />
      </header>
      
      <main className="flex-1 p-6 bg-muted/30">
        {renderPane()}
      </main>
    </SidebarInset>
  );
};

export default TrainerMainContent;
