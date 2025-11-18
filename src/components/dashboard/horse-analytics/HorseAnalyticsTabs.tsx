
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Horse } from "@/types/horse";
import { Report } from "@/types/report";
import HorseOverviewTab from "@/components/dashboard/horse-analytics/HorseOverviewTab";
import HorseTabPlaceholder from "@/components/dashboard/horse-analytics/HorseTabPlaceholder";
import TrendsAnalysisPane from "@/components/dashboard/horse-analytics/TrendsAnalysisPane";
import VelocityAnalysisPane from "@/components/dashboard/horse-analytics/VelocityAnalysisPane";
import LastReportTab from "@/components/dashboard/horse-analytics/LastReportTab";

interface HorseAnalyticsTabsProps {
  horse: Horse;
  defaultTab?: string;
  selectedReport?: Report | null;
}

const HorseAnalyticsTabs = ({ horse, defaultTab, selectedReport }: HorseAnalyticsTabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || "last-report");

  // Update active tab when defaultTab changes
  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="last-report">Last Report</TabsTrigger>
            <TabsTrigger value="overview">180-Day Report</TabsTrigger>
            <TabsTrigger value="reports">Past Reports</TabsTrigger>
            <TabsTrigger value="trends">Welfare & Fatigue</TabsTrigger>
            <TabsTrigger value="veterinary">Velocity/Acceleration</TabsTrigger>
          </TabsList>

          <TabsContent value="last-report" className="mt-6">
            <LastReportTab horse={horse} selectedReport={selectedReport} />
          </TabsContent>

          <TabsContent value="overview" className="mt-6">
            <HorseOverviewTab horse={horse} onTabChange={handleTabChange} />
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <HorseTabPlaceholder 
              horse={horse}
              title="Past Reports"
              description="Historical reports and analysis for {horseName}."
            />
          </TabsContent>

          <TabsContent value="trends" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Welfare & Fatigue Trends</h3>
              <TrendsAnalysisPane horse={horse} />
            </div>
          </TabsContent>

          <TabsContent value="veterinary" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Velocity & Acceleration Analysis</h3>
              <VelocityAnalysisPane horse={horse} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HorseAnalyticsTabs;
