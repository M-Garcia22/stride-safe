
import { ChartConfig } from "../types/trendsChart";
import { scoreToPosition } from "../utils/nonLinearScale";
import { getWelfareRiskCategoryColor } from "../utils/welfareRiskUtils";

interface ChartWelfareRiskAxisProps {
  chartConfig: ChartConfig;
  width: number;
}

const ChartWelfareRiskAxis = ({ chartConfig, width }: ChartWelfareRiskAxisProps) => {
  // Updated tick marks at scores 125, 110, 80 without numbers
  const tickMarks = [
    { score: 125 },
    { score: 110 }, 
    { score: 80 }
  ];

  // Position risk category numbers in the center of their ranges - with swapped positions for 1 and 2
  const riskCategoryNumbers = [
    { 
      category: 1, 
      position: scoreToPosition(30), // Moved to lower position (swapped with category 2)
      color: getWelfareRiskCategoryColor(1),
      xOffset: 0
    },
    { 
      category: 2, 
      position: scoreToPosition(50), // Moved to higher position (swapped with category 1)
      color: getWelfareRiskCategoryColor(2),
      xOffset: 0
    },
    { 
      category: 3, 
      position: scoreToPosition(95), // Center of 80-110 range
      color: getWelfareRiskCategoryColor(3),
      xOffset: 0
    },
    { 
      category: 4, 
      position: scoreToPosition(117.5), // Center of 110-125 range
      color: getWelfareRiskCategoryColor(4),
      xOffset: 0
    },
    { 
      category: 5, 
      position: scoreToPosition(132.5), // Center of 125-140 range
      color: getWelfareRiskCategoryColor(5),
      xOffset: 0
    }
  ];

  return (
    <g>
      {/* Left Y-axis line */}
      <line
        x1={chartConfig.padding.left}
        y1={chartConfig.padding.top}
        x2={chartConfig.padding.left}
        y2={chartConfig.padding.top + chartConfig.chartHeight}
        stroke="#6B7280"
        strokeWidth={2}
      />
      
      {/* "Risk Category" axis label - positioned properly within chart area */}
      <text
        x={chartConfig.padding.left - 35}
        y={chartConfig.padding.top + chartConfig.chartHeight / 2}
        textAnchor="middle"
        className="text-sm fill-gray-600 font-medium"
        transform={`rotate(-90, ${chartConfig.padding.left - 35}, ${chartConfig.padding.top + chartConfig.chartHeight / 2})`}
      >
        Risk Category
      </text>
      
      {/* Tick marks at specific scores without numbers */}
      {tickMarks.map(({ score }) => {
        const normalizedPosition = scoreToPosition(score);
        const y = chartConfig.padding.top + (1 - normalizedPosition) * chartConfig.chartHeight;
        
        return (
          <line
            key={score}
            x1={chartConfig.padding.left - 8}
            y1={y}
            x2={chartConfig.padding.left}
            y2={y}
            stroke="#6B7280"
            strokeWidth={1}
          />
        );
      })}
      
      {/* Risk category numbers positioned in range centers - normal font weight */}
      {riskCategoryNumbers.map(({ category, position, color, xOffset }) => {
        const y = chartConfig.padding.top + (1 - position) * chartConfig.chartHeight;
        
        return (
          <text
            key={category}
            x={chartConfig.padding.left - 20 + xOffset}
            y={y + 5}
            textAnchor="middle"
            className="text-sm font-normal"
            fill={color}
          >
            {category}
          </text>
        );
      })}
    </g>
  );
};

export default ChartWelfareRiskAxis;
