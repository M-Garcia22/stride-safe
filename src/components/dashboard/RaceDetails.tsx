
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { 
  Clock, 
  Users, 
  DollarSign, 
  Trophy, 
  MapPin, 
  Activity,
  FileText,
  Settings
} from "lucide-react";
import { format } from "date-fns";

interface RaceDetailsProps {
  selectedRace: number | null;
  selectedDate: Date;
}

// Mock horse data
const mockHorses = [
  { post: 1, name: "Thunder Strike", jockey: "J. Rodriguez", trainer: "M. Smith", odds: "3-1", weight: 118 },
  { post: 2, name: "Lightning Bolt", jockey: "A. Garcia", trainer: "P. Johnson", odds: "5-2", weight: 120 },
  { post: 3, name: "Storm Runner", jockey: "K. Davis", trainer: "R. Williams", odds: "4-1", weight: 119 },
  { post: 4, name: "Fire Spirit", jockey: "L. Martinez", trainer: "T. Brown", odds: "8-1", weight: 117 },
  { post: 5, name: "Wind Walker", jockey: "M. Wilson", trainer: "S. Davis", odds: "6-1", weight: 118 },
];

const RaceDetails = ({ selectedRace, selectedDate }: RaceDetailsProps) => {
  if (!selectedRace) {
    return (
      <Card className="border-blue-200 shadow-lg">
        <CardHeader className="bg-blue-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Race Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Select a race to view details</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Race Info Card */}
      <Card className="border-blue-200 shadow-lg">
        <CardHeader className="bg-blue-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Race {selectedRace} Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Post Time:</span>
              <span>2:15 PM</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Distance:</span>
              <span>1 1/8 miles</span>
            </div>
            
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Purse:</span>
              <span>$200,000</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Field Size:</span>
              <span>12 horses</span>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Badge className="bg-amber-100 text-amber-800">DIRT</Badge>
              <Badge className="bg-blue-500 text-white">SCHEDULED</Badge>
            </div>
          </div>
          
          <div className="flex gap-2 mt-6">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 flex-1">
              <FileText className="w-3 h-3 mr-1" />
              Entries
            </Button>
            <Button size="sm" variant="outline" className="border-blue-200 text-blue-600">
              <Settings className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Starters Table */}
      <Card className="border-blue-200 shadow-lg">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-lg">Field & Connections</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Post</TableHead>
                <TableHead>Horse</TableHead>
                <TableHead>Jockey</TableHead>
                <TableHead>Odds</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockHorses.map((horse) => (
                <TableRow key={horse.post} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{horse.post}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{horse.name}</div>
                      <div className="text-xs text-gray-500">T: {horse.trainer}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{horse.jockey}</div>
                    <div className="text-xs text-gray-500">{horse.weight} lbs</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {horse.odds}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-blue-200 shadow-lg">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              Edit Race Details
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Manage Entries
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              View Results
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50">
              Cancel Race
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RaceDetails;
