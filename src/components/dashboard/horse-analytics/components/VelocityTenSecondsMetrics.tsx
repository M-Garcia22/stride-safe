
import { Badge } from "@/components/ui/badge";

interface VelocityTenSecondsMetricsProps {
  velocityAtPeak: number;
}

const VelocityTenSecondsMetrics = ({ 
  velocityAtPeak 
}: VelocityTenSecondsMetricsProps) => {
  return (
    <div className="flex justify-center text-sm">
      <div className="flex flex-col items-center">
        <Badge variant="outline" className="mb-1 bg-blue-50 text-blue-700 border-blue-200 text-xs">
          Peak velocity
        </Badge>
        <span className="font-semibold">{velocityAtPeak.toFixed(1)} fps</span>
      </div>
    </div>
  );
};

export default VelocityTenSecondsMetrics;
