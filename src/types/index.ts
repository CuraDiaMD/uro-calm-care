export type BeverageType = 'water' | 'caffeine' | 'soda' | 'juice' | 'alcohol' | 'other';

export type VolumePreset = 'small' | 'medium' | 'large' | 'custom';

export type LeakageSize = 'small' | 'medium' | 'large';

export type TabType = 'home' | 'calendar' | 'record' | 'forms' | 'chat';

export type RecordTab = 'intake' | 'voiding' | 'leakage';

export interface IntakeEntry {
  id: string;
  type: BeverageType;
  volume: number;
  timestamp: Date;
  memo?: string;
}

export interface VoidingEntry {
  id: string;
  volume: number;
  urgeScale: 1 | 2 | 3 | 4 | 5;
  isSleep: boolean;
  hasLeak: boolean;
  timestamp: Date;
  memo?: string;
}

export interface LeakageEntry {
  id: string;
  size: LeakageSize;
  timestamp: Date;
  memo?: string;
}

export interface DailySummary {
  date: Date;
  totalIntake: number;
  totalVoided: number;
  totalLeakage: number;
  daytimeFrequency: number;
  nighttimeFrequency: number;
  leakageCount: number;
}

export interface IPSSAnswer {
  questionIndex: number;
  score: number;
}

export interface IPSSResult {
  answers: IPSSAnswer[];
  totalScore: number;
  qualityOfLifeScore: number;
  completedAt: Date;
}

export interface OABqAnswer {
  questionIndex: number;
  score: number;
}

export interface OABqResult {
  answers: OABqAnswer[];
  symptomScore: number;
  qolScore: number;
  treatmentInterest: boolean;
  completedAt: Date;
}

export interface ICIQOABAnswer {
  questionIndex: number;
  score: number;
  botherScore?: number;
}

export interface ICIQOABResult {
  answers: ICIQOABAnswer[];
  totalScore: number;
  completedAt: Date;
}

export interface ICIQUIAnswer {
  questionIndex: number;
  score: number | string[];
}

export interface ICIQUIResult {
  answers: ICIQUIAnswer[];
  totalScore: number;
  leakageSituations: string[];
  completedAt: Date;
}

export type QuestionnaireType = 'ipss' | 'oabq' | 'iciq-oab' | 'iciq-ui';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const VOLUME_PRESETS = {
  small: 240,
  medium: 360,
  large: 480,
} as const;

export const BEVERAGE_INFO: Record<BeverageType, { label: string; icon: string }> = {
  water: { label: 'Water', icon: 'droplet' },
  caffeine: { label: 'Caffeine', icon: 'coffee' },
  soda: { label: 'Soda', icon: 'cup-soda' },
  juice: { label: 'Juice', icon: 'citrus' },
  alcohol: { label: 'Alcohol', icon: 'wine' },
  other: { label: 'Other', icon: 'glass-water' },
};

export const IPSS_QUESTIONS = [
  {
    question: "How often have you had the sensation of not emptying your bladder?",
    category: "Incomplete Emptying",
  },
  {
    question: "How often have you had to urinate less than every two hours?",
    category: "Frequency",
  },
  {
    question: "How often have you found you stopped and started again several times when you urinated?",
    category: "Intermittency",
  },
  {
    question: "How often have you found it difficult to postpone urination?",
    category: "Urgency",
  },
  {
    question: "How often have you had a weak urinary stream?",
    category: "Weak Stream",
  },
  {
    question: "How often have you had to strain to start urination?",
    category: "Straining",
  },
  {
    question: "How many times did you typically get up at night to urinate?",
    category: "Nocturia",
  },
  {
    question: "If you were to spend the rest of your life with your urinary condition just the way it is now, how would you feel about that?",
    category: "Quality of Life",
  },
];

export const IPSS_OPTIONS_STANDARD = [
  { score: 0, label: "Not at All" },
  { score: 1, label: "Less than 1 in 5 Times" },
  { score: 2, label: "Less than Half the Time" },
  { score: 3, label: "About Half the Time" },
  { score: 4, label: "More than Half the Time" },
  { score: 5, label: "Almost Always" },
];

export const IPSS_OPTIONS_NOCTURIA = [
  { score: 0, label: "None" },
  { score: 1, label: "1 Time" },
  { score: 2, label: "2 Times" },
  { score: 3, label: "3 Times" },
  { score: 4, label: "4 Times" },
  { score: 5, label: "5 Times" },
];

