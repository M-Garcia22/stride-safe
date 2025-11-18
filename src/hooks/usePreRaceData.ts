
import { useMemo } from 'react';
import { mockRaces, PreRaceHorse, RaceInfo, WorkflowView, getCurrentRiskCategory } from '../data/preRaceData';

export const usePreRaceData = (horses: PreRaceHorse[]) => {
  const allHorses = horses;
  
  const categorizedHorses = useMemo(() => {
    const welfareAlertHorses = allHorses.filter(horse => horse.welfareAlert);
    const toExamineHorses = allHorses.filter(horse => 
      horse.examinationStatus === 'pending' || horse.examinationStatus === 'in-progress'
    );
    const passedHorses = allHorses.filter(horse => horse.examinationStatus === 'passed');
    const scratchedHorses = allHorses.filter(horse => horse.examinationStatus === 'scratched');

    return {
      welfareAlertHorses,
      toExamineHorses,
      passedHorses,
      scratchedHorses
    };
  }, [allHorses]);

  const categoryCounts = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    allHorses.forEach(horse => {
      const category = getCurrentRiskCategory(horse);
      counts[category] = (counts[category] || 0) + 1;
    });
    
    return counts;
  }, [allHorses]);

  const getHorsesByWorkflow = (workflowView: WorkflowView): PreRaceHorse[] => {
    switch (workflowView) {
      case 'to-examine':
        return categorizedHorses.toExamineHorses;
      case 'passed':
        return categorizedHorses.passedHorses;
      case 'scratched':
        return categorizedHorses.scratchedHorses;
      case 'welfare-alerts':
        return categorizedHorses.welfareAlertHorses;
      default:
        return allHorses;
    }
  };

  const getHorsesByCategory = (categories: number[]): PreRaceHorse[] => {
    if (categories.length === 0) return allHorses;
    
    return allHorses.filter(horse => {
      const currentCategory = getCurrentRiskCategory(horse);
      return categories.includes(currentCategory);
    });
  };

  const getHorsesByRiskLevel = (minCategory: number): PreRaceHorse[] => {
    return allHorses.filter(horse => {
      const currentCategory = getCurrentRiskCategory(horse);
      return currentCategory >= minCategory;
    });
  };

  const getCombinedFilters = (workflowView: WorkflowView, categories: number[], raceNumber?: number): PreRaceHorse[] => {
    let filteredHorses = getHorsesByWorkflow(workflowView);
    
    // Apply category filter
    if (categories.length > 0) {
      filteredHorses = filteredHorses.filter(horse => {
        const currentCategory = getCurrentRiskCategory(horse);
        return categories.includes(currentCategory);
      });
    }
    
    // Apply race filter
    if (raceNumber) {
      filteredHorses = filteredHorses.filter(horse => horse.raceNumber === raceNumber);
    }
    
    return filteredHorses;
  };

  const getHorsesByRaceAndWorkflow = (raceNumber: number, workflowView: WorkflowView): PreRaceHorse[] => {
    const raceHorses = allHorses.filter(horse => horse.raceNumber === raceNumber);
    
    switch (workflowView) {
      case 'to-examine':
        return raceHorses.filter(horse => horse.examinationStatus === 'pending' || horse.examinationStatus === 'in-progress');
      case 'passed':
        return raceHorses.filter(horse => horse.examinationStatus === 'passed');
      case 'scratched':
        return raceHorses.filter(horse => horse.examinationStatus === 'scratched');
      case 'welfare-alerts':
        return raceHorses.filter(horse => horse.welfareAlert);
      default:
        return raceHorses;
    }
  };

  const getHorsesByRaceAndCategory = (raceNumber: number, categories: number[]): PreRaceHorse[] => {
    const raceHorses = allHorses.filter(horse => horse.raceNumber === raceNumber);
    
    if (categories.length === 0) return raceHorses;
    
    return raceHorses.filter(horse => {
      const currentCategory = getCurrentRiskCategory(horse);
      return categories.includes(currentCategory);
    });
  };

  return {
    allHorses,
    races: mockRaces,
    categoryCounts,
    ...categorizedHorses,
    getHorsesByWorkflow,
    getHorsesByCategory,
    getHorsesByRiskLevel,
    getCombinedFilters,
    getHorsesByRaceAndWorkflow,
    getHorsesByRaceAndCategory
  };
};
