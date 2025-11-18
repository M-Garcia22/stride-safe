
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Download, Mail, Shield, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generatePDFReport } from "../../../lib/pdfGenerator";

const formSchema = z.object({
  reportScope: z.enum(["all", "specific", "welfare-alerts"]),
  selectedRaces: z.array(z.number()).optional(),
  includeStrideCurves: z.boolean().default(false),
  summaryOnly: z.boolean().default(false),
  passwordProtect: z.boolean().default(false),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
  downloadToDevice: z.boolean().default(true),
  sendToRegisteredEmail: z.boolean().default(false),
  sendToAdditionalEmail: z.boolean().default(false),
  additionalEmail: z.string().optional(),
}).refine((data) => {
  if (data.passwordProtect && (!data.password || data.password.length < 6)) {
    return false;
  }
  if (data.passwordProtect && data.password !== data.confirmPassword) {
    return false;
  }
  if (data.sendToAdditionalEmail && !data.additionalEmail?.includes("@")) {
    return false;
  }
  return true;
}, {
  message: "Validation failed",
});

interface CreatePDFReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
}

const CreatePDFReportDialog = ({ open, onOpenChange, selectedDate }: CreatePDFReportDialogProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Mock race data for selection
  const availableRaces = [1, 2, 3, 4, 5, 6, 7, 8];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reportScope: "all",
      selectedRaces: [],
      includeStrideCurves: false,
      summaryOnly: false,
      passwordProtect: false,
      downloadToDevice: true,
      sendToRegisteredEmail: false,
      sendToAdditionalEmail: false,
    },
  });

  const watchReportScope = form.watch("reportScope");
  const watchPasswordProtect = form.watch("passwordProtect");
  const watchSendToAdditional = form.watch("sendToAdditionalEmail");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsGenerating(true);
    
    try {
      // Generate PDF report with selected date
      await generatePDFReport({
        ...values,
        reportDate: selectedDate || new Date(),
      });
      
      toast({
        title: "PDF Report Generated",
        description: "Your welfare report has been generated successfully.",
      });
      
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Create PDF Report
            {selectedDate && (
              <span className="text-sm text-muted-foreground ml-2">
                ({selectedDate.toLocaleDateString()})
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Report Scope */}
            <FormField
              control={form.control}
              name="reportScope"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report Scope</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all" />
                        <label htmlFor="all" className="text-sm">All Horses</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="specific" id="specific" />
                        <label htmlFor="specific" className="text-sm">Specific Race(s)</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="welfare-alerts" id="welfare-alerts" />
                        <label htmlFor="welfare-alerts" className="text-sm">Welfare Alerts Only</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Race Selection */}
            {watchReportScope === "specific" && (
              <FormField
                control={form.control}
                name="selectedRaces"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Races</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          const raceNumber = parseInt(value);
                          const currentRaces = field.value || [];
                          if (!currentRaces.includes(raceNumber)) {
                            field.onChange([...currentRaces, raceNumber]);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select races..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableRaces.map((race) => (
                            <SelectItem key={race} value={race.toString()}>
                              Race {race}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {field.value && field.value.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {field.value.map((race) => (
                          <span
                            key={race}
                            className="bg-primary/10 text-primary px-2 py-1 rounded text-xs cursor-pointer"
                            onClick={() => {
                              field.onChange(field.value?.filter(r => r !== race));
                            }}
                          >
                            Race {race} ×
                          </span>
                        ))}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Separator />

            {/* Report Content */}
            <div className="space-y-3">
              <FormLabel>Report Content</FormLabel>
              
              <FormField
                control={form.control}
                name="includeStrideCurves"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Include Stride Curves</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="summaryOnly"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Summary Report Only</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Security */}
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="passwordProtect"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Password Protect Report
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {watchPasswordProtect && (
                <div className="space-y-3 ml-6">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Enter password (min 6 characters)"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Confirm password"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <Separator />

            {/* Delivery Options */}
            <div className="space-y-3">
              <FormLabel>Delivery Options</FormLabel>
              
              <FormField
                control={form.control}
                name="downloadToDevice"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download to Device
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sendToRegisteredEmail"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Send to Registered Email
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sendToAdditionalEmail"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Send to Additional Email</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {watchSendToAdditional && (
                <FormField
                  control={form.control}
                  name="additionalEmail"
                  render={({ field }) => (
                    <FormItem className="ml-6">
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Enter email address"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? "Generating..." : "Generate Report"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePDFReportDialog;
