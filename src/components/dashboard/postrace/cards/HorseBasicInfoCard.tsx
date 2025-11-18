
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { PostRaceHorse } from "../../../../data/postRaceData";

interface HorseBasicInfoCardProps {
  horse: PostRaceHorse;
}

const getFinishPositionBadge = (position: number | null) => {
  if (!position) {
    return <Badge className="bg-black text-white">DNF</Badge>;
  }
  
  const suffix = ['st', 'nd', 'rd'][position - 1] || 'th';
  const positionText = `${position}${suffix}`;
  
  switch (position) {
    case 1:
      return <Badge className="bg-yellow-400 text-yellow-900">{positionText}</Badge>;
    case 2:
      return <Badge className="bg-gray-300 text-gray-800">{positionText}</Badge>;
    case 3:
      return <Badge className="bg-amber-600 text-amber-100">{positionText}</Badge>;
    default:
      return <span className="text-base font-bold">{positionText}</span>;
  }
};

const HorseBasicInfoCard = ({ horse }: HorseBasicInfoCardProps) => {
  const [isConnectionsOpen, setIsConnectionsOpen] = useState(false);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-4 py-3 pb-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg mb-1 truncate">{horse.name}</CardTitle>
            <div className="text-xs text-muted-foreground">
              {new Date(horse.birthDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} • {horse.sex} • {horse.color}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-bold text-primary">Race {horse.raceNumber}</div>
            <div className="text-xs font-semibold text-muted-foreground">Post {horse.postPosition}</div>
            <div className="mt-1">
              {getFinishPositionBadge(horse.finishPosition)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-3 pt-0">
        <Collapsible open={isConnectionsOpen} onOpenChange={setIsConnectionsOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1 hover:bg-muted/50 rounded-md transition-colors">
            <span className="text-xs font-medium">
              {isConnectionsOpen ? 'Hide Connections' : 'Show Connections'}
            </span>
            {isConnectionsOpen ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1">
            <div className="grid grid-cols-1 gap-0.5 text-xs p-1.5 bg-muted/30 rounded-md">
              <div className="flex flex-wrap">
                <span className="text-muted-foreground min-w-0 flex-shrink-0">Jockey:</span>
                <span className="ml-2 font-medium truncate">{horse.jockey}</span>
              </div>
              <div className="flex flex-wrap">
                <span className="text-muted-foreground min-w-0 flex-shrink-0">Trainer:</span>
                <span className="ml-2 font-medium truncate">{horse.trainer}</span>
              </div>
              <div className="flex flex-wrap">
                <span className="text-muted-foreground min-w-0 flex-shrink-0">Owner:</span>
                <span className="ml-2 font-medium truncate">{horse.owner}</span>
              </div>
              <div className="flex flex-wrap">
                <span className="text-muted-foreground min-w-0 flex-shrink-0">Vet:</span>
                <span className="ml-2 font-medium truncate">{horse.vet}</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default HorseBasicInfoCard;
