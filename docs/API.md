# API 文档 | API Documentation

母婴商城后台管理系统 API 接口文档。

API documentation for MomBaby Admin Dashboard.

---

## 📋 目录 | Table of Contents

- [基础信息](#基础信息--base-information)
- [认证接口](#认证接口--authentication)
- [商品管理](#商品管理--products)
- [订单管理](#订单管理--orders)
- [用户管理](#用户管理--users)
- [优惠券管理](#优惠券管理--coupons)
- [积分管理](#积分管理--points)
- [消息管理](#消息管理--messages)
- [物流管理](#物流管理--logistics)
- [系统设置](#系统设置--system)

---

## 🔧 基础信息 | Base Information

### API 基础地址 | Base URL

```
开发环境 Development: http://localhost:8080
生产环境 Production: https://api.yourdomain.com
```

### 请求头 | Request Headers

```http
Content-Type: application/json
Authorization: Bearer {token}
```

### 响应格式 | Response Format

```typescript
interface ApiResponse<T> {
  code: number;        // 状态码 | Status code
  message: string;     // 消息 | Message
  data: T;            // 数据 | Data
  timestamp?: number; // 时间戳 | Timestamp
}
```

### 状态码 | Status Codes

| 状态码 Code | 说明 Description |
|------------|------------------|
| 200 | 成功 Success |
| 400 | 请求错误 Bad Request |
| 401 | 未授权 Unauthorized |
| 403 | 禁止访问 Forbidden |
| 404 | 未找到 Not Found |
| 500 | 服务器错误 Server Error |

---

## 🔐 认证接口 | Authentication

### 登录 | Login

```http
POST /api/auth/login
```

**请求体 | Request Body:**

```json
{
  "username": "admin",
  "password": "password123"
}
```

**响应 | Response:**

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "name": "管理员",
      "role": "admin",
      "avatar": "https://..."
    }
  }
}
```

### 登出 | Logout

```http
POST /api/auth/logout
```

**响应 | Response:**

```json
{
  "code": 200,
  "message": "登出成功"
}
```

### 刷新 Token | Refresh Token

```http
POST /api/auth/refresh
```

**请求体 | Request Body:**

```json
{
  "refreshToken": "..."
}
```

---

## 📦 商品管理 | Products

### 获取商品列表 | Get Product List

```http
GET /api/products?page=1&size=10&keyword=&categoryId=
```

**查询参数 | Query Parameters:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| size | number | 否 | 每页数量，默认 10 |
| keyword | string | 否 | 搜索关键词 |
| categoryId | number | 否 | 分类 ID |

**响应 | Response:**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "婴儿奶粉",
        "price": 299.00,
        "stock": 100,
        "category": "奶粉",
        "status": "on_sale",
        "image": "https://...",
        "createdAt": "2024-11-15T10:00:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "size": 10
  }
}
```

### 获取商品详情 | Get Product Detail

```http
GET /api/products/{id}
```

### 创建商品 | Create Product

```http
POST /api/products
```

**请求体 | Request Body:**

```json
{
  "name": "婴儿奶粉",
  "price": 299.00,
  "stock": 100,
  "categoryId": 1,
  "description": "优质婴儿奶粉",
  "images": ["https://..."],
  "specs": {
    "weight": "900g",
    "brand": "某品牌"
  }
}
```

### 更新商品 | Update Product

```http
PUT /api/products/{id}
```

### 删除商品 | Delete Product

```http
DELETE /api/products/{id}
```

### 批量删除商品 | Batch Delete Products

```http
POST /api/products/batch-delete
```

**请求体 | Request Body:**

```json
{
  "ids": [1, 2, 3]
}
```

---

## 📋 订单管理 | Orders

### 获取订单列表 | Get Order List

```http
GET /api/orders?page=1&size=10&status=&keyword=
```

**查询参数 | Query Parameters:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码 |
| size | number | 否 | 每页数量 |
| status | string | 否 | 订单状态 |
| keyword | string | 否 | 搜索关键词 |

**响应 | Response:**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "ORD20241115001",
        "userId": 1,
        "userName": "张三",
        "totalAmount": 599.00,
        "status": "pending",
        "items": [
          {
            "productId": 1,
            "productName": "婴儿奶粉",
            "quantity": 2,
            "price": 299.00
          }
        ],
        "createdAt": "2024-11-15T10:00:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "size": 10
  }
}
```

### 获取订单详情 | Get Order Detail

```http
GET /api/orders/{id}
```

### 更新订单状态 | Update Order Status

```http
PUT /api/orders/{id}/status
```

**请求体 | Request Body:**

```json
{
  "status": "shipped",
  "remark": "已发货"
}
```

### 取消订单 | Cancel Order

```http
POST /api/orders/{id}/cancel
```

---

## 👥 用户管理 | Users

### 获取用户列表 | Get User List

```http
GET /api/users?page=1&size=10&keyword=&status=
```

**响应 | Response:**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "username": "user001",
        "name": "张三",
        "phone": "13800138000",
        "email": "user@example.com",
        "status": "active",
        "points": 1000,
        "level": "VIP",
        "createdAt": "2024-11-15T10:00:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "size": 10
  }
}
```

### 获取用户详情 | Get User Detail

```http
GET /api/users/{id}
```

### 创建用户 | Create User

```http
POST /api/users
```

### 更新用户 | Update User

```http
PUT /api/users/{id}
```

### 删除用户 | Delete User

```http
DELETE /api/users/{id}
```

### 更新用户状态 | Update User Status

```http
PUT /api/users/{id}/status
```

**请求体 | Request Body:**

```json
{
  "status": "active" // active | inactive | banned
}
```

---

## 🎁 优惠券管理 | Coupons

### 获取优惠券列表 | Get Coupon List

```http
GET /api/coupons?page=1&size=10&status=
```

**响应 | Response:**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "新人优惠券",
        "code": "NEW2024",
        "type": "discount", // discount | fixed
        "value": 10, // 折扣 10% 或 固定金额 10 元
        "minAmount": 100,
        "maxDiscount": 50,
        "total": 1000,
        "used": 100,
        "startTime": "2024-11-01T00:00:00Z",
        "endTime": "2024-12-31T23:59:59Z",
        "status": "active"
      }
    ],
    "total": 50,
    "page": 1,
    "size": 10
  }
}
```

### 创建优惠券 | Create Coupon

```http
POST /api/coupons
```

**请求体 | Request Body:**

```json
{
  "name": "新人优惠券",
  "code": "NEW2024",
  "type": "discount",
  "value": 10,
  "minAmount": 100,
  "maxDiscount": 50,
  "total": 1000,
  "startTime": "2024-11-01T00:00:00Z",
  "endTime": "2024-12-31T23:59:59Z"
}
```

### 更新优惠券 | Update Coupon

```http
PUT /api/coupons/{id}
```

### 删除优惠券 | Delete Coupon

```http
DELETE /api/coupons/{id}
```

---

## 🏆 积分管理 | Points

### 获取积分记录 | Get Points Records

```http
GET /api/points?page=1&size=10&userId=&type=
```

**响应 | Response:**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "userId": 1,
        "userName": "张三",
        "type": "earn", // earn | spend
        "points": 100,
        "reason": "购物消费",
        "balance": 1000,
        "createdAt": "2024-11-15T10:00:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "size": 10
  }
}
```

### 调整用户积分 | Adjust User Points

```http
POST /api/points/adjust
```

**请求体 | Request Body:**

```json
{
  "userId": 1,
  "points": 100,
  "type": "earn", // earn | spend
  "reason": "活动奖励"
}
```

---

## 📢 消息管理 | Messages

### 获取消息列表 | Get Message List

```http
GET /api/messages?page=1&size=10&type=&status=
```

### 创建消息 | Create Message

```http
POST /api/messages
```

**请求体 | Request Body:**

```json
{
  "title": "系统通知",
  "content": "系统将于今晚维护",
  "type": "system", // system | user | order
  "targetType": "all", // all | user | group
  "targetIds": []
}
```

### 发送消息 | Send Message

```http
POST /api/messages/{id}/send
```

### 删除消息 | Delete Message

```http
DELETE /api/messages/{id}
```

---

## 🚚 物流管理 | Logistics

### 获取物流列表 | Get Logistics List

```http
GET /api/logistics?page=1&size=10&status=
```

### 获取物流详情 | Get Logistics Detail

```http
GET /api/logistics/{id}
```

### 更新物流信息 | Update Logistics

```http
PUT /api/logistics/{id}
```

**请求体 | Request Body:**

```json
{
  "company": "顺丰速运",
  "trackingNumber": "SF1234567890",
  "status": "in_transit",
  "currentLocation": "北京分拨中心"
}
```

---

## ⚙️ 系统设置 | System

### 获取系统配置 | Get System Config

```http
GET /api/system/config
```

### 更新系统配置 | Update System Config

```http
PUT /api/system/config
```

### 获取操作日志 | Get Operation Logs

```http
GET /api/system/logs?page=1&size=10&type=&userId=
```

**响应 | Response:**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "userId": 1,
        "userName": "admin",
        "action": "create_product",
        "module": "products",
        "ip": "192.168.1.1",
        "userAgent": "Mozilla/5.0...",
        "createdAt": "2024-11-15T10:00:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "size": 10
  }
}
```

### 获取系统统计 | Get System Statistics

```http
GET /api/system/statistics
```

**响应 | Response:**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "users": {
      "total": 10000,
      "active": 8000,
      "new": 100
    },
    "orders": {
      "total": 5000,
      "pending": 100,
      "completed": 4500
    },
    "revenue": {
      "today": 10000,
      "month": 300000,
      "year": 3000000
    }
  }
}
```

