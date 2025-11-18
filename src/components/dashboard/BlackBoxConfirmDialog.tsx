
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
import { Activity, Lock, Clock, DollarSign, Fingerprint } from "lucide-react";

interface BlackBoxConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  horseName: string;
  raceNumber: number;
}

const BlackBoxConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  horseName,
  raceNumber
}: BlackBoxConfirmDialogProps) => {
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [supportsBiometric, setSupportsBiometric] = useState(false);

  // Check for biometric support on component mount
  useState(() => {
    if (typeof window !== 'undefined' && 'navigator' in window) {
      // Check if WebAuthn is supported (for biometric authentication)
      setSupportsBiometric(!!window.PublicKeyCredential);
    }
  });

  const handleConfirm = async () => {
    if (!password && !supportsBiometric) return;
    
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      onConfirm();
      setPassword("");
      setIsProcessing(false);
      onClose();
    }, 1000);
  };

  const handleBiometricAuth = async () => {
    if (!supportsBiometric) return;
    
    try {
      setIsProcessing(true);
      
      // In a real implementation, this would use WebAuthn API
      // For demo purposes, we'll simulate biometric authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onConfirm();
      setIsProcessing(false);
      onClose();
    } catch (error) {
      console.error("Biometric authentication failed:", error);
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setPassword("");
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            BlackBox Analysis Request
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="font-medium text-green-900">{horseName}</div>
                <div className="text-sm text-green-700">Race {raceNumber} - DNF Analysis</div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="text-sm font-medium">Cost</div>
                    <div className="text-xs text-gray-600">$10,000</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="text-sm font-medium">Turnaround</div>
                    <div className="text-xs text-gray-600">24 hours</div>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                This comprehensive analysis will examine all available data including video footage, 
                sensor data, and veterinary records to determine the cause of the DNF.
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

          {supportsBiometric && (
            <div className="flex items-center justify-center">
              <div className="text-xs text-gray-500 mx-2">or</div>
            </div>
          )}

          {supportsBiometric && (
            <button
              onClick={handleBiometricAuth}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Fingerprint className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Use Biometric Authentication</span>
            </button>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!password || isProcessing}
            className="bg-green-600 hover:bg-green-700"
          >
            {isProcessing ? "Processing..." : "Confirm Purchase"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BlackBoxConfirmDialog;
