
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface PerformanceAnalyticsSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alertThreshold: number;
  onAlertThresholdChange: (threshold: number) => void;
}

const PerformanceAnalyticsSettingsDialog = ({
  open,
  onOpenChange,
  alertThreshold,
  onAlertThresholdChange,
}: PerformanceAnalyticsSettingsDialogProps) => {
  const [localThreshold, setLocalThreshold] = useState(alertThreshold);

  const handleSave = () => {
    onAlertThresholdChange(localThreshold);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setLocalThreshold(alertThreshold);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Performance Analytics Settings</DialogTitle>
          <DialogDescription>
            Configure your performance analytics preferences and alert settings.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-3">Alert Settings</h4>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="threshold" className="text-right">
                  % Change Alert
                </Label>
                <Input
                  id="threshold"
                  type="number"
                  value={localThreshold}
                  onChange={(e) => setLocalThreshold(Number(e.target.value))}
                  className="col-span-3"
                  min="1"
                  max="100"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Get notified when performance changes exceed this percentage
              </p>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-3">Display Settings</h4>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Additional display options will be available here in future updates.
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-3">Data Export</h4>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Export and reporting options will be available here.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PerformanceAnalyticsSettingsDialog;
