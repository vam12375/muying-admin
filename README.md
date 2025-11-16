# 🎨 母婴商城后台管理系统 | MomBaby Admin Dashboard

现代化、美观、功能丰富的母婴电商平台后台管理系统。

A modern, beautiful, and feature-rich admin dashboard for the MomBaby e-commerce platform.

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Status](https://img.shields.io/badge/status-production_ready-success)
![Next.js](https://img.shields.io/badge/Next.js-16.0.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1.17-38bdf8)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![License](https://img.shields.io/badge/license-MIT-green)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

---

## ✨ 核心特性 | Key Features

- 🎯 **现代化界面** - 精美的渐变设计和流畅动画 | Modern UI/UX with smooth animations
- 📱 **完全响应式** - 完美支持手机、平板和桌面设备 | Fully responsive design
- 🌙 **深色模式** - 内置深色模式支持 | Built-in dark mode
- ⚡ **高性能** - 使用 Next.js 16 和 Turbopack 优化 | Optimized with Next.js 16
- 🔐 **认证就绪** - 支持 JWT Token 认证 | JWT authentication ready
- 📊 **多视图管理** - 仪表盘、商品、订单、用户等 | Multiple management views
- 🎭 **丰富动画** - 使用 Framer Motion 和 GSAP 实现流畅过渡 | Rich animations

---

## 🚀 快速开始 | Quick Start

### 前置要求 | Prerequisites

- Node.js 20+
- npm 或 yarn | npm or yarn
- Spring Boot 后端服务 | Spring Boot backend (muying-mall)

### 安装步骤 | Installation

```bash
# 安装依赖 | Install dependencies
npm install

# 配置环境变量 | Configure environment
cp .env.example .env.local

# 启动开发服务器 | Start dev server
npm run dev
```

访问 | Visit: [http://localhost:3000](http://localhost:3000)

---

## 📚 文档 | Documentation

### 🇨🇳 中文文档

- [快速开始](./docs/zh-CN/quick-start.md) - 快速上手指南
- [后端对接说明](./docs/zh-CN/integration-guide.md) - API 集成步骤
- [完整使用指南](./docs/zh-CN/user-guide.md) - 详细使用手册
- [模块指南](./docs/zh-CN/modules-guide.md) - 各模块功能说明
- [故障排查](./docs/zh-CN/troubleshooting.md) - 常见问题解决
- [更新日志](./docs/zh-CN/update-log.md) - 版本更新记录
- [项目总结](./docs/zh-CN/project-summary.md) - 项目完成总结
- [交付清单](./docs/zh-CN/delivery-checklist.md) - 项目交付清单

### 🇺🇸 English Documentation

- [Quick Start](./docs/en-US/quick-start.md) - Getting started guide
- [Integration Guide](./docs/en-US/integration-guide.md) - Backend integration
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment
- [Components](./docs/en-US/components.md) - Component documentation
- [Dashboard Features](./docs/en-US/dashboard-readme.md) - Feature details
- [Project Summary](./docs/en-US/project-summary.md) - Complete overview

### 📄 其他文档 | Additional Documentation

- [项目总结](./docs/PROJECT_SUMMARY.md) - 完整项目总结 | Complete project summary
- [项目路线图](./docs/ROADMAP.md) - 未来发展规划 | Future roadmap
- [部署指南](./docs/DEPLOYMENT.md) - 详细部署说明 | Detailed deployment guide
- [API 文档](./docs/API.md) - API 接口文档 | API documentation
- [常见问题](./docs/FAQ.md) - 常见问题解答 | Frequently asked questions
- [贡献指南](./docs/CONTRIBUTING.md) - 如何贡献代码 | How to contribute
- [更新日志](./docs/CHANGELOG.md) - 版本更新记录 | Version changelog
- [项目状态](./docs/STATUS.md) - 开发状态追踪 | Development status
- [安全政策](./docs/SECURITY.md) - 安全相关说明 | Security policy
- [文档索引](./docs/DOCUMENTATION_INDEX.md) - 完整文档索引 | Complete documentation index
- [许可证](./LICENSE) - MIT 许可证 | MIT License

---

## 🛠️ 技术栈 | Tech Stack

- **框架 | Framework**: [Next.js 16.0.2](https://nextjs.org/) with App Router
- **语言 | Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **样式 | Styling**: [Tailwind CSS v4.1.17](https://tailwindcss.com/)
- **动画 | Animations**: [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://gsap.com/)
- **图标 | Icons**: [Lucide React](https://lucide.dev/)
- **图表 | Charts**: [Recharts](https://recharts.org/)
- **UI 组件 | UI Components**: [Radix UI](https://www.radix-ui.com/)
- **构建工具 | Build**: Turbopack (built-in)

---

## 📁 项目结构 | Project Structure

```
muying-admin/
├── src/                        # 📦 源代码目录 | Source code
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx         # 根布局 | Root layout
│   │   ├── page.tsx           # 主页面 | Main page
│   │   └── login/             # 登录页面 | Login page
│   ├── components/            # React 组件 | Components
│   │   └── dashboard/         # 仪表盘组件 | Dashboard components
│   ├── hooks/                 # 自定义 Hooks | Custom hooks
│   │   └── useAuth.ts         # 认证 Hook | Auth hook
│   ├── lib/                   # 工具库 | Utilities
│   │   ├── api.ts             # API 服务层 | API service
│   │   └── utils.ts           # 工具函数 | Utility functions
│   ├── types/                 # 类型定义 | Type definitions
│   │   └── index.ts           # 全局类型 | Global types
│   └── middleware.ts          # 中间件 | Middleware
├── docs/                      # 📚 文档目录 | Documentation
│   ├── zh-CN/                 # 🇨🇳 中文文档
│   └── en-US/                 # 🇺🇸 English docs
├── public/                    # 静态资源 | Static assets
└── 配置文件...                 # Configuration files
```

> 💡 **路径别名 | Path Alias:** 使用 `@/` 引用 `src/` 目录  
> Use `@/` to reference `src/` directory  
> 例如 | Example: `import { Button } from '@/components/common/Button'`

---

## 🎯 可用脚本 | Available Scripts

```bash
# 开发 | Development
npm run dev          # 启动开发服务器 | Start dev server
npm run build        # 构建生产版本 | Build for production
npm start            # 启动生产服务器 | Start production server

# 代码质量 | Code Quality
npm run lint         # 运行 ESLint | Run ESLint
npm run type-check   # TypeScript 类型检查 | Type checking
npm run format       # 代码格式化 | Format code with Prettier
npm run check        # 运行所有检查 | Run all checks

# 工具脚本 | Utility Scripts
npm run setup        # 项目初始化 | Project setup
npm run health       # 健康检查 | Health check
npm run deploy       # 部署脚本 | Deploy script
npm run clean        # 清理构建文件 | Clean build files
npm run reinstall    # 重新安装依赖 | Reinstall dependencies
```

---

## 🔌 后端对接 | Backend Integration

系统设计用于与 Spring Boot 后端配合使用。

The system is designed to work with Spring Boot backend.

### 快速配置 | Quick Setup

1. **配置 API 地址 | Configure API URL**:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

2. **使用 API 服务 | Use API service**:
```typescript
import { productsApi } from '@/lib/api';

const products = await productsApi.getList(1, 10);
```

详见 | See: [后端对接说明](./docs/zh-CN/integration-guide.md) | [Integration Guide](./docs/en-US/integration-guide.md)

---

## 📊 功能清单 | Features

### ✅ 已实现 | Implemented

**核心模块 | Core Modules (11个)**
- 🔐 用户认证系统 | User authentication
- 📊 仪表盘概览 | Dashboard overview
- 📦 商品管理（多级）| Product management (multi-level)
- ⭐ 评价管理 | Review management
- 📋 订单管理 | Order management
- 🎧 售后管理 | After-sales service
- 👥 用户管理 | Customer management
- 🎁 优惠券管理 | Coupon management
- 🏆 积分管理 | Points management
- 📢 消息管理 | Message management
- 🚚 物流管理 | Logistics management
- ⚙️ 系统设置（多级）| System settings (multi-level)

**UI/UX 特性 | UI/UX Features**
- 🎨 响应式设计 | Responsive design
- 🌙 深色模式 | Dark mode
- 🎭 丰富动画效果 | Rich animations with Framer Motion
- 💫 毛玻璃效果 | Glassmorphism effects
- 🌈 渐变色系统 | Gradient color system
- 📱 移动端优化 | Mobile optimized

### 🔄 可扩展功能 | Extensible Features

- 📈 高级数据分析 | Advanced analytics
- 🔔 实时通知推送 | Real-time push notifications
- 📊 多格式报表导出 | Multi-format report export
- 🔐 细粒度权限控制 | Fine-grained permission control
- 🌐 多语言国际化 | Multi-language i18n
- 📦 批量操作功能 | Batch operations

---

## 🎉 项目状态 | Project Status

**✅ 生产就绪 | Production Ready**

系统功能完整，文档齐全，可以立即部署使用！

The system is fully functional with complete documentation and ready for deployment!

---

## � 部术署 | Deployment

### Vercel 部署 | Deploy on Vercel

```bash
# 一键部署 | One-click deploy
vercel
```

### Docker 部署 | Deploy with Docker

```bash
# 构建镜像 | Build image
docker build -t muying-admin .

# 运行容器 | Run container
docker run -p 3000:3000 muying-admin
```

### 生产环境配置 | Production Configuration

确保设置以下环境变量 | Make sure to set these environment variables:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NODE_ENV=production
```

---

## 🔒 环境变量 | Environment Variables

创建 `.env.local` 文件 | Create `.env.local` file:

```env
# API 配置 | API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080

# 应用配置 | App Configuration
NEXT_PUBLIC_APP_NAME=母婴商城管理系统
NEXT_PUBLIC_APP_VERSION=0.1.0

# 可选配置 | Optional
# NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

---

## 📞 技术支持 | Support

如有问题 | For issues:
- 📖 查看文档 | Check [documentation](./docs/zh-CN/)
- � 故障排查 s| See [troubleshooting guide](./docs/zh-CN/troubleshooting.md)
- � 提交 i ssue | Open an issue on GitHub
- 💬 技术交流 | Technical discussions welcome

---

## 📝 许可证 | License

本项目采用 MIT 许可证。

This project is licensed under the MIT License.

---

**用 ❤️ 为母婴电商平台打造 | Made with ❤️ for MomBaby E-Commerce Platform**
