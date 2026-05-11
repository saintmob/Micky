import React from 'react';
import { useDJStore } from '../store/djStore';
import { audioManager } from '../lib/audioManager';
import { useTranslation } from '../lib/i18n';

export function FilterControl() {
  const { filterFreq, filterType, setFilterFreq, setFilterType } = useDJStore();
  const t = useTranslation();

  const handleFreqChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setFilterFreq(val);
    audioManager.setFilter(val, filterType);
  };

  const toggleType = () => {
    const nextType = filterType === 'lowpass' ? 'highpass' : 'lowpass';
    setFilterType(nextType);
    audioManager.setFilter(filterType === 'lowpass' ? 1.0 : 0.0, nextType); 
  };

  return (
    <div className="h-48 bg-white dark:bg-[#151619] border border-slate-200 dark:border-[#222] rounded-xl p-4 flex flex-col justify-between shrink-0 transition-colors duration-300">
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-mono text-slate-400 dark:text-[#8e9299] uppercase tracking-widest">{t.masterFilter}</span>
        <button 
          onClick={toggleType}
          className="text-[10px] font-mono font-bold px-2 py-1 bg-slate-100 dark:bg-[#222] border border-slate-200 dark:border-[#333] text-slate-800 dark:text-[#e0e0e0] rounded hover:bg-slate-200 dark:hover:bg-[#333] transition-colors"
        >
          {filterType === 'lowpass' ? t.lpf : t.hpf}
        </button>
      </div>
      
      <div className="flex-grow flex flex-col justify-center px-2">
        <div className="relative h-1 bg-slate-200 dark:bg-[#333] rounded-full w-full mb-4">
          <div 
            className="absolute top-0 left-0 h-full bg-[#00f3ff] rounded-full"
            style={{ width: `${filterFreq * 100}%` }}
          ></div>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01"
            value={filterFreq}
            onChange={handleFreqChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#00f3ff] rounded-sm pointer-events-none shadow-[0_0_10px_#00f3ff]"
            style={{ left: `calc(${filterFreq * 100}% - 8px)` }}
          ></div>
        </div>
        <div className="flex justify-between text-[10px] font-mono text-slate-400 dark:text-[#8e9299] uppercase mt-2">
          <span>{filterType === 'lowpass' ? t.closed : t.open}</span>
          <span>{filterType === 'lowpass' ? t.open : t.closed}</span>
        </div>
      </div>
    </div>
  );
}
