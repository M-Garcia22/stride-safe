
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TrendingUp, BarChart3, AlertCircle, Target, Cloud, Thermometer, Wind } from "lucide-react";

interface AnalyticsData {
  category: number;
  values: number[];
  current: number;
}

interface EnhancedAnalyticsProps {
  data: AnalyticsData[];
  comparisonData?: AnalyticsData[];
  comparisonLabel?: string;
  hasTrackSAFESubscription?: boolean;
}

const EnhancedAnalytics = ({ 
  data, 
  comparisonData, 
  comparisonLabel = "Previous Period",
  hasTrackSAFESubscription = true // Assume track subscribes for now
}: EnhancedAnalyticsProps) => {
  
  const calculateCorrelation = (x: number[], y: number[]) => {
    const n = Math.min(x.length, y.length);
    if (n === 0) return 0;
    
    const xMean = x.slice(0, n).reduce((a, b) => a + b, 0) / n;
    const yMean = y.slice(0, n).reduce((a, b) => a + b, 0) / n;
    
    let numerator = 0;
    let xSumSq = 0;
    let ySumSq = 0;
    
    for (let i = 0; i < n; i++) {
      const xDiff = x[i] - xMean;
      const yDiff = y[i] - yMean;
      numerator += xDiff * yDiff;
      xSumSq += xDiff * xDiff;
      ySumSq += yDiff * yDiff;
    }
    
    const denominator = Math.sqrt(xSumSq * ySumSq);
    return denominator === 0 ? 0 : numerator / denominator;
  };

  // Generate mock TrackSAFE and weather data
  const generateTrackSAFEData = (length: number) => {
    const trackSAFEIndex = [];
    const temperature = [];
    const windSpeed = [];
    const precipitation = [];
    
    for (let i = 0; i < length; i++) {
      // Mock TrackSAFE index (1-100, higher is safer)
      trackSAFEIndex.push(Math.floor(Math.random() * 40) + 60); // 60-100 range for safer conditions
      
      // Mock weather data
      temperature.push(Math.floor(Math.random() * 30) + 60); // 60-90°F
      windSpeed.push(Math.floor(Math.random() * 15) + 5); // 5-20 mph
      precipitation.push(Math.random() * 0.5); // 0-0.5 inches
    }
    
    return { trackSAFEIndex, temperature, windSpeed, precipitation };
  };

  const analytics = useMemo(() => {
    const dataLength = data.length > 0 ? data[0].values.length : 0;
    const { trackSAFEIndex, temperature, windSpeed, precipitation } = generateTrackSAFEData(dataLength);
    
    return data.map(item => {
      const values = item.values;
      const n = values.length;
      
      if (n === 0) {
        return {
          category: item.category,
          current: item.current,
          mean: 0,
          stdDev: 0,
          zScore: 0,
          isSignificant: false,
          slope: 0,
          isAnomaly: false,
          correlations: [],
          trackSAFECorrelations: []
        };
      }
      
      // Statistical calculations
      const mean = values.reduce((a, b) => a + b, 0) / n;
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
      const stdDev = Math.sqrt(variance);
      
      // Statistical significance (z-score)
      const zScore = stdDev > 0 ? (item.current - mean) / stdDev : 0;
      const isSignificant = Math.abs(zScore) > 1.96; // 95% confidence
      
      // Trend analysis (linear regression)
      const xValues = values.map((_, i) => i);
      const xMean = xValues.reduce((a, b) => a + b, 0) / n;
      const yMean = mean;
      
      const numerator = xValues.reduce((sum, x, i) => {
        return sum + (x - xMean) * (values[i] - yMean);
      }, 0);
      const denominator = xValues.reduce((sum, x) => sum + Math.pow(x - xMean, 2), 0);
      
      const slope = denominator !== 0 ? numerator / denominator : 0;
      
      // Anomaly detection
      const isAnomaly = Math.abs(zScore) > 2.5; // 99% confidence
      
      // Correlation with other categories
      const otherCategories = data.filter(d => d.category !== item.category);
      const correlations = otherCategories.map(otherCategory => {
        const correlation = calculateCorrelation(values, otherCategory.values);
        return {
          category: otherCategory.category,
          correlation: correlation
        };
      }).filter(c => Math.abs(c.correlation) > 0.5);
      
      // TrackSAFE and weather correlations (only if subscribed)
      const trackSAFECorrelations = hasTrackSAFESubscription ? [
        {
          type: 'TrackSAFE Index',
          correlation: calculateCorrelation(values, trackSAFEIndex),
          icon: 'shield'
        },
        {
          type: 'Temperature',
          correlation: calculateCorrelation(values, temperature),
          icon: 'thermometer'
        },
        {
          type: 'Wind Speed',
          correlation: calculateCorrelation(values, windSpeed),
          icon: 'wind'
        },
        {
          type: 'Precipitation',
          correlation: calculateCorrelation(values, precipitation),
          icon: 'cloud'
        }
      ].filter(c => Math.abs(c.correlation) > 0.3) : []; // Lower threshold for environmental factors
      
      return {
        category: item.category,
        current: item.current,
        mean,
        stdDev,
        zScore,
        isSignificant,
        slope,
        isAnomaly,
        correlations,
        trackSAFECorrelations
      };
    });
  }, [data, hasTrackSAFESubscription]);

  const getSignificanceColor = (isSignificant: boolean, zScore: number) => {
    if (!isSignificant) return 'bg-gray-100 text-gray-600';
    return zScore > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700';
  };

  const getTrendIcon = (slope: number) => {
    if (Math.abs(slope) < 0.1) return <div className="w-4 h-0.5 bg-gray-400" />;
    return slope > 0 ? <TrendingUp className="h-4 w-4 text-red-500" /> : <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />;
  };

  const getCorrelationIcon = (type: string) => {
    switch (type) {
      case 'TrackSAFE Index':
        return <AlertCircle className="h-3 w-3" />;
      case 'Temperature':
        return <Thermometer className="h-3 w-3" />;
      case 'Wind Speed':
        return <Wind className="h-3 w-3" />;
      case 'Precipitation':
        return <Cloud className="h-3 w-3" />;
      default:
        return <BarChart3 className="h-3 w-3" />;
    }
  };

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Statistical Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.map(item => (
              <div key={item.category} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Category {item.category}</span>
                    {item.isAnomaly && (
                      <Tooltip>
                        <TooltipTrigger>
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Anomaly detected (z-score: {item.zScore.toFixed(2)})</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(item.slope)}
                    <Badge className={getSignificanceColor(item.isSignificant, item.zScore)}>
                      {item.isSignificant ? 'Significant' : 'Normal'}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-muted-foreground">Current</div>
                    <div className="font-medium">{item.current.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Mean ± σ</div>
                    <div className="font-medium">{item.mean.toFixed(1)} ± {item.stdDev.toFixed(1)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Z-Score</div>
                    <div className="font-medium">{item.zScore.toFixed(2)}</div>
                  </div>
                </div>
                
                {item.correlations.length > 0 && (
                  <div className="mt-2 pt-2 border-t">
                    <div className="text-xs text-muted-foreground mb-1">Category Correlations:</div>
                    <div className="flex gap-1 flex-wrap">
                      {item.correlations.map(corr => (
                        <Tooltip key={corr.category}>
                          <TooltipTrigger>
                            <Badge variant="outline" className="text-xs">
                              Cat {corr.category} ({corr.correlation > 0 ? '+' : ''}{(corr.correlation * 100).toFixed(0)}%)
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Correlation coefficient: {corr.correlation.toFixed(3)}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                )}

                {hasTrackSAFESubscription && item.trackSAFECorrelations.length > 0 && (
                  <div className="mt-2 pt-2 border-t">
                    <div className="text-xs text-muted-foreground mb-1">Environmental Correlations:</div>
                    <div className="flex gap-1 flex-wrap mb-1">
                      {item.trackSAFECorrelations.map(corr => (
                        <Tooltip key={corr.type}>
                          <TooltipTrigger>
                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                              {getCorrelationIcon(corr.type)}
                              {corr.type} ({corr.correlation > 0 ? '+' : ''}{(corr.correlation * 100).toFixed(0)}%)
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Correlation coefficient: {corr.correlation.toFixed(3)}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground italic">
                      Powered by TrackSAFE
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {comparisonData && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Comparison with {comparisonLabel}
                </div>
                <div className="grid grid-cols-5 gap-2 text-xs">
                  {data.map((current, index) => {
                    const comparison = comparisonData[index];
                    const change = comparison ? current.current - comparison.current : 0;
                    const changePercent = comparison && comparison.current > 0 ? (change / comparison.current) * 100 : 0;
                    
                    return (
                      <div key={current.category} className="text-center">
                        <div className="text-muted-foreground">Cat {current.category}</div>
                        <div className={`font-medium ${change > 0 ? 'text-red-600' : change < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                          {change > 0 ? '+' : ''}{change.toFixed(1)}%
                        </div>
                        <div className="text-muted-foreground">
                          ({changePercent > 0 ? '+' : ''}{changePercent.toFixed(0)}%)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default EnhancedAnalytics;
