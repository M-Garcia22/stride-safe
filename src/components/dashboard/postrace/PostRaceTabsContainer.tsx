
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostRaceTable from "./PostRaceTable";
import { PostRaceHorse, PostRaceColumnKey, PostRaceWorkflowView } from "../../../data/postRaceData";

interface PostRaceTabsContainerProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  workflowHorses: PostRaceHorse[];
  getHorsesByRaceAndWorkflow: (raceNumber: number) => PostRaceHorse[];
  visibleColumns: PostRaceColumnKey[];
  viewMode: 'single' | 'split';
  selectedHorse: PostRaceHorse | null;
  onHorseSelect: (horse: PostRaceHorse) => void;
}

const PostRaceTabsContainer = ({
  activeTab,
  onTabChange,
  workflowHorses,
  getHorsesByRaceAndWorkflow,
  visibleColumns,
  viewMode,
  selectedHorse,
  onHorseSelect
}: PostRaceTabsContainerProps) => {
  const availableRaces = [...new Set(workflowHorses.map(horse => horse.raceNumber))].sort();

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full overflow-x-auto" style={{ gridTemplateColumns: `repeat(${availableRaces.length + 1}, minmax(0, 1fr))` }}>
        <TabsTrigger value="all">All</TabsTrigger>
        {availableRaces.map(raceNumber => (
          <TabsTrigger key={raceNumber} value={`race-${raceNumber}`}>
            Race {raceNumber}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="all" className="mt-6">
        <PostRaceTable
          horses={workflowHorses}
          visibleColumns={visibleColumns}
          viewMode={viewMode}
          selectedHorse={selectedHorse}
          onHorseSelect={onHorseSelect}
        />
      </TabsContent>

      {availableRaces.map(raceNumber => {
        const raceHorses = getHorsesByRaceAndWorkflow(raceNumber);
        
        return (
          <TabsContent key={raceNumber} value={`race-${raceNumber}`} className="mt-6">
            {raceHorses.length > 0 ? (
              <PostRaceTable
                horses={raceHorses}
                visibleColumns={visibleColumns}
                viewMode={viewMode}
                selectedHorse={selectedHorse}
                onHorseSelect={onHorseSelect}
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No horses in Race {raceNumber} for this workflow
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

export default PostRaceTabsContainer;
