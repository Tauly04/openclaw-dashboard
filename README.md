# Openclaw 贾维斯看板 - Vision Pro 版

OpenClaw 多 Agent 实时监控面板（FastAPI + Vue）。
**全新 Vision Pro 风格 UI + 实时聊天功能**

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Tauly04/openclaw-dashboard)

## 在线演示

部署后访问：`https://your-app.onrender.com`
- 默认账号：`admin`
- 默认密码：`admin123`

## 新功能

### Vision Pro 风格界面
- 毛玻璃效果 (Glassmorphism)
- 发光边框
- 鼠标跟随光晕
- 半透明卡片

### 实时聊天
- 点击左侧 Chat 图标与 OpenClaw 对话
- WebSocket 实时通信
- 支持中英文

### 多语言支持
- 顶部状态栏可切换中文/English
- 设置面板也可切换语言

### 背景自定义
- 支持上传自定义背景图片
- 图片保存到本地存储

## 本地开发

### 快速开始
```bash
# 克隆仓库
git clone https://github.com/Tauly04/openclaw-dashboard.git
cd openclaw-dashboard

# 安装后端依赖
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# 安装前端依赖
cd frontend
npm install
npm run build
cd ..

# 启动服务
python server.py
```

访问 http://localhost:18790

### 开发模式
```bash
# 终端1：启动后端
cd openclaw-dashboard
source .venv/bin/activate
python server.py

# 终端2：启动前端开发服务器
cd openclaw-dashboard/frontend
npm run dev
```

## 部署

### 一键部署到 Render
点击上方 "Deploy to Render" 按钮，按提示操作即可。

### 部署到 Railway
1. 访问 https://railway.app
2. 用 GitHub 登录
3. New Project → Deploy from GitHub repo
4. 选择 `openclaw-dashboard`
5. 添加环境变量 `JWT_SECRET=your-secret-key`
6. 自动部署完成

### Docker 部署
```bash
docker build -t openclaw-dashboard .
docker run -p 18790:18790 -e JWT_SECRET=your-secret openclaw-dashboard
```

## 功能特性

- [x] Vision Pro 风格 UI
- [x] 实时聊天功能
- [x] 中英文切换
- [x] 自定义背景
- [x] 系统监控（CPU、内存、Gateway 状态）
- [x] Agent 管理
- [x] 任务管理
- [x] 模型用量看板（MiniMax/OpenAI/Gemini/GLM）

## 技术栈

| 层级 | 技术 |
|------|------|
| 后端 | Python 3.11 + FastAPI |
| 前端 | Vue 3 + Vite + Tailwind CSS |
| 状态管理 | Pinia |
| 实时通信 | WebSocket |

## 截图

![Dashboard Preview](assets/social/dashboard-screenshot-1920x1080.png)

## 默认账号

- 用户名：`admin`
- 密码：`admin123`
- **首次登录后建议立即修改密码**

## 配置文件

- 环境变量：`.env`
- 模型集成：`~/.openclaw/dashboard_integrations.json`

## 开源协议

MIT
