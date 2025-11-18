export interface PostRaceWelfareReport {
  id: number;
  date: string;
  raceCourse: string;
  surface: string;
  distance: string;
  welfareStatus: 'good' | 'warning' | 'alert';
  alerts: string[];
  riskCategory: 1 | 2 | 3 | 4 | 5; // Changed from 'low' | 'medium' | 'high' to numbers
  analysisType: 'StrideSAFE' | 'Manual';
  strideAnalysis: {
    dvStraight: number;
    dvTurn: number;
    symmetryIndex: number;
    strideLength: number;
    strideFrequency: number;
  };
  // New fracture and limb indicators
  condylarFx: boolean;
  sesamoidFx: boolean;
  leftFront: boolean;
  rightFront: boolean;
  bothFront: boolean;
  hindLimb: boolean;
}

export interface PostRaceHorse {
  id: number;
  name: string;
  raceNumber: number;
  postPosition: number;
  jockey: string;
  trainer: string;
  owner: string;
  birthDate: string;
  sex: string;
  color: string;
  weight: number;
  odds: string;
  raceTime: string;
  vet: string;
  
  // Post-race specific fields
  finishPosition: number | null; // null for DNF
  finishTime: string | null;
  raceStatus: 'finished' | 'dnf' | 'scratched' | 'disqualified';
  
  // Race performance data
  splitTimes: {
    quarter1: string;
    half: string;
    threeQuarter: string;
    final: string;
  } | null;
  speed: {
    averageSpeed: number;
    topSpeed: number;
  } | null;
  
  // Welfare and examination - using PostRaceWelfareReport
  welfareAlert: boolean;
  welfareReports: PostRaceWelfareReport[];
  
  // New welfare fields for enhanced reporting
  welfareStatus: 'green' | 'amber' | 'red';
  riskCategory: 'Cat 1' | 'Cat 2' | 'Cat 3' | 'Cat 4' | 'Cat 5';
  markers: string[]; // Array of markers like 'C-FX', 'S-Fx', 'LF', 'RF', 'BF', 'HL'
  
  postRaceExamination: {
    status: 'pending' | 'completed' | 'not-required';
    vetName?: string;
    findings?: string;
    cleared?: boolean;
    followUpRequired?: boolean;
  };
  
  history?: Array<{ 
    status: 'good' | 'warning' | 'alert'; 
    date: string; 
  }>;
}

export interface RaceData {
  raceNumber: number;
  raceName: string;
  distance: string;
  surface: 'dirt' | 'turf' | 'synthetic';
  conditions: {
    trackCondition: 'fast' | 'good' | 'firm' | 'yielding' | 'soft' | 'heavy';
    weather: 'clear' | 'cloudy' | 'rain' | 'fog';
    temperature: number;
    windSpeed: number;
    windDirection: string;
  };
  startTime: string;
  finishTime: string;
  totalHorses: number;
  finishers: number;
  dnf: number;
}

export type PostRaceWorkflowView = 'all-races' | 'welfare-alerts';

export type PostRaceColumnKey = 'horseName' | 'race' | 'finish' | 'welfare' | 'risk' | 'cFx' | 'sFx' | 'lf' | 'rf' | 'bf' | 'hl' | 'marker' | 'welfareAlert';

// Mock race data
export const mockRaceData: RaceData[] = [
  {
    raceNumber: 1,
    raceName: "Maiden Special Weight",
    distance: "6 furlongs",
    surface: "dirt",
    conditions: {
      trackCondition: "fast",
      weather: "clear",
      temperature: 72,
      windSpeed: 8,
      windDirection: "SW"
    },
    startTime: "1:00 PM",
    finishTime: "1:01:12",
    totalHorses: 8,
    finishers: 7,
    dnf: 1
  },
  {
    raceNumber: 2,
    raceName: "Allowance Race",
    distance: "1 mile",
    surface: "turf",
    conditions: {
      trackCondition: "firm",
      weather: "cloudy",
      temperature: 68,
      windSpeed: 12,
      windDirection: "NW"
    },
    startTime: "1:30 PM",
    finishTime: "1:36:45",
    totalHorses: 10,
    finishers: 10,
    dnf: 0
  }
];

