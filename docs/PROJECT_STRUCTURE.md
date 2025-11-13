# 📁 项目结构规范 | Project Structure Standards

**版本 | Version:** 1.0.0  
**更新日期 | Last Updated:** 2024-11-13  
**状态 | Status:** ✅ 已规范化 | Standardized

---

## 🎯 结构概览 | Structure Overview

```
muying-admin/
├── 📦 src/                         # 源代码目录 | Source code
│   ├── 📱 app/                    # Next.js App Router
│   ├── 🧩 components/             # React 组件 | Components
│   ├── 🪝 hooks/                  # 自定义 Hooks | Custom hooks
│   ├── 🛠️ lib/                    # 工具库 | Utilities
│   ├── 📝 types/                  # 类型定义 | Type definitions
│   ├── 🔒 middleware.ts           # 中间件 | Middleware
│   └── 📄 README.md               # 源代码说明
│
├── 📚 docs/                        # 文档目录 | Documentation
│   ├── 🇨🇳 zh-CN/                 # 中文文档
│   ├── 🇺🇸 en-US/                 # 英文文档
│   ├── CONTRIBUTING.md            # 贡献指南
│   ├── RESTRUCTURE_LOG.md         # 文档重组日志
│   └── SOURCE_RESTRUCTURE_LOG.md  # 源码重组日志
│
├── 🌐 public/                      # 静态资源 | Static assets
│   └── (images, fonts, etc.)
│
├── ⚙️ 配置文件 | Configuration Files
│   ├── .env.example               # 环境变量模板
│   ├── .env.local                 # 本地环境变量
│   ├── .gitignore                 # Git 忽略配置
│   ├── components.json            # UI 组件配置
│   ├── eslint.config.mjs          # ESLint 配置
│   ├── next.config.ts             # Next.js 配置
│   ├── package.json               # 项目依赖
│   ├── postcss.config.mjs         # PostCSS 配置
│   ├── tsconfig.json              # TypeScript 配置
│   └── README.md                  # 项目主文档
│
└── 🔧 其他 | Others
    ├── .git/                      # Git 仓库
    ├── .next/                     # Next.js 构建输出
    └── node_modules/              # 依赖包
```

---

## 📦 src/ - 源代码目录

### 目录职责 | Directory Responsibilities

| 目录 | 职责 | 命名规范 | 示例 |
|------|------|----------|------|
| `app/` | 页面和路由 | lowercase | `page.tsx`, `layout.tsx` |
| `components/` | React 组件 | PascalCase | `AdminDashboard.tsx` |
| `hooks/` | 自定义 Hooks | camelCase + use | `useAuth.ts` |
| `lib/` | 工具和服务 | camelCase | `api.ts`, `utils.ts` |
| `types/` | 类型定义 | camelCase | `index.ts` |

### 详细说明 | Detailed Description

#### 📱 `src/app/` - Next.js App Router

**用途 | Purpose:**  
定义应用的路由结构和页面组件。

**结构 | Structure:**
```
app/
├── layout.tsx              # 根布局
├── page.tsx                # 首页 (/)
├── globals.css             # 全局样式
├── favicon.ico             # 网站图标
└── [route]/                # 动态路由
    ├── page.tsx            # 路由页面
    ├── layout.tsx          # 路由布局
    ├── loading.tsx         # 加载状态
    └── error.tsx           # 错误处理
```

**规范 | Conventions:**
- 文件夹名即路由路径
- `page.tsx` 定义页面组件
- `layout.tsx` 定义布局组件
- 使用 Server Components 优先

#### 🧩 `src/components/` - React 组件

**用途 | Purpose:**  
存放所有可复用的 React 组件。

**组织方式 | Organization:**
```
components/
├── dashboard/              # 仪表盘模块
│   ├── AdminDashboard.tsx
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── constants.ts        # 模块常量
│   ├── types.ts            # 模块类型
│   └── index.ts            # 统一导出
├── products/               # 商品模块
│   └── ...
└── common/                 # 通用组件
    ├── Button.tsx
    ├── Modal.tsx
    └── index.ts
```

**规范 | Conventions:**
- 按功能模块分组
- 组件文件使用 PascalCase
- 每个模块包含 `index.ts` 导出
- 相关类型和常量放在模块内

#### 🪝 `src/hooks/` - 自定义 Hooks

**用途 | Purpose:**  
封装可复用的状态逻辑。

