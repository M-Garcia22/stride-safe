
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, eachDayOfInterval, startOfWeek, endOfWeek, isSameDay } from "date-fns";

interface HeatmapData {
  date: Date;
  riskScore: number;
  category5Count: number;
  totalHorses: number;
}

interface RiskHeatmapViewProps {
  data: HeatmapData[];
  startDate: Date;
  endDate: Date;
}

const RiskHeatmapView = ({ data, startDate, endDate }: RiskHeatmapViewProps) => {
  const heatmapGrid = useMemo(() => {
    const weekStart = startOfWeek(startDate);
    const weekEnd = endOfWeek(endDate);
    const allDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];
    
    allDays.forEach((day, index) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || index === allDays.length - 1) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });
    
    return weeks;
  }, [startDate, endDate]);

  const getRiskIntensity = (date: Date) => {
    const dayData = data.find(d => isSameDay(d.date, date));
    if (!dayData) return 0;
    
    // Calculate risk intensity based on category 5 percentage and overall risk score
    const category5Percentage = dayData.totalHorses > 0 ? (dayData.category5Count / dayData.totalHorses) * 100 : 0;
    return Math.min((dayData.riskScore + category5Percentage * 10) / 100, 1);
  };

  const getHeatmapColor = (intensity: number) => {
    if (intensity === 0) return 'bg-gray-100';
    if (intensity < 0.2) return 'bg-green-200';
    if (intensity < 0.4) return 'bg-yellow-200';
    if (intensity < 0.6) return 'bg-orange-200';
    if (intensity < 0.8) return 'bg-red-200';
    return 'bg-red-400';
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Risk Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* Week day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-xs text-center text-muted-foreground p-1">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Heatmap grid */}
            {heatmapGrid.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1">
                {week.map((date, dayIndex) => {
                  const intensity = getRiskIntensity(date);
                  const dayData = data.find(d => isSameDay(d.date, date));
                  const isInRange = date >= startDate && date <= endDate;
                  
                  return (
                    <Tooltip key={dayIndex}>
                      <TooltipTrigger asChild>
                        <div
                          className={`
                            h-8 w-full rounded border cursor-pointer transition-all hover:scale-110
                            ${isInRange ? getHeatmapColor(intensity) : 'bg-gray-50'}
                            ${!isInRange ? 'opacity-30' : ''}
                          `}
                        >
                          <div className="text-xs text-center pt-1">
                            {format(date, 'd')}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-sm">
                          <div className="font-medium">{format(date, 'MMM dd, yyyy')}</div>
                          {dayData ? (
                            <>
                              <div>Risk Score: {dayData.riskScore.toFixed(1)}</div>
                              <div>Category 5: {dayData.category5Count} horses</div>
                              <div>Total: {dayData.totalHorses} horses</div>
                            </>
                          ) : (
                            <div>No data available</div>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            ))}
            
            {/* Legend */}
            <div className="flex items-center justify-center gap-2 mt-4 text-xs">
              <span>Low Risk</span>
              <div className="flex gap-1">
                {['bg-gray-100', 'bg-green-200', 'bg-yellow-200', 'bg-orange-200', 'bg-red-200', 'bg-red-400'].map((color, index) => (
                  <div key={index} className={`w-3 h-3 rounded ${color} border`} />
                ))}
              </div>
              <span>High Risk</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default RiskHeatmapView;
