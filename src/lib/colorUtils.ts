// Color interpolation utility for Triple Rings
export const interpolateColor = (color1: string, color2: string, factor: number): string => {
  // Ensure factor is between 0 and 1
  factor = Math.max(0, Math.min(1, factor));
  
  // Parse hex colors
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');
  
  const r1 = parseInt(hex1.substr(0, 2), 16);
  const g1 = parseInt(hex1.substr(2, 2), 16);
  const b1 = parseInt(hex1.substr(4, 2), 16);
  
  const r2 = parseInt(hex2.substr(0, 2), 16);
  const g2 = parseInt(hex2.substr(2, 2), 16);
  const b2 = parseInt(hex2.substr(4, 2), 16);
  
  // Interpolate
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Updated Wellness Color Scheme: Light Green (low risk) to Strong Red (high risk)
// Adjusted so orange starts at welfare score 70, with green/yellow below score 70
export const getWellnessColor = (score: number): string => {
  const normalized = Math.max(0, Math.min(1, (score - 1) / 139)); // Convert 1-140 to 0-1
  
  if (normalized <= 0.5) {
    // Light Green to Light Yellow (low risk - 0 to 0.5, covering scores 1-70)
    const factor = normalized / 0.5; // Convert 0-0.5 to 0-1
    return interpolateColor('#22C55E', '#FDE047', factor); // Light green to Light yellow
  } else if (normalized <= 0.71) {
    // Light Orange to Medium Orange (medium risk - 0.5 to 0.71, covering scores 70-100)
    const factor = (normalized - 0.5) / 0.21; // Convert 0.5-0.71 to 0-1
    return interpolateColor('#FB923C', '#F97316', factor); // Light orange to Medium orange
  } else {
    // Medium Orange to Strong Red (high risk - 0.71 to 1, covering scores 100-140)
    const factor = (normalized - 0.71) / 0.29; // Convert 0.71-1 to 0-1
    return interpolateColor('#F97316', '#DC2626', factor); // Medium orange to Strong red
  }
};

// Performance Color Scheme: Blue to Green (achievement-based)
// Maintained original logic - higher scores = better performance = brighter colors
export const getPerformanceColor = (score: number): string => {
  const normalized = Math.max(0, Math.min(1, (score - 1) / 139)); // Convert 1-140 to 0-1
  
  if (normalized <= 0.5) {
    // Blue to Cyan (0-0.5)
    const factor = normalized * 2; // Convert 0-0.5 to 0-1
    return interpolateColor('#3B82F6', '#06B6D4', factor); // Blue to Cyan
  } else {
    // Cyan to Green (0.5-1)
    const factor = (normalized - 0.5) * 2; // Convert 0.5-1 to 0-1
    return interpolateColor('#06B6D4', '#22C55E', factor); // Cyan to Green
  }
};

// Chart-specific color functions with updated wellness risk-based scheme
export const getPerformanceColorForChart = (score: number): string => {
  return getPerformanceColor(score);
};

export const getWellnessColorForChart = (score: number): string => {
  return getWellnessColor(score);
};

/**
 * Get fatigue color based on score (for fatigue badge border)
 * Uses the fatigue gradient colors: blue to cyan to light blue-cyan
 */
export const getFatigueColor = (score: number): string => {
  // Clamp score to valid range
  const clampedScore = Math.max(1, Math.min(140, score));
  
  if (clampedScore <= 70) {
    // Blue range (low fatigue)
    return "#3B82F6";
  } else if (clampedScore <= 100) {
    // Cyan range (moderate fatigue)
    return "#06B6D4";
  } else {
    // Light blue-cyan range (high fatigue)
    return "#00D4FF";
  }
};
