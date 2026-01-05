import { Horse } from "@/types/horse";
import { Report } from "@/types/report";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Info, Loader2 } from "lucide-react";
import VelocityFullRaceInfoDialog from "./VelocityFullRaceInfoDialog";
import VelocityFullRaceMetrics from "./VelocityFullRaceMetrics";
import VelocityFullRaceChart from "./VelocityFullRaceChart";
import { useVelocityData } from "@/hooks/useVelocityData";

interface VelocityFullRaceCardProps {
  horse: Horse;
  selectedReport?: Report | null;
}

const VelocityFullRaceCard = ({ horse, selectedReport }: VelocityFullRaceCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: 350,
    height: 280
  });
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  // Fetch real velocity data if we have an entry code
  const { fullRaceData, metrics, loading, error } = useVelocityData({
    entryCode: selectedReport?.entryCode ?? null,
  });

  // Extract metrics or use defaults
  const timeToPeak = metrics?.timeToPeak ?? 0;
  const velocityAtPeak = metrics?.maxVelocity ?? 0;
  const timeToTarget = metrics?.timeToTarget ?? 0;
  const velocityAtTarget = metrics?.velocityAtTarget ?? 0;

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        const availableWidth = width - 48;
        setDimensions({
          width: Math.max(280, availableWidth),
          height: 280
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="h-48 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (error || !selectedReport?.entryCode) {
      return (
        <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
          {error || "No velocity data available"}
        </div>
      );
    }

    if (fullRaceData.length === 0) {
      return (
        <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
          No velocity data for this race
        </div>
      );
    }

    return (
      <VelocityFullRaceChart 
        data={fullRaceData} 
        timeToPeak={timeToPeak} 
        velocityAtPeak={velocityAtPeak} 
        timeToTarget={timeToTarget} 
        velocityAtTarget={velocityAtTarget} 
      />
    );
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-2 pt-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Velocity - Full Race</CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 p-0 hover:bg-gray-100" 
              onClick={() => setShowInfoDialog(true)}
            >
              <Info className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-4 pt-2">
          <div ref={containerRef} className="space-y-4">
            <VelocityFullRaceMetrics 
              timeToPeak={timeToPeak} 
              velocityAtPeak={velocityAtPeak} 
              timeToTarget={timeToTarget} 
            />
            
            {renderContent()}
            
            <div className="text-xs text-muted-foreground text-center">
              Race Duration (seconds) vs Velocity (fps)
            </div>
          </div>
        </CardContent>
      </Card>

      <VelocityFullRaceInfoDialog open={showInfoDialog} onOpenChange={setShowInfoDialog} />
    </>
  );
};

export default VelocityFullRaceCard;
