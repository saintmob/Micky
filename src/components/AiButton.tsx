import { Sparkles } from 'lucide-react';
import { useDJStore } from '../store/djStore';
import { audioManager } from '../lib/audioManager';
import { useTranslation } from '../lib/i18n';

export function AiButton() {
  const { isAiDropActive, triggerAiDrop, isPlaying, setTrackLoop, setFilterFreq } = useDJStore();
  const t = useTranslation();

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
      className={`flex-grow border rounded-lg flex flex-col items-center justify-center p-6 transition-all group relative overflow-hidden flex-1 min-h-[140px]
        ${!isPlaying ? 'bg-slate-100 dark:bg-[#12161b] border-slate-300 dark:border-white/10 cursor-not-allowed opacity-55' : ''}
        ${isPlaying && !isAiDropActive ? 'bg-white dark:bg-[#15191d] border-[#ff2f6d] hover:bg-[#fff6f9] dark:hover:bg-[#240b15] shadow-[0_18px_44px_rgba(255,47,109,0.13)]' : ''}
        ${isAiDropActive ? 'bg-red-50 dark:bg-[#240b15] border-[#00f3ff] shadow-[0_0_26px_rgba(0,243,255,0.22)]' : ''}
      `}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,47,109,0.18),transparent_55%)]"></div>
      <Sparkles className={`z-10 mb-3 h-5 w-5 ${
        isAiDropActive ? 'text-[#00f3ff]' : 'text-[#ff2f6d]'
      }`} />
      <div className={`font-mono text-[10px] mb-2 tracking-[0.24em] font-bold z-10 ${
        isAiDropActive ? 'text-[#00f3ff]' : 'text-[#ff0055]'
      }`}>
        {t.neuralEngine}
      </div>
      <div className={`text-3xl font-black italic z-10 transition-transform ${
        isPlaying && !isAiDropActive ? 'text-slate-800 dark:text-white group-hover:scale-105' : 'text-slate-400 dark:text-[#8e9299]'
      } ${isAiDropActive ? 'text-slate-800 dark:text-white animate-pulse' : ''}`}>
        {isAiDropActive ? t.dropping : t.theDrop}
      </div>
      <div className={`mt-4 w-12 h-1 z-10 ${
        isPlaying && !isAiDropActive ? 'bg-[#ff0055] shadow-[0_0_10px_#ff0055]' : 'bg-slate-300 dark:bg-[#333]'
      } ${isAiDropActive ? 'bg-[#00f3ff] shadow-[0_0_10px_#00f3ff]' : ''}`}></div>
    </button>
  );
}
