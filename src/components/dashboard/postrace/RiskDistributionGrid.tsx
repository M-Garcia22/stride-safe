
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { PostRaceSensitivitySettings } from "./PostRaceSensitivitySettings";

interface RiskDistribution {
  category: number;
  count: number;
  percentage: number;
  sensitivityLevel: 'low' | 'medium' | 'high';
  isHighlighted: boolean;
}

interface RiskDistributionGridProps {
  riskDistribution: RiskDistribution[];
  percentageChanges: Record<number, number>;
  onDataPointClick: (data: any) => void;
  getBaselineDescription: () => string;
  sensitivitySettings: PostRaceSensitivitySettings;
}

const RiskDistributionGrid = ({ 
  riskDistribution, 
  percentageChanges, 
  onDataPointClick,
  getBaselineDescription,
  sensitivitySettings
}: RiskDistributionGridProps) => {
  const getRiskCategoryColor = (category: number, sensitivityLevel?: 'low' | 'medium' | 'high') => {
    const baseColors = {
      1: '#059669',
      2: '#65a30d',
      3: '#d97706',
      4: '#ea580c',
      5: '#dc2626'
    };
    
    const baseColor = baseColors[category as keyof typeof baseColors];
    
    if (sensitivityLevel === 'high') {
      return baseColor;
    } else if (sensitivityLevel === 'medium') {
      return baseColor + 'CC';
    } else {
      return baseColor + '99';
    }
  };

  return (
    <>
      <div className="grid grid-cols-5 gap-2">
        {riskDistribution.map(({ category, count, percentage, sensitivityLevel, isHighlighted }) => {
          const change = percentageChanges[category] || 0;
          
          return (
            <div key={category} 
                 className={`text-center p-3 rounded-lg border-2 cursor-pointer hover:shadow-md transition-all duration-200 ${
                   isHighlighted ? 'ring-2 ring-red-400 ring-opacity-50 animate-pulse' : ''
                 }`}
                 onClick={() => onDataPointClick({ category, percentage, count })}
                 role="button"
                 tabIndex={0}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter' || e.key === ' ') {
                     e.preventDefault();
                     onDataPointClick({ category, percentage, count });
                   }
                 }}
                 aria-label={`Risk category ${category}: ${percentage.toFixed(1)}% with ${count} horses`}
                 style={{ 
                   borderColor: getRiskCategoryColor(category, sensitivityLevel) + '40',
                   backgroundColor: isHighlighted ? getRiskCategoryColor(category, sensitivityLevel) + '10' : 'transparent'
                 }}>
              <div className="text-xs font-medium text-muted-foreground mb-1">
                Cat {category}
                {sensitivityLevel === 'high' && <span className="ml-1 text-red-500">●</span>}
              </div>
              <div className="text-lg font-bold mb-1" style={{ 
                color: getRiskCategoryColor(category, sensitivityLevel)
              }}>
                {percentage.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground mb-2">{count} horses</div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className={`text-xs px-1.5 py-0.5 flex items-center justify-center gap-1 cursor-help ${
                    Math.abs(change) < 5 ? 'bg-sage-100 text-sage-800 border-sage-200' :
                    change > 0 ? 'bg-red-100 text-red-800 border-red-200' : 'bg-forest-100 text-forest-800 border-forest-200'
                  }`}>
                    {change > 0 ? <TrendingUp className="h-3 w-3" /> : change < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                    <span>{Math.abs(change).toFixed(1)}%</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">
                    Weekly average change vs {getBaselineDescription().replace('vs ', '')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sensitivity: {sensitivityLevel} | Compares today's 7-day rolling average with the baseline period's average
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          );
        })}
      </div>
      <div className="text-xs text-muted-foreground mt-2 text-center">
        {getBaselineDescription()} • Sensitivity: {sensitivitySettings.category5} (Cat 5), {sensitivitySettings.category4} (Cat 4), {sensitivitySettings.category3} (Cat 3)
      </div>
    </>
  );
};

export default RiskDistributionGrid;
