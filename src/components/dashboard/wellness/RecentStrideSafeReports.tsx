
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface StrideSafeReport {
  id: number;
  date: string;
  raceCourse: string;
  surface: string;
  distance: string;
  welfareStatus: 'good' | 'warning' | 'alert';
  riskCategory: number;
  alerts: string[];
}

interface RecentStrideSafeReportsProps {
  reports: StrideSafeReport[];
}

const RecentStrideSafeReports = ({ reports }: RecentStrideSafeReportsProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good':
        return <Badge className="bg-green-100 text-green-800">Good</Badge>;
      case 'warning':
        return <Badge className="bg-amber-100 text-amber-800">Warning</Badge>;
      case 'alert':
        return <Badge className="bg-red-100 text-red-800">Alert</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRiskCategoryColor = (category: number) => {
    if (category <= 2) return "bg-green-100 text-green-800";
    if (category <= 3) return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent StrideSAFE Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Race Course</TableHead>
                <TableHead>Surface</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk Cat</TableHead>
                <TableHead>Alerts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.slice(0, 5).map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">
                    {new Date(report.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{report.raceCourse}</TableCell>
                  <TableCell className="capitalize">{report.surface}</TableCell>
                  <TableCell>{report.distance}</TableCell>
                  <TableCell>{getStatusBadge(report.welfareStatus)}</TableCell>
                  <TableCell>
                    <Badge className={getRiskCategoryColor(report.riskCategory)}>
                      Cat {report.riskCategory}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {report.alerts.length > 0 ? (
                      <div className="flex gap-1">
                        {report.alerts.map((alert, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {alert}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">None</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentStrideSafeReports;
