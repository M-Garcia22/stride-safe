
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { PostRaceHorse, RaceData } from "../../../data/postRaceData";

interface RaceDataCardProps {
  horse: PostRaceHorse;
  raceData?: RaceData;
}

const RaceDataCard = ({ horse, raceData }: RaceDataCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!raceData) {
    return null;
  }

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors px-4 py-3">
            <CardTitle className="text-base flex items-center justify-between">
              Race Data
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="px-4 pb-3 pt-0 space-y-4">
            {/* Race Information */}
            <div>
              <h4 className="font-medium mb-2 text-sm">Race Information</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground text-xs">Race Name:</span>
                  <span className="ml-2 font-medium">{raceData.raceName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Distance:</span>
                  <span className="ml-2 font-medium">{raceData.distance}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Surface:</span>
                  <span className="ml-2 font-medium capitalize">{raceData.surface}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Start Time:</span>
                  <span className="ml-2 font-medium">{raceData.startTime}</span>
                </div>
              </div>
            </div>

            {/* Track Conditions */}
            <div>
              <h4 className="font-medium mb-2 text-sm">Track Conditions</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground text-xs">Track Condition:</span>
                  <span className="ml-2 font-medium capitalize">{raceData.conditions.trackCondition}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Weather:</span>
                  <span className="ml-2 font-medium capitalize">{raceData.conditions.weather}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Temperature:</span>
                  <span className="ml-2 font-medium">{raceData.conditions.temperature}°F</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Wind:</span>
                  <span className="ml-2 font-medium">{raceData.conditions.windSpeed} mph {raceData.conditions.windDirection}</span>
                </div>
              </div>
            </div>

            {/* Individual Performance */}
            <div>
              <h4 className="font-medium mb-2 text-sm">Individual Performance</h4>
              
              {horse.splitTimes && (
                <div className="mb-3">
                  <h5 className="text-xs font-medium mb-1.5 text-muted-foreground">Split Times</h5>
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground text-xs">1/4:</span>
                      <span className="ml-1 font-medium">{horse.splitTimes.quarter1}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs">1/2:</span>
                      <span className="ml-1 font-medium">{horse.splitTimes.half}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs">3/4:</span>
                      <span className="ml-1 font-medium">{horse.splitTimes.threeQuarter}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs">Final:</span>
                      <span className="ml-1 font-medium">{horse.splitTimes.final}</span>
                    </div>
                  </div>
                </div>
              )}

              {horse.speed && (
                <div>
                  <h5 className="text-xs font-medium mb-1.5 text-muted-foreground">Speed Analysis</h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground text-xs">Average Speed:</span>
                      <span className="ml-2 font-medium">{horse.speed.averageSpeed} mph</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs">Top Speed:</span>
                      <span className="ml-2 font-medium">{horse.speed.topSpeed} mph</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default RaceDataCard;
