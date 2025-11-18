
import { Card, CardContent } from "@/components/ui/card";

interface OverviewMetricsProps {
  totalRaces: number;
  totalHorses: number;
  horsesFinished: number;
  horsesDNF: number;
  catastrophicInjuries: number;
  welfareAlertsCount: number;
  hasWelfareAlerts: boolean;
}

const OverviewMetrics = ({
  totalRaces,
  totalHorses,
  horsesFinished,
  horsesDNF,
  catastrophicInjuries,
  welfareAlertsCount,
  hasWelfareAlerts
}: OverviewMetricsProps) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <Card className="bg-background">
        <CardContent className="p-3">
          <div className="text-xs text-muted-foreground">Races Completed</div>
          <div className="text-base font-semibold">{totalRaces} races</div>
        </CardContent>
      </Card>

      <Card className="bg-background">
        <CardContent className="p-3">
          <div className="text-xs text-muted-foreground">Horses That Ran</div>
          <div className="text-base font-semibold">{totalHorses} horses</div>
        </CardContent>
      </Card>

      <Card className="bg-background">
        <CardContent className="p-3">
          <div className="text-xs text-muted-foreground">Finished/DNF</div>
          <div className="text-base font-semibold">{horsesFinished}/{horsesDNF}</div>
        </CardContent>
      </Card>

      <Card className={`${catastrophicInjuries > 0 ? 'bg-red-50 border-red-200' : 'bg-background'}`}>
        <CardContent className="p-3">
          <div className={`text-xs ${catastrophicInjuries > 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
            Catastrophic/Fatal
          </div>
          <div className={`text-base font-semibold ${catastrophicInjuries > 0 ? 'text-red-700' : ''}`}>
            {catastrophicInjuries} horses
          </div>
        </CardContent>
      </Card>

      <Card className={`${hasWelfareAlerts ? 'bg-red-50 border-red-200' : 'bg-background'}`}>
        <CardContent className="p-3">
          <div className={`text-xs ${hasWelfareAlerts ? 'text-red-600' : 'text-muted-foreground'}`}>
            Welfare Alerts
          </div>
          <div className={`text-base font-semibold ${hasWelfareAlerts ? 'text-red-700' : ''}`}>
            {welfareAlertsCount} horses
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewMetrics;
