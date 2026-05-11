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
    <div className="h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-800 dark:text-[#e0e0e0] flex flex-col font-sans overflow-hidden transition-colors duration-300">
      <TopBar />
      
      <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-6 overflow-y-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-6 gap-4 h-full min-h-[800px] lg:min-h-0 w-full">
          
          {/* Central Visualizer / Sequencer Area */}
          <div className="lg:col-span-3 lg:row-span-4 bg-white dark:bg-[#111] border border-slate-200 dark:border-[#222] rounded-xl relative overflow-hidden flex flex-col transition-colors duration-300">
            <div className="absolute top-4 left-4 z-20 flex gap-2 pointer-events-auto">
              <button
                onClick={() => setActiveTab('visualizer')}
                className={`text-[10px] font-mono px-2 py-1 backdrop-blur-md transition-colors border ${
                  activeTab === 'visualizer' ? 'text-[#00f3ff] border-[#00f3ff]/50 bg-white/80 dark:bg-black/50' : 'text-slate-500 dark:text-[#8e9299] border-slate-300 dark:border-[#333] hover:text-slate-800 dark:hover:text-[#e0e0e0] bg-slate-100 dark:bg-[#111]'
                }`}
              >
                {t.spectrumAnalyzer}
              </button>
              <button
                onClick={() => setActiveTab('sequencer')}
                className={`text-[10px] font-mono px-2 py-1 backdrop-blur-md transition-colors border flex items-center gap-2 ${
                  activeTab === 'sequencer' ? 'text-[#00f3ff] border-[#00f3ff]/50 bg-white/80 dark:bg-black/50' : 'text-slate-500 dark:text-[#8e9299] border-slate-300 dark:border-[#333] hover:text-slate-800 dark:hover:text-[#e0e0e0] bg-slate-100 dark:bg-[#111]'
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
