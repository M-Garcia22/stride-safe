
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Star, Heart, Crown } from "lucide-react";
import HorseTable from "./HorseTable";
import { Badge } from "@/components/ui/badge";

type ColumnKey = 'born' | 'sex' | 'lastRace' | 'lastBreeze' | 'lifetimePurse' | 'vet' | 'breeder' | 'lifetimeWins' | 'colour' | 'owner' | 'stableId' | 'status' | 'dateLastRaced' | 'lastBreezed' | 'lastBreezeTime' | 'nextListing';

interface Horse {
  id: number;
  name: string;
  born?: string;
  sex?: string;
  lastRace?: string;
  lastBreeze?: string;
  performanceScore: number;
  wellnessScore: number;
  performanceRingScore: number;
  welfareAlert: boolean;
  isFollowing?: boolean;
  followedHorse?: boolean;
  hasUpcomingRace?: boolean;
  nextRace?: string | null;
  lifetimePurse?: string;
  vet?: string;
  breeder?: string;
  lifetimeWins?: number;
  paddockMode?: boolean;
  status?: string;
  birthMonth?: string;
  birthYear?: number;
  colour?: string;
  owner?: string;
  stableId?: string;
  dateLastRaced?: string | null;
  lastBreezed?: string | null;
  lastBreezeTime?: string | null;
  nextListing?: string | null;
}

interface Race {
  id: number;
  name: string;
  raceDate: string;
  track: string;
  distance?: string;
  performanceScore: number;
  welfareAlert: boolean;
  wellnessScore: number;
  performanceRingScore: number;
}

interface StableTabsProps {
  horses: Horse[];
  upcomingRaces: Race[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  visibleColumns: ColumnKey[];
  onColumnToggle: (columnKey: ColumnKey) => void;
  selectedHorse?: Horse | null;
  onHorseSelect?: (horse: Horse) => void;
  onToggleFollow?: (horseId: number) => void;
  onVetMessage?: (horseName: string) => void;
  onEditAction?: (horseId: number, action: 'remove' | 'paddock' | 'activate') => void;
  isEditMode?: boolean;
}

const StableTabs = ({ 
  horses, 
  upcomingRaces,
  activeTab, 
  onTabChange, 
  visibleColumns, 
  onColumnToggle,
  selectedHorse,
  onHorseSelect,
  onToggleFollow,
  onVetMessage,
  onEditAction,
  isEditMode = false
}: StableTabsProps) => {
  const allHorses = horses;
  const listedHorses = horses.filter(horse => horse.hasUpcomingRace);
  const followedHorses = horses.filter(horse => horse.isFollowing || horse.followedHorse);
  const welfareAlertHorses = horses.filter(h => h.welfareAlert && !h.paddockMode);

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="training" className="flex items-center gap-2">
          <Heart className="w-4 h-4" />
          All
        </TabsTrigger>
        <TabsTrigger value="upcoming" className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Upcoming Races
        </TabsTrigger>
        <TabsTrigger value="welfare" className="flex items-center gap-2">
          Welfare Alerts
        </TabsTrigger>
        <TabsTrigger value="following" className="flex items-center gap-2">
          <Star className="w-4 h-4" />
          Following
        </TabsTrigger>
      </TabsList>

      <TabsContent value="training" className="mt-6">
        <HorseTable
          horses={allHorses}
          visibleColumns={visibleColumns}
          onColumnToggle={onColumnToggle}
          isEditMode={isEditMode}
          selectedHorse={selectedHorse}
          onHorseSelect={onHorseSelect}
          onToggleFollow={onToggleFollow}
          onVetMessage={onVetMessage}
          onEditAction={onEditAction}
          showEditActions={isEditMode}
          showAllColumns={true}
        />
      </TabsContent>

      <TabsContent value="upcoming" className="mt-6">
        {upcomingRaces.length > 0 ? (
          <div className="space-y-4">
            <HorseTable
              horses={upcomingRaces.map(race => ({
                id: race.id,
                name: race.name,
                performanceScore: race.performanceScore,
                wellnessScore: race.wellnessScore,
                performanceRingScore: race.performanceRingScore,
                welfareAlert: race.welfareAlert
              }))}
              visibleColumns={visibleColumns}
              onColumnToggle={onColumnToggle}
              selectedHorse={selectedHorse}
              onHorseSelect={onHorseSelect}
              onToggleFollow={onToggleFollow}
              onVetMessage={onVetMessage}
              showAllColumns={true}
            />
            <div className="mt-4 space-y-2">
              <h4 className="font-medium">Race Schedule</h4>
              {upcomingRaces.map((race) => (
                <div key={race.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <span className="font-medium">{race.name}</span>
                    <span className="text-muted-foreground ml-2">→ {race.track}</span>
                  </div>
                  <Badge variant="outline">{new Date(race.raceDate).toLocaleDateString()}</Badge>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No upcoming races scheduled
          </div>
        )}
      </TabsContent>

      <TabsContent value="welfare" className="mt-6">
        {welfareAlertHorses.length > 0 ? (
          <HorseTable
            horses={welfareAlertHorses}
            visibleColumns={visibleColumns}
            onColumnToggle={onColumnToggle}
            showAllColumns={true}
            selectedHorse={selectedHorse}
            onHorseSelect={onHorseSelect}
            onToggleFollow={onToggleFollow}
            onVetMessage={onVetMessage}
            onEditAction={onEditAction}
          />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No horses with welfare alerts
          </div>
        )}
      </TabsContent>

      <TabsContent value="following" className="mt-6">
        {followedHorses.length > 0 ? (
          <HorseTable
            horses={followedHorses}
            visibleColumns={visibleColumns}
            onColumnToggle={onColumnToggle}
            showAllColumns={true}
            selectedHorse={selectedHorse}
            onHorseSelect={onHorseSelect}
            onToggleFollow={onToggleFollow}
            onVetMessage={onVetMessage}
            onEditAction={onEditAction}
          />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No horses in your watch list</p>
            <p className="text-sm mt-1">Click the star icon next to any horse to add them to your watch list</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default StableTabs;
