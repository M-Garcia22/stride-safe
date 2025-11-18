
import React from 'react';
import { VelocityEvent } from "@/types/velocity";
import { GitCompare } from "lucide-react";

interface VelocityRaceInfoHeaderProps {
  isComparisonMode: boolean;
  selectedComparisonIds: string[];
  mostRecentEvent: VelocityEvent | null;
  selectedEvent: VelocityEvent | null;
}

const VelocityRaceInfoHeader = ({ 
  isComparisonMode, 
  selectedComparisonIds, 
  mostRecentEvent, 
  selectedEvent 
}: VelocityRaceInfoHeaderProps) => {
  if (isComparisonMode) {
    return (
      <div className="mb-4 px-4 py-3 bg-orange-50 border border-orange-200 rounded-lg">
        <div className="flex items-center gap-2">
          <GitCompare className="h-4 w-4 text-orange-600" />
          <div className="text-sm font-medium text-orange-800">
            Comparison Mode: {selectedComparisonIds.length} race{selectedComparisonIds.length !== 1 ? 's' : ''} selected
            {selectedComparisonIds.length > 0 && ` vs Most Recent (${mostRecentEvent?.formattedDate} - ${mostRecentEvent?.location})`}
          </div>
        </div>
      </div>
    );
  }
  
  if (!selectedEvent) return null;
  
  return (
    <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-blue-800">
          Race Data: {selectedEvent?.date ? new Date(selectedEvent.date).toLocaleDateString() : ''} - {selectedEvent?.location}
        </div>
      </div>
    </div>
  );
};

export default VelocityRaceInfoHeader;
