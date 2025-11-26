/**
 * 主计算器逻辑模块
 * 处理所有计算器核心功能
 */

import { randomChoice } from './utils.js';
import { playButtonSound, playCalculateSound, playTone } from './audio.js';
import { createFullscreenFireworks } from './particles.js';
import { checkEasterEggs } from './easterEggs.js';
import { getRandomAnswer } from './templates.js';
import { triggerRandomEffect, resetEffects } from './effects.js';
import { vocab } from './vocab.js';
import { checkLowIQMockery, checkButtonPain, checkStrike, resetStrike } from './emotionalDamage.js';
import { checkNumberSubscription, checkVIPAnswer, resetPaywall } from './fakePaywall.js';
import { checkDegradation, generateProphecy } from './timeGlitch.js';
import { checkScreenCrack, createAnt, triggerMelting } from './physicalIntrusion.js';
import { initGhostMode, tamperHistory } from './ghostMode.js';

/**
 * 计算器类
 */
export class Calculator {
    constructor(display, history, calculator, body, buttons) {
        this.display = display;
        this.history = history;
        this.calculator = calculator;
        this.body = body;
        this.buttons = buttons;
        
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = null;
        this.isShowingAnswer = false;
        this.calculationCount = 0;
        this.isTyping = false;
        this.typingTimeout = null;
        
        this.init();
    }
    
