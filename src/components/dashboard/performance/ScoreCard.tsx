
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle } from "lucide-react";

interface ScoreCardProps {
  performanceScore: number;
  wellnessScore: number;
  welfareAlert?: boolean;
}

const ScoreCard = ({ performanceScore, wellnessScore, welfareAlert }: ScoreCardProps) => {
  const getScoreColor = (score: number, type: 'performance' | 'wellness') => {
    if (type === 'performance') {
      if (score >= 115) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      if (score >= 90) return 'bg-gradient-to-r from-orange-400 to-orange-600';
      if (score >= 70) return 'bg-gradient-to-r from-blue-400 to-blue-600';
      return 'bg-gradient-to-r from-gray-400 to-gray-600';
    } else {
      if (score >= 115) return 'bg-gradient-to-r from-cyan-400 to-cyan-600';
      if (score >= 90) return 'bg-gradient-to-r from-teal-400 to-teal-600';
      if (score >= 70) return 'bg-gradient-to-r from-blue-400 to-blue-600';
      return 'bg-gradient-to-r from-gray-400 to-gray-600';
    }
  };

  const getPerformancePercentage = (score: number) => (score / 140) * 100;
  const getWellnessPercentage = (score: number) => (score / 140) * 100;

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Performance Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Performance Score</span>
            <span className="text-sm font-bold">{performanceScore}</span>
          </div>
          <div className="relative">
            <Progress value={getPerformancePercentage(performanceScore)} className="h-3" />
            <div 
              className={`absolute top-0 left-0 h-3 rounded-full ${getScoreColor(performanceScore, 'performance')}`}
              style={{ width: `${getPerformancePercentage(performanceScore)}%` }}
            />
          </div>
        </div>

        {/* Wellness Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Wellness Score</span>
            <span className="text-sm font-bold">{wellnessScore}</span>
          </div>
          <div className="relative">
            <Progress value={getWellnessPercentage(wellnessScore)} className="h-3" />
            <div 
              className={`absolute top-0 left-0 h-3 rounded-full ${getScoreColor(wellnessScore, 'wellness')}`}
              style={{ width: `${getWellnessPercentage(wellnessScore)}%` }}
            />
          </div>
        </div>

        {/* Welfare Alert Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Welfare Alert</span>
            {welfareAlert && <AlertTriangle className="h-4 w-4 text-red-500" />}
          </div>
          <div className={`h-3 rounded-full ${welfareAlert ? 'bg-red-500' : 'bg-gray-200'}`} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreCard;
