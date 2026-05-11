import React from 'react';
import { Disc3, StopCircle } from 'lucide-react';
import { useDJStore, TrackState } from '../store/djStore';
import { audioManager } from '../lib/audioManager';

export const TrackControl: React.FC<{ track: TrackState }> = ({ track }) => {
  const setTrackLoop = useDJStore(state => state.setTrackLoop);
  
  const handleSlotClick = (index: number | null) => {
    setTrackLoop(track.id, index);
    audioManager.setTrackActive(track.id, index);
  };

  // Pre-define loop slots (e.g., 2 loops per track)
  const loopSlots = [0, 1];

  return (
    <div className="flex-1 flex flex-col bg-[#151619] border border-[#222] rounded-xl p-4 min-h-[140px]">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-mono text-[#8e9299] uppercase tracking-widest">{track.id}</span>
        <div className={`w-2 h-2 rounded-full ${track.activeLoopIndex !== null ? 'bg-[#00f3ff] shadow-[0_0_5px_#00f3ff]' : 'bg-[#444]'}`}></div>
      </div>
      <div className="text-sm font-bold mb-3 tracking-wide uppercase">{track.name}</div>
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
                  : 'bg-[#222] text-[#8e9299] border-[#333] hover:border-[#555] hover:text-[#e0e0e0]'
              }`}
            >
              LOOP_0{slotIdx + 1}
            </button>
          );
        })}
        {/* Stop button */}
        <button
          onClick={() => handleSlotClick(null)}
          disabled={track.activeLoopIndex === null}
          className={`col-span-2 h-8 mt-2 text-[10px] font-bold rounded flex items-center justify-center border transition-colors ${
            track.activeLoopIndex === null
              ? 'bg-[#1a1a1a] border-[#222] text-[#444] opacity-50 cursor-not-allowed'
              : 'bg-[#222] border-[#333] text-[#ff0055] hover:border-[#ff0055]'
          }`}
        >
          STOP
        </button>
      </div>
    </div>
  );
}
