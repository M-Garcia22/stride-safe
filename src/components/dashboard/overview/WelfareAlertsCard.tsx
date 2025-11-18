
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface WelfareAlertsCardProps {
  welfareAlertsToday: number;
  welfareAlertsNext7Days: number;
  onClick: () => void;
}

const WelfareAlertsCard = ({ 
  welfareAlertsToday, 
  welfareAlertsNext7Days, 
  onClick 
}: WelfareAlertsCardProps) => {
  const totalWelfareAlerts = welfareAlertsToday + welfareAlertsNext7Days;

  return (
    <Card 
      className="border-rose-200 bg-gradient-to-br from-rose-50/80 to-orange-50/80 shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-200"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-rose-800">Welfare Alerts</CardTitle>
        <AlertTriangle className="h-4 w-4 text-rose-700" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-rose-800">{totalWelfareAlerts}</div>
        <p className="text-xs text-rose-600 font-medium">
          Today + Next 7 days
        </p>
        <div className="flex gap-1 mt-2">
          <Badge variant="outline" className="text-xs bg-rose-100 text-rose-800 border-rose-200">
            {welfareAlertsToday} today
          </Badge>
          <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800 border-orange-200">
            {welfareAlertsNext7Days} upcoming
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelfareAlertsCard;
