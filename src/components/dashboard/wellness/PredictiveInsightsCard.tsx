
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, Calendar, Activity } from "lucide-react";

interface PredictiveInsightsCardProps {
  riskAssessment: 'low' | 'medium' | 'high';
  nextExamDate: string;
  recommendations: string[];
}

const PredictiveInsightsCard = ({ riskAssessment, nextExamDate, recommendations }: PredictiveInsightsCardProps) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return "bg-green-100 text-green-800";
      case 'medium':
        return "bg-amber-100 text-amber-800";
      case 'high':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'medium':
        return <Activity className="w-4 h-4 text-amber-600" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Predictive Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getRiskIcon(riskAssessment)}
            <span className="font-medium">Risk Assessment</span>
          </div>
          <Badge className={getRiskColor(riskAssessment)}>
            {riskAssessment.toUpperCase()} RISK
          </Badge>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Next Examination
          </h4>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Recommended Date:</span>
            <span className="font-medium">{new Date(nextExamDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium text-sm mb-3">Recommended Actions</h4>
          <div className="space-y-2">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            Schedule Exam
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            Generate Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictiveInsightsCard;
