
import React from 'react';
import { VelocityEvent } from "@/types/velocity";
import VelocityRaceInfoHeader from './VelocityRaceInfoHeader';
import VelocityComparisonChart from './VelocityComparisonChart';
import VelocitySingleChart from './VelocitySingleChart';
import VelocityChartPlaceholder from './VelocityChartPlaceholder';

type DisplayMode = 'both' | 'first10' | 'fullRace';

interface VelocityChartsViewProps {
  data: VelocityEvent[];
  highlightedEventId: string | null;
  selectedEventId: string | null;
  onEventSelect: (eventId: string) => void;
  displayMode: DisplayMode;
  isComparisonMode: boolean;
  selectedComparisonIds: string[];
}

const VelocityChartsView = ({
  data,
  selectedEventId,
  onEventSelect,
  displayMode,
  isComparisonMode,
  selectedComparisonIds
}: VelocityChartsViewProps) => {
  // Get the most recent event (first in array as it's sorted by date desc)
  const mostRecentEvent = data[0];
  
  // In normal mode, show most recent by default, in comparison mode show based on selection
  const selectedEvent = isComparisonMode 
    ? (selectedEventId ? data.find(event => event.id === selectedEventId) : null)
    : (selectedEventId ? data.find(event => event.id === selectedEventId) : mostRecentEvent);

  const renderComparisonChart = (chartType: 'first10' | 'fullRace') => {
    // Get comparison events
    const comparisonEvents = selectedComparisonIds
      .map(id => data.find(event => event.id === id))
      .filter(Boolean) as VelocityEvent[];

    console.log(`Rendering ${chartType} comparison chart with ${comparisonEvents.length} comparison events:`, 
      comparisonEvents.map(e => `${e.formattedDate} - ${e.location}`));

    return (
      <VelocityComparisonChart
        mostRecentEvent={mostRecentEvent}
        comparisonEvents={comparisonEvents}
        data={data}
        chartType={chartType}
      />
    );
  };

  const renderFirst10SecondsChart = (fullHeight = false) => (
    <VelocitySingleChart
      selectedEvent={selectedEvent}
      chartType="first10"
      fullHeight={fullHeight}
    />
  );

  const renderFullRaceChart = (fullHeight = false) => (
    <VelocitySingleChart
      selectedEvent={selectedEvent}
      chartType="fullRace"
      fullHeight={fullHeight}
    />
  );

  if (isComparisonMode) {
    console.log(`Comparison mode active - displayMode: ${displayMode}, comparisons: ${selectedComparisonIds.length}`);
    
    return (
      <div className="h-full p-4 bg-gray-50">
        <VelocityRaceInfoHeader
          isComparisonMode={isComparisonMode}
          selectedComparisonIds={selectedComparisonIds}
          mostRecentEvent={mostRecentEvent}
          selectedEvent={selectedEvent}
        />
        <div className="space-y-4" style={{ height: 'calc(100% - 5rem)' }}>
          {displayMode === 'both' && (
            <>
              <div className="h-1/2">
                {renderComparisonChart('first10')}
              </div>
              <div className="h-1/2">
                {renderComparisonChart('fullRace')}
              </div>
            </>
          )}
          
          {displayMode === 'first10' && (
            <div className="h-full">
              {renderComparisonChart('first10')}
            </div>
          )}
          
          {displayMode === 'fullRace' && (
            <div className="h-full">
              {renderComparisonChart('fullRace')}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show placeholder only if no data exists at all
  if (!data || data.length === 0) {
    return (
      <div className="h-full p-4 bg-gray-50">
        <VelocityChartPlaceholder />
      </div>
    );
  }

  console.log(`Normal mode active - displayMode: ${displayMode}, selectedEvent: ${selectedEvent?.formattedDate || 'none'}`);

  return (
    <div className="h-full p-4 bg-gray-50">
      <VelocityRaceInfoHeader
        isComparisonMode={isComparisonMode}
        selectedComparisonIds={selectedComparisonIds}
        mostRecentEvent={mostRecentEvent}
        selectedEvent={selectedEvent}
      />
      <div className="space-y-4" style={{ height: 'calc(100% - 5rem)' }}>
        {displayMode === 'both' && (
          <>
            {renderFirst10SecondsChart()}
            {renderFullRaceChart()}
          </>
        )}
        
        {displayMode === 'first10' && renderFirst10SecondsChart(true)}
        
        {displayMode === 'fullRace' && renderFullRaceChart(true)}
      </div>
    </div>
  );
};

export default VelocityChartsView;
