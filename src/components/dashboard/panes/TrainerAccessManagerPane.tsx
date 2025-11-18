
import React from "react";
import { TrainerDashboardPane } from "@/pages/TrainerDashboard";

interface TrainerAccessManagerPaneProps {
  onPaneChange?: (pane: TrainerDashboardPane) => void;
}

const TrainerAccessManagerPane = ({ onPaneChange }: TrainerAccessManagerPaneProps) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4 max-w-lg">
        <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Access Manager
          </h3>
          <p className="text-muted-foreground">
            This pane will contain interactive elements to manage access to horse data for horses under the trainer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrainerAccessManagerPane;
