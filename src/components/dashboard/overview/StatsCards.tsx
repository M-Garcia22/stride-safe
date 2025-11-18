
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Heart } from "lucide-react";

interface StatsCardsProps {
  todaysRaces: number;
  activeHorses: number;
  fatalInjuriesCurrentYear: number;
  fatalInjuriesPreviousYear: number;
  fatalInjuryRate: number;
}

const StatsCards = ({
  todaysRaces,
  activeHorses,
  fatalInjuriesCurrentYear,
  fatalInjuriesPreviousYear,
  fatalInjuryRate
}: StatsCardsProps) => {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Races</CardTitle>
          <Trophy className="h-4 w-4 text-forest-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todaysRaces}</div>
          <p className="text-xs text-muted-foreground">
            +2 from yesterday
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Horses</CardTitle>
          <Users className="h-4 w-4 text-sage-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeHorses}</div>
          <p className="text-xs text-muted-foreground">
            Entered for today
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fatal Injuries</CardTitle>
          <Heart className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{fatalInjuriesCurrentYear}</div>
          <p className="text-xs text-muted-foreground">
            This year (was {fatalInjuriesPreviousYear} last year)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fatal Injury Rate</CardTitle>
          <Heart className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{fatalInjuryRate}</div>
          <p className="text-xs text-muted-foreground">
            per 1000 starts YTD
          </p>
        </CardContent>
      </Card>
    </>
  );
};

export default StatsCards;
