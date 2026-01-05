
import { BaseTrendsEvent } from "../types/trendsChart";

export const useTrendsExport = (trendsData: BaseTrendsEvent[], horseName: string) => {
  const handleExport = (format: 'csv' | 'pdf' | 'json') => {
    const data = trendsData;
    const filename = `${horseName}_trends_${new Date().toISOString().split('T')[0]}`;

    if (format === 'csv') {
      const headers = ['Date', 'Type', 'Location', 'Distance', 'Performance Score', 'Wellness Score', 'Welfare Alert'];
      const csvContent = [
        headers.join(','),
        ...data.map(event => [
          event.date,
          event.type,
          `"${event.location}"`,
          event.distance,
          event.performanceScore,
          event.wellnessScore,
          event.welfareAlert
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else if (format === 'json') {
      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      const printContent = `
        Trends Analysis Report - ${horseName}
        Generated: ${new Date().toLocaleDateString()}
        
        ${data.map(event => 
          `Date: ${event.date}\nType: ${event.type}\nLocation: ${event.location}\nDistance: ${event.distance}\nPerformance: ${event.performanceScore}\nWellness: ${event.wellnessScore}\n---`
        ).join('\n')}
      `;
      
      const blob = new Blob([printContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return { handleExport };
};
