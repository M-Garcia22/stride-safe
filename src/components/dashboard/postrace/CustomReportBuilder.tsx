
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Plus, X } from "lucide-react";

export interface CustomReportBuilderProps {
  onGenerateReport: (config: ReportConfig) => void;
}

export interface ReportConfig {
  name: string;
  description: string;
  metrics: string[];
  timeframe: string;
  surfaces: string[];
  riskCategories: number[];
  format: 'pdf' | 'csv' | 'json';
}

const CustomReportBuilder = ({ onGenerateReport }: CustomReportBuilderProps) => {
  const [config, setConfig] = useState<ReportConfig>({
    name: '',
    description: '',
    metrics: [],
    timeframe: '1month',
    surfaces: ['all'],
    riskCategories: [1, 2, 3, 4, 5],
    format: 'pdf'
  });

  const availableMetrics = [
    'Risk Distribution',
    'Trend Analysis',
    'Category Changes',
    'Horse Count by Category',
    'Surface Comparison',
    'Time Series Data',
    'Statistical Summary',
    'Welfare Alerts'
  ];

  const handleMetricToggle = (metric: string) => {
    setConfig(prev => ({
      ...prev,
      metrics: prev.metrics.includes(metric)
        ? prev.metrics.filter(m => m !== metric)
        : [...prev.metrics, metric]
    }));
  };

  const handleRiskCategoryToggle = (category: number) => {
    setConfig(prev => ({
      ...prev,
      riskCategories: prev.riskCategories.includes(category)
        ? prev.riskCategories.filter(c => c !== category)
        : [...prev.riskCategories, category]
    }));
  };

  const handleGenerate = () => {
    if (config.name && config.metrics.length > 0) {
      onGenerateReport(config);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Custom Report Builder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="report-name">Report Name</Label>
            <Input
              id="report-name"
              value={config.name}
              onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter report name"
              aria-describedby="report-name-desc"
            />
            <span id="report-name-desc" className="sr-only">
              Enter a descriptive name for your custom report
            </span>
          </div>
          
          <div>
            <Label htmlFor="timeframe">Time Frame</Label>
            <Select value={config.timeframe} onValueChange={(value) => setConfig(prev => ({ ...prev, timeframe: value }))}>
              <SelectTrigger id="timeframe" aria-describedby="timeframe-desc">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1week">1 Week</SelectItem>
                <SelectItem value="2weeks">2 Weeks</SelectItem>
                <SelectItem value="1month">1 Month</SelectItem>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="12months">1 Year</SelectItem>
              </SelectContent>
            </Select>
            <span id="timeframe-desc" className="sr-only">
              Select the time period for the report data
            </span>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={config.description}
            onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the purpose of this report"
            rows={2}
            aria-describedby="description-desc"
          />
          <span id="description-desc" className="sr-only">
            Optional description explaining the purpose and context of the report
          </span>
        </div>

        <div>
          <Label>Metrics to Include</Label>
          <div className="grid grid-cols-2 gap-2 mt-2" role="group" aria-labelledby="metrics-label">
            <span id="metrics-label" className="sr-only">Select metrics to include in the report</span>
            {availableMetrics.map(metric => (
              <div key={metric} className="flex items-center space-x-2">
                <Checkbox
                  id={`metric-${metric}`}
                  checked={config.metrics.includes(metric)}
                  onCheckedChange={() => handleMetricToggle(metric)}
                  aria-describedby={`metric-${metric}-desc`}
                />
                <Label 
                  htmlFor={`metric-${metric}`} 
                  className="text-sm cursor-pointer"
                >
                  {metric}
                </Label>
                <span id={`metric-${metric}-desc`} className="sr-only">
                  Include {metric} data in the report
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Risk Categories</Label>
          <div className="flex gap-2 mt-2" role="group" aria-labelledby="risk-categories-label">
            <span id="risk-categories-label" className="sr-only">Select risk categories to include</span>
            {[1, 2, 3, 4, 5].map(category => (
              <Badge
                key={category}
                variant={config.riskCategories.includes(category) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleRiskCategoryToggle(category)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleRiskCategoryToggle(category);
                  }
                }}
                aria-pressed={config.riskCategories.includes(category)}
                aria-label={`Toggle risk category ${category}`}
              >
                Cat {category}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <Label htmlFor="format">Export Format</Label>
            <Select value={config.format} onValueChange={(value: 'pdf' | 'csv' | 'json') => setConfig(prev => ({ ...prev, format: value }))}>
              <SelectTrigger className="w-32" id="format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleGenerate}
            disabled={!config.name || config.metrics.length === 0}
            className="flex items-center gap-2"
            aria-describedby="generate-btn-desc"
          >
            <Plus className="h-4 w-4" />
            Generate Report
          </Button>
          <span id="generate-btn-desc" className="sr-only">
            Generate a custom report with the selected configuration
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomReportBuilder;
