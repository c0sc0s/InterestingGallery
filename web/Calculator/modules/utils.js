/**
 * 工具函数模块
 */

/**
 * 从数组中随机选择一个元素
 * @param {Array} arr - 数组
 * @returns {*} 随机元素
 */
export function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

