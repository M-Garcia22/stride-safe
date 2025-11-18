import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search, FileText, Activity, Users } from "lucide-react";
import BlackBoxConfirmDialog from "../BlackBoxConfirmDialog";
import RaceReportConfirmDialog from "../RaceReportConfirmDialog";

// Status light colors
const getStatusColor = (status: 'good' | 'warning' | 'alert' | 'dnf') => {
  switch (status) {
    case 'good': return 'bg-green-500';
    case 'warning': return 'bg-yellow-500';
    case 'alert': return 'bg-red-500';
    case 'dnf': return 'bg-black';
    default: return 'bg-gray-300';
  }
};

// Welfare Status Light Component
const WelfareLight = ({ status }: { status: 'good' | 'warning' | 'alert' | 'dnf' }) => (
  <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
);

// Complete horse registry data - combining all horses from all races
const horseRegistry = [
  // Race 1 horses
  { 
    id: 1,
    name: "Thunder Strike", 
    jockey: "J. Rodriguez", 
    trainer: "M. Smith", 
    vet: "Dr. A. Johnson",
    odds: "3-1", 
    weight: 118,
    category: 2,
    welfareHistory: ['good', 'good', 'warning', 'good', 'good'] as const,
    welfareResult: 'good' as const,
    alerts: ['C-Fx', 'LF'],
    recentRaces: ['Race 1 - Dec 16, 2024'],
    totalRaces: 15,
    wins: 4,
    places: 3,
    shows: 2
  },
  { 
    id: 2,
    name: "Lightning Bolt", 
    jockey: "A. Garcia", 
    trainer: "P. Johnson", 
    vet: "Dr. B. Smith",
    odds: "5-2", 
    weight: 120,
    category: 1,
    welfareHistory: ['good', 'good', 'good', 'warning', 'good'] as const,
    welfareResult: 'dnf' as const,
    alerts: ['DNF - Pulled Up'],
    recentRaces: ['Race 1 - Dec 16, 2024'],
    totalRaces: 22,
    wins: 8,
    places: 5,
    shows: 4
  },
  { 
    id: 3,
    name: "Storm Runner", 
    jockey: "K. Davis", 
    trainer: "R. Williams", 
    vet: "Dr. C. Brown",
    odds: "4-1", 
    weight: 119,
    category: 3,
    welfareHistory: ['warning', 'good', 'good', 'good', 'alert'] as const,
    welfareResult: 'warning' as const,
    alerts: ['S-Fx', 'RF', 'HL'],
    recentRaces: ['Race 1 - Dec 16, 2024'],
    totalRaces: 18,
    wins: 3,
    places: 6,
    shows: 4
  },
  { 
    id: 4,
    name: "Fire Spirit", 
    jockey: "L. Martinez", 
    trainer: "T. Brown", 
    vet: "Dr. D. Wilson",
    odds: "8-1", 
    weight: 117,
    category: 4,
    welfareHistory: ['good', 'warning', 'warning', 'good', 'good'] as const,
    welfareResult: 'good' as const,
    alerts: ['BF'],
    recentRaces: ['Race 1 - Dec 16, 2024'],
    totalRaces: 12,
    wins: 2,
    places: 2,
    shows: 3
  },
  { 
    id: 5,
    name: "Wind Walker", 
    jockey: "M. Wilson", 
    trainer: "S. Davis", 
    vet: "Dr. E. Garcia",
    odds: "6-1", 
    weight: 118,
    category: 2,
    welfareHistory: ['alert', 'warning', 'good', 'good', 'good'] as const,
    welfareResult: 'alert' as const,
    alerts: ['C-Fx', 'S-Fx', 'LF'],
    recentRaces: ['Race 1 - Dec 16, 2024'],
    totalRaces: 9,
    wins: 1,
    places: 2,
    shows: 1
  },
  // Race 2 horses
  { 
    id: 6,
    name: "Royal Majesty", 
    jockey: "S. Thompson", 
    trainer: "K. Miller", 
    vet: "Dr. F. Lee",
    odds: "2-1", 
    weight: 122,
    category: 1,
    welfareHistory: ['good', 'good', 'good', 'good', 'warning'] as const,
    welfareResult: 'good' as const,
    alerts: [],
    recentRaces: ['Race 2 - Dec 16, 2024'],
    totalRaces: 28,
    wins: 12,
    places: 8,
    shows: 5
  },
  { 
    id: 7,
    name: "Golden Arrow", 
    jockey: "R. Clark", 
    trainer: "D. Anderson", 
    vet: "Dr. G. Taylor",
    odds: "7-2", 
    weight: 119,
    category: 2,
    welfareHistory: ['good', 'warning', 'good', 'good', 'good'] as const,
    welfareResult: 'warning' as const,
    alerts: ['RF'],
    recentRaces: ['Race 2 - Dec 16, 2024'],
    totalRaces: 20,
    wins: 6,
    places: 4,
    shows: 3
  },
  { 
    id: 8,
    name: "Silver Bullet", 
    jockey: "T. Lewis", 
    trainer: "B. Taylor", 
    vet: "Dr. H. Martinez",
    odds: "5-1", 
    weight: 118,
    category: 3,
    welfareHistory: ['good', 'good', 'alert', 'warning', 'good'] as const,
    welfareResult: 'good' as const,
    alerts: ['BF', 'HL'],
    recentRaces: ['Race 2 - Dec 16, 2024'],
    totalRaces: 16,
    wins: 4,
    places: 3,
    shows: 2
  },
  { 
    id: 9,
    name: "Midnight Express", 
    jockey: "C. White", 
    trainer: "J. Harris", 
    vet: "Dr. I. Clark",
    odds: "9-1", 
    weight: 116,
    category: 5,
    welfareHistory: ['warning', 'warning', 'good', 'good', 'warning'] as const,
    welfareResult: 'alert' as const,
    alerts: ['C-Fx', 'S-Fx', 'LF', 'RF'],
    recentRaces: ['Race 2 - Dec 16, 2024'],
    totalRaces: 8,
    wins: 0,
    places: 1,
    shows: 2
  },
  // Race 3 horses
  { 
    id: 10,
    name: "Desert Storm", 
    jockey: "P. Martinez", 
    trainer: "L. Jackson", 
    vet: "Dr. J. Rodriguez",
    odds: "4-1", 
    weight: 120,
    category: 2,
    welfareHistory: ['good', 'good', 'good', 'warning', 'good'] as const,
    welfareResult: 'good' as const,
    alerts: ['LF'],
    recentRaces: ['Race 3 - Dec 16, 2024'],
    totalRaces: 25,
    wins: 7,
    places: 6,
    shows: 4
  },
  { 
    id: 11,
    name: "Ocean Wave", 
    jockey: "N. Johnson", 
    trainer: "R. Lee", 
    vet: "Dr. K. Anderson",
    odds: "3-1", 
    weight: 118,
    category: 1,
    welfareHistory: ['warning', 'good', 'good', 'good', 'good'] as const,
    welfareResult: 'warning' as const,
    alerts: [],
    recentRaces: ['Race 3 - Dec 16, 2024'],
    totalRaces: 31,
    wins: 11,
    places: 9,
    shows: 6
  },
  { 
    id: 12,
    name: "Mountain Peak", 
    jockey: "H. Garcia", 
    trainer: "S. Moore", 
    vet: "Dr. L. Thompson",
    odds: "6-1", 
    weight: 117,
    category: 4,
    welfareHistory: ['good', 'alert', 'warning', 'good', 'good'] as const,
    welfareResult: 'good' as const,
    alerts: ['S-Fx'],
    recentRaces: ['Race 3 - Dec 16, 2024'],
    totalRaces: 14,
    wins: 2,
    places: 4,
    shows: 2
  },
  { 
    id: 13,
    name: "Valley Runner", 
    jockey: "D. Wilson", 
    trainer: "A. Martin", 
    vet: "Dr. M. Davis",
    odds: "8-1", 
    weight: 119,
    category: 3,
    welfareHistory: ['good', 'good', 'good', 'good', 'alert'] as const,
    welfareResult: 'alert' as const,
    alerts: ['C-Fx', 'BF', 'HL'],
    recentRaces: ['Race 3 - Dec 16, 2024'],
    totalRaces: 11,
    wins: 1,
    places: 3,
    shows: 2
  },
  { 
    id: 14,
    name: "Prairie Fire", 
    jockey: "M. Davis", 
    trainer: "C. Thompson", 
    vet: "Dr. N. White",
    odds: "12-1", 
    weight: 116,
    category: 5,
    welfareHistory: ['warning', 'warning', 'warning', 'good', 'good'] as const,
    welfareResult: 'warning' as const,
    alerts: ['RF', 'LF'],
    recentRaces: ['Race 3 - Dec 16, 2024'],
    totalRaces: 7,
    wins: 0,
    places: 0,
    shows: 1
  },
  { 
    id: 15,
    name: "River Rapids", 
    jockey: "B. Rodriguez", 
    trainer: "F. Clark", 
    vet: "Dr. O. Harris",
    odds: "15-1", 
    weight: 118,
    category: 2,
    welfareHistory: ['good', 'good', 'warning', 'warning', 'good'] as const,
    welfareResult: 'good' as const,
    alerts: [],
    recentRaces: ['Race 3 - Dec 16, 2024'],
    totalRaces: 5,
    wins: 0,
    places: 1,
    shows: 0
  }
];

