
import { getFatigueColor } from "@/lib/colorUtils";

interface FatigueScoreBadgeProps {
  fatigueScore: number;
  columnX: number;
  columnWidth: number;
  markerY: number;
}

const FatigueScoreBadge = ({
  fatigueScore,
  columnX,
  columnWidth,
  markerY
}: FatigueScoreBadgeProps) => {
  const fatigueScoreColor = getFatigueColor(fatigueScore);

  return (
    <>
      {/* Fatigue Score Badge - Right side */}
      <rect
        x={columnX + columnWidth + 25}
        y={markerY - 20}
        width={60}
        height={40}
        fill="white"
        stroke={fatigueScoreColor}
        strokeWidth={3}
        rx={6}
        className="filter drop-shadow-md"
      />
      
      <text
        x={columnX + columnWidth + 55}
        y={markerY}
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xl font-bold fill-black"
      >
        {fatigueScore}
      </text>
    </>
  );
};

export default FatigueScoreBadge;
