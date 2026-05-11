import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TrackState {
  id: string;
  name: string;
  type: 'Drum' | 'Bass' | 'Synth' | 'FX';
  activeLoopIndex: number | null; // null means track is off
  volume: number;
}

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'zh' | 'system';

interface DJState {
  isPlaying: boolean;
  bpm: number;
  filterFreq: number; // 0 to 1, mapped to 20-20000 exponentially
  filterType: 'lowpass' | 'highpass';
  isAiDropActive: boolean;
  tracks: TrackState[];
  analyzerData: Uint8Array | null;
  activeTab: 'visualizer' | 'sequencer';
  seqMatrix: boolean[][];
  seqCurrentStep: number;
  isSeqActive: boolean;
  theme: Theme;
  language: Language;
  togglePlay: () => void;
  setBpm: (bpm: number) => void;
  setFilterFreq: (freq: number) => void;
  setFilterType: (type: 'lowpass' | 'highpass') => void;
  setTrackLoop: (trackId: string, loopIndex: number | null) => void;
  triggerAiDrop: () => void;
  setAnalyzerData: (data: Uint8Array) => void;
  setIsAiDropActive: (isActive: boolean) => void;
  setActiveTab: (tab: 'visualizer' | 'sequencer') => void;
  toggleSeqStep: (row: number, col: number) => void;
  setSeqCurrentStep: (step: number) => void;
  toggleSeqActive: () => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
}

export const useDJStore = create<DJState>()(
  persist(
    (set, get) => ({
      isPlaying: false,
      bpm: 128,
      filterFreq: 1.0, // 1.0 = fully open (Lowpass)
      filterType: 'lowpass',
      isAiDropActive: false,
      analyzerData: null,
      activeTab: 'visualizer',
      seqMatrix: [
        [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false], // Kick
        [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false], // Clap
        [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, true], // Hat
        [true, false, false, true, false, false, true, false, false, true, false, false, false, false, false, false], // Bass
      ],
      seqCurrentStep: 0,
      isSeqActive: false,
      theme: 'system',
      language: 'system',
      tracks: [
        { id: 't1', name: 'Drums', type: 'Drum', activeLoopIndex: null, volume: 1 },
        { id: 't2', name: 'Bass', type: 'Bass', activeLoopIndex: null, volume: 1 },
        { id: 't3', name: 'Synth', type: 'Synth', activeLoopIndex: null, volume: 1 },
        { id: 't4', name: 'FX', type: 'FX', activeLoopIndex: null, volume: 1 },
      ],

      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      
      setBpm: (bpm) => set({ bpm }),
      
      setFilterFreq: (freq) => set({ filterFreq: freq }),
      
      setFilterType: (type) => {
        const newFreq = type === 'lowpass' ? 1.0 : 0.0;
        set({ filterType: type, filterFreq: newFreq });
      },

      setTrackLoop: (trackId, loopIndex) => set((state) => ({
        tracks: state.tracks.map(t => 
          t.id === trackId ? { ...t, activeLoopIndex: loopIndex } : t
        )
      })),

      triggerAiDrop: () => {
        set({ isAiDropActive: true });
        
        set((state) => ({
          tracks: state.tracks.map(t => ({
            ...t,
            activeLoopIndex: t.type === 'Drum' ? (t.activeLoopIndex === null ? 0 : t.activeLoopIndex) : t.activeLoopIndex
          }))
        }));
      },

      setAnalyzerData: (data) => set({ analyzerData: data }),
      setIsAiDropActive: (isActive) => set({ isAiDropActive: isActive }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      toggleSeqStep: (row, col) => set((state) => {
        const newMatrix = state.seqMatrix.map((r, i) => 
          i === row ? r.map((c, j) => j === col ? !c : c) : [...r]
        );
        return { seqMatrix: newMatrix };
      }),
      setSeqCurrentStep: (step) => set({ seqCurrentStep: step }),
      toggleSeqActive: () => set((state) => ({ isSeqActive: !state.isSeqActive })),
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'neural-beat-storage',
      partialize: (state) => ({ 
        bpm: state.bpm, 
        filterFreq: state.filterFreq, 
        filterType: state.filterType, 
        seqMatrix: state.seqMatrix,
        theme: state.theme,
        language: state.language
      }),
    }
  )
);
