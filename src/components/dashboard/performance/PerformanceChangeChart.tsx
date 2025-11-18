import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format, parseISO } from 'date-fns';
import { RaceBreeze } from '@/types/performance';
import { formatChartData, createXAxisTicks } from '@/utils/chartDateUtils';

interface PerformanceChangeChartProps {
  data: RaceBreeze[];
  selectedMetrics: 'both' | 'performance' | 'wellness';
  highlightedDate: string | null;
    selectedEntryId: string | null;
    onPointClick: (entry: RaceBreeze) => void;
}

const PerformanceChangeChart = ({ data, selectedMetrics, highlightedDate, selectedEntryId, onPointClick }: PerformanceChangeChartProps) => {
  const performanceData = useMemo(() => {
    return formatChartData(data, selectedMetrics);
  }, [data, selectedMetrics]);

    const changeData = useMemo(() => {
        if (performanceData.length < 2) {
            return [];
        }

        const changes = performanceData.map((current, index) => {
            if (index === 0) {
                return { ...current, performanceChange: 0, wellnessChange: 0 };
            }

            const previous = performanceData[index - 1];
            const performanceChange = ((current.performanceScore - previous.performanceScore) / previous.performanceScore) * 100;
            const wellnessChange = ((current.wellnessScore - previous.wellnessScore) / previous.wellnessScore) * 100;

            return {
                ...current,
                performanceChange: performanceChange.toFixed(2),
                wellnessChange: wellnessChange.toFixed(2),
            };
        });

        return changes;
    }, [performanceData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const entry = data.find(item => item.date === label);
      const performanceChange = payload[0].value;
      const wellnessChange = payload[1].value;

      return (
        <div className="bg-white border rounded shadow-md p-2">
          <p className="font-bold">{format(parseISO(label), 'MMM dd, yyyy')}</p>
          {selectedMetrics !== 'wellness' && (
            <p className="text-blue-500">Performance Change: {performanceChange}%</p>
          )}
          {selectedMetrics !== 'performance' && (
            <p className="text-green-500">Wellness Change: {wellnessChange}%</p>
          )}
          {entry && (
            <button onClick={() => onPointClick(entry)} className="text-blue-600 hover:underline mt-1">
              View Details
            </button>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={changeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date"
          tickFormatter={(date) => format(parseISO(date), 'MMM dd')}
          ticks={createXAxisTicks(data)}
        />
        <YAxis tickFormatter={(value) => value + '%'} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={0} stroke="#000" strokeDasharray="3 3" />
        {selectedMetrics !== 'wellness' && (
          <Line
            type="monotone"
            dataKey="performanceChange"
            stroke="#8884d8"
            name="Performance Change"
            activeDot={{ r: 8 }}
            dot={highlightedDate ? { r: changeData.find(item => item.date === highlightedDate) ? 4 : 0 } : { r: 0 }}
          />
        )}
        {selectedMetrics !== 'performance' && (
          <Line
            type="monotone"
            dataKey="wellnessChange"
            stroke="#82ca9d"
            name="Wellness Change"
            activeDot={{ r: 8 }}
            dot={highlightedDate ? { r: changeData.find(item => item.date === highlightedDate) ? 4 : 0 } : { r: 0 }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PerformanceChangeChart;
