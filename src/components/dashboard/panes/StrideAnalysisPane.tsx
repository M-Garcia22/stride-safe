
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { ArrowLeft, Activity, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface StrideAnalysisPaneProps {
  horseName: string;
  onBack: () => void;
}

// Sample stride data for the analysis
const strideData = [
  { time: 0, strideLength: 4.2, frequency: 2.1, power: 85, efficiency: 0.92 },
  { time: 10, strideLength: 4.3, frequency: 2.2, power: 88, efficiency: 0.94 },
  { time: 20, strideLength: 4.1, frequency: 2.3, power: 82, efficiency: 0.89 },
  { time: 30, strideLength: 4.0, frequency: 2.4, power: 79, efficiency: 0.87 },
  { time: 40, strideLength: 3.9, frequency: 2.5, power: 75, efficiency: 0.85 },
  { time: 50, strideLength: 3.8, frequency: 2.6, power: 72, efficiency: 0.83 },
  { time: 60, strideLength: 3.7, frequency: 2.7, power: 68, efficiency: 0.80 },
  { time: 70, strideLength: 3.6, frequency: 2.8, power: 65, efficiency: 0.78 },
  { time: 80, strideLength: 3.5, frequency: 2.9, power: 62, efficiency: 0.75 },
  { time: 90, strideLength: 3.4, frequency: 3.0, power: 58, efficiency: 0.72 },
];

const limbLoadData = [
  { limb: 'Left Front', load: 245, deviation: 12, status: 'normal' },
  { limb: 'Right Front', load: 238, deviation: 8, status: 'normal' },
  { limb: 'Left Hind', load: 198, deviation: 15, status: 'warning' },
  { limb: 'Right Hind', load: 205, deviation: 7, status: 'normal' },
];

const asymmetryData = [
  { parameter: 'Stride Length', leftRight: 2.3, frontHind: 1.8, threshold: 5.0, status: 'good' },
  { parameter: 'Contact Time', leftRight: 4.1, frontHind: 2.9, threshold: 5.0, status: 'good' },
  { parameter: 'Swing Time', leftRight: 6.2, frontHind: 3.4, threshold: 5.0, status: 'warning' },
  { parameter: 'Peak Force', leftRight: 8.1, frontHind: 4.2, threshold: 10.0, status: 'good' },
];

const chartConfig = {
  strideLength: { label: "Stride Length (m)", color: "#3b82f6" },
  frequency: { label: "Frequency (Hz)", color: "#10b981" },
  power: { label: "Power (%)", color: "#f59e0b" },
  efficiency: { label: "Efficiency", color: "#ef4444" },
};

const StrideAnalysisPane = ({ horseName, onBack }: StrideAnalysisPaneProps) => {
  const [selectedMetric, setSelectedMetric] = useState<string>("strideLength");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': case 'normal': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'alert': case 'critical': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good': case 'normal': return 'default';
      case 'warning': return 'secondary';
      case 'alert': case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Registry
        </Button>
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Stride Analysis: {horseName}</h1>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Stride Length</p>
                <p className="text-2xl font-bold">3.84m</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Frequency</p>
                <p className="text-2xl font-bold">2.55 Hz</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Power Output</p>
                <p className="text-2xl font-bold">72%</p>
              </div>
              <TrendingDown className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Efficiency</p>
                <p className="text-2xl font-bold">0.83</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="stride-dynamics" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stride-dynamics">Stride Dynamics</TabsTrigger>
          <TabsTrigger value="limb-loading">Limb Loading</TabsTrigger>
          <TabsTrigger value="asymmetry">Asymmetry Analysis</TabsTrigger>
          <TabsTrigger value="welfare-indicators">Welfare Indicators</TabsTrigger>
        </TabsList>

        <TabsContent value="stride-dynamics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stride Dynamics Over Race Duration</CardTitle>
              <div className="flex gap-2">
                {Object.entries(chartConfig).map(([key, config]) => (
                  <Button
                    key={key}
                    variant={selectedMetric === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMetric(key)}
                  >
                    {config.label}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={strideData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -10 }} />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey={selectedMetric} 
                      stroke={chartConfig[selectedMetric as keyof typeof chartConfig]?.color} 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comprehensive Stride Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={strideData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Area type="monotone" dataKey="strideLength" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="frequency" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limb-loading" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Limb Loading Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={limbLoadData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="limb" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="load" fill="#3b82f6" />
                    <Bar dataKey="deviation" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {limbLoadData.map((limb, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{limb.limb}</h3>
                    <Badge variant={getStatusBadge(limb.status)}>
                      {limb.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Load:</span>
                      <span className="font-medium">{limb.load} N</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Deviation:</span>
                      <span className="font-medium">{limb.deviation}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="asymmetry" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gait Asymmetry Analysis</CardTitle>
              <p className="text-sm text-gray-600">
                Values represent percentage deviation from normal symmetrical gait
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {asymmetryData.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{item.parameter}</h3>
                      <Badge variant={getStatusBadge(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Left-Right:</span>
                        <div className="font-medium">{item.leftRight}%</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Front-Hind:</span>
                        <div className="font-medium">{item.frontHind}%</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Threshold:</span>
                        <div className="font-medium">{item.threshold}%</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            Math.max(item.leftRight, item.frontHind) > item.threshold ? 'bg-red-500' : 
                            Math.max(item.leftRight, item.frontHind) > item.threshold * 0.7 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min((Math.max(item.leftRight, item.frontHind) / item.threshold) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="welfare-indicators" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Welfare Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span>Lameness Indicators</span>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-sm">Moderate Risk</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span>Fatigue Markers</span>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm">High Risk</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span>Biomechanical Stress</span>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm">Low Risk</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span>Recovery Indicators</span>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-sm">Moderate Risk</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Moderate Concern</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Left hind limb showing increased asymmetry. Recommend veterinary examination.
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Training Adjustment</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Consider reducing training intensity for next 3-5 days to allow recovery.
                  </p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-800">Positive Indicator</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Overall biomechanical efficiency within acceptable range.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StrideAnalysisPane;
