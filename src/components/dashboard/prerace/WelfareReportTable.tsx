
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import WelfareStatusIndicator from "./WelfareStatusIndicator";
import StrideAnalysisGraphs from "./StrideAnalysisGraphs";
import { WelfareReport } from "../../../data/preRaceData";
import { useState } from "react";

interface WelfareReportTableProps {
  reports: WelfareReport[];
  horseName?: string;
  birthMonth?: string;
  yearOfBirth?: number;
  sex?: string;
  color?: string;
}

const WelfareReportTable = ({ 
  reports, 
  horseName = "Unknown Horse",
  birthMonth = "Unknown",
  yearOfBirth = 2023,
  sex = "Unknown",
  color = "Unknown"
}: WelfareReportTableProps) => {
  const [selectedReport, setSelectedReport] = useState<WelfareReport | null>(null);

  const getRiskCategoryColor = (category: 1 | 2 | 3 | 4 | 5) => {
    switch (category) {
      case 1:
        return 'bg-green-100 text-green-800 border-green-200';
      case 2:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 3:
        return 'bg-red-50 text-red-700 border-red-200';
      case 4:
        return 'bg-red-100 text-red-800 border-red-300';
      case 5:
        return 'bg-red-200 text-red-900 border-red-400';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertColor = (alert: string) => {
    if (alert.includes('Fx')) return 'bg-red-100 text-red-700';
    return 'bg-orange-100 text-orange-700';
  };

  const handleRowClick = (report: WelfareReport) => {
    setSelectedReport(selectedReport?.id === report.id ? null : report);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Date</TableHead>
              <TableHead className="text-xs">Race Course</TableHead>
              <TableHead className="text-xs">Surface</TableHead>
              <TableHead className="text-xs">Distance</TableHead>
              <TableHead className="text-xs">Report</TableHead>
              <TableHead className="text-xs">Risk</TableHead>
              <TableHead className="text-xs">Alerts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow 
                key={report.id}
                className={`cursor-pointer transition-colors ${
                  selectedReport?.id === report.id ? 'bg-muted' : 'hover:bg-muted/50'
                }`}
                onClick={() => handleRowClick(report)}
              >
                <TableCell className="text-xs py-2">
                  {new Date(report.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </TableCell>
                <TableCell className="text-xs py-2">{report.raceCourse}</TableCell>
                <TableCell className="text-xs py-2">{report.surface}</TableCell>
                <TableCell className="text-xs py-2">{report.distance}</TableCell>
                <TableCell className="text-xs py-2">
                  <WelfareStatusIndicator status={report.welfareStatus} size="sm" />
                </TableCell>
                <TableCell className="text-xs py-2">
                  <Badge className={getRiskCategoryColor(report.riskCategory)} variant="outline">
                    {report.riskCategory}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs py-2">
                  <div className="flex flex-wrap gap-1">
                    {report.alerts.map((alert, index) => (
                      <Badge key={index} className={getAlertColor(alert)} variant="outline">
                        {alert}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {reports.length === 0 && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            No welfare reports in the past 12 months
          </div>
        )}
      </div>

      {selectedReport && (
        <StrideAnalysisGraphs
          strideAnalysis={selectedReport.strideAnalysis}
          raceCourse={selectedReport.raceCourse}
          date={selectedReport.date}
          horseName={horseName}
          birthMonth={birthMonth}
          yearOfBirth={yearOfBirth}
          sex={sex}
          color={color}
          surface={selectedReport.surface}
          distance={selectedReport.distance}
          welfareStatus={selectedReport.welfareStatus}
          riskCategory={selectedReport.riskCategory.toString()}
          alerts={selectedReport.alerts}
        />
      )}
    </div>
  );
};

export default WelfareReportTable;
