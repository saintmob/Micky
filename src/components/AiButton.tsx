import { Sparkles } from 'lucide-react';
import { useDJStore } from '../store/djStore';
import { audioManager } from '../lib/audioManager';

export function AiButton() {
  const { isAiDropActive, triggerAiDrop, isPlaying, setTrackLoop, setFilterFreq } = useDJStore();

  const handleAiDrop = () => {
    if (!isPlaying) return;
    
    triggerAiDrop();
    
    // Simulate an AI generated "build-up to drop"
    // 1. Activate drum loop 1, filter sweep down
    setTrackLoop('t1', 1);
    audioManager.setTrackActive('t1', 1);
    
    setFilterFreq(0.1);
    audioManager.setFilter(0.1, 'lowpass');
    
    setTimeout(() => {
      // 2. Activate all tracks
      setTrackLoop('t2', 1);
      audioManager.setTrackActive('t2', 1);
      
      setTrackLoop('t3', 1);
      audioManager.setTrackActive('t3', 1);
      
      setTrackLoop('t4', 0);
      audioManager.setTrackActive('t4', 0);
      
      // 3. Filter open
      setFilterFreq(1.0);
      audioManager.setFilter(1.0, 'lowpass');
      
      // Reset AI mode in store after sequence
      useDJStore.getState().setIsAiDropActive(false);
    }, 2000); // Wait 2 seconds for drop
  };

  return (
    <button 
      onClick={handleAiDrop}
      disabled={!isPlaying || isAiDropActive}
      className={`flex-grow border-2 rounded-xl flex flex-col items-center justify-center p-6 transition-all group relative overflow-hidden flex-1 min-h-[140px]
        ${!isPlaying ? 'bg-[#1a1a1a] border-[#333] cursor-not-allowed opacity-50' : ''}
        ${isPlaying && !isAiDropActive ? 'bg-[#151619] border-[#ff0055] hover:bg-[#200a12]' : ''}
        ${isAiDropActive ? 'bg-[#200a12] border-[#00f3ff] shadow-[0_0_20px_rgba(0,243,255,0.2)]' : ''}
      `}
    >
      <div className="absolute inset-0 bg-[#ff0055] opacity-5"></div>
      <div className={`font-mono text-[10px] mb-2 tracking-[0.3em] font-bold z-10 ${
        isAiDropActive ? 'text-[#00f3ff]' : 'text-[#ff0055]'
      }`}>
        NEURAL ENGINE
      </div>
      <div className={`text-3xl font-black italic z-10 transition-transform ${
        isPlaying && !isAiDropActive ? 'text-white group-hover:scale-105' : 'text-[#8e9299]'
      } ${isAiDropActive ? 'text-white animate-pulse' : ''}`}>
        {isAiDropActive ? 'DROPPING...' : 'THE DROP'}
      </div>
      <div className={`mt-4 w-12 h-1 z-10 ${
        isPlaying && !isAiDropActive ? 'bg-[#ff0055] shadow-[0_0_10px_#ff0055]' : 'bg-[#333]'
      } ${isAiDropActive ? 'bg-[#00f3ff] shadow-[0_0_10px_#00f3ff]' : ''}`}></div>
    </button>
  );
}
