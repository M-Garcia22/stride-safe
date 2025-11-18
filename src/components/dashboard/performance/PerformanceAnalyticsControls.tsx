
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import PerformanceAnalyticsSettingsDialog from "./PerformanceAnalyticsSettingsDialog";

interface PerformanceAnalyticsControlsProps {
  selectedTimeframe: '3m' | '6m' | '9m' | '12m' | 'all';
  setSelectedTimeframe: (timeframe: '3m' | '6m' | '9m' | '12m' | 'all') => void;
  selectedMetrics: 'both' | 'performance' | 'wellness';
  setSelectedMetrics: (metrics: 'both' | 'performance' | 'wellness') => void;
  showTrendLine: boolean;
  setShowTrendLine: (show: boolean) => void;
  alertThreshold?: number;
  onAlertThresholdChange?: (threshold: number) => void;
}

const PerformanceAnalyticsControls = ({
  selectedTimeframe,
  setSelectedTimeframe,
  selectedMetrics,
  setSelectedMetrics,
  showTrendLine,
  setShowTrendLine,
  alertThreshold = 3,
  onAlertThresholdChange
}: PerformanceAnalyticsControlsProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleAlertThresholdChange = (threshold: number) => {
    if (onAlertThresholdChange) {
      onAlertThresholdChange(threshold);
    }
  };

  return (
    <>
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center space-x-2">
          <Switch
            id="trend-line"
            checked={showTrendLine}
            onCheckedChange={setShowTrendLine}
          />
          <Label htmlFor="trend-line" className="text-sm">Trend Line</Label>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setSettingsOpen(true)}
        >
          <Settings className="w-4 h-4 mr-1" />
          Settings
        </Button>

        <ToggleGroup 
          type="single" 
          value={selectedMetrics} 
          onValueChange={(value) => value && setSelectedMetrics(value as 'both' | 'performance' | 'wellness')}
          className="h-8"
        >
          <ToggleGroupItem value="both" aria-label="Both metrics" className="h-8 px-2 text-xs">
            Both
          </ToggleGroupItem>
          <ToggleGroupItem value="performance" aria-label="Performance only" className="h-8 px-2 text-xs">
            Performance
          </ToggleGroupItem>
          <ToggleGroupItem value="wellness" aria-label="Wellness only" className="h-8 px-2 text-xs">
            Wellness
          </ToggleGroupItem>
        </ToggleGroup>

        <Select value={selectedTimeframe} onValueChange={(value) => setSelectedTimeframe(value as '3m' | '6m' | '9m' | '12m' | 'all')}>
          <SelectTrigger className="w-24 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3m">3M</SelectItem>
            <SelectItem value="6m">6M</SelectItem>
            <SelectItem value="9m">9M</SelectItem>
            <SelectItem value="12m">12M</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <PerformanceAnalyticsSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        alertThreshold={alertThreshold}
        onAlertThresholdChange={handleAlertThresholdChange}
      />
    </>
  );
};

export default PerformanceAnalyticsControls;
