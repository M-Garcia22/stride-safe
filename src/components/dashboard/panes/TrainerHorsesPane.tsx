
import { TrainerDashboardPane } from "@/pages/TrainerDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { getWellnessColor, getFatigueColor } from "@/lib/colorUtils";
import { Report } from "@/types/report";
import { Horse } from "@/types/horse";

interface TrainerHorsesPaneProps {
  onPaneChange: (pane: TrainerDashboardPane) => void;
  onSelectHorse?: (horseName: string) => void;
  onSelectReport?: (report: Report) => void;
}

// Mock data for horses with their recent reports
const mockHorses: Horse[] = [
  {
    id: "1",
    name: "Midnight Approval",
    yearOfBirth: 2022,
    sex: "Colt",
    color: "Bay",
    wellnessScore: 88,
    performanceScore: 92,
    welfareAlert: true,
    sire: "Sire Name",
    dam: "Dam Name",
    paternalGrandfather: "PG Father",
    paternalGrandmother: "PG Mother",
    maternalGrandfather: "MG Father",
    maternalGrandmother: "MG Mother",
    trainer: "Dale Martinez",
    owner: "Owner Name",
    daysSinceLastReport: 3,
    sharedWithVets: ["vet1", "vet3"]
  },
  {
    id: "2",
    name: "Thunder Strike",
    yearOfBirth: 2021,
    sex: "Colt",
    color: "Chestnut",
    wellnessScore: 76,
    performanceScore: 84,
    welfareAlert: false,
    sire: "Thunder Sire",
    dam: "Strike Dam",
    paternalGrandfather: "Thunder PG Father",
    paternalGrandmother: "Thunder PG Mother",
    maternalGrandfather: "Strike MG Father",
    maternalGrandmother: "Strike MG Mother",
    trainer: "Dale Martinez",
    owner: "Owner Name",
    daysSinceLastReport: 1,
    sharedWithVets: ["vet2"]
  },
  {
    id: "3",
    name: "Golden Arrow",
    yearOfBirth: 2023,
    sex: "Filly",
    color: "Golden",
    wellnessScore: 94,
    performanceScore: 78,
    welfareAlert: true,
    sire: "Golden Sire",
    dam: "Arrow Dam",
    paternalGrandfather: "Golden PG Father",
    paternalGrandmother: "Golden PG Mother",
    maternalGrandfather: "Arrow MG Father",
    maternalGrandmother: "Arrow MG Mother",
    trainer: "Dale Martinez",
    owner: "Owner Name",
    daysSinceLastReport: 2,
    sharedWithVets: []
  },
  {
    id: "4",
    name: "Storm Chaser",
    yearOfBirth: 2022,
    sex: "Colt",
    color: "Dark Bay",
    wellnessScore: 65,
    performanceScore: 95,
    welfareAlert: false,
    sire: "Storm Sire",
    dam: "Chaser Dam",
    paternalGrandfather: "Storm PG Father",
    paternalGrandmother: "Storm PG Mother",
    maternalGrandfather: "Chaser MG Father",
    maternalGrandmother: "Chaser MG Mother",
    trainer: "Dale Martinez",
    owner: "Owner Name",
    daysSinceLastReport: 5,
    sharedWithVets: ["vet1"]
  }
];

// Mock recent reports for each horse
const mockRecentReports: { [horseName: string]: Report[] } = {
  "Midnight Approval": [
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
      date: "2024-02-10",
      track: "Santa Anita",
      raceNo: 5,
      distance: "7f",
      surface: "Dirt",
      welfareRiskCategory: 2,
      fatigueScore: 88,
      welfareAlert: false,
      isNew: false,
      horseName: "Midnight Approval",
      condylarFx: false,
      sesamoidFx: false,
      leftFront: false,
      rightFront: false,
      bothFront: false,
      hindLimb: false
    }
  ],
  "Thunder Strike": [
    {
      id: 3,
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
    }
  ],
  "Golden Arrow": [
    {
      id: 4,
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
  ],
  "Storm Chaser": [
    {
      id: 5,
      date: "2024-02-12",
      track: "Del Mar",
      raceNo: 2,
      distance: "6f",
      surface: "Dirt",
      welfareRiskCategory: 1,
      fatigueScore: 95,
      welfareAlert: false,
      isNew: false,
      horseName: "Storm Chaser",
      condylarFx: false,
      sesamoidFx: false,
      leftFront: false,
      rightFront: false,
      bothFront: false,
      hindLimb: false
    }
  ]
};

