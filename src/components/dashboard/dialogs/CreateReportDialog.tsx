
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreateReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  horseName: string;
  onCreateReport: (reportData: ReportData) => void;
}

interface ReportData {
  recipient: string;
  recipientEmail?: string;
  includeWelfare: boolean;
  includePerformance: boolean;
  includeTraining: boolean;
  comments: string;
  deliveryMethod: 'email' | 'download';
}

const CreateReportDialog = ({ open, onOpenChange, horseName, onCreateReport }: CreateReportDialogProps) => {
  const [recipient, setRecipient] = useState<string>("");
  const [recipientEmail, setRecipientEmail] = useState<string>("");
  const [includeWelfare, setIncludeWelfare] = useState(true);
  const [includePerformance, setIncludePerformance] = useState(true);
  const [includeTraining, setIncludeTraining] = useState(false);
  const [comments, setComments] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<'email' | 'download'>('email');

  const handleSubmit = () => {
    const reportData: ReportData = {
      recipient,
      recipientEmail: deliveryMethod === 'email' ? recipientEmail : undefined,
      includeWelfare,
      includePerformance,
      includeTraining,
      comments,
      deliveryMethod,
    };
    
    onCreateReport(reportData);
    onOpenChange(false);
    
    // Reset form
    setRecipient("");
    setRecipientEmail("");
    setIncludeWelfare(true);
    setIncludePerformance(true);
    setIncludeTraining(false);
    setComments("");
    setDeliveryMethod('email');
  };

  const isFormValid = recipient && (deliveryMethod === 'download' || recipientEmail);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Report for {horseName}</DialogTitle>
          <DialogDescription>
            Generate a comprehensive report to share with stakeholders.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Recipient Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Report Recipient</Label>
            <Select value={recipient} onValueChange={setRecipient}>
              <SelectTrigger>
                <SelectValue placeholder="Select recipient type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="trainer-staff">Trainer Staff</SelectItem>
                <SelectItem value="veterinarian">Veterinarian</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Information to Include */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Information to Include</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="welfare" 
                  checked={includeWelfare}
                  onCheckedChange={(checked) => setIncludeWelfare(checked as boolean)}
                />
                <Label htmlFor="welfare" className="text-sm">Welfare Data</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="performance" 
                  checked={includePerformance}
                  onCheckedChange={(checked) => setIncludePerformance(checked as boolean)}
                />
                <Label htmlFor="performance" className="text-sm">Performance Data</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="training" 
                  checked={includeTraining}
                  onCheckedChange={(checked) => setIncludeTraining(checked as boolean)}
                />
                <Label htmlFor="training" className="text-sm">Training Data</Label>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-3">
            <Label htmlFor="comments" className="text-sm font-medium">Additional Comments</Label>
            <Textarea
              id="comments"
              placeholder="Add any additional notes or observations..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Delivery Method */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Delivery Method</Label>
            <RadioGroup value={deliveryMethod} onValueChange={(value) => setDeliveryMethod(value as 'email' | 'download')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email" className="text-sm">Send via Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="download" id="download" />
                <Label htmlFor="download" className="text-sm">Download PDF</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Email Address (if email delivery selected) */}
          {deliveryMethod === 'email' && (
            <div className="space-y-3">
              <Label htmlFor="email-address" className="text-sm font-medium">Email Address</Label>
              <input
                id="email-address"
                type="email"
                placeholder="Enter recipient's email address"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isFormValid}>
            {deliveryMethod === 'email' ? 'Send Report' : 'Generate & Download'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateReportDialog;
