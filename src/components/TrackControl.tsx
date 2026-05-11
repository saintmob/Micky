import React from 'react';
import { useDJStore, TrackState } from '../store/djStore';
import { audioManager } from '../lib/audioManager';
import { useTranslation } from '../lib/i18n';

export const TrackControl: React.FC<{ track: TrackState }> = ({ track }) => {
  const setTrackLoop = useDJStore(state => state.setTrackLoop);
  const t = useTranslation();
  
  const handleSlotClick = (index: number | null) => {
    setTrackLoop(track.id, index);
    audioManager.setTrackActive(track.id, index);
  };

  const loopSlots = [0, 1];

  let trackName = track.name;
  if (trackName === 'Drums') trackName = t.drums;
  else if (trackName === 'Bass') trackName = t.bass;
  else if (trackName === 'Synth') trackName = t.synth;
  else if (trackName === 'FX') trackName = t.fx;

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-[#151619] border border-slate-200 dark:border-[#222] rounded-xl p-4 min-h-[140px] transition-colors duration-300">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-mono text-slate-400 dark:text-[#8e9299] uppercase tracking-widest">{track.id}</span>
        <div className={`w-2 h-2 rounded-full ${track.activeLoopIndex !== null ? 'bg-[#00f3ff] shadow-[0_0_5px_#00f3ff]' : 'bg-slate-300 dark:bg-[#444]'}`}></div>
      </div>
      <div className="text-sm font-bold mb-3 tracking-wide uppercase text-slate-800 dark:text-[#e0e0e0]">{trackName}</div>
      <div className="grid grid-cols-2 gap-2 flex-grow">
        {loopSlots.map(slotIdx => {
          const isActive = track.activeLoopIndex === slotIdx;
          return (
            <button
              key={slotIdx}
              onClick={() => handleSlotClick(isActive ? null : slotIdx)}
              className={`h-10 text-[10px] sm:text-[9px] md:text-[10px] font-bold rounded flex items-center justify-center px-1 border transition-colors ${
                isActive 
                  ? 'bg-[#00f3ff] text-black border-[#00f3ff]' 
                  : 'bg-slate-50 dark:bg-[#222] text-slate-500 dark:text-[#8e9299] border-slate-200 dark:border-[#333] hover:border-slate-300 dark:hover:border-[#555] hover:text-slate-800 dark:hover:text-[#e0e0e0]'
              }`}
            >
              {t.loop}_0{slotIdx + 1}
            </button>
          );
        })}
        <button
          onClick={() => handleSlotClick(null)}
          disabled={track.activeLoopIndex === null}
          className={`col-span-2 h-8 mt-2 text-[10px] font-bold rounded flex items-center justify-center border transition-colors ${
            track.activeLoopIndex === null
              ? 'bg-slate-100 dark:bg-[#1a1a1a] border-slate-200 dark:border-[#222] text-slate-300 dark:text-[#444] opacity-50 cursor-not-allowed'
              : 'bg-slate-50 dark:bg-[#222] border-slate-300 dark:border-[#333] text-[#ff0055] hover:border-[#ff0055]'
          }`}
        >
          {t.stop}
        </button>
      </div>
    </div>
  );
}
