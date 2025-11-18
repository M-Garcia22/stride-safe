
import { useState } from 'react';
import { PostRaceHorse } from '../data/postRaceData';

export const usePostRaceSelection = (
  getHorseById: (id: number) => PostRaceHorse | undefined
) => {
  const [selectedHorseId, setSelectedHorseId] = useState<number | null>(null);

  const selectedHorse = selectedHorseId ? getHorseById(selectedHorseId) : null;

  const handleHorseSelect = (horse: PostRaceHorse) => {
    setSelectedHorseId(horse.id);
  };

  const clearSelection = () => {
    setSelectedHorseId(null);
  };

  return {
    selectedHorse,
    handleHorseSelect,
    clearSelection
  };
};
