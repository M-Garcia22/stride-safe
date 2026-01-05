
import { useState, useRef, useEffect } from "react";
import { TrendsEvent } from "../types/trendsChart";

export const useTrendsTooltip = (processedData: TrendsEvent[], onEventSelect: (eventId: string) => void) => {
  const [tooltipData, setTooltipData] = useState<any>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (data: any, index: number) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    const eventData = processedData[index];
    if (eventData) {
      hoverTimeoutRef.current = setTimeout(() => {
        // Get current mouse position
        const handleMouseMove = (event: MouseEvent) => {
          setTooltipData(eventData);
          setTooltipPosition({ x: event.clientX, y: event.clientY });
          setShowTooltip(true);
          document.removeEventListener('mousemove', handleMouseMove);
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        
        // Fallback if no mouse move event occurs
        setTimeout(() => {
          document.removeEventListener('mousemove', handleMouseMove);
          if (!showTooltip) {
            setTooltipData(eventData);
            setTooltipPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
            setShowTooltip(true);
          }
        }, 100);
      }, 2000);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setShowTooltip(false);
    setTooltipData(null);
  };

  const handleBarClick = (data: any, index: number) => {
    const eventData = processedData[index];
    if (eventData) {
      onEventSelect(eventData.id);
      // Show tooltip immediately on click at current mouse position
      setTooltipData(eventData);
      // Use current mouse position or fallback to center
      const rect = document.body.getBoundingClientRect();
      setTooltipPosition({ 
        x: rect.width / 2, 
        y: rect.height / 2 
      });
      setShowTooltip(true);
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return {
    tooltipData,
    tooltipPosition,
    showTooltip,
    handleMouseEnter,
    handleMouseLeave,
    handleBarClick
  };
};
