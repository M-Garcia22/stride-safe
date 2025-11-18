
import { useWelfareColumnConfig } from "./hooks/useWelfareColumnConfig";
import WelfareColumnGradient from "./WelfareColumnGradient";
import WelfareAxisLabels from "./WelfareAxisLabels";
import WelfareScoreBadges from "./WelfareScoreBadges";

interface SimpleWelfareColumnProps {
  welfareScore: number;
  width: number;
  height: number;
}

const SimpleWelfareColumn = ({ welfareScore, width, height }: SimpleWelfareColumnProps) => {
  const config = useWelfareColumnConfig(welfareScore, width, height);

  return (
    <svg width={width} height={height} className="overflow-visible">
      <WelfareColumnGradient />
      
      <WelfareAxisLabels
        riskCategoryMarkers={config.riskCategoryMarkers}
        riskBoundaryMarkers={config.riskBoundaryMarkers}
        columnX={config.columnX}
        columnY={config.columnY}
        columnHeight={config.columnHeight}
        columnWidth={config.columnWidth}
      />
      
      {/* Column background */}
      <rect
        x={config.columnX}
        y={config.columnY}
        width={config.columnWidth}
        height={config.columnHeight}
        fill="url(#welfareColumnGradient)"
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
      
      <WelfareScoreBadges
        welfareScore={welfareScore}
        riskCategory={config.riskCategory}
        columnX={config.columnX}
        columnWidth={config.columnWidth}
        markerY={config.markerY}
      />
    </svg>
  );
};

export default SimpleWelfareColumn;
