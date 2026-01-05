import { Horse } from "@/types/horse";
import { useHorseHistory } from "@/hooks/useHorseHistory";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import FatigueWellnessGraphCard from "./FatigueWellnessGraphCard";

interface HorseOverviewTabProps {
  horse: Horse;
  onTabChange?: (tab: string) => void;
}

const HorseOverviewTab = ({ horse, onTabChange }: HorseOverviewTabProps) => {
  const { events, loading, error, refetch } = useHorseHistory({
    horseId: horse.id,
    days: 180,
  });

  if (loading) {
    return <LoadingSpinner message="Loading race history..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <div>
            <p className="font-medium text-foreground">Failed to load race history</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
          <Button onClick={refetch} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Full-width Fatigue & Wellness Graph Card */}
      <FatigueWellnessGraphCard 
        horse={horse} 
        trendsData={events}
        onTabChange={onTabChange}
      />
    </div>
  );
};

export default HorseOverviewTab;
