
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, List, GitCompare, X } from "lucide-react";

type DisplayMode = 'both' | 'first10' | 'fullRace';

interface VelocityControlsBarProps {
  splitView: boolean;
  onSplitViewChange: (value: boolean) => void;
  onExport: (format: 'csv' | 'pdf' | 'json') => void;
  displayMode: DisplayMode;
  onDisplayModeChange: (mode: DisplayMode) => void;
  isComparisonMode: boolean;
  onComparisonModeToggle: () => void;
  selectedComparisonCount: number;
  onClearComparisons: () => void;
}

const VelocityControlsBar = ({
  splitView,
  onSplitViewChange,
  onExport,
  displayMode,
  onDisplayModeChange,
  isComparisonMode,
  onComparisonModeToggle,
  selectedComparisonCount,
  onClearComparisons
}: VelocityControlsBarProps) => {
  return (
    <div className="border-b bg-card p-4">
      <div className="flex items-center justify-between">
        {/* Display Mode Controls */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Display:</span>
          <div className="flex items-center gap-1">
            <Button
              onClick={() => onDisplayModeChange('both')}
              className={`h-7 px-2 text-xs ${
                displayMode === 'both' 
                  ? 'bg-blue-50 border-blue-200 text-blue-700 border' 
                  : 'border bg-background text-foreground hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700'
              }`}
            >
              Both Graphs
            </Button>
            <Button
              onClick={() => onDisplayModeChange('first10')}
              className={`h-7 px-2 text-xs ${
                displayMode === 'first10' 
                  ? 'bg-blue-50 border-blue-200 text-blue-700 border' 
                  : 'border bg-background text-foreground hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700'
              }`}
            >
              First 10s Only
            </Button>
            <Button
              onClick={() => onDisplayModeChange('fullRace')}
              className={`h-7 px-2 text-xs ${
                displayMode === 'fullRace' 
                  ? 'bg-blue-50 border-blue-200 text-blue-700 border' 
                  : 'border bg-background text-foreground hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700'
              }`}
            >
              Full Race Only
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Comparison Controls */}
          <div className="flex items-center gap-1">
            <Button 
              variant="outline"
              onClick={onComparisonModeToggle}
              className={`h-7 px-2 text-xs ${
                isComparisonMode 
                  ? 'bg-orange-50 border-orange-200 text-orange-700' 
                  : 'border hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700'
              }`}
            >
              <GitCompare className="h-3 w-3 mr-1" />
              {isComparisonMode ? 'Exit Compare' : 'Compare'}
            </Button>
            
            {isComparisonMode && (
              <>
                <span className="text-xs text-muted-foreground px-2">
                  {selectedComparisonCount}/5 selected
                </span>
                {selectedComparisonCount > 0 && (
                  <Button
                    variant="outline"
                    onClick={onClearComparisons}
                    className="h-7 px-2 text-xs border hover:bg-red-50 hover:border-red-200 hover:text-red-700"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear All
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Show Records Button */}
          <Button 
            variant="outline"
            onClick={() => onSplitViewChange(!splitView)}
            className={`h-7 px-2 text-xs ${
              splitView 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'border hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700'
            }`}
          >
            <List className="h-3 w-3 mr-1" />
            Show Records
          </Button>

          {/* Export Controls */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-7 px-2 text-xs border">
                <Download className="h-3 w-3 mr-1" />
                Export Data
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onExport('csv')}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport('json')}>
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport('pdf')}>
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default VelocityControlsBar;
