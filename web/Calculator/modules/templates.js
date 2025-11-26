/**
 * 答案模板模块
 * 定义各种答案生成模板
 */

import { randomChoice } from './utils.js';
import { vocab } from './vocab.js';

/**
 * 答案生成模板数组
 */
export const templates = [
    // 基础组合
    () => `${randomChoice(vocab.adjectives)}${randomChoice(vocab.nouns)}`,
    () => `${randomChoice(vocab.nouns)}${randomChoice(vocab.locations)}${randomChoice(vocab.verbs)}`,
    () => `${randomChoice(vocab.prefixes)} ${randomChoice(vocab.adjectives)}${randomChoice(vocab.nouns)}`,
    () => `关于${randomChoice(vocab.nouns)}的${randomChoice(vocab.adjectives)}结论`,
    () => `比${randomChoice(vocab.nouns)}更${randomChoice(vocab.adjectives)}`,
    () => `${Math.floor(Math.random() * 100)}个${randomChoice(vocab.adjectives)}${randomChoice(vocab.nouns)}`,
    () => `${randomChoice(vocab.nouns)}${randomChoice(vocab.verbs)}了${randomChoice(vocab.nouns)}`,
    () => `${randomChoice(vocab.nouns)}`,
    () => `${randomChoice(vocab.nouns)}重要吗？`,
    
    // 特殊类别 (权重增加)
    () => randomChoice(vocab.minimalist),
    () => randomChoice(vocab.minimalist),
    () => randomChoice(vocab.kaomoji),
    () => randomChoice(vocab.code),
    
    // 巨大 Emoji 模式 (返回特殊标记，后面处理)
    () => ({ type: 'emoji', content: randomChoice(vocab.hugeEmoji) })
];

/**
 * 获取随机答案
 * @returns {string|Object} 随机生成的答案
 */
export function getRandomAnswer() {
    const template = randomChoice(templates);
    return template();
}

