import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  TabType, 
  RecordTab,
  IntakeStatus,
  IntakeStep,
  IntakeEntry, 
  VoidingEntry, 
  LeakageEntry, 
  IPSSResult,
  OABqResult,
  ICIQUIResult,
  PatientProfile,
  Consent,
  DailySymptomCheck,
} from '@/types';

export const EMPTY_PROFILE: PatientProfile = {
  firstName: '',
  lastName: '',
  dateOfBirth: null,
  sexAtBirth: null,
  ramqNumber: '',
  ramqExpiry: '',
  cellPhone: '',
  email: '',
  familyPhysician: '',
  chiefComplaints: [],
  pastMedicalHistory: {
    endocrine: [],
    cardiovascular: [],
    neurological: [],
    kidneyUrologic: [],
    cancer: [],
    cancerOther: '',
    other: [],
  },
  pastSurgicalHistory: {
    urologic: [],
    general: [],
  },
  familyHistory: {
    conditions: [],
    other: '',
  },
  medications: {
    diabetesMeds: [],
    diabetesMedsOther: '',
    bloodThinners: [],
    bpMeds: '',
    diuretics: false,
    urologicMeds: [],
    otherPrescriptions: '',
    supplements: [],
    supplementsOther: '',
  },
  allergies: {
    noKnownAllergies: false,
    entries: [],
  },
};

interface AppState {
  // Language
  language: 'en' | 'fr';
  setLanguage: (lang: 'en' | 'fr') => void;
  
  // Navigation
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  
  // Intake flow
  intakeStatus: IntakeStatus;
  currentIntakeStep: IntakeStep;
  setIntakeStatus: (status: IntakeStatus) => void;
  setCurrentIntakeStep: (step: IntakeStep) => void;
  
  // Patient data
  patientProfile: PatientProfile | null;
  consents: Consent | null;
  setPatientProfile: (profile: PatientProfile) => void;
  setConsents: (consents: Consent) => void;
  
  // Record modal
  isRecordOpen: boolean;
  recordTab: RecordTab;
  setRecordOpen: (open: boolean) => void;
  setRecordTab: (tab: RecordTab) => void;
  openRecordWithTab: (tab: RecordTab) => void;
  
  // Diary
  diaryStartDate: Date | null;
  selectedDiaryDate: Date;
  sleepTime: string | null;
  wakeTime: string | null;
  dailySymptomChecks: DailySymptomCheck[];
  setDiaryStartDate: (date: Date) => void;
  setSelectedDiaryDate: (date: Date) => void;
  setSleepWakeTimes: (sleep: string, wake: string) => void;
  addDailySymptomCheck: (check: DailySymptomCheck) => void;
  
  // Data
  intakeEntries: IntakeEntry[];
  voidingEntries: VoidingEntry[];
  leakageEntries: LeakageEntry[];
  ipssResults: IPSSResult[];
  oabqResults: OABqResult[];
  iciqUiResults: ICIQUIResult[];
  
  // Actions
  addIntakeEntry: (entry: Omit<IntakeEntry, 'id' | 'timestamp'>) => void;
  addVoidingEntry: (entry: Omit<VoidingEntry, 'id' | 'timestamp'>) => void;
  addLeakageEntry: (entry: Omit<LeakageEntry, 'id' | 'timestamp'>) => void;
  addIPSSResult: (result: Omit<IPSSResult, 'completedAt'>) => void;
  addOABqResult: (result: Omit<OABqResult, 'completedAt'>) => void;
  addICIQUIResult: (result: Omit<ICIQUIResult, 'completedAt'>) => void;
  
  // Computed
  getSummaryForDate: (date: Date) => {
    totalIntake: number;
    totalVoided: number;
    daytimeFrequency: number;
    nighttimeFrequency: number;
    leakageCount: number;
    totalLeakage: number;
  };
  getTodaySummary: () => {
    totalIntake: number;
    totalVoided: number;
    daytimeFrequency: number;
    nighttimeFrequency: number;
    leakageCount: number;
    totalLeakage: number;
  };
  
