# 🚀 快速开始指南

## 📋 前置要求

1. **Node.js** 20+
2. **npm** 或 **yarn**
3. **后端服务** - Spring Boot (muying-mall) 必须运行在 `http://localhost:8080`

---

## ⚡ 快速启动

### 1. 安装依赖

```bash
cd muying-admin
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问: [http://localhost:3000](http://localhost:3000)

---

## 🔐 登录信息

**默认管理员账号**:
- 用户名: `admin`
- 密码: `admin123`

（请根据后端实际配置调整）

---

## 📊 已完成功能

### ✅ 可用模块

1. **仪表盘** (`/`)
   - 显示统计数据（用户数、订单数、商品数、总收入）
   - 最近订单列表
   - 热门商品列表

2. **评价管理** (点击侧边栏"评价管理")
   - 评价列表
   - 审核操作
   - 状态筛选

3. **优惠券管理** (点击侧边栏"优惠券管理")
   - 优惠券列表
   - 统计数据

4. **积分管理** (点击侧边栏"积分管理")
   - 积分记录
   - 用户积分信息

### ⏳ 待完成模块

以下模块的 API 已准备好，但视图组件还需要更新：

- 商品管理
- 订单管理
- 消息管理
- 物流管理
- 售后管理
- 用户管理
- 系统设置

---

## 🔧 开发指南

### API 调用示例

```typescript
import { dashboardApi } from '@/lib/api';

// 获取统计数据
const response = await dashboardApi.getStats();
if (response.success) {
  console.log(response.data);
}
```

### 可用的 API 模块

```typescript
import {
  dashboardApi,    // 仪表盘
  productsApi,     // 商品
  ordersApi,       // 订单
  reviewsApi,      // 评价
  couponsApi,      // 优惠券
  pointsApi,       // 积分
  messagesApi,     // 消息
  logisticsApi,    // 物流
  afterSalesApi,   // 售后
  customersApi,    // 用户
  systemApi,       // 系统
} from '@/lib/api';
```

### 添加新视图组件

1. 在 `src/views/` 下创建新目录
2. 创建视图组件文件
3. 使用相应的 API 获取数据
4. 添加加载状态和错误处理

**示例**:

```typescript
"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { xxxApi } from '@/lib/api';

export function NewView() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await xxxApi.getList();
      if (response.success) {
        setData(response.data);
      }
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={loadData} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* 你的内容 */}
    </motion.div>
  );
}
```

---

## 🐛 常见问题

### 1. API 连接失败

**问题**: `API Error: Failed to fetch`

**解决方案**:
- 确保后端服务运行在 `http://localhost:8080`
- 检查 `.env.local` 中的 `NEXT_PUBLIC_API_URL` 配置
- 检查后端 CORS 配置

### 2. 登录失败

**问题**: 无法登录

**解决方案**:
- 检查用户名和密码
- 查看浏览器控制台错误信息
- 确认后端登录接口 `/api/admin/login` 可用

### 3. 数据不显示

**问题**: 页面显示"暂无数据"

**解决方案**:
- 检查数据库中是否有数据
- 查看浏览器 Network 标签，确认 API 返回数据
- 检查数据格式转换是否正确

### 4. 构建错误

**问题**: `Module not found`

**解决方案**:
- 运行 `npm install` 重新安装依赖
- 检查导入路径是否正确
- 使用 `@/` 别名引用 `src/` 目录

---

## 📚 相关文档

- [完整使用指南](./README.md)
- [API 对接文档](./FRONTEND_API_INTEGRATION.md)
- [完成工作总结](./COMPLETED_WORK_SUMMARY.md)
- [源代码目录说明](./src/README.md)

---

## 🎯 下一步

1. **测试现有功能**
   - 登录系统
   - 查看仪表盘数据
   - 测试评价、优惠券、积分管理

2. **完成剩余模块**
   - 参考 `OverviewView.tsx` 的实现
   - 使用 `src/lib/api.ts` 中已定义的 API
   - 保持代码风格一致

3. **部署到生产环境**
   - 运行 `npm run build`
   - 配置生产环境变量
   - 部署到服务器

---

## 💡 提示

- 所有 API 接口都已在 `src/lib/api.ts` 中定义
- 使用 TypeScript 类型检查避免错误
- 保持原有的动画效果和 UI 样式
- 遵循 KISS/YAGNI/SOLID 原则

---

**祝开发愉快！** 🎉
