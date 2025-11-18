
import { Horse } from "@/types/horse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ScoreGraphCardProps {
  horse: Horse;
}

const ScoreGraphCard = ({ horse }: ScoreGraphCardProps) => {
  const welfareScore = 88;
  const fatigueScore = 92;

  // Get color based on score for Welfare (Wellness Color Scheme)
  const getWelfareColor = (score: number) => {
    if (score < 80) return 'hsl(142, 76%, 36%)'; // Green
    if (score < 110) return 'hsl(48, 96%, 59%)'; // Yellow/Amber
    return 'hsl(0, 84%, 60%)'; // Red
  };

  // Get color based on score for Fatigue (Fatigue Color Scheme)
  const getFatigueColor = (score: number) => {
    if (score < 60) return 'hsl(217, 91%, 60%)'; // Muted blue
    if (score < 90) return 'hsl(217, 91%, 70%)'; // Medium blue
    return 'hsl(142, 76%, 56%)'; // Bright light green
  };

  // Calculate normalized positions for the scores (0-140 scale)
  const welfarePosition = Math.min((welfareScore / 140) * 100, 100);
  const fatiguePosition = Math.min((fatigueScore / 140) * 100, 100);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Welfare & Fatigue Scores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center gap-8">
          {/* Welfare Score Bar */}
          <div className="flex flex-col items-center space-y-3">
            <span className="text-sm font-medium">Welfare Score</span>
            <div className="relative">
              {/* Full background bar */}
              <div className="w-12 h-48 bg-gradient-to-t from-green-200 via-yellow-200 to-red-200 rounded-full border border-gray-200">
                {/* Score marker */}
                <div 
                  className="absolute w-10 h-4 bg-white border-2 border-gray-400 rounded-md shadow-md transition-all duration-300"
                  style={{ 
                    left: '4px',
                    bottom: `calc(${welfarePosition}% - 8px)`
                  }}
                />
              </div>
              {/* Scale markers */}
              <div className="absolute -left-8 top-0 h-48 flex flex-col justify-between text-xs text-muted-foreground">
                <span>140</span>
                <span>70</span>
                <span>0</span>
              </div>
            </div>
            <Badge 
              style={{ 
                backgroundColor: getWelfareColor(welfareScore),
                color: 'white',
                border: 'none'
              }}
            >
              {welfareScore}
            </Badge>
          </div>

          {/* Fatigue Score Bar */}
          <div className="flex flex-col items-center space-y-3">
            <span className="text-sm font-medium">Fatigue Score</span>
            <div className="relative">
              {/* Full background bar */}
              <div className="w-12 h-48 bg-gradient-to-t from-blue-200 via-blue-300 to-green-200 rounded-full border border-gray-200">
                {/* Score marker */}
                <div 
                  className="absolute w-10 h-4 bg-white border-2 border-gray-400 rounded-md shadow-md transition-all duration-300"
                  style={{ 
                    left: '4px',
                    bottom: `calc(${fatiguePosition}% - 8px)`
                  }}
                />
              </div>
              {/* Scale markers */}
              <div className="absolute -right-8 top-0 h-48 flex flex-col justify-between text-xs text-muted-foreground">
                <span>140</span>
                <span>70</span>
                <span>0</span>
              </div>
            </div>
            <Badge 
              style={{ 
                backgroundColor: getFatigueColor(fatigueScore),
                color: 'white',
                border: 'none'
              }}
            >
              {fatigueScore}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreGraphCard;
