
import React from 'react';
import { VelocityEvent } from "@/types/velocity";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import VelocityCustomTooltip from './VelocityCustomTooltip';

interface VelocitySingleChartProps {
  selectedEvent: VelocityEvent | null;
  chartType: 'first10' | 'fullRace';
  fullHeight?: boolean;
}

const VelocitySingleChart = ({ selectedEvent, chartType, fullHeight = false }: VelocitySingleChartProps) => {
  const isFirst10 = chartType === 'first10';
  const chartData = isFirst10 ? selectedEvent?.first10SecondsData : selectedEvent?.fullRaceData;
  const title = isFirst10 ? 'First 10 Seconds Velocity' : 'Full Race Velocity Profile';
  
  const formatXAxisTick = (value: number) => {
    if (isFirst10) {
      return `${value}s`;
    }
    return `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
  };

  return (
    <div className={`${fullHeight ? 'h-full' : 'h-1/2'} bg-white rounded-lg border border-gray-200 shadow-sm`}>
      <div className="flex items-center justify-between p-4 pb-2 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="p-3" style={{ height: fullHeight ? 'calc(100% - 4rem)' : 'calc(100% - 4rem)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="time" 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={formatXAxisTick}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => `${value} mph`}
            />
            <Tooltip content={<VelocityCustomTooltip />} />
            <Line
              type="monotone"
              dataKey="velocity"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5, stroke: "#3b82f6", strokeWidth: 2, fill: "#60a5fa" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VelocitySingleChart;
