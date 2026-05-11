import React from 'react';
import { useDJStore, TrackState } from '../store/djStore';
import { audioManager } from '../lib/audioManager';
import { useTranslation } from '../lib/i18n';
import { Power, Volume2 } from 'lucide-react';

export const TrackControl: React.FC<{ track: TrackState }> = ({ track }) => {
  const setTrackLoop = useDJStore(state => state.setTrackLoop);
  const setTrackVolume = useDJStore(state => state.setTrackVolume);
  const t = useTranslation();
  
  const handleSlotClick = (index: number | null) => {
    setTrackLoop(track.id, index);
    audioManager.setTrackActive(track.id, index);
  };

  const loopSlots = [0, 1];
  const loopLabels = [t.patternA, t.patternB];
  const isActive = track.activeLoopIndex !== null;

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    setTrackVolume(track.id, volume);
    audioManager.setTrackVolume(track.id, volume);
  };

  let trackName = track.name;
  if (trackName === 'Drums') trackName = t.drums;
  else if (trackName === 'Bass') trackName = t.bass;
  else if (trackName === 'Synth') trackName = t.synth;
  else if (trackName === 'FX') trackName = t.fx;

  return (
    <div className={`flex-1 flex flex-col rounded-lg border p-4 min-h-[176px] transition-all duration-300 ${isActive ? 'bg-white border-[#00d6e8]/70 shadow-[0_18px_45px_rgba(0,214,232,0.12)] dark:bg-[#15191d] dark:border-[#00f3ff]/40' : 'bg-white/82 border-slate-200 dark:bg-[#111418] dark:border-white/10'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400 dark:text-[#8e9299] uppercase tracking-widest">{track.id}</span>
          <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-[#40ff8f] shadow-[0_0_8px_#40ff8f]' : 'bg-slate-300 dark:bg-[#444]'}`}></span>
        </div>
        <button
          onClick={() => handleSlotClick(null)}
          disabled={!isActive}
          className={`h-7 w-7 rounded-md border flex items-center justify-center transition-colors ${
            !isActive
              ? 'border-slate-200 text-slate-300 dark:border-white/10 dark:text-[#444] cursor-not-allowed'
              : 'border-[#ff2f6d]/60 text-[#ff2f6d] hover:bg-[#ff2f6d] hover:text-white'
          }`}
          title={t.stop}
        >
          <Power className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex items-end justify-between gap-3">
        <div className="text-base font-black uppercase text-slate-900 dark:text-white">{trackName}</div>
        <div className="text-[10px] font-mono uppercase text-slate-400 dark:text-[#8e9299]">{isActive ? t.armed : t.muted}</div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {loopSlots.map(slotIdx => {
          const isSlotActive = track.activeLoopIndex === slotIdx;
          return (
            <button
              key={slotIdx}
              onClick={() => handleSlotClick(isSlotActive ? null : slotIdx)}
              className={`h-10 text-[10px] font-bold rounded-md flex items-center justify-center px-2 border transition-colors ${
                isSlotActive 
                  ? 'bg-[#00f3ff] text-black border-[#00f3ff] shadow-[0_0_14px_rgba(0,243,255,0.35)]' 
                  : 'bg-slate-50 dark:bg-[#1d2228] text-slate-500 dark:text-[#8e9299] border-slate-200 dark:border-white/10 hover:border-[#00d6e8] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {loopLabels[slotIdx]}
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-4">
        <div className="mb-2 flex items-center justify-between text-[10px] font-mono uppercase text-slate-400 dark:text-[#8e9299]">
          <span className="flex items-center gap-1.5"><Volume2 className="h-3 w-3" />{t.gain}</span>
          <span>{Math.round(track.volume * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1.1"
          step="0.01"
          value={track.volume}
          onChange={handleVolumeChange}
          className="pro-range"
        />
        <div className="mt-3 grid grid-cols-12 gap-1">
          {Array.from({ length: 12 }).map((_, index) => {
            const lit = isActive && index < Math.round(track.volume * 11);
            const hot = index > 9;
            return (
              <div
                key={index}
                className={`h-1.5 rounded-full ${lit ? (hot ? 'bg-[#ffb000]' : 'bg-[#40ff8f]') : 'bg-slate-200 dark:bg-white/10'}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
