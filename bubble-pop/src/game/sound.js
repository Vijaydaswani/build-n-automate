export class SoundEngine {
  constructor() {
    this.context = null;
    this.muted = localStorage.getItem("dbp-muted") === "true";
  }

  setMuted(muted) {
    this.muted = muted;
    localStorage.setItem("dbp-muted", String(muted));
  }

  ensure() {
    if (this.context || this.muted) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) this.context = new AudioContext();
  }

  tone(frequency, duration, gain = 0.04, type = "sine", delay = 0) {
    if (this.muted) return;
    this.ensure();
    if (!this.context) return;
    const now = this.context.currentTime + delay;
    const osc = this.context.createOscillator();
    const amp = this.context.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);
    amp.gain.setValueAtTime(0.0001, now);
    amp.gain.exponentialRampToValueAtTime(gain, now + 0.012);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(amp);
    amp.connect(this.context.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  correct(combo = 1) {
    this.tone(560 + Math.min(combo, 40) * 8, 0.09, 0.035, "triangle");
    if (combo > 1 && combo % 10 === 0) this.tone(880, 0.12, 0.03, "sine", 0.055);
  }

  wrong() {
    this.tone(128, 0.14, 0.05, "sawtooth");
  }

  miss() {
    this.tone(220, 0.08, 0.025, "square");
  }

  complete() {
    this.tone(620, 0.12, 0.04, "triangle");
    this.tone(830, 0.14, 0.035, "triangle", 0.09);
    this.tone(1046, 0.18, 0.03, "triangle", 0.19);
  }

  targetSwitch() {
    this.tone(420, 0.08, 0.025, "sine");
    this.tone(720, 0.1, 0.025, "sine", 0.08);
  }
}
