# 🚀 母婴商城后台管理系统 - 快速开始

## 📋 系统要求

- Node.js 20+
- npm 或 yarn
- Java 17+ (后端)
- Maven 3.6+ (后端)
- MySQL 8.0+ (后端)
- Redis (后端)

## 🔧 安装步骤

### 1. 启动后端服务

```bash
# 进入后端目录
cd muying-mall

# 启动 Spring Boot 应用
mvn spring-boot:run
```

后端服务将在 `http://localhost:8080` 启动。

### 2. 安装前端依赖

```bash
# 进入前端目录
cd muying-admin

# 安装依赖
npm install
```

### 3. 配置环境变量

`.env.local` 文件已创建，内容如下：

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

如果后端地址不同，请修改此文件。

### 4. 启动前端开发服务器

```bash
npm run dev
```

前端服务将在 `http://localhost:3000` 启动。

## 🎯 访问系统

打开浏览器访问：**http://localhost:3000**

## 📱 功能导航

### 左侧导航栏（已中文化）

- **仪表盘** - 查看系统概览和统计数据
- **商品管理** - 管理商品信息、库存、价格
- **订单管理** - 处理订单、发货、退款
- **用户管理** - 管理用户信息和权限
- **数据分析** - 查看销售数据和趋势
- **系统设置** - 配置系统参数

## 🔌 API 对接状态

### ✅ 已对接接口

1. **仪表盘统计** - `/admin/dashboard/stats`
2. **商品管理** - `/admin/products/*`
3. **订单管理** - `/api/admin/orders/*`
4. **订单统计** - `/api/admin/orders/statistics`

### 🔄 待对接功能

以下功能需要在组件中实现 API 调用：

1. **OverviewView.tsx** - 仪表盘数据展示
2. **ProductsView.tsx** - 商品列表和管理
3. **OrdersView.tsx** - 订单列表和处理
4. **用户管理页面** - 需要创建
5. **数据分析页面** - 需要创建

## 📝 开发指南

### 调用后端 API

```typescript
import { dashboardApi, productsApi, ordersApi } from '@/lib/api';

// 获取仪表盘数据
const stats = await dashboardApi.getStats();

// 获取商品列表
const products = await productsApi.getList(1, 10);

// 获取订单列表
const orders = await ordersApi.getList(1, 10);
```

### 示例代码

参考 `components/dashboard/DashboardIntegrationExample.tsx` 查看完整的集成示例。

## 🐛 常见问题

### 1. 无法连接后端

**问题**：前端显示网络错误

**解决方案**：
- 检查后端服务是否启动：`http://localhost:8080`
- 检查 `.env.local` 中的 API 地址是否正确
- 查看浏览器控制台的网络请求

### 2. CORS 错误

**问题**：浏览器显示跨域错误

**解决方案**：
- 确认后端 CORS 配置包含 `http://localhost:3000`
- 重启后端服务

### 3. 数据不显示

**问题**：页面加载但没有数据

**解决方案**：
- 打开浏览器开发者工具 (F12)
- 查看 Console 标签页的错误信息
- 查看 Network 标签页的 API 请求状态

## 📚 相关文档

- [后端对接说明](./后端对接说明.md) - 详细的 API 对接文档
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - 英文集成指南
- [README.md](./README.md) - 项目说明
- [COMPONENTS.md](./COMPONENTS.md) - 组件文档

## 🎨 界面预览

### 仪表盘
- 统计卡片：总收入、订单数、商品数、用户数
- 最近订单列表
- 热销商品展示

### 商品管理
- 商品列表表格
- 搜索和筛选功能
- 添加/编辑/删除商品
- 商品状态管理

### 订单管理
- 订单列表表格
- 订单状态筛选
- 订单详情查看
- 发货和退款处理

## 🔐 认证说明

当前版本暂未实现登录认证，直接访问即可使用。

后续版本将添加：
- 管理员登录
- JWT Token 认证
- 权限管理
- 会话管理

## 🚀 生产部署

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

### 使用 PM2 部署

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start npm --name "muying-admin" -- start

# 保存配置
pm2 save

# 设置开机自启
pm2 startup
```

## 📞 技术支持

遇到问题？

1. 查看文档：`后端对接说明.md`
2. 检查后端日志
3. 查看浏览器控制台
4. 检查网络请求

## ✨ 下一步

1. 实现登录功能
2. 连接所有 API 接口
3. 添加数据加载状态
4. 实现错误处理
5. 添加数据刷新功能
6. 实现 WebSocket 实时通知

---

**祝开发顺利！** 🎉
