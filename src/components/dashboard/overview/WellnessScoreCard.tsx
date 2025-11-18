
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import ScoreBar from "@/components/dashboard/performance/ScoreBar";

interface WellnessScoreCardProps {
  currentWellnessScore: number;
  wellnessLastUpdated: string;
}

const WellnessScoreCard = ({
  currentWellnessScore,
  wellnessLastUpdated
}: WellnessScoreCardProps) => {
  return (
    <Card className="border-cyan-200 bg-gradient-to-br from-cyan-50/80 to-blue-50/80">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-cyan-800">Wellness Score</CardTitle>
        <Heart className="h-4 w-4 text-cyan-700" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-2xl font-bold text-cyan-800">{currentWellnessScore}</div>
        
        <div className="space-y-2">
          <ScoreBar
            score={currentWellnessScore}
            maxScore={140}
            minScore={1}
            label="Wellness Score"
            scoreType="wellness"
            className="w-full"
          />
        </div>
        
        <p className="text-xs text-cyan-600 font-medium">
          Last report: {wellnessLastUpdated}
        </p>
      </CardContent>
    </Card>
  );
};

export default WellnessScoreCard;
