
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface VelocityFullRaceInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VelocityFullRaceInfoDialog = ({ open, onOpenChange }: VelocityFullRaceInfoDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Full Race Velocity Profile</DialogTitle>
          <DialogDescription>
            Complete velocity analysis throughout the entire race
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">What does this chart show?</h4>
            <p className="text-muted-foreground">
              This chart displays your horse's velocity throughout the entire race duration, 
              showing acceleration, cruising speed, and finishing kick patterns from start to finish.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Race Phases</h4>
            <div className="space-y-2 text-muted-foreground">
              <div>
                <strong>Early Phase (0-15s):</strong> Gate break and initial acceleration
              </div>
              <div>
                <strong>Mid-Race (15s-75%):</strong> Cruising speed and tactical positioning
              </div>
              <div>
                <strong>Final Phase (75%-finish):</strong> Finishing kick and sprint to the line
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Key Metrics</h4>
            <div className="space-y-2 text-muted-foreground">
              <div>
                <strong>Peak Velocity:</strong> The highest speed achieved during the race
              </div>
              <div>
                <strong>Average Velocity:</strong> Overall speed maintained throughout the race
              </div>
              <div>
                <strong>Velocity Sustainability:</strong> How well speed is maintained over distance
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Performance Indicators</h4>
            <div className="space-y-1 text-muted-foreground">
              <div>• <strong>Consistent mid-race speed:</strong> Shows good conditioning and stamina</div>
              <div>• <strong>Strong finishing velocity:</strong> Indicates tactical awareness and reserve energy</div>
              <div>• <strong>Smooth velocity transitions:</strong> Demonstrates efficient running style</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VelocityFullRaceInfoDialog;
