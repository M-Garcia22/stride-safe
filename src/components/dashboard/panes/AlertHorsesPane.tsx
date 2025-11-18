import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Users, FileText, Calendar } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Mock data for horses racing today with alert status in recent races
const alertHorsesToday = [
  {
    name: "Wind Walker",
    raceNumber: 1,
    raceName: "Maiden Special Weight",
    raceTime: "12:00 PM",
    trainer: "S. Davis",
    jockey: "M. Wilson",
    lastAlertRace: "Race 8 - Dec 10, 2024",
    alertReasons: ["C-Fx", "S-Fx", "LF"],
    daysSinceAlert: 6
  },
  {
    name: "Midnight Express",
    raceNumber: 2,
    raceName: "Allowance Optional Claiming",
    raceTime: "12:30 PM",
    trainer: "J. Harris",
    jockey: "C. White",
    lastAlertRace: "Race 5 - Dec 12, 2024",
    alertReasons: ["C-Fx", "S-Fx", "LF", "RF"],
    daysSinceAlert: 4
  },
  {
    name: "Valley Runner",
    raceNumber: 3,
    raceName: "Claiming $25,000",
    raceTime: "1:00 PM",
    trainer: "A. Martin",
    jockey: "D. Wilson",
    lastAlertRace: "Race 3 - Dec 14, 2024",
    alertReasons: ["C-Fx", "BF", "HL"],
    daysSinceAlert: 2
  }
];

// Mock data for horses racing in the next 7 days with alert status
const alertHorsesUpcoming = [
  {
    name: "Thunder Strike",
    raceDate: "Dec 17, 2024",
    raceNumber: 4,
    raceName: "Stakes - Derby Trial",
    raceTime: "2:30 PM",
    trainer: "M. Smith",
    jockey: "J. Rodriguez",
    lastAlertRace: "Race 6 - Dec 8, 2024",
    alertReasons: ["C-Fx", "LF"],
    daysSinceAlert: 8,
    daysUntilRace: 1
  },
  {
    name: "Storm Runner",
    raceDate: "Dec 18, 2024",
    raceNumber: 2,
    raceName: "Allowance Optional Claiming",
    raceTime: "1:00 PM",
    trainer: "R. Williams",
    jockey: "K. Davis",
    lastAlertRace: "Race 7 - Dec 9, 2024",
    alertReasons: ["S-Fx", "RF", "HL"],
    daysSinceAlert: 7,
    daysUntilRace: 2
  },
  {
    name: "Golden Arrow",
    raceDate: "Dec 19, 2024",
    raceNumber: 6,
    raceName: "Turf Allowance",
    raceTime: "3:00 PM",
    trainer: "D. Anderson",
    jockey: "R. Clark",
    lastAlertRace: "Race 4 - Dec 11, 2024",
    alertReasons: ["RF"],
    daysSinceAlert: 5,
    daysUntilRace: 3
  },
  {
    name: "Silver Bullet",
    raceDate: "Dec 20, 2024",
    raceNumber: 8,
    raceName: "Stakes - Feature Race",
    raceTime: "4:00 PM",
    trainer: "B. Taylor",
    jockey: "T. Lewis",
    lastAlertRace: "Race 2 - Dec 13, 2024",
    alertReasons: ["BF", "HL"],
    daysSinceAlert: 3,
    daysUntilRace: 4
  },
  {
    name: "Prairie Fire",
    raceDate: "Dec 22, 2024",
    raceNumber: 5,
    raceName: "Claiming $40,000",
    raceTime: "2:30 PM",
    trainer: "C. Thompson",
    jockey: "M. Davis",
    lastAlertRace: "Race 1 - Dec 15, 2024",
    alertReasons: ["RF", "LF"],
    daysSinceAlert: 1,
    daysUntilRace: 6
  }
];

