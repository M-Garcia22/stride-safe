
import { cn } from "@/lib/utils";
import { getPerformanceColor, getWellnessColor } from "@/lib/colorUtils";

interface ScoreBarProps {
  score: number;
  maxScore: number;
  minScore: number;
  label: string;
  colorStart?: string;
  colorEnd?: string;
  className?: string;
  scoreType?: 'performance' | 'wellness';
}

const ScoreBar = ({ 
  score, 
  maxScore, 
  minScore, 
  label, 
  colorStart, 
  colorEnd, 
  className,
  scoreType 
}: ScoreBarProps) => {
  const percentage = ((score - minScore) / (maxScore - minScore)) * 100;
  
  // Get the color based on score type
  let barColor = '';
  if (scoreType === 'performance') {
    barColor = getPerformanceColor(score);
  } else if (scoreType === 'wellness') {
    barColor = getWellnessColor(score);
  } else if (colorStart && colorEnd) {
    barColor = `linear-gradient(to right, ${colorStart}, ${colorEnd})`;
  } else {
    // Default fallback color
    barColor = '#3B82F6'; // blue-500
  }
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center text-xs">
        <span className="font-medium">{label}</span>
        <span className="font-medium">
          <span className="font-bold">{score}</span>/{maxScore}
        </span>
      </div>
      <div className="relative h-3 rounded-full overflow-hidden bg-gray-200">
        <div 
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
          style={{
            width: `${Math.max(0, Math.min(100, percentage))}%`,
            backgroundColor: scoreType ? barColor : undefined,
            background: !scoreType ? barColor : undefined
          }}
        />
        <div 
          className="absolute top-0 w-2 h-3 bg-white rounded-full border border-gray-400 transform -translate-x-1 transition-all duration-300"
          style={{ left: `${Math.max(0, Math.min(100, percentage))}%` }}
        />
      </div>
    </div>
  );
};

export default ScoreBar;
