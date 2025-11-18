
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VelocityAnalyticsControlsProps {
  selectedTimeframe: '3m' | '6m' | '9m' | '12m' | 'all';
  setSelectedTimeframe: (timeframe: '3m' | '6m' | '9m' | '12m' | 'all') => void;
}

const VelocityAnalyticsControls = ({
  selectedTimeframe,
  setSelectedTimeframe
}: VelocityAnalyticsControlsProps) => {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <Select value={selectedTimeframe} onValueChange={(value) => setSelectedTimeframe(value as '3m' | '6m' | '9m' | '12m' | 'all')}>
        <SelectTrigger className="w-24 h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="3m">3M</SelectItem>
          <SelectItem value="6m">6M</SelectItem>
          <SelectItem value="9m">9M</SelectItem>
          <SelectItem value="12m">12M</SelectItem>
          <SelectItem value="all">All</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default VelocityAnalyticsControls;
