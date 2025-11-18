
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Toggle } from "@/components/ui/toggle";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Download, List, ChevronDown } from "lucide-react";

interface TrendsControlsBarProps {
  selectedMetrics: 'both' | 'performance' | 'wellness';
  timeframe: '3m' | '6m' | '9m' | '12m' | 'all';
  eventTypes: 'both' | 'race' | 'breeze';
  showTrendLine: boolean;
  splitView: boolean;
  onMetricsChange: (value: 'both' | 'performance' | 'wellness') => void;
  onTimeframeChange: (value: '3m' | '6m' | '9m' | '12m' | 'all') => void;
  onEventTypesChange: (value: 'both' | 'race' | 'breeze') => void;
  onTrendLineChange: (value: boolean) => void;
  onSplitViewChange: (value: boolean) => void;
  onExport: (format: 'csv' | 'pdf' | 'json') => void;
}

const TrendsControlsBar = ({
  selectedMetrics,
  timeframe,
  eventTypes,
  showTrendLine,
  splitView,
  onMetricsChange,
  onTimeframeChange,
  onEventTypesChange,
  onTrendLineChange,
  onSplitViewChange,
  onExport
}: TrendsControlsBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Helper functions for summary display
  const getMetricsDisplay = () => {
    switch (selectedMetrics) {
      case 'both': return 'Both';
      case 'performance': return 'Fatigue';
      case 'wellness': return 'Welfare';
    }
  };

  const getTimeframeDisplay = () => {
    return timeframe === 'all' ? 'All Time' : timeframe.toUpperCase();
  };

  const getEventsDisplay = () => {
    switch (eventTypes) {
      case 'both': return 'All Events';
      case 'race': return 'Races';
      case 'breeze': return 'Training';
    }
  };

  return (
    <div className="flex-shrink-0 border-b bg-gray-50/50">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        {/* Compact Summary Bar */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-4">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                <ChevronDown className={`h-3 w-3 mr-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                Controls
              </Button>
            </CollapsibleTrigger>
            
            {/* Quick Summary */}
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <span className="flex items-center gap-1">
                <div className="flex gap-0.5">
                  {selectedMetrics === 'both' && (
                    <>
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-green-500"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-green-600 to-red-600"></div>
                    </>
                  )}
                  {selectedMetrics === 'performance' && (
                    <div className="w-2 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-green-500"></div>
                  )}
                  {selectedMetrics === 'wellness' && (
                    <div className="w-2 h-1.5 rounded-full bg-gradient-to-r from-green-600 to-red-600"></div>
                  )}
                </div>
                {getMetricsDisplay()}
              </span>
              <span>•</span>
              <span>{getTimeframeDisplay()}</span>
              <span>•</span>
              <span>{getEventsDisplay()}</span>
              {showTrendLine && (
                <>
                  <span>•</span>
                  <span>Trends</span>
                </>
              )}
              {splitView && (
                <>
                  <span>•</span>
                  <span>Split View</span>
                </>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onExport('csv')}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport('json')}>
                  Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport('pdf')}>
                  Export as Text
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Expanded Controls */}
        <CollapsibleContent>
          <div className="px-3 pb-3 pt-1">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Metrics Toggle */}
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-medium text-foreground shrink-0">Metrics:</span>
                <ToggleGroup type="single" value={selectedMetrics} onValueChange={(value: any) => value && onMetricsChange(value)} className="flex-1">
                  <ToggleGroupItem value="both" variant="outline" className="text-xs px-2 py-1 h-7 flex items-center gap-1 border data-[state=on]:bg-blue-50 data-[state=on]:border-blue-200 data-[state=on]:text-blue-700">
                    <div className="flex gap-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-green-500"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-green-600 to-red-600"></div>
                    </div>
                    <span>Both</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="performance" variant="outline" className="text-xs px-2 py-1 h-7 flex items-center gap-1 border data-[state=on]:bg-blue-50 data-[state=on]:border-blue-200 data-[state=on]:text-blue-700">
                    <div className="w-2 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-green-500"></div>
                    <span>Fatigue</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="wellness" variant="outline" className="text-xs px-2 py-1 h-7 flex items-center gap-1 border data-[state=on]:bg-blue-50 data-[state=on]:border-blue-200 data-[state=on]:text-blue-700">
                    <div className="w-2 h-1.5 rounded-full bg-gradient-to-r from-green-600 to-red-600"></div>
                    <span>Welfare</span>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Events Toggle */}
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-medium text-foreground shrink-0">Events:</span>
                <ToggleGroup type="single" value={eventTypes} onValueChange={(value: any) => value && onEventTypesChange(value)} className="flex-1">
                  <ToggleGroupItem value="both" variant="outline" className="text-xs px-2 py-1 h-7 border data-[state=on]:bg-blue-50 data-[state=on]:border-blue-200 data-[state=on]:text-blue-700">Both</ToggleGroupItem>
                  <ToggleGroupItem value="race" variant="outline" className="text-xs px-2 py-1 h-7 border data-[state=on]:bg-blue-50 data-[state=on]:border-blue-200 data-[state=on]:text-blue-700">Race</ToggleGroupItem>
                  <ToggleGroupItem value="breeze" variant="outline" className="text-xs px-2 py-1 h-7 border data-[state=on]:bg-blue-50 data-[state=on]:border-blue-200 data-[state=on]:text-blue-700">Training</ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Period Select */}
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-medium text-foreground shrink-0">Period:</span>
                <Select value={timeframe} onValueChange={(value: any) => onTimeframeChange(value)}>
                  <SelectTrigger className="w-[70px] h-7 text-xs border">
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

              {/* Options */}
              <div className="flex items-center gap-2">
                <Toggle
                  pressed={showTrendLine}
                  onPressedChange={onTrendLineChange}
                  variant="outline"
                  className="h-7 px-2 text-xs shrink-0 border data-[state=on]:bg-blue-50 data-[state=on]:border-blue-200 data-[state=on]:text-blue-700"
                >
                  Trends
                </Toggle>

                <Toggle
                  pressed={splitView}
                  onPressedChange={onSplitViewChange}
                  variant="outline"
                  className="h-7 px-2 text-xs shrink-0 border data-[state=on]:bg-blue-50 data-[state=on]:border-blue-200 data-[state=on]:text-blue-700"
                >
                  <List className="h-3 w-3 mr-1" />
                  List
                </Toggle>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default TrendsControlsBar;
