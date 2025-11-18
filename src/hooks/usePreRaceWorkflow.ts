
import { useState } from 'react';
import { WorkflowView } from '../data/preRaceData';

export const usePreRaceWorkflow = () => {
  const [workflowView, setWorkflowView] = useState<WorkflowView>('main');

  const getWorkflowTitle = (view: WorkflowView): string => {
    switch (view) {
      case 'to-examine':
        return 'Horses To Examine';
      case 'passed':
        return 'Passed Horses';
      case 'scratched':
        return 'Scratched Horses';
      case 'welfare-alerts':
        return 'Welfare Alerts';
      default:
        return 'All Horses';
    }
  };

  return {
    workflowView,
    setWorkflowView,
    getWorkflowTitle
  };
};
