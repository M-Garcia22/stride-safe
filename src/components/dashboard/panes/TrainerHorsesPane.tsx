
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { getWellnessColor, getFatigueColor } from "@/lib/colorUtils";
import { Report } from "@/types/report";
import { TrainerHorse } from "@/types/horse";
import { TrainerPaneProps } from "@/types/dashboard";
import { useTrainerHorses } from "@/hooks/useTrainerHorses";
import { AlertCircle, RefreshCw } from "lucide-react";

const TrainerHorsesPane = ({
  onPaneChange,
  onSelectHorse,
  onSelectReport
}: TrainerPaneProps) => {
  const { horses, loading, error, totalCount, refetch } = useTrainerHorses();

  const handleHorseRowClick = (horse: TrainerHorse) => {
    // Get the most recent report with welfare data
    const mostRecentReport = horse.recentReports.find(r => r.welfareRiskCategory !== null);
    
    if (onSelectHorse) {
      onSelectHorse(horse);
    }
    if (onSelectReport && mostRecentReport) {
      // Convert HorseReport to Report format
      const report: Report = {
        id: mostRecentReport.id,
        entryCode: mostRecentReport.id,
        date: mostRecentReport.date,
        track: mostRecentReport.track,
        raceNo: mostRecentReport.raceNo,
        distance: mostRecentReport.distance,
        surface: mostRecentReport.surface,
        welfareRiskCategory: mostRecentReport.welfareRiskCategory ?? 0,
        fatigueScore: mostRecentReport.fatigueScore ?? 0,
        welfareAlert: mostRecentReport.welfareAlert,
        isNew: false,
        horseName: horse.name,
        condylarFx: mostRecentReport.condylarFx,
        sesamoidFx: mostRecentReport.sesamoidFx,
        leftFront: mostRecentReport.leftFront,
        rightFront: mostRecentReport.rightFront,
        bothFront: mostRecentReport.bothFront,
        hindLimb: mostRecentReport.hindLimb,
      };
      onSelectReport(report);
    }
    onPaneChange("analytics");
  };

  if (loading) {
    return <LoadingSpinner message="Loading horses..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <div>
            <p className="font-medium text-foreground">Failed to load horses</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
          <Button onClick={refetch} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-light text-foreground mb-2">My Horses</h1>
        <p className="text-lg text-muted-foreground">
          {totalCount} horse{totalCount !== 1 ? 's' : ''} in your stable
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">All Horses</CardTitle>
          <Button onClick={refetch} variant="ghost" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {horses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No horses found in your stable.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-sm font-medium">Horse Name</TableHead>
                  <TableHead className="text-sm font-medium">Born</TableHead>
                  <TableHead className="text-sm font-medium">Risk History</TableHead>
                  <TableHead className="text-sm font-medium">Recent Fatigue</TableHead>
                  <TableHead className="text-sm font-medium">Risk Alert</TableHead>
                  <TableHead className="text-sm font-medium">Last Race</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {horses.map(horse => (
                  <TableRow 
                    key={horse.id} 
                    className="hover:bg-blue-50/60 transition-colors duration-200 py-3 cursor-pointer" 
                    onClick={() => handleHorseRowClick(horse)}
                  >
                    <TableCell className="font-medium text-sm py-3">
                      <div>
                        <div className="font-semibold">{horse.name}</div>
                        {(horse.sire || horse.dam) && (
                          <div className="text-xs text-muted-foreground">
                            {horse.sire && `Sire: ${horse.sire}`}
                            {horse.sire && horse.dam && ' • '}
                            {horse.dam && `Dam: ${horse.dam}`}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm py-3">
                      {horse.yearOfBirth ?? 'Unknown'}
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex gap-1">
                        {horse.riskHistory.length > 0 ? (
                          horse.riskHistory.slice(0, 5).map((category, index) => {
                            const riskColor = getWellnessColor(category * 25);
                            return (
                              <div
                                key={index}
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 bg-white shadow-sm"
                                style={{
                                  borderColor: riskColor,
                                  color: '#000'
                                }}
                              >
                                {category}
                              </div>
                            );
                          })
                        ) : (
                          <span className="text-muted-foreground text-sm">No data</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      {horse.recentFatigue !== null ? (
                        <div className="flex justify-center">
                          <div 
                            className="px-3 py-1 rounded-md flex items-center justify-center text-sm font-bold border-2 bg-white shadow-sm min-w-[50px]"
                            style={{
                              borderColor: getFatigueColor(horse.recentFatigue),
                              color: '#000'
                            }}
                          >
                            {horse.recentFatigue}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="py-3">
                      {horse.hasAlert ? (
                        <Badge variant="destructive" className="text-xs">
                          Alert
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">None</span>
                      )}
                    </TableCell>
                    <TableCell className="py-3 text-sm">
                      {horse.daysSinceLastRace !== null ? (
                        horse.daysSinceLastRace === 0 ? (
                          <span className="text-green-600 font-medium">Today</span>
                        ) : horse.daysSinceLastRace === 1 ? (
                          <span>Yesterday</span>
                        ) : (
                          <span>{horse.daysSinceLastRace} days ago</span>
                        )
                      ) : (
                        <span className="text-muted-foreground">Unknown</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerHorsesPane;
