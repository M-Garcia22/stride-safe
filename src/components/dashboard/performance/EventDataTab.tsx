
import EnhancedEventDetailsCard from "./EnhancedEventDetailsCard";
import { RaceBreeze } from "@/types/performance";

interface EventDataTabProps {
  selectedEntry: RaceBreeze | null;
}

const EventDataTab = ({ selectedEntry }: EventDataTabProps) => {
  if (!selectedEntry) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <p>Select an event to view detailed information</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <EnhancedEventDetailsCard entry={selectedEntry} />
    </div>
  );
};

export default EventDataTab;
