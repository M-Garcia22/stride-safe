import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, AlertTriangle, Download, Eye } from "lucide-react";
import BlackBoxConfirmDialog from "../BlackBoxConfirmDialog";

// Mock horse data matching the structure from RacesPane
const mockHorses = {
  1: [
    { 
      post: 1, 
      name: "Thunder Strike", 
      jockey: "J. Rodriguez", 
      trainer: "M. Smith", 
      vet: "Dr. A. Johnson",
      odds: "3-1", 
      weight: 118,
      category: 2,
      welfareHistory: ['good', 'good', 'warning', 'good', 'good'] as const,
      welfareResult: 'good' as const,
      alerts: ['C-Fx', 'LF']
    },
    { 
      post: 2, 
      name: "Lightning Bolt", 
      jockey: "A. Garcia", 
      trainer: "P. Johnson", 
      vet: "Dr. B. Smith",
      odds: "5-2", 
      weight: 120,
      category: 1,
      welfareHistory: ['good', 'good', 'good', 'warning', 'good'] as const,
      welfareResult: 'dnf' as const,
      alerts: ['DNF - Pulled Up']
    },
    { 
      post: 3, 
      name: "Storm Runner", 
      jockey: "K. Davis", 
      trainer: "R. Williams", 
      vet: "Dr. C. Brown",
      odds: "4-1", 
      weight: 119,
      category: 3,
      welfareHistory: ['warning', 'good', 'good', 'good', 'alert'] as const,
      welfareResult: 'warning' as const,
      alerts: ['S-Fx', 'RF', 'HL']
    },
    { 
      post: 4, 
      name: "Fire Spirit", 
      jockey: "L. Martinez", 
      trainer: "T. Brown", 
      vet: "Dr. D. Wilson",
      odds: "8-1", 
      weight: 117,
      category: 4,
      welfareHistory: ['good', 'warning', 'warning', 'good', 'good'] as const,
      welfareResult: 'good' as const,
      alerts: ['BF']
    },
    { 
      post: 5, 
      name: "Wind Walker", 
      jockey: "M. Wilson", 
      trainer: "S. Davis", 
      vet: "Dr. E. Garcia",
      odds: "6-1", 
      weight: 118,
      category: 2,
      welfareHistory: ['alert', 'warning', 'good', 'good', 'good'] as const,
      welfareResult: 'alert' as const,
      alerts: ['C-Fx', 'S-Fx', 'LF']
    },
  ],
  2: [
    { 
      post: 1, 
      name: "Royal Majesty", 
      jockey: "S. Thompson", 
      trainer: "K. Miller", 
      vet: "Dr. F. Lee",
      odds: "2-1", 
      weight: 122,
      category: 1,
      welfareHistory: ['good', 'good', 'good', 'good', 'warning'] as const,
      welfareResult: 'good' as const,
      alerts: []
    },
    { 
      post: 2, 
      name: "Golden Arrow", 
      jockey: "R. Clark", 
      trainer: "D. Anderson", 
      vet: "Dr. G. Taylor",
      odds: "7-2", 
      weight: 119,
      category: 2,
      welfareHistory: ['good', 'warning', 'good', 'good', 'good'] as const,
      welfareResult: 'warning' as const,
      alerts: ['RF']
    },
    { 
      post: 3, 
      name: "Silver Bullet", 
      jockey: "T. Lewis", 
      trainer: "B. Taylor", 
      vet: "Dr. H. Martinez",
      odds: "5-1", 
      weight: 118,
      category: 3,
      welfareHistory: ['good', 'good', 'alert', 'warning', 'good'] as const,
      welfareResult: 'good' as const,
      alerts: ['BF', 'HL']
    },
    { 
      post: 4, 
      name: "Midnight Express", 
      jockey: "C. White", 
      trainer: "J. Harris", 
      vet: "Dr. I. Clark",
      odds: "9-1", 
      weight: 116,
      category: 5,
      welfareHistory: ['warning', 'warning', 'good', 'good', 'warning'] as const,
      welfareResult: 'alert' as const,
      alerts: ['C-Fx', 'S-Fx', 'LF', 'RF']
    },
  ],
  3: [
    { 
      post: 1, 
      name: "Desert Storm", 
      jockey: "P. Martinez", 
      trainer: "L. Jackson", 
      vet: "Dr. J. Rodriguez",
      odds: "4-1", 
      weight: 120,
      category: 2,
      welfareHistory: ['good', 'good', 'good', 'warning', 'good'] as const,
      welfareResult: 'good' as const,
      alerts: ['LF']
    },
    { 
      post: 2, 
      name: "Ocean Wave", 
      jockey: "N. Johnson", 
      trainer: "R. Lee", 
      vet: "Dr. K. Anderson",
      odds: "3-1", 
      weight: 118,
      category: 1,
      welfareHistory: ['warning', 'good', 'good', 'good', 'good'] as const,
      welfareResult: 'warning' as const,
      alerts: []
    },
    { 
      post: 3, 
      name: "Mountain Peak", 
      jockey: "H. Garcia", 
      trainer: "S. Moore", 
      vet: "Dr. L. Thompson",
      odds: "6-1", 
      weight: 117,
      category: 4,
      welfareHistory: ['good', 'alert', 'warning', 'good', 'good'] as const,
      welfareResult: 'good' as const,
      alerts: ['S-Fx']
    },
    { 
      post: 4, 
      name: "Valley Runner", 
      jockey: "D. Wilson", 
      trainer: "A. Martin", 
      vet: "Dr. M. Davis",
      odds: "8-1", 
      weight: 119,
      category: 3,
      welfareHistory: ['good', 'good', 'good', 'good', 'alert'] as const,
      welfareResult: 'alert' as const,
      alerts: ['C-Fx', 'BF', 'HL']
    },
    { 
      post: 5, 
      name: "Prairie Fire", 
      jockey: "M. Davis", 
      trainer: "C. Thompson", 
      vet: "Dr. N. White",
      odds: "12-1", 
      weight: 116,
      category: 5,
      welfareHistory: ['warning', 'warning', 'warning', 'good', 'good'] as const,
      welfareResult: 'warning' as const,
      alerts: ['RF', 'LF']
    },
    { 
      post: 6, 
      name: "River Rapids", 
      jockey: "B. Rodriguez", 
      trainer: "F. Clark", 
      vet: "Dr. O. Harris",
      odds: "15-1", 
      weight: 118,
      category: 2,
      welfareHistory: ['good', 'good', 'warning', 'warning', 'good'] as const,
      welfareResult: 'good' as const,
      alerts: []
    },
  ],
};

