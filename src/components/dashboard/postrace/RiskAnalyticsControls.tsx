
import { Button } from "@/components/ui/button";
import { BarChart, Shield, Thermometer, Wind, Cloud } from "lucide-react";

type ViewMode = 'single' | 'split';
type WeatherMetric = 'temperature' | 'windSpeed' | 'precipitation';

interface RiskAnalyticsControlsProps {
  showAggregate: boolean;
  setShowAggregate: (value: boolean) => void;
  visibleCategories: Record<number, boolean>;
  setVisibleCategories: (value: Record<number, boolean> | ((prev: Record<number, boolean>) => Record<number, boolean>)) => void;
  showMeanTrend: boolean;
  setShowMeanTrend: (value: boolean) => void;
  showLinearTrend: boolean;
  setShowLinearTrend: (value: boolean) => void;
  hasTrackSAFESubscription: boolean;
  showTrackSAFEOverlay: boolean;
  setShowTrackSAFEOverlay: (value: boolean) => void;
  showWeatherOverlay: boolean;
  setShowWeatherOverlay: (value: boolean) => void;
  selectedWeatherMetric: WeatherMetric;
  setSelectedWeatherMetric: (value: WeatherMetric) => void;
  getRiskCategoryColor: (category: number, sensitivityLevel?: 'low' | 'medium' | 'high') => string;
  currentSensitivitySettings: any;
}

const RiskAnalyticsControls = ({
  showAggregate,
  setShowAggregate,
  visibleCategories,
  setVisibleCategories,
  showMeanTrend,
  setShowMeanTrend,
  showLinearTrend,
  setShowLinearTrend,
  hasTrackSAFESubscription,
  showTrackSAFEOverlay,
  setShowTrackSAFEOverlay,
  showWeatherOverlay,
  setShowWeatherOverlay,
  selectedWeatherMetric,
  setSelectedWeatherMetric,
  getRiskCategoryColor,
  currentSensitivitySettings
}: RiskAnalyticsControlsProps) => {
  return (
    <div className="p-3 bg-muted/20 rounded-lg border">
      {/* First Row: View Mode, Categories, and Trends */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
        {/* Left side: View Mode & Categories */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">Mode:</span>
            <Button
              variant={showAggregate ? "default" : "outline"}
              size="sm"
              onClick={() => setShowAggregate(!showAggregate)}
              className="h-6 px-2 text-xs"
            >
              <BarChart className="h-3 w-3 mr-1" />
              {showAggregate ? 'Agg' : 'Ind'}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">Categories:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(category => {
                const settingKey = `category${category}` as keyof typeof currentSensitivitySettings;
                const settingValue = currentSensitivitySettings[settingKey];
                const sensitivityLevel = (typeof settingValue === 'string' && 
                  (settingValue === 'low' || settingValue === 'medium' || settingValue === 'high')) 
                  ? settingValue : 'medium';
                
                return (
                  <Button
                    key={category}
                    variant={visibleCategories[category] ? "default" : "outline"}
                    size="sm"
                    onClick={() => setVisibleCategories((prev: Record<number, boolean>) => ({ ...prev, [category]: !prev[category] }))}
                    className="h-6 w-8 px-1 text-xs"
                    style={{
                      backgroundColor: visibleCategories[category] ? getRiskCategoryColor(category, sensitivityLevel) : 'transparent',
                      borderColor: getRiskCategoryColor(category, sensitivityLevel),
                      color: visibleCategories[category] ? 'white' : getRiskCategoryColor(category, sensitivityLevel)
                    }}
                  >
                    {category}
                  </Button>
                );
              })}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const allVisible = Object.values(visibleCategories).every(v => v);
                  const newState = allVisible ? 
                    { 1: false, 2: false, 3: false, 4: false, 5: false } :
                    { 1: true, 2: true, 3: true, 4: true, 5: true };
                  setVisibleCategories(newState);
                }}
                className="h-6 px-2 text-xs"
              >
                {Object.values(visibleCategories).every(v => v) ? 'None' : 'All'}
              </Button>
            </div>
          </div>
        </div>

        {/* Right side: Trends */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">Trends:</span>
          <Button
            variant={showMeanTrend ? "default" : "outline"}
            size="sm"
            onClick={() => setShowMeanTrend(!showMeanTrend)}
            className="h-6 px-2 text-xs"
          >
            <div className={`w-3 h-0.5 border-2 border-dashed mr-1 ${showMeanTrend ? 'border-white' : 'border-current'}`} />
            Avg
          </Button>
          
          <Button
            variant={showLinearTrend ? "default" : "outline"}
            size="sm"
            onClick={() => setShowLinearTrend(!showLinearTrend)}
            className="h-6 px-2 text-xs"
          >
            <div className={`w-3 h-0.5 border-2 border-dotted mr-1 ${showLinearTrend ? 'border-white' : 'border-current'}`} />
            Linear
          </Button>
        </div>
      </div>

      {/* Second Row: TrackSAFE Overlay Options (only if subscribed) */}
      {hasTrackSAFESubscription && (
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium">Overlays:</span>
            <div className="flex items-center gap-2">
              <Button
                variant={showTrackSAFEOverlay ? "default" : "outline"}
                size="sm"
                onClick={() => setShowTrackSAFEOverlay(!showTrackSAFEOverlay)}
                className="h-6 px-2 text-xs"
              >
                <Shield className="h-3 w-3 mr-1" />
                TrackSAFE
              </Button>
              
              <Button
                variant={showWeatherOverlay ? "default" : "outline"}
                size="sm"
                onClick={() => setShowWeatherOverlay(!showWeatherOverlay)}
                className="h-6 px-2 text-xs"
              >
                <Thermometer className="h-3 w-3 mr-1" />
                Weather
              </Button>

              {showWeatherOverlay && (
                <div className="flex items-center gap-1 ml-1">
                  <Button
                    variant={selectedWeatherMetric === 'temperature' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedWeatherMetric('temperature')}
                    className="h-6 w-8 px-1 text-xs"
                  >
                    <Thermometer className="h-3 w-3" />
                  </Button>
                  <Button
                    variant={selectedWeatherMetric === 'windSpeed' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedWeatherMetric('windSpeed')}
                    className="h-6 w-8 px-1 text-xs"
                  >
                    <Wind className="h-3 w-3" />
                  </Button>
                  <Button
                    variant={selectedWeatherMetric === 'precipitation' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedWeatherMetric('precipitation')}
                    className="h-6 w-8 px-1 text-xs"
                  >
                    <Cloud className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {(showTrackSAFEOverlay || showWeatherOverlay) && (
            <div className="text-xs text-muted-foreground italic">
              Powered by TrackSAFE
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RiskAnalyticsControls;