  getDiaryDaysCompleted: () => number;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const isToday = (date: Date) => {
  const today = new Date();
  const d = new Date(date);
  return d.toDateString() === today.toDateString();
};

const isDaytime = (date: Date) => {
  const hours = new Date(date).getHours();
  return hours >= 6 && hours < 22;
};

const getLeakageVolume = (size: 'drops' | 'small' | 'large') => {
  switch (size) {
    case 'drops': return 5;
    case 'small': return 15;
    case 'large': return 60;
  }
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: 'fr' as 'en' | 'fr',
      setLanguage: (lang: 'en' | 'fr') => set({ language: lang }),
      
      activeTab: 'diary',
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      // Intake flow
      intakeStatus: 'not-started',
      currentIntakeStep: 0 as IntakeStep,
      setIntakeStatus: (status) => set({ intakeStatus: status }),
      setCurrentIntakeStep: (step) => set({ currentIntakeStep: step }),
      
      // Patient data
      patientProfile: null,
      consents: null,
      setPatientProfile: (profile) => set({ patientProfile: profile }),
      setConsents: (consents) => set({ consents }),
      
      // Record modal
      isRecordOpen: false,
      recordTab: 'intake',
      setRecordOpen: (open) => set({ isRecordOpen: open }),
      setRecordTab: (tab) => set({ recordTab: tab }),
      openRecordWithTab: (tab) => set({ recordTab: tab, isRecordOpen: true }),
      
      // Diary
      diaryStartDate: null,
      selectedDiaryDate: new Date(),
      sleepTime: '22:00',
      wakeTime: '06:00',
      dailySymptomChecks: [],
      setDiaryStartDate: (date) => set({ diaryStartDate: date }),
      setSelectedDiaryDate: (date) => set({ selectedDiaryDate: date }),
      setSleepWakeTimes: (sleep, wake) => set({ sleepTime: sleep, wakeTime: wake }),
      addDailySymptomCheck: (check) => set((state) => ({
        dailySymptomChecks: [...state.dailySymptomChecks, check]
      })),
      
      // Data
      intakeEntries: [],
      voidingEntries: [],
      leakageEntries: [],
      ipssResults: [],
      oabqResults: [],
      iciqUiResults: [],
      
      addIntakeEntry: (entry) => set((state) => ({
        intakeEntries: [
          ...state.intakeEntries,
          { ...entry, id: generateId(), timestamp: new Date() }
        ]
      })),
      
      addVoidingEntry: (entry) => set((state) => ({
        voidingEntries: [
          ...state.voidingEntries,
          { ...entry, id: generateId(), timestamp: new Date() }
        ]
      })),
      
      addLeakageEntry: (entry) => set((state) => ({
        leakageEntries: [
          ...state.leakageEntries,
          { ...entry, id: generateId(), timestamp: new Date() }
        ]
      })),
      
      addIPSSResult: (result) => set((state) => ({
        ipssResults: [
          ...state.ipssResults,
          { ...result, completedAt: new Date() }
        ]
      })),
      
      addOABqResult: (result) => set((state) => ({
        oabqResults: [
          ...state.oabqResults,
          { ...result, completedAt: new Date() }
        ]
      })),
      
      addICIQUIResult: (result) => set((state) => ({
        iciqUiResults: [
          ...state.iciqUiResults,
          { ...result, completedAt: new Date() }
        ]
      })),
      
      getSummaryForDate: (date) => {
        const state = get();
        const targetDate = new Date(date);
        const dateIntakes = state.intakeEntries.filter(e => isSameDay(new Date(e.timestamp), targetDate));
        const dateVoidings = state.voidingEntries.filter(e => isSameDay(new Date(e.timestamp), targetDate));
        const dateLeakages = state.leakageEntries.filter(e => isSameDay(new Date(e.timestamp), targetDate));
        
        return {
          totalIntake: dateIntakes.reduce((sum, e) => sum + e.volume, 0),
          totalVoided: dateVoidings.reduce((sum, e) => sum + e.volume, 0),
          daytimeFrequency: dateVoidings.filter(e => isDaytime(e.timestamp)).length,
          nighttimeFrequency: dateVoidings.filter(e => !isDaytime(e.timestamp)).length,
          leakageCount: dateLeakages.length + dateVoidings.filter(e => e.hasLeak).length,
          totalLeakage: dateLeakages.reduce((sum, e) => sum + getLeakageVolume(e.size), 0),
        };
      },
      
      getTodaySummary: () => get().getSummaryForDate(new Date()),
      
      getDiaryDaysCompleted: () => {
        const state = get();
        if (!state.diaryStartDate) return 0;
        const start = new Date(state.diaryStartDate);
        const now = new Date();
        const diffMs = now.getTime() - start.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        return Math.min(diffDays, 3);
      },
    }),
    {
      name: 'curadia-storage',
      partialize: (state) => ({
        language: state.language,
        intakeStatus: state.intakeStatus,
        currentIntakeStep: state.currentIntakeStep,
        patientProfile: state.patientProfile,
        consents: state.consents,
        intakeEntries: state.intakeEntries,
        voidingEntries: state.voidingEntries,
        leakageEntries: state.leakageEntries,
        ipssResults: state.ipssResults,
        oabqResults: state.oabqResults,
        iciqUiResults: state.iciqUiResults,
        diaryStartDate: state.diaryStartDate,
        sleepTime: state.sleepTime,
        wakeTime: state.wakeTime,
        dailySymptomChecks: state.dailySymptomChecks,
      }),
    }
  )
);
