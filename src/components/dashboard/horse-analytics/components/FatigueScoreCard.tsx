
import { Horse } from "@/types/horse";
import { Report } from "@/types/report";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SimpleFatigueColumn from "./SimpleFatigueColumn";
import { useState, useEffect, useRef } from "react";
import { Info } from "lucide-react";
import FatigueInfoDialog from "./FatigueInfoDialog";

interface FatigueScoreCardProps {
  horse: Horse;
  selectedReport?: Report | null;
}

const FatigueScoreCard = ({ horse, selectedReport }: FatigueScoreCardProps) => {
  // Use selected report data if available, otherwise fall back to mock data
  const fatigueScore = selectedReport ? selectedReport.fatigueScore : 92;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 350, height: 280 });
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        // Account for CardContent padding (24px on each side = 48px total)
        const availableWidth = width - 48;
        // Use exact same width control as WelfareScoreCard
        setDimensions({
          width: Math.max(280, Math.min(350, availableWidth)),
          height: 280
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <>
      <Card className="max-w-sm">
        <CardHeader className="pb-2 pt-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Fatigue-Performance Score</CardTitle>
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
        <CardContent className="pb-4">
          <div ref={containerRef} className="h-64 w-full">
            <SimpleFatigueColumn 
              fatigueScore={fatigueScore}
              width={dimensions.width}
              height={dimensions.height}
            />
          </div>
        </CardContent>
      </Card>

      <FatigueInfoDialog 
        open={showInfoDialog} 
        onOpenChange={setShowInfoDialog} 
      />
    </>
  );
};

export default FatigueScoreCard;