**结构 | Structure:**
```
hooks/
├── useAuth.ts              # 认证 Hook
├── useProducts.ts          # 商品 Hook
└── useOrders.ts            # 订单 Hook
```

**规范 | Conventions:**
- 文件名以 `use` 开头
- 使用 camelCase 命名
- 一个文件一个 Hook
- 导出命名函数

#### 🛠️ `src/lib/` - 工具库

**用途 | Purpose:**  
存放工具函数、API 服务、配置等。

**结构 | Structure:**
```
lib/
├── api.ts                  # API 服务层
├── utils.ts                # 工具函数
├── constants.ts            # 全局常量
└── config.ts               # 配置文件
```

**规范 | Conventions:**
- 使用 camelCase 命名
- 按功能分类文件
- 使用命名导出
- 添加类型定义

#### 📝 `src/types/` - 类型定义

**用途 | Purpose:**  
统一管理全局 TypeScript 类型。

**结构 | Structure:**
```
types/
├── index.ts                # 主类型文件
├── user.ts                 # 用户类型 (可选)
├── product.ts              # 商品类型 (可选)
└── order.ts                # 订单类型 (可选)
```

**规范 | Conventions:**
- 优先使用 `interface`
- 添加 JSDoc 注释
- 导出所有类型
- 避免循环依赖

---

## 📚 docs/ - 文档目录

### 目录结构 | Directory Structure

```
docs/
├── zh-CN/                          # 🇨🇳 中文文档
│   ├── README.md                   # 文档索引
│   ├── quick-start.md              # 快速开始
│   ├── integration-guide.md        # 集成指南
│   ├── user-guide.md               # 使用指南
│   ├── update-log.md               # 更新日志
│   ├── project-summary.md          # 项目总结
│   ├── delivery-checklist.md       # 交付清单
│   ├── login-fix.md                # 登录修复
│   └── login-redirect-fix.md       # 跳转修复
│
├── en-US/                          # 🇺🇸 英文文档
│   ├── README.md                   # Documentation index
│   ├── quick-start.md              # Quick start
│   ├── integration-guide.md        # Integration guide
│   ├── deployment.md               # Deployment
│   ├── components.md               # Components
│   ├── dashboard-readme.md         # Dashboard
│   └── project-summary.md          # Summary
│
├── CONTRIBUTING.md                 # 文档贡献指南
├── RESTRUCTURE_LOG.md              # 文档重组日志
└── SOURCE_RESTRUCTURE_LOG.md       # 源码重组日志
```

### 文档规范 | Documentation Standards

- **命名规范 | Naming:** kebab-case (如 `quick-start.md`)
- **语言分类 | Language:** 按 `zh-CN/`, `en-US/` 分类
- **索引文件 | Index:** 每个语言目录包含 `README.md`
- **交叉引用 | Cross-ref:** 使用相对路径链接

---

## 🌐 public/ - 静态资源

### 目录结构 | Directory Structure

```
public/
├── images/                 # 图片资源
├── fonts/                  # 字体文件
├── icons/                  # 图标文件
└── favicon.ico             # 网站图标
```

### 使用规范 | Usage Standards

- 静态文件直接通过 `/` 访问
- 图片优先使用 Next.js `<Image>` 组件
- 大文件考虑使用 CDN

---

## ⚙️ 配置文件 | Configuration Files

### 核心配置 | Core Configurations

| 文件 | 用途 | 说明 |
|------|------|------|
| `tsconfig.json` | TypeScript 配置 | 路径别名、编译选项 |
| `next.config.ts` | Next.js 配置 | 构建、路由配置 |
| `package.json` | 项目依赖 | 依赖包、脚本命令 |
| `.env.local` | 环境变量 | 本地环境配置 |
| `eslint.config.mjs` | ESLint 配置 | 代码规范检查 |
| `postcss.config.mjs` | PostCSS 配置 | CSS 处理 |
| `components.json` | UI 组件配置 | Shadcn UI 配置 |

### 路径别名配置 | Path Alias Configuration

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**使用示例 | Usage:**
```typescript
import { Component } from '@/components/Component';
import { useHook } from '@/hooks/useHook';
import { api } from '@/lib/api';
import type { Type } from '@/types';
```

---

## 📋 命名规范总结 | Naming Conventions Summary

### 文件命名 | File Naming

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件 | PascalCase | `AdminDashboard.tsx` |
| Hook | camelCase + use | `useAuth.ts` |
| 工具 | camelCase | `api.ts`, `utils.ts` |
| 类型 | camelCase | `index.ts`, `types.ts` |
| 页面 | lowercase | `page.tsx`, `layout.tsx` |
| 文档 | kebab-case | `quick-start.md` |

