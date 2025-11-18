
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PostRaceWelfareReport } from "../../../data/postRaceData";

interface PostRaceWelfareTableProps {
  reports: PostRaceWelfareReport[];
}

const PostRaceWelfareTable = ({ reports }: PostRaceWelfareTableProps) => {
  if (!reports || reports.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No welfare reports available</p>
      </div>
    );
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'alert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskBadgeColor = (risk: number) => {
    switch (risk) {
      case 1:
        return 'bg-green-100 text-green-800 border-green-200';
      case 2:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 3:
      case 4:
      case 5:
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Race Course</TableHead>
            <TableHead>Surface</TableHead>
            <TableHead>Distance</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Alerts</TableHead>
            <TableHead>Risk</TableHead>
            <TableHead>Analysis Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>
                {new Date(report.date).toLocaleDateString()}
              </TableCell>
              <TableCell>{report.raceCourse}</TableCell>
              <TableCell className="capitalize">{report.surface}</TableCell>
              <TableCell>{report.distance}</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeColor(report.welfareStatus)}>
                  {report.welfareStatus}
                </Badge>
              </TableCell>
              <TableCell>
                {report.alerts.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {report.alerts.map((alert, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {alert}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground">None</span>
                )}
              </TableCell>
              <TableCell>
                <Badge className={getRiskBadgeColor(report.riskCategory)} variant="outline">
                  {report.riskCategory}
                </Badge>
              </TableCell>
              <TableCell>{report.analysisType}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Stride Analysis Summary */}
      {reports.length > 0 && reports[0].strideAnalysis && (
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3">Latest Stride Analysis</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">DV Straight:</span>
              <div className="font-medium">{reports[0].strideAnalysis.dvStraight}</div>
            </div>
            <div>
              <span className="text-muted-foreground">DV Turn:</span>
              <div className="font-medium">{reports[0].strideAnalysis.dvTurn}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Symmetry Index:</span>
              <div className="font-medium">{reports[0].strideAnalysis.symmetryIndex}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Stride Length:</span>
              <div className="font-medium">{reports[0].strideAnalysis.strideLength}m</div>
            </div>
            <div>
              <span className="text-muted-foreground">Stride Frequency:</span>
              <div className="font-medium">{reports[0].strideAnalysis.strideFrequency} Hz</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostRaceWelfareTable;
