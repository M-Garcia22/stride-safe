
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";

interface TrendsControlsProps {
  selectedMetrics: 'both' | 'performance' | 'wellness';
  eventTypes: 'both' | 'race' | 'breeze';
  timeframe: '3m' | '6m' | '9m' | '12m' | 'all';
  showTrendLine: boolean;
  onMetricsChange?: (value: 'both' | 'performance' | 'wellness') => void;
  onEventTypesChange?: (value: 'both' | 'race' | 'breeze') => void;
  onTimeframeChange?: (value: '3m' | '6m' | '9m' | '12m' | 'all') => void;
  onTrendLineChange?: (value: boolean) => void;
}

const TrendsControls = ({
  selectedMetrics,
  eventTypes,
  timeframe,
  showTrendLine,
  onMetricsChange,
  onEventTypesChange,
  onTimeframeChange,
  onTrendLineChange
}: TrendsControlsProps) => {
  return (
    <div className="flex-1 flex flex-wrap items-center gap-4 p-3 bg-muted/20 rounded-lg border">
      {/* Metrics Toggle */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Metrics:</span>
        <ToggleGroup 
          type="single" 
          value={selectedMetrics} 
          onValueChange={(value: any) => value && onMetricsChange?.(value)}
          size="sm"
        >
          <ToggleGroupItem value="both" variant="outline" className="text-xs px-2 py-1">Both</ToggleGroupItem>
          <ToggleGroupItem value="performance" variant="outline" className="text-xs px-2 py-1">Fatigue</ToggleGroupItem>
          <ToggleGroupItem value="wellness" variant="outline" className="text-xs px-2 py-1">Welfare</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Events Toggle */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Events:</span>
        <ToggleGroup 
          type="single" 
          value={eventTypes} 
          onValueChange={(value: any) => value && onEventTypesChange?.(value)}
          size="sm"
        >
          <ToggleGroupItem value="both" variant="outline" className="text-xs px-2 py-1">Both</ToggleGroupItem>
          <ToggleGroupItem value="race" variant="outline" className="text-xs px-2 py-1">Races</ToggleGroupItem>
          <ToggleGroupItem value="breeze" variant="outline" className="text-xs px-2 py-1">Breezes</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Timeframe */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Period:</span>
        <Select value={timeframe} onValueChange={(value: any) => onTimeframeChange?.(value)}>
          <SelectTrigger className="w-[100px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3m">3 Months</SelectItem>
            <SelectItem value="6m">6 Months</SelectItem>
            <SelectItem value="9m">9 Months</SelectItem>
            <SelectItem value="12m">12 Months</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trend Line Toggle */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Trends:</span>
        <Toggle
          pressed={showTrendLine}
          onPressedChange={onTrendLineChange}
          size="sm"
          variant="outline"
          className="h-8 px-2 text-xs"
        >
          Lines
        </Toggle>
      </div>
    </div>
  );
};

export default TrendsControls;
