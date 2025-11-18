
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Settings, TrendingUp, Eye } from "lucide-react";

export interface PostRaceSensitivitySettings {
  category3: 'low' | 'medium' | 'high';
  category4: 'low' | 'medium' | 'high';
  category5: 'low' | 'medium' | 'high';
  trendAlertThreshold: number;
  enableTrendAlerts: boolean;
  highlightAnomalies: boolean;
  showConfidenceIntervals: boolean;
}

interface PostRaceSensitivitySettingsProps {
  settings: PostRaceSensitivitySettings;
  onSettingsChange: (settings: PostRaceSensitivitySettings) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const PostRaceSensitivitySettings = ({
  settings,
  onSettingsChange,
  isOpen,
  onToggle
}: PostRaceSensitivitySettingsProps) => {
  const updateSetting = <K extends keyof PostRaceSensitivitySettings>(
    key: K, 
    value: PostRaceSensitivitySettings[K]
  ) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const getSensitivityColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSensitivityDescription = (level: string) => {
    switch (level) {
      case 'low': return 'Standard highlighting';
      case 'medium': return 'Enhanced visibility';
      case 'high': return 'Maximum emphasis';
      default: return '';
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={onToggle}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs"
        >
          <Settings className="w-4 h-4 mr-2" />
          Sensitivity
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h4 className="font-medium text-sm">Risk Analysis Sensitivity</h4>
          </div>

          {/* Risk Category Settings */}
          <div className="space-y-3">
            <div className="text-xs font-medium text-muted-foreground">Risk Categories</div>
            {[3, 4, 5].map(category => (
              <div key={category} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-100 text-red-800 text-xs">
                    Cat {category}
                  </Badge>
                  <div className="text-xs">
                    <div className="font-medium">Risk Level {category}</div>
                    <div className="text-muted-foreground">
                      {getSensitivityDescription(settings[`category${category}` as keyof PostRaceSensitivitySettings] as string)}
                    </div>
                  </div>
                </div>
                
                <Select
                  value={settings[`category${category}` as keyof PostRaceSensitivitySettings] as string}
                  onValueChange={(value: 'low' | 'medium' | 'high') => 
                    updateSetting(`category${category}` as keyof PostRaceSensitivitySettings, value)
                  }
                >
                  <SelectTrigger className="w-20 h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Med</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          {/* Trend Alert Settings */}
          <div className="space-y-3 pt-2 border-t">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium">Trend Alerts</span>
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-xs">Enable trend alerts</Label>
              <Switch
                checked={settings.enableTrendAlerts}
                onCheckedChange={(checked) => updateSetting('enableTrendAlerts', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-xs">Threshold (%)</Label>
              <Select
                value={settings.trendAlertThreshold.toString()}
                onValueChange={(value) => updateSetting('trendAlertThreshold', parseInt(value))}
              >
                <SelectTrigger className="w-16 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5%</SelectItem>
                  <SelectItem value="10">10%</SelectItem>
                  <SelectItem value="15">15%</SelectItem>
                  <SelectItem value="20">20%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Display Settings */}
          <div className="space-y-3 pt-2 border-t">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium">Display Options</span>
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-xs">Highlight anomalies</Label>
              <Switch
                checked={settings.highlightAnomalies}
                onCheckedChange={(checked) => updateSetting('highlightAnomalies', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-xs">Show confidence intervals</Label>
              <Switch
                checked={settings.showConfidenceIntervals}
                onCheckedChange={(checked) => updateSetting('showConfidenceIntervals', checked)}
              />
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => onSettingsChange({ 
                category3: 'medium', 
                category4: 'high', 
                category5: 'high',
                trendAlertThreshold: 10,
                enableTrendAlerts: true,
                highlightAnomalies: true,
                showConfidenceIntervals: false
              })}
            >
              Reset to Defaults
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PostRaceSensitivitySettings;
