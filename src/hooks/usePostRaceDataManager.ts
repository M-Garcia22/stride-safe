
import { useState } from 'react';
import { mockPostRaceHorses as initialHorses, PostRaceHorse } from '../data/postRaceData';

export const usePostRaceDataManager = () => {
  const [horses, setHorses] = useState<PostRaceHorse[]>(initialHorses);

  const updateHorse = (horseId: number, updates: Partial<PostRaceHorse>) => {
    setHorses(prevHorses => 
      prevHorses.map(horse => 
        horse.id === horseId 
          ? { ...horse, ...updates }
          : horse
      )
    );
  };

  const getHorseById = (horseId: number): PostRaceHorse | undefined => {
    return horses.find(horse => horse.id === horseId);
  };

  return {
    horses,
    updateHorse,
    getHorseById
  };
};
