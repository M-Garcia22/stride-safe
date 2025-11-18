
import { useMemo } from "react";

export const useBarPositions = (
  width: number,
  height: number,
  dataLength: number,
  selectedMetrics: 'both' | 'performance' | 'wellness',
  useTimeBasedPositioning: boolean
) => {
  return useMemo(() => {
    const padding = { top: 20, right: 20, bottom: 60, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    
    const barSpacing = selectedMetrics === 'both' ? 2 : 0;
    const barWidth = useTimeBasedPositioning 
      ? (selectedMetrics === 'both' ? 32 : 40)
      : (selectedMetrics === 'both' ? Math.max(12, 24) : Math.max(16, 32));
    
    if (useTimeBasedPositioning && dataLength > 0) {
      // Fixed spacing with centering - oldest (index 0) positioned on far left, most recent on far right
      const barGroupWidth = selectedMetrics === 'both' ? barWidth * 2 + barSpacing : barWidth;
      const groupSpacing = 40;
      const totalWidth = dataLength * barGroupWidth + (dataLength - 1) * groupSpacing;
      const startX = padding.left + Math.max(0, (chartWidth - totalWidth) / 2);
      
      return Array.from({ length: dataLength }, (_, index) => {
        // Index 0 (oldest) is positioned at the leftmost position, highest index (most recent) at rightmost
        const baseX = startX + index * (barGroupWidth + groupSpacing);
        
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
      // Original evenly distributed positioning - oldest (index 0) on far left, most recent on far right
      const groupSpacing = Math.max(8, chartWidth * 0.02);
      const barGroupWidth = dataLength > 1 
        ? (chartWidth - (dataLength - 1) * groupSpacing) / dataLength
        : chartWidth * 0.8;

      return Array.from({ length: dataLength }, (_, index) => {
        // Position index 0 (oldest) at the leftmost position, highest index (most recent) at rightmost
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
  }, [width, height, dataLength, selectedMetrics, useTimeBasedPositioning]);
};
