
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Horse } from "@/types/horse";
import { subMonths, isAfter, parseISO, format, differenceInDays } from "date-fns";
import { Info } from "lucide-react";
import TrendsChartCore from "./TrendsChartCore";
import ResponsiveChartContainer from "./ResponsiveChartContainer";
import { useTrendsData } from "./hooks/useTrendsData";
import { useTrendsTooltip } from "./hooks/useTrendsTooltip";
import TrendsTooltip from "./TrendsTooltip";
import WelfareRiskInfoDialog from "./components/WelfareRiskInfoDialog";

interface TrendsEvent {
  id: string;
  date: string;
  type: 'race' | 'breeze';
  location: string;
  distance: string;
  performanceScore: number;
  wellnessScore: number;
  welfareAlert: boolean;
}

interface FatigueWellnessGraphCardProps {
  horse: Horse;
  trendsData: TrendsEvent[];
  onTabChange?: (tab: string) => void;
}

const FatigueWellnessGraphCard = ({ horse, trendsData, onTabChange }: FatigueWellnessGraphCardProps) => {
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  // Filter data to show only past 6 months and limit to 6 races
  const sixMonthsData = useMemo(() => {
    const today = new Date();
    const sixMonthsAgo = subMonths(today, 6);
    
    const raceEvents = trendsData
      .filter(item => isAfter(parseISO(item.date), sixMonthsAgo))
      .filter(item => item.type === 'race') // Only show races
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort by date ascending (oldest first for right-to-left display)
      .slice(0, 6); // Take the 6 most recent races

    if (raceEvents.length === 0) return [];

    // Process the data with time-based positioning data
    return raceEvents.map((item, index) => {
      const eventDate = parseISO(item.date);
      
      // Calculate days between consecutive events (now for next to previous since order is reversed)
      let daysBetween = null;
      if (index > 0) {
        const prevEvent = raceEvents[index - 1];
        daysBetween = differenceInDays(eventDate, parseISO(prevEvent.date));
      }
      
      // Calculate days from today for proportional positioning
      const daysFromToday = differenceInDays(today, eventDate);
      
      return {
        ...item,
        formattedDate: format(eventDate, 'MMM dd'),
        index, // This index will be used for positioning - 0 = leftmost (oldest), highest index = rightmost (most recent)
        daysBetween,
        daysFromToday // Add this for time-based positioning
      };
    });
  }, [trendsData]);

  const { processedData, trendData } = useTrendsData(
    sixMonthsData, 
    '6m',
    'race',
    false
  );

  const {
    tooltipData,
    tooltipPosition,
    showTooltip,
    handleMouseEnter,
    handleMouseLeave,
    handleBarClick
  } = useTrendsTooltip(processedData, () => {});

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Welfare & Fatigue-Performance Scores</CardTitle>
            <button
              onClick={() => setShowInfoDialog(true)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <Info className="h-4 w-4 text-gray-600" strokeWidth={2} />
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            Available race events in the past 6 month period ({sixMonthsData.length} races shown)
          </p>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="h-80 w-full relative">
            <ResponsiveChartContainer
              minHeight={320}
              maxHeight={320}
              className="h-full"
            >
              {({ width, height }) => (
                <TrendsChartCore
                  processedData={processedData}
                  trendData={trendData}
                  selectedMetrics="both"
                  showTrendLine={false}
                  highlightedEventId={null}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onBarClick={handleBarClick}
                  width={width}
                  height={height}
                  useTimeBasedPositioning={true}
                  showDaysBetween={true}
                />
              )}
            </ResponsiveChartContainer>
            
            {/* Custom Tooltip */}
            <TrendsTooltip
              tooltipData={tooltipData}
              tooltipPosition={tooltipPosition}
              showTooltip={showTooltip}
              selectedMetrics="both"
              fullScreen={false}
            />
          </div>
        </CardContent>
      </Card>

      <WelfareRiskInfoDialog 
        open={showInfoDialog} 
        onOpenChange={setShowInfoDialog} 
      />
    </>
  );
};

export default FatigueWellnessGraphCard;
