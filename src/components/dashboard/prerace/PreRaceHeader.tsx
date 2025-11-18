
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SplitIcon, TableIcon } from "lucide-react";
import { getTodaysDate } from "../../../utils/preRaceHelpers";

interface PreRaceHeaderProps {
  totalHorses: number;
  welfareAlertsCount: number;
  hasWelfareAlerts: boolean;
  viewMode: 'single' | 'split';
  onViewModeChange: (mode: 'single' | 'split') => void;
}

const PreRaceHeader = ({ 
  totalHorses, 
  welfareAlertsCount, 
  hasWelfareAlerts, 
  viewMode, 
  onViewModeChange 
}: PreRaceHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Card className="bg-background">
          <CardContent className="p-3">
            <div className="text-xs text-muted-foreground">Today's Date</div>
            <div className="text-base font-semibold">{getTodaysDate()}</div>
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

export default PreRaceHeader;
