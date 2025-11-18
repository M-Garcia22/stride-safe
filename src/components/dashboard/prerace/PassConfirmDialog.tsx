
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { PreRaceHorse } from "../panes/PreRaceExaminationPane";

interface PassConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  horse: PreRaceHorse | null;
  onConfirm: () => void;
}

const PassConfirmDialog = ({ open, onOpenChange, horse, onConfirm }: PassConfirmDialogProps) => {
  if (!horse) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Pass Pre-Race Examination
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">Horse: {horse.name}</h3>
            <p className="text-green-700 text-sm">
              You are confirming that this horse is sound to race and has passed the pre-race examination.
            </p>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-medium text-amber-800 mb-2">Important Limitations</h4>
            <ul className="text-amber-700 text-sm space-y-1">
              <li>• This certification is valid only for the current race</li>
              <li>• The examination is based on visible signs at the time of inspection</li>
              <li>• This does not guarantee the horse's condition will not change during racing</li>
              <li>• The veterinarian's assessment is professional but not infallible</li>
              <li>• Any concerns arising after this certification should be immediately reported</li>
            </ul>
          </div>
          
          <p className="text-sm text-muted-foreground">
            By confirming, you certify that {horse.name} is fit to participate in the scheduled race.
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-green-600 hover:bg-green-700">
            Confirm Pass
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PassConfirmDialog;
