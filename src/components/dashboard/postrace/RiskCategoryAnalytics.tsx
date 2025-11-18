import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BarChart3, Info, BarChart, Maximize, Calendar, Activity, FileText, Download, Settings } from "lucide-react";
import { PostRaceHorse } from "../../../data/postRaceData";
import CustomDateRangePicker from "./CustomDateRangePicker";
import RiskHeatmapView from "./RiskHeatmapView";
import SmartAlerts from "./SmartAlerts";
import EnhancedAnalytics from "./EnhancedAnalytics";
import PostRaceSensitivitySettings, { PostRaceSensitivitySettings as PostRaceSensitivitySettingsType } from "./PostRaceSensitivitySettings";
import RiskDistributionGrid from "./RiskDistributionGrid";
import RiskAnalyticsControls from "./RiskAnalyticsControls";
import RiskCategoryChart from "./RiskCategoryChart";
import RiskAnalyticsDialogs from "./RiskAnalyticsDialogs";
import { useMobileGestures } from "../../../hooks/useMobileGestures";
import { useToast } from "@/hooks/use-toast";

interface RiskCategoryAnalyticsProps {
  horses: PostRaceHorse[];
  isFullscreen?: boolean;
  sensitivitySettings?: PostRaceSensitivitySettingsType;
  onSensitivityChange?: (settings: PostRaceSensitivitySettingsType) => void;
}

type SurfaceFilter = 'all' | 'dirt' | 'turf' | 'synthetic';
type TimeFrame = '1week' | '2weeks' | '1month' | '3months' | '6months' | '12months';
type ViewMode = 'chart' | 'heatmap' | 'analytics';

