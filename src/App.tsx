/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TopBar } from './components/TopBar';
import { Visualizer } from './components/Visualizer';
import { StepSequencer } from './components/StepSequencer';
import { TrackControl } from './components/TrackControl';
import { FilterControl } from './components/FilterControl';
import { AiButton } from './components/AiButton';
import { useDJStore } from './store/djStore';

export default function App() {
  const tracks = useDJStore(state => state.tracks);
  const activeTab = useDJStore(state => state.activeTab);
  const setActiveTab = useDJStore(state => state.setActiveTab);

  return (
    <div className="h-screen bg-[#0a0a0a] text-[#e0e0e0] flex flex-col font-sans overflow-hidden">
      <TopBar />
      
      <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-6 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-6 gap-4 h-full min-h-[800px] lg:min-h-0">
          
          {/* Central Visualizer / Sequencer Area */}
          <div className="lg:col-span-3 lg:row-span-4 bg-[#111] border border-[#222] rounded-xl relative overflow-hidden flex flex-col">
            <div className="absolute top-4 left-4 z-20 flex gap-2 pointer-events-auto">
              <button
                onClick={() => setActiveTab('visualizer')}
                className={`text-[10px] font-mono px-2 py-1 backdrop-blur-md transition-colors border ${
                  activeTab === 'visualizer' ? 'text-[#00f3ff] border-[#00f3ff]/50 bg-black/50' : 'text-[#8e9299] border-[#333] hover:text-[#e0e0e0] bg-[#111]'
                }`}
              >
                SPECTRUM_ANALYZER_01
              </button>
              <button
                onClick={() => setActiveTab('sequencer')}
                className={`text-[10px] font-mono px-2 py-1 backdrop-blur-md transition-colors border flex items-center gap-2 ${
                  activeTab === 'sequencer' ? 'text-[#00f3ff] border-[#00f3ff]/50 bg-black/50' : 'text-[#8e9299] border-[#333] hover:text-[#e0e0e0] bg-[#111]'
                }`}
              >
                PATTERN_SEQUENCER_01
              </button>
            </div>
            
            <div className={`w-full h-full absolute inset-0 ${activeTab === 'visualizer' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
              {/* Keep visualizer mounted so it continues drawing without re-init */}
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
