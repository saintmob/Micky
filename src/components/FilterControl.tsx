import React from 'react';
import { useDJStore } from '../store/djStore';
import { AudioManager, audioManager } from '../lib/audioManager';
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

  const frequency = AudioManager.ratioToFrequency(filterFreq);
  const frequencyLabel = frequency >= 1000 ? `${(frequency / 1000).toFixed(1)} kHz` : `${Math.round(frequency)} Hz`;

  return (
    <div className="h-48 bg-white/88 dark:bg-[#15191d] border border-slate-200 dark:border-white/10 rounded-lg p-4 flex flex-col justify-between shrink-0 transition-colors duration-300">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] font-mono text-slate-400 dark:text-[#8e9299] uppercase tracking-widest">{t.masterFilter}</span>
          <div className="mt-1 text-xl font-black text-slate-900 dark:text-white">{frequencyLabel}</div>
        </div>
        <button 
          onClick={toggleType}
          className="text-[10px] font-mono font-bold px-2 py-1 bg-slate-100 dark:bg-[#222832] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-md hover:border-[#00f3ff]/60 transition-colors"
        >
          {filterType === 'lowpass' ? t.lpf : t.hpf}
        </button>
      </div>
      
      <div className="flex-grow flex flex-col justify-center px-2">
        <div className="relative h-1.5 bg-slate-200 dark:bg-white/10 rounded-full w-full mb-4">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#40ff8f] via-[#00f3ff] to-[#ff2f6d] rounded-full"
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
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#00f3ff] rounded pointer-events-none shadow-[0_0_10px_#00f3ff] dark:bg-[#08090b]"
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
