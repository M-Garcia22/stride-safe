import { useState, useMemo } from 'react';
import { generateMockData } from '@/utils/mockPerformanceData';
import { RaceBreeze } from '@/types/performance';

export const usePerformanceAnalyticsData = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'3m' | '6m' | '9m' | '12m' | 'all'>('6m');

  const mockData = useMemo(() => generateMockData(), []);

  const data = useMemo(() => {
    if (selectedTimeframe === 'all') {
      return mockData;
    }
    
    const months = {
      '3m': 3,
      '6m': 6,
      '9m': 9,
      '12m': 12
    };
    
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months[selectedTimeframe]);
    
    return mockData.filter(entry => new Date(entry.date) >= cutoffDate);
  }, [mockData, selectedTimeframe]);

  return {
    selectedTimeframe,
    setSelectedTimeframe,
    data,
    isLoading: false,
  };
};
