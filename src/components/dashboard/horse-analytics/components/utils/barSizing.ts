
export interface DynamicSizes {
  circleRadius: number;
  badgeRadius: number;
  fontSize: string;
  shouldPlaceAbove: boolean;
}

export const getDynamicSizes = (barWidth: number): DynamicSizes => {
  if (barWidth > 35) {
    return { 
      circleRadius: 16, 
      badgeRadius: 12, 
      fontSize: '12px',
      shouldPlaceAbove: false 
    };
  } else if (barWidth > 25) {
    return { 
      circleRadius: 14, 
      badgeRadius: 10, 
      fontSize: '10px',
      shouldPlaceAbove: false 
    };
  } else if (barWidth > 18) {
    return { 
      circleRadius: 12, 
      badgeRadius: 8, 
      fontSize: '9px',
      shouldPlaceAbove: false 
    };
  } else {
    return { 
      circleRadius: 10, 
      badgeRadius: 7, 
      fontSize: '8px',
      shouldPlaceAbove: true 
    };
  }
};
