
import { useMemo } from "react";
import { ChartConfig } from "../types/trendsChart";

export const useChartConfig = (
  width: number,
  height: number,
  dataLength: number,
  selectedMetrics: 'both' | 'performance' | 'wellness',
  useTimeBasedPositioning: boolean = false
): ChartConfig => {
  return useMemo(() => {
    // Bottom padding increased to accommodate date labels below risk category badges
    const padding = { top: 40, right: 60, bottom: 60, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    let groupSpacing, barWidth, barGroupWidth;
    const barSpacing = selectedMetrics === 'both' ? 2 : 0;
    
    if (useTimeBasedPositioning && dataLength > 0) {
      // Time-based positioning with proportional spacing - increased bar width
      barWidth = selectedMetrics === 'both' ? 32 : 40; // Increased from 24/32
      barGroupWidth = selectedMetrics === 'both' ? barWidth * 2 + barSpacing : barWidth;
      groupSpacing = 0; // Will be calculated based on time differences
    } else {
      // Original evenly distributed approach - increased bar width
      if (dataLength <= 1) {
        barWidth = selectedMetrics === 'both' ? 40 : 48; // Increased from 32/40
        barGroupWidth = barWidth;
        groupSpacing = 0;
      } else {
        groupSpacing = Math.max(8, chartWidth * 0.02);
        const availableWidth = chartWidth - (dataLength - 1) * groupSpacing;
        barGroupWidth = availableWidth / dataLength;
        barWidth = selectedMetrics === 'both' 
          ? Math.max(16, (barGroupWidth - barSpacing) / 2) // Increased minimum from 12
          : Math.max(20, barGroupWidth * 0.8); // Increased minimum from 16
      }
    }

    return {
      padding,
      chartWidth,
      chartHeight,
      barWidth: Math.max(12, barWidth), // Increased minimum from 8
      groupSpacing,
      barSpacing,
      barGroupWidth,
      useTimeBasedPositioning
    };
  }, [width, height, dataLength, selectedMetrics, useTimeBasedPositioning]);
};
