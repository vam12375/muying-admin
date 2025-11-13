# 母婴商城后台管理系统 - 完整使用指南

## 📚 目录

1. [系统概述](#系统概述)
2. [环境准备](#环境准备)
3. [快速启动](#快速启动)
4. [功能说明](#功能说明)
5. [API 对接](#api-对接)
6. [开发指南](#开发指南)
7. [常见问题](#常见问题)
8. [部署上线](#部署上线)

---

## 系统概述

### 技术栈

**前端**
- Next.js 16 - React 框架
- TypeScript - 类型安全
- Tailwind CSS v4 - 样式框架
- Framer Motion - 动画库
- Lucide React - 图标库

**后端**
- Spring Boot - Java 框架
- MySQL - 数据库
- Redis - 缓存
- MyBatis Plus - ORM

### 系统架构

```
┌─────────────────┐
│   浏览器客户端   │
└────────┬────────┘
         │ HTTP/HTTPS
         ↓
┌─────────────────┐
│  Next.js 前端   │
│  (Port 3000)    │
└────────┬────────┘
         │ REST API
         ↓
┌─────────────────┐
│ Spring Boot后端 │
│  (Port 8080)    │
└────────┬────────┘
         │
    ┌────┴────┐
    ↓         ↓
┌───────┐ ┌───────┐
│ MySQL │ │ Redis │
└───────┘ └───────┘
```

---

## 环境准备

### 1. 安装 Node.js

```bash
# 检查版本（需要 20+）
node --version

# 如果版本过低，请从官网下载最新版本
# https://nodejs.org/
```

### 2. 安装 Java

```bash
# 检查版本（需要 17+）
java --version

# 如果未安装，请从官网下载
# https://www.oracle.com/java/technologies/downloads/
```

### 3. 安装 MySQL

```bash
# 下载并安装 MySQL 8.0+
# https://dev.mysql.com/downloads/mysql/

# 创建数据库
mysql -u root -p
CREATE DATABASE muying_mall CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. 安装 Redis

```bash
# Windows: 下载 Redis for Windows
# https://github.com/microsoftarchive/redis/releases

# 启动 Redis
redis-server
```

---

## 快速启动

### 步骤 1: 启动后端服务

```bash
# 进入后端目录
cd muying-mall

# 配置数据库连接
# 编辑 src/main/resources/application.yml
# 修改数据库用户名和密码

# 导入数据库
mysql -u root -p muying_mall < muying_mall.sql

# 启动后端
mvn spring-boot:run

# 或使用 IDE 运行 MuyingMallApplication.java
```

**验证后端启动成功：**
- 访问：http://localhost:8080
- 访问 Swagger：http://localhost:8080/swagger-ui.html

### 步骤 2: 启动前端服务

```bash
# 进入前端目录
cd muying-admin

# 安装依赖（首次运行）
npm install

# 启动开发服务器
npm run dev
```

**验证前端启动成功：**
- 访问：http://localhost:3000
- 应该看到登录页面

### 步骤 3: 登录系统

1. 打开浏览器访问：http://localhost:3000
2. 输入管理员账号（从后端数据库获取）
3. 点击"登录"按钮
4. 成功后进入仪表盘

---

## 功能说明

### 1. 登录认证

**文件位置：** `app/login/page.tsx`

**功能：**
- 用户名密码登录
- JWT Token 认证
- 记住我功能
- 错误提示

**使用方法：**
```typescript
// 登录 API 调用
const response = await fetch('/api/admin/login', {
  method: 'POST',
  body: JSON.stringify({ username, password })
});
```

### 2. 仪表盘概览

**文件位置：** `components/dashboard/OverviewView.tsx`

**功能：**
- 统计卡片（收入、订单、商品、用户）
- 趋势指标
- 数据刷新

**API 对接：**
```typescript
import { dashboardApi } from '@/lib/api';

// 获取统计数据
const stats = await dashboardApi.getStats();
```

### 3. 商品管理

**文件位置：** `components/dashboard/ProductsView.tsx`

**功能：**
- 商品列表展示
- 搜索和筛选
- 添加/编辑/删除商品
- 商品状态管理
- 库存预警

**API 对接：**
```typescript
import { productsApi } from '@/lib/api';

// 获取商品列表
const products = await productsApi.getList(page, size);

// 创建商品
await productsApi.create(productData);

// 更新商品
await productsApi.update(id, productData);

// 删除商品
await productsApi.delete(id);
```

### 4. 订单管理

**文件位置：** `components/dashboard/OrdersView.tsx`

**功能：**
- 订单列表展示
- 订单状态筛选
- 订单详情查看
- 订单发货
- 订单导出

**API 对接：**
```typescript
import { ordersApi } from '@/lib/api';

// 获取订单列表
const orders = await ordersApi.getList(page, size);

// 更新订单状态
await ordersApi.updateStatus(id, status);

// 订单发货
await ordersApi.ship(id, shipData);
```

### 5. 用户管理

**状态：** 待开发

**计划功能：**
- 用户列表
- 用户详情
- 用户状态管理
- 用户权限设置

### 6. 数据分析

**状态：** 待开发

**计划功能：**
- 销售趋势图表
- 用户增长分析
- 商品销售排行
- 订单统计分析

---

## API 对接

### API 配置

**文件：** `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### API 服务层

**文件：** `lib/api.ts`

所有 API 调用都通过这个文件统一管理。

### 使用示例

#### 1. 在组件中调用 API

```typescript
import { useEffect, useState } from 'react';
import { dashboardApi } from '@/lib/api';

export function MyComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.getStats();
      
      if (response.success) {
        setData(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('网络错误');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;
  
  return <div>{/* 渲染数据 */}</div>;
}
```

#### 2. 处理表单提交

```typescript
const handleSubmit = async (formData) => {
  try {
    const response = await productsApi.create(formData);
    
    if (response.success) {
      alert('创建成功');
      // 刷新列表
      fetchProducts();
    } else {
      alert('创建失败: ' + response.message);
    }
  } catch (error) {
    alert('网络错误');
  }
};
```

#### 3. 带认证的请求

所有 API 请求会自动携带 Token：

```typescript
// lib/api.ts 中已处理
const token = localStorage.getItem('adminToken');
headers: {
  'Authorization': `Bearer ${token}`
}
```

---

## 开发指南

### 1. 创建新页面

```bash
# 创建新页面文件
touch app/my-page/page.tsx
```

```typescript
// app/my-page/page.tsx
"use client";

export default function MyPage() {
  return (
    <div>
      <h1>我的页面</h1>
    </div>
  );
}
```

### 2. 创建新组件

```bash
# 创建组件文件
touch components/MyComponent.tsx
```

```typescript
// components/MyComponent.tsx
"use client";

interface MyComponentProps {
  title: string;
}

export function MyComponent({ title }: MyComponentProps) {
  return (
    <div className="p-4 bg-white rounded-lg">
      <h2>{title}</h2>
    </div>
  );
}
```

### 3. 添加新的 API 接口

```typescript
// lib/api.ts

export const myApi = {
  getData: async () => {
    return fetchApi<ApiResponse<any>>('/api/my-endpoint');
  },
  
  postData: async (data: any) => {
    return fetchApi<ApiResponse<any>>('/api/my-endpoint', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
```

### 4. 使用 Tailwind CSS

```typescript
// 常用样式类
<div className="
  p-4              // padding
  m-4              // margin
  bg-white         // 背景色
  rounded-lg       // 圆角
  shadow-md        // 阴影
  border           // 边框
  hover:bg-gray-50 // 悬停效果
  dark:bg-slate-800 // 深色模式
">
  内容
</div>
```

### 5. 添加动画

```typescript
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  内容
</motion.div>
```

---

## 常见问题

### 1. 无法连接后端

**问题：** 前端显示"网络错误"

**解决方案：**
1. 检查后端是否启动：访问 http://localhost:8080
2. 检查 `.env.local` 中的 API 地址
3. 查看浏览器控制台的网络请求
4. 检查后端 CORS 配置

### 2. 登录失败

**问题：** 输入账号密码后提示登录失败

**解决方案：**
1. 检查数据库中是否有管理员账号
2. 确认密码是否正确（可能需要加密）
3. 查看后端日志
4. 检查后端登录接口是否正常

### 3. 数据不显示

**问题：** 页面加载但没有数据

**解决方案：**
1. 打开浏览器开发者工具 (F12)
2. 查看 Console 标签页的错误
3. 查看 Network 标签页的 API 请求
4. 确认后端返回的数据格式正确

### 4. 样式不生效

**问题：** Tailwind CSS 样式没有应用

**解决方案：**
1. 重启开发服务器
2. 清除 `.next` 缓存：`rm -rf .next`
3. 重新安装依赖：`npm install`

### 5. TypeScript 错误

**问题：** 类型检查报错

**解决方案：**
1. 运行类型检查：`npm run type-check`
2. 添加类型定义
3. 使用 `any` 类型（临时方案）

---

## 部署上线

### 1. 构建生产版本

```bash
# 构建前端
cd muying-admin
npm run build

# 构建后端
cd muying-mall
mvn clean package
```

### 2. 使用 PM2 部署前端

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start npm --name "muying-admin" -- start

# 查看状态
pm2 status

# 查看日志
pm2 logs muying-admin

# 停止应用
pm2 stop muying-admin

# 重启应用
pm2 restart muying-admin
```

### 3. 使用 Nginx 反向代理

```nginx
# /etc/nginx/sites-available/muying-admin
server {
    listen 80;
    server_name admin.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 4. 配置 HTTPS

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d admin.yourdomain.com

# 自动续期
sudo certbot renew --dry-run
```

### 5. 环境变量配置

**生产环境 `.env.production`：**

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## 📞 技术支持

### 文档资源

- [快速开始](./快速开始.md)
- [后端对接说明](./后端对接说明.md)
- [更新说明](./更新说明.md)
- [README_CN](./README_CN.md)

### 在线资源

- Next.js 文档：https://nextjs.org/docs
- Tailwind CSS 文档：https://tailwindcss.com/docs
- TypeScript 文档：https://www.typescriptlang.org/docs

### 调试技巧

1. **查看浏览器控制台**
   - 按 F12 打开开发者工具
   - 查看 Console 标签页的错误信息
   - 查看 Network 标签页的网络请求

2. **查看后端日志**
   - 查看控制台输出
   - 查看日志文件

3. **使用 Postman 测试 API**
   - 直接测试后端接口
   - 验证请求和响应格式

---

## 🎉 开始使用

现在您已经了解了系统的完整使用方法，可以开始开发了！

**推荐学习路径：**

1. ✅ 启动系统并登录
2. ✅ 查看仪表盘数据
3. ✅ 尝试商品管理功能
4. ✅ 学习 API 对接方式
5. ✅ 创建自己的页面和组件
6. ✅ 部署到生产环境

**祝您开发顺利！** 🚀
