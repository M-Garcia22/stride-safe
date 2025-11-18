
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import StrideSafeAnalysisTable from "../postrace/StrideSafeAnalysisTable";
import { usePostRaceDataManager } from "../../../hooks/usePostRaceDataManager";
import { PostRaceWelfareReport } from "../../../data/postRaceData";

interface IndividualAnalysisPaneProps {
  horseName?: string;
  onBack?: () => void;
}

const IndividualAnalysisPane = ({ horseName, onBack }: IndividualAnalysisPaneProps) => {
  const { horses } = usePostRaceDataManager();

  // Generate mock historic reports for the selected horse
  const generateHistoricReports = (horseName: string): PostRaceWelfareReport[] => {
    const baseReports: PostRaceWelfareReport[] = [
      {
        id: 1001,
        date: new Date(2024, 0, 8).toISOString(),
        raceCourse: "Santa Anita Park",
        surface: "dirt",
        distance: "6 furlongs",
        welfareStatus: 'good' as const,
        riskCategory: 1,
        condylarFx: false,
        sesamoidFx: false,
        leftFront: false,
        rightFront: false,
        bothFront: false,
        hindLimb: false,
        alerts: [],
        analysisType: 'StrideSAFE' as const,
        strideAnalysis: {
          dvStraight: 0.95,
          dvTurn: 0.93,
          symmetryIndex: 0.96,
          strideLength: 4.8,
          strideFrequency: 2.3
        }
      },
      {
        id: 1002,
        date: new Date(2024, 0, 1).toISOString(),
        raceCourse: "Del Mar",
        surface: "turf",
        distance: "1 mile",
        welfareStatus: 'warning' as const,
        riskCategory: 2,
        condylarFx: false,
        sesamoidFx: true,
        leftFront: false,
        rightFront: false,
        bothFront: false,
        hindLimb: false,
        alerts: ['S-Fx'],
        analysisType: 'StrideSAFE' as const,
        strideAnalysis: {
          dvStraight: 0.88,
          dvTurn: 0.85,
          symmetryIndex: 0.82,
          strideLength: 4.5,
          strideFrequency: 2.2
        }
      },
      {
        id: 1003,
        date: new Date(2023, 11, 20).toISOString(),
        raceCourse: "Churchill Downs",
        surface: "dirt",
        distance: "1.25 miles",
        welfareStatus: 'good' as const,
        riskCategory: 1,
        condylarFx: false,
        sesamoidFx: false,
        leftFront: false,
        rightFront: false,
        bothFront: false,
        hindLimb: false,
        alerts: [],
        analysisType: 'StrideSAFE' as const,
        strideAnalysis: {
          dvStraight: 0.94,
          dvTurn: 0.92,
          symmetryIndex: 0.95,
          strideLength: 4.9,
          strideFrequency: 2.4
        }
      }
    ];

    // Add current race reports if horse exists
    const currentHorse = horses.find(h => h.name === horseName);
    if (currentHorse && currentHorse.welfareReports.length > 0) {
      return [...currentHorse.welfareReports, ...baseReports];
    }

    return baseReports;
  };

  if (horseName) {
    const historicReports = generateHistoricReports(horseName);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <h2 className="text-xl font-semibold">Historic StrideSAFE Reports - {horseName}</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All StrideSAFE Post-race Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <StrideSafeAnalysisTable reports={historicReports} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Individual Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This pane will contain detailed individual horse analysis, performance metrics, 
            and personalized insights for specific horses. You can define what specific 
            analysis tools and data visualizations should be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default IndividualAnalysisPane;
