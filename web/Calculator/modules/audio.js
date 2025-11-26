/**
 * 音效系统模块
 * 使用 Web Audio API 生成各种音效
 */

let audioContext = null;

/**
 * 初始化音频上下文
 */
export function initAudio() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) {
    console.warn("Audio context not supported");
  }
}

/**
 * 播放音调
 * @param {number} frequency - 频率 (Hz)
 * @param {number} duration - 持续时间 (秒)
 * @param {string} type - 波形类型 ('sine', 'square', 'sawtooth', 'triangle')
 * @param {number} volume - 音量 (0-1)
 */
export function playTone(frequency, duration, type = "sine", volume = 0.1) {
  if (!audioContext) {
    initAudio();
  }

  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + duration
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (e) {
    // 静默失败，某些浏览器可能不支持
  }
}

/**
 * 播放按钮点击音效
 */
export function playButtonSound() {
  const frequencies = [200, 250, 300, 350, 400, 450, 500];
  const freq = frequencies[Math.floor(Math.random() * frequencies.length)];
  playTone(freq, 0.1, "sine", 0.05);
}

/**
 * 播放计算完成音效（上升音调）
 */
export function playCalculateSound() {
  const frequencies = [300, 400, 500, 600];
  frequencies.forEach((freq, i) => {
    setTimeout(() => {
      playTone(freq, 0.15, "sine", 0.08);
    }, i * 50);
  });
}

/**
 * 播放彩蛋音效（C大调和弦）
 */
export function playEasterEggSound() {
  const chord = [261.63, 329.63, 392.0]; // C大调
  chord.forEach((freq) => {
    playTone(freq, 0.3, "sine", 0.1);
  });
}
