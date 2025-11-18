
import EnhancedStrideAnalysisGraphs from "./EnhancedStrideAnalysisGraphs";
import { StrideAnalysis } from "../../../data/preRaceData";

interface StrideAnalysisGraphsProps {
  strideAnalysis: StrideAnalysis;
  raceCourse: string;
  date: string;
  horseName?: string;
  birthMonth?: string;
  yearOfBirth?: number;
  sex?: string;
  color?: string;
  surface?: string;
  distance?: string;
  welfareStatus?: string;
  riskCategory?: string;
  alerts?: string[];
  showHeader?: boolean;
}

const StrideAnalysisGraphs = ({ 
  strideAnalysis, 
  raceCourse, 
  date,
  horseName,
  birthMonth,
  yearOfBirth,
  sex,
  color,
  surface,
  distance,
  welfareStatus,
  riskCategory,
  alerts,
  showHeader
}: StrideAnalysisGraphsProps) => {
  return (
    <EnhancedStrideAnalysisGraphs 
      strideAnalysis={strideAnalysis}
      raceCourse={raceCourse}
      date={date}
      horseName={horseName}
      birthMonth={birthMonth}
      yearOfBirth={yearOfBirth}
      sex={sex}
      color={color}
      surface={surface}
      distance={distance}
      welfareStatus={welfareStatus}
      riskCategory={riskCategory}
      alerts={alerts}
      showHeader={showHeader}
    />
  );
};

export default StrideAnalysisGraphs;
