// Sound Effects Utility
class SoundEffects {
  private audioContext: AudioContext | null = null;
  private volume: number = 0.3;
  private isMuted: boolean = false;

  constructor() {
    // Initialize AudioContext on first user interaction
    this.initializeAudioContext();
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  private async ensureAudioContext() {
    if (!this.audioContext) {
      this.initializeAudioContext();
    }

    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.warn('Failed to resume audio context:', error);
      }
    }
  }

  private createSoftTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.audioContext || this.isMuted) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    // Create a softer sound chain with filtering
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;

    // Add low-pass filter for softer sound
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(frequency * 2, this.audioContext.currentTime);
    filter.Q.setValueAtTime(1, this.audioContext.currentTime);

    // Create gentle envelope for smooth, non-jarring sound
    const attackTime = 0.05;
    const releaseTime = duration * 0.7;

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + attackTime);
    gainNode.gain.linearRampToValueAtTime(this.volume * 0.2, this.audioContext.currentTime + duration * 0.3);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  private createSoftNoise(duration: number, filterFreq: number = 800) {
    if (!this.audioContext || this.isMuted) return;

    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate softer pink noise instead of harsh white noise
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const source = this.audioContext.createBufferSource();
    const filter = this.audioContext.createBiquadFilter();
    const gainNode = this.audioContext.createGain();

    source.buffer = buffer;
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, this.audioContext.currentTime);
    filter.Q.setValueAtTime(0.5, this.audioContext.currentTime);

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Much gentler volume envelope
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.volume * 0.15, this.audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    source.start(this.audioContext.currentTime);
  }

  // Sound effect methods - all using softer tones
  async playPixelPaint() {
    await this.ensureAudioContext();
    // Soft, pleasant click sound
    this.createSoftTone(440, 0.2, 'sine'); // A note
  }

  async playPixelErase() {
    await this.ensureAudioContext();
    // Gentle descending tone
    this.createSoftTone(330, 0.25, 'sine'); // E note
  }

  async playColorSelect() {
    await this.ensureAudioContext();
    // Warm, inviting tone
    this.createSoftTone(523, 0.15, 'sine'); // C note
  }

  async playGridSizeChange() {
    await this.ensureAudioContext();
    // Gentle ascending chord
    this.createSoftTone(392, 0.3, 'sine'); // G
    setTimeout(() => this.createSoftTone(494, 0.3, 'sine'), 150); // B
  }

  async playClear() {
    await this.ensureAudioContext();
    // Soft whoosh sound instead of harsh noise
    this.createSoftNoise(0.4, 800);
  }

  async playExport() {
    await this.ensureAudioContext();
    // Gentle success melody
    this.createSoftTone(523, 0.2, 'sine'); // C
    setTimeout(() => this.createSoftTone(659, 0.2, 'sine'), 200); // E
    setTimeout(() => this.createSoftTone(784, 0.3, 'sine'), 400); // G
  }

  async playRandomGenerate() {
    await this.ensureAudioContext();
    // Gentle magical sparkle
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        const freq = 523 + (i * 110); // C, D, E, F# progression
        this.createSoftTone(freq, 0.2, 'sine');
      }, i * 100);
    }
  }

  async playHover() {
    await this.ensureAudioContext();
    // Very subtle hover sound
    this.createSoftTone(880, 0.1, 'sine');
  }

  async playClick() {
    await this.ensureAudioContext();
    // Soft click
    this.createSoftTone(660, 0.12, 'sine');
  }

  // Volume and mute controls
  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  getVolume(): number {
    return this.volume;
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  isSoundMuted(): boolean {
    return this.isMuted;
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

// Create singleton instance
export const soundEffects = new SoundEffects();

// Convenience functions
export const playPixelPaint = () => soundEffects.playPixelPaint();
export const playPixelErase = () => soundEffects.playPixelErase();
export const playColorSelect = () => soundEffects.playColorSelect();
export const playGridSizeChange = () => soundEffects.playGridSizeChange();
export const playClear = () => soundEffects.playClear();
export const playExport = () => soundEffects.playExport();
export const playRandomGenerate = () => soundEffects.playRandomGenerate();
export const playHover = () => soundEffects.playHover();
export const playClick = () => soundEffects.playClick();
