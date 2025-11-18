
import { useState, useEffect } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import RaceBreezesTable from "./RaceBreezesTable";
import EnhancedEventDetailsCard from "./EnhancedEventDetailsCard";
import TrendVelocityChart from "./TrendVelocityChart";
import VelocityChangeChart from "./VelocityChangeChart";
import VelocityAnalyticsControls from "./VelocityAnalyticsControls";
import { usePerformanceAnalyticsData } from "@/hooks/usePerformanceAnalyticsData";
import { RaceBreeze } from "@/types/performance";

interface VelocityAnalyticsPaneProps {
  horseName: string;
}

const VelocityAnalyticsPane = ({ horseName }: VelocityAnalyticsPaneProps) => {
  const [selectedEntry, setSelectedEntry] = useState<RaceBreeze | null>(null);
  const [highlightedDate, setHighlightedDate] = useState<string | null>(null);

  const {
    selectedTimeframe,
    setSelectedTimeframe,
    data,
  } = usePerformanceAnalyticsData();

  // Set default selection to most recent entry
  useEffect(() => {
    if (data.length > 0 && !selectedEntry) {
      const mostRecent = data[0]; // Data is sorted newest first
      setSelectedEntry(mostRecent);
      setHighlightedDate(mostRecent.date);
    }
  }, [data, selectedEntry]);

  const handleChartPointClick = (entry: RaceBreeze) => {
    setSelectedEntry(entry);
    setHighlightedDate(entry.date);
  };

  const handleTableRowClick = (entry: RaceBreeze) => {
    setSelectedEntry(entry);
    setHighlightedDate(entry.date);
  };

  return (
    <div className="h-full flex flex-col space-y-3 p-3">
      {/* Compact Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-lg font-semibold">Velocity & Acceleration</h3>
        
        <div className="flex items-center gap-2">
          <VelocityAnalyticsControls
            selectedTimeframe={selectedTimeframe}
            setSelectedTimeframe={setSelectedTimeframe}
          />
        </div>
      </div>

      <div className="flex-1 relative min-h-0">
        <ResizablePanelGroup direction="horizontal" className="rounded-lg border bg-background">
          <ResizablePanel 
            defaultSize={55}
            minSize={30}
            className="p-3"
          >
            <div className="h-full space-y-4 overflow-auto">
              {/* Event Details Section */}
              <div>
                {selectedEntry ? (
                  <EnhancedEventDetailsCard entry={selectedEntry} />
                ) : (
                  <div className="h-20 flex items-center justify-center text-muted-foreground border rounded-lg text-sm">
                    <p>Select an event to view detailed information</p>
                  </div>
                )}
              </div>

              {/* Velocity & Acceleration Card */}
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Velocity & Acceleration</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Maximize2 className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl max-h-[90vh]">
                      <DialogHeader>
                        <DialogTitle>Velocity & Acceleration - Full View</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 overflow-auto max-h-[75vh]">
                        <TrendVelocityChart data={data} />
                        <VelocityChangeChart data={data} />
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <TrendVelocityChart data={data} />
                  <VelocityChangeChart data={data} />
                </CardContent>
              </Card>
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          <ResizablePanel 
            defaultSize={45}
            minSize={25}
            maxSize={75}
            className="bg-muted/20"
          >
            <RaceBreezesTable 
              data={data}
              highlightedDate={highlightedDate}
              selectedEntryId={selectedEntry?.id || null}
              onRowClick={handleTableRowClick}
              isCollapsed={false}
              onToggleCollapse={() => {}}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default VelocityAnalyticsPane;
