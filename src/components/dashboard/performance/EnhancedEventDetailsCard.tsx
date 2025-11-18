
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar, MapPin, Ruler, Clock, Trophy, AlertTriangle, User, Cloud, Eye, ChevronDown } from "lucide-react";
import { RaceBreeze } from "@/types/performance";
import ScoreBar from "./ScoreBar";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface EnhancedEventDetailsCardProps {
  entry: RaceBreeze;
}

const EnhancedEventDetailsCard = ({ entry }: EnhancedEventDetailsCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn(
      "border rounded-lg bg-card",
      entry.welfareAlert && "border-red-300 bg-red-50/30"
    )}>
      {/* Prominent Welfare Alert Banner */}
      {entry.welfareAlert && (
        <div className="bg-red-100 border-b border-red-200 p-2 rounded-t-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-semibold text-red-800">WELFARE ALERT ACTIVE</span>
          </div>
          <p className="text-xs text-red-700 mt-1">This horse requires immediate attention from veterinary staff.</p>
        </div>
      )}

      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant={entry.type === 'race' ? 'default' : 'secondary'} className="text-xs">
            {entry.type.toUpperCase()}
          </Badge>
        </div>

        {/* Compact Event Info - All on One Line */}
        <div className="flex items-center gap-3 text-xs mb-3 flex-wrap">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <span>
              {new Date(entry.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: '2-digit'
              })}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <span>{entry.track}</span>
          </div>

          <div className="flex items-center gap-1">
            <Ruler className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <span>{entry.distance}</span>
          </div>

          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <span>{entry.surface}</span>
          </div>

          {/* Race specific details on same line */}
          {entry.type === 'race' && (
            <>
              <div className="flex items-center gap-1">
                <Trophy className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                <span>{entry.position} of {entry.totalRunners}</span>
              </div>
              {entry.conditions && (
                <div className="flex items-center gap-1">
                  <span className="font-medium text-muted-foreground">Cond:</span>
                  <span>{entry.conditions}</span>
                </div>
              )}
              {entry.weather && (
                <div className="flex items-center gap-1">
                  <Cloud className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  <span>{entry.weather}</span>
                </div>
              )}
              {entry.trackConditions && (
                <div className="flex items-center gap-1">
                  <span className="font-medium text-muted-foreground">Track:</span>
                  <span>{entry.trackConditions}</span>
                </div>
              )}
            </>
          )}

          {/* Breeze specific details on same line */}
          {entry.type === 'breeze' && entry.time && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <span>Time: {entry.time}</span>
            </div>
          )}
        </div>

        {/* Score Bars with Score Clock colors and max score of 140 */}
        <div className="space-y-2 mb-3">
          <ScoreBar
            score={entry.performanceScore}
            minScore={1}
            maxScore={140}
            label="Performance Score"
            scoreType="performance"
          />
          <ScoreBar
            score={entry.wellnessScore}
            minScore={1}
            maxScore={140}
            label="Wellness Score"
            scoreType="wellness"
          />
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="w-full flex items-center justify-center gap-2 py-1.5 hover:bg-muted/50 transition-colors rounded">
            <span className="text-xs text-muted-foreground">
              {isOpen ? 'Show Less' : 'Additional Details'}
            </span>
            <ChevronDown className={cn("w-3 h-3 transition-transform text-muted-foreground", isOpen && "rotate-180")} />
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="pt-3 space-y-3 border-t">
              <div className="text-xs text-muted-foreground">
                <p>Additional race information and extended performance metrics are available in this section. Data includes detailed jockey information, extended race conditions, and comparative analysis with previous performances.</p>
              </div>
              
              {/* Enhanced Details */}
              {entry.jockey && (
                <div className="grid grid-cols-1 gap-1 text-xs">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <span className="font-medium">Jockey:</span>
                    <span className="truncate">{entry.jockey}</span>
                  </div>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default EnhancedEventDetailsCard;
