
import { useMemo } from "react";
import { useChartConfig } from "./useChartConfig";

export const useBarPositions = (
  width: number,
  height: number,
  dataLength: number,
  selectedMetrics: 'both' | 'performance' | 'wellness',
  useTimeBasedPositioning: boolean
) => {
  // Use the same chart config that the bars use - this ensures alignment
  const chartConfig = useChartConfig(width, height, dataLength, selectedMetrics, useTimeBasedPositioning);
  
  return useMemo(() => {
    const { padding, barWidth, barSpacing, groupSpacing, barGroupWidth, chartWidth } = chartConfig;
    
    if (useTimeBasedPositioning && dataLength > 0) {
      // Fixed spacing with centering - oldest (index 0) positioned on far left, most recent on far right
      const totalWidth = dataLength * barGroupWidth + (dataLength - 1) * (groupSpacing || 40);
      const startX = padding.left + Math.max(0, (chartWidth - totalWidth) / 2);
      
      return Array.from({ length: dataLength }, (_, index) => {
        const baseX = startX + index * (barGroupWidth + (groupSpacing || 40));
        
        if (selectedMetrics === 'both') {
          return {
            performance: baseX + barWidth / 2,
            wellness: baseX + barWidth + barSpacing + barWidth / 2
          };
        } else {
          return {
            performance: baseX + barWidth / 2,
            wellness: baseX + barWidth / 2
          };
        }
      });
    } else {
      // Evenly distributed positioning - oldest (index 0) on far left, most recent on far right
      return Array.from({ length: dataLength }, (_, index) => {
        const groupX = padding.left + index * (barGroupWidth + groupSpacing);
        
        if (selectedMetrics === 'both') {
          return {
            performance: groupX + barWidth / 2,
            wellness: groupX + barWidth + barSpacing + barWidth / 2
          };
        } else {
          return {
            performance: groupX + barWidth / 2,
            wellness: groupX + barWidth / 2
          };
        }
      });
    }
  }, [chartConfig, dataLength, selectedMetrics, useTimeBasedPositioning]);
};
