
import { useState, useEffect } from "react";
import { Horse } from "@/types/horse";
import { generateVelocityData } from "@/utils/velocityData";
import VelocityControlsBar from "./VelocityControlsBar";
import VelocityMainContent from "./VelocityMainContent";

type DisplayMode = 'both' | 'first10' | 'fullRace';

interface VelocityAnalysisPaneProps {
  horse: Horse;
}

const VelocityAnalysisPane = ({ horse }: VelocityAnalysisPaneProps) => {
  const [splitView, setSplitView] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [highlightedEventId, setHighlightedEventId] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('both');
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [selectedComparisonIds, setSelectedComparisonIds] = useState<string[]>([]);

  // Generate sample data once and keep it stable
  const [velocityData] = useState(() => generateVelocityData(horse.id));

  const handleExport = (format: 'csv' | 'pdf' | 'json') => {
    console.log(`Exporting velocity data as ${format} for horse: ${horse.name}`);
    // Export functionality would be implemented here
  };

  const handleEventSelect = (eventId: string) => {
    if (isComparisonMode) {
      // In comparison mode, toggle selection for comparison
      setSelectedComparisonIds(prev => {
        if (prev.includes(eventId)) {
          // Remove if already selected
          const newSelection = prev.filter(id => id !== eventId);
          console.log(`Removed comparison event: ${eventId}, remaining: ${newSelection.length}`);
          return newSelection;
        } else if (prev.length < 5) {
          // Add if under limit
          const newSelection = [...prev, eventId];
          console.log(`Added comparison event: ${eventId}, total selected: ${newSelection.length}`);
          return newSelection;
        }
        console.log(`Cannot add more comparison events (limit reached): ${prev.length}/5`);
        return prev; // Don't add if at limit
      });
    } else {
      // Normal mode - single selection
      console.log(`Selected event: ${eventId}`);
      setSelectedEventId(eventId);
      setHighlightedEventId(eventId);
    }
  };

  const handleEventHighlight = (eventId: string | null) => {
    setHighlightedEventId(eventId);
  };

  const handleDisplayModeChange = (mode: DisplayMode) => {
    console.log(`Display mode changed to: ${mode} (comparison mode: ${isComparisonMode})`);
    setDisplayMode(mode);
  };

  const handleComparisonModeToggle = () => {
    const newComparisonMode = !isComparisonMode;
    console.log(`Toggling comparison mode: ${isComparisonMode} -> ${newComparisonMode}`);
    
    setIsComparisonMode(newComparisonMode);
    
    if (newComparisonMode) {
      // Entering comparison mode - clear previous comparisons and ensure most recent is selected
      setSelectedComparisonIds([]);
      if (velocityData.length > 0) {
        const mostRecentId = velocityData[0].id;
        setSelectedEventId(mostRecentId);
        setHighlightedEventId(mostRecentId);
        console.log(`Entering comparison mode - most recent event selected: ${mostRecentId}`);
      }
      // Don't force display mode change - let user choose
    } else {
      // Exiting comparison mode - clear comparisons and return to normal view
      setSelectedComparisonIds([]);
      console.log(`Exiting comparison mode - cleared ${selectedComparisonIds.length} comparison selections`);
    }
  };

  const handleClearComparisons = () => {
    console.log(`Clearing ${selectedComparisonIds.length} comparison selections`);
    setSelectedComparisonIds([]);
  };

  // Set initial selected event and ensure most recent is always selected
  useEffect(() => {
    if (velocityData.length > 0) {
      const mostRecentId = velocityData[0].id;
      if (!selectedEventId) {
        console.log(`Setting initial selected event: ${mostRecentId}`);
        setSelectedEventId(mostRecentId);
        setHighlightedEventId(mostRecentId);
      }
    }
  }, [selectedEventId, velocityData]);

  console.log(`VelocityAnalysisPane rendered for horse: ${horse.name}, displayMode: ${displayMode}, splitView: ${splitView}, comparisonMode: ${isComparisonMode}, comparisons: ${selectedComparisonIds.length}`);

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] overflow-hidden">
      {/* Controls */}
      <VelocityControlsBar
        splitView={splitView}
        onSplitViewChange={setSplitView}
        onExport={handleExport}
        displayMode={displayMode}
        onDisplayModeChange={handleDisplayModeChange}
        isComparisonMode={isComparisonMode}
        onComparisonModeToggle={handleComparisonModeToggle}
        selectedComparisonCount={selectedComparisonIds.length}
        onClearComparisons={handleClearComparisons}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <VelocityMainContent
          horse={horse}
          data={velocityData}
          splitView={splitView}
          highlightedEventId={highlightedEventId}
          selectedEventId={selectedEventId}
          onEventHighlight={handleEventHighlight}
          onEventSelect={handleEventSelect}
          displayMode={displayMode}
          isComparisonMode={isComparisonMode}
          selectedComparisonIds={selectedComparisonIds}
        />
      </div>
    </div>
  );
};

export default VelocityAnalysisPane;