const mockRaces = [
  { number: 1, name: "Maiden Special Weight", time: "12:00 PM", status: "finished" },
  { number: 2, name: "Allowance Optional Claiming", time: "12:30 PM", status: "finished" },
  { number: 3, name: "Claiming $25,000", time: "1:00 PM", status: "finished" },
];

// Sample previous BlackBox reports
const previousReports = [
  {
    id: "BB-2024-001",
    date: "2024-01-15",
    horseName: "Thunder Strike",
    raceNumber: 1,
    raceName: "Maiden Special Weight",
    incident: "Pulled up - Lameness",
    status: "Completed",
    veterinarian: "Dr. A. Johnson",
    findings: "Minor strain in left foreleg, 7-day rest recommended"
  },
  {
    id: "BB-2024-002", 
    date: "2024-01-10",
    horseName: "Lightning Bolt",
    raceNumber: 2,
    raceName: "Allowance Optional Claiming",
    incident: "Fell at 6th furlong",
    status: "Completed",
    veterinarian: "Dr. B. Smith",
    findings: "No serious injury detected, cleared for next race"
  },
  {
    id: "BB-2024-003",
    date: "2024-01-08",
    horseName: "Storm Runner", 
    raceNumber: 3,
    raceName: "Claiming $25,000",
    incident: "Distressed breathing",
    status: "Under Review",
    veterinarian: "Dr. C. Brown",
    findings: "Pending final analysis"
  },
  {
    id: "BB-2024-004",
    date: "2024-01-05",
    horseName: "Fire Spirit",
    raceNumber: 1,
    raceName: "Maiden Special Weight", 
    incident: "Pulled up - Equipment failure",
    status: "Completed",
    veterinarian: "Dr. D. Wilson",
    findings: "Saddle malfunction confirmed, horse uninjured"
  },
  {
    id: "BB-2024-005",
    date: "2024-01-03",
    horseName: "Wind Walker",
    raceNumber: 2,
    raceName: "Allowance Optional Claiming",
    incident: "Stumbled at start",
    status: "Completed", 
    veterinarian: "Dr. E. Garcia",
    findings: "Minor abrasions, 3-day monitoring period completed"
  }
];