### 目录命名 | Directory Naming

| 类型 | 规范 | 示例 |
|------|------|------|
| 源代码 | lowercase | `app/`, `components/` |
| 文档语言 | 语言代码 | `zh-CN/`, `en-US/` |
| 功能模块 | lowercase | `dashboard/`, `products/` |

---

## 🎯 最佳实践 | Best Practices

### 1. 路径导入 | Path Imports

```typescript
// ✅ 推荐 - 使用路径别名
import { Component } from '@/components/Component';

// ❌ 避免 - 相对路径
import { Component } from '../../../components/Component';
```

### 2. 组件组织 | Component Organization

```typescript
// ✅ 推荐 - 模块化导出
// components/dashboard/index.ts
export { AdminDashboard } from './AdminDashboard';
export { Sidebar } from './Sidebar';

// 使用
import { AdminDashboard, Sidebar } from '@/components/dashboard';

// ❌ 避免 - 单独导入
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { Sidebar } from '@/components/dashboard/Sidebar';
```

### 3. 类型定义 | Type Definitions

```typescript
// ✅ 推荐 - 集中管理
// types/index.ts
export interface User { /* ... */ }
export interface Product { /* ... */ }

// 使用
import type { User, Product } from '@/types';

// ❌ 避免 - 分散定义
// 在每个组件文件中重复定义类型
```

### 4. 文件组织 | File Organization

```
✅ 推荐结构
components/
└── dashboard/
    ├── AdminDashboard.tsx      # 主组件
    ├── Sidebar.tsx             # 子组件
    ├── Header.tsx              # 子组件
    ├── constants.ts            # 常量
    ├── types.ts                # 类型
    └── index.ts                # 导出

❌ 避免结构
components/
├── AdminDashboard.tsx          # 所有组件平铺
├── Sidebar.tsx
├── Header.tsx
└── ...
```

---

## 🔄 维护指南 | Maintenance Guide

### 添加新功能模块 | Adding New Feature Module

1. **创建模块目录**
   ```bash
   src/components/[module-name]/
   ```

2. **添加组件文件**
   ```bash
   src/components/[module-name]/ComponentName.tsx
   ```

3. **创建导出文件**
   ```bash
   src/components/[module-name]/index.ts
   ```

4. **添加类型定义** (如需要)
   ```bash
   src/components/[module-name]/types.ts
   ```

### 重构现有代码 | Refactoring Existing Code

1. **保持路径别名一致**
2. **更新导入语句**
3. **验证类型定义**
4. **运行测试确保功能正常**

---

## 📊 项目统计 | Project Statistics

### 目录统计 | Directory Statistics

- **源代码目录 | Source Directories:** 5 个
- **文档目录 | Documentation Directories:** 2 个
- **配置文件 | Configuration Files:** 8 个

### 文件统计 | File Statistics

- **组件文件 | Component Files:** 10+ 个
- **Hook 文件 | Hook Files:** 1 个
- **工具文件 | Utility Files:** 2 个
- **类型文件 | Type Files:** 1 个
- **文档文件 | Documentation Files:** 20+ 个

---

## 📚 相关文档 | Related Documentation

- [源代码目录说明](./src/README.md)
- [文档贡献指南](./docs/CONTRIBUTING.md)
- [文档重组日志](./docs/RESTRUCTURE_LOG.md)
- [源码重组日志](./docs/SOURCE_RESTRUCTURE_LOG.md)
- [快速开始指南](./docs/zh-CN/quick-start.md)

---

## 🎉 总结 | Summary

本项目已完成全面的结构规范化：

This project has completed comprehensive structure standardization:

1. ✅ **源代码规范化** - 所有代码集中在 `src/` 目录
2. ✅ **文档规范化** - 按语言分类，使用 kebab-case
3. ✅ **路径别名配置** - 使用 `@/` 简化导入
4. ✅ **类型系统完善** - 统一的类型定义管理
5. ✅ **命名规范统一** - 清晰的命名约定
6. ✅ **文档完善** - 详细的结构说明和指南

**项目结构现已完全符合 Next.js 最佳实践和行业标准！**

**Project structure now fully complies with Next.js best practices and industry standards!**

---

**文档版本 | Document Version:** 1.0.0  
**最后更新 | Last Updated:** 2024-11-13  
**维护者 | Maintainer:** Development Team
