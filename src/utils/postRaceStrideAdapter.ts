
import { StrideAnalysis, WelfareReport } from "../data/preRaceData";
import { PostRaceWelfareReport } from "../data/postRaceData";

// Convert post-race stride analysis to pre-race format
export const adaptPostRaceStrideData = (
  postRaceReport: PostRaceWelfareReport,
  horseName: string,
  raceDetails: {
    raceCourse: string;
    surface: string;
    distance: string;
    date: string;
  }
): WelfareReport => {
  const { strideAnalysis } = postRaceReport;
  
  // Generate mock stride curve data based on available metrics
  // Each curve needs to be wrapped in an array for the pre-race format (number[][][])
  const generateCurveData = (baseValue: number, variation: number = 0.1): number[][][] => {
    const curveData = Array.from({ length: 101 }, (_, i) => {
      const x = i;
      const noise = (Math.random() - 0.5) * variation;
      const y = baseValue + Math.sin(i * 0.1) * variation + noise;
      return [x, y];
    });
    return [curveData]; // Wrap in array for pre-race format
  };

  // Create stride data arrays based on post-race metrics
  const dvStraightData = generateCurveData(strideAnalysis.dvStraight * 10, 1.5);
  const dvTurnData = generateCurveData(strideAnalysis.dvTurn * 10, 1.2);
  const symmetryData = generateCurveData(strideAnalysis.symmetryIndex * 8, 1.0);
  const strideLengthData = generateCurveData(strideAnalysis.strideLength, 0.8);
  const strideFrequencyData = generateCurveData(strideAnalysis.strideFrequency * 2, 0.6);

  // Convert to pre-race format
  const adaptedStrideAnalysis: StrideAnalysis = {
    dvStraight: dvStraightData,
    dvTurn: dvTurnData,
    dvDiff: [dvStraightData[0].map((point, i) => [
      point[0],
      point[1] - (dvTurnData[0][i]?.[1] || 0)
    ])],
    lgStraight: symmetryData,
    lgTurn: strideLengthData,
    lgDiff: [symmetryData[0].map((point, i) => [
      point[0],
      point[1] - (strideLengthData[0][i]?.[1] || 0)
    ])],
    mlStraight: strideFrequencyData,
    mlTurn: dvStraightData,
    mlDiff: [strideFrequencyData[0].map((point, i) => [
      point[0],
      point[1] - (dvStraightData[0][i]?.[1] || 0)
    ])]
  };

  // Map post-race welfare status to pre-race format
  const mapWelfareStatus = (status: 'good' | 'warning' | 'alert'): 'good' | 'warning' | 'alert' => {
    return status; // Direct mapping since both use the same type
  };

  // Ensure riskCategory is the correct type (1|2|3|4|5)
  const ensureRiskCategory = (risk: 1 | 2 | 3 | 4 | 5): 1 | 2 | 3 | 4 | 5 => {
    return risk;
  };
  
  return {
    id: postRaceReport.id,
    date: postRaceReport.date,
    raceCourse: raceDetails.raceCourse,
    surface: raceDetails.surface,
    distance: raceDetails.distance,
    welfareStatus: mapWelfareStatus(postRaceReport.welfareStatus),
    riskCategory: ensureRiskCategory(postRaceReport.riskCategory),
    alerts: postRaceReport.alerts,
    strideAnalysis: adaptedStrideAnalysis
  };
};
