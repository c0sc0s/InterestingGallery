/**
 * 物理入侵模块
 * 让计算器看起来像是要突破屏幕
 */

// 屏幕裂纹冷却时间
let lastCrackTime = 0;
const CRACK_COOLDOWN = 15000; // 15秒冷却

/**
 * 检查是否需要显示屏幕裂纹
 * @param {string} previousInput - 上一个输入
 * @param {string} currentInput - 当前输入
 * @param {string} operator - 运算符
 * @param {HTMLElement} body - body元素
 */
export function checkScreenCrack(previousInput, currentInput, operator, body) {
    // 检查冷却时间
    const now = Date.now();
    if (now - lastCrackTime < CRACK_COOLDOWN) return;
    
    // 检查大数字
    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(curr)) return;
    
    // 如果数字太大，显示裂纹（降低触发条件）
    if (prev > 99999 || curr > 99999 || (operator === '×' && prev * curr > 9999999)) {
        showScreenCrack(body);
        lastCrackTime = now;
    }
}

/**
 * 显示屏幕裂纹
 */
function showScreenCrack(body) {
    const crack = document.createElement('div');
    crack.id = 'screen-crack';
    crack.className = 'screen-crack';
    crack.innerHTML = `
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <path d="M 50 50 L 200 150 L 300 80 L 500 200 L 700 100 L 800 300" 
                  stroke="#fff" stroke-width="3" fill="none" opacity="0.8"/>
            <path d="M 100 200 L 400 250 L 600 180 L 900 350" 
                  stroke="#fff" stroke-width="2" fill="none" opacity="0.6"/>
            <path d="M 200 100 L 500 150 L 750 120" 
                  stroke="#fff" stroke-width="2" fill="none" opacity="0.7"/>
        </svg>
    `;
    
    body.appendChild(crack);
    
    // 3秒后移除
    setTimeout(() => {
        crack.remove();
    }, 3000);
}

/**
 * 创建蚂蚁爬行效果
 * @param {HTMLElement} body - body元素
 */
export function createAnt(body) {
    // 10%概率出现蚂蚁
    if (Math.random() < 0.1) {
        const ant = document.createElement('div');
        ant.className = 'pixel-ant';
        ant.innerHTML = '🐜';
        ant.style.position = 'fixed';
        ant.style.left = '-50px';
        ant.style.top = Math.random() * window.innerHeight + 'px';
        ant.style.fontSize = '20px';
        ant.style.zIndex = '99998';
        ant.style.cursor = 'pointer';
        ant.style.transition = 'left 3s linear';
        
        body.appendChild(ant);
        
        // 开始爬行
        setTimeout(() => {
            ant.style.left = window.innerWidth + 'px';
        }, 10);
        
        // 点击蚂蚁
        ant.addEventListener('click', () => {
            squashAnt(ant);
        });
        
        // 3秒后自动移除
        setTimeout(() => {
            if (ant.parentElement) {
                ant.remove();
            }
        }, 3000);
    }
}

/**
 * 压扁蚂蚁
 */
function squashAnt(ant) {
    ant.style.transition = 'transform 0.2s ease';
    ant.style.transform = 'scaleY(0.1)';
    ant.innerHTML = '💀';
    
    // 留下污渍
    const stain = document.createElement('div');
    stain.className = 'ant-stain';
    stain.style.position = 'fixed';
    stain.style.left = ant.style.left;
    stain.style.top = ant.style.top;
    stain.style.width = '30px';
    stain.style.height = '30px';
    stain.style.backgroundColor = 'rgba(139, 69, 19, 0.6)';
    stain.style.borderRadius = '50%';
    stain.style.zIndex = '99997';
    stain.style.pointerEvents = 'none';
    
    ant.parentElement.appendChild(stain);
    
    setTimeout(() => {
        ant.remove();
    }, 200);
}

/**
 * 触发按钮融化效果
 * @param {NodeList} buttons - 按钮列表
 */
export function triggerMelting(buttons) {
    // 5%概率触发
    if (Math.random() < 0.05) {
        buttons.forEach(btn => {
            if (btn.id === 'btn-equal') return; // 等号不融化
            
            btn.classList.add('melting');
            const randomDelay = Math.random() * 2;
            btn.style.animationDelay = randomDelay + 's';
        });
        
        // 5秒后恢复
        setTimeout(() => {
            buttons.forEach(btn => {
                btn.classList.remove('melting');
                btn.style.animationDelay = '';
            });
        }, 5000);
    }
}

