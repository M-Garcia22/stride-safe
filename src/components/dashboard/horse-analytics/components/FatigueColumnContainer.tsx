
import { useState, useEffect, useRef } from "react";
import FatigueColumnChart from "./FatigueColumnChart";

interface FatigueColumnContainerProps {
  fatigueScore: number;
  className?: string;
}

const FatigueColumnContainer = ({ fatigueScore, className }: FatigueColumnContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 200 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(200, width),
          height: 200
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div ref={containerRef} className={className}>
      <FatigueColumnChart
        fatigueScore={fatigueScore}
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  );
};

export default FatigueColumnContainer;
