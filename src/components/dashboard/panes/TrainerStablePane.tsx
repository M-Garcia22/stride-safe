import React from "react";
import { TrainerDashboardPane } from "@/pages/TrainerDashboard";
interface TrainerStablePaneProps {
  onPaneChange: (pane: TrainerDashboardPane) => void;
}
const TrainerStablePane = ({
  onPaneChange
}: TrainerStablePaneProps) => {
  return <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4 max-w-lg">
        <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">My Stable</h3>
          <p className="text-muted-foreground">
            This pane will contain an interactive list of all horses under the trainer.
          </p>
        </div>
      </div>
    </div>;
};
export default TrainerStablePane;