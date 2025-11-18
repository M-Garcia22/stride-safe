import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Trophy, ChevronLeft, ChevronRight, FileText, Activity, ArrowUp, ArrowDown, Filter } from "lucide-react";
import { format } from "date-fns";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import BlackBoxConfirmDialog from "../BlackBoxConfirmDialog";
import RaceReportConfirmDialog from "../RaceReportConfirmDialog";

// Mock data for race dates - expanded with more example dates
const raceDates = [
  new Date(2024, 11, 15), // December 15, 2024
  new Date(2024, 11, 16), // December 16, 2024
  new Date(2024, 11, 18), // December 18, 2024
  new Date(2024, 11, 20), // December 20, 2024
  new Date(2024, 11, 22), // December 22, 2024
  new Date(2024, 11, 25), // December 25, 2024
  new Date(2024, 11, 28), // December 28, 2024
  new Date(2024, 11, 30), // December 30, 2024
  new Date(2025, 0, 1),   // January 1, 2025
  new Date(2025, 0, 3),   // January 3, 2025
  new Date(2025, 0, 5),   // January 5, 2025
  new Date(2025, 0, 8),   // January 8, 2025
  new Date(2025, 0, 10),  // January 10, 2025
  new Date(2025, 0, 12),  // January 12, 2025
];

// Mock race data for tabs - expanded to 12 races
const mockRaces = [
  { number: 1, name: "Maiden Special Weight", time: "12:00 PM", status: "finished" },
  { number: 2, name: "Allowance Optional Claiming", time: "12:30 PM", status: "finished" },
  { number: 3, name: "Claiming $25,000", time: "1:00 PM", status: "finished" },
  { number: 4, name: "Stakes - Derby Trial", time: "1:30 PM", status: "running" },
  { number: 5, name: "Turf Allowance", time: "2:00 PM", status: "scheduled" },
  { number: 6, name: "Maiden Claiming", time: "2:30 PM", status: "scheduled" },
  { number: 7, name: "Allowance", time: "3:00 PM", status: "scheduled" },
  { number: 8, name: "Claiming $40,000", time: "3:30 PM", status: "scheduled" },
  { number: 9, name: "Stakes - Feature Race", time: "4:00 PM", status: "scheduled" },
  { number: 10, name: "Turf Sprint", time: "4:30 PM", status: "scheduled" },
  { number: 11, name: "Maiden Special Weight", time: "5:00 PM", status: "scheduled" },
  { number: 12, name: "Nightcap Handicap", time: "5:30 PM", status: "scheduled" }
];

// Status light colors - updated to include black dot for DNF
const getStatusColor = (status: 'good' | 'warning' | 'alert' | 'dnf') => {
  switch (status) {
    case 'good': return 'bg-green-500';
    case 'warning': return 'bg-yellow-500';
    case 'alert': return 'bg-red-500';
    case 'dnf': return 'bg-black';
    default: return 'bg-gray-300';
  }
};

// Welfare Status Light Component - updated to include DNF
const WelfareLight = ({ status }: { status: 'good' | 'warning' | 'alert' | 'dnf' }) => (
  <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
);

// Mock horse data for each race with expanded welfare information and alerts
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
  // Default horses for races 4-12
  default: [
    { 
      post: 1, 
      name: "Race Entry #1", 
      jockey: "TBA", 
      trainer: "TBA", 
      vet: "Dr. TBA",
      odds: "Even", 
      weight: 118,
      category: 1,
      welfareHistory: ['good', 'good', 'good', 'good', 'good'] as const,
      welfareResult: 'good' as const,
      alerts: []
    },
    { 
      post: 2, 
      name: "Race Entry #2", 
      jockey: "TBA", 
      trainer: "TBA", 
      vet: "Dr. TBA",
      odds: "2-1", 
      weight: 120,
      category: 2,
      welfareHistory: ['good', 'warning', 'good', 'good', 'good'] as const,
      welfareResult: 'warning' as const,
      alerts: ['C-Fx']
    },
    { 
      post: 3, 
      name: "Race Entry #3", 
      jockey: "TBA", 
      trainer: "TBA", 
      vet: "Dr. TBA",
      odds: "3-1", 
      weight: 119,
      category: 3,
      welfareHistory: ['warning', 'good', 'good', 'alert', 'good'] as const,
      welfareResult: 'good' as const,
      alerts: ['S-Fx', 'LF']
    },
    { 
      post: 4, 
      name: "Race Entry #4", 
      jockey: "TBA", 
      trainer: "TBA", 
      vet: "Dr. TBA",
      odds: "4-1", 
      weight: 117,
      category: 4,
      welfareHistory: ['good', 'good', 'warning', 'good', 'warning'] as const,
      welfareResult: 'alert' as const,
      alerts: ['RF', 'BF', 'HL']
    },
  ]
};

