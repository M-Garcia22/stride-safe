
import { useMemo } from "react";
import { Horse } from "@/types/horse";
import { generateTrendsData } from "@/utils/trendsData";
import FatigueWellnessGraphCard from "./FatigueWellnessGraphCard";

interface HorseOverviewTabProps {
  horse: Horse;
  onTabChange?: (tab: string) => void;
}

const HorseOverviewTab = ({ horse, onTabChange }: HorseOverviewTabProps) => {
  // Generate trends data for the horse
  const trendsData = useMemo(() => generateTrendsData(horse.id), [horse.id]);

  return (
    <div className="space-y-4">
      {/* Full-width Fatigue & Wellness Graph Card */}
      <FatigueWellnessGraphCard 
        horse={horse} 
        trendsData={trendsData}
        onTabChange={onTabChange}
      />
    </div>
  );
};

export default HorseOverviewTab;
