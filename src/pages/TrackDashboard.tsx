
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/contexts/ThemeContext";
import TrackSidebar from "@/components/dashboard/TrackSidebar";
import TrackMainContent from "@/components/dashboard/TrackMainContent";

export type DashboardPane = 
  | "overview" 
  | "races" 
  | "horses" 
  | "veterinary" 
  | "individual"
  | "safety" 
  | "settings"
  | "blackbox"
  | "tracksafe"
  | "alerts";

const TrackDashboard = () => {
  const [activePane, setActivePane] = useState<DashboardPane>("overview");

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background transition-colors duration-200">
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <TrackSidebar activePane={activePane} onPaneChange={setActivePane} />
            <TrackMainContent activePane={activePane} onPaneChange={setActivePane} />
          </div>
        </SidebarProvider>
      </div>
    </ThemeProvider>
  );
};

export default TrackDashboard;
