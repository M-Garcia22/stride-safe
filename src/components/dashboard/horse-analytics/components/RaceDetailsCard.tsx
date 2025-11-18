
import { Horse } from "@/types/horse";
import { Report } from "@/types/report";
import { Card, CardContent } from "@/components/ui/card";

interface RaceDetailsCardProps {
  horse: Horse;
  selectedReport?: Report | null;
}

const RaceDetailsCard = ({ horse, selectedReport }: RaceDetailsCardProps) => {
  // Use selected report data if available, otherwise fall back to mock data
  const raceDetails = selectedReport ? {
    raceTrack: selectedReport.track,
    date: selectedReport.date,
    raceNumber: selectedReport.raceNo,
    distance: selectedReport.distance,
    surface: selectedReport.surface
  } : {
    raceTrack: "Del Mar",
    date: "2024-02-17",
    raceNumber: 7,
    distance: "6f",
    surface: "Dirt"
  };

  const formatDate = (dateString: string) => {
    return dateString; // Return yyyy-mm-dd format directly
  };

  return (
    <Card>
      <CardContent className="pt-3 pb-3">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Track</p>
            <p className="text-sm font-medium">{raceDetails.raceTrack}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Date</p>
            <p className="text-sm font-medium">{formatDate(raceDetails.date)}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Race</p>
            <p className="text-sm font-medium">Race {raceDetails.raceNumber}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Distance</p>
            <p className="text-sm font-medium">{raceDetails.distance}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Surface</p>
            <p className="text-sm font-medium">{raceDetails.surface}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RaceDetailsCard;
