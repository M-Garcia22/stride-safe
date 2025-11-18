
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

interface DateSelectorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  availableReportDates: Date[];
}

const DateSelector = ({ selectedDate, onDateSelect, availableReportDates }: DateSelectorProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const isDateAvailable = (date: Date) => {
    return availableReportDates.some(availableDate => 
      availableDate.toDateString() === date.toDateString()
    );
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && isDateAvailable(date)) {
      onDateSelect(date);
      setIsCalendarOpen(false);
      console.log('Loading post-race data for:', date.toDateString());
    }
  };

  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger asChild>
        <Card className="bg-background cursor-pointer hover:bg-muted/50 transition-colors w-fit">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              <div>
                <div className="text-xs text-muted-foreground">Today's Date</div>
                <div className="text-base font-semibold">{selectedDate.toDateString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={(date) => !isDateAvailable(date)}
          modifiers={{
            available: availableReportDates
          }}
          modifiersStyles={{
            available: {
              backgroundColor: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
              fontWeight: 'bold'
            }
          }}
          initialFocus
          className="pointer-events-auto"
        />
        <div className="p-3 border-t text-sm text-muted-foreground">
          <p>Highlighted dates have available post-race reports</p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateSelector;
