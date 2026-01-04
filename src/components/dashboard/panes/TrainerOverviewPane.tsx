
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { format } from "date-fns";
import { getWellnessColor, getFatigueColor } from "@/lib/colorUtils";
import { Report } from "@/types/report";
import { TrainerPaneProps } from "@/types/dashboard";
import { useAuth } from "@/hooks/useAuth";
import { useReports } from "@/hooks/useReports";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const TrainerOverviewPane = ({
  onPaneChange,
  onSelectHorse,
  onSelectReport
}: TrainerPaneProps) => {
  const { user } = useAuth();
  const { reports, loading, error, newReportsCount, refetch } = useReports({ days: 7 });
  const firstName = user?.name?.split(' ')[0] || 'Trainer';

  const handleReportRowClick = (report: Report) => {
    if (onSelectHorse) {
      onSelectHorse(report.horseName);
    }
    if (onSelectReport) {
      onSelectReport(report);
    }
    onPaneChange("analytics");
  };
  
  if (loading) {
    return <LoadingSpinner message="Loading reports..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <div>
            <p className="font-medium text-foreground">Failed to load reports</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
          <Button onClick={refetch} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-light text-foreground mb-2">Hello {firstName}!</h1>
        <p className="text-lg text-muted-foreground">
          {newReportsCount > 0 
            ? `You have ${newReportsCount} new Report${newReportsCount !== 1 ? 's' : ''} to view`
            : 'No new reports in the past 7 days'}
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">Reports from the past 7 days</CardTitle>
          <Button onClick={refetch} variant="ghost" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No reports available for the past 7 days.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-sm font-medium">Date</TableHead>
                  <TableHead className="text-sm font-medium">Horse</TableHead>
                  <TableHead className="text-sm font-medium">Track</TableHead>
                  <TableHead className="text-sm font-medium">Race</TableHead>
                  <TableHead className="text-sm font-medium">Distance</TableHead>
                  <TableHead className="text-sm font-medium">Risk Category</TableHead>
                  <TableHead className="text-sm font-medium">Fatigue Score</TableHead>
                  <TableHead className="text-sm font-medium">Welfare Alert</TableHead>
                  <TableHead className="text-sm font-medium">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map(report => {
                  const riskCategoryColor = getWellnessColor(report.welfareRiskCategory * 25);
                  const fatigueColor = getFatigueColor(report.fatigueScore);
                  return (
                    <TableRow 
                      key={report.id} 
                      className="hover:bg-blue-50/60 transition-colors duration-200 py-3 cursor-pointer" 
                      onClick={() => handleReportRowClick(report)}
                    >
                      <TableCell className="font-medium text-sm py-3">
                        {format(new Date(report.date), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-sm py-3 font-medium">{report.horseName}</TableCell>
                      <TableCell className="text-sm py-3">{report.track}</TableCell>
                      <TableCell className="text-sm py-3">R{report.raceNo}</TableCell>
                      <TableCell className="text-sm py-3">{report.distance}</TableCell>
                      <TableCell className="py-3">
                        <div className="flex justify-center">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 bg-white shadow-sm" 
                            style={{
                              borderColor: riskCategoryColor,
                              color: '#000'
                            }}
                          >
                            {report.welfareRiskCategory}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex justify-center">
                          <div 
                            className="px-3 py-1 rounded-md flex items-center justify-center text-sm font-bold border-2 bg-white shadow-sm min-w-[50px]" 
                            style={{
                              borderColor: fatigueColor,
                              color: '#000'
                            }}
                          >
                            {report.fatigueScore}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        {report.welfareAlert ? (
                          <Badge variant="destructive" className="text-xs">
                            Alert
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">None</span>
                        )}
                      </TableCell>
                      <TableCell className="py-3">
                        {report.isNew ? (
                          <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                            New
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">Viewed</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerOverviewPane;