const RiskCategoryAnalytics = ({ 
  horses, 
  isFullscreen = false,
  sensitivitySettings,
  onSensitivityChange
}: RiskCategoryAnalyticsProps) => {
  const { toast } = useToast();
  const [surfaceFilter, setSurfaceFilter] = useState<SurfaceFilter>('all');
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('1month');
  const [customStartDate, setCustomStartDate] = useState<Date>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [customEndDate, setCustomEndDate] = useState<Date>(new Date());
  const [useCustomRange, setUseCustomRange] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  const [visibleCategories, setVisibleCategories] = useState<Record<number, boolean>>({
    1: true, 2: true, 3: true, 4: true, 5: true
  });
  const [showMeanTrend, setShowMeanTrend] = useState(false);
  const [showLinearTrend, setShowLinearTrend] = useState(false);
  const [showAggregate, setShowAggregate] = useState(false);
  const [isFullscreenLocal, setIsFullscreenLocal] = useState(false);
  const [selectedDataPoint, setSelectedDataPoint] = useState<any>(null);
  
  // Dialog states for the new functionality
  const [showReportsDialog, setShowReportsDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showAutomationDialog, setShowAutomationDialog] = useState(false);
  const [showSensitivitySettings, setShowSensitivitySettings] = useState(false);
  
  // TrackSAFE overlay controls
  const [showTrackSAFEOverlay, setShowTrackSAFEOverlay] = useState(false);
  const [showWeatherOverlay, setShowWeatherOverlay] = useState(false);
  const [selectedWeatherMetric, setSelectedWeatherMetric] = useState<'temperature' | 'windSpeed' | 'precipitation'>('temperature');
  const hasTrackSAFESubscription = true; // Assume track subscribes

  // Default sensitivity settings
  const defaultSensitivitySettings: PostRaceSensitivitySettingsType = {
    category3: 'medium',
    category4: 'high',
    category5: 'high',
    trendAlertThreshold: 10,
    enableTrendAlerts: true,
    highlightAnomalies: true,
    showConfidenceIntervals: false
  };

  const currentSensitivitySettings = sensitivitySettings || defaultSensitivitySettings;

  // Mobile gesture handling
  const { elementRef, gestureState, resetGestures } = useMobileGestures({
    onPinchZoom: (scale) => {
      // Handle zoom on chart
      console.log('Zoom scale:', scale);
    },
    onSwipeLeft: () => {
      // Next timeframe
      const timeframes: TimeFrame[] = ['1week', '2weeks', '1month', '3months', '6months', '12months'];
      const currentIndex = timeframes.indexOf(timeFrame);
      if (currentIndex < timeframes.length - 1) {
        setTimeFrame(timeframes[currentIndex + 1]);
        toast({
          title: "Timeframe Changed",
          description: `Switched to ${timeframes[currentIndex + 1]}`,
        });
      }
    },
    onSwipeRight: () => {
      // Previous timeframe
      const timeframes: TimeFrame[] = ['1week', '2weeks', '1month', '3months', '6months', '12months'];
      const currentIndex = timeframes.indexOf(timeFrame);
      if (currentIndex > 0) {
        setTimeFrame(timeframes[currentIndex - 1]);
        toast({
          title: "Timeframe Changed",
          description: `Switched to ${timeframes[currentIndex - 1]}`,
        });
      }
    },
    onDoubleTap: () => {
      resetGestures();
      toast({
        title: "View Reset",
        description: "Chart view has been reset to default",
      });
    }
  });

  // Get baseline description based on timeframe
  const getBaselineDescription = () => {
    const today = new Date();
    const days = timeFrame === '1week' ? 7 : 
                 timeFrame === '2weeks' ? 14 :
                 timeFrame === '1month' ? 30 :
                 timeFrame === '3months' ? 90 :
                 timeFrame === '6months' ? 180 : 365;

    if (timeFrame === '1week') {
      const firstDay = new Date(today);
      firstDay.setDate(firstDay.getDate() - 6);
      return `vs ${firstDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} avg`;
    } else {
      const firstWeekStart = new Date(today);
      firstWeekStart.setDate(firstWeekStart.getDate() - (days - 1));
      const firstWeekEnd = new Date(firstWeekStart);
      firstWeekEnd.setDate(firstWeekEnd.getDate() + 6);
      return `vs ${firstWeekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}-${firstWeekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} avg`;
    }
  };

  // Filter horses by surface
  const filteredHorses = useMemo(() => {
    if (surfaceFilter === 'all') return horses;
    
    return horses.filter(horse => {
      const surface = horse.welfareReports[0]?.surface?.toLowerCase();
      return surface === surfaceFilter;
    });
  }, [horses, surfaceFilter]);

  // Generate TrackSAFE and weather data
  const generateTrackSAFEData = (length: number) => {
    const trackSAFEIndex = [];
    const temperature = [];
    const windSpeed = [];
    const precipitation = [];
    
    for (let i = 0; i < length; i++) {
      trackSAFEIndex.push(Math.floor(Math.random() * 40) + 60);
      temperature.push(Math.floor(Math.random() * 30) + 60);
      windSpeed.push(Math.floor(Math.random() * 15) + 5);
      precipitation.push(Math.random() * 0.5);
    }
    
    return { trackSAFEIndex, temperature, windSpeed, precipitation };
  };

  // Generate historical data for trend chart with sliding weekly averages
  const historicalData = useMemo(() => {
    const days = useCustomRange ? 
      Math.ceil((customEndDate.getTime() - customStartDate.getTime()) / (1000 * 60 * 60 * 24)) :
      timeFrame === '1week' ? 7 : 
      timeFrame === '2weeks' ? 14 :
      timeFrame === '1month' ? 30 :
      timeFrame === '3months' ? 90 :
      timeFrame === '6months' ? 180 : 365;

    const data = [];
    const startDate = useCustomRange ? customStartDate : new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000);
    
    const { trackSAFEIndex, temperature, windSpeed, precipitation } = generateTrackSAFEData(days);
    
    const dailyData = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const baseDistribution = surfaceFilter === 'dirt' ? 
        { cat1: 35, cat2: 30, cat3: 20, cat4: 12, cat5: 3 } :
        surfaceFilter === 'turf' ?
        { cat1: 40, cat2: 28, cat3: 18, cat4: 11, cat5: 3 } :
        surfaceFilter === 'synthetic' ?
        { cat1: 38, cat2: 32, cat3: 17, cat4: 10, cat5: 3 } :
        { cat1: 37, cat2: 30, cat3: 19, cat4: 11, cat5: 3 };

      const variation = 0.1;
      const entry = {
        date: date.toISOString().split('T')[0],
        displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dayIndex: i,
        cat1: Math.max(0, baseDistribution.cat1 + (Math.random() - 0.5) * variation * 100),
        cat2: Math.max(0, baseDistribution.cat2 + (Math.random() - 0.5) * variation * 100),
        cat3: Math.max(0, baseDistribution.cat3 + (Math.random() - 0.5) * variation * 100),
        cat4: Math.max(0, baseDistribution.cat4 + (Math.random() - 0.5) * variation * 100),
        cat5: Math.max(0, baseDistribution.cat5 + (Math.random() - 0.5) * variation * 100),
        trackSAFEIndex: trackSAFEIndex[i],
        temperature: temperature[i],
        windSpeed: windSpeed[i],
        precipitation: precipitation[i] * 100
      };
      
      dailyData.push(entry);
    }
    
    // Calculate sliding weekly means
    for (let i = 0; i < dailyData.length; i++) {
      const windowStart = Math.max(0, i - 6);
      const windowEnd = i + 1;
      const windowData = dailyData.slice(windowStart, windowEnd);
      
      if (windowData.length > 0) {
        dailyData[i].mean1 = windowData.reduce((sum, day) => sum + day.cat1, 0) / windowData.length;
        dailyData[i].mean2 = windowData.reduce((sum, day) => sum + day.cat2, 0) / windowData.length;
        dailyData[i].mean3 = windowData.reduce((sum, day) => sum + day.cat3, 0) / windowData.length;
        dailyData[i].mean4 = windowData.reduce((sum, day) => sum + day.cat4, 0) / windowData.length;
        dailyData[i].mean5 = windowData.reduce((sum, day) => sum + day.cat5, 0) / windowData.length;
      }
    }
    
    // Calculate aggregate data
    for (let i = 0; i < dailyData.length; i++) {
      const selectedCategories = Object.keys(visibleCategories).filter(key => visibleCategories[parseInt(key)]);
      
      dailyData[i].aggregate = selectedCategories.reduce((sum, catKey) => {
        const categoryNum = parseInt(catKey);
        return sum + (dailyData[i][`cat${categoryNum}` as keyof typeof dailyData[0]] as number);
      }, 0);
      
      dailyData[i].aggregateMean = selectedCategories.reduce((sum, catKey) => {
        const categoryNum = parseInt(catKey);
        return sum + (dailyData[i][`mean${categoryNum}` as keyof typeof dailyData[0]] as number);
      }, 0);
    }
    
    // Calculate linear trend lines
    if (showLinearTrend) {
      [1, 2, 3, 4, 5].forEach(category => {
        const categoryKey = `cat${category}` as keyof typeof dailyData[0];
        const trendKey = `trend${category}` as keyof typeof dailyData[0];
        
        const n = dailyData.length;
        const sumX = dailyData.reduce((sum, _, index) => sum + index, 0);
        const sumY = dailyData.reduce((sum, day) => sum + (day[categoryKey] as number), 0);
        const sumXY = dailyData.reduce((sum, day, index) => sum + index * (day[categoryKey] as number), 0);
        const sumXX = dailyData.reduce((sum, _, index) => sum + index * index, 0);
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        dailyData.forEach((day, index) => {
          (day as any)[trendKey] = slope * index + intercept;
        });
      });
      
      // Calculate aggregate trend line
      const n = dailyData.length;
      const sumX = dailyData.reduce((sum, _, index) => sum + index, 0);
      const sumY = dailyData.reduce((sum, day) => sum + day.aggregate, 0);
      const sumXY = dailyData.reduce((sum, day, index) => sum + index * day.aggregate, 0);
      const sumXX = dailyData.reduce((sum, _, index) => sum + index * index, 0);
      
      const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;
      
      dailyData.forEach((day, index) => {
        day.aggregateTrend = slope * index + intercept;
      });
    }
    
    return dailyData;
  }, [timeFrame, surfaceFilter, showLinearTrend, visibleCategories, useCustomRange, customStartDate, customEndDate]);

  // Calculate current day risk distribution with sensitivity enhancements
  const riskDistribution = useMemo(() => {
    const total = filteredHorses.length;
    const categories = [1, 2, 3, 4, 5].map(category => {
      const count = filteredHorses.filter(horse => 
        horse.welfareReports.some(report => report.riskCategory === category)
      ).length;
      
      const percentage = total > 0 ? ((count / total) * 100) : 0;
      // Fix: Properly type cast the sensitivity level
      const settingKey = `category${category}` as keyof PostRaceSensitivitySettingsType;
      const settingValue = currentSensitivitySettings[settingKey];
      const sensitivityLevel = (typeof settingValue === 'string' && 
        (settingValue === 'low' || settingValue === 'medium' || settingValue === 'high')) 
        ? settingValue : 'medium';
      
      return {
        category,
        count,
        percentage,
        sensitivityLevel,
        isHighlighted: sensitivityLevel === 'high' && percentage > (category === 5 ? 3 : category === 4 ? 12 : 20)
      };
    });
    
    return categories;
  }, [filteredHorses, currentSensitivitySettings]);

  // Calculate percentage changes vs baseline using sliding weekly averages
  const percentageChanges = useMemo(() => {
    if (!historicalData.length) return {};
    
    const baseline = historicalData[0];
    const current = historicalData[historicalData.length - 1];
    const changes: Record<number, number> = {};
    
    [1, 2, 3, 4, 5].forEach(category => {
      const baselineValue = baseline[`mean${category}` as keyof typeof baseline] as number;
      const currentValue = current[`mean${category}` as keyof typeof current] as number;
      
      if (baselineValue > 0) {
        changes[category] = ((currentValue - baselineValue) / baselineValue) * 100;
      } else {
        changes[category] = 0;
      }
    });
    
    return changes;
  }, [historicalData]);

  // Prepare data for enhanced analytics
  const analyticsData = useMemo(() => {
    return [1, 2, 3, 4, 5].map(category => ({
      category,
      values: historicalData.map(d => d[`cat${category}` as keyof typeof d] as number),
      current: riskDistribution.find(r => r.category === category)?.percentage || 0
    }));
  }, [historicalData, riskDistribution]);

  // Prepare heatmap data
  const heatmapData = useMemo(() => {
    return historicalData.map(day => ({
      date: new Date(day.date),
      riskScore: (day.cat4 + day.cat5 * 2) / 3,
      category5Count: Math.round((day.cat5 / 100) * filteredHorses.length),
      totalHorses: filteredHorses.length
    }));
  }, [historicalData, filteredHorses.length]);

  const getRiskCategoryColor = (category: number, sensitivityLevel?: 'low' | 'medium' | 'high') => {
    const baseColors = {
      1: '#059669',
      2: '#65a30d',
      3: '#d97706',
      4: '#ea580c',
      5: '#dc2626'
    };
    
    const baseColor = baseColors[category as keyof typeof baseColors];
    
    // Enhance color intensity based on sensitivity
    if (sensitivityLevel === 'high') {
      return baseColor; // Full intensity
    } else if (sensitivityLevel === 'medium') {
      return baseColor + 'CC'; // 80% opacity
    } else {
      return baseColor + '99'; // 60% opacity
    }
  };

  const handleCustomReportGenerate = (config: any) => {
    console.log('Generating custom report:', config);
    toast({
      title: "Report Generated",
      description: `Custom report "${config.name}" has been created`,
    });
    setShowReportsDialog(false);
  };

  const handleDataExport = async (format: string, options: any) => {
    console.log('Exporting data:', format, options);
    // Simulate export process
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  };

  const handleScheduleReport = (config: any) => {
    console.log('Scheduling report:', config);
    toast({
      title: "Report Scheduled",
      description: `"${config.name}" will be sent ${config.frequency}`,
    });
    setShowAutomationDialog(false);
  };

  const handleCustomDateRange = (startDate: Date, endDate: Date) => {
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
    setUseCustomRange(true);
  };

  const handleDataPointClick = (data: any) => {
    setSelectedDataPoint(data);
  };

  const timeFrameLabels = {
    '1week': '1W',
    '2weeks': '2W', 
    '1month': '1M',
    '3months': '3M',
    '6months': '6M',
    '12months': '1Y'
  };

  const getWeatherMetricColor = () => {
    switch (selectedWeatherMetric) {
      case 'temperature': return '#dc2626';
      case 'windSpeed': return '#2563eb';
      case 'precipitation': return '#059669';
      default: return '#6b7280';
    }
  };

  const getWeatherMetricName = () => {
    switch (selectedWeatherMetric) {
      case 'temperature': return 'Temperature (°F)';
      case 'windSpeed': return 'Wind Speed (mph)';
      case 'precipitation': return 'Precipitation (inches)';
      default: return '';
    }
  };

  // Helper function to get sensitivity-based styling
  const getSensitivityStyling = (category: number, level: 'low' | 'medium' | 'high') => {
    const baseStyles = {
      strokeWidth: level === 'low' ? 2 : level === 'medium' ? 3 : 4,
      strokeOpacity: level === 'low' ? 0.7 : level === 'medium' ? 0.85 : 1,
      dotRadius: level === 'low' ? 2 : level === 'medium' ? 3 : 4,
      activeDotRadius: level === 'low' ? 4 : level === 'medium' ? 5 : 6
    };
    
    // Return base styles without className for consistency
    return baseStyles;
  };

  // Enhanced data highlighting based on sensitivity
  const getEnhancedDataPoint = (dataPoint: any, category: number) => {
    const settingKey = `category${category}` as keyof PostRaceSensitivitySettingsType;
    const settingValue = currentSensitivitySettings[settingKey];
    const sensitivityLevel = (typeof settingValue === 'string' && 
      (settingValue === 'low' || settingValue === 'medium' || settingValue === 'high')) 
      ? settingValue : 'medium';
    const value = dataPoint[`cat${category}`];
    
    // Apply highlighting based on sensitivity and anomaly detection
    if (currentSensitivitySettings.highlightAnomalies && sensitivityLevel === 'high') {
      const threshold = category === 5 ? 5 : category === 4 ? 15 : 25;
      if (value > threshold) {
        return {
          ...dataPoint,
          [`cat${category}Highlighted`]: true,
          [`cat${category}AnomalyLevel`]: value > threshold * 1.5 ? 'critical' : 'warning'
        };
      }
    }
    
    return dataPoint;
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Smart Alerts with sensitivity settings - Only show if NOT in fullscreen mode */}
        {!isFullscreen && (
          <SmartAlerts 
            currentData={riskDistribution}
            historicalData={historicalData}
            sensitivitySettings={currentSensitivitySettings}
          />
        )}

        <Card className="w-full" ref={elementRef}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-forest-600" />
                <CardTitle className="text-lg">Risk Category Analytics</CardTitle>
                <Badge variant="outline" className={`${surfaceFilter === 'dirt' ? 'bg-amber-100 text-amber-800' : 
                  surfaceFilter === 'turf' ? 'bg-green-100 text-green-800' : 
                  surfaceFilter === 'synthetic' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                  {filteredHorses.length} horses
                </Badge>
                {hasTrackSAFESubscription && (showTrackSAFEOverlay || showWeatherOverlay) && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 text-xs">
                    Powered by TrackSAFE
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* Sensitivity Settings Button */}
                {onSensitivityChange && (
                  <PostRaceSensitivitySettings
                    settings={currentSensitivitySettings}
                    onSettingsChange={onSensitivityChange}
                    isOpen={showSensitivitySettings}
                    onToggle={() => setShowSensitivitySettings(!showSensitivitySettings)}
                  />
                )}
                
                {/* Function buttons moved to header */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReportsDialog(true)}
                  className="h-8 px-3 text-xs"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  Reports
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExportDialog(true)}
                  className="h-8 px-3 text-xs"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAutomationDialog(true)}
                  className="h-8 px-3 text-xs"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Automation
                </Button>
                
                {/* Surface filters */}
                <div className="flex items-center gap-1">
                  {(['all', 'dirt', 'turf', 'synthetic'] as SurfaceFilter[]).map((surface) => (
                    <Button
                      key={surface}
                      variant={surfaceFilter === surface ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSurfaceFilter(surface)}
                      className="h-7 px-2 text-xs"
                    >
                      {surface === 'all' ? 'All' : surface.charAt(0).toUpperCase() + surface.slice(1)}
                    </Button>
                  ))}
                </div>
                {!isFullscreen && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFullscreenLocal(true)}
                    className="h-8 w-8 p-0"
                    aria-label="Open fullscreen view"
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Simplified View Mode Toggle - removed reports, export, automation */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">View:</span>
                  <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as ViewMode)}>
                    <ToggleGroupItem value="chart" className="h-7 px-2 text-xs">
                      <BarChart className="h-3 w-3 mr-1" />
                      Chart
                    </ToggleGroupItem>
                    <ToggleGroupItem value="heatmap" className="h-7 px-2 text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      Heatmap
                    </ToggleGroupItem>
                    <ToggleGroupItem value="analytics" className="h-7 px-2 text-xs">
                      <Activity className="h-3 w-3 mr-1" />
                      Analytics
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>

              {/* Time frame controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {(Object.keys(timeFrameLabels) as TimeFrame[]).map((frame) => (
                    <Button
                      key={frame}
                      variant={timeFrame === frame && !useCustomRange ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setTimeFrame(frame);
                        setUseCustomRange(false);
                      }}
                      className="h-7 px-2 text-xs"
                    >
                      {timeFrameLabels[frame]}
                    </Button>
                  ))}
                </div>
                <CustomDateRangePicker
                  startDate={customStartDate}
                  endDate={customEndDate}
                  onDateRangeChange={handleCustomDateRange}
                />
              </div>
            </div>

            {/* Mobile gesture instructions */}
            <div className="md:hidden">
              <div className="text-xs text-muted-foreground p-2 bg-muted/20 rounded border">
                📱 Swipe left/right to change timeframes • Pinch to zoom • Double-tap to reset
              </div>
            </div>

            {/* Content based on view mode */}
            {viewMode === 'chart' && (
              <>
                {/* Collapsible Today's Distribution with sensitivity enhancements */}
                <Accordion type="single" defaultValue="distribution" collapsible>
                  <AccordionItem value="distribution" className="border rounded-lg">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium">Today's Distribution</h4>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <RiskDistributionGrid
                        riskDistribution={riskDistribution}
                        percentageChanges={percentageChanges}
                        onDataPointClick={handleDataPointClick}
                        getBaselineDescription={getBaselineDescription}
                        sensitivitySettings={currentSensitivitySettings}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Chart with sensitivity-enhanced rendering */}
                <RiskCategoryChart
                  historicalData={historicalData}
                  showAggregate={showAggregate}
                  showMeanTrend={showMeanTrend}
                  showLinearTrend={showLinearTrend}
                  visibleCategories={visibleCategories}
                  showTrackSAFEOverlay={showTrackSAFEOverlay}
                  showWeatherOverlay={showWeatherOverlay}
                  selectedWeatherMetric={selectedWeatherMetric}
                  getRiskCategoryColor={getRiskCategoryColor}
                  getSensitivityStyling={getSensitivityStyling}
                  currentSensitivitySettings={currentSensitivitySettings}
                  onDataPointClick={handleDataPointClick}
                  getWeatherMetricColor={getWeatherMetricColor}
                  getWeatherMetricName={getWeatherMetricName}
                />
              </>
            )}

            {viewMode === 'heatmap' && (
              <RiskHeatmapView 
                data={heatmapData}
                startDate={useCustomRange ? customStartDate : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
                endDate={useCustomRange ? customEndDate : new Date()}
              />
            )}

            {viewMode === 'analytics' && (
              <EnhancedAnalytics 
                data={analyticsData}
                comparisonData={undefined}
                comparisonLabel={'Previous Period'}
              />
            )}
          </CardContent>
        </Card>

        {/* Dialog boxes for Reports, Export, and Automation */}
        <RiskAnalyticsDialogs
          showReportsDialog={showReportsDialog}
          setShowReportsDialog={setShowReportsDialog}
          showExportDialog={showExportDialog}
          setShowExportDialog={setShowExportDialog}
          showAutomationDialog={showAutomationDialog}
          setShowAutomationDialog={setShowAutomationDialog}
          selectedDataPoint={selectedDataPoint}
          setSelectedDataPoint={setSelectedDataPoint}
          isFullscreenLocal={isFullscreenLocal}
          setIsFullscreenLocal={setIsFullscreenLocal}
          horses={horses}
          historicalData={historicalData}
          onCustomReportGenerate={handleCustomReportGenerate}
          onDataExport={handleDataExport}
          onScheduleReport={handleScheduleReport}
          RiskCategoryAnalyticsComponent={RiskCategoryAnalytics}
        />
      </div>
    </TooltipProvider>
  );
};

export default RiskCategoryAnalytics;