const AlertHorsesPane = () => {
  const handleViewDetails = (horseName: string) => {
    console.log(`Viewing details for ${horseName}`);
    // TODO: Navigate to horse details or open modal
  };

  const getSeverityColor = (days: number) => {
    if (days <= 3) return "bg-rose-100 border-rose-300 text-rose-800";
    if (days <= 7) return "bg-amber-100 border-amber-300 text-amber-800";
    return "bg-orange-100 border-orange-300 text-orange-800";
  };

  const getRaceDateColor = (days: number) => {
    if (days <= 2) return "bg-amber-100 border-amber-300 text-amber-800";
    if (days <= 5) return "bg-sage-100 border-sage-300 text-sage-800";
    return "bg-forest-100 border-forest-300 text-forest-800";
  };

  const totalAlertHorses = alertHorsesToday.length + alertHorsesUpcoming.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="w-6 h-6 text-rose-700" />
        <h1 className="text-2xl font-bold text-gray-900">Welfare Alerts</h1>
        <Badge variant="destructive" className="ml-2 bg-rose-700 hover:bg-rose-800">
          {totalAlertHorses} horses
        </Badge>
      </div>

      {/* Summary Card */}
      <Card className="border-rose-200 shadow-lg">
        <CardHeader className="bg-rose-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Welfare Alert Summary
          </CardTitle>
          <div className="text-rose-100">
            Horses with recent welfare alerts racing today and in the next 7 days
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-700">{totalAlertHorses}</div>
              <div className="text-sm text-gray-600">Total Alert Horses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{alertHorsesToday.length}</div>
              <div className="text-sm text-gray-600">Racing Today</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">{alertHorsesUpcoming.length}</div>
              <div className="text-sm text-gray-600">Next 7 Days</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sage-600">
                {[...alertHorsesToday, ...alertHorsesUpcoming].filter(h => h.daysSinceAlert <= 3).length}
              </div>
              <div className="text-sm text-gray-600">Recent Alerts (≤3 days)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Horses Racing Today */}
      <Card className="border-rose-200 shadow-lg">
        <CardHeader className="bg-rose-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Racing Today
          </CardTitle>
          <div className="text-rose-100">
            Horses with recent welfare alerts racing today
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Horse</TableHead>
                  <TableHead>Today's Race</TableHead>
                  <TableHead>Trainer</TableHead>
                  <TableHead>Jockey</TableHead>
                  <TableHead>Last Alert Race</TableHead>
                  <TableHead>Days Since Alert</TableHead>
                  <TableHead>Alert Reasons</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alertHorsesToday.map((horse, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="font-medium text-rose-800">{horse.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">Race {horse.raceNumber}</div>
                      <div className="text-sm text-gray-600">{horse.raceName}</div>
                      <div className="text-xs text-gray-500">{horse.raceTime}</div>
                    </TableCell>
                    <TableCell>{horse.trainer}</TableCell>
                    <TableCell>{horse.jockey}</TableCell>
                    <TableCell>
                      <div className="text-sm">{horse.lastAlertRace}</div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${getSeverityColor(horse.daysSinceAlert)} font-medium`}
                      >
                        {horse.daysSinceAlert} days ago
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {horse.alertReasons.map((reason, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-rose-50 text-rose-800 border-rose-200">
                            {reason}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(horse.name)}
                        className="p-1"
                        title="View Horse Details"
                      >
                        <FileText className="w-3 h-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Horses Racing in Next 7 Days */}
      <Card className="border-amber-200 shadow-lg">
        <CardHeader className="bg-amber-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Racing in the Next 7 days
          </CardTitle>
          <div className="text-amber-100">
            Horses with recent welfare alerts scheduled to race in the upcoming week
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Horse</TableHead>
                  <TableHead>Upcoming Race</TableHead>
                  <TableHead>Trainer</TableHead>
                  <TableHead>Jockey</TableHead>
                  <TableHead>Last Alert Race</TableHead>
                  <TableHead>Days Since Alert</TableHead>
                  <TableHead>Days Until Race</TableHead>
                  <TableHead>Alert Reasons</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alertHorsesUpcoming.map((horse, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="font-medium text-amber-800">{horse.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{horse.raceDate}</div>
                      <div className="text-sm text-gray-600">Race {horse.raceNumber} - {horse.raceName}</div>
                      <div className="text-xs text-gray-500">{horse.raceTime}</div>
                    </TableCell>
                    <TableCell>{horse.trainer}</TableCell>
                    <TableCell>{horse.jockey}</TableCell>
                    <TableCell>
                      <div className="text-sm">{horse.lastAlertRace}</div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${getSeverityColor(horse.daysSinceAlert)} font-medium`}
                      >
                        {horse.daysSinceAlert} days ago
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${getRaceDateColor(horse.daysUntilRace)} font-medium`}
                      >
                        {horse.daysUntilRace} days
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {horse.alertReasons.map((reason, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-amber-50 text-amber-800 border-amber-200">
                            {reason}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(horse.name)}
                        className="p-1"
                        title="View Horse Details"
                      >
                        <FileText className="w-3 h-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {totalAlertHorses === 0 && (
        <Card className="border-green-200 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-green-600 mb-2">
              <AlertTriangle className="w-12 h-12 mx-auto opacity-50" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Alert Horses</h3>
            <p className="text-gray-600">
              All horses racing today and in the next 7 days have clean welfare records in their recent races.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AlertHorsesPane;