export const IPSS_OPTIONS_QOL = [
  { score: 0, label: "Delighted" },
  { score: 1, label: "Pleased" },
  { score: 2, label: "Mostly Satisfied" },
  { score: 3, label: "Mixed" },
  { score: 4, label: "Mostly Dissatisfied" },
  { score: 5, label: "Unhappy" },
  { score: 6, label: "Terrible" },
];

// OAB-q Questionnaire
export const OABQ_QUESTIONS = [
  { question: "How bothered have you been by uncomfortable urination?", category: "Symptom" },
  { question: "How bothered have you been by a sudden urge to urinate with little or no warning?", category: "Symptom" },
  { question: "How bothered have you been by accidental loss of small amounts of urine?", category: "Symptom" },
  { question: "How bothered have you been by nighttime urination?", category: "Symptom" },
  { question: "How bothered have you been by urine loss associated with a strong desire to urinate?", category: "Symptom" },
  { question: "If you spent the rest of your life with your urinary condition the way it is now, how would you feel about that?", category: "Quality of Life" },
  { question: "Would you be interested in treatment options?", category: "Treatment Interest" },
];

export const OABQ_OPTIONS_SYMPTOM = [
  { score: 1, label: "Not at all" },
  { score: 2, label: "A little bit" },
  { score: 3, label: "Somewhat" },
  { score: 4, label: "Quite a bit" },
  { score: 5, label: "A great deal" },
  { score: 6, label: "A very great deal" },
];

export const OABQ_OPTIONS_TREATMENT = [
  { score: 1, label: "Yes" },
  { score: 0, label: "No" },
];

// ICIQ-OAB Questionnaire
export const ICIQ_OAB_QUESTIONS = [
  { question: "How often do you pass urine during the day?", category: "Daytime Frequency", hasBother: true },
  { question: "During the night, how many times do you have to get up to urinate, on average?", category: "Nocturia", hasBother: true },
  { question: "Do you have to rush to the toilet to urinate?", category: "Urgency", hasBother: true },
  { question: "Does urine leak before you can get to the toilet?", category: "Leakage", hasBother: true },
];

export const ICIQ_OAB_OPTIONS_FREQUENCY = [
  { score: 0, label: "1 to 6 times" },
  { score: 1, label: "7 to 8 times" },
  { score: 2, label: "9 to 10 times" },
  { score: 3, label: "11 to 12 times" },
  { score: 4, label: "13 or more times" },
];

export const ICIQ_OAB_OPTIONS_NOCTURIA = [
  { score: 0, label: "None" },
  { score: 1, label: "One" },
  { score: 2, label: "Two" },
  { score: 3, label: "Three" },
  { score: 4, label: "Four or more" },
];

export const ICIQ_OAB_OPTIONS_URGENCY = [
  { score: 0, label: "Never" },
  { score: 1, label: "Occasionally" },
  { score: 2, label: "Sometimes" },
  { score: 3, label: "Most of the time" },
  { score: 4, label: "All of the time" },
];

// ICIQ-UI Short Form Questionnaire
export const ICIQ_UI_QUESTIONS = [
  { question: "How often do you leak urine?", category: "Frequency", type: "options" as const },
  { question: "How much urine do you usually leak (whether you wear protection or not)?", category: "Amount", type: "options" as const },
  { question: "Overall, how much does leaking urine interfere with your everyday life?", category: "Interference", type: "slider" as const },
  { question: "When does urine leak? (Please tick all that apply to you)", category: "Situations", type: "multiselect" as const },
];

export const ICIQ_UI_OPTIONS_FREQUENCY = [
  { score: 0, label: "Never" },
  { score: 1, label: "About once a week or less often" },
  { score: 2, label: "Two or three times a week" },
  { score: 3, label: "About once a day" },
  { score: 4, label: "Several times a day" },
  { score: 5, label: "All the time" },
];

export const ICIQ_UI_OPTIONS_AMOUNT = [
  { score: 0, label: "None" },
  { score: 2, label: "A small amount" },
  { score: 4, label: "A moderate amount" },
  { score: 6, label: "A large amount" },
];

export const ICIQ_UI_LEAKAGE_SITUATIONS = [
  "Never – urine does not leak",
  "Leaks before you can get to the toilet",
  "Leaks when you cough or sneeze",
  "Leaks when you are asleep",
  "Leaks when you are physically active/exercising",
  "Leaks when you have finished urinating and are dressed",
  "Leaks for no obvious reason",
  "Leaks all the time",
];
