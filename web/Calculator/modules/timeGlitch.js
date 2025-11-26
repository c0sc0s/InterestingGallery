/**
 * 时空错乱模块
 * 打破视觉的连续性
 */

let isDegraded = false;

/**
 * 检查是否需要退化（Windows 95风格）
 * @param {HTMLElement} calculator - 计算器元素
 * @param {HTMLElement} body - body元素
 */
export function checkDegradation(calculator, body) {
    // 降低到3%概率触发退化
    if (Math.random() < 0.03 && !isDegraded) {
        triggerDegradation(calculator, body);
    }
}

/**
 * 触发UI退化
 */
function triggerDegradation(calculator, body) {
    isDegraded = true;
    calculator.classList.add('windows95-style');
    body.style.backgroundColor = '#c0c0c0';
    
    // 或者显示算盘图片
    if (Math.random() < 0.5) {
        showAbacus(calculator);
    }
    
    // 5秒后恢复
    setTimeout(() => {
        calculator.classList.remove('windows95-style');
        body.style.backgroundColor = '#121212';
        const abacus = document.getElementById('abacus-overlay');
        if (abacus) abacus.remove();
        isDegraded = false;
    }, 5000);
}

/**
 * 显示算盘图片
 */
function showAbacus(calculator) {
    const abacus = document.createElement('div');
    abacus.id = 'abacus-overlay';
    abacus.className = 'abacus-overlay';
    abacus.innerHTML = `
        <div class="abacus-content">
            <div style="font-size: 60px; text-align: center; line-height: 1.2;">
                🧮<br>
                <span style="font-size: 20px; color: #666;">算盘模式</span>
            </div>
        </div>
    `;
    calculator.appendChild(abacus);
}

/**
 * 生成预言答案
 * @returns {string|null} 预言文本，如果没有则返回null
 */
export function generateProphecy() {
    // 降低到8%概率生成预言
    if (Math.random() < 0.08) {
        const prophecies = [
            "你会在 3 分钟后感到口渴。",
            "小心那把椅子。",
            "明天你会遇到一个穿红色衣服的人。",
            "你的下一杯咖啡会洒出来。",
            "注意你左边的第三个人。",
            "你会在 5 秒后眨眼。",
            "小心台阶。",
            "你的手机电量会在 10 分钟后低于 20%。",
            "你会忘记一件重要的事。",
            "注意脚下的香蕉皮。"
        ];
        
        return prophecies[Math.floor(Math.random() * prophecies.length)];
    }
    
    return null;
}

