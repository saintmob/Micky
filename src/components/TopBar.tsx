import React from 'react';
import { useDJStore } from '../store/djStore';
import { audioManager } from '../lib/audioManager';
import { useTranslation } from '../lib/i18n';
import { Globe, Moon, Sun, Monitor } from 'lucide-react';

export function TopBar() {
  const { isPlaying, togglePlay, bpm, setBpm, theme, setTheme, language, setLanguage } = useDJStore();
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
    <header className="flex flex-wrap items-center justify-between mx-4 md:mx-6 mt-4 pb-4 border-b border-slate-200 dark:border-[#222] shrink-0 gap-4 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <div className="bg-[#00f3ff] w-8 h-8 rounded-sm flex items-center justify-center shrink-0">
          <div className="w-4 h-4 bg-white dark:bg-black rotate-45 transition-colors duration-300"></div>
        </div>
        <h1 className="text-xl font-bold tracking-tighter uppercase text-slate-800 dark:text-[#e0e0e0]">NEURAL-BEAT <span className="text-[#00f3ff] font-mono text-sm opacity-60 ml-2 hidden sm:inline">V1.0.4</span></h1>
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
        <div className="flex gap-2">
          <button 
            onClick={handlePlayToggle}
            className="w-12 h-10 bg-slate-100 dark:bg-[#151619] border border-slate-300 dark:border-[#333] flex items-center justify-center hover:bg-slate-200 dark:hover:bg-[#222] transition-colors"
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
