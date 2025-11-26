/**
 * 情绪化与羞辱模块
 * 让计算器变得刻薄和情绪化
 */

let clickCount = 0;
let lastClickTime = 0;
let equalPressCount = 0;
let isOnStrike = false;
let strikeTimeout = null;

/**
 * 检查低智商嘲讽
 * @param {string} previousInput - 上一个输入
 * @param {string} currentInput - 当前输入
 * @param {string} operator - 运算符
 * @param {HTMLElement} display - 显示元素
 * @returns {boolean} 是否触发了嘲讽
 */
export function checkLowIQMockery(previousInput, currentInput, operator, display) {
    // 检查 1 + 1
    if (previousInput === '1' && currentInput === '1' && operator === '+') {
        showMockery(display, "这种题也要动用我的 GPU？你还是用手指头数吧。");
        return true;
    }
    
    // 检查 0 ÷ 0
    if (previousInput === '0' && currentInput === '0' && operator === '÷') {
        showMockery(display, "0除以0？你是想让我崩溃吗？连小学生都知道这不行！");
        return true;
    }
    
    // 检查 2 + 2
    if (previousInput === '2' && currentInput === '2' && operator === '+') {
        showMockery(display, "2+2？你真的需要计算器来算这个？");
        return true;
    }
    
    return false;
}

/**
 * 显示嘲讽消息
 */
function showMockery(display, message) {
    display.innerText = message;
    display.classList.add('text-xl', 'text-red-400', 'font-bold');
    display.style.fontFamily = "'JetBrains Mono', monospace";
    
    setTimeout(() => {
        display.classList.remove('text-xl', 'text-red-400', 'font-bold');
    }, 3000);
}

/**
 * 检查按键疼痛（快速点击）
 * @param {HTMLElement} body - body元素
 * @param {HTMLElement} display - 显示元素
 */
export function checkButtonPain(body, display) {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTime;
    
    if (timeSinceLastClick < 200) { // 200ms内连续点击
        clickCount++;
        if (clickCount >= 3) {
            triggerButtonPain(body, display);
            clickCount = 0;
        }
    } else {
        clickCount = 0;
    }
    
    lastClickTime = now;
}

/**
 * 触发按键疼痛效果
 */
function triggerButtonPain(body, display) {
    body.style.backgroundColor = '#8b0000';
    body.style.transition = 'background-color 0.3s ease';
    
    display.innerText = "轻点！我不是你的解压玩具！";
    display.classList.add('text-2xl', 'text-white', 'font-bold');
    
    setTimeout(() => {
        body.style.backgroundColor = '#121212';
        display.classList.remove('text-2xl', 'text-white', 'font-bold');
    }, 2000);
}

/**
 * 检查罢工状态
 * @param {HTMLElement} equalBtn - 等号按钮
 * @param {HTMLElement} display - 显示元素
 * @returns {boolean} 是否在罢工
 */
export function checkStrike(equalBtn, display) {
    if (isOnStrike) {
        display.innerText = "我累了，午休中...";
        display.classList.add('text-xl', 'text-gray-400', 'italic');
        return true;
    }
    
    equalPressCount++;
    
    // 每5次按等号后罢工
    if (equalPressCount >= 5) {
        triggerStrike(equalBtn, display);
        equalPressCount = 0;
        return true;
    }
    
    return false;
}

/**
 * 触发罢工
 */
function triggerStrike(equalBtn, display) {
    isOnStrike = true;
    equalBtn.disabled = true;
    equalBtn.style.opacity = '0.5';
    equalBtn.style.cursor = 'not-allowed';
    
    display.innerText = "我累了，午休 10 分钟。";
    display.classList.add('text-xl', 'text-gray-500', 'italic');
    
    // 10分钟后恢复（实际是10秒，方便测试）
    strikeTimeout = setTimeout(() => {
        isOnStrike = false;
        equalBtn.disabled = false;
        equalBtn.style.opacity = '1';
        equalBtn.style.cursor = 'pointer';
        display.classList.remove('text-xl', 'text-gray-500', 'italic');
        display.innerText = "我回来了，继续工作...";
        
        setTimeout(() => {
            if (display.innerText === "我回来了，继续工作...") {
                display.innerText = '0';
            }
        }, 2000);
    }, 10000); // 10秒（实际应该是10分钟，但为了演示改为10秒）
}

/**
 * 重置罢工状态
 */
export function resetStrike() {
    if (strikeTimeout) {
        clearTimeout(strikeTimeout);
        strikeTimeout = null;
    }
    isOnStrike = false;
    equalPressCount = 0;
    clickCount = 0;
}

