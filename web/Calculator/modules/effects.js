/**
 * 视觉特效模块
 * 管理所有混沌视觉特效
 */

/**
 * 蓝屏死机错误代码库
 */
const bsodErrorCodes = [
    "ERROR_CODE: 0xDEADBEEF",
    "CRITICAL_FAILURE: 0xCAFEBABE",
    "SYSTEM_ERROR: 0xBADF00D",
    "FATAL_EXCEPTION: 0xFEEDFACE",
    "KERNEL_PANIC: 0xBAADF00D",
    "STACK_OVERFLOW: 0xDEADC0DE",
    "NULL_POINTER: 0x00000000",
    "DIVIDE_BY_ZERO: 0xINFINITY",
    "MEMORY_LEAK: 0xLEAKED",
    "RUNTIME_ERROR: 0xRUNTIME",
    "LOGIC_ERROR: 0xLOGICAL",
    "TYPE_ERROR: 0xTYPEMISMATCH",
    "REFERENCE_ERROR: 0xUNDEFINED",
    "SYNTAX_ERROR: 0xSYNTAX",
    "RANGE_ERROR: 0xOUTOFRANGE"
];

const bsodMessages = [
    "你的问题没有意义。",
    "系统无法处理这个计算。",
    "数学已停止工作。",
    "计算器遇到了一个它不知道如何处理的错误。",
    "请尝试关闭并重新打开现实。",
    "如果问题持续存在，请考虑放弃。",
    "错误：无法找到答案。",
    "系统资源不足：缺少意义。",
    "致命错误：逻辑已崩溃。",
    "警告：继续使用可能导致存在主义危机。"
];

/**
 * 创建蓝屏死机效果
 */
function createBSOD(body) {
    // 移除现有的BSOD
    const existingBSOD = document.getElementById('bsod-overlay');
    if (existingBSOD) {
        existingBSOD.remove();
    }

    const bsod = document.createElement('div');
    bsod.id = 'bsod-overlay';
    bsod.className = 'bsod-overlay';
    
    const errorCode = bsodErrorCodes[Math.floor(Math.random() * bsodErrorCodes.length)];
    const message = bsodMessages[Math.floor(Math.random() * bsodMessages.length)];
    
    bsod.innerHTML = `
        <div class="bsod-content">
            <div class="bsod-title">:(</div>
            <div class="bsod-text">你的计算器遇到了一个问题，需要重启。</div>
            <div class="bsod-text">我们只是收集一些错误信息，然后会为你重启。</div>
            <div class="bsod-text">${message}</div>
            <div class="bsod-error-code">
                ${errorCode}<br>
                如果你第一次看到此错误屏幕，请重启计算器。<br>
                如果此屏幕再次出现，请遵循以下步骤：<br><br>
                检查是否有足够的虚无。<br>
                如果问题持续存在，请尝试接受现实：这个计算器是无用的。
            </div>
            <div class="bsod-progress">完成 0%</div>
        </div>
    `;
    
    body.appendChild(bsod);
    
    // 模拟进度条
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            setTimeout(() => {
                bsod.remove();
            }, 2000);
        }
        const progressEl = bsod.querySelector('.bsod-progress');
        if (progressEl) {
            progressEl.textContent = `完成 ${Math.floor(progress)}%`;
        }
    }, 200);
}

/**
 * 按键错乱效果 - 随机交换数字按钮位置
 */
