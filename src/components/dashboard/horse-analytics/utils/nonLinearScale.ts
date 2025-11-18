
/**
 * Non-linear scale function that more linearly emphasizes the 40-100 range
 * - Scores 1-40: Map to 0-15% of chart height (compressed)
 * - Scores 40-100: Map to 15-85% of chart height (linear emphasis - 70% of space)
 * - Scores 100-140: Map to 85-100% of chart height (compressed)
 */
export const scoreToPosition = (score: number): number => {
  // Clamp score to valid range
  const clampedScore = Math.max(1, Math.min(140, score));
  
  if (clampedScore <= 40) {
    // Scores 1-40 map to 0-15% (compressed)
    return (clampedScore - 1) / 39 * 0.15;
  } else if (clampedScore <= 100) {
    // Scores 40-100 map to 15-85% (linear emphasis - 70% of chart space)
    return 0.15 + (clampedScore - 40) / 60 * 0.7;
  } else {
    // Scores 100-140 map to 85-100% (compressed)
    return 0.85 + (clampedScore - 100) / 40 * 0.15;
  }
};

/**
 * Get the Y-axis label positions and values for the revised non-linear scale
 */
export const getYAxisLabels = () => [
  { value: 140, position: 1.0 },
  { value: 120, position: 0.925 },
  { value: 100, position: 0.85 },
  { value: 80, position: 0.617 },
  { value: 60, position: 0.383 },
  { value: 40, position: 0.15 },
  { value: 20, position: 0.075 },
  { value: 1, position: 0.0 }
];
