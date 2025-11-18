
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CloudRain } from "lucide-react";

interface TrackSafeCardProps {
  trackSurfaceCondition: string;
  lastReportDate: string;
  requiresSpecialAttention: boolean;
  rainfall24Hours: string;
  rainfall3Days: string;
  weatherStation: string;
}

const TrackSafeCard = ({
  trackSurfaceCondition,
  lastReportDate,
  requiresSpecialAttention,
  rainfall24Hours,
  rainfall3Days,
  weatherStation
}: TrackSafeCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-forest-600" />
          TrackSAFE Status
          {requiresSpecialAttention && (
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Track Surface:</span>
            <Badge variant="secondary" className="bg-sage-100 text-sage-800">
              {trackSurfaceCondition}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Last Report:</span>
            <span className="text-sm text-muted-foreground">{lastReportDate}</span>
          </div>
          <div className="border-t pt-3">
            <div className="flex items-center gap-2 mb-2">
              <CloudRain className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Rainfall Data</span>
            </div>
            <div className="mb-2">
              <span className="text-xs text-muted-foreground">Source: {weatherStation}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last 24hrs:</span>
                <span className="font-medium">{rainfall24Hours}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last 3 days:</span>
                <span className="font-medium">{rainfall3Days}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-sm font-medium">Status:</span>
            <div className="flex items-center gap-2">
              <Badge 
                variant={requiresSpecialAttention ? "destructive" : "secondary"} 
                className={requiresSpecialAttention ? "bg-amber-100 text-amber-800" : "bg-sage-100 text-sage-800"}
              >
                {requiresSpecialAttention ? "Special Attention Required" : "Operational"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackSafeCard;
