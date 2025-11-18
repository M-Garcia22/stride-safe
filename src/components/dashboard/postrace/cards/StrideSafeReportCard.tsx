import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertTriangle, Activity, History, ChevronDown, ChevronUp, BarChart3 } from "lucide-react";
import StrideSafeAnalysisTable from "../StrideSafeAnalysisTable";
import BlackBoxConfirmDialog from "../../BlackBoxConfirmDialog";
import StrideAnalysisGraphs from "../../prerace/StrideAnalysisGraphs";
import { PostRaceHorse } from "../../../../data/postRaceData";
import { adaptPostRaceStrideData } from "../../../../utils/postRaceStrideAdapter";

interface StrideSafeReportCardProps {
  horse: PostRaceHorse;
  onHistoricReports?: (horseName: string) => void;
}

const StrideSafeReportCard = ({ horse, onHistoricReports }: StrideSafeReportCardProps) => {
  const [showBlackBoxDialog, setShowBlackBoxDialog] = useState(false);
  const [isStrideAnalysisOpen, setIsStrideAnalysisOpen] = useState(false);

  const handleBlackBoxRequest = () => {
    setShowBlackBoxDialog(true);
  };

  const handleBlackBoxConfirm = () => {
    console.log(`BlackBox analysis requested for ${horse.name}`);
    // In a real implementation, this would trigger the BlackBox analysis workflow
  };

  const handleHistoricReports = () => {
    if (onHistoricReports) {
      onHistoricReports(horse.name);
    }
  };

  // Check if horse did not finish the race
  const isDNF = horse.raceStatus === 'dnf';

  // Get the most recent welfare report for stride analysis
  const latestReport = horse.welfareReports[0];

  // Extract birth year and month from birthDate
  const birthDate = new Date(horse.birthDate);
  const birthMonth = (birthDate.getMonth() + 1).toString(); // Convert to string and getMonth() returns 0-11
  const yearOfBirth = birthDate.getFullYear();

  return (
    <>
      <Card className={`overflow-hidden ${horse.welfareAlert ? "border-red-200 bg-red-50/50" : ""}`}>
        <CardHeader className="px-4 py-3 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">StrideSAFE Post-race Report</CardTitle>
            {!isDNF && (
              <Button 
                onClick={handleHistoricReports}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <History className="w-4 h-4" />
                Historic Reports
              </Button>
            )}
          </div>
          
          {isDNF ? (
            <div className="mt-2 p-2 bg-gray-100 border border-gray-200 rounded-md">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800">Report Not Available</p>
                  <p className="text-xs text-gray-700 mt-1 break-words">
                    {horse.name} did not finish the race. Post-race stride analysis is not available for DNF horses.
                  </p>
                  <Button 
                    onClick={handleBlackBoxRequest}
                    className="mt-2 bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Order BlackBox Analysis
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            horse.welfareAlert && (
              <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-red-800">Welfare Alert Detected</p>
                    <p className="text-xs text-red-700 mt-1 break-words">
                      Stride analysis has identified welfare concerns requiring immediate attention.
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </CardHeader>
        
        <CardContent className="px-4 pb-3 pt-0">
          {!isDNF && (
            <>
              <div className="w-full mb-2">
                <StrideSafeAnalysisTable reports={horse.welfareReports} compact={true} />
              </div>

              {/* Collapsible Stride Analysis Section */}
              {latestReport && latestReport.strideAnalysis && (
                <Collapsible open={isStrideAnalysisOpen} onOpenChange={setIsStrideAnalysisOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1 hover:bg-muted/50 rounded-md transition-colors">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-3 h-3" />
                      <span className="text-xs font-medium">
                        {isStrideAnalysisOpen ? 'Hide Stride Analysis' : 'Show Stride Analysis'}
                      </span>
                    </div>
                    {isStrideAnalysisOpen ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="mt-2">
                    <StrideAnalysisGraphs
                      strideAnalysis={adaptPostRaceStrideData(
                        latestReport,
                        horse.name,
                        {
                          raceCourse: latestReport.raceCourse || "Unknown Track",
                          surface: latestReport.surface || "Unknown",
                          distance: latestReport.distance || "Unknown",
                          date: latestReport.date
                        }
                      ).strideAnalysis}
                      raceCourse={latestReport.raceCourse || "Unknown Track"}
                      date={new Date(latestReport.date).toLocaleDateString()}
                      horseName={horse.name}
                      birthMonth={birthMonth}
                      yearOfBirth={yearOfBirth}
                      sex={horse.sex}
                      color={horse.color}
                      surface={latestReport.surface || "Unknown"}
                      distance={latestReport.distance || "Unknown"}
                      welfareStatus={latestReport.welfareStatus}
                      riskCategory={latestReport.riskCategory.toString()}
                      alerts={latestReport.alerts}
                      showHeader={false}
                    />
                  </CollapsibleContent>
                </Collapsible>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <BlackBoxConfirmDialog
        isOpen={showBlackBoxDialog}
        onClose={() => setShowBlackBoxDialog(false)}
        onConfirm={handleBlackBoxConfirm}
        horseName={horse.name}
        raceNumber={horse.raceNumber}
      />
    </>
  );
};

export default StrideSafeReportCard;
