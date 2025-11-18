
import { Horse } from "@/types/horse";
import { Report } from "@/types/report";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RaceDetailsCard from "./components/RaceDetailsCard";
import WelfareScoreCard from "./components/WelfareScoreCard";
import FatigueScoreCard from "./components/FatigueScoreCard";
import WelfareAlertCard from "./components/WelfareAlertCard";
import VelocityTenSecondsCard from "./components/VelocityTenSecondsCard";
import VelocityFullRaceCard from "./components/VelocityFullRaceCard";

interface LastReportTabProps {
  horse: Horse;
  selectedReport?: Report | null;
}

const LastReportTab = ({ horse, selectedReport }: LastReportTabProps) => {
  return (
    <div className="space-y-4">
      {/* Race Details Card - Full width */}
      <RaceDetailsCard horse={horse} selectedReport={selectedReport} />
      
      {/* Score Cards and Welfare Alert Card - Three columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <WelfareScoreCard horse={horse} selectedReport={selectedReport} />
        <FatigueScoreCard horse={horse} selectedReport={selectedReport} />
        <WelfareAlertCard horse={horse} selectedReport={selectedReport} />
      </div>
      
      {/* Velocity Cards - Side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <VelocityTenSecondsCard horse={horse} />
        <VelocityFullRaceCard horse={horse} />
      </div>
    </div>
  );
};

export default LastReportTab;
