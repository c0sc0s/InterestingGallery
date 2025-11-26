/**
 * 闹鬼模式模块
 * 最诡异的玩法
 */

let idleTimer = null;
let isGhostTyping = false;
let ghostTypingTimeout = null;

/**
 * 初始化闹鬼模式
 * @param {Object} calc - 计算器实例
 */
export function initGhostMode(calc) {
    let lastActivity = Date.now();
    
    // 监听所有活动
    const activityEvents = ['click', 'keydown', 'mousemove', 'touchstart'];
    activityEvents.forEach(event => {
        document.addEventListener(event, () => {
            lastActivity = Date.now();
            resetGhostMode();
        });
    });
    
    // 每5秒检查一次
    setInterval(() => {
        const idleTime = Date.now() - lastActivity;
        if (idleTime > 5000 && !isGhostTyping) {
            triggerGhostTyping(calc);
        }
    }, 1000);
}

/**
 * 触发鬼魂自动输入
 */
function triggerGhostTyping(calc) {
    if (isGhostTyping) return;
    
    isGhostTyping = true;
    const messages = ['HELP', '666', 'ERROR', 'NULL', 'DEAD', 'LOST'];
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    let index = 0;
    const typeInterval = setInterval(() => {
        if (index < message.length) {
            calc.appendNumber(message[index]);
            index++;
        } else {
            clearInterval(typeInterval);
            setTimeout(() => {
                isGhostTyping = false;
                calc.clearDisplay();
            }, 2000);
        }
    }, 500);
}

/**
 * 重置闹鬼模式
 */
function resetGhostMode() {
    if (ghostTypingTimeout) {
        clearTimeout(ghostTypingTimeout);
        ghostTypingTimeout = null;
    }
    isGhostTyping = false;
}

/**
 * 篡改历史记录
 * @param {string} previousInput - 原始上一个输入
 * @param {string} currentInput - 原始当前输入
 * @param {string} operator - 原始运算符
 * @param {HTMLElement} history - 历史显示元素
 * @returns {boolean} 是否被篡改
 */
export function tamperHistory(previousInput, currentInput, operator, history) {
    // 20%概率篡改
    if (Math.random() < 0.2) {
        const fakeHistories = [
            "我 + 孤独 = ?",
            "虚无 × 时间 = 永恒",
            "悲伤 ÷ 快乐 = 矛盾",
            "昨天 + 明天 = 今天？",
            "你 + 我 = 我们？",
            "现实 - 梦想 = 痛苦",
            "希望 × 失望 = 绝望",
            "过去 ÷ 未来 = 现在？",
            "爱 + 恨 = 复杂",
            "存在 - 意义 = ?"
        ];
        
        const fakeHistory = fakeHistories[Math.floor(Math.random() * fakeHistories.length)];
        history.innerText = fakeHistory;
        return true;
    }
    
    return false;
}