// Mock post-race horses data
export const mockPostRaceHorses: PostRaceHorse[] = [
  {
    id: 1,
    name: "Thunder Strike",
    raceNumber: 1,
    postPosition: 3,
    jockey: "M. Rodriguez",
    trainer: "J. Smith",
    owner: "Blue Sky Stables",
    birthDate: "2021-04-15",
    sex: "Colt",
    color: "Bay",
    weight: 120,
    odds: "3-1",
    raceTime: "1:00 PM",
    vet: "Dr. Johnson",
    finishPosition: 1,
    finishTime: "1:10.23",
    raceStatus: "finished",
    splitTimes: {
      quarter1: "22.45",
      half: "45.12",
      threeQuarter: "1:09.87",
      final: "1:10.23"
    },
    speed: {
      averageSpeed: 35.2,
      topSpeed: 42.1
    },
    welfareAlert: false,
    welfareStatus: 'green',
    riskCategory: 'Cat 1',
    markers: [],
    welfareReports: [
      {
        id: 1,
        date: "2024-01-15",
        raceCourse: "Santa Anita Park",
        surface: "dirt",
        distance: "6 furlongs",
        welfareStatus: "good",
        alerts: [],
        riskCategory: 1,
        analysisType: "StrideSAFE",
        strideAnalysis: {
          dvStraight: 0.95,
          dvTurn: 0.93,
          symmetryIndex: 0.96,
          strideLength: 4.8,
          strideFrequency: 2.3
        },
        condylarFx: false,
        sesamoidFx: false,
        leftFront: false,
        rightFront: false,
        bothFront: false,
        hindLimb: false
      }
    ],
    postRaceExamination: {
      status: "completed",
      vetName: "Dr. Johnson",
      findings: "Horse appears sound post-race",
      cleared: true,
      followUpRequired: false
    },
    history: [
      { status: 'good', date: '2024-01-10' },
      { status: 'good', date: '2024-01-05' }
    ]
  },
  {
    id: 2,
    name: "Lightning Bolt",
    raceNumber: 1,
    postPosition: 5,
    jockey: "S. Davis",
    trainer: "M. Wilson",
    owner: "Fast Track Racing",
    birthDate: "2021-03-22",
    sex: "Filly",
    color: "Chestnut",
    weight: 118,
    odds: "5-1",
    raceTime: "1:00 PM",
    vet: "Dr. Martinez",
    finishPosition: null,
    finishTime: null,
    raceStatus: "dnf",
    splitTimes: {
      quarter1: "22.78",
      half: "46.12",
      threeQuarter: "1:11.45",
      final: "DNF"
    },
    speed: {
      averageSpeed: 34.8,
      topSpeed: 41.3
    },
    welfareAlert: true,
    welfareStatus: 'red',
    riskCategory: 'Cat 5',
    markers: ['LF', 'S-Fx'],
    welfareReports: [], // DNF horses don't have post-race reports
    postRaceExamination: {
      status: "completed",
      vetName: "Dr. Martinez",
      findings: "Left front lameness detected",
      cleared: false,
      followUpRequired: true
    },
    history: [
      { status: 'warning', date: '2024-01-10' },
      { status: 'alert', date: '2024-01-15' }
    ]
  },
  // Race 1 - Additional finished horses (positions 2, 4, 5, 6, 7, 8)
  {
    id: 3,
    name: "Blazing Speed",
    raceNumber: 1,
    postPosition: 1,
    jockey: "R. Williams",
    trainer: "P. Anderson",
    owner: "Speed Stables",
    birthDate: "2021-05-20",
    sex: "Colt",
    color: "Chestnut",
    weight: 122,
    odds: "4-1",
    raceTime: "1:00 PM",
    vet: "Dr. Johnson",
    finishPosition: 2,
    finishTime: "1:10.45",
    raceStatus: "finished",
    splitTimes: {
      quarter1: "22.67",
      half: "45.34",
      threeQuarter: "1:10.12",
      final: "1:10.45"
    },
    speed: {
      averageSpeed: 35.0,
      topSpeed: 41.8
    },
    welfareAlert: false,
    welfareStatus: 'green',
    riskCategory: 'Cat 1',
    markers: [],
    welfareReports: [
      {
        id: 3,
        date: "2024-01-15",
        raceCourse: "Santa Anita Park",
        surface: "dirt",
        distance: "6 furlongs",
        welfareStatus: "good",
        alerts: [],
        riskCategory: 1,
        analysisType: "StrideSAFE",
        strideAnalysis: {
          dvStraight: 0.93,
          dvTurn: 0.91,
          symmetryIndex: 0.94,
          strideLength: 4.7,
          strideFrequency: 2.4
        },
        condylarFx: false,
        sesamoidFx: false,
        leftFront: false,
        rightFront: false,
        bothFront: false,
        hindLimb: false
      }
    ],
    postRaceExamination: {
      status: "completed",
      vetName: "Dr. Johnson",
      findings: "Normal post-race examination",
      cleared: true,
      followUpRequired: false
    },
    history: [
      { status: 'good', date: '2024-01-10' },
      { status: 'good', date: '2024-01-05' }
    ]
  },
  {
    id: 4,
    name: "Golden Arrow",
    raceNumber: 1,
    postPosition: 2,
    jockey: "T. Garcia",
    trainer: "L. Murphy",
    owner: "Golden Gate Farm",
    birthDate: "2021-06-10",
    sex: "Filly",
    color: "Palomino",
    weight: 119,
    odds: "6-1",
    raceTime: "1:00 PM",
    vet: "Dr. Johnson",
    finishPosition: 4,
    finishTime: "1:11.23",
    raceStatus: "finished",
    splitTimes: {
      quarter1: "22.89",
      half: "45.67",
      threeQuarter: "1:10.45",
      final: "1:11.23"
    },
    speed: {
      averageSpeed: 34.5,
      topSpeed: 41.2
    },
    welfareAlert: true,
    welfareStatus: 'amber',
    riskCategory: 'Cat 2',
    markers: ['RF'],
    welfareReports: [
      {
        id: 4,
        date: "2024-01-15",
        raceCourse: "Santa Anita Park",
        surface: "dirt",
        distance: "6 furlongs",
        welfareStatus: "warning",
        alerts: ["RF"],
        riskCategory: 2,
        analysisType: "StrideSAFE",
        strideAnalysis: {
          dvStraight: 0.87,
          dvTurn: 0.84,
          symmetryIndex: 0.81,
          strideLength: 4.4,
          strideFrequency: 2.1
        },
        condylarFx: false,
        sesamoidFx: false,
        leftFront: false,
        rightFront: true,
        bothFront: false,
        hindLimb: false
      }
    ],
    postRaceExamination: {
      status: "completed",
      vetName: "Dr. Johnson",
      findings: "Mild right front sensitivity detected",
      cleared: true,
      followUpRequired: true
    },
    history: [
      { status: 'good', date: '2024-01-10' },
      { status: 'warning', date: '2024-01-15' }
    ]
  },
  {
    id: 5,
    name: "Midnight Runner",
    raceNumber: 1,
    postPosition: 4,
    jockey: "K. Thompson",
    trainer: "D. Roberts",
    owner: "Midnight Stables",
    birthDate: "2021-07-15",
    sex: "Gelding",
    color: "Black",
    weight: 124,
    odds: "8-1",
    raceTime: "1:00 PM",
    vet: "Dr. Martinez",
    finishPosition: 5,
    finishTime: "1:11.67",
    raceStatus: "finished",
    splitTimes: {
      quarter1: "23.12",
      half: "46.23",
      threeQuarter: "1:11.12",
      final: "1:11.67"
    },
    speed: {
      averageSpeed: 34.2,
      topSpeed: 40.8
    },
    welfareAlert: true,
    welfareStatus: 'red',
    riskCategory: 'Cat 4',
    markers: ['C-Fx', 'LF'],
    welfareReports: [
      {
        id: 5,
        date: "2024-01-15",
        raceCourse: "Santa Anita Park",
        surface: "dirt",
        distance: "6 furlongs",
        welfareStatus: "alert",
        alerts: ["C-Fx", "LF"],
        riskCategory: 4,
        analysisType: "StrideSAFE",
        strideAnalysis: {
          dvStraight: 0.72,
          dvTurn: 0.68,
          symmetryIndex: 0.65,
          strideLength: 4.1,
          strideFrequency: 1.9
        },
        condylarFx: true,
        sesamoidFx: false,
        leftFront: true,
        rightFront: false,
        bothFront: false,
        hindLimb: false
      }
    ],
    postRaceExamination: {
      status: "completed",
      vetName: "Dr. Martinez",
      findings: "Significant left front lameness, possible condylar fracture",
      cleared: false,
      followUpRequired: true
    },
    history: [
      { status: 'good', date: '2024-01-10' },
      { status: 'alert', date: '2024-01-15' }
    ]
  },
  {
    id: 6,
    name: "Silver Streak",
    raceNumber: 1,
    postPosition: 6,
    jockey: "A. Martinez",
    trainer: "C. Johnson",
    owner: "Silver Creek Ranch",
    birthDate: "2021-08-05",
    sex: "Filly",
    color: "Gray",
    weight: 117,
    odds: "12-1",
    raceTime: "1:00 PM",
    vet: "Dr. Brown",
    finishPosition: 6,
    finishTime: "1:12.34",
    raceStatus: "finished",
    splitTimes: {
      quarter1: "23.45",
      half: "46.78",
      threeQuarter: "1:11.67",
      final: "1:12.34"
    },
    speed: {
      averageSpeed: 33.8,
      topSpeed: 40.2
    },
    welfareAlert: false,
    welfareStatus: 'amber',
    riskCategory: 'Cat 2',
    markers: ['HL'],
    welfareReports: [
      {
        id: 6,
        date: "2024-01-15",
        raceCourse: "Santa Anita Park",
        surface: "dirt",
        distance: "6 furlongs",
        welfareStatus: "warning",
        alerts: ["HL"],
        riskCategory: 2,
        analysisType: "StrideSAFE",
        strideAnalysis: {
          dvStraight: 0.85,
          dvTurn: 0.82,
          symmetryIndex: 0.78,
          strideLength: 4.3,
          strideFrequency: 2.0
        },
        condylarFx: false,
        sesamoidFx: false,
        leftFront: false,
        rightFront: false,
        bothFront: false,
        hindLimb: true
      }
    ],
    postRaceExamination: {
      status: "completed",
      vetName: "Dr. Brown",
      findings: "Mild hind limb gait irregularity",
      cleared: true,
      followUpRequired: true
    },
    history: [
      { status: 'good', date: '2024-01-10' },
      { status: 'warning', date: '2024-01-15' }
    ]
  },
  {
    id: 7,
    name: "Fire Storm",
    raceNumber: 1,
    postPosition: 7,
    jockey: "J. Davis",
    trainer: "M. Wilson",
    owner: "Storm Racing",
    birthDate: "2021-09-12",
    sex: "Colt",
    color: "Chestnut",
    weight: 121,
    odds: "15-1",
    raceTime: "1:00 PM",
    vet: "Dr. Brown",
    finishPosition: 7,
    finishTime: "1:13.12",
    raceStatus: "finished",
    splitTimes: {
      quarter1: "23.67",
      half: "47.12",
      threeQuarter: "1:12.23",
      final: "1:13.12"
    },
    speed: {
      averageSpeed: 33.2,
      topSpeed: 39.5
    },
    welfareAlert: false,
    welfareStatus: 'green',
    riskCategory: 'Cat 1',
    markers: [],
    welfareReports: [
      {
        id: 7,
        date: "2024-01-15",
        raceCourse: "Santa Anita Park",
        surface: "dirt",
        distance: "6 furlongs",
        welfareStatus: "good",
        alerts: [],
        riskCategory: 1,
        analysisType: "StrideSAFE",
        strideAnalysis: {
          dvStraight: 0.91,
          dvTurn: 0.89,
          symmetryIndex: 0.92,
          strideLength: 4.6,
          strideFrequency: 2.2
        },
        condylarFx: false,
        sesamoidFx: false,
        leftFront: false,
        rightFront: false,
        bothFront: false,
        hindLimb: false
      }
    ],
    postRaceExamination: {
      status: "completed",
      vetName: "Dr. Brown",
      findings: "Normal post-race examination",
      cleared: true,
      followUpRequired: false
    },
    history: [
      { status: 'good', date: '2024-01-10' },
      { status: 'good', date: '2024-01-15' }
    ]
  },
  {
    id: 8,
    name: "Royal Thunder",
    raceNumber: 1,
    postPosition: 8,
    jockey: "S. Rodriguez",
    trainer: "B. Taylor",
    owner: "Royal Stables",
    birthDate: "2021-10-20",
    sex: "Gelding",
    color: "Bay",
    weight: 123,
    odds: "20-1",
    raceTime: "1:00 PM",
    vet: "Dr. Martinez",
    finishPosition: 8,
    finishTime: "1:14.45",
    raceStatus: "finished",
    splitTimes: {
      quarter1: "24.12",
      half: "47.89",
      threeQuarter: "1:13.12",
      final: "1:14.45"
    },
    speed: {
      averageSpeed: 32.5,
      topSpeed: 38.7
    },
    welfareAlert: true,
    welfareStatus: 'red',
    riskCategory: 'Cat 5',
    markers: ['S-Fx', 'BF'],
    welfareReports: [
      {
        id: 8,
        date: "2024-01-15",
        raceCourse: "Santa Anita Park",
        surface: "dirt",
        distance: "6 furlongs",
        welfareStatus: "alert",
        alerts: ["S-Fx", "BF"],
        riskCategory: 5,
        analysisType: "StrideSAFE",
        strideAnalysis: {
          dvStraight: 0.63,
          dvTurn: 0.59,
          symmetryIndex: 0.58,
          strideLength: 3.8,
          strideFrequency: 1.7
        },
        condylarFx: false,
        sesamoidFx: true,
        leftFront: false,
        rightFront: false,
        bothFront: true,
        hindLimb: false
      }
    ],
    postRaceExamination: {
      status: "completed",
      vetName: "Dr. Martinez",
      findings: "Bilateral front limb lameness, sesamoid fracture suspected",
      cleared: false,
      followUpRequired: true
    },
    history: [
      { status: 'good', date: '2024-01-10' },
      { status: 'alert', date: '2024-01-15' }
    ]
  },
  // Race 2 - Storm Chaser (existing) + 9 new horses
  {
    id: 9,
    name: "Storm Chaser",
    raceNumber: 2,
    postPosition: 1,
    jockey: "A. Garcia",
    trainer: "R. Thompson",
    owner: "Wind Ridge Farm",
    birthDate: "2020-05-10",
    sex: "Gelding",
    color: "Gray",
    weight: 126,
    odds: "2-1",
    raceTime: "1:30 PM",
    vet: "Dr. Brown",
    finishPosition: 3,
    finishTime: "1:36.89",
    raceStatus: "finished",
    splitTimes: {
      quarter1: "24.12",
      half: "48.67",
      threeQuarter: "1:12.34",
      final: "1:36.89"
    },
    speed: {
      averageSpeed: 37.5,
      topSpeed: 43.2
    },
    welfareAlert: false,
    welfareStatus: 'amber',
    riskCategory: 'Cat 2',
    markers: ['RF'],
    welfareReports: [
      {
        id: 9,
        date: "2024-01-15",
        raceCourse: "Del Mar",
        surface: "turf",
        distance: "1 mile",
        welfareStatus: "warning",
        alerts: ["RF"],
        riskCategory: 2,
        analysisType: "StrideSAFE",
        strideAnalysis: {
          dvStraight: 0.88,
          dvTurn: 0.85,
          symmetryIndex: 0.82,
          strideLength: 4.5,
          strideFrequency: 2.2
        },
        condylarFx: false,
        sesamoidFx: false,
        leftFront: false,
        rightFront: true,
        bothFront: false,
        hindLimb: false
      }
    ],
    postRaceExamination: {
      status: "completed",
      vetName: "Dr. Brown",
      findings: "Normal post-race examination",
      cleared: true,
      followUpRequired: false
    },
    history: [
      { status: 'good', date: '2024-01-12' },
      { status: 'good', date: '2024-01-08' }
    ]
  },
  {
    id: 10,
    name: "Ocean Breeze",
    raceNumber: 2,
    postPosition: 2,
    jockey: "M. Johnson",
    trainer: "K. Davis",
    owner: "Coastal Farms",
    birthDate: "2020-04-18",
    sex: "Mare",
    color: "Bay",
    weight: 124,
    odds: "3-1",
    raceTime: "1:30 PM",
    vet: "Dr. Smith",
    finishPosition: 1,
    finishTime: "1:36.23",
    raceStatus: "finished",
    splitTimes: {
      quarter1: "23.89",
      half: "48.12",
      threeQuarter: "1:11.67",
      final: "1:36.23"
    },
    speed: {
      averageSpeed: 38.2,
      topSpeed: 44.1
    },
    welfareAlert: false,
    welfareStatus: 'green',
    riskCategory: 'Cat 1',
    markers: [],
    welfareReports: [
      {
        id: 10,
        date: "2024-01-15",
        raceCourse: "Del Mar",
        surface: "turf",
        distance: "1 mile",
        welfareStatus: "good",
        alerts: [],
        riskCategory: 1,
        analysisType: "StrideSAFE",
        strideAnalysis: {
          dvStraight: 0.96,
          dvTurn: 0.94,
          symmetryIndex: 0.97,
          strideLength: 5.1,
          strideFrequency: 2.5
        },
        condylarFx: false,
        sesamoidFx: false,
        leftFront: false,
        rightFront: false,
        bothFront: false,
        hindLimb: false
      }
    ],
    postRaceExamination: {
      status: "completed",
      vetName: "Dr. Smith",
      findings: "Excellent condition post-race",
      cleared: true,
      followUpRequired: false
    },
    history: [
      { status: 'good', date: '2024-01-12' },
      { status: 'good', date: '2024-01-08' }
    ]
  },
  {
    id: 11,
    name: "Desert Wind",
    raceNumber: 2,
    postPosition: 3,
    jockey: "L. Williams",
    trainer: "P. Martinez",
    owner: "Desert Racing LLC",
    birthDate: "2020-06-22",
    sex: "Gelding",
    color: "Chestnut",
    weight: 125,
    odds: "4-1",
    raceTime: "1:30 PM",
    vet: "Dr. Smith",
    finishPosition: 2,
    finishTime: "1:36.67",
    raceStatus: "finished",
    splitTimes: {
      quarter1: "24.01",
      half: "48.34",
      threeQuarter: "1:12.12",
      final: "1:36.67"
    },
    speed: {
      averageSpeed: 37.8,
      topSpeed: 43.7
    },
    welfareAlert: false,
    welfareStatus: 'green',
    riskCategory: 'Cat 1',
    markers: [],
    welfareReports: [
      {
        id: 11,
        date: "2024-01-15",
        raceCourse: "Del Mar",
        surface: "turf",
        distance: "1 mile",
        welfareStatus: "good",
        alerts: [],
        riskCategory: 1,
        analysisType: "StrideSAFE",
        strideAnalysis: {
          dvStraight: 0.94,
          dvTurn: 0.92,
          symmetryIndex: 0.95,
          strideLength: 4.9,
          strideFrequency: 2.4
        },
        condylarFx: false,
        sesamoidFx: false,
        leftFront: false,
        rightFront: false,
        bothFront: false,
        hindLimb: false
      }
    ],
    postRaceExamination: {
      status: "completed",
      vetName: "Dr. Smith",
      findings: "Normal post-race examination",
      cleared: true,
      followUpRequired: false
    },
    history: [
      { status: 'good', date: '2024-01-12' },
      { status: 'good', date: '2024-01-08' }
    ]
  },
  {
    id: 12,
    name: "Moonlight Express",
    raceNumber: 2,
    postPosition: 4,
    jockey: "R. Thompson",
    trainer: "S. Anderson",
    owner: "Moonbeam Stables",
    birthDate: "2020-07-30",
    sex: "Filly",
    color: "Black",
    weight: 122,
    odds: "6-1",
    raceTime: "1:30 PM",
    vet: "Dr. Brown",
    finishPosition: 4,
    finishTime: "1:37.45",
    raceStatus: "finished",
    splitTimes: {
      quarter1: "24.23",
      half: "48.78",
      threeQuarter: "1:12.89",
      final: "1:37.45"
    },
    speed: {
      averageSpeed: 37.2,
      topSpeed: 42.8
    },
    welfareAlert: true,
    welfareStatus: 'amber',
    riskCategory: 'Cat 3',
    markers: ['LF'],
    welfareReports: [
      {
        id: 12,
        date: "2024-01-15",
        raceCourse: "Del Mar",
        surface: "turf",
        distance: "1 mile",
        welfareStatus: "warning",
        alerts: ["LF"],
        riskCategory: 3,
        analysisType: "StrideSAFE",
        strideAnalysis: {
          dvStraight: 0.83,
          dvTurn: 0.79,
          symmetryIndex: 0.76,
          strideLength: 4.2,
          strideFrequency: 2.0
        },
        condylarFx: false,
        sesamoidFx: false,
        leftFront: true,
        rightFront: false,
        bothFront: false,
        hindLimb: false
      }
    ],
    postRaceExamination: {
      status: "completed",
      vetName: "Dr. Brown",
      findings: "Mild left front sensitivity",
      cleared: true,
      followUpRequired: true
    },
    history: [
      { status: 'good', date: '2024-01-12' },
      { status: 'warning', date: '2024-01-15' }
    ]
  },
  {
    id: 13,
    name: "Crimson Tide",
    raceNumber: 2,
    postPosition: 5,
    jockey: "D. Rodriguez",
    trainer: "T. Wilson",
    owner: "Tide Racing Inc",
    birthDate: "2020-08-14",
    sex: "Colt",
    color: "Dark Bay",
    weight: 127,
    odds: "8-1",
    raceTime: "1:30 PM",
    vet: "Dr. Johnson",
    finishPosition: 5,
    finishTime: "1:38.12",
    raceStatus: "finished",
    splitTimes: {
      quarter1: "24.45",
      half: "49.23",
      threeQuarter: "1:13.45",
      final: "1:38.12"
    },
    speed: {
      averageSpeed: 36.8,
      topSpeed: 42.3
    },
    welfareAlert: false,
    welfareStatus: 'green',
    riskCategory: 'Cat 1',
    markers: [],
    welfareReports: [
      {
        id: 13,
        date: "2024-01-15",
        raceCourse: "Del Mar",
        surface: "turf",
        distance: "1 mile",
        welfareStatus: "good",
        alerts: [],
        riskCategory: 1,
        analysisType: "StrideSAFE",
        strideAnalysis: {
          dvStraight: 0.90,
          dvTurn: 0.87,
          symmetryIndex: 0.91,
          strideLength: 4.6,
          strideFrequency: 2.1
        },
        condylarFx: false,
        sesamoidFx: false,
        leftFront: false,
        rightFront: false,
        bothFront: false,
        hindLimb: false
      }
    ],
    postRaceExamination: {
      status: "completed",
      vetName: "Dr. Johnson",
      findings: "Normal post-race examination",
      cleared: true,
      followUpRequired: false
    },
    history: [
      { status: 'good', date: '2024-01-12' },
      { status: 'good', date: '2024-01-15' }
    ]
  },
  {
    id: 14,
    name: "Alpine Star",
    raceNumber: 2,
    postPosition: 6,
    jockey: "C. Garcia",
    trainer: "M. Brown",
    owner: "Mountain View Ranch",
    birthDate: "2020-09-05",
    sex: "Mare",
    color: "Gray",
    weight: 123,
    odds: "10-1",
    raceTime: "1:30 PM",
    vet: "Dr. Johnson",
    finishPosition: 6,
    finishTime: "1:38.89",
    raceStatus: "finished",
    splitTimes: {
      quarter1: "24.67",
      half: "49.56",
      threeQuarter: "1:14.12",
      final: "1:38.89"
    },
    speed: {
      averageSpeed: 36.3,
      topSpeed: 41.7
    },
    welfareAlert: true,
    welfareStatus: 'red',
    riskCategory: 'Cat 4',
    markers: ['C-Fx', 'RF'],
    welfareReports: [
      {
        id: 14,
        date: "2024-01-15",
        raceCourse: "Del Mar",
        surface: "turf",
        distance: "1 mile",
        welfareStatus: "alert",
        alerts: ["C-Fx", "RF"],
        riskCategory: 4,
        analysisType: "StrideSAFE",
        strideAnalysis: {
          dvStraight: 0.74,
          dvTurn: 0.71,
          symmetryIndex: 0.68,
          strideLength: 4.0,
          strideFrequency: 1.8
        },
        condylarFx: true,
        sesamoidFx: false,
        leftFront: false,
        rightFront: true,
        bothFront: false,
        hindLimb: false
      }
    ],
    postRaceExamination: {
      status: "completed",
      vetName: "Dr. Johnson",
      findings: "Right front lameness, condylar fracture suspected",
      cleared: false,
      followUpRequired: true
    },
    history: [
      { status: 'good', date: '2024-01-12' },
      { status: 'alert', date: '2024-01-15' }
    ]
  },
  {
    id: 15,
    name: "Sunset Glory",
    raceNumber: 2,
    postPosition: 7,
    jockey: "B. Martinez",
    trainer: "J. Taylor",
    owner: "Sunset Farms",
    birthDate: "2020-10-12",
    sex: "Gelding",
    color: "Chestnut",
    weight: 126,
    odds: "12-1",
    raceTime: "1:30 PM",
    vet: "Dr. Smith",
    finishPosition: 7,
    finishTime: "1:39.34",
    raceStatus: "finished",
    splitTimes: {
      quarter1: "24.89",
      half: "49.89",
      threeQuarter: "1:14.67",
      final: "1:39.34"
    },
    speed: {
      averageSpeed: 35.9,
      topSpeed: 41.2
    },
    welfareAlert: false,
    welfareStatus: 'amber',
    riskCategory: 'Cat 2',
    markers: ['HL'],
    welfareReports: [
      {
        id: 15,
        date: "2024-01-15",
        raceCourse: "Del Mar",
        surface: "turf",
        distance: "1 mile",
        welfareStatus: "warning",
        alerts: ["HL"],
        riskCategory: 2,
        analysisType: "StrideSAFE",
        strideAnalysis: {
          dvStraight: 0.86,
          dvTurn: 0.83,
          symmetryIndex: 0.80,
          strideLength: 4.3,
          strideFrequency: 2.0
        },
        condylarFx: false,
        sesamoidFx: false,
        leftFront: false,
        rightFront: false,
        bothFront: false,
        hindLimb: true
      }
    ],
    postRaceExamination: {
      status: "completed",
      vetName: "Dr. Smith",
      findings: "Mild hind limb irregularity",
      cleared: true,
      followUpRequired: true
    },
    history: [
      { status: 'good', date: '2024-01-12' },
      { status: 'warning', date: '2024-01-15' }
    ]
  },
  {
    id: 16,
    name: "Thunder Bay",
    raceNumber: 2,
    postPosition: 8,
    jockey: "F. Davis",
    trainer: "L. Anderson",
    owner: "Bay Area Stables",
    birthDate: "2020-11-25",
    sex: "Colt",
    color: "Bay",
    weight: 128,
    odds: "15-1",
    raceTime: "1:30 PM",
    vet: "Dr. Brown",
    finishPosition: 8,
    finishTime: "1:40.12",
    raceStatus: "finished",
    splitTimes: {
      quarter1: "25.12",
      half: "50.23",
      threeQuarter: "1:15.34",
      final: "1:40.12"
    },
    speed: {
      averageSpeed: 35.4,
      topSpeed: 40.6
    },
    welfareAlert: false,
    welfareStatus: 'green',
    riskCategory: 'Cat 1',
    markers: [],
    welfareReports: [
      {
        id: 16,
        date: "2024-01-15",
        raceCourse: "Del Mar",
        surface: "turf",
        distance: "1 mile",
        welfareStatus: "good",
        alerts: [],
        riskCategory: 1,
        analysisType: "StrideSAFE",
        strideAnalysis: {
          dvStraight: 0.89,
          dvTurn: 0.86,
          symmetryIndex: 0.90,
          strideLength: 4.5,
          strideFrequency: 2.1
        },
        condylarFx: false,
        sesamoidFx: false,
        leftFront: false,
        rightFront: false,
        bothFront: false,
        hindLimb: false
      }
    ],
    postRaceExamination: {
      status: "completed",
      vetName: "Dr. Brown",
      findings: "Normal post-race examination",
      cleared: true,
      followUpRequired: false
    },
    history: [
      { status: 'good', date: '2024-01-12' },
      { status: 'good', date: '2024-01-15' }
    ]
  },
  {
    id: 17,
    name: "Golden Eagle",
    raceNumber: 2,
    postPosition: 9,
    jockey: "H. Wilson",
    trainer: "R. Garcia",
    owner: "Eagle Point Farm",
    birthDate: "2020-12-08",
    sex: "Filly",
    color: "Palomino",
    weight: 121,
    odds: "18-1",
    raceTime: "1:30 PM",
    vet: "Dr. Martinez",
    finishPosition: 9,
    finishTime: "1:40.78",
    raceStatus: "finished",
    splitTimes: {
      quarter1: "25.34",
      half: "50.67",
      threeQuarter: "1:15.89",
      final: "1:40.78"
    },
    speed: {
      averageSpeed: 35.0,
      topSpeed: 40.1
    },
    welfareAlert: true,
    welfareStatus: 'red',
    riskCategory: 'Cat 5',
    markers: ['S-Fx', 'LF'],
    welfareReports: [
      {
        id: 17,
        date: "2024-01-15",
        raceCourse: "Del Mar",
        surface: "turf",
        distance: "1 mile",
        welfareStatus: "alert",
        alerts: ["S-Fx", "LF"],
        riskCategory: 5,
        analysisType: "StrideSAFE",
        strideAnalysis: {
          dvStraight: 0.66,
          dvTurn: 0.62,
          symmetryIndex: 0.60,
          strideLength: 3.7,
          strideFrequency: 1.6
        },
        condylarFx: false,
        sesamoidFx: true,
        leftFront: true,
        rightFront: false,
        bothFront: false,
        hindLimb: false
      }
    ],
    postRaceExamination: {
      status: "completed",
      vetName: "Dr. Martinez",
      findings: "Severe left front lameness, sesamoid fracture confirmed",
      cleared: false,
      followUpRequired: true
    },
    history: [
      { status: 'good', date: '2024-01-12' },
      { status: 'alert', date: '2024-01-15' }
    ]
  },
  {
    id: 18,
    name: "Arctic Wind",
    raceNumber: 2,
    postPosition: 10,
    jockey: "N. Thompson",
    trainer: "K. Martinez",
    owner: "Arctic Racing Ltd",
    birthDate: "2021-01-15",
    sex: "Gelding",
    color: "White",
    weight: 124,
    odds: "25-1",
    raceTime: "1:30 PM",
    vet: "Dr. Martinez",
    finishPosition: 10,
    finishTime: "1:41.45",
    raceStatus: "finished",
    splitTimes: {
      quarter1: "25.67",
      half: "51.12",
      threeQuarter: "1:16.45",
      final: "1:41.45"
    },
    speed: {
      averageSpeed: 34.5,
      topSpeed: 39.3
    },
    welfareAlert: false,
    welfareStatus: 'amber',
    riskCategory: 'Cat 3',
    markers: ['BF'],
    welfareReports: [
      {
        id: 18,
        date: "2024-01-15",
        raceCourse: "Del Mar",
        surface: "turf",
        distance: "1 mile",
        welfareStatus: "warning",
        alerts: ["BF"],
        riskCategory: 3,
        analysisType: "StrideSAFE",
        strideAnalysis: {
          dvStraight: 0.81,
          dvTurn: 0.77,
          symmetryIndex: 0.74,
          strideLength: 4.1,
          strideFrequency: 1.9
        },
        condylarFx: false,
        sesamoidFx: false,
        leftFront: false,
        rightFront: false,
        bothFront: true,
        hindLimb: false
      }
    ],
    postRaceExamination: {
      status: "completed",
      vetName: "Dr. Martinez",
      findings: "Bilateral front limb minor irregularities",
      cleared: true,
      followUpRequired: true
    },
    history: [
      { status: 'good', date: '2024-01-12' },
      { status: 'warning', date: '2024-01-15' }
    ]
  }
];
