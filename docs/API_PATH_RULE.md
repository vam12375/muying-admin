# 📋 API 路径规则说明

## 问题背景

后端配置了 `context-path: /api`，这意味着所有请求都会自动添加 `/api` 前缀。

## 路径规则

### 规则 1: 普通 Controller（路径不包含 /api）

**后端 Controller**:
```java
@RequestMapping("/admin/dashboard")
@RequestMapping("/admin/products")
@RequestMapping("/admin/comments")
// 等等...
```

**前端 API 路径**: 添加 `/api` 前缀
```typescript
fetchApi('/api/admin/dashboard/stats')
fetchApi('/api/admin/products/page')
fetchApi('/api/admin/comments/page')
```

**实际访问路径**:
- `/api` (context-path) + `/admin/dashboard/stats` = `/api/admin/dashboard/stats` ✅

### 规则 2: 特殊 Controller（路径已包含 /api）

**后端 Controller**:
```java
@RequestMapping("/api/admin/orders")  // 注意：已包含 /api
```

**前端 API 路径**: 添加 `/api/api` 前缀
```typescript
fetchApi('/api/api/admin/orders')
fetchApi('/api/api/admin/orders/statistics')
```

**实际访问路径**:
- `/api` (context-path) + `/api/admin/orders` = `/api/api/admin/orders` ✅

## 已修改的 API

### ✅ 完全修改（规则 1）
- Dashboard API → `/api/admin/dashboard/...`
- Products API → `/api/admin/products/...`
- Reviews API → `/api/admin/comments/...`
- Coupons API → `/api/admin/coupon/...`

### ✅ 完全修改（规则 2）
- Orders API → `/api/api/admin/orders/...`

### ⏳ 待验证
以下 API 已按规则 1 修改，但需要在使用时验证：
- Points API
- Messages API
- Logistics API
- After Sales API
- Customers API
- System API
- Brands API
- Categories API
- Upload API

## 如何验证

1. **查看浏览器 Console**
   ```
   [API Request] {
     endpoint: '/api/admin/xxx/...',
     fullUrl: 'http://localhost:8080/api/admin/xxx/...',
     ...
   }
   ```

2. **检查是否有错误**
   - 如果看到 "No static resource" 错误，说明路径不正确
   - 检查后端 Controller 的 `@RequestMapping` 路径
   - 根据是否包含 `/api` 选择对应的规则

3. **修复方法**
   - 如果 Controller 路径不包含 `/api`：使用 `/api/admin/...`
   - 如果 Controller 路径包含 `/api`：使用 `/api/api/admin/...`

## 快速修复命令

如果发现某个 API 路径错误，按以下步骤修复：

1. 查看后端 Controller 的 `@RequestMapping`
2. 确定使用哪个规则
3. 修改前端 `src/lib/api.ts` 中对应的路径

---

**更新时间**: 2024-11-13  
**版本**: v2.1.4
