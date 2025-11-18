
import { useState } from 'react';
import { PreRaceHorse } from '../data/preRaceData';

export const usePreRaceSelection = (
  getHorseById: (id: number) => PreRaceHorse | undefined,
  onExaminationAction: (horseId: number, action: 'scratch' | 'pass') => void
) => {
  const [selectedHorseId, setSelectedHorseId] = useState<number | null>(null);

  const selectedHorse = selectedHorseId ? getHorseById(selectedHorseId) : null;

  const handleHorseSelect = (horse: PreRaceHorse) => {
    setSelectedHorseId(horse.id);
  };

  const handleExaminationAction = (horseId: number, action: 'scratch' | 'pass') => {
    onExaminationAction(horseId, action);
  };

  const clearSelection = () => {
    setSelectedHorseId(null);
  };

  return {
    selectedHorse,
    handleHorseSelect,
    handleExaminationAction,
    clearSelection
  };
};
