
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { PreRaceHorse } from "../panes/PreRaceExaminationPane";

interface ScratchConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  horse: PreRaceHorse | null;
  onConfirm: (reason: string) => void;
}

const ScratchConfirmDialog = ({ open, onOpenChange, horse, onConfirm }: ScratchConfirmDialogProps) => {
  const [reason, setReason] = useState("");

  if (!horse) return null;

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason);
      setReason("");
    }
  };

  const handleCancel = () => {
    setReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <X className="w-5 h-5 text-red-600" />
            Scratch Horse from Race
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-2">Horse: {horse.name}</h3>
            <p className="text-red-700 text-sm">
              You are confirming that this horse is not sound to race and must be scratched from the event.
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Regulatory Information</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• This decision is made in the interest of horse welfare and safety</li>
              <li>• The scratch will be recorded in the official race records</li>
              <li>• Connections will be notified of the veterinary decision</li>
              <li>• Racing stewards will be informed of the scratch and reasons</li>
              <li>• The horse may require additional examination before future racing</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scratch-reason" className="text-sm font-medium">
              Reason for Scratching (Required) <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="scratch-reason"
              placeholder="Please provide specific reasons for scratching this horse, including any medical or safety concerns observed during the examination..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
              required
            />
            <p className="text-xs text-muted-foreground">
              This information will be included in the official scratch report.
            </p>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-amber-800 text-sm font-medium">
              ⚠️ Please confirm that you are scratching {horse.name} from the race.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            className="bg-red-600 hover:bg-red-700"
            disabled={!reason.trim()}
          >
            Confirm Scratch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScratchConfirmDialog;
