
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PreRaceTable from "./PreRaceTable";
import { PreRaceHorse, ColumnKey, WorkflowView, SensitivitySettings } from "../../../data/preRaceData";

interface RaceTabsContainerProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  workflowHorses: PreRaceHorse[];
  getHorsesByRaceAndWorkflow: (raceNumber: number) => PreRaceHorse[];
  visibleColumns: ColumnKey[];
  viewMode: 'single' | 'split';
  selectedHorse: PreRaceHorse | null;
  onHorseSelect: (horse: PreRaceHorse) => void;
  onExaminationAction: (horseId: number, action: 'scratch' | 'pass') => void;
  sensitivitySettings: SensitivitySettings;
}

const RaceTabsContainer = ({
  activeTab,
  onTabChange,
  workflowHorses,
  getHorsesByRaceAndWorkflow,
  visibleColumns,
  viewMode,
  selectedHorse,
  onHorseSelect,
  onExaminationAction,
  sensitivitySettings
}: RaceTabsContainerProps) => {
  const availableRaces = [...new Set(workflowHorses.map(horse => horse.raceNumber))].sort();

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full overflow-x-auto" style={{ gridTemplateColumns: `repeat(${availableRaces.length + 1}, minmax(0, 1fr))` }}>
        <TabsTrigger value="all">All</TabsTrigger>
        {availableRaces.map(raceNumber => (
          <TabsTrigger key={raceNumber} value={`race-${raceNumber}`}>
            {raceNumber}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="all" className="mt-6">
        <PreRaceTable
          horses={workflowHorses}
          visibleColumns={visibleColumns}
          viewMode={viewMode}
          selectedHorse={selectedHorse}
          onHorseSelect={onHorseSelect}
          onExaminationAction={onExaminationAction}
        />
      </TabsContent>

      {availableRaces.map(raceNumber => {
        const raceHorses = getHorsesByRaceAndWorkflow(raceNumber);
        const raceColumnsWithoutRaceNumber = visibleColumns.filter(col => col !== 'raceNumber');
        
        return (
          <TabsContent key={raceNumber} value={`race-${raceNumber}`} className="mt-6">
            {raceHorses.length > 0 ? (
              <PreRaceTable
                horses={raceHorses}
                visibleColumns={raceColumnsWithoutRaceNumber}
                viewMode={viewMode}
                selectedHorse={selectedHorse}
                onHorseSelect={onHorseSelect}
                onExaminationAction={onExaminationAction}
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

export default RaceTabsContainer;
