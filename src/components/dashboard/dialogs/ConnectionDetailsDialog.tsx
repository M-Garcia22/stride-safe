
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface ConnectionDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectionType: "breeder" | "owner" | "vet";
  connectionName: string;
}

const ConnectionDetailsDialog = ({ open, onOpenChange, connectionType, connectionName }: ConnectionDetailsDialogProps) => {
  const [showReportForm, setShowReportForm] = useState(false);

  // Sample data - in real app this would come from API
  const getConnectedHorses = () => {
    const sampleData = {
      "Heritage Farm": ["Golden Dawn", "Royal Thunder"],
      "Sunshine Stables": ["Midnight Approval"],
      "Dr. Sarah Johnson": ["Thunder Strike", "Storm Chaser", "Golden Dawn"]
    };
    return sampleData[connectionName as keyof typeof sampleData] || [];
  };

  const connectedHorses = getConnectedHorses();
  const hasConnectedHorses = connectedHorses.length > 0;

  const getConnectionTypeLabel = () => {
    switch (connectionType) {
      case "breeder": return "bred by";
      case "owner": return "owned by";
      case "vet": return "vetted by";
      default: return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Horses {getConnectionTypeLabel()} {connectionName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {hasConnectedHorses ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Connected Horses in Your Stable</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {connectedHorses.map((horseName, index) => (
                    <li key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span>{horseName}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">
                  No other horses in your stable are {getConnectionTypeLabel()} {connectionName}.
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                Report Incorrect Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!showReportForm ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    If you believe there's an error in this information (e.g., another horse in your stable 
                    is also {getConnectionTypeLabel()} {connectionName} but not listed), please report it.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowReportForm(true)}
                    className="w-full"
                  >
                    Report Issue
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    className="w-full p-2 border rounded text-sm"
                    rows={3}
                    placeholder="Please describe the issue with the connection information..."
                  />
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">Submit Report</Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowReportForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectionDetailsDialog;
