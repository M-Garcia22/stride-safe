
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SplitIcon, TableIcon } from "lucide-react";
import { getTodaysDate } from "../../../utils/preRaceHelpers";

interface PostRaceHeaderProps {
  totalRaces: number;
  totalHorses: number;
  horsesFinished: number;
  horsesDNF: number;
  catastrophicInjuries: number;
  welfareAlertsCount: number;
  hasWelfareAlerts: boolean;
  viewMode: 'single' | 'split';
  onViewModeChange: (mode: 'single' | 'split') => void;
}

const PostRaceHeader = ({ 
  totalRaces,
  totalHorses,
  horsesFinished,
  horsesDNF,
  catastrophicInjuries,
  welfareAlertsCount,
  hasWelfareAlerts,
  viewMode, 
  onViewModeChange 
}: PostRaceHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Card className="bg-background">
          <CardContent className="p-3">
            <div className="text-xs text-muted-foreground">Today's Date</div>
            <div className="text-base font-semibold">{getTodaysDate()}</div>
          </CardContent>
        </Card>
        
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
      
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'single' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('single')}
        >
          <TableIcon className="w-4 h-4 mr-2" />
          Single View
        </Button>
        <Button
          variant={viewMode === 'split' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('split')}
        >
          <SplitIcon className="w-4 h-4 mr-2" />
          Split View
        </Button>
      </div>
    </div>
  );
};

export default PostRaceHeader;
