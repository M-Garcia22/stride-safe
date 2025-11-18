
import { useState } from 'react';
import { PostRaceWorkflowView } from '../data/postRaceData';

export const usePostRaceWorkflow = () => {
  const [workflowView, setWorkflowView] = useState<PostRaceWorkflowView>('all-races');

  const getWorkflowTitle = (view: PostRaceWorkflowView): string => {
    switch (view) {
      case 'welfare-alerts':
        return 'Welfare Alerts';
      default:
        return 'All Races';
    }
  };

  return {
    workflowView,
    setWorkflowView,
    getWorkflowTitle
  };
};
