
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface FatigueInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FatigueInfoDialog = ({ open, onOpenChange }: FatigueInfoDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Fatigue-Performance Score</DialogTitle>
          <DialogDescription>
            Understanding your horse's fatigue and performance metrics
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">What is the Fatigue-Performance Score?</h4>
            <p className="text-muted-foreground">
              The Fatigue-Performance Score is a comprehensive metric that evaluates your horse's 
              current performance level and fatigue state. This score ranges from 1 to 140, where 
              higher scores indicate better performance capabilities.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Score Ranges</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li><strong>40-90:</strong> Typical performance range for most horses</li>
              <li><strong>115+:</strong> Exceptional performance range for very good horses</li>
              <li><strong>Maximum:</strong> 140 represents peak performance capacity</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Visual Representation</h4>
            <p className="text-muted-foreground">
              The score is displayed as a vertical column chart with a color gradient that transitions 
              from muted blue (low performance) to bright light cyan (high performance). This visual 
              system helps you quickly assess your horse's current performance state.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">How to Use This Information</h4>
            <p className="text-muted-foreground">
              Monitor changes in your horse's Fatigue-Performance Score over time to optimize 
              training schedules, identify when rest may be needed, and ensure your horse is 
              performing at their best for upcoming races.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FatigueInfoDialog;
