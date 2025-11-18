
import { cn } from "@/lib/utils";
import { getWellnessColor, getPerformanceColor } from "@/lib/colorUtils";

interface TripleRingsProps {
  size?: 'small' | 'large';
  performanceScore: number;
  welfareAlert?: boolean;
  wellnessScore?: number; // 1-140, how good the wellness is
  performanceRingScore?: number; // 1-140, how good the performance is
  paddockMode?: boolean;
  className?: string;
  daysSinceLastReport?: number;
}

const TripleRings = ({ 
  size = 'large', 
  performanceScore, 
  welfareAlert = false, 
  wellnessScore = 50, 
  performanceRingScore = 50,
  paddockMode = false,
  className,
  daysSinceLastReport = 0
}: TripleRingsProps) => {
  const isSmall = size === 'small';
  const ringSize = isSmall ? 'w-8 h-8' : 'w-24 h-24';
  const centerSize = isSmall ? 'text-xs' : 'text-xl font-bold';
  const strokeWidth = isSmall ? 2 : 4;

  // Calculate ring states based on Score Clock requirements
  const welfareRingColor = paddockMode ? '#D1D5DB' : (welfareAlert ? '#EF4444' : '#D1D5DB');
  const wellnessRingColor = paddockMode ? '#D1D5DB' : getWellnessColor(wellnessScore);
  const performanceRingColor = paddockMode ? '#D1D5DB' : getPerformanceColor(performanceRingScore);

  // Calculate completion percentages based on 1-140 scale
  const wellnessCompletion = paddockMode ? 0 : (wellnessScore / 140);
  const performanceCompletion = paddockMode ? 0 : (performanceRingScore / 140);

  // Calculate circumferences and dash arrays
  const outerRadius = isSmall ? 15 : 45;
  const middleRadius = isSmall ? 11 : 33;
  const innerRadius = isSmall ? 7 : 21;
  
  const middleCircumference = 2 * Math.PI * middleRadius;
  const innerCircumference = 2 * Math.PI * innerRadius;
  
  const wellnessDashArray = `${middleCircumference * wellnessCompletion} ${middleCircumference}`;
  const performanceDashArray = `${innerCircumference * performanceCompletion} ${innerCircumference}`;

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg className={ringSize} viewBox={isSmall ? "0 0 32 32" : "0 0 96 96"}>
        {/* Outer ring - Welfare (background) */}
        <circle
          cx={isSmall ? "16" : "48"}
          cy={isSmall ? "16" : "48"}
          r={outerRadius}
          fill="none"
          stroke="#F3F4F6"
          strokeWidth={strokeWidth}
          className="drop-shadow-sm"
        />
        
        {/* Welfare Alert Background Fill - Light red hue inside outer ring */}
        {welfareAlert && !paddockMode && (
          <circle
            cx={isSmall ? "16" : "48"}
            cy={isSmall ? "16" : "48"}
            r={outerRadius - strokeWidth / 2}
            fill="#FEE2E2"
            stroke="none"
            className="opacity-60"
          />
        )}
        
        {/* Outer ring - Welfare (foreground) */}
        {welfareAlert && !paddockMode && (
          <circle
            cx={isSmall ? "16" : "48"}
            cy={isSmall ? "16" : "48"}
            r={outerRadius}
            fill="none"
            stroke={welfareRingColor}
            strokeWidth={strokeWidth}
            className="drop-shadow-sm brightness-125"
          />
        )}
        
        {/* Middle ring - Wellness (background) */}
        <circle
          cx={isSmall ? "16" : "48"}
          cy={isSmall ? "16" : "48"}
          r={middleRadius}
          fill="none"
          stroke="#F3F4F6"
          strokeWidth={strokeWidth}
          className="drop-shadow-sm"
        />
        
        {/* Middle ring - Wellness (foreground) - opens/closes based on wellness score */}
        <circle
          cx={isSmall ? "16" : "48"}
          cy={isSmall ? "16" : "48"}
          r={middleRadius}
          fill="none"
          stroke={wellnessRingColor}
          strokeWidth={strokeWidth}
          strokeDasharray={wellnessDashArray}
          strokeLinecap="round"
          className="drop-shadow-sm brightness-125"
          transform={`rotate(-90 ${isSmall ? "16 16" : "48 48"})`}
          style={{ transition: 'stroke-dasharray 0.3s ease, stroke 0.3s ease' }}
        />
        
        {/* Inner ring - Performance (background) */}
        <circle
          cx={isSmall ? "16" : "48"}
          cy={isSmall ? "16" : "48"}
          r={innerRadius}
          fill="none"
          stroke="#F3F4F6"
          strokeWidth={strokeWidth}
          className="drop-shadow-sm"
        />
        
        {/* Inner ring - Performance (foreground) - blue to gold based on performance score */}
        <circle
          cx={isSmall ? "16" : "48"}
          cy={isSmall ? "16" : "48"}
          r={innerRadius}
          fill="none"
          stroke={performanceRingColor}
          strokeWidth={strokeWidth}
          strokeDasharray={performanceDashArray}
          strokeLinecap="round"
          className="drop-shadow-sm brightness-125"
          transform={`rotate(-90 ${isSmall ? "16 16" : "48 48"})`}
          style={{ transition: 'stroke-dasharray 0.3s ease, stroke 0.3s ease' }}
        />
      </svg>
      
      {/* Days Count in Center for large version */}
      {!isSmall && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(centerSize, paddockMode ? "text-gray-400" : "text-foreground")}>
            {paddockMode ? "N/A" : daysSinceLastReport}
          </span>
        </div>
      )}
      
      {/* Small version shows days count next to rings */}
      {isSmall && (
        <span className={cn("ml-2 text-xs font-medium", paddockMode ? "text-gray-400" : "text-foreground")}>
          {paddockMode ? "N/A" : daysSinceLastReport}
        </span>
      )}
    </div>
  );
};

export default TripleRings;
