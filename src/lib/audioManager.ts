import * as Tone from 'tone';
import { useDJStore } from '../store/djStore';

export class AudioManager {
  private inited = false;
  private filter!: Tone.Filter;
  private analyzer!: Tone.FFT;
  private masterVolume!: Tone.Volume;
  private trackBuses: Record<string, Tone.Volume> = {};
  
  // Track specific
  private synths: Record<string, Tone.Synth | Tone.PolySynth | Tone.MembraneSynth | Tone.NoiseSynth | Tone.MetalSynth | any> = {};
  private parts: Record<string, Tone.Part> = {};
  private customSeq: Tone.Sequence | null = null;

  constructor() {}

  private setupRouting() {
    this.filter = new Tone.Filter({
      type: 'lowpass',
      frequency: 20000,
      Q: 1,
    });
    this.analyzer = new Tone.FFT(64); // Provide 64 frequency bins
    this.masterVolume = new Tone.Volume(this.gainToDb(0.86));
    
    // Routing: Track buses -> Filter -> MasterVolume -> Analyzer/Destination
    this.filter.connect(this.masterVolume);
    this.masterVolume.connect(this.analyzer);
    this.masterVolume.toDestination();
  }

  async initEngine() {
    if (this.inited) return;
    await Tone.start();
    this.setupRouting();
    Tone.Transport.bpm.value = 128;
    const state = useDJStore.getState();
    this.masterVolume.volume.value = this.gainToDb(state.masterGain);
    this.setupInstruments();
    this.setupSequences();
    this.inited = true;
    this.setFilter(state.filterFreq, state.filterType);
    state.tracks.forEach(track => this.setTrackActive(track.id, track.activeLoopIndex));
  }

  setMasterGain(gain: number) {
    if (!this.inited) return;
    this.masterVolume.volume.rampTo(this.gainToDb(gain), 0.08);
  }

  setBpm(bpm: number) {
    Tone.Transport.bpm.rampTo(bpm, 0.1);
  }

  setFilter(freqRatio: number, type: 'lowpass' | 'highpass') {
    if (!this.inited) return;
    this.filter.type = type;
    this.filter.frequency.exponentialRampTo(AudioManager.ratioToFrequency(freqRatio), 0.1);
  }

  start() {
    Tone.Transport.start();
  }

  stop() {
    Tone.Transport.stop();
  }

  getAnalyzerData(): Uint8Array {
    if (!this.inited) return new Uint8Array(64);
    return this.analyzer.getValue() as Float32Array as any; // Tone.js FFT returns Float32Array in dB
  }
  
  getAnalyzerFloatData(): Float32Array {
    if (!this.inited) return new Float32Array(64).fill(-200);
    return this.analyzer.getValue() as Float32Array;
  }

  setTrackActive(trackId: string, loopIndex: number | null) {
    if (!this.inited) return;
    // Stop all loops for this track
    Object.keys(this.parts).filter(k => k.startsWith(`${trackId}_`)).forEach(k => {
      this.parts[k].mute = true;
    });

    if (loopIndex !== null) {
      const partId = `${trackId}_${loopIndex}`;
      if (this.parts[partId]) {
        this.parts[partId].mute = false;
      }
    }
  }

  setTrackVolume(trackId: string, volume: number) {
    if (!this.inited) return;
    const bus = this.trackBuses[trackId];
    if (bus) {
      bus.volume.rampTo(this.gainToDb(volume), 0.08);
    }
  }

  static ratioToFrequency(freqRatio: number) {
    const minFreq = 20;
    const maxFreq = 20000;
    return Math.max(20, Math.min(Math.pow(maxFreq / minFreq, freqRatio) * minFreq, 20000));
  }

  private gainToDb(gain: number) {
    const safeGain = Math.max(0.0001, Math.min(gain, 1.25));
    return Tone.gainToDb(safeGain);
  }

  private createTrackBuses() {
    const { tracks } = useDJStore.getState();
    tracks.forEach(track => {
      this.trackBuses[track.id] = new Tone.Volume(this.gainToDb(track.volume)).connect(this.filter);
    });
  }

  private bus(trackId: string) {
    return this.trackBuses[trackId] ?? this.filter;
  }

