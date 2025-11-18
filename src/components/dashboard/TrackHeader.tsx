
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Thermometer, Trophy, Users } from "lucide-react";

interface TrackData {
  name: string;
  location: string;
  status: string;
  totalRaces: number;
  totalStarters: number;
  weather: string;
}

interface TrackHeaderProps {
  trackData: TrackData;
}

const TrackHeader = ({ trackData }: TrackHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-forest-700 to-forest-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Track Info */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <h1 className="text-4xl font-bold tracking-tight">{trackData.name}</h1>
              <Badge 
                variant="secondary" 
                className="bg-sage-500 text-white hover:bg-sage-600"
              >
                {trackData.status}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sage-100 mb-4">
              <MapPin className="w-4 h-4" />
              <span className="text-lg">{trackData.location}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sage-100">
              <Thermometer className="w-4 h-4" />
              <span>{trackData.weather}</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-amber-300" />
                  <span className="text-sm font-medium text-sage-100">Today's Races</span>
                </div>
                <div className="text-2xl font-bold text-white">{trackData.totalRaces}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-sage-300" />
                  <span className="text-sm font-medium text-sage-100">Total Starters</span>
                </div>
                <div className="text-2xl font-bold text-white">{trackData.totalStarters}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackHeader;
