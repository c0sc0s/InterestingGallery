/**
 * 粒子效果模块
 * 处理烟花和粒子动画
 */

/**
 * 创建单个粒子
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @param {string} color - 颜色
 * @param {number} count - 粒子数量
 */
export function createParticle(x, y, color = '#ff9500', count = 15) {
    const container = document.getElementById('particle-container');
    if (!container) return;
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 6 + 2;
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const velocity = Math.random() * 100 + 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = color;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
        
        container.appendChild(particle);
        
        const duration = 600 + Math.random() * 400;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${vx}px, ${vy}px) scale(0)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => particle.remove();
    }
}

/**
 * 在指定位置创建烟花效果
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 */
export function createFireworks(x, y) {
    const colors = ['#ff9500', '#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf', '#ff8b94', '#ff00ff', '#00ffff', '#ffff00'];
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const color = colors[Math.floor(Math.random() * colors.length)];
            createParticle(x, y, color, 30);
        }, i * 50);
    }
}

/**
 * 创建全屏烟花效果
 * 在屏幕多个随机位置同时放烟花
 */
export function createFullscreenFireworks() {
    const fireworkCount = 5 + Math.floor(Math.random() * 5); // 5-9个烟花
    const colors = ['#ff9500', '#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf', '#ff8b94', '#ff00ff', '#00ffff', '#ffff00', '#ff1493', '#00ff00'];
    
    for (let i = 0; i < fireworkCount; i++) {
        setTimeout(() => {
            // 随机位置
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            
            // 每个位置放多个烟花
            for (let j = 0; j < 3; j++) {
                setTimeout(() => {
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    createParticle(x, y, color, 40);
                }, j * 100);
            }
        }, i * 200);
    }
}

