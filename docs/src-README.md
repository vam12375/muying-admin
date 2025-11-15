# 📦 源代码目录说明

## 目录结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 主页面
│   ├── login/             # 登录页面
│   └── globals.css        # 全局样式
│
├── components/             # 可复用的 UI 组件
│   ├── layout/            # 布局组件
│   │   ├── AdminDashboard.tsx  # 主仪表盘布局
│   │   ├── Sidebar.tsx         # 侧边栏
│   │   ├── Header.tsx          # 顶部栏
│   │   └── index.ts            # 导出文件
│   ├── common/            # 通用组件（按钮、输入框等）
│   └── ui/                # UI 组件库
│
├── views/                  # 业务视图组件（页面级）
│   ├── dashboard/         # 仪表盘视图
│   │   ├── OverviewView.tsx
│   │   └── OverviewViewWithAPI.tsx
│   ├── products/          # 商品管理视图
│   │   └── ProductsView.tsx
│   ├── orders/            # 订单管理视图
│   │   └── OrdersView.tsx
│   ├── reviews/           # 评价管理视图
│   │   └── ReviewsView.tsx
│   ├── coupons/           # 优惠券管理视图
│   │   └── CouponsView.tsx
│   ├── points/            # 积分管理视图
│   │   └── PointsView.tsx
│   ├── messages/          # 消息管理视图
│   │   └── MessagesView.tsx
│   ├── logistics/         # 物流管理视图
│   │   └── LogisticsView.tsx
│   ├── after-sales/       # 售后管理视图
│   │   └── AfterSalesView.tsx
│   ├── users/             # 用户管理视图
│   ├── settings/          # 系统设置视图
│   ├── error/             # 错误页面
│   │   └── 404.tsx
│   └── index.ts           # 导出文件
│
├── hooks/                  # 自定义 React Hooks
│   └── useAuth.ts         # 认证 Hook
│
├── lib/                    # 工具库和服务
│   ├── api.ts             # API 服务层
│   ├── utils.ts           # 工具函数
│   └── constants.ts       # 常量定义
│
├── types/                  # TypeScript 类型定义
│   ├── index.ts           # 全局类型
│   └── dashboard.ts       # 仪表盘类型
│
└── middleware.ts           # Next.js 中间件
```

## 设计原则

### KISS (Keep It Simple, Stupid)
- 保持目录结构简洁明了
- 每个文件职责单一
- 避免过度嵌套

### YAGNI (You Aren't Gonna Need It)
- 只创建当前需要的目录
- 不预先创建未使用的结构
- 按需扩展

### SOLID
- **单一职责**：每个目录有明确的职责
  - `components/` - 可复用 UI 组件
  - `views/` - 业务视图组件
  - `lib/` - 工具和服务
- **开闭原则**：易于扩展新模块
- **依赖倒置**：通过 index.ts 统一导出

## 目录职责说明

### 📱 app/
Next.js 16 App Router 的页面和路由定义。
- 只包含路由相关的文件
- 页面组件应该很薄，主要逻辑在 views/ 中

### 🧩 components/
可复用的 UI 组件，不包含业务逻辑。

#### layout/
布局相关组件：
- `AdminDashboard.tsx` - 主仪表盘布局容器
- `Sidebar.tsx` - 侧边栏导航
- `Header.tsx` - 顶部标题栏

#### common/
通用 UI 组件（待添加）：
- 按钮、输入框、对话框等
- 可在多个页面复用

#### ui/
UI 组件库（待添加）：
- 基础 UI 组件
- 遵循设计系统

### 📄 views/
业务视图组件，包含具体的业务逻辑。

**特点**：
- 每个模块一个目录
- 包含该模块的所有视图组件
- 可以有自己的子组件
- 通过 API 服务层获取数据

**命名规范**：
- 文件名：`XxxView.tsx`
- 组件名：`XxxView`

### 🎣 hooks/
自定义 React Hooks。

**示例**：
- `useAuth.ts` - 认证相关
- `useApi.ts` - API 调用
- `useLocalStorage.ts` - 本地存储

### 📚 lib/
工具库和服务层。

- `api.ts` - API 服务层，统一管理所有 API 调用
- `utils.ts` - 通用工具函数
- `constants.ts` - 常量定义

### 📝 types/
TypeScript 类型定义。

- `index.ts` - 全局类型
- `dashboard.ts` - 仪表盘相关类型
- 按模块组织类型定义

## 路径别名

使用 `@/` 作为 `src/` 的别名：

```typescript
// ✅ 推荐
import { AdminDashboard } from '@/components/layout';
import { ProductsView } from '@/views';
import { productsApi } from '@/lib/api';
import type { Product } from '@/types';

