// Web Audio API & Vibration manager for Emergency Danger Alarms (صفارة الإنذار والهزاز)

class EmergencyAlarmManager {
  private audioCtx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isAlarmPlaying = false;
  private sirenInterval: any = null;
  private vibrationInterval: any = null;

  public startAlarm() {
    if (this.isAlarmPlaying) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      this.audioCtx = new AudioContextClass();
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.oscillator = this.audioCtx.createOscillator();
      this.gainNode = this.audioCtx.createGain();

      // Sawtooth wave gives a rich, piercing emergency siren sound
      this.oscillator.type = 'sawtooth';
      
      // Volume level
      this.gainNode.gain.setValueAtTime(0.35, this.audioCtx.currentTime);

      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      this.oscillator.start();
      this.isAlarmPlaying = true;

      // Two-tone high-pitch emergency siren alternating frequency (700Hz <-> 950Hz)
      let highFrequency = true;
      this.sirenInterval = setInterval(() => {
        if (!this.audioCtx || !this.oscillator) return;
        const now = this.audioCtx.currentTime;
        if (highFrequency) {
          this.oscillator.frequency.exponentialRampToValueAtTime(950, now + 0.15);
        } else {
          this.oscillator.frequency.exponentialRampToValueAtTime(650, now + 0.15);
        }
        highFrequency = !highFrequency;
      }, 350);

      // Mobile Device Vibration Trigger (الهزاز)
      this.triggerVibrationPattern();
      this.vibrationInterval = setInterval(() => {
        this.triggerVibrationPattern();
      }, 2500);

    } catch (err) {
      console.warn('AudioContext or Vibration prevented by browser policy:', err);
    }
  }

  public triggerVibrationPattern() {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        // Strong emergency rhythm vibration pattern [vibrate, pause, vibrate, pause...]
        navigator.vibrate([800, 200, 800, 200, 1000, 300]);
      } catch (e) {
        console.warn('Vibration API not allowed:', e);
      }
    }
  }

  public stopAlarm() {
    this.isAlarmPlaying = false;

    if (this.sirenInterval) {
      clearInterval(this.sirenInterval);
      this.sirenInterval = null;
    }

    if (this.vibrationInterval) {
      clearInterval(this.vibrationInterval);
      this.vibrationInterval = null;
    }

    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(0); // Cancel ongoing vibrations
      } catch (e) {}
    }

    if (this.oscillator) {
      try {
        this.oscillator.stop();
        this.oscillator.disconnect();
      } catch (e) {}
      this.oscillator = null;
    }

    if (this.audioCtx) {
      try {
        this.audioCtx.close();
      } catch (e) {}
      this.audioCtx = null;
    }
  }

  public isPlaying(): boolean {
    return this.isAlarmPlaying;
  }
}

export const emergencyAlarm = new EmergencyAlarmManager();
