import { useDJStore } from '../store/djStore';

export const translations = {
  en: {
    globalSync: 'Global Sync',
    masterOut: 'Master Out',
    masterFilter: 'Master Filter',
    settings: 'Settings',
    language: 'Language',
    appearance: 'Appearance',
    light: 'Light',
    dark: 'Dark',
    deckReady: 'Deck Ready',
    armed: 'Armed',
    muted: 'Muted',
    gain: 'Gain',
    headroom: 'Headroom',
    patternA: 'Pattern A',
    patternB: 'Pattern B',
    frequency: 'Frequency',
    closed: 'Closed',
    open: 'Open',
    neuralEngine: 'NEURAL ENGINE',
    theDrop: 'THE DROP',
    dropping: 'DROPPING...',
    spectrumAnalyzer: 'SPECTRUM_ANALYZER_01',
    patternSequencer: 'PATTERN_SEQUENCER_01',
    matrix: '16-STEP MATRIX',
    seqLive: 'SEQ: LIVE',
    seqMuted: 'SEQ: MUTED',
    stop: 'STOP',
    loop: 'LOOP',
    bpm: 'BPM',
    lpf: 'LPF',
    hpf: 'HPF',
    lowPass: 'Low Pass',
    highPass: 'High Pass',
    drums: 'Drums',
    bass: 'Bass',
    synth: 'Synth',
    fx: 'FX',
    systemReady: 'SYSTEM READY',
    bufferOk: 'BUFFER: OK'
  },
  zh: {
    globalSync: '全局同步',
    masterOut: '主输出',
    masterFilter: '总线滤波',
    settings: '设置',
    language: '语言',
    appearance: '外观',
    light: '明亮',
    dark: '暗黑',
    deckReady: '声道就绪',
    armed: '已挂载',
    muted: '静音',
    gain: '增益',
    headroom: '余量',
    patternA: '样式 A',
    patternB: '样式 B',
    frequency: '频率',
    closed: '关闭',
    open: '打开',
    neuralEngine: '神经引擎',
    theDrop: '高潮爆发',
    dropping: '爆发中...',
    spectrumAnalyzer: '频谱分析器_01',
    patternSequencer: '步进音序器_01',
    matrix: '16步进矩阵',
    seqLive: '音序器：实时',
    seqMuted: '音序器：静音',
    stop: '停止',
    loop: '循环',
    bpm: '节拍',
    lpf: '低通',
    hpf: '高通',
    lowPass: '低通模式',
    highPass: '高通模式',
    drums: '鼓组',
    bass: '贝斯',
    synth: '合成器',
    fx: '效果',
    systemReady: '系统就绪',
    bufferOk: '缓冲: 正常'
  }
};

export function useTranslation() {
  const language = useDJStore(state => state.language);
  let activeLang = language;
  
  if (language === 'system') {
    activeLang = typeof navigator !== 'undefined' && navigator.language.startsWith('zh') ? 'zh' : 'en';
  }
  
  return translations[activeLang as 'en' | 'zh'] || translations.en;
}