// ❌ 避免
import { AdminDashboard } from '../../../components/layout/AdminDashboard';
```

## 导入规范

### 使用索引文件

```typescript
// ✅ 推荐 - 通过索引文件导入
import { AdminDashboard, Sidebar } from '@/components/layout';
import { ProductsView, OrdersView } from '@/views';

// ❌ 避免 - 直接导入具体文件
import AdminDashboard from '@/components/layout/AdminDashboard';
import ProductsView from '@/views/products/ProductsView';
```

### 导入顺序

```typescript
// 1. React 和第三方库
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// 2. 组件
import { AdminDashboard } from '@/components/layout';

// 3. Hooks
import { useAuth } from '@/hooks/useAuth';

// 4. 工具和服务
import { productsApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';

// 5. 类型
import type { Product } from '@/types';

// 6. 样式
import './styles.css';
```

## 添加新模块

### 1. 创建视图组件

```bash
# 创建新模块目录
mkdir src/views/new-module

# 创建视图组件
touch src/views/new-module/NewModuleView.tsx
```

### 2. 更新导出文件

```typescript
// src/views/index.ts
export { default as NewModuleView } from './new-module/NewModuleView';
```

### 3. 添加 API 接口

```typescript
// src/lib/api.ts
export const newModuleApi = {
  getList: (page: number, size: number) => 
    fetchApi(`/api/new-module/list?page=${page}&size=${size}`),
  // ...
};
```

### 4. 添加类型定义

```typescript
// src/types/index.ts
export interface NewModule {
  id: string;
  name: string;
  // ...
}
```

## 最佳实践

### 1. 组件职责分离

```typescript
// ✅ 推荐 - 视图组件专注业务逻辑
// src/views/products/ProductsView.tsx
export default function ProductsView() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    loadProducts();
  }, []);
  
  return <ProductList products={products} />;
}

// src/components/common/ProductList.tsx
export default function ProductList({ products }) {
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### 2. 统一错误处理

```typescript
// src/lib/api.ts
async function fetchApi<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

### 3. 类型安全

```typescript
// ✅ 推荐 - 使用类型定义
import type { Product } from '@/types';

const [products, setProducts] = useState<Product[]>([]);

// ❌ 避免 - 使用 any
const [products, setProducts] = useState<any[]>([]);
```

## 迁移指南

如果需要从旧结构迁移：

1. **更新导入路径**
   ```typescript
   // 旧
   import ProductsView from '@/components/dashboard/ProductsView';
   
   // 新
   import { ProductsView } from '@/views';
   ```

2. **更新类型导入**
   ```typescript
   // 旧
   import type { Product } from '@/components/dashboard/types';
   
   // 新
   import type { Product } from '@/types';
   ```

3. **更新布局组件导入**
   ```typescript
   // 旧
   import AdminDashboard from '@/components/dashboard/AdminDashboard';
   
   // 新
   import { AdminDashboard } from '@/components/layout';
   ```

## 常见问题

### Q: components 和 views 的区别？
A: 
- `components/` - 可复用的 UI 组件，不包含业务逻辑
- `views/` - 业务视图组件，包含具体的业务逻辑和数据获取

### Q: 什么时候创建新的子目录？
A: 
- 当某个模块的文件超过 3 个时
- 当需要组织相关的子组件时
- 遵循 YAGNI 原则，不要过早创建

### Q: 如何组织共享的工具函数？
A: 
- 通用工具 → `lib/utils.ts`
- 特定模块工具 → 在该模块目录下创建 `utils.ts`

---

**遵循这些规范，保持代码整洁和可维护！**
