
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Stethoscope } from "lucide-react";

interface VeterinarianMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  horseName: string;
  onSendMessage: (message: string, urgency: string, additionalDetails: string) => void;
}

const VeterinarianMessageDialog = ({ 
  open, 
  onOpenChange, 
  horseName, 
  onSendMessage 
}: VeterinarianMessageDialogProps) => {
  const [message, setMessage] = useState("");
  const [urgency, setUrgency] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");

  const handleSend = () => {
    if (message.trim() && urgency) {
      onSendMessage(message, urgency, additionalDetails);
      setMessage("");
      setUrgency("");
      setAdditionalDetails("");
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setMessage("");
    setUrgency("");
    setAdditionalDetails("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-blue-600" />
            Request Veterinary Examination - {horseName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="urgency">Urgency Level</Label>
            <Select value={urgency} onValueChange={setUrgency}>
              <SelectTrigger>
                <SelectValue placeholder="Select urgency level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="routine">Routine</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Message to Veterinarian</Label>
            <Textarea
              id="message"
              placeholder="Please describe the reason for the examination request..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px]"
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground mt-1">
              {message.length}/500 characters
            </div>
          </div>

          <div>
            <Label htmlFor="details">Additional Details (Optional)</Label>
            <Textarea
              id="details"
              placeholder="Any additional observations or specific concerns..."
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              className="min-h-[80px]"
              maxLength={300}
            />
            <div className="text-xs text-muted-foreground mt-1">
              {additionalDetails.length}/300 characters
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSend}
              disabled={!message.trim() || !urgency}
            >
              Send Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VeterinarianMessageDialog;
