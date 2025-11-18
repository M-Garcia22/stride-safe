
import { Button } from "@/components/ui/button";
import { SplitIcon, TableIcon, FileText } from "lucide-react";
import { useState } from "react";
import PostRaceWorkflowNavigation from "./PostRaceWorkflowNavigation";
import CreatePDFReportDialog from "../dialogs/CreatePDFReportDialog";
import { PostRaceWorkflowView } from "../../../data/postRaceData";

interface RaceReportsControlsProps {
  workflowView: PostRaceWorkflowView;
  onWorkflowChange: (view: PostRaceWorkflowView) => void;
  counts: {
    welfareAlerts: number;
  };
  hasWelfareAlerts: boolean;
  viewMode: 'single' | 'split';
  onViewModeChange: (mode: 'single' | 'split') => void;
  selectedDate?: Date;
  hidePDFButton?: boolean;
}

const RaceReportsControls = ({
  workflowView,
  onWorkflowChange,
  counts,
  hasWelfareAlerts,
  viewMode,
  onViewModeChange,
  selectedDate,
  hidePDFButton = false
}: RaceReportsControlsProps) => {
  const [showPDFDialog, setShowPDFDialog] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <PostRaceWorkflowNavigation
        workflowView={workflowView}
        onWorkflowChange={onWorkflowChange}
        counts={counts}
        hasWelfareAlerts={hasWelfareAlerts}
      />
      
      <div className="flex items-center gap-2">
        {!hidePDFButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPDFDialog(true)}
            className="mr-2"
          >
            <FileText className="w-4 h-4 mr-2" />
            Create PDF Report
          </Button>
        )}

        <Button
          variant={viewMode === 'single' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('single')}
        >
          <TableIcon className="w-4 h-4 mr-2" />
          Single View
        </Button>
        <Button
          variant={viewMode === 'split' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('split')}
        >
          <SplitIcon className="w-4 h-4 mr-2" />
          Split View
        </Button>
      </div>

      {!hidePDFButton && (
        <CreatePDFReportDialog 
          open={showPDFDialog}
          onOpenChange={setShowPDFDialog}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};

export default RaceReportsControls;
