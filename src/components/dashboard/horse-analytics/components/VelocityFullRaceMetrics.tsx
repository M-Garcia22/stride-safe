
import { Badge } from "@/components/ui/badge";

interface VelocityFullRaceMetricsProps {
  timeToPeak: number;
  velocityAtPeak: number;
  timeToTarget: number;
}

const VelocityFullRaceMetrics = ({ 
  timeToPeak, 
  velocityAtPeak, 
  timeToTarget 
}: VelocityFullRaceMetricsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 text-sm">
      <div className="flex flex-col items-center">
        <Badge variant="outline" className="mb-1 bg-orange-50 text-orange-700 border-orange-200 text-xs">
          Time to 52 fps
        </Badge>
        <span className="font-semibold">{timeToTarget}s</span>
      </div>
      <div className="flex flex-col items-center">
        <Badge variant="outline" className="mb-1 bg-blue-50 text-blue-700 border-blue-200 text-xs">
          Time to peak
        </Badge>
        <span className="font-semibold">{timeToPeak}s</span>
      </div>
      <div className="flex flex-col items-center">
        <Badge variant="outline" className="mb-1 bg-blue-50 text-blue-700 border-blue-200 text-xs">
          Velocity at peak
        </Badge>
        <span className="font-semibold">{velocityAtPeak.toFixed(1)} fps</span>
      </div>
    </div>
  );
};

export default VelocityFullRaceMetrics;
