
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlignLeft, Grid3x3, Maximize2, Grid, Expand } from "lucide-react";
import { StrideAnalysis } from "../../../data/preRaceData";
import StrideChart from "./StrideChart";
import StrideFullScreenModal from "./StrideFullScreenModal";

interface EnhancedStrideAnalysisGraphsProps {
  strideAnalysis: StrideAnalysis;
  raceCourse: string;
  date: string;
  horseName?: string;
  birthMonth?: string;
  yearOfBirth?: number;
  sex?: string;
  color?: string;
  surface?: string;
  distance?: string;
  welfareStatus?: string;
  riskCategory?: string;
  alerts?: string[];
  showHeader?: boolean;
}

const EnhancedStrideAnalysisGraphs = ({ 
  strideAnalysis, 
  raceCourse, 
  date,
  horseName = "Horse Name",
  birthMonth = "Unknown",
  yearOfBirth = 2023,
  sex = "Unknown",
  color = "Unknown",
  surface = "Dirt",
  distance = "1200m",
  welfareStatus = "Pass",
  riskCategory = "Low",
  alerts = [],
  showHeader = true
}: EnhancedStrideAnalysisGraphsProps) => {
  const [layoutMode, setLayoutMode] = useState<'rows' | 'grid'>('rows');
  const [fullScreenGraph, setFullScreenGraph] = useState<string | null>(null);
  const [fullScreenMode, setFullScreenMode] = useState<'single' | 'grid' | 'straight' | 'turn' | 'diff'>('single');
  const [currentGraphIndex, setCurrentGraphIndex] = useState(0);
  const [mainFullScreenOpen, setMainFullScreenOpen] = useState(false);

  const graphConfigs = [
    { key: 'dvStraight', title: 'DV Straight', data: strideAnalysis.dvStraight, group: 'dv', description: 'Dorsal-Ventral movement on straight sections' },
    { key: 'dvTurn', title: 'DV Turn', data: strideAnalysis.dvTurn, group: 'dv', description: 'Dorsal-Ventral movement on turns' },
    { key: 'dvDiff', title: 'DV Diff', data: strideAnalysis.dvDiff, group: 'dv', description: 'Difference between DV straight and turn' },
    { key: 'lgStraight', title: 'LG Straight', data: strideAnalysis.lgStraight, group: 'lg', description: 'Lateral-Gait movement on straight sections' },
    { key: 'lgTurn', title: 'LG Turn', data: strideAnalysis.lgTurn, group: 'lg', description: 'Lateral-Gait movement on turns' },
    { key: 'lgDiff', title: 'LG Diff', data: strideAnalysis.lgDiff, group: 'lg', description: 'Difference between LG straight and turn' },
    { key: 'mlStraight', title: 'ML Straight', data: strideAnalysis.mlStraight, group: 'ml', description: 'Medial-Lateral movement on straight sections' },
    { key: 'mlTurn', title: 'ML Turn', data: strideAnalysis.mlTurn, group: 'ml', description: 'Medial-Lateral movement on turns' },
    { key: 'mlDiff', title: 'ML Diff', data: strideAnalysis.mlDiff, group: 'ml', description: 'Difference between ML straight and turn' },
  ];

  const getGridClasses = () => {
    if (layoutMode === 'grid') {
      return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-fr";
    }
    return "grid grid-cols-1 gap-6";
  };

  const getCardClasses = () => {
    if (layoutMode === 'grid') {
      return "flex flex-col overflow-hidden h-full";
    }
    return "flex flex-col";
  };

  const getGroupColor = (group: string) => {
    switch (group) {
      case 'dv': return 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800';
      case 'lg': return 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800';
      case 'ml': return 'bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800';
      default: return '';
    }
  };

  const navigateGraph = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentGraphIndex((prev) => prev === 0 ? graphConfigs.length - 1 : prev - 1);
    } else {
      setCurrentGraphIndex((prev) => (prev + 1) % graphConfigs.length);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      navigateGraph('prev');
    } else if (event.key === 'ArrowRight') {
      navigateGraph('next');
    }
  };

  const openFullScreen = (graphKey: string) => {
    const index = graphConfigs.findIndex(config => config.key === graphKey);
    setCurrentGraphIndex(index);
    setFullScreenGraph(graphKey);
    setFullScreenMode('single');
  };

  const openMainFullScreen = () => {
    setMainFullScreenOpen(true);
    setCurrentGraphIndex(0);
    setFullScreenMode('single');
  };

  const getRiskCategoryColor = (category: string | number) => {
    const categoryStr = typeof category === 'number' ? category.toString() : category;
    switch (categoryStr.toLowerCase()) {
      case 'low': case '1': return 'bg-green-100 text-green-800';
      case 'medium': case '2': return 'bg-yellow-100 text-yellow-800';
      case 'high': case '3': case '4': case '5': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWelfareStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pass': case 'good': return 'bg-green-100 text-green-800';
      case 'fail': case 'scratch': case 'alert': return 'bg-red-100 text-red-800';
      case 'to examine': case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Function Buttons Section - Always Visible */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        {/* Header Text - Conditionally Rendered */}
        {showHeader && (
          <div>
            <h4 className="text-xl font-semibold mb-2">Stride Analysis Curves</h4>
            <p className="text-sm text-muted-foreground">
              {raceCourse} • {new Date(date).toLocaleDateString()}
            </p>
          </div>
        )}
        
        {/* Function Buttons - Always Visible */}
        <div className="flex flex-wrap items-center gap-2 ml-auto">
          <TooltipProvider>
            <ToggleGroup 
              type="single" 
              value={layoutMode} 
              onValueChange={(value) => value && setLayoutMode(value as 'rows' | 'grid')}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="rows" variant="outline" size="sm">
                    <AlignLeft className="w-4 h-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Rows Layout</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="grid" variant="outline" size="sm">
                    <Grid3x3 className="w-4 h-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Grid Layout</TooltipContent>
              </Tooltip>
            </ToggleGroup>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openMainFullScreen}
                  className="flex items-center gap-2"
                >
                  <Expand className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Full Screen View</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Graphs Grid */}
      <div className={getGridClasses()}>
        {graphConfigs.map((config) => (
          <Card key={config.key} className={`${getCardClasses()} ${getGroupColor(config.group)} transition-all duration-200 hover:shadow-md`}>
            <CardHeader className={layoutMode === 'grid' ? "pb-1 flex-shrink-0 p-1" : "pb-3 flex-shrink-0"}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardTitle className={layoutMode === 'grid' ? "text-sm font-semibold" : "text-base font-semibold"}>{config.title}</CardTitle>
                  {layoutMode === 'rows' && (
                    <p className="text-xs text-muted-foreground mt-1">{config.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Badge variant="outline" className="text-xs">
                    {config.group.toUpperCase()}
                  </Badge>
                  {/* Only show full screen button in rows layout */}
                  {layoutMode === 'rows' && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => openFullScreen(config.key)}
                        >
                          <Maximize2 className="w-3 h-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-7xl h-[90vh] flex flex-col">
                        <DialogHeader className="flex-shrink-0">
                          <DialogTitle className="flex items-center justify-between">
                            <span>Stride Curve Analysis</span>
                            <div className="flex items-center gap-2">
                              <ToggleGroup 
                                type="single" 
                                value={fullScreenMode} 
                                onValueChange={(value) => value && setFullScreenMode(value as 'single' | 'grid' | 'straight' | 'turn' | 'diff')}
                              >
                                <ToggleGroupItem value="single" variant="outline" size="sm">
                                  <Maximize2 className="w-4 h-4" />
                                </ToggleGroupItem>
                                <ToggleGroupItem value="grid" variant="outline" size="sm">
                                  <Grid className="w-4 h-4" />
                                </ToggleGroupItem>
                                <ToggleGroupItem value="straight" variant="outline" size="sm">
                                  Straight
                                </ToggleGroupItem>
                                <ToggleGroupItem value="turn" variant="outline" size="sm">
                                  Turn
                                </ToggleGroupItem>
                                <ToggleGroupItem value="diff" variant="outline" size="sm">
                                  Diff
                                </ToggleGroupItem>
                              </ToggleGroup>
                            </div>
                          </DialogTitle>
                        </DialogHeader>
                        <div className="flex-1 min-h-0">
                          <StrideFullScreenModal
                            graphConfigs={graphConfigs}
                            currentGraphIndex={currentGraphIndex}
                            fullScreenMode={fullScreenMode}
                            onModeChange={setFullScreenMode}
                            onNavigate={navigateGraph}
                            onKeyDown={handleKeyDown}
                            horseName={horseName}
                            birthMonth={birthMonth}
                            yearOfBirth={yearOfBirth}
                            sex={sex}
                            color={color}
                            raceCourse={raceCourse}
                            date={date}
                            surface={surface}
                            distance={distance}
                            welfareStatus={welfareStatus}
                            riskCategory={riskCategory}
                            alerts={alerts}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className={layoutMode === 'grid' ? "pt-0 flex-1 min-h-0 p-0" : "pt-0 flex-1 min-h-0 px-2 pb-3"}>
              <StrideChart 
                data={config.data}
                layoutMode={layoutMode}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Full Screen Dialog */}
      <Dialog open={mainFullScreenOpen} onOpenChange={setMainFullScreenOpen}>
        <DialogContent className="max-w-7xl h-[95vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">Stride Curve Analysis</div>
                <div className="text-sm font-normal text-muted-foreground mt-1">
                  {horseName} • {birthMonth} {yearOfBirth} • {sex} • {color}
                </div>
                <div className="text-sm font-normal text-muted-foreground flex items-center gap-4 mt-1">
                  <span>{new Date(date).toLocaleDateString()}</span>
                  <span>{raceCourse}</span>
                  <span>{surface}</span>
                  <span>{distance}</span>
                  <Badge variant="outline" className={getWelfareStatusColor(welfareStatus)}>
                    {welfareStatus}
                  </Badge>
                  <Badge variant="outline" className={getRiskCategoryColor(riskCategory)}>
                    {riskCategory} Risk
                  </Badge>
                  {alerts.length > 0 && (
                    <div className="flex gap-1">
                      {alerts.map((alert, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {alert}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ToggleGroup 
                  type="single" 
                  value={fullScreenMode} 
                  onValueChange={(value) => value && setFullScreenMode(value as 'single' | 'grid' | 'straight' | 'turn' | 'diff')}
                >
                  <ToggleGroupItem value="single" variant="outline" size="sm">
                    <Maximize2 className="w-4 h-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="grid" variant="outline" size="sm">
                    <Grid className="w-4 h-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="straight" variant="outline" size="sm">
                    Straight
                  </ToggleGroupItem>
                  <ToggleGroupItem value="turn" variant="outline" size="sm">
                    Turn
                  </ToggleGroupItem>
                  <ToggleGroupItem value="diff" variant="outline" size="sm">
                    Diff
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0">
            <StrideFullScreenModal
              graphConfigs={graphConfigs}
              currentGraphIndex={currentGraphIndex}
              fullScreenMode={fullScreenMode}
              onModeChange={setFullScreenMode}
              onNavigate={navigateGraph}
              onKeyDown={handleKeyDown}
              horseName={horseName}
              birthMonth={birthMonth}
              yearOfBirth={yearOfBirth}
              sex={sex}
              color={color}
              raceCourse={raceCourse}
              date={date}
              surface={surface}
              distance={distance}
              welfareStatus={welfareStatus}
              riskCategory={riskCategory}
              alerts={alerts}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedStrideAnalysisGraphs;
