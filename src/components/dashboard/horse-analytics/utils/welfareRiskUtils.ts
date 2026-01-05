// Utility functions for welfare risk categories based on Knowledge Guidelines
// The wellnessScore from the API is already the risk category (1-5) from Final_Traficlight_FLAG
export const getWelfareRiskCategory = (welfareScore: number, hasExcessiveStrideMovement: boolean = false): number => {
  // If the score is already a valid risk category (1-5), return it directly
  // This handles real data from the database where Final_Traficlight_FLAG is already 1-5
  if (welfareScore >= 1 && welfareScore <= 5) {
    return Math.round(welfareScore);
  }
  
  // Legacy conversion for mock data with scores in 0-140 range
  if (welfareScore >= 116) return 5; // 116-140
  if (welfareScore >= 102) return 4; // 102-115
  if (welfareScore >= 70) return 3;  // 70-101
  // For scores < 70: Category 2 if excessive stride movement, Category 1 otherwise
  return hasExcessiveStrideMovement ? 2 : 1;
};

export const getWelfareRiskCategoryColor = (category: number): string => {
  switch (category) {
    case 1: return '#22C55E'; // Green
    case 2: return '#FDE047'; // Yellow
    case 3: return '#FB923C'; // Orange
    case 4: return '#F97316'; // Dark orange
    case 5: return '#DC2626'; // Red
    default: return '#22C55E';
  }
};

export const getWelfareRiskCategoryLabel = (category: number): string => {
  switch (category) {
    case 1: return '1';
    case 2: return '2';
    case 3: return '3';
    case 4: return '4';
    case 5: return '5';
    default: return '1';
  }
};

export const getWelfareRiskCategoryRange = (category: number): string => {
  switch (category) {
    case 1: return '<70 (normal stride)';
    case 2: return '<70 (high stride)';
    case 3: return '70-101';
    case 4: return '102-115';
    case 5: return '116-140';
    default: return '<70 (normal stride)';
  }
};
