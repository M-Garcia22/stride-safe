
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bell, TrendingUp, AlertTriangle, Activity, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PostRaceSensitivitySettings } from "./PostRaceSensitivitySettings";

interface AlertRule {
  id: string;
  name: string;
  type: 'threshold' | 'trend' | 'anomaly';
  category: number | 'all';
  threshold: number;
  enabled: boolean;
  severity: 'low' | 'medium' | 'high';
}

interface SmartAlert {
  id: string;
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
  category?: number;
  value?: number;
}

interface SmartAlertsProps {
  currentData: Array<{ category: number; percentage: number; count: number; sensitivityLevel?: 'low' | 'medium' | 'high' }>;
  historicalData: any[];
  sensitivitySettings?: PostRaceSensitivitySettings;
}

const SmartAlerts = ({ currentData, historicalData, sensitivitySettings }: SmartAlertsProps) => {
  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    { id: '1', name: 'Category 5 High Risk', type: 'threshold', category: 5, threshold: 5, enabled: true, severity: 'high' },
    { id: '2', name: 'Category 4 Spike', type: 'threshold', category: 4, threshold: 15, enabled: true, severity: 'medium' },
    { id: '3', name: 'Overall Risk Trend', type: 'trend', category: 'all', threshold: 10, enabled: true, severity: 'medium' },
  ]);
  const [showSettings, setShowSettings] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Generate smart alerts based on current data, rules, and sensitivity settings
  const activeAlerts = useMemo(() => {
    const alerts: SmartAlert[] = [];
    
    alertRules.forEach(rule => {
      if (!rule.enabled) return;
      
      if (rule.type === 'threshold' && rule.category !== 'all') {
        const categoryData = currentData.find(d => d.category === rule.category);
        if (categoryData) {
          // Adjust threshold based on sensitivity settings
          const sensitivityLevel = sensitivitySettings?.[`category${rule.category}` as keyof PostRaceSensitivitySettings] as 'low' | 'medium' | 'high';
          let adjustedThreshold = rule.threshold;
          
          if (sensitivityLevel === 'high') {
            adjustedThreshold = rule.threshold * 0.7; // Lower threshold for high sensitivity
          } else if (sensitivityLevel === 'low') {
            adjustedThreshold = rule.threshold * 1.3; // Higher threshold for low sensitivity
          }
          
          if (categoryData.percentage > adjustedThreshold) {
            alerts.push({
              id: `${rule.id}_${Date.now()}`,
              type: 'Threshold Alert',
              message: `Category ${rule.category} risk at ${categoryData.percentage.toFixed(1)}% (threshold: ${adjustedThreshold.toFixed(1)}%, sensitivity: ${sensitivityLevel || 'medium'})`,
              severity: sensitivityLevel === 'high' ? 'high' : rule.severity,
              timestamp: new Date(),
              category: rule.category,
              value: categoryData.percentage
            });
          }
        }
      }
      
      if (rule.type === 'trend' && historicalData.length > 1 && sensitivitySettings?.enableTrendAlerts) {
        const recent = historicalData.slice(-3);
        const trend = recent[recent.length - 1].cat5 - recent[0].cat5;
        const trendThreshold = sensitivitySettings?.trendAlertThreshold || rule.threshold;
        
        if (Math.abs(trend) > trendThreshold) {
          alerts.push({
            id: `${rule.id}_${Date.now()}`,
            type: 'Trend Alert',
            message: `Significant ${trend > 0 ? 'increase' : 'decrease'} in Category 5 risk over last 3 days (${Math.abs(trend).toFixed(1)}%, threshold: ${trendThreshold}%)`,
            severity: Math.abs(trend) > trendThreshold * 1.5 ? 'high' : 'medium',
            timestamp: new Date(),
            value: trend
          });
        }
      }
      
      if (rule.type === 'anomaly' && sensitivitySettings?.highlightAnomalies) {
        // Enhanced anomaly detection with sensitivity settings
        const cat5Values = historicalData.map(d => d.cat5);
        const mean = cat5Values.reduce((a, b) => a + b, 0) / cat5Values.length;
        const stdDev = Math.sqrt(cat5Values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / cat5Values.length);
        const currentCat5 = currentData.find(d => d.category === 5)?.percentage || 0;
        
        // Adjust anomaly detection sensitivity
        const sensitivityLevel = sensitivitySettings?.category5 || 'medium';
        const deviationMultiplier = sensitivityLevel === 'high' ? 1.5 : sensitivityLevel === 'medium' ? 2 : 2.5;
        
        if (Math.abs(currentCat5 - mean) > deviationMultiplier * stdDev) {
          alerts.push({
            id: `${rule.id}_${Date.now()}`,
            type: 'Anomaly Alert',
            message: `Unusual Category 5 pattern detected: ${currentCat5.toFixed(1)}% (expected: ${mean.toFixed(1)}±${(deviationMultiplier*stdDev).toFixed(1)}%, sensitivity: ${sensitivityLevel})`,
            severity: 'high',
            timestamp: new Date(),
            category: 5,
            value: currentCat5
          });
        }
      }
    });
    
    return alerts;
  }, [currentData, historicalData, alertRules, sensitivitySettings]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <TrendingUp className="h-4 w-4" />;
      case 'low': return <Activity className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const updateAlertRule = (id: string, updates: Partial<AlertRule>) => {
    setAlertRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, ...updates } : rule
    ));
  };

  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="px-4 py-3 pb-2">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 p-0 h-auto hover:bg-transparent">
                <Bell className="h-4 w-4 text-orange-600" />
                <CardTitle className="text-sm font-medium">Smart Alerts</CardTitle>
                {activeAlerts.length > 0 && (
                  <Badge variant="destructive" className="text-xs h-5 px-1.5">
                    {activeAlerts.length}
                  </Badge>
                )}
                {sensitivitySettings && (
                  <Badge variant="outline" className="text-xs h-5 px-1.5 bg-blue-50 text-blue-700">
                    Enhanced
                  </Badge>
                )}
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </CollapsibleTrigger>
            
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Alert Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {alertRules.map(rule => (
                    <div key={rule.id} className="p-3 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium text-sm">{rule.name}</Label>
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={(enabled) => updateAlertRule(rule.id, { enabled })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs text-muted-foreground">Threshold (%)</Label>
                          <Input
                            type="number"
                            value={rule.threshold}
                            onChange={(e) => updateAlertRule(rule.id, { threshold: Number(e.target.value) })}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Type</Label>
                          <Badge variant="outline" className="text-xs h-8 w-full justify-center">
                            {rule.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  {sensitivitySettings && (
                    <div className="p-3 border rounded-lg bg-blue-50">
                      <div className="text-xs font-medium text-blue-800 mb-2">Sensitivity Integration Active</div>
                      <div className="text-xs text-blue-600">
                        Alerts are automatically adjusted based on your sensitivity settings for categories 3-5.
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="px-4 py-3 pt-0">
            {activeAlerts.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-6 border border-dashed rounded-lg">
                <Bell className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                <p>No active alerts</p>
                <p className="text-xs mt-1">
                  System is monitoring for issues
                  {sensitivitySettings && ' with enhanced sensitivity'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeAlerts.map(alert => (
                  <Alert key={alert.id} className="p-3 border-l-4 border-l-orange-500">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getSeverityIcon(alert.severity)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{alert.type}</span>
                          <Badge variant={getSeverityColor(alert.severity) as any} className="text-xs h-5">
                            {alert.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <AlertDescription className="text-xs text-muted-foreground leading-relaxed">
                          {alert.message}
                        </AlertDescription>
                        <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <span>{alert.timestamp.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default SmartAlerts;
