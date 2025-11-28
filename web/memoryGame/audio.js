// 音效系统 - 使用 Web Audio API 生成音效

class AudioManager {
  constructor() {
    this.audioContext = null;
    this.init();
  }

  init() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  // 确保音频上下文已激活（浏览器需要用户交互）
  ensureContext() {
    if (!this.audioContext) {
      this.init();
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  // 生成音调
  playTone(frequency, duration, type = 'sine', volume = 0.3) {
    if (!this.audioContext) return;

    this.ensureContext();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // 播放和弦
  playChord(frequencies, duration, type = 'sine', volume = 0.2) {
    if (!this.audioContext) return;

    this.ensureContext();

    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, duration * 0.8, type, volume / frequencies.length);
      }, index * 30);
    });
  }

  // 开始游戏音效 - 上升音阶
  playStartSound() {
    if (!this.audioContext) return;
    this.ensureContext();
    
    const notes = [523.25, 659.25, 783.99, 987.77]; // C5, E5, G5, B5
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.15, 'sine', 0.25);
      }, i * 80);
    });
  }

  // 正确选择音效 - 根据反应时间调整音调
  playCorrectSound(reactionTime = null) {
    if (!this.audioContext) return;
    this.ensureContext();

    // 根据反应时间调整音调：越快音调越高
    let baseFreq = 440; // A4
    if (reactionTime) {
      if (reactionTime < 1000) {
        // 神速 - 高音
        baseFreq = 659.25; // E5
      } else if (reactionTime < 1800) {
        // 完美 - 中高音
        baseFreq = 523.25; // C5
      } else {
        // 不错 - 标准音
        baseFreq = 440; // A4
      }
    }

    // 播放成功和弦
    this.playChord([baseFreq, baseFreq * 1.25, baseFreq * 1.5], 0.3, 'sine', 0.3);
  }

  // 错误选择音效 - 低沉的错误音
  playWrongSound() {
    if (!this.audioContext) return;
    this.ensureContext();

    // 下降的低音
    const frequencies = [220, 196, 174.61]; // A3, G3, F3
    frequencies.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.2, 'sawtooth', 0.25);
      }, i * 100);
    });
  }

  // 卡片隐藏音效 - 短促提示音
  playHideSound() {
    if (!this.audioContext) return;
    this.ensureContext();

    this.playTone(330, 0.1, 'square', 0.15);
  }

  // 游戏结束音效 - 下降音阶
  playGameOverSound() {
    if (!this.audioContext) return;
    this.ensureContext();

    const notes = [523.25, 440, 349.23, 261.63]; // C5, A4, F4, C4
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.2, 'sine', 0.2);
      }, i * 120);
    });
  }

  // 按钮点击音效 - 短促的点击声
  playClickSound() {
    if (!this.audioContext) return;
    this.ensureContext();

    this.playTone(800, 0.05, 'square', 0.1);
  }

  // 等级提升音效 - 上升音阶
  playLevelUpSound() {
    if (!this.audioContext) return;
    this.ensureContext();

    const notes = [440, 523.25, 659.25, 783.99, 987.77]; // A4, C5, E5, G5, B5
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.12, 'sine', 0.2);
      }, i * 60);
    });
  }

  // 卡片翻转音效
  playCardFlipSound() {
    if (!this.audioContext) return;
    this.ensureContext();

    // 快速上升的音调
    const startFreq = 200;
    const endFreq = 400;
    const duration = 0.1;
    const steps = 5;

    for (let i = 0; i < steps; i++) {
      const freq = startFreq + (endFreq - startFreq) * (i / steps);
      setTimeout(() => {
        this.playTone(freq, duration / steps, 'sine', 0.15);
      }, i * (duration / steps) * 1000);
    }
  }
}

// 创建单例
const audioManager = new AudioManager();

export default audioManager;

