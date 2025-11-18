import React, { useState, useMemo } from 'react';
import { RaceBreeze } from '@/types/performance';
import PerformanceChart from './PerformanceChart';
import PerformanceChangeChart from './PerformanceChangeChart';
import RaceBreezesTable from './RaceBreezesTable';
import EnhancedEventDetailsCard from './EnhancedEventDetailsCard';
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { Calendar } from "@/components/ui/calendar"
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { generateMockData } from '@/utils/mockPerformanceData';

interface PerformanceAnalyticsPaneProps {
  data?: RaceBreeze[];
  horseName?: string;
}

const PerformanceAnalyticsPane = ({ data: propData, horseName }: PerformanceAnalyticsPaneProps) => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const [selectedMetrics, setSelectedMetrics] = useState<'both' | 'performance' | 'wellness'>('both');
  const [highlightedDate, setHighlightedDate] = useState<string | null>(null);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [showTrendLine, setShowTrendLine] = useState(false);

  // Use prop data or generate mock data
  const data = propData || generateMockData();

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    setHighlightedDate(null);
    setSelectedEntryId(null);
  };

  const handleMetricChange = (metric: 'both' | 'performance' | 'wellness') => {
    setSelectedMetrics(metric);
    setHighlightedDate(null);
    setSelectedEntryId(null);
  };

  const handlePointClick = (entry: RaceBreeze) => {
    setHighlightedDate(entry.date);
    setSelectedEntryId(entry.id);
  };

  const handleRowClick = (entry: RaceBreeze) => {
    setHighlightedDate(entry.date);
    setSelectedEntryId(entry.id);
  };

  const filteredData = useMemo(() => {
    if (!date?.from || !date?.to) {
      return [];
    }

    return data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= date.from! && itemDate <= date.to!;
    });
  }, [data, date]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="space-x-2 flex items-center">
          <Label htmlFor="trendline">Show Trendline</Label>
          <Checkbox 
            id="trendline" 
            checked={showTrendLine} 
            onCheckedChange={(checked) => setShowTrendLine(checked === true)} 
          />
        </div>
        <div className="space-x-2 flex items-center">
          <div>
            <Label>Select Metrics</Label>
            <Select value={selectedMetrics} onValueChange={handleMetricChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Metrics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="both">Both</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="wellness">Wellness</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label>Select Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={handleDateChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="vertical" className="min-h-0">
          <ResizablePanel defaultSize={60} minSize={30}>
            <div className="h-full p-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
                <div className="bg-card rounded-lg border p-3">
                  <h3 className="text-sm font-medium mb-2">Performance & Wellness</h3>
                  <PerformanceChart
                    data={filteredData}
                    selectedMetrics={selectedMetrics}
                    highlightedDate={highlightedDate}
                    selectedEntryId={selectedEntryId}
                    onPointClick={handlePointClick}
                    showTrendLine={showTrendLine}
                  />
                </div>
                <div className="bg-card rounded-lg border p-3">
                  <h3 className="text-sm font-medium mb-2">% Change</h3>
                  <PerformanceChangeChart
                    data={filteredData}
                    selectedMetrics={selectedMetrics}
                    highlightedDate={highlightedDate}
                    selectedEntryId={selectedEntryId}
                    onPointClick={handlePointClick}
                  />
                </div>
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle />
          
          <ResizablePanel defaultSize={40} minSize={20}>
            <div className="h-full overflow-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-2 h-full">
                <div className="bg-card rounded-lg border overflow-hidden">
                  <RaceBreezesTable
                    data={filteredData}
                    highlightedDate={highlightedDate}
                    selectedEntryId={selectedEntryId}
                    onRowClick={handleRowClick}
                    isCollapsed={false}
                    onToggleCollapse={() => {}}
                  />
                </div>
                <div className="bg-card rounded-lg border p-3">
                  {selectedEntryId ? (
                    <EnhancedEventDetailsCard entry={data.find(entry => entry.id === selectedEntryId)!} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      Select an event to view details
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default PerformanceAnalyticsPane;
