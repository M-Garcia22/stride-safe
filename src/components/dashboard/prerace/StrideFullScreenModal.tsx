
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Maximize2, Grid, ArrowRight, ArrowLeft, RotateCcw } from "lucide-react";
import StrideChart from "./StrideChart";
import StrideNavigationControls from "./StrideNavigationControls";

interface GraphConfig {
  key: string;
  title: string;
  data: number[][][];
  group: string;
  description: string;
}

interface StrideFullScreenModalProps {
  graphConfigs: GraphConfig[];
  currentGraphIndex: number;
  fullScreenMode: 'single' | 'grid' | 'straight' | 'turn' | 'diff';
  onModeChange: (mode: 'single' | 'grid' | 'straight' | 'turn' | 'diff') => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  horseName?: string;
  birthMonth?: string;
  yearOfBirth?: number;
  sex?: string;
  color?: string;
  raceCourse?: string;
  date?: string;
  surface?: string;
  distance?: string;
  welfareStatus?: string;
  riskCategory?: string;
  alerts?: string[];
}

const StrideFullScreenModal = ({
  graphConfigs,
  currentGraphIndex,
  fullScreenMode,
  onModeChange,
  onNavigate,
  onKeyDown,
  horseName = "Horse Name",
  birthMonth = "Unknown",
  yearOfBirth = 2023,
  sex = "Unknown",
  color = "Unknown",
  raceCourse = "Unknown Track",
  date = "",
  surface = "Dirt",
  distance = "1200m",
  welfareStatus = "Pass",
  riskCategory = "Low",
  alerts = []
}: StrideFullScreenModalProps) => {
  const getGroupColor = (group: string) => {
    switch (group) {
      case 'dv': return 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800';
      case 'lg': return 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800';
      case 'ml': return 'bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800';
      default: return '';
    }
  };

  const getRiskCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWelfareStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pass': return 'bg-green-100 text-green-800';
      case 'fail': case 'scratch': return 'bg-red-100 text-red-800';
      case 'to examine': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFilteredGraphs = () => {
    switch (fullScreenMode) {
      case 'straight':
        return graphConfigs.filter(config => config.key.includes('Straight'));
      case 'turn':
        return graphConfigs.filter(config => config.key.includes('Turn'));
      case 'diff':
        return graphConfigs.filter(config => config.key.includes('Diff'));
      default:
        return graphConfigs;
    }
  };

  const filteredGraphs = getFilteredGraphs();

  // Grid view - show all graphs or filtered graphs
  if (fullScreenMode === 'grid') {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="grid grid-cols-3 gap-2 flex-1 min-h-0 p-2 max-h-full">
          {graphConfigs.map((config) => (
            <Card 
              key={config.key} 
              className={`${getGroupColor(config.group)} transition-all duration-200 hover:shadow-md flex flex-col h-full min-h-0`}
            >
              <CardHeader className="pb-1 flex-shrink-0 p-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-semibold truncate">{config.title}</CardTitle>
                  <Badge variant="outline" className="text-xs flex-shrink-0 ml-1">
                    {config.group.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0 pb-1 px-2 flex-1 min-h-0">
                <StrideChart 
                  data={config.data}
                  isFullScreen={true}
                  fullScreenMode="grid"
                  layoutMode="grid"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Horizontal views for straight, turn, diff with reduced height
  if (fullScreenMode === 'straight' || fullScreenMode === 'turn' || fullScreenMode === 'diff') {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex gap-3 p-4" style={{ height: '45vh' }}>
          {filteredGraphs.map((config) => (
            <Card 
              key={config.key} 
              className={`${getGroupColor(config.group)} transition-all duration-200 hover:shadow-md flex flex-col h-full flex-1 min-w-0`}
            >
              <CardHeader className="pb-1 flex-shrink-0 p-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-semibold truncate">{config.title}</CardTitle>
                  <Badge variant="outline" className="text-xs flex-shrink-0 ml-1">
                    {config.group.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0 pb-1 px-2 flex-1 min-h-0">
                <StrideChart 
                  data={config.data}
                  isFullScreen={true}
                  fullScreenMode="horizontal"
                  layoutMode="horizontal"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Single graph view
  const currentConfig = graphConfigs[currentGraphIndex];
  
  return (
    <div className="flex flex-col h-full gap-4 overflow-hidden" onKeyDown={onKeyDown} tabIndex={0}>
      {/* Chart Container with Card */}
      <div className="flex-1 min-h-0 p-4">
        <Card className={`${getGroupColor(currentConfig.group)} h-full flex flex-col`}>
          <CardContent className="p-4 flex-1 min-h-0">
            <StrideChart 
              data={currentConfig.data}
              isFullScreen={true}
              fullScreenMode="single"
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Title and Description Section */}
      <div className="flex-shrink-0 text-center px-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h3 className="text-lg font-semibold">{currentConfig.title}</h3>
          <Badge variant="outline">{currentConfig.group.toUpperCase()}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-1">{currentConfig.description}</p>
        <p className="text-xs text-muted-foreground">
          Graph {currentGraphIndex + 1} of {graphConfigs.length}
        </p>
      </div>
      
      {/* Navigation Controls */}
      <div className="flex-shrink-0 px-4 pb-4">
        <StrideNavigationControls
          onPrevious={() => onNavigate('prev')}
          onNext={() => onNavigate('next')}
          className="relative bottom-auto left-auto right-auto"
        />
      </div>
    </div>
  );
};

export default StrideFullScreenModal;
