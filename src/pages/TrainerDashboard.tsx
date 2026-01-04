
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/contexts/ThemeContext";
import TrainerSidebar from "@/components/dashboard/TrainerSidebar";
import TrainerMainContent from "@/components/dashboard/TrainerMainContent";
import { TrainerDashboardPane } from "@/types/dashboard";

// Re-export for backwards compatibility
export type { TrainerDashboardPane } from "@/types/dashboard";

const TrainerDashboard = () => {
  const [activePane, setActivePane] = useState<TrainerDashboardPane>("overview");

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background transition-colors duration-200">
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <TrainerSidebar activePane={activePane} onPaneChange={setActivePane} />
            <TrainerMainContent activePane={activePane} onPaneChange={setActivePane} />
          </div>
        </SidebarProvider>
      </div>
    </ThemeProvider>
  );
};

export default TrainerDashboard;
