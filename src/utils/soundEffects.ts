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

  private createTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.audioContext || this.isMuted) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;

    // Create envelope for smooth sound
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  private createNoise(duration: number, filterFreq: number = 1000) {
    if (!this.audioContext || this.isMuted) return;

    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = this.audioContext.createBufferSource();
    const filter = this.audioContext.createBiquadFilter();
    const gainNode = this.audioContext.createGain();

    source.buffer = buffer;
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, this.audioContext.currentTime);

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    source.start(this.audioContext.currentTime);
  }

  // Sound effect methods
  async playPixelPaint() {
    await this.ensureAudioContext();
    this.createTone(800, 0.1, 'square');
  }

  async playPixelErase() {
    await this.ensureAudioContext();
    this.createTone(400, 0.15, 'sawtooth');
  }

  async playColorSelect() {
    await this.ensureAudioContext();
    this.createTone(600, 0.08, 'sine');
  }

  async playGridSizeChange() {
    await this.ensureAudioContext();
    this.createTone(500, 0.2, 'triangle');
    setTimeout(() => this.createTone(700, 0.2, 'triangle'), 100);
  }

  async playClear() {
    await this.ensureAudioContext();
    this.createNoise(0.3, 2000);
  }

  async playExport() {
    await this.ensureAudioContext();
    // Success sound - ascending tones
    this.createTone(523, 0.15, 'sine'); // C
    setTimeout(() => this.createTone(659, 0.15, 'sine'), 150); // E
    setTimeout(() => this.createTone(784, 0.2, 'sine'), 300); // G
  }

  async playRandomGenerate() {
    await this.ensureAudioContext();
    // Sparkly sound effect
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const freq = 800 + Math.random() * 400;
        this.createTone(freq, 0.1, 'sine');
      }, i * 50);
    }
  }

  async playHover() {
    await this.ensureAudioContext();
    this.createTone(1000, 0.05, 'sine');
  }

  async playClick() {
    await this.ensureAudioContext();
    this.createTone(1200, 0.05, 'square');
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
