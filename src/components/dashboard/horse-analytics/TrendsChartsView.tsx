
import { Horse } from "@/types/horse";
import TrendsFullScreenHeader from "./TrendsFullScreenHeader";
import TrendsTooltip from "./TrendsTooltip";
import TrendsChartCore from "./TrendsChartCore";
import ResponsiveChartContainer from "./ResponsiveChartContainer";
import { useTrendsData } from "./hooks/useTrendsData";
import { useTrendsTooltip } from "./hooks/useTrendsTooltip";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Maximize2 } from "lucide-react";
import { useState } from "react";
import { BaseTrendsEvent } from "./types/trendsChart";

interface TrendsChartsViewProps {
  data: BaseTrendsEvent[];
  selectedMetrics: 'both' | 'performance' | 'wellness';
  timeframe: '3m' | '6m' | '9m' | '12m' | 'all';
  eventTypes: 'both' | 'race' | 'breeze';
  showTrendLine: boolean;
  highlightedEventId: string | null;
  onEventHighlight: (eventId: string | null) => void;
  onEventSelect: (eventId: string) => void;
  fullScreen: boolean;
  horse?: Horse;
  onMetricsChange?: (value: 'both' | 'performance' | 'wellness') => void;
  onEventTypesChange?: (value: 'both' | 'race' | 'breeze') => void;
  onTimeframeChange?: (value: '3m' | '6m' | '9m' | '12m' | 'all') => void;
  onTrendLineChange?: (value: boolean) => void;
}

const TrendsChartsView = ({
  data,
  timeframe,
  eventTypes,
  selectedMetrics,
  showTrendLine,
  highlightedEventId,
  onEventSelect,
  fullScreen,
  horse,
  onMetricsChange,
  onEventTypesChange,
  onTimeframeChange,
  onTrendLineChange
}: TrendsChartsViewProps) => {
  const [showFullScreenDialog, setShowFullScreenDialog] = useState(false);
  const [splitView, setSplitView] = useState(false);
  
  // Local state for full-screen modal controls
  const [fullScreenMetrics, setFullScreenMetrics] = useState<'both' | 'performance' | 'wellness'>(selectedMetrics);
  const [fullScreenEventTypes, setFullScreenEventTypes] = useState<'both' | 'race' | 'breeze'>(eventTypes);
  const [fullScreenTimeframe, setFullScreenTimeframe] = useState<'3m' | '6m' | '9m' | '12m' | 'all'>(timeframe);
  const [fullScreenShowTrendLine, setFullScreenShowTrendLine] = useState(showTrendLine);
  
  // Use appropriate state based on fullScreen mode
  const currentMetrics = fullScreen ? fullScreenMetrics : selectedMetrics;
  const currentEventTypes = fullScreen ? fullScreenEventTypes : eventTypes;
  const currentTimeframe = fullScreen ? fullScreenTimeframe : timeframe;
  const currentShowTrendLine = fullScreen ? fullScreenShowTrendLine : showTrendLine;
  
  const { processedData, trendData } = useTrendsData(data, currentTimeframe, currentEventTypes, currentShowTrendLine);
  
  const {
    tooltipData,
    tooltipPosition,
    showTooltip,
    handleMouseEnter,
    handleMouseLeave,
    handleBarClick
  } = useTrendsTooltip(processedData, onEventSelect);

  const handleExport = (format: 'csv' | 'pdf' | 'json') => {
    console.log(`Exporting data as ${format}`);
  };

  // Full-screen modal handlers
  const handleFullScreenMetricsChange = (value: 'both' | 'performance' | 'wellness') => {
    setFullScreenMetrics(value);
  };

  const handleFullScreenEventTypesChange = (value: 'both' | 'race' | 'breeze') => {
    setFullScreenEventTypes(value);
  };

  const handleFullScreenTimeframeChange = (value: '3m' | '6m' | '9m' | '12m' | 'all') => {
    setFullScreenTimeframe(value);
  };

  const handleFullScreenTrendLineChange = (value: boolean) => {
    setFullScreenShowTrendLine(value);
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Full Screen Button - Positioned in top-right corner */}
      {!fullScreen && (
        <Dialog open={showFullScreenDialog} onOpenChange={setShowFullScreenDialog}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="absolute top-3 right-3 z-10 h-8 w-8 p-0 bg-white/90 backdrop-blur-sm hover:bg-white"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl h-[90vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>Fatigue & Welfare Trends - {horse?.name || 'Horse'}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 min-h-0">
              <TrendsChartsView
                data={data}
                selectedMetrics={selectedMetrics}
                timeframe={timeframe}
                eventTypes={eventTypes}
                showTrendLine={showTrendLine}
                highlightedEventId={highlightedEventId}
                onEventHighlight={() => {}}
                onEventSelect={onEventSelect}
                fullScreen={true}
                horse={horse}
                onMetricsChange={onMetricsChange}
                onEventTypesChange={onEventTypesChange}
                onTimeframeChange={onTimeframeChange}
                onTrendLineChange={onTrendLineChange}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Full Screen Header with Controls */}
      {fullScreen && (
        <div className="flex-shrink-0">
          <TrendsFullScreenHeader
            selectedMetrics={currentMetrics}
            eventTypes={currentEventTypes}
            timeframe={currentTimeframe}
            showTrendLine={currentShowTrendLine}
            splitView={splitView}
            onMetricsChange={handleFullScreenMetricsChange}
            onEventTypesChange={handleFullScreenEventTypesChange}
            onTimeframeChange={handleFullScreenTimeframeChange}
            onTrendLineChange={handleFullScreenTrendLineChange}
            onSplitViewChange={setSplitView}
            onExport={handleExport}
          />
        </div>
      )}
      
      {/* Chart Area - Fixed height container */}
      <div className="flex-1 p-4 pt-2 min-h-0 max-h-full overflow-hidden">
        <div className="h-full max-h-[400px]">
          <ResponsiveChartContainer
            minHeight={300}
            maxHeight={400}
            className="h-full"
          >
            {({ width, height }) => (
              <TrendsChartCore
                processedData={processedData}
                trendData={trendData}
                selectedMetrics={currentMetrics}
                showTrendLine={currentShowTrendLine}
                highlightedEventId={highlightedEventId}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onBarClick={handleBarClick}
                width={width}
                height={height}
              />
            )}
          </ResponsiveChartContainer>
        </div>
      </div>

      {/* Custom Tooltip */}
      <TrendsTooltip
        tooltipData={tooltipData}
        tooltipPosition={tooltipPosition}
        showTooltip={showTooltip}
        selectedMetrics={currentMetrics}
        fullScreen={fullScreen}
      />
    </div>
  );
};

export default TrendsChartsView;
