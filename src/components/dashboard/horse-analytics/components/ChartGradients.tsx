
import { getPerformanceColor, getWellnessColor } from "@/lib/colorUtils";

const ChartGradients = () => {
  const createPerformanceGradientStops = () => {
    const stops = [];
    for (let i = 0; i <= 10; i++) {
      const score = 1 + (i * 139 / 10); // Convert to 1-140 range
      const color = getPerformanceColor(score);
      stops.push(
        <stop key={i} offset={`${i * 10}%`} stopColor={color} />
      );
    }
    return stops;
  };

  const createWelfareGradientStops = () => {
    const stops = [];
    
    // Create more stops for better color transition with lighter, pastel colors
    // Scores 1-80: Light Green to Light Yellow (prominent green section - 57% of the gradient)
    for (let i = 0; i <= 8; i++) {
      const score = 1 + (i * 79 / 8); // 1 to 80
      const normalizedPosition = (score - 1) / 139; // Normalize to 0-1
      const factor = i / 8; // 0 to 1 for green to yellow transition
      
      // Light Green to Light Yellow interpolation (pastel colors)
      const r = Math.round(34 + factor * (253 - 34)); // #22C55E to #FDE047
      const g = Math.round(197 + factor * (224 - 197));
      const b = Math.round(94 + factor * (71 - 94));
      
      const color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      
      stops.push(
        <stop key={`welfare-${i}`} offset={`${normalizedPosition * 100}%`} stopColor={color} />
      );
    }
    
    // Scores 80-100: Light Yellow to Light Orange
    for (let i = 0; i <= 3; i++) {
      const score = 80 + (i * 20 / 3); // 80 to 100
      const normalizedPosition = (score - 1) / 139; // Normalize to 0-1
      const factor = i / 3; // 0 to 1 for yellow to orange transition
      
      // Light Yellow to Light Orange interpolation
      const r = Math.round(253 + factor * (251 - 253)); // #FDE047 to #FB923C
      const g = Math.round(224 + factor * (146 - 224));
      const b = Math.round(71 + factor * (60 - 71));
      
      const color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      
      stops.push(
        <stop key={`welfare-yellow-orange-${i}`} offset={`${normalizedPosition * 100}%`} stopColor={color} />
      );
    }
    
    // Scores 100-140: Light Orange to Strong Red
    for (let i = 0; i <= 4; i++) {
      const score = 100 + (i * 40 / 4); // 100 to 140
      const normalizedPosition = (score - 1) / 139; // Normalize to 0-1
      const factor = i / 4; // 0 to 1 for orange to red transition
      
      // Light Orange to Strong Red interpolation
      const r = Math.round(251 + factor * (220 - 251)); // #FB923C to #DC2626
      const g = Math.round(146 + factor * (38 - 146));
      const b = Math.round(60 + factor * (38 - 60));
      
      const color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      
      stops.push(
        <stop key={`welfare-orange-red-${i}`} offset={`${normalizedPosition * 100}%`} stopColor={color} />
      );
    }
    
    return stops;
  };

  return (
    <defs>
      <linearGradient id="performanceGradient" x1="0%" y1="100%" x2="0%" y2="0%">
        {createPerformanceGradientStops()}
      </linearGradient>
      <linearGradient id="wellnessGradient" x1="0%" y1="100%" x2="0%" y2="0%">
        {createWelfareGradientStops()}
      </linearGradient>
    </defs>
  );
};

export default ChartGradients;
