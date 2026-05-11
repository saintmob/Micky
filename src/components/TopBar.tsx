import React from 'react';
import { useDJStore } from '../store/djStore';
import { audioManager } from '../lib/audioManager';
import { useTranslation } from '../lib/i18n';
import { Languages, Moon, Play, Settings, Square, Sun, Volume2 } from 'lucide-react';

export function TopBar() {
  const { isPlaying, togglePlay, bpm, setBpm, masterGain, setMasterGain, theme, setTheme, language, setLanguage } = useDJStore();
  const t = useTranslation();
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const settingsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const closeSettings = (event: MouseEvent) => {
      if (!settingsRef.current?.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', closeSettings);
    return () => document.removeEventListener('mousedown', closeSettings);
  }, []);

  const resolvedLanguage = language === 'system'
    ? (typeof navigator !== 'undefined' && navigator.language.startsWith('zh') ? 'zh' : 'en')
    : language;

  const resolvedTheme = theme === 'system'
    ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;

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
        <div className="relative flex items-center gap-2" ref={settingsRef}>
          <button 
            onClick={() => setIsSettingsOpen(open => !open)}
            className={`h-11 w-11 rounded-md border flex items-center justify-center transition-all ${
              isSettingsOpen
                ? 'border-[#00f3ff] bg-[#00f3ff] text-black shadow-[0_0_18px_rgba(0,243,255,0.28)]'
                : 'border-slate-300 bg-white text-slate-600 hover:border-[#00f3ff] hover:text-slate-900 dark:border-white/10 dark:bg-[#151619] dark:text-[#8e9299] dark:hover:text-white'
            }`}
            title={t.settings}
            aria-expanded={isSettingsOpen}
            aria-label={t.settings}
          >
            <Settings className="h-4 w-4" />
          </button>

          {isSettingsOpen && (
            <div className="absolute right-0 top-14 z-50 w-64 rounded-lg border border-slate-200 bg-white/95 p-3 shadow-[0_24px_70px_rgba(15,23,42,0.18)] backdrop-blur-xl dark:border-white/10 dark:bg-[#111820]/95">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-black text-slate-900 dark:text-white">{t.settings}</div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-slate-400 dark:text-[#8e9299]">
                  <Languages className="h-3.5 w-3.5" />
                  {resolvedLanguage === 'zh' ? '中文' : 'En'}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="mb-2 text-[10px] font-mono uppercase text-slate-400 dark:text-[#8e9299]">{t.language}</div>
                  <div className="grid grid-cols-2 gap-1 rounded-md bg-slate-100 p-1 dark:bg-[#0b0f14]">
                    <button
                      onClick={() => setLanguage('zh')}
                      className={`h-9 rounded text-xs font-bold transition-colors ${resolvedLanguage === 'zh' ? 'bg-white text-slate-950 shadow-sm dark:bg-[#1f2a34] dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-[#8e9299] dark:hover:text-white'}`}
                    >
                      中文
                    </button>
                    <button
                      onClick={() => setLanguage('en')}
                      className={`h-9 rounded text-xs font-bold transition-colors ${resolvedLanguage === 'en' ? 'bg-white text-slate-950 shadow-sm dark:bg-[#1f2a34] dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-[#8e9299] dark:hover:text-white'}`}
                    >
                      En
                    </button>
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-[10px] font-mono uppercase text-slate-400 dark:text-[#8e9299]">{t.appearance}</div>
                  <div className="grid grid-cols-2 gap-1 rounded-md bg-slate-100 p-1 dark:bg-[#0b0f14]">
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex h-9 items-center justify-center gap-2 rounded text-xs font-bold transition-colors ${resolvedTheme === 'light' ? 'bg-white text-slate-950 shadow-sm dark:bg-[#1f2a34] dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-[#8e9299] dark:hover:text-white'}`}
                    >
                      <Sun className="h-3.5 w-3.5" />
                      {t.light}
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex h-9 items-center justify-center gap-2 rounded text-xs font-bold transition-colors ${resolvedTheme === 'dark' ? 'bg-white text-slate-950 shadow-sm dark:bg-[#1f2a34] dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-[#8e9299] dark:hover:text-white'}`}
                    >
                      <Moon className="h-3.5 w-3.5" />
                      {t.dark}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
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
