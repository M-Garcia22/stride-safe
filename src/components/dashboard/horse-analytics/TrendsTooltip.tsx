
import { format, parseISO } from "date-fns";
import { getPerformanceColor, getWellnessColor } from "@/lib/colorUtils";

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

interface TrendsTooltipProps {
  tooltipData: TrendsEvent | null;
  tooltipPosition: { x: number; y: number };
  showTooltip: boolean;
  selectedMetrics: 'both' | 'performance' | 'wellness';
  fullScreen?: boolean;
}

const TrendsTooltip = ({ tooltipData, tooltipPosition, showTooltip, selectedMetrics, fullScreen = false }: TrendsTooltipProps) => {
  if (!showTooltip || !tooltipData) return null;

  // Adjust positioning for full screen modal
  const getTooltipStyle = () => {
    if (fullScreen) {
      // In full screen, use viewport coordinates
      return {
        position: 'fixed' as const,
        left: `${tooltipPosition.x + 10}px`,
        top: `${tooltipPosition.y - 10}px`,
        transform: 'translateY(-100%)',
        zIndex: 9999
      };
    } else {
      // Regular positioning
      return {
        position: 'fixed' as const,
        left: `${tooltipPosition.x + 10}px`,
        top: `${tooltipPosition.y - 10}px`,
        transform: 'translateY(-100%)',
        zIndex: 50
      };
    }
  };

  return (
    <div 
      className="bg-white p-4 border rounded-lg shadow-lg text-sm max-w-xs pointer-events-none"
      style={getTooltipStyle()}
    >
      <div className="space-y-2">
        <div className="font-medium text-base">{format(parseISO(tooltipData.date), 'MMM dd, yyyy')}</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="font-medium">Type:</span>
            <span className="ml-1 capitalize">{tooltipData.type}</span>
          </div>
          <div>
            <span className="font-medium">Distance:</span>
            <span className="ml-1">{tooltipData.distance}</span>
          </div>
        </div>
        <div>
          <span className="font-medium text-xs">Location:</span>
          <div className="text-xs">{tooltipData.location}</div>
        </div>
        <div className="pt-2 border-t space-y-1">
          {(selectedMetrics === 'both' || selectedMetrics === 'performance') && (
            <div className="flex justify-between items-center">
              <span style={{ color: getPerformanceColor(tooltipData.performanceScore) }} className="text-xs font-medium">
                Performance:
              </span>
              <span className="text-xs font-bold">
                {tooltipData.performanceScore.toFixed(1)}
              </span>
            </div>
          )}
          {(selectedMetrics === 'both' || selectedMetrics === 'wellness') && (
            <div className="flex justify-between items-center">
              <span style={{ color: getWellnessColor(tooltipData.wellnessScore) }} className="text-xs font-medium">
                Wellness:
              </span>
              <span className="text-xs font-bold">
                {tooltipData.wellnessScore.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        {tooltipData.welfareAlert && (
          <div className="pt-2 border-t">
            <span className="text-xs font-medium text-red-600">⚠️ Welfare Alert Active</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendsTooltip;
