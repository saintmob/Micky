import React from 'react';
import { useDJStore } from '../store/djStore';
import { useTranslation } from '../lib/i18n';

const INSTRUMENTS_EN = ['KICK', 'CLAP', 'HIHAT', 'BASS'];
const INSTRUMENTS_ZH = ['底鼓', '拍手', '踩镲', '贝斯'];

export function StepSequencer() {
  const { seqMatrix, seqCurrentStep, toggleSeqStep, isSeqActive, toggleSeqActive, language } = useDJStore();
  const t = useTranslation();

  const isZh = language === 'zh' || (language === 'system' && typeof navigator !== 'undefined' && navigator.language.startsWith('zh'));
  const INSTRUMENTS = isZh ? INSTRUMENTS_ZH : INSTRUMENTS_EN;

  return (
    <div className="w-full h-full p-4 flex flex-col pt-14 relative z-10 box-border pointer-events-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isSeqActive ? 'bg-[#ff0055] animate-pulse shadow-[0_0_8px_#ff0055]' : 'bg-slate-300 dark:bg-[#444]'}`}></div>
          <h2 className="text-slate-800 dark:text-[#e0e0e0] font-mono text-lg tracking-widest font-bold">{t.matrix}</h2>
        </div>
        <button
           onClick={toggleSeqActive}
           className={`px-4 py-2 font-mono text-[10px] sm:text-xs font-bold border rounded transition-colors flex items-center gap-2
             ${isSeqActive ? 'bg-[#ff0055] text-white border-[#ff0055]' : 'bg-slate-100 dark:bg-[#222] border-slate-300 dark:border-[#333] text-slate-500 dark:text-[#8e9299] hover:border-slate-400 dark:hover:border-[#555]'}`}
        >
          {isSeqActive ? t.seqLive : t.seqMuted}
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-2 relative">
         <div className="absolute top-0 bottom-0 left-16 flex w-[calc(100%-4rem)] pointer-events-none z-0">
           {[0, 1, 2, 3].map(i => (
             <div key={i} className={`flex-1 border-r border-slate-200 dark:border-[#ffffff0a] ${i===3 ? 'border-r-0' : ''} h-full`}></div>
           ))}
         </div>
         {seqMatrix.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-1 items-center gap-2 sm:gap-3 z-10 w-full min-h-0">
               <div className="w-12 sm:w-16 text-[9px] sm:text-[10px] font-mono text-slate-500 dark:text-[#8e9299] shrink-0 font-bold tracking-wider text-right pr-2">{INSTRUMENTS[rowIndex]}</div>
               <div className="flex-1 flex gap-1 h-full min-h-0 pb-1">
                  {row.map((isOn, colIndex) => {
                     const isCurrentStep = seqCurrentStep === colIndex;
                     const isBeatStart = colIndex % 4 === 0;
                     return (
                        <button
                           key={colIndex}
                           onClick={() => toggleSeqStep(rowIndex, colIndex)}
                           className={`flex-1 rounded-sm border transition-all relative overflow-hidden min-h-0
                              ${isOn 
                                ? (isCurrentStep ? 'bg-[#fff] border-[#fff] shadow-[0_0_15px_#aaa] dark:shadow-[0_0_15px_#fff]' : 'bg-[#00f3ff] border-[#00f3ff] shadow-[0_0_10px_rgba(0,243,255,0.5)]')
                                : (isCurrentStep ? 'bg-slate-300 dark:bg-[#333] border-slate-400 dark:border-[#555]' : 'bg-slate-100 dark:bg-[#1a1a1a] border-slate-200 dark:border-[#222] hover:border-slate-300 dark:hover:border-[#444]')
                              }
                              ${!isOn && isBeatStart && !isCurrentStep ? 'bg-slate-200 dark:bg-[#202124]' : ''}
                           `}
                        >
                           {isCurrentStep && <div className="absolute inset-0 bg-white/20"></div>}
                        </button>
                     )
                  })}
               </div>
            </div>
         ))}
      </div>

      <div className="flex items-center gap-2 sm:gap-3 mt-1 h-2 z-10">
        <div className="w-12 sm:w-16 shrink-0"></div>
        <div className="flex-1 flex gap-1">
          {Array.from({length: 16}).map((_, i) => (
             <div key={i} className="flex-1 flex justify-center">
                <div className={`w-1 h-1 rounded-full ${seqCurrentStep === i ? 'bg-[#ff0055] shadow-[0_0_5px_#ff0055]' : 'bg-slate-300 dark:bg-[#333]'}`}></div>
             </div>
          ))}
        </div>
      </div>
    </div>
  )
}
