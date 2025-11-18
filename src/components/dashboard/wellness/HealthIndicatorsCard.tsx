
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface HealthIndicator {
  id: string;
  name: string;
  status: 'active' | 'resolved' | 'monitoring';
  severity: 'high' | 'medium' | 'low';
  date: string;
  description: string;
}

interface HealthIndicatorsCardProps {
  indicators: HealthIndicator[];
  welfareAlert: boolean;
}

const HealthIndicatorsCard = ({ indicators, welfareAlert }: HealthIndicatorsCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'monitoring':
        return <Clock className="w-4 h-4 text-amber-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return "bg-red-100 text-red-800";
      case 'resolved':
        return "bg-green-100 text-green-800";
      case 'monitoring':
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return "bg-red-500";
      case 'medium':
        return "bg-amber-500";
      case 'low':
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className={welfareAlert ? "border-red-200 bg-red-50/30" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Health Indicators & Alerts</CardTitle>
          {welfareAlert && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Welfare Alert
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {indicators.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p>No active health indicators</p>
          </div>
        ) : (
          <div className="space-y-3">
            {indicators.map((indicator) => (
              <div key={indicator.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0 mt-0.5">
                  {getStatusIcon(indicator.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{indicator.name}</h4>
                    <div className={`w-2 h-2 rounded-full ${getSeverityColor(indicator.severity)}`} />
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{indicator.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(indicator.status)} variant="secondary">
                      {indicator.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(indicator.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthIndicatorsCard;
