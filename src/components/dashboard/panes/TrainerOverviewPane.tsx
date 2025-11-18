
import { TrainerDashboardPane } from "@/pages/TrainerDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { getWellnessColor, getFatigueColor } from "@/lib/colorUtils";
import { Report } from "@/types/report";

interface TrainerOverviewPaneProps {
  onPaneChange: (pane: TrainerDashboardPane) => void;
  onSelectHorse?: (horseName: string) => void;
  onSelectReport?: (report: Report) => void;
}

// Mock data for recent reports - in real app this would come from an API
const mockReports: Report[] = [
  {
    id: 1,
    date: "2024-02-17",
    track: "Del Mar",
    raceNo: 7,
    distance: "6f",
    surface: "Dirt",
    welfareRiskCategory: 3,
    fatigueScore: 92,
    welfareAlert: true,
    isNew: true,
    horseName: "Midnight Approval",
    condylarFx: true,
    sesamoidFx: false,
    leftFront: false,
    rightFront: true,
    bothFront: false,
    hindLimb: false
  },
  {
    id: 2,
    date: "2024-02-16",
    track: "Santa Anita",
    raceNo: 5,
    distance: "1m",
    surface: "Turf",
    welfareRiskCategory: 2,
    fatigueScore: 84,
    welfareAlert: false,
    isNew: false,
    horseName: "Thunder Strike",
    condylarFx: false,
    sesamoidFx: false,
    leftFront: false,
    rightFront: false,
    bothFront: false,
    hindLimb: false
  },
  {
    id: 3,
    date: "2024-02-15",
    track: "Hollywood Park",
    raceNo: 3,
    distance: "7f",
    surface: "Dirt",
    welfareRiskCategory: 4,
    fatigueScore: 78,
    welfareAlert: true,
    isNew: false,
    horseName: "Golden Arrow",
    condylarFx: false,
    sesamoidFx: true,
    leftFront: true,
    rightFront: false,
    bothFront: false,
    hindLimb: true
  }
];

const TrainerOverviewPane = ({
  onPaneChange,
  onSelectHorse,
  onSelectReport
}: TrainerOverviewPaneProps) => {
  const handleReportRowClick = (report: Report) => {
    if (onSelectHorse) {
      onSelectHorse(report.horseName);
    }
    if (onSelectReport) {
      onSelectReport(report);
    }
    onPaneChange("analytics");
  };
  
  const newReportsCount = mockReports.filter(report => report.isNew).length;
  
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-light text-foreground mb-2">Hello Dale!</h1>
        <p className="text-lg text-muted-foreground">
          You have {newReportsCount} new Report{newReportsCount !== 1 ? 's' : ''} to view
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">Reports from the past 7 days</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-sm font-medium">Date</TableHead>
                <TableHead className="text-sm font-medium">Horse</TableHead>
                <TableHead className="text-sm font-medium">Track</TableHead>
                <TableHead className="text-sm font-medium">Risk Category</TableHead>
                <TableHead className="text-sm font-medium">Fatigue Score</TableHead>
                <TableHead className="text-sm font-medium">Welfare Alert</TableHead>
                <TableHead className="text-sm font-medium">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockReports.map(report => {
              const riskCategoryColor = getWellnessColor(report.welfareRiskCategory * 25);
              const fatigueColor = getFatigueColor(report.fatigueScore);
              return <TableRow key={report.id} className="hover:bg-blue-50/60 transition-colors duration-200 py-3 cursor-pointer" onClick={() => handleReportRowClick(report)}>
                    <TableCell className="font-medium text-sm py-3">
                      {format(new Date(report.date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-sm py-3 font-medium">{report.horseName}</TableCell>
                    <TableCell className="text-sm py-3">{report.track}</TableCell>
                    <TableCell className="py-3">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 bg-white shadow-sm" style={{
                      borderColor: riskCategoryColor,
                      color: '#000'
                    }}>
                          {report.welfareRiskCategory}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex justify-center">
                        <div className="px-3 py-1 rounded-md flex items-center justify-center text-sm font-bold border-2 bg-white shadow-sm min-w-[50px]" style={{
                      borderColor: fatigueColor,
                      color: '#000'
                    }}>
                          {report.fatigueScore}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      {report.welfareAlert ? <Badge variant="destructive" className="text-xs">
                          Alert
                        </Badge> : <span className="text-muted-foreground text-sm">None</span>}
                    </TableCell>
                    <TableCell className="py-3">
                      {report.isNew ? <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                          New
                        </Badge> : <span className="text-muted-foreground text-sm">Viewed</span>}
                    </TableCell>
                  </TableRow>;
            })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerOverviewPane;
