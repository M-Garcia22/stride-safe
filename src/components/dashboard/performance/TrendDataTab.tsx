
import TrendVelocityChart from "./TrendVelocityChart";
import PerformanceChart from "./PerformanceChart";
import PerformanceChangeChart from "./PerformanceChangeChart";
import { RaceBreeze } from "@/types/performance";

interface TrendDataTabProps {
  filteredData: RaceBreeze[];
  highlightedDate: string | null;
  selectedEntry: RaceBreeze | null;
  onPointClick: (entry: RaceBreeze) => void;
}

const TrendDataTab = ({
  filteredData,
  highlightedDate,
  selectedEntry,
  onPointClick
}: TrendDataTabProps) => {
  return (
    <div className="flex-1 space-y-4 overflow-auto">
      <TrendVelocityChart data={filteredData} />
      
      <PerformanceChart 
        data={filteredData}
        selectedMetrics="both"
        highlightedDate={highlightedDate}
        selectedEntryId={selectedEntry?.id || null}
        onPointClick={onPointClick}
        showTrendLine={false}
      />
      
      <PerformanceChangeChart 
        data={filteredData}
        selectedMetrics="both"
        highlightedDate={highlightedDate}
        selectedEntryId={selectedEntry?.id || null}
        onPointClick={onPointClick}
      />
    </div>
  );
};

export default TrendDataTab;
