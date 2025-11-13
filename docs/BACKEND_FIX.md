# 🔧 后端路径修复说明

## 问题根源

后端配置文件 `application.yml` 中设置了：

```yaml
server:
  servlet:
    context-path: /api
```

这意味着所有请求都会自动添加 `/api` 前缀。

但是 `AdminOrderController` 中又定义了：

```java
@RequestMapping("/api/admin/orders")
```

这导致实际的访问路径变成了：`/api/api/admin/orders`（重复了 `/api`）

## 修复方案

### 已修复

**文件**: `muying-mall/src/main/java/com/muyingmall/controller/admin/AdminOrderController.java`

**修改前**:
```java
@RequestMapping("/api/admin/orders")
```

**修改后**:
```java
@RequestMapping("/admin/orders")
```

### 正确的访问路径

由于 `context-path` 设置为 `/api`，所以：

| Controller 路径 | 实际访问路径 |
|----------------|-------------|
| `/admin/orders` | `/api/admin/orders` |
| `/admin/dashboard` | `/api/admin/dashboard` |
| `/admin/products` | `/api/admin/products` |

## 验证修复

### 1. 重启后端服务

```bash
# 停止当前服务 (Ctrl+C)
cd muying-mall
mvn spring-boot:run
```

### 2. 测试 API

访问 Swagger UI：
```
http://localhost:8080/swagger-ui/index.html
```

查看 API 路径是否正确。

### 3. 测试前端

刷新前端页面，查看订单管理是否正常显示。

## 其他 Controller 检查

以下 Controller 的路径是正确的（已确认）：

- ✅ `DashboardController` - `/admin/dashboard`
- ✅ `AdminOrderController` - `/admin/orders` (已修复)

其他 Controller 应该也遵循相同的模式（不包含 `/api` 前缀）。

## 注意事项

1. **所有 Controller 的 `@RequestMapping` 都不应该包含 `/api` 前缀**
2. **前端 API 调用应该包含 `/api` 前缀**（因为 `context-path` 会自动添加）
3. **Swagger UI 会自动处理 `context-path`**

## 前端 API 配置

前端的 API 路径配置是正确的：

```typescript
// src/lib/api.ts
const API_BASE_URL = 'http://localhost:8080';

// 订单 API
export const ordersApi = {
  getList: async (...) => {
    return fetchApi<any>('/api/admin/orders?...');
    // 实际请求: http://localhost:8080/api/admin/orders
  }
};
```

由于 `context-path` 是 `/api`，所以前端请求 `/api/admin/orders` 时：
- 完整 URL: `http://localhost:8080/api/admin/orders`
- Spring Boot 会去掉 `context-path` (`/api`)
- 路由到 Controller: `/admin/orders`
- 匹配到: `@RequestMapping("/admin/orders")`

---

**修复时间**: 2024-11-13  
**版本**: v2.1.2
