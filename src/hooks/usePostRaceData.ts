
import { useMemo } from 'react';
import { mockPostRaceHorses, mockRaceData, PostRaceHorse, RaceData, PostRaceWorkflowView } from '../data/postRaceData';

export const usePostRaceData = (horses: PostRaceHorse[]) => {
  // Enhance horses data with surface information from race data
  const allHorses = useMemo(() => {
    return horses.map(horse => {
      const raceInfo = mockRaceData.find(race => race.raceNumber === horse.raceNumber);
      const surface = raceInfo?.surface || 'dirt';
      
      return {
        ...horse,
        welfareReports: horse.welfareReports.map(report => ({
          ...report,
          surface: surface
        }))
      };
    });
  }, [horses]);
  
  const categorizedHorses = useMemo(() => {
    const welfareAlertHorses = allHorses.filter(horse => horse.welfareAlert);
    const finishedHorses = allHorses.filter(horse => horse.raceStatus === 'finished');
    const dnfHorses = allHorses.filter(horse => horse.raceStatus === 'dnf');

    return {
      welfareAlertHorses,
      finishedHorses,
      dnfHorses
    };
  }, [allHorses]);

  const getHorsesByWorkflow = (workflowView: PostRaceWorkflowView): PostRaceHorse[] => {
    switch (workflowView) {
      case 'welfare-alerts':
        return categorizedHorses.welfareAlertHorses;
      default:
        return allHorses;
    }
  };

  const getHorsesByRaceAndWorkflow = (raceNumber: number, workflowView: PostRaceWorkflowView): PostRaceHorse[] => {
    const raceHorses = allHorses.filter(horse => horse.raceNumber === raceNumber);
    
    switch (workflowView) {
      case 'welfare-alerts':
        return raceHorses.filter(horse => horse.welfareAlert);
      default:
        return raceHorses;
    }
  };

  return {
    allHorses,
    races: mockRaceData,
    ...categorizedHorses,
    getHorsesByWorkflow,
    getHorsesByRaceAndWorkflow
  };
};