---

## 🔍 通用查询参数 | Common Query Parameters

### 分页参数 | Pagination

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | number | 1 | 页码 |
| size | number | 10 | 每页数量 |

### 排序参数 | Sorting

| 参数 | 类型 | 说明 |
|------|------|------|
| sortBy | string | 排序字段 |
| sortOrder | string | asc 或 desc |

### 搜索参数 | Search

| 参数 | 类型 | 说明 |
|------|------|------|
| keyword | string | 搜索关键词 |

---

## 📝 错误处理 | Error Handling

### 错误响应格式 | Error Response Format

```json
{
  "code": 400,
  "message": "请求参数错误",
  "errors": [
    {
      "field": "username",
      "message": "用户名不能为空"
    }
  ]
}
```

### 常见错误码 | Common Error Codes

| 错误码 | 说明 |
|--------|------|
| 1001 | 参数验证失败 |
| 1002 | 资源不存在 |
| 1003 | 权限不足 |
| 1004 | Token 过期 |
| 1005 | Token 无效 |
| 2001 | 数据库错误 |
| 2002 | 外部服务错误 |

---

## 🔐 认证说明 | Authentication

### JWT Token

所有需要认证的接口都需要在请求头中携带 Token：

All authenticated endpoints require a token in the request header:

```http
Authorization: Bearer {token}
```

### Token 过期处理 | Token Expiration

- Access Token 有效期：2 小时
- Refresh Token 有效期：7 天
- Token 过期后需要使用 Refresh Token 获取新的 Access Token

---

## 📊 速率限制 | Rate Limiting

| 接口类型 | 限制 |
|---------|------|
| 登录接口 | 5 次/分钟 |
| 普通接口 | 100 次/分钟 |
| 批量操作 | 10 次/分钟 |

---

## 🧪 测试环境 | Testing

### 测试账号 | Test Accounts

```
管理员 Admin:
username: admin
password: admin123

普通用户 User:
username: user
password: user123
```

### Postman Collection

可以导入 Postman Collection 进行 API 测试。

Import Postman Collection for API testing.

---

## 📞 技术支持 | Support

如有 API 相关问题，请联系：

For API-related questions, please contact:

- 📧 Email: api@example.com
- 📖 文档: [API Documentation](./API.md)

---

**最后更新 | Last Updated**: 2024-11-15
