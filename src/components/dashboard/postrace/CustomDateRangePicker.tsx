
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface CustomDateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
}

const CustomDateRangePicker = ({ startDate, endDate, onDateRangeChange }: CustomDateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date | undefined>(startDate);
  const [tempEndDate, setTempEndDate] = useState<Date | undefined>(endDate);

  const handleApply = () => {
    if (tempStartDate && tempEndDate) {
      onDateRangeChange(tempStartDate, tempEndDate);
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
          <CalendarIcon className="h-3 w-3 mr-1" />
          Custom Range
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 space-y-3">
          <div className="text-sm font-medium">Select Date Range</div>
          <div className="flex gap-3">
            <div>
              <div className="text-xs text-muted-foreground mb-2">Start Date</div>
              <Calendar
                mode="single"
                selected={tempStartDate}
                onSelect={setTempStartDate}
                disabled={(date) => date > new Date() || (tempEndDate && date > tempEndDate)}
              />
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-2">End Date</div>
              <Calendar
                mode="single"
                selected={tempEndDate}
                onSelect={setTempEndDate}
                disabled={(date) => date > new Date() || (tempStartDate && date < tempStartDate)}
              />
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleApply} disabled={!tempStartDate || !tempEndDate}>
              Apply Range
            </Button>
          </div>
          {tempStartDate && tempEndDate && (
            <div className="text-xs text-muted-foreground text-center">
              {format(tempStartDate, "MMM dd, yyyy")} - {format(tempEndDate, "MMM dd, yyyy")}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CustomDateRangePicker;
