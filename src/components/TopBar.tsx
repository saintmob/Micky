import React from 'react';
import { useDJStore } from '../store/djStore';
import { audioManager } from '../lib/audioManager';
import { useTranslation } from '../lib/i18n';
import { Globe, Moon, Sun, Monitor, Play, Square, Volume2 } from 'lucide-react';

export function TopBar() {
  const { isPlaying, togglePlay, bpm, setBpm, masterGain, setMasterGain, theme, setTheme, language, setLanguage } = useDJStore();
  const t = useTranslation();

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

  const handleMasterGainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setMasterGain(val);
    audioManager.setMasterGain(val);
  };

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  const cycleLanguage = () => {
    if (language === 'system') setLanguage('en');
    else if (language === 'en') setLanguage('zh');
    else setLanguage('system');
  };

  return (
    <header className="mx-4 md:mx-6 mt-4 pb-4 border-b border-slate-200/80 dark:border-white/10 shrink-0 transition-colors duration-300">
      <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="bg-[#00f3ff] w-9 h-9 rounded-md flex items-center justify-center shrink-0 shadow-[0_0_24px_rgba(0,243,255,0.25)]">
          <div className="w-4 h-4 bg-white dark:bg-[#08090b] rotate-45 transition-colors duration-300"></div>
        </div>
        <div>
          <h1 className="text-xl font-black uppercase text-slate-900 dark:text-white">NEURAL-BEAT <span className="text-[#00f3ff] font-mono text-sm opacity-70 ml-2 hidden sm:inline">PRO 1.1</span></h1>
          <div className="mt-1 flex items-center gap-2 text-[10px] font-mono uppercase text-slate-500 dark:text-[#8e9299]">
            <span className={`h-1.5 w-1.5 rounded-full ${isPlaying ? 'bg-[#40ff8f] shadow-[0_0_8px_#40ff8f]' : 'bg-slate-400 dark:bg-[#555]'}`} />
            {isPlaying ? t.armed : t.deckReady}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8 flex-wrap">
        <div className="flex items-center gap-2">
          <button 
            onClick={cycleLanguage} 
            className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-[#8e9299] dark:hover:text-[#e0e0e0] transition-colors relative group"
            title="Toggle Language"
          >
            <Globe className="w-4 h-4" />
            <span className="absolute -bottom-1 -right-1 text-[8px] font-mono font-bold bg-slate-200 dark:bg-[#333] px-1 rounded">{language === 'system' ? 'SYS' : language.toUpperCase()}</span>
          </button>
          
          <button 
            onClick={cycleTheme} 
            className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-[#8e9299] dark:hover:text-[#e0e0e0] transition-colors"
            title="Toggle Theme"
          >
            {theme === 'light' ? <Sun className="w-4 h-4" /> : theme === 'dark' ? <Moon className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] text-slate-400 dark:text-[#8e9299] uppercase font-mono tracking-widest leading-tight">{t.globalSync}</span>
          <div className="flex items-center gap-1">
            <input 
              type="number" 
              value={bpm}
              onChange={handleBpmChange}
              className="w-16 bg-transparent text-[#00f3ff] font-mono text-2xl font-bold leading-none outline-none text-right"
              min="60"
              max="200"
            />
            <span className="text-xs text-[#00f3ff] opacity-50 font-mono mt-1">{t.bpm}</span>
          </div>
        </div>
        <div className="hidden sm:flex min-w-36 flex-col gap-2">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400 dark:text-[#8e9299]">
            <span className="flex items-center gap-1.5"><Volume2 className="h-3 w-3" />{t.masterOut}</span>
            <span>{Math.round(masterGain * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1.1"
            step="0.01"
            value={masterGain}
            onChange={handleMasterGainChange}
            className="pro-range"
          />
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handlePlayToggle}
            className={`h-11 w-12 rounded-md border flex items-center justify-center transition-all ${isPlaying ? 'border-[#ff2f6d] bg-[#ff2f6d] text-white shadow-[0_0_18px_rgba(255,47,109,0.35)]' : 'border-slate-300 bg-white text-[#00a8c5] hover:border-[#00f3ff] dark:border-white/10 dark:bg-[#151619]'}`}
            title={isPlaying ? t.stop : 'Play'}
          >
            {isPlaying ? <Square className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
          </button>
        </div>
      </div>
      </div>
    </header>
  );
}
