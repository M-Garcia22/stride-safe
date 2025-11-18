
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileText, Lock, Clock, AlertCircle, Link } from "lucide-react";

interface RaceReportConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  horseName: string;
  raceNumber?: number;
  remainingReports?: number;
  totalReports?: number;
}

const RaceReportConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  horseName,
  raceNumber,
  remainingReports = 5,
  totalReports = 50
}: RaceReportConfirmDialogProps) => {
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    if (!password) return;
    
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      onConfirm();
      setPassword("");
      setIsProcessing(false);
      onClose();
    }, 1000);
  };

  const handleClose = () => {
    if (!isProcessing) {
      setPassword("");
      onClose();
    }
  };

  const handleAddReports = () => {
    console.log("Navigate to subscription management");
    // TODO: Implement navigation to subscription management
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-600" />
            Race Report Request
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="font-medium text-green-900">{horseName}</div>
                {raceNumber && (
                  <div className="text-sm text-green-700">Race {raceNumber} - Stride Analysis Report</div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="text-sm font-medium">Turnaround</div>
                    <div className="text-xs text-gray-600">2 hours</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <FileText className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="text-sm font-medium">Report Type</div>
                    <div className="text-xs text-gray-600">Stride Analysis</div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="font-medium text-amber-900">Subscription Status</span>
                </div>
                <div className="text-sm text-amber-800">
                  You have <span className="font-bold">{remainingReports} out of {totalReports}</span> reports remaining this year
                </div>
                <button
                  onClick={handleAddReports}
                  className="mt-2 flex items-center gap-1 text-xs text-amber-700 hover:text-amber-900 underline"
                >
                  <Link className="w-3 h-3" />
                  Add more reports to your subscription
                </button>
              </div>
              
              <div className="text-sm text-gray-600">
                This comprehensive report will include detailed stride analysis, performance metrics, 
                and recommendations based on the race data.
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Authentication Required</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                disabled={isProcessing}
              />
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!password || isProcessing || remainingReports <= 0}
            className="bg-green-600 hover:bg-green-700"
          >
            {isProcessing ? "Processing..." : "Request Report"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RaceReportConfirmDialog;
