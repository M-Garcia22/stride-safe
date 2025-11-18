import { useMemo } from "react";
import { format, parseISO, subMonths, isAfter } from "date-fns";

interface TrendsEvent {
  id: string;
  date: string;
  type: 'race' | 'breeze';
  location: string;
  distance: string;
  performanceScore: number;
  wellnessScore: number;
  welfareAlert: boolean;
}

interface ProcessedEvent extends TrendsEvent {
  performanceChange: number;
  wellnessChange: number;
  formattedDate: string;
  index: number;
}

export const useTrendsData = (
  data: TrendsEvent[],
  timeframe: '3m' | '6m' | '9m' | '12m' | 'all',
  eventTypes: 'both' | 'race' | 'breeze',
  showTrendLine: boolean
) => {
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Filter by timeframe
    if (timeframe !== 'all') {
      const months = parseInt(timeframe.replace('m', ''));
      const cutoffDate = subMonths(new Date(), months);
      filtered = filtered.filter(event => isAfter(parseISO(event.date), cutoffDate));
    }

    // Filter by event type
    if (eventTypes !== 'both') {
      filtered = filtered.filter(event => event.type === eventTypes);
    }

    // Keep the data in the order it was passed in (most recent first for our use case)
    // Don't re-sort here as the data is already properly ordered from FatigueWellnessGraphCard
    return filtered;
  }, [data, timeframe, eventTypes]);

  const processedData = useMemo(() => {
    return filteredData.map((event, index) => {
      const prevEvent = filteredData[index - 1];
      const performanceChange = prevEvent 
        ? ((event.performanceScore - prevEvent.performanceScore) / prevEvent.performanceScore) * 100
        : 0;
      const wellnessChange = prevEvent 
        ? ((event.wellnessScore - prevEvent.wellnessScore) / prevEvent.wellnessScore) * 100
        : 0;

      return {
        ...event,
        performanceChange,
        wellnessChange,
        formattedDate: format(parseISO(event.date), 'MMM dd'),
        index // This preserves the original index from the sorted data
      };
    });
  }, [filteredData]);

  // Generate point-to-point connection data for trend lines
  const trendData = useMemo(() => {
    if (!showTrendLine || processedData.length < 2) return null;

    return {
      performance: {
        color: '#22C55E',
        data: processedData.map(d => d.performanceScore)
      },
      wellness: {
        color: '#A855F7',
        data: processedData.map(d => d.wellnessScore)
      }
    };
  }, [processedData, showTrendLine]);

  return {
    processedData,
    trendData
  };
};