interface HorsesPaneProps {
  onStrideAnalysis?: (horseName: string) => void;
}

const HorsesPane = ({ onStrideAnalysis }: HorsesPaneProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    horseName: string;
    raceNumber: number;
  }>({
    isOpen: false,
    horseName: "",
    raceNumber: 0
  });

  // Race Report confirmation dialog state
  const [reportDialog, setReportDialog] = useState<{
    isOpen: boolean;
    horseName: string;
    raceNumber: number;
  }>({
    isOpen: false,
    horseName: "",
    raceNumber: 0
  });

  const filteredHorses = horseRegistry.filter(horse =>
    horse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    horse.trainer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    horse.jockey.toLowerCase().includes(searchTerm.toLowerCase()) ||
    horse.vet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRaceReport = (horseName: string) => {
    if (onStrideAnalysis) {
      onStrideAnalysis(horseName);
    } else {
      setReportDialog({
        isOpen: true,
        horseName,
        raceNumber: 1 // Default race number for horses pane
      });
    }
  };

  const handleBlackBoxAnalysis = (horseName: string) => {
    // For horses pane, we'll use race number 1 as default since we don't have specific race context
    setConfirmDialog({
      isOpen: true,
      horseName,
      raceNumber: 1
    });
  };

  const handleConfirmAnalysis = () => {
    console.log(`BlackBox analysis confirmed for ${confirmDialog.horseName}`);
    // TODO: Implement actual BlackBox analysis purchase and processing
  };

  const handleCloseDialog = () => {
    setConfirmDialog({
      isOpen: false,
      horseName: "",
      raceNumber: 0
    });
  };

  const handleConfirmReport = () => {
    console.log(`Race report confirmed for ${reportDialog.horseName}`);
    // TODO: Implement actual race report request processing
  };

  const handleCloseReportDialog = () => {
    setReportDialog({
      isOpen: false,
      horseName: "",
      raceNumber: 0
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-forest-600" />
        <h1 className="text-2xl font-bold text-gray-900">Horse Registry</h1>
        <Badge variant="outline" className="ml-2">
          {filteredHorses.length} horses
        </Badge>
      </div>

      {/* Search Bar */}
      <Card className="border-forest-200 shadow-lg">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search horses by name, trainer, jockey, or veterinarian..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Horse Registry Table */}
      <Card className="border-forest-200 shadow-lg">
        <CardHeader className="bg-forest-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Complete Horse Registry
          </CardTitle>
          <div className="text-forest-100">
            All horses that have raced at this track
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Horse</TableHead>
                  <TableHead>Trainer</TableHead>
                  <TableHead>Jockey</TableHead>
                  <TableHead>Vet</TableHead>
                  <TableHead>Last Race</TableHead>
                  <TableHead className="w-32">Welfare History</TableHead>
                  <TableHead className="w-24">Current Status</TableHead>
                  <TableHead>Risk Category</TableHead>
                  <TableHead>Active Alerts</TableHead>
                  <TableHead>Record (W-P-S)</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHorses.map((horse) => (
                  <TableRow key={horse.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="font-medium text-forest-700">{horse.name}</div>
                      <div className="text-xs text-gray-500">
                        {horse.totalRaces} total races
                      </div>
                    </TableCell>
                    <TableCell>{horse.trainer}</TableCell>
                    <TableCell>
                      <div>{horse.jockey}</div>
                      <div className="text-xs text-gray-500">{horse.weight} lbs</div>
                    </TableCell>
                    <TableCell>{horse.vet}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {horse.recentRaces[0]}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {horse.welfareHistory.map((status, index) => (
                          <WelfareLight key={index} status={status} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <WelfareLight status={horse.welfareResult} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {horse.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {horse.alerts.map((alert, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                            {alert}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {horse.wins}-{horse.places}-{horse.shows}
                      </div>
                      <div className="text-xs text-gray-500">
                        {((horse.wins / horse.totalRaces) * 100).toFixed(0)}% win rate
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRaceReport(horse.name)}
                          className="p-1"
                          title="View Stride Analysis"
                        >
                          <FileText className="w-3 h-3" />
                        </Button>
                        {horse.welfareResult === 'dnf' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBlackBoxAnalysis(horse.name)}
                            className="p-1"
                            title="BlackBox Analysis"
                          >
                            <Activity className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {searchTerm && (
        <div className="text-sm text-gray-600">
          Showing {filteredHorses.length} of {horseRegistry.length} horses
        </div>
      )}

      <BlackBoxConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmAnalysis}
        horseName={confirmDialog.horseName}
        raceNumber={confirmDialog.raceNumber}
      />

      <RaceReportConfirmDialog
        isOpen={reportDialog.isOpen}
        onClose={handleCloseReportDialog}
        onConfirm={handleConfirmReport}
        horseName={reportDialog.horseName}
        raceNumber={reportDialog.raceNumber}
      />
    </div>
  );
};

export default HorsesPane;
