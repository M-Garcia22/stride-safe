
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import TrendsHistoryTable from "./TrendsHistoryTable";
import { BaseTrendsEvent } from "./types/trendsChart";

interface TrendsHistorySectionProps {
  trendsData: BaseTrendsEvent[];
  timeframe: '3m' | '6m' | '9m' | '12m' | 'all';
  eventTypes: 'both' | 'race' | 'breeze';
  selectedEventId: string | null;
  highlightedEventId: string | null;
  showHistoryTable: boolean;
  onShowHistoryTableChange: (show: boolean) => void;
  onEventSelect: (eventId: string) => void;
  onEventHighlight: (eventId: string | null) => void;
}

const TrendsHistorySection = ({
  trendsData,
  timeframe,
  eventTypes,
  selectedEventId,
  highlightedEventId,
  showHistoryTable,
  onShowHistoryTableChange,
  onEventSelect,
  onEventHighlight
}: TrendsHistorySectionProps) => {
  return (
    <div className="flex-shrink-0">
      <Collapsible open={showHistoryTable} onOpenChange={onShowHistoryTableChange}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between h-10 text-left font-medium"
          >
            <span>Historic Race Records ({trendsData.length} events)</span>
            {showHistoryTable ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <div className="border rounded-lg bg-card max-h-[300px] overflow-auto">
            <TrendsHistoryTable
              data={trendsData}
              timeframe={timeframe}
              eventTypes={eventTypes}
              selectedEventId={selectedEventId}
              highlightedEventId={highlightedEventId}
              onEventSelect={onEventSelect}
              onEventHighlight={onEventHighlight}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default TrendsHistorySection;
