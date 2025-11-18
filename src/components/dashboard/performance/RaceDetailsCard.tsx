
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Ruler, Clock, Trophy, AlertTriangle } from "lucide-react";
import { RaceBreeze } from "@/types/performance";

interface RaceDetailsCardProps {
  entry: RaceBreeze;
}

const RaceDetailsCard = ({ entry }: RaceDetailsCardProps) => {
  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-base font-medium">
          {entry.type === 'race' ? 'Race' : 'Breeze'} Details
        </h4>
        <Badge variant={entry.type === 'race' ? 'default' : 'secondary'}>
          {entry.type.toUpperCase()}
        </Badge>
      </div>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3 text-muted-foreground" />
            <span>
              {new Date(entry.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 text-muted-foreground" />
            <span>{entry.track}</span>
          </div>

          <div className="flex items-center gap-2">
            <Ruler className="w-3 h-3 text-muted-foreground" />
            <span>{entry.distance}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Surface:</span>
            <span>{entry.surface}</span>
          </div>
        </div>

        {entry.type === 'race' && (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t text-sm">
            <div className="flex items-center gap-2">
              <Trophy className="w-3 h-3 text-muted-foreground" />
              <span>
                {entry.position} of {entry.totalRunners}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Cond:</span>
              <span>{entry.conditions}</span>
            </div>
          </div>
        )}

        {entry.type === 'breeze' && entry.time && (
          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span>Time: {entry.time}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-2 border-t">
          <div>
            <span className="text-xs font-medium">Performance</span>
            <div className="text-xl font-bold text-blue-600">{entry.performanceScore}</div>
          </div>
          <div>
            <span className="text-xs font-medium">Wellness</span>
            <div className="text-xl font-bold text-amber-600">{entry.wellnessScore}</div>
          </div>
        </div>

        {entry.welfareAlert && (
          <div className="flex items-center gap-2 p-2 bg-red-50 rounded border border-red-200">
            <AlertTriangle className="w-3 h-3 text-red-600" />
            <span className="text-xs font-medium text-red-800">Welfare Alert Active</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RaceDetailsCard;
