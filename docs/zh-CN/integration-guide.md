# 母婴商城后台管理系统 - 后端对接说明

## 📋 概述

本文档说明如何将 Next.js 前端管理系统与 Spring Boot 后端进行对接。

## 🔧 环境配置

### 1. 配置后端 API 地址

编辑 `.env.local` 文件：

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 2. 启动后端服务

```bash
cd muying-mall
mvn spring-boot:run
```

后端服务将在 `http://localhost:8080` 启动。

### 3. 启动前端服务

```bash
cd muying-admin
npm install
npm run dev
```

前端服务将在 `http://localhost:3000` 启动。

## 📡 API 接口映射

### 仪表盘统计

| 前端方法 | 后端接口 | 请求方式 | 说明 |
|---------|---------|---------|------|
| `dashboardApi.getStats()` | `/admin/dashboard/stats` | GET | 获取仪表盘统计数据 |
| `dashboardApi.getOrderTrend()` | `/admin/dashboard/order-trend` | GET | 获取订单趋势 |
| `dashboardApi.getProductCategories()` | `/admin/dashboard/product-categories` | GET | 获取商品分类统计 |
| `dashboardApi.getMonthlySales()` | `/admin/dashboard/monthly-sales` | GET | 获取月度销售额 |
| `dashboardApi.getTodoItems()` | `/admin/dashboard/todo-items` | GET | 获取待处理事项 |
| `dashboardApi.getUserGrowth()` | `/admin/dashboard/user-growth` | GET | 获取用户增长数据 |
| `dashboardApi.getRefundTrend()` | `/admin/dashboard/refund-trend` | GET | 获取退款趋势 |

### 商品管理

| 前端方法 | 后端接口 | 请求方式 | 说明 |
|---------|---------|---------|------|
| `productsApi.getList()` | `/admin/products/page` | GET | 分页获取商品列表 |
| `productsApi.getDetail()` | `/admin/products/{id}` | GET | 获取商品详情 |
| `productsApi.create()` | `/admin/products` | POST | 创建商品 |
| `productsApi.update()` | `/admin/products/{id}` | PUT | 更新商品 |
| `productsApi.delete()` | `/admin/products/{id}` | DELETE | 删除商品 |
| `productsApi.updateStatus()` | `/admin/products/{id}/status` | PUT | 更新商品状态 |

### 订单管理

| 前端方法 | 后端接口 | 请求方式 | 说明 |
|---------|---------|---------|------|
| `ordersApi.getList()` | `/api/admin/orders` | GET | 分页获取订单列表 |
| `ordersApi.getDetail()` | `/api/admin/orders/{id}` | GET | 获取订单详情 |
| `ordersApi.updateStatus()` | `/api/admin/orders/{id}/status` | PUT | 更新订单状态 |
| `ordersApi.ship()` | `/api/admin/orders/{id}/ship` | PUT | 订单发货 |
| `statsApi.getOrderStats()` | `/api/admin/orders/statistics` | GET | 获取订单统计 |

### 用户管理

| 前端方法 | 后端接口 | 请求方式 | 说明 |
|---------|---------|---------|------|
| `customersApi.getList()` | `/api/admin/users` | GET | 分页获取用户列表 |
| `customersApi.getDetail()` | `/api/admin/users/{id}` | GET | 获取用户详情 |
| `customersApi.updateStatus()` | `/api/admin/users/{id}/status` | PUT | 更新用户状态 |

## 🔐 CORS 配置

后端已配置 CORS，允许前端访问。配置文件：`muying-mall/src/main/java/com/muyingmall/config/CorsConfig.java`

确保配置中包含前端地址：

```java
config.addAllowedOrigin("http://localhost:3000"); // Next.js 开发服务器
```

## 📊 数据格式

### 后端响应格式

```json
{
  "code": 200,
  "message": "Success",
  "data": {...},
  "success": true
}
```

### 前端处理

前端 API 层会自动处理后端响应格式，提取 `data` 字段。

## 🎯 使用示例

### 1. 获取仪表盘数据

```typescript
import { dashboardApi } from '@/lib/api';

// 在组件中使用
const [stats, setStats] = useState(null);

useEffect(() => {
  const fetchStats = async () => {
    try {
      const response = await dashboardApi.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  };
  
  fetchStats();
}, []);
```

### 2. 获取商品列表

```typescript
import { productsApi } from '@/lib/api';

const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsApi.getList(1, 10);
      if (response.success) {
        setProducts(response.data.records);
      }
    } catch (error) {
      console.error('获取商品列表失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchProducts();
}, []);
```

### 3. 更新订单状态

```typescript
import { ordersApi } from '@/lib/api';

const handleUpdateStatus = async (orderId: number, status: string) => {
  try {
    const response = await ordersApi.updateStatus(orderId, status);
    if (response.success) {
      alert('订单状态更新成功');
      // 刷新订单列表
      fetchOrders();
    }
  } catch (error) {
    console.error('更新订单状态失败:', error);
    alert('更新失败');
  }
};
```

## 🔍 调试技巧

### 1. 查看网络请求

打开浏览器开发者工具 (F12) -> Network 标签页，查看 API 请求和响应。

### 2. 检查 CORS 错误

如果出现 CORS 错误，检查：
- 后端 CORS 配置是否正确
- 前端 API_BASE_URL 是否正确
- 后端服务是否正常运行

### 3. 查看控制台日志

前端和后端都会输出日志，帮助定位问题。

## 📝 待实现功能

以下功能需要在组件中实现：

1. **OverviewView.tsx** - 连接仪表盘 API
2. **ProductsView.tsx** - 连接商品管理 API
3. **OrdersView.tsx** - 连接订单管理 API
4. **用户管理页面** - 需要创建新组件
5. **数据分析页面** - 需要创建新组件
6. **系统设置页面** - 需要创建新组件

## 🚀 下一步

1. 实现登录认证功能
2. 添加 JWT Token 处理
3. 实现数据加载状态
4. 添加错误处理
5. 实现数据刷新机制
6. 添加 WebSocket 实时通知

## 📞 技术支持

如有问题，请查看：
- 后端 API 文档：`http://localhost:8080/swagger-ui.html`
- 前端文档：`muying-admin/README.md`
- 集成指南：`muying-admin/INTEGRATION_GUIDE.md`
