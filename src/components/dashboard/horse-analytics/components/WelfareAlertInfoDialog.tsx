
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface WelfareAlertInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WelfareAlertInfoDialog = ({ open, onOpenChange }: WelfareAlertInfoDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Welfare Alert Markers</DialogTitle>
          <DialogDescription>
            Understanding injury risk indicators for your horse
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">What are Welfare Alert Markers?</h4>
            <p className="text-muted-foreground">
              Welfare Alert Markers are specific indicators that identify potential injury risks 
              based on stride analysis. These markers help detect early signs of conditions that 
              could lead to catastrophic fractures or other career-ending injuries.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Alert Types</h4>
            <div className="space-y-2 text-muted-foreground">
              <div>
                <strong>Condylar Fx:</strong> Indicators for potential condylar fractures in the fetlock joint
              </div>
              <div>
                <strong>Sesamoid Fx:</strong> Signs of stress or potential fractures in the sesamoid bones
              </div>
              <div>
                <strong>Left/Right Front:</strong> Specific limb indicators showing asymmetry or stress patterns
              </div>
              <div>
                <strong>Both Front:</strong> Bilateral front limb concerns indicating systemic issues
              </div>
              <div>
                <strong>Hind Legs:</strong> Posterior limb stress patterns or irregularities
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Alert Status</h4>
            <div className="space-y-1 text-muted-foreground">
              <div><strong>Alert:</strong> Potential risk detected - requires veterinary attention</div>
              <div><strong>None:</strong> No current indicators for this specific marker</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Taking Action</h4>
            <p className="text-muted-foreground">
              When alerts are detected, it's recommended to consult with your veterinarian for 
              further examination. Early detection and intervention can help prevent serious 
              injuries and extend your horse's racing career.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelfareAlertInfoDialog;
