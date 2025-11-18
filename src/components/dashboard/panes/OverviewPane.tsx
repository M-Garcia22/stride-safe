
import WelfareAlertsCard from "@/components/dashboard/overview/WelfareAlertsCard";
import StatsCards from "@/components/dashboard/overview/StatsCards";
import WellnessScoreCard from "@/components/dashboard/overview/WellnessScoreCard";
import TrackSafeCard from "@/components/dashboard/overview/TrackSafeCard";
import BlackBoxReportsCard from "@/components/dashboard/overview/BlackBoxReportsCard";

interface OverviewPaneProps {
  onPaneChange?: (pane: string) => void;
}

const OverviewPane = ({ onPaneChange }: OverviewPaneProps) => {
  // Recent BlackBox reports from the last 24 hours
  const recentBlackBoxReports = [
    {
      id: "BB-2024-001",
      date: "2024-01-15",
      time: "2:30 PM",
      horseName: "Thunder Strike",
      raceNumber: 1,
      incident: "Pulled up - Lameness",
      status: "Completed"
    },
    {
      id: "BB-2024-002", 
      date: "2024-01-15",
      time: "11:45 AM",
      horseName: "Lightning Bolt",
      raceNumber: 2,
      incident: "Fell at 6th furlong",
      status: "Completed"
    },
    {
      id: "BB-2024-003",
      date: "2024-01-15",
      time: "8:20 AM",
      horseName: "Storm Runner", 
      raceNumber: 3,
      incident: "Distressed breathing",
      status: "Under Review"
    }
  ];

  const handleViewReport = (reportId: string) => {
    console.log(`Viewing BlackBox report ${reportId}`);
    // TODO: Navigate to BlackBox pane with specific report
  };

  const handleWelfareAlertsClick = () => {
    if (onPaneChange) {
      onPaneChange("alerts");
    }
  };

  // Mock data for welfare alerts (matching AlertHorsesPane)
  const welfareAlertsToday = 3; // horses racing today with alerts
  const welfareAlertsNext7Days = 5; // horses racing in next 7 days with alerts

  // Fatal injury data
  const fatalInjuriesCurrentYear = 2; // horses with fatal injuries this year
  const fatalInjuriesPreviousYear = 4; // horses with fatal injuries last year

  // TrackSAFE data with enhanced surface conditions and rainfall
  const trackSurfaceCondition = "Good - Firm"; // Can be "Good - Soft", "Good - Hard", "Good - Wet", etc.
  const lastReportDate = "2024-01-15";
  const requiresSpecialAttention = false;
  const rainfall24Hours = "2.3mm"; // rainfall in last 24 hours
  const rainfall3Days = "8.7mm"; // rainfall in last 3 days
  const weatherStation = "Belmont Park Weather Station #3"; // nearby weather station

  // Wellness Score data
  const currentWellnessScore = 95; // Current wellness score (1-140)
  const wellnessLastUpdated = "2024-01-15"; // Date of last wellness report

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <WelfareAlertsCard
          welfareAlertsToday={welfareAlertsToday}
          welfareAlertsNext7Days={welfareAlertsNext7Days}
          onClick={handleWelfareAlertsClick}
        />
        
        <StatsCards
          todaysRaces={12}
          activeHorses={156}
          fatalInjuriesCurrentYear={fatalInjuriesCurrentYear}
          fatalInjuriesPreviousYear={fatalInjuriesPreviousYear}
          fatalInjuryRate={0.7}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <WellnessScoreCard
          currentWellnessScore={currentWellnessScore}
          wellnessLastUpdated={wellnessLastUpdated}
        />

        <TrackSafeCard
          trackSurfaceCondition={trackSurfaceCondition}
          lastReportDate={lastReportDate}
          requiresSpecialAttention={requiresSpecialAttention}
          rainfall24Hours={rainfall24Hours}
          rainfall3Days={rainfall3Days}
          weatherStation={weatherStation}
        />

        <BlackBoxReportsCard
          recentBlackBoxReports={recentBlackBoxReports}
          onViewReport={handleViewReport}
        />
      </div>
    </div>
  );
};

export default OverviewPane;
