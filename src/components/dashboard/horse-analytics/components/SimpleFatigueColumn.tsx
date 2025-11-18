
import { useFatigueColumnConfig } from "./hooks/useFatigueColumnConfig";
import FatigueColumnGradient from "./FatigueColumnGradient";
import FatigueAxisLabels from "./FatigueAxisLabels";
import FatigueScoreBadge from "./FatigueScoreBadge";

interface SimpleFatigueColumnProps {
  fatigueScore: number;
  width: number;
  height: number;
}

const SimpleFatigueColumn = ({ fatigueScore, width, height }: SimpleFatigueColumnProps) => {
  const config = useFatigueColumnConfig(fatigueScore, width, height);

  return (
    <svg width={width} height={height} className="overflow-visible">
      <FatigueColumnGradient />
      
      {/* Y-axis score markers */}
      <FatigueAxisLabels
        scoreMarkers={config.scoreMarkers}
        columnX={config.columnX}
        columnY={config.columnY}
        columnHeight={config.columnHeight}
      />
      
      {/* Column background */}
      <rect
        x={config.columnX}
        y={config.columnY}
        width={config.columnWidth}
        height={config.columnHeight}
        fill="url(#fatigueColumnGradient)"
        rx={4}
        className="filter drop-shadow-sm"
      />
      
      {/* Score marker line */}
      <rect
        x={config.columnX}
        y={config.markerY - 3}
        width={config.columnWidth}
        height={6}
        fill="white"
        rx={1}
        className="filter drop-shadow-sm"
      />
      
      {/* Fatigue Score Badge */}
      <FatigueScoreBadge
        fatigueScore={fatigueScore}
        columnX={config.columnX}
        columnWidth={config.columnWidth}
        markerY={config.markerY}
      />
    </svg>
  );
};

export default SimpleFatigueColumn;
