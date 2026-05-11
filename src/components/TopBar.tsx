import React from 'react';
import { useDJStore } from '../store/djStore';
import { audioManager } from '../lib/audioManager';

export function TopBar() {
  const { isPlaying, togglePlay, bpm, setBpm } = useDJStore();

  const handlePlayToggle = async () => {
    if (!isPlaying) {
      await audioManager.initEngine();
      audioManager.start();
    } else {
      audioManager.stop();
    }
    togglePlay();
  };

  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) {
      setBpm(val);
      audioManager.setBpm(val);
    }
  };

  return (
    <header className="flex flex-wrap items-center justify-between mx-4 md:mx-6 mt-4 pb-4 border-b border-[#222] shrink-0 gap-4">
      <div className="flex items-center gap-4">
        <div className="bg-[#00f3ff] w-8 h-8 rounded-sm flex items-center justify-center shrink-0">
          <div className="w-4 h-4 bg-black rotate-45"></div>
        </div>
        <h1 className="text-xl font-bold tracking-tighter uppercase text-[#e0e0e0]">NEURAL-BEAT <span className="text-[#00f3ff] font-mono text-sm opacity-60 ml-2 hidden sm:inline">V1.0.4</span></h1>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-[#8e9299] uppercase font-mono tracking-widest leading-tight">Global Sync</span>
          <div className="flex items-center gap-1">
            <input 
              type="number" 
              value={bpm}
              onChange={handleBpmChange}
              className="w-16 bg-transparent text-[#00f3ff] font-mono text-2xl font-bold leading-none outline-none text-right"
              min="60"
              max="200"
            />
            <span className="text-xs text-[#00f3ff] opacity-50 font-mono mt-1">BPM</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handlePlayToggle}
            className="w-12 h-10 bg-[#151619] border border-[#333] flex items-center justify-center hover:bg-[#222] transition-colors"
          >
            {isPlaying ? (
              <div className="w-4 h-4 bg-[#ff0055]"></div>
            ) : (
              <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-[#00f3ff] border-b-[8px] border-b-transparent ml-1"></div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
