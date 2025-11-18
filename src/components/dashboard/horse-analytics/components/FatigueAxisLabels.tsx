
import { scoreToPosition } from "../utils/nonLinearScale";

interface FatigueAxisLabelsProps {
  scoreMarkers: number[];
  columnX: number;
  columnY: number;
  columnHeight: number;
}

const FatigueAxisLabels = ({
  scoreMarkers,
  columnX,
  columnY,
  columnHeight
}: FatigueAxisLabelsProps) => {
  return (
    <>
      {scoreMarkers.map(score => {
        const normalizedPosition = scoreToPosition(score);
        const y = columnY + columnHeight - (normalizedPosition * columnHeight);
        
        return (
          <g key={score}>
            {/* Tick mark */}
            <line
              x1={columnX - 8}
              y1={y}
              x2={columnX}
              y2={y}
              stroke="#6B7280"
              strokeWidth={1}
            />
            {/* Score label */}
            <text
              x={columnX - 12}
              y={y + 4}
              textAnchor="end"
              className="text-xs fill-gray-500 font-normal"
            >
              {score}
            </text>
          </g>
        );
      })}
    </>
  );
};

export default FatigueAxisLabels;
