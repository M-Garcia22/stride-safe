import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format, parseISO } from 'date-fns';
import { RaceBreeze } from '@/types/performance';
import { formatChartData, createXAxisTicks } from '@/utils/chartDateUtils';
import { getPerformanceColor, getWellnessColor } from '@/lib/colorUtils';

interface PerformanceChartProps {
  data: RaceBreeze[];
  selectedMetrics: 'both' | 'performance' | 'wellness';
  highlightedDate: string | null;
  selectedEntryId: string | null;
  onPointClick: (entry: RaceBreeze) => void;
  showTrendLine: boolean;
}

const PerformanceChart = ({
  data,
  selectedMetrics,
  highlightedDate,
  selectedEntryId,
  onPointClick,
  showTrendLine
}: PerformanceChartProps) => {
  const performanceData = formatChartData(data, selectedMetrics);

  const renderTooltipContent = (o: any) => {
    const { active, payload, label } = o;
    if (active && payload && payload.length) {
      const entry = data.find(item => item.date === label);
      if (entry) {
        return (
          <div className="p-2 bg-white border rounded shadow-md">
            <p className="font-semibold">{format(parseISO(label), 'MMM dd, yyyy')}</p>
            {selectedMetrics !== 'wellness' && (
              <p className="text-performance-500">Performance: {entry.performanceScore}</p>
            )}
            {selectedMetrics !== 'performance' && (
              <p className="text-wellness-500">Wellness: {entry.wellnessScore}</p>
            )}
          </div>
        );
      }
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={performanceData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        onClick={(event) => {
          if (event && event.activePayload && event.activePayload[0] && event.activePayload[0].payload) {
            const entry = data.find(item => item.date === event.activePayload[0].payload.date);
            if (entry) {
              onPointClick(entry);
            }
          }
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tickFormatter={(date) => format(parseISO(date), 'MMM dd')}
          ticks={createXAxisTicks(data)}
        />
        <YAxis domain={[1, 140]} />
        <Tooltip content={renderTooltipContent} />
        {selectedMetrics !== 'wellness' && (
          <Line 
            type="monotone" 
            dataKey="performanceScore" 
            stroke="#8884d8"
            dot={(props) => {
              const { cx, cy, payload } = props;
              const isHighlighted = payload.date === highlightedDate;
              const isSelected = payload.date === highlightedDate && payload.id === selectedEntryId;
              const color = getPerformanceColor(payload.performanceScore);

              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHighlighted ? 6 : 4}
                  fill={color}
                  strokeWidth={isSelected ? 2 : 0}
                  stroke={color}
                  style={{ cursor: 'pointer' }}
                />
              );
            }}
          />
        )}
        {selectedMetrics !== 'performance' && (
          <Line 
            type="monotone" 
            dataKey="wellnessScore" 
            stroke="#82ca9d"
            dot={(props) => {
              const { cx, cy, payload } = props;
              const isHighlighted = payload.date === highlightedDate;
              const isSelected = payload.date === highlightedDate && payload.id === selectedEntryId;
              const color = getWellnessColor(payload.wellnessScore);
              
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHighlighted ? 6 : 4}
                  fill={color}
                  strokeWidth={isSelected ? 2 : 0}
                  stroke={color}
                  style={{ cursor: 'pointer' }}
                />
              );
            }}
          />
        )}
        {showTrendLine && selectedMetrics !== 'wellness' && (
          <ReferenceLine y={70} stroke="red" strokeDasharray="3 3" />
        )}
        {showTrendLine && selectedMetrics !== 'performance' && (
          <ReferenceLine y={70} stroke="blue" strokeDasharray="3 3" />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PerformanceChart;
