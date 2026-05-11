/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { Visualizer } from './components/Visualizer';
import { StepSequencer } from './components/StepSequencer';
import { TrackControl } from './components/TrackControl';
import { FilterControl } from './components/FilterControl';
import { AiButton } from './components/AiButton';
import { useDJStore } from './store/djStore';
import { useTranslation } from './lib/i18n';

export default function App() {
  const tracks = useDJStore(state => state.tracks);
  const activeTab = useDJStore(state => state.activeTab);
  const setActiveTab = useDJStore(state => state.setActiveTab);
  const theme = useDJStore(state => state.theme);
  const t = useTranslation();

  // Handle Hydration issues with persistant state occasionally.
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    const applyTheme = () => {
      if (theme === 'dark') {
        root.classList.add('dark');
      } else if (theme === 'light') {
        root.classList.remove('dark');
      } else {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };
    
    applyTheme();
    
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  if (!mounted) return null;

  return (
    <div className="h-screen bg-[#eef1f4] text-slate-800 dark:bg-[#08090b] dark:text-[#e0e0e0] flex flex-col font-sans overflow-hidden transition-colors duration-300">
      <TopBar />
      
      <main className="flex-1 w-full max-w-[1480px] mx-auto p-4 md:p-6 overflow-y-auto w-full">
        <div className="mb-4 grid grid-cols-2 gap-2 text-[10px] font-mono uppercase text-slate-500 dark:text-[#8e9299] sm:grid-cols-4">
          <div className="status-chip">{t.systemReady}</div>
          <div className="status-chip">{t.bufferOk}</div>
          <div className="status-chip">{tracks.filter(track => track.activeLoopIndex !== null).length}/4 {t.armed}</div>
          <div className="status-chip">{activeTab === 'visualizer' ? t.spectrumAnalyzer : t.patternSequencer}</div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-6 gap-4 h-full min-h-[860px] lg:min-h-0 w-full">
          
          {/* Central Visualizer / Sequencer Area */}
          <div className="lg:col-span-3 lg:row-span-4 bg-white dark:bg-[#0e1115] border border-slate-200 dark:border-white/10 rounded-lg relative overflow-hidden flex flex-col transition-colors duration-300 shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
            <div className="absolute top-4 left-4 z-20 flex gap-2 pointer-events-auto">
              <button
                onClick={() => setActiveTab('visualizer')}
                className={`text-[10px] font-mono px-3 py-2 rounded-md backdrop-blur-md transition-colors border ${
                  activeTab === 'visualizer' ? 'text-black border-[#00f3ff] bg-[#00f3ff]' : 'text-slate-500 dark:text-[#8e9299] border-slate-300 dark:border-white/10 hover:text-slate-800 dark:hover:text-white bg-slate-100/90 dark:bg-[#111820]/90'
                }`}
              >
                {t.spectrumAnalyzer}
              </button>
              <button
                onClick={() => setActiveTab('sequencer')}
                className={`text-[10px] font-mono px-3 py-2 rounded-md backdrop-blur-md transition-colors border flex items-center gap-2 ${
                  activeTab === 'sequencer' ? 'text-black border-[#00f3ff] bg-[#00f3ff]' : 'text-slate-500 dark:text-[#8e9299] border-slate-300 dark:border-white/10 hover:text-slate-800 dark:hover:text-white bg-slate-100/90 dark:bg-[#111820]/90'
                }`}
              >
                {t.patternSequencer}
              </button>
            </div>
            
            <div className={`w-full h-full absolute inset-0 ${activeTab === 'visualizer' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
              <Visualizer />
            </div>
            
            <div className={`w-full h-full absolute inset-0 ${activeTab === 'sequencer' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
              <StepSequencer />
            </div>
          </div>

          {/* Master Effects & AI Panel */}
          <div className="lg:col-span-1 lg:row-span-4 flex flex-col gap-4">
            <AiButton />
            <FilterControl />
          </div>

          {/* Track Controls */}
          {tracks.map(track => (
            <div key={track.id} className="lg:col-span-1 lg:row-span-2 flex">
              <TrackControl track={track} />
            </div>
          ))}

        </div>
      </main>
    </div>
  );
}
