# 混沌计算器 - 模块化架构

## 📁 文件结构

```
Calculator/
├── index.html          # 主HTML文件，包含UI结构和模块引入
├── styles.css          # 所有CSS样式
├── list.md            # 功能清单文档
├── README.md          # 本文件
└── modules/           # JavaScript模块目录
    ├── utils.js       # 工具函数（随机选择等）
    ├── vocab.js       # 词汇库模块
    ├── audio.js       # 音效系统模块
    ├── particles.js   # 粒子效果模块
    ├── easterEggs.js  # 彩蛋功能模块
    ├── effects.js     # 视觉特效模块
    ├── templates.js   # 答案模板模块
    └── calculator.js   # 主计算器逻辑模块
```

## 🔧 模块说明

### `styles.css`
- 包含所有CSS样式和动画
- 混沌特效样式（震动、故障、旋转等）
- 粒子效果样式
- 响应式设计样式

### `modules/utils.js`
- **功能**：通用工具函数
- **导出**：`randomChoice(arr)` - 从数组中随机选择元素

### `modules/vocab.js`
- **功能**：词汇库管理
- **导出**：`vocab` - 包含所有词汇分类的对象
- **包含**：名词、形容词、动词、地点、前缀、极简回答、颜文字、代码片段、Emoji

### `modules/audio.js`
- **功能**：音效系统
- **导出**：
  - `initAudio()` - 初始化音频上下文
  - `playTone()` - 播放音调
  - `playButtonSound()` - 按钮点击音效
  - `playCalculateSound()` - 计算完成音效
  - `playEasterEggSound()` - 彩蛋音效

### `modules/particles.js`
- **功能**：粒子效果和烟花
- **导出**：
  - `createParticle()` - 创建单个粒子
  - `createFireworks()` - 在指定位置创建烟花
  - `createFullscreenFireworks()` - 全屏烟花效果

### `modules/easterEggs.js`
- **功能**：彩蛋功能管理
- **导出**：`checkEasterEggs()` - 检查并触发彩蛋
- **支持的彩蛋**：42, 404, 666, 888, 1337, 计算次数彩蛋, 时间彩蛋

### `modules/effects.js`
- **功能**：视觉特效管理
- **导出**：
  - `specialEffects` - 特效函数集合
  - `triggerRandomEffect()` - 触发随机特效
  - `resetEffects()` - 重置所有特效

### `modules/templates.js`
- **功能**：答案生成模板
- **导出**：
  - `templates` - 模板数组
  - `getRandomAnswer()` - 获取随机答案

### `modules/calculator.js`
- **功能**：主计算器逻辑
- **导出**：`Calculator` 类
- **方法**：
  - `appendNumber()` - 添加数字
  - `appendOperator()` - 添加运算符
  - `appendSymbol()` - 添加符号（% 或 +/-）
  - `clearDisplay()` - 清空显示
  - `calculateUselessly()` - 计算（生成随机答案）
  - `typewriterEffect()` - 打字机效果

## 🚀 使用方法

### 开发环境
直接在浏览器中打开 `index.html` 即可运行（需要支持 ES6 模块的浏览器）。

### 本地服务器（推荐）
由于使用了 ES6 模块，建议使用本地服务器运行：

```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js (需要安装 http-server)
npx http-server

# 使用 VS Code Live Server 插件
```

然后访问 `http://localhost:8000/web/Calculator/`

## 📝 维护指南

### 添加新词汇
编辑 `modules/vocab.js`，在相应的数组中添加新词汇。

### 添加新特效
1. 在 `styles.css` 中添加CSS样式
2. 在 `modules/effects.js` 的 `specialEffects` 对象中添加特效函数
3. 在 `modules/effects.js` 的 `resetEffects()` 中添加重置逻辑

### 添加新彩蛋
编辑 `modules/easterEggs.js`，在 `easterEggHandlers` 对象中添加新的处理函数。

### 添加新答案模板
编辑 `modules/templates.js`，在 `templates` 数组中添加新的模板函数。

### 修改音效
编辑 `modules/audio.js`，修改相应的音效函数。

### 修改粒子效果
编辑 `modules/particles.js`，修改粒子生成逻辑。

## 🔄 模块依赖关系

```
index.html
  └── calculator.js
       ├── utils.js
       ├── vocab.js
       ├── audio.js
       ├── particles.js
       ├── easterEggs.js
       ├── effects.js
       └── templates.js
            ├── utils.js
            └── vocab.js
```

## 📦 优势

1. **模块化**：代码按功能拆分，易于维护
2. **可扩展**：添加新功能只需修改对应模块
3. **可测试**：每个模块可以独立测试
4. **可复用**：模块可以在其他项目中复用
5. **清晰的结构**：代码组织清晰，易于理解

## 🐛 调试

计算器实例已暴露到全局 `window.calc`，可以在浏览器控制台中调试：

```javascript
// 查看当前状态
console.log(calc.currentInput);
console.log(calc.calculationCount);

// 手动触发计算
calc.calculateUselessly();
```

## 📄 许可证

与主项目保持一致。






