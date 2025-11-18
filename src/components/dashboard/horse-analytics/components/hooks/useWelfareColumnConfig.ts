
import { useMemo } from "react";
import { scoreToPosition } from "../../utils/nonLinearScale";
import { getWelfareRiskCategory, getWelfareRiskCategoryColor } from "../../utils/welfareRiskUtils";

interface WelfareColumnConfig {
  padding: number;
  columnWidth: number;
  columnHeight: number;
  columnX: number;
  columnY: number;
  markerY: number;
  riskCategory: number;
  riskCategoryMarkers: Array<{
    category: number;
    centerScore: number;
    color: string;
  }>;
  riskBoundaryMarkers: number[];
}

export const useWelfareColumnConfig = (
  welfareScore: number,
  width: number,
  height: number
): WelfareColumnConfig => {
  return useMemo(() => {
    const padding = 15;
    const columnWidth = Math.min(80, width - padding * 4);
    const columnHeight = height - padding * 3; // Reduced from padding * 2 to add more bottom padding
    
    // Proper centering: center the column within the available chart area
    const chartWidth = width - 2 * padding;
    const columnX = padding + (chartWidth - columnWidth) / 2;
    const columnY = padding;
    
    // Calculate marker position using non-linear scale
    const normalizedScore = scoreToPosition(welfareScore);
    const markerY = columnY + columnHeight - (normalizedScore * columnHeight);
    
    const riskCategory = getWelfareRiskCategory(welfareScore);
    
    // Risk boundary markers at new category thresholds
    const riskBoundaryMarkers = [116, 102, 70];
    
    // Risk category markers positioned at the center of each range
    const riskCategoryMarkers = [
      { category: 5, centerScore: 128, color: getWelfareRiskCategoryColor(5) },   // Between 116-140, center = (116+140)/2 = 128
      { category: 4, centerScore: 108.5, color: getWelfareRiskCategoryColor(4) }, // Between 102-115, center = (102+115)/2 = 108.5
      { category: 3, centerScore: 85.5, color: getWelfareRiskCategoryColor(3) },  // Between 70-101, center = (70+101)/2 = 85.5
      { category: 2, centerScore: 60, color: getWelfareRiskCategoryColor(2) },    // Below 70, upper position
      { category: 1, centerScore: 50, color: getWelfareRiskCategoryColor(1) }     // Below 70, lower position
    ];
    
    return { 
      padding, 
      columnWidth, 
      columnHeight, 
      columnX, 
      columnY, 
      markerY, 
      riskCategory,
      riskCategoryMarkers,
      riskBoundaryMarkers
    };
  }, [welfareScore, width, height]);
};