type SortField = 'post' | 'name' | 'trainer' | 'vet' | 'category' | 'welfareResult' | 'raceNumber';
type SortDirection = 'asc' | 'desc';

interface FilterState {
  name: string;
  trainer: string;
  vet: string;
  category: string;
  welfareResult: string;
}

const RacesPane = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2024, 11, 16));
  const [selectedRace, setSelectedRace] = useState<number | string>("all");
  const [isCalendarOpen, setIsCalendarOpen] = useState(true);
  
  // Sorting and filtering state
  const [sortField, setSortField] = useState<SortField>('post');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filters, setFilters] = useState<FilterState>({
    name: '',
    trainer: '',
    vet: '',
    category: '',
    welfareResult: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // BlackBox confirmation dialog state
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

  // Utility functions
  const isRaceDate = (date: Date) => {
    return raceDates.some(raceDate => 
      raceDate.getDate() === date.getDate() &&
      raceDate.getMonth() === date.getMonth() &&
      raceDate.getFullYear() === date.getFullYear()
    );
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && isRaceDate(date)) {
      setSelectedDate(date);
      setSelectedRace("all"); // Reset to "all" when changing dates
    }
  };

  const handleRaceSelect = (raceNumber: number | string) => {
    setSelectedRace(raceNumber);
  };

  const getCurrentDateIndex = () => {
    return raceDates.findIndex(date => 
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const handlePreviousDate = () => {
    const currentIndex = getCurrentDateIndex();
    if (currentIndex > 0) {
      setSelectedDate(raceDates[currentIndex - 1]);
      setSelectedRace("all");
    }
  };

  const handleNextDate = () => {
    const currentIndex = getCurrentDateIndex();
    if (currentIndex < raceDates.length - 1) {
      setSelectedDate(raceDates[currentIndex + 1]);
      setSelectedRace("all");
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const sortAndFilterHorses = (horses: any[]) => {
    let filtered = horses.filter(horse => {
      return (
        horse.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        horse.trainer.toLowerCase().includes(filters.trainer.toLowerCase()) &&
        horse.vet.toLowerCase().includes(filters.vet.toLowerCase()) &&
        (filters.category === '' || horse.category.toString() === filters.category) &&
        (filters.welfareResult === '' || horse.welfareResult === filters.welfareResult)
      );
    });

    return filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const getHorsesForRace = (raceNumber: number) => {
    return mockHorses[raceNumber as keyof typeof mockHorses] || mockHorses.default;
  };

  const getAllHorses = () => {
    const allHorses = [];
    for (let i = 1; i <= 12; i++) {
      const horses = getHorsesForRace(i);
      const race = mockRaces.find(r => r.number === i);
      horses.forEach(horse => {
        allHorses.push({
          ...horse,
          raceNumber: i,
          raceName: race?.name || "TBA",
          raceTime: race?.time || "TBA",
          raceStatus: race?.status || "scheduled"
        });
      });
    }
    return sortAndFilterHorses(allHorses);
  };

  const handleRaceReport = (horseName: string, raceNumber: number) => {
    setReportDialog({
      isOpen: true,
      horseName,
      raceNumber
    });
  };

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

  const handleConfirmReport = () => {
    console.log(`Race report confirmed for ${reportDialog.horseName} in Race ${reportDialog.raceNumber}`);
    // TODO: Implement actual race report request processing
  };

  const handleCloseDialog = () => {
    setConfirmDialog({
      isOpen: false,
      horseName: "",
      raceNumber: 0
    });
  };

  const handleCloseReportDialog = () => {
    setReportDialog({
      isOpen: false,
      horseName: "",
      raceNumber: 0
    });
  };

  const SortableTableHead = ({ field, children, className }: { field: SortField; children: React.ReactNode; className?: string }) => (
    <TableHead 
      className={`cursor-pointer hover:bg-forest-50 select-none ${className || ''}`}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === 'asc' ? 
            <ArrowUp className="w-3 h-3" /> : 
            <ArrowDown className="w-3 h-3" />
        )}
      </div>
    </TableHead>
  );

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-forest-300 text-forest-700">
            {format(selectedDate, "MMM d, yyyy")}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 border-forest-300 text-forest-700 hover:bg-forest-50"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousDate}
            disabled={getCurrentDateIndex() === 0}
            className="flex items-center gap-1 border-forest-300 text-forest-700 hover:bg-forest-50"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Date
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextDate}
            disabled={getCurrentDateIndex() === raceDates.length - 1}
            className="flex items-center gap-1 border-forest-300 text-forest-700 hover:bg-forest-50"
          >
            Next Date
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card className="border-forest-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-xs font-medium text-forest-700 mb-1 block">Horse Name</label>
              <Input
                placeholder="Filter by name..."
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-forest-700 mb-1 block">Trainer</label>
              <Input
                placeholder="Filter by trainer..."
                value={filters.trainer}
                onChange={(e) => handleFilterChange('trainer', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-forest-700 mb-1 block">Vet</label>
              <Input
                placeholder="Filter by vet..."
                value={filters.vet}
                onChange={(e) => handleFilterChange('vet', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-forest-700 mb-1 block">Risk Category</label>
              <Input
                placeholder="Filter by category..."
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-forest-700 mb-1 block">Welfare Status</label>
              <Input
                placeholder="good/warning/alert/dnf"
                value={filters.welfareResult}
                onChange={(e) => handleFilterChange('welfareResult', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>
        </Card>
      )}

      <div className="flex gap-6">
        {/* Main Content Area with Tabs */}
        <div className="flex-1">
          <Tabs value={selectedRace?.toString() || "all"} onValueChange={(value) => setSelectedRace(value === "all" ? "all" : parseInt(value))}>
            <TabsList className="flex w-full gap-1 h-auto p-1 overflow-x-auto">
              <TabsTrigger 
                value="all" 
                className="flex items-center justify-center py-2 px-3 text-xs flex-shrink-0 data-[state=active]:bg-forest-100 data-[state=active]:text-forest-800"
              >
                <div className="flex items-center gap-1">
                  <span className="font-semibold">All</span>
                </div>
              </TabsTrigger>
              {mockRaces.map((race) => (
                <TabsTrigger 
                  key={race.number} 
                  value={race.number.toString()} 
                  className="flex items-center justify-center py-2 px-2 text-xs flex-shrink-0 data-[state=active]:bg-forest-100 data-[state=active]:text-forest-800"
                >
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{race.number}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      race.status === 'finished' ? 'bg-gray-500' : 
                      race.status === 'running' ? 'bg-forest-500' : 
                      'bg-sage-500'
                    }`} />
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {/* All Horses Tab Content */}
            <TabsContent value="all">
              <Card className="border-forest-200 shadow-lg">
                <CardHeader className="bg-forest-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    All Horses - {format(selectedDate, "MMM d, yyyy")}
                  </CardTitle>
                  <div className="text-forest-100">
                    All horses running on this date
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <SortableTableHead field="raceNumber" className="w-16">Race</SortableTableHead>
                          <SortableTableHead field="post" className="w-16">Post</SortableTableHead>
                          <SortableTableHead field="name">Horse</SortableTableHead>
                          <SortableTableHead field="trainer">Trainer</SortableTableHead>
                          <SortableTableHead field="vet">Vet</SortableTableHead>
                          <TableHead className="w-32">History</TableHead>
                          <SortableTableHead field="welfareResult" className="w-24">Welfare Result</SortableTableHead>
                          <SortableTableHead field="category">Risk Category</SortableTableHead>
                          <TableHead>Alerts</TableHead>
                          <TableHead className="w-32">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getAllHorses().map((horse, index) => (
                          <TableRow key={`all-${horse.raceNumber}-${horse.post}`} className="hover:bg-forest-50">
                            <TableCell className="font-medium text-center">{horse.raceNumber}</TableCell>
                            <TableCell className="font-medium text-center">{horse.post}</TableCell>
                            <TableCell>
                              <div className="font-medium text-forest-700">{horse.name}</div>
                            </TableCell>
                            <TableCell>{horse.trainer}</TableCell>
                            <TableCell>{horse.vet}</TableCell>
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
                              <Badge variant="secondary" className="text-xs bg-forest-100 text-forest-800">
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
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRaceReport(horse.name, horse.raceNumber)}
                                  className="p-1 border-forest-300 text-forest-700 hover:bg-forest-50"
                                >
                                  <FileText className="w-3 h-3" />
                                </Button>
                                {horse.welfareResult === 'dnf' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleBlackBoxAnalysis(horse.name, horse.raceNumber)}
                                    className="p-1 border-forest-300 text-forest-700 hover:bg-forest-50"
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
            </TabsContent>
            
            {mockRaces.map((race) => (
              <TabsContent key={race.number} value={race.number.toString()}>
                <Card className="border-forest-200 shadow-lg">
                  <CardHeader className="bg-forest-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Race {race.number} - {race.name}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-forest-100">
                      <span>Post Time: {race.time}</span>
                      <Badge className={`${
                        race.status === 'finished' ? 'bg-gray-600' : 
                        race.status === 'running' ? 'bg-forest-500' : 
                        'bg-sage-600'
                      } text-white`}>
                        {race.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <SortableTableHead field="post" className="w-16">Post</SortableTableHead>
                            <SortableTableHead field="name">Horse</SortableTableHead>
                            <SortableTableHead field="trainer">Trainer</SortableTableHead>
                            <SortableTableHead field="vet">Vet</SortableTableHead>
                            <TableHead className="w-32">History</TableHead>
                            <SortableTableHead field="welfareResult" className="w-24">Welfare Result</SortableTableHead>
                            <SortableTableHead field="category">Risk Category</SortableTableHead>
                            <TableHead>Alerts</TableHead>
                            <TableHead className="w-32">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getHorsesForRace(race.number).map((horse) => (
                            <TableRow key={`${race.number}-${horse.post}`} className="hover:bg-forest-50">
                              <TableCell className="font-medium text-center">{horse.post}</TableCell>
                              <TableCell>
                                <div className="font-medium text-forest-700">{horse.name}</div>
                              </TableCell>
                              <TableCell>{horse.trainer}</TableCell>
                              <TableCell>{horse.vet}</TableCell>
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
                                <Badge variant="secondary" className="text-xs bg-forest-100 text-forest-800">
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
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleRaceReport(horse.name, race.number)}
                                    className="p-1 border-forest-300 text-forest-700 hover:bg-forest-50"
                                  >
                                    <FileText className="w-3 h-3" />
                                  </Button>
                                  {horse.welfareResult === 'dnf' && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleBlackBoxAnalysis(horse.name, race.number)}
                                      className="p-1 border-forest-300 text-forest-700 hover:bg-forest-50"
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
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Collapsible Calendar - Made Smaller */}
        <div className="flex items-start">
          <Collapsible open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <div className="flex items-start gap-2">
              <CollapsibleContent className="animate-in slide-in-from-right-2 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right-2">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-forest-200 shadow-lg p-2 w-72">
                  <div className="flex items-center gap-2 mb-2 text-forest-700">
                    <CalendarIcon className="w-3 h-3" />
                    <h3 className="font-semibold text-xs">Race Calendar</h3>
                  </div>
                  
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    className="w-full pointer-events-auto text-xs scale-90 origin-top-left"
                    modifiers={{
                      raceDay: raceDates,
                    }}
                    modifiersStyles={{
                      raceDay: {
                        backgroundColor: '#4d6f55',
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '4px',
                        border: '1px solid #3d5943',
                      },
                    }}
                    disabled={(date) => !isRaceDate(date)}
                  />
                  
                  <div className="mt-2 space-y-1 scale-90 origin-top-left">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <div className="w-2 h-2 bg-forest-600 rounded border border-forest-700"></div>
                      <span>Race Days</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Click highlighted dates to view races
                    </div>
                    <div className="text-xs text-forest-600 font-medium">
                      {raceDates.length} racing dates scheduled
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
              
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/80 backdrop-blur-sm border-forest-200 hover:bg-forest-50 p-0 flex items-center justify-center"
                  style={{ 
                    height: isCalendarOpen ? '40px' : '220px',
                    width: '40px'
                  }}
                >
                  {isCalendarOpen ? (
                    <ChevronRight className="w-4 h-4 text-forest-600" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <ChevronLeft className="w-4 h-4 text-forest-600 mb-2" />
                      <span 
                        className="text-xs text-forest-600 font-medium"
                        style={{ 
                          writingMode: 'vertical-rl',
                          textOrientation: 'mixed'
                        }}
                      >
                        Race Calendar
                      </span>
                    </div>
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </Collapsible>
        </div>
      </div>

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

export default RacesPane;
