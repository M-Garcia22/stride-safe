
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Calendar, MapPin, Route, Gauge, Activity } from "lucide-react";
import { format, parseISO } from "date-fns";
import ScoreCard from "@/components/dashboard/performance/ScoreCard";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { BaseTrendsEvent } from "./types/trendsChart";

interface ExtendedTrendsEvent extends BaseTrendsEvent {
  surface?: string;
  trackCondition?: string;
  placement?: number;
  jockey?: string;
}

interface TrendsEventDetailsProps {
  event: ExtendedTrendsEvent | undefined;
}

const TrendsEventDetails = ({ event }: TrendsEventDetailsProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!event) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2" />
            <p>Select an event to view details</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <Collapsible open={!isCollapsed} onOpenChange={(open) => setIsCollapsed(!open)}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Event Details</CardTitle>
                <Badge variant={event.type === 'race' ? 'default' : 'secondary'}>
                  {event.type === 'race' ? 'Race' : 'Breeze'}
                </Badge>
              </div>
              {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Score Card */}
            <div>
              <ScoreCard
                performanceScore={event.performanceScore}
                wellnessScore={event.wellnessScore}
                welfareAlert={event.welfareAlert}
              />
            </div>

            <Separator />

            {/* Event Details */}
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Gauge className="h-4 w-4" />
                Event Information
              </h4>
              
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Date:</span>
                  <span>{format(parseISO(event.date), 'MMMM dd, yyyy')}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Location:</span>
                  <span>{event.location}</span>
                </div>

                {event.surface && (
                  <div className="flex items-center gap-2">
                    <Route className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Surface:</span>
                    <span>{event.surface}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Route className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Distance:</span>
                  <span>{event.distance}</span>
                </div>

                {event.trackCondition && (
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Track Condition:</span>
                    <span>{event.trackCondition}</span>
                  </div>
                )}

                {event.type === 'race' && event.placement && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="w-fit">
                      <span className="font-medium">Finish Position:</span>
                      <span className="ml-1">{event.placement}</span>
                    </Badge>
                  </div>
                )}

                {event.type === 'race' && event.jockey && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Jockey:</span>
                    <span>{event.jockey}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Welfare Alert */}
            {event.welfareAlert && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    <h4 className="font-semibold">Welfare Alert</h4>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm">
                    <p className="text-red-800">
                      A welfare alert was identified for this event, indicating an elevated risk of injury. 
                      It is recommended that a veterinarian be consulted for a thorough examination.
                    </p>
                    <p className="text-red-800 mt-2">
                      This welfare alert may also indicate that the horse is not able to perform at its natural ability 
                      and may require additional rest or medical attention.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Additional Statistics Placeholder */}
            <Separator />
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Additional Race Statistics
              </h4>
              <div className="bg-muted/30 rounded-lg p-4 text-center text-muted-foreground">
                <p className="text-sm">Split times, sectional data, and additional performance metrics will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default TrendsEventDetails;
