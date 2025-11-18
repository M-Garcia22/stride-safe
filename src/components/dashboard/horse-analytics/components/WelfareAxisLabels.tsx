
import { scoreToPosition } from "../utils/nonLinearScale";

interface WelfareAxisLabelsProps {
  riskCategoryMarkers: Array<{
    category: number;
    centerScore: number;
    color: string;
  }>;
  riskBoundaryMarkers: number[];
  columnX: number;
  columnY: number;
  columnHeight: number;
  columnWidth: number;
}

const WelfareAxisLabels = ({
  riskCategoryMarkers,
  riskBoundaryMarkers,
  columnX,
  columnY,
  columnHeight,
  columnWidth
}: WelfareAxisLabelsProps) => {
  return (
    <>
      {/* Risk category boundary markers at 125, 110, 80 - moved to left side */}
      {riskBoundaryMarkers.map(score => {
        const normalizedPosition = scoreToPosition(score);
        const y = columnY + columnHeight - (normalizedPosition * columnHeight);
        
        return (
          <line
            key={`boundary-${score}`}
            x1={columnX - 8}
            y1={y}
            x2={columnX}
            y2={y}
            stroke="#6B7280"
            strokeWidth={1}
          />
        );
      })}
      
      {/* Risk category numbers positioned between boundaries - moved to left side */}
      {riskCategoryMarkers.map(({ category, centerScore }) => {
        const normalizedPosition = scoreToPosition(centerScore);
        const y = columnY + columnHeight - (normalizedPosition * columnHeight);
        
        return (
          <text
            key={category}
            x={columnX - 12}
            y={y + 4}
            textAnchor="end"
            className="text-xs font-normal fill-gray-500"
          >
            {category}
          </text>
        );
      })}
    </>
  );
};

export default WelfareAxisLabels;
