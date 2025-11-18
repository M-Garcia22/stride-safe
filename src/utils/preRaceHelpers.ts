
import { ColumnKey } from '../data/preRaceData';

export const getTodaysDate = (): string => {
  const today = new Date();
  return today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export const getSplitViewColumns = (): ColumnKey[] => {
  return ['raceNumber', 'postPosition', 'history', 'welfareAlert', 'examinationStatus'];
};

export const getSingleViewColumns = (): ColumnKey[] => {
  return ['raceNumber', 'postPosition', 'trainer', 'vet', 'history', 'welfareAlert', 'actions'];
};
