import { format, parseISO } from 'date-fns';
import { RaceBreeze } from '@/types/performance';

export const formatChartData = (data: RaceBreeze[], selectedMetrics: 'both' | 'performance' | 'wellness') => {
  return data.map(item => ({
    date: format(parseISO(item.date), 'MMM dd'),
    performanceScore: selectedMetrics !== 'wellness' ? item.performanceScore : undefined,
    wellnessScore: selectedMetrics !== 'performance' ? item.wellnessScore : undefined,
  }));
};

export const createXAxisTicks = (data: RaceBreeze[]) => {
  const numberOfTicks = Math.min(data.length, 5);
  const interval = Math.max(1, Math.floor(data.length / numberOfTicks));
  return data.map((entry, index) => (index % interval === 0 || index === data.length - 1) ? format(parseISO(entry.date), 'MMM dd') : null).filter(Boolean);
};
