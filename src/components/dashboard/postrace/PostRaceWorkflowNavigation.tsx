
import { Button } from "@/components/ui/button";
import { Flag, AlertTriangle } from "lucide-react";
import { PostRaceWorkflowView } from "../../../data/postRaceData";

interface PostRaceWorkflowNavigationProps {
  workflowView: PostRaceWorkflowView;
  onWorkflowChange: (view: PostRaceWorkflowView) => void;
  counts: {
    welfareAlerts: number;
  };
  hasWelfareAlerts: boolean;
}

const PostRaceWorkflowNavigation = ({
  workflowView,
  onWorkflowChange,
  counts,
  hasWelfareAlerts
}: PostRaceWorkflowNavigationProps) => {
  const workflows = [
    {
      id: 'all-races' as PostRaceWorkflowView,
      label: 'All Horses',
      icon: Flag,
      count: null
    },
    {
      id: 'welfare-alerts' as PostRaceWorkflowView,
      label: 'Welfare Alerts',
      icon: AlertTriangle,
      count: counts.welfareAlerts,
      alert: hasWelfareAlerts
    }
  ];

  return (
    <div className="flex items-center gap-2">
      {workflows.map((workflow) => (
        <Button
          key={workflow.id}
          variant={workflowView === workflow.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => onWorkflowChange(workflow.id)}
          className={`${
            workflow.alert && workflowView !== workflow.id
              ? 'border-red-300 text-red-700 hover:bg-red-50'
              : ''
          }`}
        >
          <workflow.icon className="w-4 h-4 mr-2" />
          {workflow.label}
          {workflow.count !== null && (
            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
              workflow.alert 
                ? 'bg-red-100 text-red-800' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {workflow.count}
            </span>
          )}
        </Button>
      ))}
    </div>
  );
};

export default PostRaceWorkflowNavigation;
