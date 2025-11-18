
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface WellnessScoreCardProps {
  currentScore: number;
  previousScore: number;
  riskCategory: number;
}

const WellnessScoreCard = ({ currentScore, previousScore, riskCategory }: WellnessScoreCardProps) => {
  const scoreDiff = currentScore - previousScore;
  const percentChange = Math.abs((scoreDiff / previousScore) * 100);
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getRiskCategoryColor = (category: number) => {
    if (category <= 2) return "bg-green-100 text-green-800";
    if (category <= 3) return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800";
  };

  const getStatusText = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Attention";
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Current Wellness Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className={`text-4xl font-bold ${getScoreColor(currentScore)}`}>
              {currentScore}
            </div>
            <p className="text-sm text-muted-foreground">{getStatusText(currentScore)}</p>
          </div>
          <div className="text-right">
            <Badge className={getRiskCategoryColor(riskCategory)}>
              Risk Cat {riskCategory}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          {scoreDiff > 0 ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
          ) : scoreDiff < 0 ? (
            <TrendingDown className="w-4 h-4 text-red-600" />
          ) : (
            <Minus className="w-4 h-4 text-gray-500" />
          )}
          <span className={scoreDiff > 0 ? "text-green-600" : scoreDiff < 0 ? "text-red-600" : "text-gray-500"}>
            {scoreDiff > 0 ? "+" : ""}{scoreDiff.toFixed(1)} ({percentChange.toFixed(1)}%)
          </span>
          <span className="text-muted-foreground">vs last month</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default WellnessScoreCard;
