import { Horse } from "@/types/horse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Info } from "lucide-react";
import VelocityFullRaceInfoDialog from "./VelocityFullRaceInfoDialog";
import VelocityFullRaceMetrics from "./VelocityFullRaceMetrics";
import VelocityFullRaceChart from "./VelocityFullRaceChart";
import { useVelocityFullRaceData } from "./hooks/useVelocityFullRaceData";
interface VelocityFullRaceCardProps {
  horse: Horse;
}
const VelocityFullRaceCard = ({
  horse
}: VelocityFullRaceCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: 350,
    height: 280
  });
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const {
    fullRaceData,
    timeToPeak,
    velocityAtPeak,
    timeToTarget,
    velocityAtTarget
  } = useVelocityFullRaceData();
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const {
          width
        } = containerRef.current.getBoundingClientRect();
        // Account for CardContent padding (24px on each side = 48px total)
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
  return <>
      <Card className="w-full">
        <CardHeader className="pb-2 pt-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Velocity - Full Race </CardTitle>
            <Button variant="ghost" size="icon" className="h-6 w-6 p-0 hover:bg-gray-100" onClick={() => setShowInfoDialog(true)}>
              <Info className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-4 pt-2">
          <div ref={containerRef} className="space-y-4">
            <VelocityFullRaceMetrics timeToPeak={timeToPeak} velocityAtPeak={velocityAtPeak} timeToTarget={timeToTarget} />
            
            <VelocityFullRaceChart data={fullRaceData} timeToPeak={timeToPeak} velocityAtPeak={velocityAtPeak} timeToTarget={timeToTarget} velocityAtTarget={velocityAtTarget} />
            
            <div className="text-xs text-muted-foreground text-center">
              Race Duration (seconds) vs Velocity (fps)
            </div>
          </div>
        </CardContent>
      </Card>

      <VelocityFullRaceInfoDialog open={showInfoDialog} onOpenChange={setShowInfoDialog} />
    </>;
};
export default VelocityFullRaceCard;