function scrambleButtons(buttons) {
    // 只处理数字按钮（0-9）
    const numberButtons = Array.from(buttons).filter(btn => {
        const id = btn.id;
        return id && id.match(/^btn-[0-9]$/);
    });
    
    if (numberButtons.length < 2) return;
    
    // 保存原始位置
    const positions = numberButtons.map(btn => {
        const rect = btn.getBoundingClientRect();
        return {
            btn: btn,
            x: rect.left,
            y: rect.top
        };
    });
    
    // 随机打乱顺序
    const shuffled = [...positions].sort(() => Math.random() - 0.5);
    
    // 应用新位置
    numberButtons.forEach((btn, index) => {
        btn.classList.add('scrambled');
        const newPos = shuffled[index];
        const dx = newPos.x - positions[index].x;
        const dy = newPos.y - positions[index].y;
        
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    
    // 3秒后恢复
    setTimeout(() => {
        numberButtons.forEach(btn => {
            btn.style.transform = '';
            btn.classList.remove('scrambled');
        });
    }, 3000);
}

/**
 * 特效函数集合
 */
export const specialEffects = {
    glitch: (display) => {
        display.classList.add('glitch-text');
    },
    invert: (display, body) => {
        body.style.filter = 'invert(1)';
        body.style.backgroundColor = '#ddd';
    },
    shake: (display, calculator) => {
        calculator.classList.add('shake-hard');
    },
    dizzy: (display, calculator) => {
        calculator.classList.add('dizzy');
    },
    gravity: (display, calculator, buttons) => {
        // 让按钮掉落
        buttons.forEach(btn => {
            if (btn.id === 'equal-btn' || btn.id === 'btn-equal') return; // 等号坚挺
            const randomRotation = Math.random() * 360;
            const randomY = 200 + Math.random() * 500;
            const randomX = (Math.random() - 0.5) * 100;
            
            btn.style.transition = `transform ${0.5 + Math.random()}s cubic-bezier(0.5, 0, 0.5, 1)`;
            btn.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotation}deg)`;
            btn.classList.add('fallen');
        });
    },
    disco: (display, body) => {
        body.classList.add('disco-mode');
    },
    blur: (display, calculator) => {
        calculator.classList.add('blurred');
    },
    bsod: (display, calculator, body, buttons) => {
        createBSOD(body);
    },
    scramble: (display, calculator, body, buttons) => {
        scrambleButtons(buttons);
    }
};

/**
 * 触发随机特效
 * @param {HTMLElement} display - 显示元素
 * @param {HTMLElement} calculator - 计算器元素
 * @param {HTMLElement} body - body元素
 * @param {NodeList} buttons - 按钮列表
 * @param {Function} randomChoice - 随机选择函数
 * @returns {string|null} 触发的特效名称
 */
export function triggerRandomEffect(display, calculator, body, buttons, randomChoice) {
    // 清除旧效果
    resetEffects(display, calculator, body, buttons);

    // 35% 概率触发特效
    if (Math.random() > 0.35) return null;

    const effects = Object.keys(specialEffects);
    const selectedEffect = randomChoice(effects);
    
    console.log("Triggering effect:", selectedEffect);
    specialEffects[selectedEffect](display, calculator, body, buttons);
    
    return selectedEffect;
}

/**
 * 重置所有特效
 * @param {HTMLElement} display - 显示元素
 * @param {HTMLElement} calculator - 计算器元素
 * @param {HTMLElement} body - body元素
 * @param {NodeList} buttons - 按钮列表
 */
export function resetEffects(display, calculator, body, buttons) {
    // 移除类名
    display.classList.remove('glitch-text');
    calculator.classList.remove('shake-hard', 'dizzy', 'blurred');
    body.style.filter = '';
    body.style.backgroundColor = '#121212';
    body.classList.remove('disco-mode');
    
    // 移除BSOD
    const bsod = document.getElementById('bsod-overlay');
    if (bsod) {
        bsod.remove();
    }
    
    // 重置掉落的按钮和错乱的按钮
    buttons.forEach(btn => {
        btn.style.transform = '';
        btn.classList.remove('fallen', 'scrambled');
    });
}

/**
 * 初始化逃跑的等于号功能
 * @param {HTMLElement} equalBtn - 等于号按钮
 */
export function initRunawayButton(equalBtn) {
    if (!equalBtn) return;
    
    let isRunning = false;
    let runawayTimeout = null;
    
    equalBtn.addEventListener('mouseenter', () => {
        // 30% 概率触发逃跑
        if (Math.random() < 0.3 && !isRunning) {
            isRunning = true;
            equalBtn.classList.add('runaway-btn');
            
            // 获取按钮当前位置
            const rect = equalBtn.getBoundingClientRect();
            const container = equalBtn.closest('#calculator');
            const containerRect = container.getBoundingClientRect();
            
            // 计算可移动范围（在计算器内部）
            const maxX = containerRect.width - rect.width;
            const maxY = containerRect.height - rect.height;
            
            // 随机新位置
            const newX = Math.random() * maxX;
            const newY = Math.random() * maxY;
            
            // 计算相对位移
            const currentX = rect.left - containerRect.left;
            const currentY = rect.top - containerRect.top;
            const dx = newX - currentX;
            const dy = newY - currentY;
            
            // 应用瞬移
            equalBtn.style.transform = `translate(${dx}px, ${dy}px)`;
            
            // 2秒后恢复
            runawayTimeout = setTimeout(() => {
                equalBtn.style.transform = '';
                equalBtn.classList.remove('runaway-btn');
                isRunning = false;
            }, 2000);
        }
    });
    
    // 点击时也恢复位置
    equalBtn.addEventListener('click', () => {
        if (isRunning && runawayTimeout) {
            clearTimeout(runawayTimeout);
            equalBtn.style.transform = '';
            equalBtn.classList.remove('runaway-btn');
            isRunning = false;
        }
    });
}