    /**
     * 初始化计算器
     */
    init() {
        // 为所有按钮添加音效和疼痛检测
        this.buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                playButtonSound();
                checkButtonPain(this.body, this.display);
            });
        });
        
        // 键盘事件监听
        document.addEventListener('keydown', (event) => {
            this.handleKeydown(event);
        });
        
        // 初始化闹鬼模式
        initGhostMode(this);
        
        // 定期创建蚂蚁（降低频率到每60秒检查一次）
        setInterval(() => {
            createAnt(this.body);
        }, 60000);
    }
    
    /**
     * 处理键盘输入
     */
    handleKeydown(event) {
        const key = event.key;
        if (/[0-9]/.test(key)) this.appendNumber(key);
        if (key === '.') this.appendNumber('.');
        if (key === '+' || key === '-') this.appendOperator(key);
        if (key === '*') this.appendOperator('×');
        if (key === '/') this.appendOperator('÷');
        if (key === 'Enter' || key === '=') this.calculateUselessly();
        if (key === 'Backspace' || key === 'Escape') this.clearDisplay();
    }
    
    /**
     * 更新显示
     */
    updateDisplay() {
        if (this.isShowingAnswer) return;
        let displayValue = this.currentInput;
        if (displayValue.length > 9) {
            this.display.style.fontSize = '2rem';
        } else {
            this.display.style.fontSize = '3rem';
        }
        this.display.innerText = displayValue;
        this.display.setAttribute('data-text', displayValue);
        
        this.display.classList.remove('answer-font', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-6xl', 'text-8xl', 'italic', 'text-orange-400');
        this.display.classList.add('text-5xl', 'font-light');
        this.history.style.opacity = '1';
    }
    
    /**
     * 添加数字
     */
    appendNumber(number) {
        // 检查数字订阅限制
        if (number !== '.' && checkNumberSubscription(number, this.body)) {
            return; // 被付费墙阻止
        }
        
        if (this.isShowingAnswer) {
            this.clearDisplay();
        }
        if (this.isTyping) {
            clearTimeout(this.typingTimeout);
            this.isTyping = false;
        }
        if (this.currentInput === '0' && number !== '.') {
            this.currentInput = number;
        } else {
            if (number === '.' && this.currentInput.includes('.')) return;
            this.currentInput += number;
        }
        this.updateDisplay();
    }
    
    /**
     * 添加运算符
     */
    appendOperator(op) {
        if (this.isShowingAnswer) {
            this.isShowingAnswer = false;
            this.currentInput = '0';
            resetEffects(this.display, this.calculator, this.body, this.buttons);
        }
        if (this.isTyping) {
            clearTimeout(this.typingTimeout);
            this.isTyping = false;
        }
        if (this.currentInput === '') return;
        
        // 检查低智商嘲讽
        if (checkLowIQMockery(this.previousInput, this.currentInput, op, this.display)) {
            return;
        }
        
        this.operator = op;
        this.previousInput = this.currentInput;
        this.currentInput = '0';
        
        // 检查历史记录篡改
        if (!tamperHistory(this.previousInput, this.currentInput, this.operator, this.history)) {
            this.history.innerText = `${this.previousInput} ${this.operator}`;
        }
        
        this.updateDisplay();
        
        // 检查UI退化
        checkDegradation(this.calculator, this.body);
        
        // 检查屏幕裂纹
        checkScreenCrack(this.previousInput, this.currentInput, this.operator, this.body);
    }
    
    /**
     * 添加符号（% 或 +/-）
     */
    appendSymbol(type) {
        if (this.isShowingAnswer) this.clearDisplay();
        if (this.isTyping) {
            clearTimeout(this.typingTimeout);
            this.isTyping = false;
        }
        if (type === '%') {
            this.currentInput = (parseFloat(this.currentInput) / 100).toString();
        } else if (type === '±') {
            this.currentInput = (parseFloat(this.currentInput) * -1).toString();
        }
        this.updateDisplay();
    }
    
    /**
     * 清空显示
     */
    clearDisplay() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = null;
        this.history.innerText = '';
        this.isShowingAnswer = false;
        
        // 停止打字机效果
        if (this.isTyping) {
            clearTimeout(this.typingTimeout);
            this.isTyping = false;
        }
        
        // 重置所有特效和状态
        resetEffects(this.display, this.calculator, this.body, this.buttons);
        resetStrike();
        resetPaywall();
        
        this.display.style.fontSize = '3rem';
        this.display.style.fontFamily = '';
        this.display.classList.remove('answer-font', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-6xl', 'text-8xl', 'italic', 'text-orange-400', 'fade-in-up', 'rainbow-text', 'glitch-text', 'text-red-500', 'text-yellow-400', 'text-green-400', 'text-purple-400');
        this.display.classList.add('text-5xl', 'font-light');
        this.updateDisplay();
    }
    
    /**
     * 打字机效果
     */
    typewriterEffect(text, callback) {
        if (this.isTyping) {
            clearTimeout(this.typingTimeout);
        }
        
        this.isTyping = true;
        this.display.innerText = '';
        this.display.setAttribute('data-text', text);
        
        let index = 0;
        const speed = 30 + Math.random() * 50;
        
        const type = () => {
            if (index < text.length) {
                this.display.innerText = text.substring(0, index + 1);
                index++;
                
                // 偶尔添加打字音效
                if (Math.random() < 0.1) {
                    playTone(100 + Math.random() * 50, 0.05, 'sine', 0.02);
                }
                
                this.typingTimeout = setTimeout(type, speed);
            } else {
                this.isTyping = false;
                if (callback) callback();
            }
        };
        
        type();
    }
    
    /**
     * 计算（生成随机答案）
     */
    calculateUselessly() {
        if (!this.operator && !this.previousInput && this.currentInput === '0') return;
        
        // 检查罢工状态
        const equalBtn = document.getElementById('btn-equal');
        if (checkStrike(equalBtn, this.display)) {
            return;
        }
        
        // 检查彩蛋
        if (checkEasterEggs(this.currentInput, this.calculationCount, this.display, this.body)) {
            this.calculationCount++;
            this.isShowingAnswer = true;
            playCalculateSound();
            return;
        }
        
        this.calculationCount++;
        
        // 检查预言
        const prophecy = generateProphecy();
        const result = prophecy || getRandomAnswer();
        this.isShowingAnswer = true;
        
        // 检查历史记录篡改
        if (!tamperHistory(this.previousInput, this.currentInput, this.operator, this.history)) {
            if (this.operator) {
                this.history.innerText = `${this.previousInput} ${this.operator} ${this.currentInput} =`;
            } else {
                this.history.innerText = `${this.currentInput} =`;
            }
        }

        this.display.classList.remove('text-5xl', 'font-light', 'rainbow-text', 'glitch-text');
        this.display.style.fontSize = '';
        this.display.style.fontFamily = '';

        let finalText = "";
        
        // 处理特殊对象类型 (如巨大 Emoji)
        if (typeof result === 'object' && result.type === 'emoji') {
            finalText = result.content;
            this.display.classList.add('text-8xl');
        } else {
            finalText = result;
            // 字号自适应
            if (finalText.length > 25) this.display.classList.add('text-lg');
            else if (finalText.length > 15) this.display.classList.add('text-xl');
            else if (finalText.length > 8) this.display.classList.add('text-2xl');
            else this.display.classList.add('text-3xl');
        }

        // 针对代码风格的特殊处理
        if (vocab.code.includes(finalText)) {
            this.display.style.fontFamily = "'JetBrains Mono', monospace";
        } else {
            this.display.classList.add('answer-font');
        }

        this.display.classList.add('italic', 'text-orange-400', 'fade-in-up');

        // 使用打字机效果显示答案
        this.typewriterEffect(finalText, () => {
            // 检查VIP答案限制
            if (checkVIPAnswer(this.display)) {
                // VIP限制已应用，不继续
                return;
            }
            
            // 打字完成后触发混沌特效（小幅度特效）
            triggerRandomEffect(this.display, this.calculator, this.body, this.buttons, randomChoice);
            playCalculateSound();
            
            // 降低全屏烟花概率到5%，且不与大幅度特效同时触发
            if (Math.random() < 0.05) {
                createFullscreenFireworks();
            }
            
            // 降低按钮融化概率到2%
            if (Math.random() < 0.02) {
                triggerMelting(this.buttons);
            }
        });
    }
}