const BlackBoxPane = () => {
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    horseName: string;
    raceNumber: number;
  }>({
    isOpen: false,
    horseName: "",
    raceNumber: 0
  });

  // Get all horses that did not finish (DNF status)
  const getDNFHorses = () => {
    const dnfHorses = [];
    for (const [raceNumber, horses] of Object.entries(mockHorses)) {
      if (raceNumber !== 'default') {
        const race = mockRaces.find(r => r.number === parseInt(raceNumber));
        horses.forEach(horse => {
          if (horse.welfareResult === 'dnf') {
            dnfHorses.push({
              ...horse,
              raceNumber: parseInt(raceNumber),
              raceName: race?.name || "TBA",
              raceTime: race?.time || "TBA"
            });
          }
        });
      }
    }
    return dnfHorses;
  };

  const dnfHorses = getDNFHorses();

  const handleBlackBoxAnalysis = (horseName: string, raceNumber: number) => {
    setConfirmDialog({
      isOpen: true,
      horseName,
      raceNumber
    });
  };

  const handleConfirmAnalysis = () => {
    console.log(`BlackBox analysis confirmed for ${confirmDialog.horseName} in Race ${confirmDialog.raceNumber}`);
    // TODO: Implement actual BlackBox analysis purchase and processing
  };

  const handleCloseDialog = () => {
    setConfirmDialog({
      isOpen: false,
      horseName: "",
      raceNumber: 0
    });
  };

  const handleViewReport = (reportId: string) => {
    console.log(`Viewing report ${reportId}`);
    // TODO: Implement report viewing functionality
  };

  const handleDownloadReport = (reportId: string) => {
    console.log(`Downloading report ${reportId}`);
    // TODO: Implement report download functionality
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="previous-reports">Previous Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h3 className="text-lg font-semibold">Horses Requiring BlackBox Analysis</h3>
                </div>
                
                {dnfHorses.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      The following horses did not complete their races and require BlackBox analysis:
                    </p>
                    
                    <div className="space-y-3">
                      {dnfHorses.map((horse) => (
                        <Card key={`${horse.raceNumber}-${horse.post}`} className="border-amber-200 bg-amber-50">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                                    Race {horse.raceNumber}
                                  </Badge>
                                  <span className="font-semibold text-gray-900">{horse.name}</span>
                                  <Badge variant="destructive" className="bg-black text-white">
                                    DNF
                                  </Badge>
                                </div>
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">{horse.raceName}</span> • {horse.raceTime}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Jockey: {horse.jockey} • Trainer: {horse.trainer} • Post: {horse.post}
                                </div>
                                {horse.alerts.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {horse.alerts.map((alert, index) => (
                                      <Badge key={index} variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                                        {alert}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                              
                              <Button
                                onClick={() => handleBlackBoxAnalysis(horse.name, horse.raceNumber)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <Activity className="w-4 h-4 mr-2" />
                                Request Analysis
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                      <Activity className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Analysis Required</h4>
                    <p className="text-muted-foreground">
                      All horses completed their races successfully. No BlackBox analysis is currently needed.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="previous-reports" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">BlackBox Analysis Reports</h3>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {previousReports.length} Reports
                  </Badge>
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Report ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Horse</TableHead>
                          <TableHead>Race</TableHead>
                          <TableHead>Incident</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Veterinarian</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previousReports.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell className="font-medium">{report.id}</TableCell>
                            <TableCell>{report.date}</TableCell>
                            <TableCell>{report.horseName}</TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">Race {report.raceNumber}</div>
                                <div className="text-sm text-muted-foreground">{report.raceName}</div>
                              </div>
                            </TableCell>
                            <TableCell>{report.incident}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={report.status === "Completed" ? "default" : "secondary"}
                                className={report.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                              >
                                {report.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{report.veterinarian}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewReport(report.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDownloadReport(report.id)}
                                  className="h-8 w-8 p-0"
                                  disabled={report.status !== "Completed"}
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                
                <div className="text-sm text-muted-foreground">
                  <p>BlackBox reports provide detailed analysis of racing incidents and are generated automatically when horses do not complete races or experience issues during competition.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <BlackBoxConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmAnalysis}
        horseName={confirmDialog.horseName}
        raceNumber={confirmDialog.raceNumber}
      />
    </div>
  );
};

export default BlackBoxPane;
