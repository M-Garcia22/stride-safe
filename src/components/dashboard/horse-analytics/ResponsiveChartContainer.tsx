
import { ReactNode, useEffect, useRef, useState } from "react";

interface ResponsiveChartContainerProps {
  children: (dimensions: { width: number; height: number }) => ReactNode;
  className?: string;
  minHeight?: number;
  maxHeight?: number;
  aspectRatio?: number;
}

const ResponsiveChartContainer = ({
  children,
  className = "",
  minHeight = 300,
  maxHeight = 400,
  aspectRatio
}: ResponsiveChartContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 350 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        
        // Calculate height based on container constraints
        let height = containerHeight > 0 && containerHeight < maxHeight
          ? Math.max(minHeight, containerHeight)
          : aspectRatio 
            ? Math.min(maxHeight, Math.max(minHeight, containerWidth / aspectRatio))
            : Math.min(maxHeight, Math.max(minHeight, containerWidth * 0.4));
        
        // Ensure height stays within bounds
        height = Math.max(minHeight, Math.min(maxHeight, height));
        
        setDimensions({
          width: containerWidth,
          height: height
        });
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [aspectRatio, minHeight, maxHeight]);

  return (
    <div ref={containerRef} className={`w-full h-full ${className}`} style={{ maxHeight }}>
      {children(dimensions)}
    </div>
  );
};

export default ResponsiveChartContainer;
