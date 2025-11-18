
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Database, FileText, Table } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface DataExportOptionsProps {
  data: any[];
  onExport: (format: string, options: ExportOptions) => void;
}

export interface ExportOptions {
  format: 'csv' | 'pdf' | 'json' | 'api';
  dateRange: string;
  includeCharts: boolean;
  apiEndpoint?: string;
}

const DataExportOptions = ({ data, onExport }: DataExportOptionsProps) => {
  const { toast } = useToast();
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    dateRange: 'current',
    includeCharts: false
  });

  const handleExport = async () => {
    try {
      await onExport(exportOptions.format, exportOptions);
      toast({
        title: "Export Started",
        description: `${exportOptions.format.toUpperCase()} export has been initiated`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data",
        variant: "destructive",
      });
    }
  };

  const handleQuickExport = async (format: 'csv' | 'pdf' | 'json') => {
    try {
      await onExport(format, { ...exportOptions, format });
      toast({
        title: "Quick Export",
        description: `Data exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error with the quick export",
        variant: "destructive",
      });
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'csv': return <Table className="h-4 w-4" />;
      case 'pdf': return <FileText className="h-4 w-4" />;
      case 'json': return <Database className="h-4 w-4" />;
      default: return <Download className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Data Export Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Export Buttons */}
        <div>
          <Label className="text-sm font-medium">Quick Export</Label>
          <div className="flex gap-2 mt-2" role="group" aria-label="Quick export options">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickExport('csv')}
              className="flex items-center gap-2"
              aria-label="Export data as CSV file"
            >
              <Table className="h-4 w-4" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickExport('pdf')}
              className="flex items-center gap-2"
              aria-label="Export data as PDF document"
            >
              <FileText className="h-4 w-4" />
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickExport('json')}
              className="flex items-center gap-2"
              aria-label="Export data as JSON file"
            >
              <Database className="h-4 w-4" />
              JSON
            </Button>
          </div>
        </div>

        {/* Advanced Export Options */}
        <div className="border-t pt-4">
          <Label className="text-sm font-medium">Advanced Export</Label>
          
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <Label htmlFor="export-format">Format</Label>
              <Select 
                value={exportOptions.format} 
                onValueChange={(value: 'csv' | 'pdf' | 'json' | 'api') => 
                  setExportOptions(prev => ({ ...prev, format: value }))
                }
              >
                <SelectTrigger id="export-format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="json">JSON Data</SelectItem>
                  <SelectItem value="api">API Endpoint</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date-range">Date Range</Label>
              <Select 
                value={exportOptions.dateRange} 
                onValueChange={(value) => 
                  setExportOptions(prev => ({ ...prev, dateRange: value }))
                }
              >
                <SelectTrigger id="date-range">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current View</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                  <SelectItem value="all">All Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {exportOptions.format === 'api' && (
            <div className="mt-3">
              <Label htmlFor="api-endpoint">API Endpoint URL</Label>
              <Input
                id="api-endpoint"
                value={exportOptions.apiEndpoint || ''}
                onChange={(e) => setExportOptions(prev => ({ ...prev, apiEndpoint: e.target.value }))}
                placeholder="https://your-api.com/endpoint"
                aria-describedby="api-endpoint-desc"
              />
              <span id="api-endpoint-desc" className="text-xs text-muted-foreground mt-1 block">
                Data will be sent via POST request to this endpoint
              </span>
            </div>
          )}

          <div className="flex justify-between items-center mt-4">
            <Badge variant="outline" className="text-xs">
              {data.length} records available
            </Badge>
            
            <Button 
              onClick={handleExport}
              className="flex items-center gap-2"
              disabled={exportOptions.format === 'api' && !exportOptions.apiEndpoint}
              aria-describedby="export-btn-desc"
            >
              {getFormatIcon(exportOptions.format)}
              Export {exportOptions.format.toUpperCase()}
            </Button>
            <span id="export-btn-desc" className="sr-only">
              Export data in the selected format with chosen options
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataExportOptions;
