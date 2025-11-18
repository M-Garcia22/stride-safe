
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertTriangle, Settings } from "lucide-react";
import { SensitivitySettings as SensitivitySettingsType } from "../../../data/preRaceData";

interface SensitivitySettingsProps {
  settings: SensitivitySettingsType;
  onSettingsChange: (settings: SensitivitySettingsType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const SensitivitySettings = ({
  settings,
  onSettingsChange,
  isOpen,
  onToggle
}: SensitivitySettingsProps) => {
  const updateSetting = (category: keyof SensitivitySettingsType, level: 'low' | 'medium' | 'high') => {
    onSettingsChange({
      ...settings,
      [category]: level
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
      case 'low': return 'Standard indicators';
      case 'medium': return 'Enhanced highlighting';
      case 'high': return 'Urgent alerts';
      default: return '';
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={onToggle}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8"
        >
          <Settings className="w-4 h-4 mr-2" />
          Sensitivity
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h4 className="font-medium text-sm">Red-flagged Categories Sensitivity</h4>
          </div>

          <div className="space-y-3">
            {[3, 4, 5].map(category => (
              <div key={category} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-100 text-red-800 text-xs">
                    Cat {category}
                  </Badge>
                  <div className="text-xs">
                    <div className="font-medium">Risk Level {category}</div>
                    <div className="text-muted-foreground">
                      {getSensitivityDescription(settings[`category${category}` as keyof SensitivitySettingsType])}
                    </div>
                  </div>
                </div>
                
                <Select
                  value={settings[`category${category}` as keyof SensitivitySettingsType]}
                  onValueChange={(value: 'low' | 'medium' | 'high') => 
                    updateSetting(`category${category}` as keyof SensitivitySettingsType, value)
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
          
          <div className="pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => onSettingsChange({ category3: 'medium', category4: 'high', category5: 'high' })}
            >
              Reset to Defaults
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SensitivitySettings;
