
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ClipboardList, CheckCircle, X, AlertTriangle } from "lucide-react";
import { WorkflowView } from "../../../data/preRaceData";
import CategoryFilter from "./CategoryFilter";
import SensitivitySettings from "./SensitivitySettings";
import { SensitivitySettings as SensitivitySettingsType } from "../../../data/preRaceData";

interface WorkflowNavigationProps {
  workflowView: WorkflowView;
  onWorkflowChange: (view: WorkflowView) => void;
  counts: {
    toExamine: number;
    passed: number;
    scratched: number;
    welfareAlerts: number;
  };
  hasWelfareAlerts: boolean;
  totalHorses: number;
  selectedCategories: number[];
  onCategoryChange: (categories: number[]) => void;
  categoryCounts: Record<number, number>;
  sensitivitySettings: SensitivitySettingsType;
  onSensitivityChange: (settings: SensitivitySettingsType) => void;
  showCategoryFilter: boolean;
  onToggleCategoryFilter: () => void;
}

const WorkflowNavigation = ({ 
  workflowView, 
  onWorkflowChange, 
  counts, 
  hasWelfareAlerts,
  totalHorses,
  selectedCategories,
  onCategoryChange,
  categoryCounts,
  sensitivitySettings,
  onSensitivityChange,
  showCategoryFilter,
  onToggleCategoryFilter
}: WorkflowNavigationProps) => {
  const [showSensitivitySettings, setShowSensitivitySettings] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
        <Button
          variant={workflowView === 'main' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onWorkflowChange('main')}
        >
          All horses ({totalHorses})
        </Button>
        <Button
          variant={workflowView === 'to-examine' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onWorkflowChange('to-examine')}
        >
          <ClipboardList className="w-4 h-4 mr-2" />
          To Examine ({counts.toExamine})
        </Button>
        <Button
          variant={workflowView === 'passed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onWorkflowChange('passed')}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Passed ({counts.passed})
        </Button>
        <Button
          variant={workflowView === 'scratched' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onWorkflowChange('scratched')}
        >
          <X className="w-4 h-4 mr-2" />
          Scratched ({counts.scratched})
        </Button>
        <Button
          variant={workflowView === 'welfare-alerts' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onWorkflowChange('welfare-alerts')}
          className={
            hasWelfareAlerts && workflowView !== 'welfare-alerts'
              ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
              : hasWelfareAlerts && workflowView === 'welfare-alerts'
              ? 'bg-red-100 text-red-800 border-red-300'
              : ''
          }
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Welfare Alerts ({counts.welfareAlerts})
        </Button>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant={showCategoryFilter ? 'default' : 'outline'}
            size="sm"
            onClick={onToggleCategoryFilter}
          >
            Category Filter
          </Button>
          
          <SensitivitySettings
            settings={sensitivitySettings}
            onSettingsChange={onSensitivityChange}
            isOpen={showSensitivitySettings}
            onToggle={() => setShowSensitivitySettings(!showSensitivitySettings)}
          />
        </div>
      </div>

      {showCategoryFilter && (
        <CategoryFilter
          selectedCategories={selectedCategories}
          onCategoryChange={onCategoryChange}
          categoryCounts={categoryCounts}
        />
      )}
    </div>
  );
};

export default WorkflowNavigation;
