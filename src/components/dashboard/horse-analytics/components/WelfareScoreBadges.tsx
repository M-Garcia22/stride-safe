
import { getWellnessColor } from "@/lib/colorUtils";

interface WelfareScoreBadgesProps {
  welfareScore: number;
  riskCategory: number;
  columnX: number;
  columnWidth: number;
  markerY: number;
}

const WelfareScoreBadges = ({
  welfareScore,
  riskCategory,
  columnX,
  columnWidth,
  markerY
}: WelfareScoreBadgesProps) => {
  const welfareScoreColor = getWellnessColor(welfareScore);

  return (
    <>      
      {/* Risk Category Badge - Right side - white fill with colored border */}
      <circle
        cx={columnX + columnWidth + 45}
        cy={markerY}
        r={20}
        fill="white"
        stroke={welfareScoreColor}
        strokeWidth={3}
        className="filter drop-shadow-md"
      />
      
      <text
        x={columnX + columnWidth + 45}
        y={markerY}
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xl font-bold fill-black"
      >
        {riskCategory}
      </text>
    </>
  );
};

export default WelfareScoreBadges;
