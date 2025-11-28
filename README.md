# Interesting Gallery ✨

![License](https://img.shields.io/badge/license-MIT-blue.svg)

一个充满趣味和创意的手帐风格项目展示画廊。
A creative and interesting project gallery with a handbook/journal aesthetic.

## 📖 简介 / Introduction

Interesting Gallery 是一个用于展示各种有趣小项目的静态网页集合。它采用了独特的"手帐"（Handbook）设计风格，让浏览项目就像翻阅一本精心记录的笔记本。

Interesting Gallery is a collection of static web pages showcasing various interesting small projects. It features a unique "Handbook" design style, making browsing projects feel like flipping through a carefully curated notebook.

## ✨ 特性 / Features

- **手帐风格 (Handbook Aesthetic)**:
  - 纸质纹理背景 (Paper texture background)
  - 手写字体 (Handwritten fonts: Patrick Hand, Indie Flower, Ma Shan Zheng)
  - 拍立得风格卡片 (Polaroid-style cards)
  - 真实的图钉效果 (Realistic pin effects)
  - 可爱的贴纸装饰 (Cute sticker decorations)
- **响应式设计 (Responsive Design)**: 完美适配桌面端和移动端 (Perfectly adapted for desktop and mobile).
- **多框架支持 (Multi-Framework Support)**: 支持纯 HTML/CSS/JS 和 React 项目 (Supports both pure HTML/CSS/JS and React projects).
- **现代化构建 (Modern Build)**: 使用 Vite 构建工具，支持热模块替换 (Uses Vite build tool with HMR support).

## 🚀 快速开始 / Quick Start

### 在线浏览 / Online Demo

访问 GitHub Pages (如果已部署) 或直接克隆仓库在本地打开。

### 本地运行 / Run Locally

#### 方式一：使用 Vite 开发服务器（推荐） / Method 1: Using Vite Dev Server (Recommended)

1. 克隆仓库 / Clone the repository:

   ```bash
   git clone https://github.com/c0sc0s/InterestingGallery.git
   ```

2. 进入目录并安装依赖 / Enter the directory and install dependencies:

   ```bash
   cd InterestingGallery
   npm install
   ```

3. 启动开发服务器 / Start the dev server:

   ```bash
   npm run dev
   ```

   开发服务器将在 `http://localhost:3000` 启动。
   The dev server will start at `http://localhost:3000`.

4. 构建生产版本 / Build for production:

   ```bash
   npm run build
   ```

   构建输出将在 `dist/` 目录中。
   The build output will be in the `dist/` directory.

#### 方式二：直接打开 HTML 文件 / Method 2: Open HTML Files Directly

对于纯 HTML 项目，可以直接在浏览器中打开 `web/index.html` 文件。
For pure HTML projects, you can open `web/index.html` directly in your browser.

**注意**: 使用 ES6 模块的项目（如 Calculator）需要使用本地服务器运行。
**Note**: Projects using ES6 modules (like Calculator) need to be run with a local server.

## 📂 项目列表 / Projects

目前包含以下项目：

- **Calculator (无用计算器)**: 一个充满哲学思考的计算器。
- **React Example**: React 项目示例，展示如何在项目中使用 React。
- **(Coming Soon)**: 更多有趣项目正在开发中...

## ⚛️ 使用 React 开发 / Using React

项目现在支持 React 开发！你可以创建 React 项目，它们会被 Vite 自动构建。

The project now supports React development! You can create React projects, and they will be automatically built by Vite.

### 创建新的 React 项目 / Creating a New React Project

1. 在 `web/` 目录下创建新文件夹，例如 `web/my-react-app/`
   Create a new folder under `web/`, e.g., `web/my-react-app/`

2. 创建 `index.html` 文件：
   Create an `index.html` file:

   ```html
   <!DOCTYPE html>
   <html lang="zh-CN">
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>My React App</title>
     </head>
     <body>
       <div id="root"></div>
       <script type="module" src="/my-react-app/main.jsx"></script>
     </body>
   </html>
   ```

3. 创建 `main.jsx` 入口文件：
   Create a `main.jsx` entry file:

   ```jsx
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import App from './App';

   ReactDOM.createRoot(document.getElementById('root')).render(
     <React.StrictMode>
       <App />
     </React.StrictMode>
   );
   ```

4. 创建 `App.jsx` 组件：
   Create an `App.jsx` component:

   ```jsx
   import React from 'react';

   function App() {
     return <div>Hello React!</div>;
   }

   export default App;
   ```

5. 在 `vite.config.js` 中添加你的项目入口：
   Add your project entry to `vite.config.js`:

   ```js
   input: {
     // ... existing entries
     myReactApp: resolve(__dirname, 'web/my-react-app/index.html'),
   }
   ```

6. 运行 `npm run dev` 开始开发！
   Run `npm run dev` to start developing!

### 查看示例 / See Example

查看 `web/react-example/` 目录获取完整的 React 项目示例。
Check the `web/react-example/` directory for a complete React project example.

## 📄 许可证 / License

本项目采用 [MIT 许可证](LICENSE)。
This project is licensed under the [MIT License](LICENSE).

---

Made with ❤️ by Interesting Gallery Contributors
