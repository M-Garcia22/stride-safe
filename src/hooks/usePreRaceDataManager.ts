
import { useState } from 'react';
import { mockHorses as initialHorses, PreRaceHorse } from '../data/preRaceData';

export const usePreRaceDataManager = () => {
  const [horses, setHorses] = useState<PreRaceHorse[]>(initialHorses);

  const updateHorse = (horseId: number, updates: Partial<PreRaceHorse>) => {
    setHorses(prevHorses => 
      prevHorses.map(horse => 
        horse.id === horseId 
          ? { ...horse, ...updates }
          : horse
      )
    );
  };

  const handleExaminationAction = (horseId: number, action: 'scratch' | 'pass') => {
    console.log(`${action} horse with ID: ${horseId}`);
    const currentTime = new Date().toISOString();
    
    const updates: Partial<PreRaceHorse> = {
      examinationStatus: action === 'scratch' ? 'scratched' : 'passed',
      recommendationDate: currentTime,
      regulatoryVetComments: action === 'scratch' 
        ? 'Horse recommended for scratch based on examination findings.'
        : 'Horse cleared for racing after examination.',
      officialStewardNotified: currentTime,
      trackOfficialNotified: new Date(Date.now() + 30000).toISOString(), // 30 seconds later
      officialRecordUpdated: true
    };

    updateHorse(horseId, updates);
  };

  const getHorseById = (horseId: number): PreRaceHorse | undefined => {
    return horses.find(horse => horse.id === horseId);
  };

  return {
    horses,
    updateHorse,
    handleExaminationAction,
    getHorseById
  };
};
