import React from 'react';
import { VelocityEvent } from "@/types/velocity";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { GitCompare } from "lucide-react";
import VelocityCustomTooltip from './VelocityCustomTooltip';
import VelocityCustomLegend from './VelocityCustomLegend';

interface VelocityComparisonChartProps {
  mostRecentEvent: VelocityEvent;
  comparisonEvents: VelocityEvent[];
  data: VelocityEvent[];
  chartType: 'first10' | 'fullRace';
}

// Chart colors: most recent is always blue, comparison colors match table highlights
const MOST_RECENT_COLOR = '#3b82f6'; // Blue - always for most recent
const COMPARISON_CHART_COLORS = ['#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#14b8a6']; // Green, Purple, Orange, Red, Teal

// Helper function to interpolate velocity data at specific time points
const interpolateVelocityData = (data: { time: number; velocity: number }[], targetTimes: number[]) => {
  return targetTimes.map(targetTime => {
    // Find the closest data points
    let before = data[0];
    let after = data[data.length - 1];
    
    for (let i = 0; i < data.length - 1; i++) {
      if (data[i].time <= targetTime && data[i + 1].time >= targetTime) {
        before = data[i];
        after = data[i + 1];
        break;
      }
    }
    
    // Linear interpolation
    if (before.time === after.time) {
      return before.velocity;
    }
    
    const ratio = (targetTime - before.time) / (after.time - before.time);
    return before.velocity + ratio * (after.velocity - before.velocity);
  });
};

// Helper function to create a unified time axis for full race data
const createUnifiedTimeAxis = (events: VelocityEvent[], chartType: 'first10' | 'fullRace') => {
  if (chartType === 'first10') {
    // For first 10 seconds, use the existing simple approach
    return Array.from({ length: 101 }, (_, i) => i / 10); // 0 to 10 seconds in 0.1 intervals
  }
  
  // For full race, find the maximum duration and create a unified time axis
  const maxDuration = Math.max(...events.map(event => {
    const raceData = event.fullRaceData;
    return raceData.length > 0 ? raceData[raceData.length - 1].time : 0;
  }));
  
  console.log(`Full race comparison: Max duration is ${maxDuration} seconds across ${events.length} events`);
  
  // Create time points every 2 seconds for full race (to keep chart readable)
  const timePoints = [];
  for (let t = 0; t <= maxDuration; t += 2) {
    timePoints.push(t);
  }
  
  return timePoints;
};

const VelocityComparisonChart = ({ mostRecentEvent, comparisonEvents, chartType }: VelocityComparisonChartProps) => {
  if (!mostRecentEvent) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center text-gray-500">
          <GitCompare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
          <p className="text-sm">No velocity data found for this horse</p>
        </div>
      </div>
    );
  }

  const isFirst10 = chartType === 'first10';
  const title = isFirst10 ? 'First 10 Seconds Velocity Comparison' : 'Full Race Velocity Profile Comparison';

  console.log(`Rendering ${chartType} comparison chart with ${comparisonEvents.length} comparison events`);

  // Get all events to process (most recent + comparisons)
  const allEventsToProcess = [mostRecentEvent, ...comparisonEvents];
  
  // Create unified time axis
  const unifiedTimeAxis = createUnifiedTimeAxis(allEventsToProcess, chartType);
  
  // Process data for each event
  const chartData = unifiedTimeAxis.map(time => {
    const dataPoint: any = { time };
    
    // Add most recent event data
    const mostRecentData = isFirst10 ? mostRecentEvent.first10SecondsData : mostRecentEvent.fullRaceData;
    const mostRecentLabel = `Most Recent (${mostRecentEvent.formattedDate})`;
    
    if (isFirst10) {
      // For first 10 seconds, use exact match
      const exactMatch = mostRecentData.find(point => Math.abs(point.time - time) < 0.05);
      dataPoint[mostRecentLabel] = exactMatch ? exactMatch.velocity : null;
    } else {
      // For full race, use interpolation
      const interpolatedValues = interpolateVelocityData(mostRecentData, [time]);
      dataPoint[mostRecentLabel] = interpolatedValues[0];
    }
    
    // Add comparison events data
    comparisonEvents.forEach((event, index) => {
      const eventData = isFirst10 ? event.first10SecondsData : event.fullRaceData;
      const eventLabel = `${event.formattedDate} - ${event.location}`;
      
      if (isFirst10) {
        // For first 10 seconds, use exact match
        const exactMatch = eventData.find(point => Math.abs(point.time - time) < 0.05);
        dataPoint[eventLabel] = exactMatch ? exactMatch.velocity : null;
      } else {
        // For full race, use interpolation
        if (time <= eventData[eventData.length - 1]?.time) {
          const interpolatedValues = interpolateVelocityData(eventData, [time]);
          dataPoint[eventLabel] = interpolatedValues[0];
        } else {
          dataPoint[eventLabel] = null; // No data beyond this race's duration
        }
      }
    });
    
    return dataPoint;
  });

  // Filter out data points where all values are null
  const filteredChartData = chartData.filter(point => {
    const values = Object.keys(point).filter(key => key !== 'time').map(key => point[key]);
    return values.some(value => value !== null && value !== undefined);
  });

  console.log(`Chart data processed: ${filteredChartData.length} data points for ${chartType} comparison`);

  const formatXAxisTick = (value: number) => {
    if (isFirst10) {
      return `${value}s`;
    }
    return `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
  };

  return (
    <div className="h-full bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between p-4 pb-2 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="p-3" style={{ height: 'calc(100% - 4rem)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredChartData}>
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
            <Legend content={<VelocityCustomLegend />} />
            
            {/* Most recent race line (always blue, full opacity) */}
            <Line
              type="monotone"
              dataKey={`Most Recent (${mostRecentEvent.formattedDate})`}
              stroke={MOST_RECENT_COLOR}
              strokeWidth={3}
              dot={false}
              connectNulls={!isFirst10} // Connect nulls for full race to handle missing data
              activeDot={{ r: 5, stroke: MOST_RECENT_COLOR, strokeWidth: 2, fill: MOST_RECENT_COLOR }}
            />
            
            {/* Comparison race lines (assigned colors, faded opacity) */}
            {comparisonEvents.map((event, index) => (
              <Line
                key={event.id}
                type="monotone"
                dataKey={`${event.formattedDate} - ${event.location}`}
                stroke={COMPARISON_CHART_COLORS[index % COMPARISON_CHART_COLORS.length]}
                strokeWidth={2}
                strokeOpacity={0.7}
                dot={false}
                connectNulls={!isFirst10} // Connect nulls for full race to handle missing data
                activeDot={{ 
                  r: 4, 
                  stroke: COMPARISON_CHART_COLORS[index % COMPARISON_CHART_COLORS.length], 
                  strokeWidth: 2, 
                  fill: COMPARISON_CHART_COLORS[index % COMPARISON_CHART_COLORS.length],
                  fillOpacity: 0.7 
                }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VelocityComparisonChart;
