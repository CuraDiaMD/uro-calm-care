import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockIntakeEntries, mockVoidingEntries, mockLeakageEntries } from '@/data/mockData';
import type { 
  TabType, 
  RecordTab,
  IntakeEntry, 
  VoidingEntry, 
  LeakageEntry, 
  IPSSResult,
  OABqResult,
  ICIQOABResult,
  ICIQUIResult,
  ChatMessage 
} from '@/types';

interface AppState {
  // Navigation
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  
  // Record modal
  isRecordOpen: boolean;
  recordTab: RecordTab;
  setRecordOpen: (open: boolean) => void;
  setRecordTab: (tab: RecordTab) => void;
  openRecordWithTab: (tab: RecordTab) => void;
  
  // Data
  intakeEntries: IntakeEntry[];
  voidingEntries: VoidingEntry[];
  leakageEntries: LeakageEntry[];
  ipssResults: IPSSResult[];
  oabqResults: OABqResult[];
  iciqOabResults: ICIQOABResult[];
  iciqUiResults: ICIQUIResult[];
  chatMessages: ChatMessage[];
  
  // Actions
  addIntakeEntry: (entry: Omit<IntakeEntry, 'id' | 'timestamp'>) => void;
  addVoidingEntry: (entry: Omit<VoidingEntry, 'id' | 'timestamp'>) => void;
  addLeakageEntry: (entry: Omit<LeakageEntry, 'id' | 'timestamp'>) => void;
  addIPSSResult: (result: Omit<IPSSResult, 'completedAt'>) => void;
  addOABqResult: (result: Omit<OABqResult, 'completedAt'>) => void;
  addICIQOABResult: (result: Omit<ICIQOABResult, 'completedAt'>) => void;
  addICIQUIResult: (result: Omit<ICIQUIResult, 'completedAt'>) => void;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  
  // Computed
  getTodaySummary: () => {
    totalIntake: number;
    totalVoided: number;
    daytimeFrequency: number;
    nighttimeFrequency: number;
    leakageCount: number;
    totalLeakage: number;
  };
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

const getLeakageVolume = (size: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small': return 10;
    case 'medium': return 30;
    case 'large': return 60;
  }
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      activeTab: 'home',
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      isRecordOpen: false,
      recordTab: 'intake',
      setRecordOpen: (open) => set({ isRecordOpen: open }),
      setRecordTab: (tab) => set({ recordTab: tab }),
      openRecordWithTab: (tab) => set({ recordTab: tab, isRecordOpen: true }),
      
      intakeEntries: mockIntakeEntries,
      voidingEntries: mockVoidingEntries,
      leakageEntries: mockLeakageEntries,
      ipssResults: [],
      oabqResults: [],
      iciqOabResults: [],
      iciqUiResults: [],
      chatMessages: [
        {
          id: 'welcome',
          role: 'assistant',
          content: "Hello, I'm Dia. I'm here to help you better understand your urological health journey. Feel free to ask me any questions about bladder health, the questionnaires, or how to use this app.",
          timestamp: new Date(),
        }
      ],
      
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
      
      addICIQOABResult: (result) => set((state) => ({
        iciqOabResults: [
          ...state.iciqOabResults,
          { ...result, completedAt: new Date() }
        ]
      })),
      
      addICIQUIResult: (result) => set((state) => ({
        iciqUiResults: [
          ...state.iciqUiResults,
          { ...result, completedAt: new Date() }
        ]
      })),
      
      addChatMessage: (message) => set((state) => ({
        chatMessages: [
          ...state.chatMessages,
          { ...message, id: generateId(), timestamp: new Date() }
        ]
      })),
      
      getTodaySummary: () => {
        const state = get();
        const todayIntakes = state.intakeEntries.filter(e => isToday(e.timestamp));
        const todayVoidings = state.voidingEntries.filter(e => isToday(e.timestamp));
        const todayLeakages = state.leakageEntries.filter(e => isToday(e.timestamp));
        
        return {
          totalIntake: todayIntakes.reduce((sum, e) => sum + e.volume, 0),
          totalVoided: todayVoidings.reduce((sum, e) => sum + e.volume, 0),
          daytimeFrequency: todayVoidings.filter(e => isDaytime(e.timestamp)).length,
          nighttimeFrequency: todayVoidings.filter(e => !isDaytime(e.timestamp)).length,
          leakageCount: todayLeakages.length + todayVoidings.filter(e => e.hasLeak).length,
          totalLeakage: todayLeakages.reduce((sum, e) => sum + getLeakageVolume(e.size), 0),
        };
      },
    }),
    {
      name: 'curadia-storage',
      partialize: (state) => ({
        intakeEntries: state.intakeEntries,
        voidingEntries: state.voidingEntries,
        leakageEntries: state.leakageEntries,
        ipssResults: state.ipssResults,
        oabqResults: state.oabqResults,
        iciqOabResults: state.iciqOabResults,
        iciqUiResults: state.iciqUiResults,
      }),
    }
  )
);
