
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface VelocityTenSecondsInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VelocityTenSecondsInfoDialog = ({ open, onOpenChange }: VelocityTenSecondsInfoDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Velocity - First 10 Seconds</DialogTitle>
          <DialogDescription>
            Understanding acceleration and early race velocity patterns
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">What does this chart show?</h4>
            <p className="text-muted-foreground">
              This chart displays your horse's velocity during the critical first 10 seconds of a race, 
              showing the acceleration pattern from the starting gate to reaching cruising speed.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Why is this important?</h4>
            <p className="text-muted-foreground">
              The first 10 seconds reveal crucial information about your horse's acceleration ability, 
              gate break efficiency, and early race positioning strategy. Strong early acceleration 
              can be decisive in race outcomes.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Key Metrics</h4>
            <div className="space-y-2 text-muted-foreground">
              <div>
                <strong>Peak Velocity:</strong> The maximum speed achieved during the first 10 seconds
              </div>
              <div>
                <strong>Acceleration Pattern:</strong> How quickly the horse reaches peak velocity
              </div>
              <div>
                <strong>Gate Break:</strong> Initial response and acceleration from the starting position
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">What to look for</h4>
            <div className="space-y-1 text-muted-foreground">
              <div>• <strong>Smooth acceleration curve:</strong> Indicates good conditioning and technique</div>
              <div>• <strong>Quick initial response:</strong> Shows alertness and gate-breaking ability</div>
              <div>• <strong>Consistent peak velocity:</strong> Demonstrates reliable performance</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VelocityTenSecondsInfoDialog;
