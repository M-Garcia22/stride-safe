
import { useMemo } from "react";
import { scoreToPosition } from "../../utils/nonLinearScale";

interface FatigueColumnConfig {
  padding: number;
  columnWidth: number;
  columnHeight: number;
  columnX: number;
  columnY: number;
  markerY: number;
  scoreMarkers: number[];
}

export const useFatigueColumnConfig = (
  fatigueScore: number,
  width: number,
  height: number
): FatigueColumnConfig => {
  return useMemo(() => {
    const padding = 15;
    const columnWidth = Math.min(80, width - padding * 4);
    const columnHeight = height - padding * 3;
    
    // Proper centering: center the column within the available chart area
    const chartWidth = width - 2 * padding;
    const columnX = padding + (chartWidth - columnWidth) / 2;
    const columnY = padding;
    
    // Calculate marker position using non-linear scale
    const normalizedScore = scoreToPosition(fatigueScore);
    const markerY = columnY + columnHeight - (normalizedScore * columnHeight);
    
    // Y-axis score markers
    const scoreMarkers = [140, 120, 100, 80, 60, 40, 20, 1];
    
    return { 
      padding, 
      columnWidth, 
      columnHeight, 
      columnX, 
      columnY, 
      markerY, 
      scoreMarkers
    };
  }, [fatigueScore, width, height]);
};
