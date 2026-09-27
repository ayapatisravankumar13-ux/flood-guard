/**
 * Web Audio API synthesizer for disaster warning sirens & telemetry chimes.
 * Does not require external audio files or network requests.
 */

let audioCtx: AudioContext | null = null;
let currentOsc: OscillatorNode | null = null;
let currentGain: GainNode | null = null;
let sirenInterval: NodeJS.Timeout | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a short, high-priority emergency confirmation chime
 */
export function playChimeTone(type: 'nominal' | 'warning' | 'critical' = 'warning') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'critical') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.3);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'warning') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.12); // A5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.28);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    }
  } catch {
    // Audio Context not permitted without user gesture; silently ignore
  }
}

/**
 * Starts or stops a 3-second emergency outdoor warning siren simulation
 */
export function playEmergencySiren(durationSeconds = 3.5, onComplete?: () => void) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    stopEmergencySiren();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.1, now);

    // Siren pitch modulation (oscillate between 450Hz and 950Hz)
    let isHigh = false;
    osc.frequency.setValueAtTime(500, now);

    sirenInterval = setInterval(() => {
      if (!ctx) return;
      const t = ctx.currentTime;
      isHigh = !isHigh;
      osc.frequency.linearRampToValueAtTime(isHigh ? 920 : 480, t + 0.4);
    }, 450);

    osc.start(now);
    currentOsc = osc;
    currentGain = gain;

    // Auto-stop after duration
    setTimeout(() => {
      stopEmergencySiren();
      if (onComplete) onComplete();
    }, durationSeconds * 1000);
  } catch {
    // Ignore audio permission errors
  }
}

export function stopEmergencySiren() {
  if (sirenInterval) {
    clearInterval(sirenInterval);
    sirenInterval = null;
  }
  if (currentGain && audioCtx) {
    try {
      currentGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
    } catch {
      // Ignore
    }
  }
  if (currentOsc) {
    try {
      currentOsc.stop();
      currentOsc.disconnect();
    } catch {
      // Ignore
    }
    currentOsc = null;
  }
}
