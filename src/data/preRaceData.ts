
export interface StrideData {
  point: number; // 0-100
  gForce: number; // -14 to +14
}

export interface StrideAnalysis {
  dvStraight: number[][][];
  lgStraight: number[][][];
  mlStraight: number[][][];
  dvTurn: number[][][];
  lgTurn: number[][][];
  mlTurn: number[][][];
  dvDiff: number[][][];
  lgDiff: number[][][];
  mlDiff: number[][][];
}

export interface WelfareReport {
  id: number;
  date: string;
  raceCourse: string;
  surface: string;
  distance: string;
  welfareStatus: 'good' | 'warning' | 'alert';
  riskCategory: 1 | 2 | 3 | 4 | 5;
  alerts: string[];
  strideAnalysis: StrideAnalysis;
}

export interface SensitivitySettings {
  category3: 'low' | 'medium' | 'high';
  category4: 'low' | 'medium' | 'high';
  category5: 'low' | 'medium' | 'high';
}

export interface PreRaceHorse {
  id: number;
  name: string;
  birthDate: string;
  sex: 'Colt' | 'Filly' | 'Gelding' | 'Mare' | 'Stallion';
  color: string;
  postPosition: number;
  jockey: string;
  trainer: string;
  owner: string;
  vet: string;
  odds: string;
  weight: number;
  raceNumber: number;
  raceTime: string;
  performanceScore: number;
  wellnessScore: number;
  performanceRingScore: number;
  welfareAlert: boolean;
  welfareReports: WelfareReport[];
  examinationStatus: 'pending' | 'in-progress' | 'passed' | 'scratched';
  regularVetApproval: {
    status: 'approved' | 'pending' | 'declined';
    vetName: string;
    vetPractice: string;
    comments: string;
    approvalDate?: string;
  };
  lastExamination?: string;
  medicalFlags?: string[];
  history?: Array<{ status: 'good' | 'warning' | 'alert'; date: string }>;
  recommendationDate?: string;
  regulatoryVetComments?: string;
  officialStewardNotified?: string;
  trackOfficialNotified?: string;
  officialRecordUpdated?: boolean;
}

export interface RaceInfo {
  id: number;
  name: string;
  time: string;
  status: 'scheduled' | 'running' | 'finished';
  distance: string;
  purse: string;
}

export type ColumnKey = 'postPosition' | 'jockey' | 'trainer' | 'vet' | 'odds' | 'weight' | 'raceNumber' | 'raceTime' | 'examinationStatus' | 'regularVetApproval' | 'history' | 'welfareAlert' | 'actions';

export type WorkflowView = 'main' | 'to-examine' | 'passed' | 'scratched' | 'welfare-alerts' | 'category-filter';

// Helper function to get current risk category from latest welfare report
export const getCurrentRiskCategory = (horse: PreRaceHorse): number => {
  if (horse.welfareReports.length === 0) return 1;
  
  // Sort by date to get the most recent report
  const sortedReports = [...horse.welfareReports].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return sortedReports[0].riskCategory;
};

