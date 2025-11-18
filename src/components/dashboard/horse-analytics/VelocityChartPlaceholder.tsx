
import React from 'react';
import { Activity, GitCompare } from "lucide-react";

interface VelocityChartPlaceholderProps {
  type?: 'no-data' | 'comparison-unavailable';
}

const VelocityChartPlaceholder = ({ type = 'no-data' }: VelocityChartPlaceholderProps) => {
  if (type === 'comparison-unavailable') {
    return (
      <div className="h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-gray-500">
            <GitCompare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <h3 className="text-sm font-semibold mb-1">Full Race Comparison Not Available</h3>
            <p className="text-xs">Full race velocity profile comparison is not supported in comparison mode</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <div className="text-center text-gray-500">
        <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
        <p className="text-sm">No velocity data found for this horse</p>
      </div>
    </div>
  );
};

export default VelocityChartPlaceholder;
