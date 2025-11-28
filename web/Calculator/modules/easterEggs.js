/**
 * 彩蛋功能模块
 * 处理所有隐藏彩蛋的触发逻辑
 */

import { playEasterEggSound } from './audio.js';
import { createFireworks } from './particles.js';

/**
 * 彩蛋处理函数集合
 */
const easterEggHandlers = {
    '42': (display, body) => {
        display.innerText = '生命、宇宙以及一切终极问题的答案';
        display.classList.add('rainbow-text', 'text-2xl');
        playEasterEggSound();
        createFireworks(window.innerWidth / 2, window.innerHeight / 2);
        return true;
    },
    '404': (display) => {
        display.innerText = '404: 答案未找到';
        display.classList.add('glitch-text', 'text-3xl');
        playEasterEggSound();
        return true;
    },
    '666': (display, body) => {
        display.innerText = '恶魔的数字...但这里没有恶魔，只有混乱';
        display.classList.add('text-2xl', 'text-red-500');
        body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => { body.style.filter = ''; }, 2000);
        playEasterEggSound();
        return true;
    },
    '888': (display) => {
        display.innerText = '恭喜发财！但这里没有钱，只有虚无';
        display.classList.add('text-3xl', 'text-yellow-400');
        createFireworks(window.innerWidth / 2, window.innerHeight / 2);
        playEasterEggSound();
        return true;
    },
    '1337': (display) => {
        display.innerText = 'LEET! 但你仍然得不到正确答案';
        display.style.fontFamily = "'JetBrains Mono', monospace";
        display.classList.add('text-2xl', 'text-green-400');
        playEasterEggSound();
        return true;
    },
    '0': (display, body, calculationCount) => {
        if (calculationCount > 10) {
            display.innerText = '你计算了' + calculationCount + '次，但仍然一无所获';
            display.classList.add('text-xl');
            playEasterEggSound();
            return true;
        }
        return false;
    }
};

/**
 * 检查并触发彩蛋
 * @param {string} currentInput - 当前输入
 * @param {number} calculationCount - 计算次数
 * @param {HTMLElement} display - 显示元素
 * @param {HTMLElement} body - body元素
 * @returns {boolean} 是否触发了彩蛋
 */
export function checkEasterEggs(currentInput, calculationCount, display, body) {
    const input = parseFloat(currentInput);
    const inputStr = currentInput.replace('.', '');
    
    // 检查特定数字
    for (const [key, handler] of Object.entries(easterEggHandlers)) {
        if (inputStr === key || input === parseFloat(key)) {
            if (handler(display, body, calculationCount)) {
                return true;
            }
        }
    }
    
    // 检查连续计算次数
    if (calculationCount === 42) {
        display.innerText = '你已经计算了42次！这是巧合吗？';
        display.classList.add('rainbow-text', 'text-xl');
        playEasterEggSound();
        return true;
    }
    
    // 检查时间彩蛋（午夜模式）
    const hour = new Date().getHours();
    if (hour === 0 || hour === 23) {
        if (Math.random() < 0.1) {
            display.innerText = '深夜模式：一切都没有意义';
            display.classList.add('text-xl', 'text-purple-400');
            body.style.filter = 'brightness(0.7)';
            setTimeout(() => { body.style.filter = ''; }, 3000);
            return true;
        }
    }
    
    return false;
}