// Helper function to get category color
export const getCategoryColor = (category: number): string => {
  switch (category) {
    case 1: return 'bg-green-100 text-green-800 border-green-200';
    case 2: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 3: return 'bg-red-100 text-red-700 border-red-200';
    case 4: return 'bg-red-200 text-red-800 border-red-300';
    case 5: return 'bg-red-300 text-red-900 border-red-400';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Check if category is red-flagged (3, 4, or 5)
export const isRedFlaggedCategory = (category: number): boolean => {
  return category >= 3;
};

// Generate mock stride data for testing
const generateStrideData = (): number[][][] => {
  const data: number[][][] = [];
  for (let i = 0; i < 3; i++) {
    const section: number[][] = [];
    for (let j = 0; j < 10; j++) {
      const points: number[] = [];
      for (let k = 0; k < 100; k++) {
        points.push(Math.random() * 28 - 14); // Random value between -14 and +14
      }
      section.push(points);
    }
    data.push(section);
  }
  return data;
};

const generateStrideAnalysis = (): StrideAnalysis => ({
  dvStraight: generateStrideData(),
  lgStraight: generateStrideData(),
  mlStraight: generateStrideData(),
  dvTurn: generateStrideData(),
  lgTurn: generateStrideData(),
  mlTurn: generateStrideData(),
  dvDiff: generateStrideData(),
  lgDiff: generateStrideData(),
  mlDiff: generateStrideData(),
});

export const mockRaces: RaceInfo[] = [
  { id: 1, name: "Maiden Special Weight", time: "12:30 PM", status: 'scheduled', distance: "6F", purse: "$50,000" },
  { id: 2, name: "Allowance Optional Claiming", time: "1:00 PM", status: 'scheduled', distance: "1M", purse: "$75,000" },
  { id: 3, name: "Claiming $25,000", time: "1:30 PM", status: 'scheduled', distance: "6.5F", purse: "$40,000" },
  { id: 4, name: "Stakes - The Derby Trial", time: "2:00 PM", status: 'scheduled', distance: "1 1/8M", purse: "$200,000" },
  { id: 5, name: "Maiden Claiming $30,000", time: "2:30 PM", status: 'scheduled', distance: "1M", purse: "$35,000" },
  { id: 6, name: "Allowance", time: "3:00 PM", status: 'scheduled', distance: "1 1/16M", purse: "$65,000" },
  { id: 7, name: "Claiming $40,000", time: "3:30 PM", status: 'scheduled', distance: "7F", purse: "$45,000" },
  { id: 8, name: "Feature Stakes", time: "4:00 PM", status: 'scheduled', distance: "1 1/4M", purse: "$150,000" },
];

export const mockHorses: PreRaceHorse[] = [
  {
    id: 1, name: "Thunder Strike", birthDate: "2022-03", sex: "Colt", color: "Bay", 
    postPosition: 1, jockey: "M. Rodriguez", trainer: "J. Smith", owner: "Thunder Stables LLC", vet: "Dr. Wilson",
    odds: "3-1", weight: 120, raceNumber: 1, raceTime: "12:30 PM", performanceScore: 85, wellnessScore: 90,
    performanceRingScore: 88, welfareAlert: false, examinationStatus: 'pending',
    regularVetApproval: { status: 'approved', vetName: "Dr. Sarah Johnson", vetPractice: "Equine Health Center", comments: "Horse is in excellent condition.", approvalDate: "2024-06-09" },
    lastExamination: "2024-06-08", medicalFlags: [], 
    history: [{ status: 'good', date: '2024-06-08' }, { status: 'good', date: '2024-06-01' }],
    welfareReports: [
      { id: 1, date: "2024-06-01", raceCourse: "Churchill Downs", surface: "Dirt", distance: "6F", welfareStatus: "good", riskCategory: 1, alerts: [], strideAnalysis: generateStrideAnalysis() },
      { id: 2, date: "2024-05-15", raceCourse: "Keeneland", surface: "Turf", distance: "1M", welfareStatus: "good", riskCategory: 1, alerts: [], strideAnalysis: generateStrideAnalysis() }
    ]
  },
  {
    id: 2, name: "Midnight Runner", birthDate: "2021-04", sex: "Filly", color: "Black", 
    postPosition: 2, jockey: "L. Davis", trainer: "K. Brown", owner: "Midnight Racing Inc", vet: "Dr. Martinez",
    odds: "5-2", weight: 118, raceNumber: 1, raceTime: "12:30 PM", performanceScore: 78, wellnessScore: 70,
    performanceRingScore: 75, welfareAlert: true, examinationStatus: 'pending',
    regularVetApproval: { status: 'approved', vetName: "Dr. Michael Chen", vetPractice: "Valley Veterinary Clinic", comments: "Minor concern about stride pattern.", approvalDate: "2024-06-09" },
    lastExamination: "2024-06-07", medicalFlags: ["Stride irregularity noted"], 
    history: [{ status: 'alert', date: '2024-06-07' }],
    welfareReports: [
      { id: 1, date: "2024-06-07", raceCourse: "Belmont Park", surface: "Dirt", distance: "1M", welfareStatus: "alert", riskCategory: 5, alerts: ["C-Fx", "LF"], strideAnalysis: generateStrideAnalysis() },
      { id: 2, date: "2024-05-20", raceCourse: "Saratoga", surface: "Dirt", distance: "7F", welfareStatus: "warning", riskCategory: 2, alerts: ["S-Fx"], strideAnalysis: generateStrideAnalysis() },
      { id: 3, date: "2024-04-28", raceCourse: "Aqueduct", surface: "Dirt", distance: "6F", welfareStatus: "good", riskCategory: 1, alerts: [], strideAnalysis: generateStrideAnalysis() }
    ]
  },
  {
    id: 3, name: "Silver Bullet", birthDate: "2022-01", sex: "Gelding", color: "Gray", 
    postPosition: 3, jockey: "R. Thompson", trainer: "A. White", owner: "Silver Star Farms", vet: "Dr. Lee",
    odds: "8-1", weight: 116, raceNumber: 1, raceTime: "12:30 PM", performanceScore: 72, wellnessScore: 85,
    performanceRingScore: 78, welfareAlert: false, examinationStatus: 'passed',
    regularVetApproval: { status: 'approved', vetName: "Dr. Lisa Wang", vetPractice: "Track Side Veterinary", comments: "All clear.", approvalDate: "2024-06-10" },
    lastExamination: "2024-06-10", medicalFlags: [], 
    history: [{ status: 'good', date: '2024-06-10' }],
    recommendationDate: "2024-06-10T10:30:00Z",
    regulatoryVetComments: "Horse is in excellent condition and cleared for racing.",
    officialStewardNotified: "2024-06-10T10:31:00Z",
    trackOfficialNotified: "2024-06-10T10:31:30Z",
    officialRecordUpdated: true,
    welfareReports: [
      { id: 1, date: "2024-05-25", raceCourse: "Del Mar", surface: "Turf", distance: "1 1/8M", welfareStatus: "good", riskCategory: 1, alerts: [], strideAnalysis: generateStrideAnalysis() },
      { id: 2, date: "2024-04-12", raceCourse: "Santa Anita", surface: "Dirt", distance: "1M", welfareStatus: "good", riskCategory: 1, alerts: [], strideAnalysis: generateStrideAnalysis() }
    ]
  },
  {
    id: 4, name: "Fast Lane", birthDate: "2021-05", sex: "Colt", color: "Chestnut", 
    postPosition: 4, jockey: "S. Miller", trainer: "P. Jones", owner: "Fast Track Racing", vet: "Dr. Garcia",
    odds: "6-1", weight: 122, raceNumber: 1, raceTime: "12:30 PM", performanceScore: 80, wellnessScore: 88,
    performanceRingScore: 82, welfareAlert: false, examinationStatus: 'pending',
    regularVetApproval: { status: 'approved', vetName: "Dr. Robert Kim", vetPractice: "Premier Equine Medicine", comments: "Good condition.", approvalDate: "2024-06-09" },
    lastExamination: "2024-06-09", medicalFlags: [], 
    history: [{ status: 'good', date: '2024-06-09' }],
    welfareReports: [
      { id: 1, date: "2024-05-30", raceCourse: "Pimlico", surface: "Dirt", distance: "1 3/16M", welfareStatus: "good", riskCategory: 1, alerts: [], strideAnalysis: generateStrideAnalysis() }
    ]
  },
  {
    id: 5, name: "Victory Dance", birthDate: "2022-02", sex: "Filly", color: "Bay", 
    postPosition: 5, jockey: "T. Anderson", trainer: "M. Taylor", owner: "Victory Lane Stables", vet: "Dr. Brown",
    odds: "4-1", weight: 119, raceNumber: 1, raceTime: "12:30 PM", performanceScore: 83, wellnessScore: 82,
    performanceRingScore: 85, welfareAlert: false, examinationStatus: 'in-progress',
    regularVetApproval: { status: 'approved', vetName: "Dr. James Harrison", vetPractice: "Equine Medical Group", comments: "Under examination.", approvalDate: "2024-06-10" },
    lastExamination: "2024-06-10", medicalFlags: [], 
    history: [{ status: 'good', date: '2024-06-10' }],
    recommendationDate: "2024-06-10T11:15:00Z",
    regulatoryVetComments: "Examination in progress. No concerns noted so far.",
    welfareReports: [
      { id: 1, date: "2024-05-18", raceCourse: "Gulfstream Park", surface: "Dirt", distance: "1M", welfareStatus: "good", riskCategory: 1, alerts: [], strideAnalysis: generateStrideAnalysis() },
      { id: 2, date: "2024-04-05", raceCourse: "Oaklawn Park", surface: "Dirt", distance: "6F", welfareStatus: "warning", riskCategory: 2, alerts: ["RF"], strideAnalysis: generateStrideAnalysis() }
    ]
  },
  {
    id: 6, name: "Royal Flash", birthDate: "2021-11", sex: "Mare", color: "Chestnut", 
    postPosition: 6, jockey: "J. Wilson", trainer: "C. Davis", owner: "Royal Crown Racing", vet: "Dr. Martinez",
    odds: "12-1", weight: 115, raceNumber: 1, raceTime: "12:30 PM", performanceScore: 68, wellnessScore: 75,
    performanceRingScore: 72, welfareAlert: false, examinationStatus: 'pending',
    regularVetApproval: { status: 'pending', vetName: "Dr. Sarah Johnson", vetPractice: "Equine Health Center", comments: "Awaiting final check.", approvalDate: undefined },
    lastExamination: "2024-06-08", medicalFlags: [], 
    history: [{ status: 'warning', date: '2024-06-08' }],
    welfareReports: [
      { id: 1, date: "2024-06-08", raceCourse: "Woodbine", surface: "Turf", distance: "1 1/16M", welfareStatus: "warning", riskCategory: 2, alerts: ["BF"], strideAnalysis: generateStrideAnalysis() }
    ]
  },
  {
    id: 7, name: "Storm Breaker", birthDate: "2020-08", sex: "Stallion", color: "Dark Bay", 
    postPosition: 7, jockey: "K. Roberts", trainer: "L. Johnson", owner: "Storm Front Racing", vet: "Dr. Wilson",
    odds: "9-1", weight: 121, raceNumber: 1, raceTime: "12:30 PM", performanceScore: 76, wellnessScore: 78,
    performanceRingScore: 79, welfareAlert: true, examinationStatus: 'scratched',
    regularVetApproval: { status: 'declined', vetName: "Dr. Michael Chen", vetPractice: "Valley Veterinary Clinic", comments: "Not cleared for racing.", approvalDate: "2024-06-10" },
    lastExamination: "2024-06-10", medicalFlags: ["Elevated stress levels"], 
    history: [{ status: 'alert', date: '2024-06-10' }],
    recommendationDate: "2024-06-10T09:15:00Z",
    regulatoryVetComments: "Horse shows signs of elevated stress and irregular stride patterns. Recommend scratching for safety reasons.",
    officialStewardNotified: "2024-06-10T09:16:00Z",
    trackOfficialNotified: "2024-06-10T09:16:30Z",
    officialRecordUpdated: true,
    welfareReports: [
      { id: 1, date: "2024-06-10", raceCourse: "Belmont Park", surface: "Dirt", distance: "1 1/4M", welfareStatus: "alert", riskCategory: 5, alerts: ["C-Fx", "S-Fx", "HL"], strideAnalysis: generateStrideAnalysis() },
      { id: 2, date: "2024-05-22", raceCourse: "Pimlico", surface: "Dirt", distance: "1 3/16M", welfareStatus: "alert", riskCategory: 4, alerts: ["LF", "RF"], strideAnalysis: generateStrideAnalysis() },
      { id: 3, date: "2024-04-30", raceCourse: "Churchill Downs", surface: "Dirt", distance: "1 1/4M", welfareStatus: "warning", riskCategory: 2, alerts: ["S-Fx"], strideAnalysis: generateStrideAnalysis() }
    ]
  },
  {
    id: 8, name: "Golden Spirit", birthDate: "2022-06", sex: "Filly", color: "Palomino", 
    postPosition: 8, jockey: "D. Martin", trainer: "R. Wilson", owner: "Golden Gate Stables", vet: "Dr. Lee",
    odds: "15-1", weight: 114, raceNumber: 1, raceTime: "12:30 PM", performanceScore: 65, wellnessScore: 88,
    performanceRingScore: 70, welfareAlert: false, examinationStatus: 'pending',
    regularVetApproval: { status: 'approved', vetName: "Dr. Lisa Wang", vetPractice: "Track Side Veterinary", comments: "Cleared.", approvalDate: "2024-06-09" },
    lastExamination: "2024-06-09", medicalFlags: [], 
    history: [{ status: 'good', date: '2024-06-09' }],
    welfareReports: [
      { id: 1, date: "2024-05-10", raceCourse: "Golden Gate Fields", surface: "Turf", distance: "1M", welfareStatus: "good", riskCategory: 1, alerts: [], strideAnalysis: generateStrideAnalysis() }
    ]
  }
];
