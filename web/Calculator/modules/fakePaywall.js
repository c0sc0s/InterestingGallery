/**
 * 虚假资本主义模块
 * 模拟现代App的内购环节
 */

let usedNumbers = new Set();
let isVIP = false;

/**
 * 检查数字订阅限制
 * @param {string} number - 要输入的数字
 * @param {HTMLElement} body - body元素
 * @returns {boolean} 是否被阻止
 */
export function checkNumberSubscription(number, body) {
    if (isVIP) return false;
    
    // 每个数字每天只能用3次（简化：每次会话）
    if (usedNumbers.has(number) && usedNumbers.size >= 3) {
        showPaywall(number, body);
        return true;
    }
    
    usedNumbers.add(number);
    return false;
}

/**
 * 显示付费墙
 */
function showPaywall(number, body) {
    const modal = document.createElement('div');
    modal.id = 'paywall-modal';
    modal.className = 'paywall-modal';
    modal.innerHTML = `
        <div class="paywall-content">
            <div class="paywall-header">
                <h2>🔒 数字 ${number} 已锁定</h2>
                <button class="paywall-close" onclick="this.closest('.paywall-modal').remove()">×</button>
            </div>
            <div class="paywall-body">
                <p>您的免费版"数字${number}"今日额度已用完。</p>
                <p>请观看 30 秒广告或支付 $9.99 升级 Pro 版以解锁"数字${number}"。</p>
                <div class="paywall-options">
                    <button class="paywall-btn paywall-ad" onclick="watchAd('${number}')">观看广告 (30秒)</button>
                    <button class="paywall-btn paywall-pro" onclick="upgradePro()">升级 Pro ($9.99)</button>
                    <button class="paywall-btn paywall-skip" onclick="this.closest('.paywall-modal').remove()">稍后再说</button>
                </div>
            </div>
        </div>
    `;
    
    body.appendChild(modal);
    
    // 暴露全局函数
    window.watchAd = (num) => {
        modal.remove();
        // 模拟观看广告
        setTimeout(() => {
            usedNumbers.delete(num);
            alert('广告播放完成！数字 ' + num + ' 已解锁。');
        }, 100);
    };
    
    window.upgradePro = () => {
        modal.remove();
        isVIP = true;
        usedNumbers.clear();
        alert('恭喜！您已升级为 Pro 会员！所有数字已解锁。');
    };
}

/**
 * 检查VIP答案限制
 * @param {HTMLElement} display - 显示元素
 * @returns {boolean} 是否需要打码
 */
export function checkVIPAnswer(display) {
    if (isVIP) return false;
    
    // 30%概率需要VIP
    if (Math.random() < 0.3) {
        applyVIPBlur(display);
        return true;
    }
    
    return false;
}

/**
 * 应用VIP模糊效果
 */
function applyVIPBlur(display) {
    const originalText = display.innerText;
    display.classList.add('vip-blur');
    
    // 添加VIP提示
    const vipOverlay = document.createElement('div');
    vipOverlay.className = 'vip-overlay';
    vipOverlay.innerHTML = `
        <div class="vip-message">
            <p>🔒 升级 VIP 查看此人生哲理</p>
            <button onclick="this.closest('.vip-overlay').remove(); document.getElementById('display').classList.remove('vip-blur')">关闭</button>
        </div>
    `;
    
    display.parentElement.appendChild(vipOverlay);
    
    // 5秒后自动移除
    setTimeout(() => {
        vipOverlay.remove();
        display.classList.remove('vip-blur');
    }, 5000);
}

/**
 * 重置付费墙状态
 */
export function resetPaywall() {
    usedNumbers.clear();
    isVIP = false;
}

