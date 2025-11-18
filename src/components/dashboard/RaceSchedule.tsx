
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, DollarSign, Trophy } from "lucide-react";
import { format } from "date-fns";

interface Race {
  number: number;
  name: string;
  time: string;
  distance: string;
  purse: number;
  starters: number;
  status: "scheduled" | "running" | "finished";
  surface: "dirt" | "turf" | "synthetic";
}

interface RaceScheduleProps {
  selectedDate: Date;
  selectedRace: number | null;
  onRaceSelect: (raceNumber: number) => void;
}

// Mock race data
const mockRaces: Race[] = [
  {
    number: 1,
    name: "Maiden Special Weight",
    time: "12:30 PM",
    distance: "6 furlongs",
    purse: 50000,
    starters: 8,
    status: "finished",
    surface: "dirt"
  },
  {
    number: 2,
    name: "Allowance Optional Claiming",
    time: "1:05 PM",
    distance: "1 mile",
    purse: 75000,
    starters: 10,
    status: "finished",
    surface: "dirt"
  },
  {
    number: 3,
    name: "Claiming $25,000",
    time: "1:40 PM",
    distance: "7 furlongs",
    purse: 35000,
    starters: 9,
    status: "running",
    surface: "dirt"
  },
  {
    number: 4,
    name: "Stakes - Derby Trial",
    time: "2:15 PM",
    distance: "1 1/8 miles",
    purse: 200000,
    starters: 12,
    status: "scheduled",
    surface: "dirt"
  },
  {
    number: 5,
    name: "Turf Allowance",
    time: "2:50 PM",
    distance: "1 1/16 miles",
    purse: 80000,
    starters: 7,
    status: "scheduled",
    surface: "turf"
  }
];

const RaceSchedule = ({ selectedDate, selectedRace, onRaceSelect }: RaceScheduleProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "finished": return "bg-gray-500";
      case "running": return "bg-green-500";
      case "scheduled": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getSurfaceColor = (surface: string) => {
    switch (surface) {
      case "dirt": return "bg-amber-100 text-amber-800";
      case "turf": return "bg-green-100 text-green-800";
      case "synthetic": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="border-blue-200 shadow-lg">
      <CardHeader className="bg-blue-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Race Schedule - {format(selectedDate, "MMM d, yyyy")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {mockRaces.map((race) => (
            <Card
              key={race.number}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedRace === race.number
                  ? "ring-2 ring-blue-500 bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => onRaceSelect(race.number)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm">
                      {race.number}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{race.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>{race.time}</span>
                        <span>•</span>
                        <span>{race.distance}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getSurfaceColor(race.surface)}>
                      {race.surface.toUpperCase()}
                    </Badge>
                    <Badge className={`text-white ${getStatusColor(race.status)}`}>
                      {race.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <DollarSign className="w-3 h-3" />
                      <span>Purse: ${race.purse.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users className="w-3 h-3" />
                      <span>{race.starters} starters</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RaceSchedule;
