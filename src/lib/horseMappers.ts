import { Horse, TrainerHorse } from '@/types/horse';

/**
 * Convert TrainerHorse (from API) to Horse format (used by analytics components)
 * 
 * TrainerHorse contains data from the trainer horses endpoint with race/welfare info.
 * Horse is the format expected by analytics components like HorseBasicInfoCard.
 */
export function trainerHorseToAnalyticsHorse(horse: TrainerHorse): Horse {
  return {
    id: horse.id,
    name: horse.name,
    yearOfBirth: horse.yearOfBirth ?? new Date().getFullYear() - 3,
    sex: horse.sex ?? 'Unknown',
    color: 'Unknown', // Not available in database from what I can tell
    sire: horse.sire ?? 'Unknown',
    dam: horse.dam ?? 'Unknown',
    paternalGrandfather: horse.sireSire ?? 'Unknown',
    paternalGrandmother: 'Unknown', // Not available in database from what I can tell
    maternalGrandfather: horse.damSire ?? 'Unknown',
    maternalGrandmother: 'Unknown', // Not available in database from what I can tell
    trainer: 'Unknown', // Not directly available in TrainerHorse
    owner: horse.owner ?? 'Unknown',
    breeder: horse.breeder ?? undefined,
    daysSinceLastReport: horse.daysSinceLastRace ?? undefined,
    sharedWithVets: [],
  };
}

/**
 * Create a minimal Horse object when only basic info is available (e.g., from a report)
 */
export function createMinimalHorse(id: string, name: string): Horse {
  return {
    id,
    name,
    yearOfBirth: new Date().getFullYear() - 3,
    sex: 'Unknown',
    color: 'Unknown',
    sire: 'Unknown',
    dam: 'Unknown',
    paternalGrandfather: 'Unknown',
    paternalGrandmother: 'Unknown',
    maternalGrandfather: 'Unknown',
    maternalGrandmother: 'Unknown',
    trainer: 'Unknown',
    owner: 'Unknown',
    sharedWithVets: [],
  };
}