const TrainerHorsesPane = ({
  onPaneChange,
  onSelectHorse,
  onSelectReport
}: TrainerHorsesPaneProps) => {
  const handleHorseRowClick = (horse: Horse) => {
    const recentReports = mockRecentReports[horse.name] || [];
    const mostRecentReport = recentReports.length > 0 ? recentReports[0] : null;
    
    if (onSelectHorse) {
      onSelectHorse(horse.name);
    }
    if (onSelectReport && mostRecentReport) {
      onSelectReport(mostRecentReport);
    }
    onPaneChange("analytics");
  };

  const getRiskCategoryHistory = (horseName: string) => {
    const reports = mockRecentReports[horseName] || [];
    return reports.slice(0, 5).map(report => report.welfareRiskCategory);
  };

  const getMostRecentFatigue = (horseName: string) => {
    const reports = mockRecentReports[horseName] || [];
    return reports.length > 0 ? reports[0].fatigueScore : null;
  };

  const hasRecentAlert = (horseName: string) => {
    const reports = mockRecentReports[horseName] || [];
    return reports.length > 0 ? reports[0].welfareAlert : false;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-light text-foreground mb-2">My Horses</h1>
        <p className="text-lg text-muted-foreground">
          {mockHorses.length} horses currently in training
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">All Horses in Training</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-sm font-medium">Horse Name</TableHead>
                <TableHead className="text-sm font-medium">Born</TableHead>
                <TableHead className="text-sm font-medium">Risk History</TableHead>
                <TableHead className="text-sm font-medium">Recent Fatigue</TableHead>
                <TableHead className="text-sm font-medium">Risk Alert</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockHorses.map(horse => {
                const riskHistory = getRiskCategoryHistory(horse.name);
                const recentFatigue = getMostRecentFatigue(horse.name);
                const hasAlert = hasRecentAlert(horse.name);
                
                return (
                  <TableRow 
                    key={horse.id} 
                    className="hover:bg-blue-50/60 transition-colors duration-200 py-3 cursor-pointer" 
                    onClick={() => handleHorseRowClick(horse)}
                  >
                    <TableCell className="font-medium text-sm py-3">
                      <div>
                        <div className="font-semibold">{horse.name}</div>
                        <div className="text-xs text-muted-foreground">{horse.sex} • {horse.color}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm py-3">
                      {format(new Date(horse.yearOfBirth, 0, 1), 'yyyy')}
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex gap-1">
                        {riskHistory.map((category, index) => {
                          const riskColor = getWellnessColor(category * 25);
                          return (
                            <div
                              key={index}
                              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 bg-white shadow-sm"
                              style={{
                                borderColor: riskColor,
                                color: '#000'
                              }}
                            >
                              {category}
                            </div>
                          );
                        })}
                        {riskHistory.length === 0 && (
                          <span className="text-muted-foreground text-sm">No reports</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      {recentFatigue ? (
                        <div className="flex justify-center">
                          <div 
                            className="px-3 py-1 rounded-md flex items-center justify-center text-sm font-bold border-2 bg-white shadow-sm min-w-[50px]"
                            style={{
                              borderColor: getFatigueColor(recentFatigue),
                              color: '#000'
                            }}
                          >
                            {recentFatigue}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="py-3">
                      {hasAlert ? (
                        <Badge variant="destructive" className="text-xs">
                          Alert
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">None</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerHorsesPane;