  private setupInstruments() {
    this.createTrackBuses();

    // Drum
    this.synths['kick'] = new Tone.MembraneSynth().connect(this.bus('t1'));
    const hatEnv = new Tone.AmplitudeEnvelope({ attack: 0.001, decay: 0.055, sustain: 0, release: 0.02 }).connect(this.bus('t1'));
    this.synths['hatNoise'] = new Tone.Noise({ type: 'white', volume: -18 }).connect(hatEnv);
    this.synths['hatNoise'].start();
    this.synths['hat'] = hatEnv;
    const clapEnv = new Tone.AmplitudeEnvelope({ attack: 0.001, decay: 0.2, sustain: 0, release: 0.1 }).connect(this.bus('t1'));
    this.synths['clapNoise'] = new Tone.Noise({ type: 'pink' }).connect(clapEnv);
    this.synths['clapNoise'].start();
    this.synths['clap'] = clapEnv; // We'll trigger envelope

    // Bass
    this.synths['bass'] = new Tone.MonoSynth({
      oscillator: { type: 'square' },
      filter: { Q: 3, type: 'lowpass', rolloff: -24 },
      envelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 0.2 },
      filterEnvelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 0.2, baseFrequency: 100, octaves: 4 },
      volume: -6
    }).connect(this.bus('t2'));

    // Synth
    this.synths['poly'] = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.05, decay: 0.3, sustain: 0.4, release: 1 },
      volume: -8
    }).connect(this.bus('t3'));
    
    // FX
    this.synths['fxNoise'] = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.5, decay: 1, sustain: 0, release: 1 },
      volume: -10
    }).connect(this.bus('t4'));
    const crashEnv = new Tone.AmplitudeEnvelope({ attack: 0.005, decay: 1.2, sustain: 0, release: 0.4 }).connect(this.bus('t4'));
    this.synths['crashNoise'] = new Tone.Noise({ type: 'white', volume: -12 }).connect(crashEnv);
    this.synths['crashNoise'].start();
    this.synths['crash'] = crashEnv;
  }

  private setupSequences() {
    // --- DRUMS (t1) ---
    // Loop 0: Four on the floor
    this.parts['t1_0'] = new Tone.Part((time, value) => {
      if (value.kick) this.synths['kick'].triggerAttackRelease('C1', '8n', time);
      if (value.hat) this.synths['hat'].triggerAttackRelease('32n', time);
      if (value.clap) this.synths['clap'].triggerAttack(time);
    }, [
      { time: '0:0:0', kick: true, hat: false, clap: false },
      { time: '0:0:2', kick: false, hat: true, clap: false },
      { time: '0:1:0', kick: true, hat: false, clap: true },
      { time: '0:1:2', kick: false, hat: true, clap: false },
      { time: '0:2:0', kick: true, hat: false, clap: false },
      { time: '0:2:2', kick: false, hat: true, clap: false },
      { time: '0:3:0', kick: true, hat: false, clap: true },
      { time: '0:3:2', kick: false, hat: true, clap: false },
    ]).start(0);
    this.parts['t1_0'].loop = true;
    this.parts['t1_0'].loopEnd = '1m';
    this.parts['t1_0'].mute = true;

    // Loop 1: Breakbeat
    this.parts['t1_1'] = new Tone.Part((time, value) => {
      if (value.kick) this.synths['kick'].triggerAttackRelease('C1', '8n', time);
      if (value.hat) this.synths['hat'].triggerAttackRelease('32n', time, 0.5);
      if (value.clap) this.synths['clap'].triggerAttack(time);
    }, [
      { time: '0:0:0', kick: true, hat: true, clap: false },
      { time: '0:0:2', kick: false, hat: true, clap: false },
      { time: '0:1:0', kick: false, hat: true, clap: true },
      { time: '0:1:1.5', kick: true, hat: false, clap: false },
      { time: '0:2:0', kick: false, hat: true, clap: false },
      { time: '0:2:1.5', kick: true, hat: false, clap: false },
      { time: '0:3:0', kick: false, hat: true, clap: true },
      { time: '0:3:2', kick: false, hat: true, clap: false },
    ]).start(0);
    this.parts['t1_1'].loop = true;
    this.parts['t1_1'].loopEnd = '1m';
    this.parts['t1_1'].mute = true;

    // --- BASS (t2) ---
    // Loop 0: Offbeat Bass
    this.parts['t2_0'] = new Tone.Part((time, note) => {
      this.synths['bass'].triggerAttackRelease(note, '16n', time);
    }, [
      ['0:0:2', 'C2'], ['0:1:2', 'C2'], ['0:2:2', 'C2'], ['0:3:2', 'Eb2']
    ]).start(0);
    this.parts['t2_0'].loop = true;
    this.parts['t2_0'].loopEnd = '1m';
    this.parts['t2_0'].mute = true;

    // Loop 1: Rolling Bass
    this.parts['t2_1'] = new Tone.Part((time, note) => {
      this.synths['bass'].triggerAttackRelease(note, '16n', time);
    }, [
      ['0:0:0', 'C2'], ['0:0:1.5', 'C2'], ['0:0:3', 'C2'], 
      ['0:1:0', 'C2'], ['0:1:1.5', 'Eb2'], ['0:1:3', 'Eb2'],
      ['0:2:0', 'F2'], ['0:2:1.5', 'F2'], ['0:2:3', 'F2'],
      ['0:3:0', 'Bb1'], ['0:3:1.5', 'Bb1'], ['0:3:3', 'Bb1']
    ]).start(0);
    this.parts['t2_1'].loop = true;
    this.parts['t2_1'].loopEnd = '1m';
    this.parts['t2_1'].mute = true;

    // --- SYNTH CHORDS (t3) ---
    // Loop 0: Stabs
    this.parts['t3_0'] = new Tone.Part((time, notes) => {
      this.synths['poly'].triggerAttackRelease(notes, '8n', time);
    }, [
      ['0:0:2', ['C4', 'Eb4', 'G4']], 
      ['0:2:2', ['C4', 'F4', 'Ab4']]
    ]).start(0);
    this.parts['t3_0'].loop = true;
    this.parts['t3_0'].loopEnd = '1m';
    this.parts['t3_0'].mute = true;

    // Loop 1: Arp
    this.parts['t3_1'] = new Tone.Part((time, note) => {
      this.synths['poly'].triggerAttackRelease(note, '16n', time, 0.5);
    }, [
      ['0:0:0', 'C4'], ['0:0:1', 'G4'], ['0:0:2', 'Eb4'], ['0:0:3', 'C5'],
      ['0:1:0', 'C4'], ['0:1:1', 'G4'], ['0:1:2', 'Eb4'], ['0:1:3', 'C5'],
      ['0:2:0', 'F4'], ['0:2:1', 'C5'], ['0:2:2', 'Ab4'], ['0:2:3', 'F5'],
      ['0:3:0', 'Bb3'], ['0:3:1', 'F4'], ['0:3:2', 'D4'], ['0:3:3', 'Bb4']
    ]).start(0);
    this.parts['t3_1'].loop = true;
    this.parts['t3_1'].loopEnd = '1m';
    this.parts['t3_1'].mute = true;

    // --- FX (t4) ---
    // Loop 0: Sweep on 1
    this.parts['t4_0'] = new Tone.Part((time, dummy) => {
      this.synths['fxNoise'].triggerAttackRelease('2n', time);
    }, [
      ['0:0:0', 'sweep']
    ]).start(0);
    this.parts['t4_0'].loop = true;
    this.parts['t4_0'].loopEnd = '2m'; // Trigger every 2 bars
    this.parts['t4_0'].mute = true;
    
    // Loop 1: Crash
    this.parts['t4_1'] = new Tone.Part((time, dummy) => {
      this.synths['crash'].triggerAttackRelease('2n', time);
    }, [
      ['0:0:0', 'sweep']
    ]).start(0);
    this.parts['t4_1'].loop = true;
    this.parts['t4_1'].loopEnd = '1m'; 
    this.parts['t4_1'].mute = true;

    // --- STEP SEQUENCER ---
    this.customSeq = new Tone.Sequence(
      (time, col: number) => {
        const matrix = useDJStore.getState().seqMatrix;
        const isActive = useDJStore.getState().isSeqActive;

        if (isActive) {
          if (matrix[0][col]) this.synths['kick'].triggerAttackRelease('C1', '8n', time);
          if (matrix[1][col]) this.synths['clap'].triggerAttack(time);
          if (matrix[2][col]) this.synths['hat'].triggerAttackRelease('32n', time);
          if (matrix[3][col]) this.synths['bass'].triggerAttackRelease('C2', '16n', time);
        }

        Tone.Draw.schedule(() => {
          useDJStore.getState().setSeqCurrentStep(col);
        }, time);
      },
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      '16n'
    );
    this.customSeq.start(0);
  }
}

export const audioManager = new AudioManager();
