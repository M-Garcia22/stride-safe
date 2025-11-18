
export interface Horse {
  id: string;
  name: string;
  yearOfBirth: number;
  sex: string;
  color: string;
  wellnessScore?: number;
  performanceScore?: number;
  welfareAlert?: boolean;
  sire: string;
  dam: string;
  paternalGrandfather: string;
  paternalGrandmother: string;
  maternalGrandfather: string;
  maternalGrandmother: string;
  trainer: string;
  owner: string;
  daysSinceLastReport?: number;
  breeder?: string;
  vet?: string;
  description?: string;
  sharedWithVets?: string[];
}

export interface Vet {
  id: string;
  name: string;
  practice: string;
  location: string;
  licenseNumber: string;
}
