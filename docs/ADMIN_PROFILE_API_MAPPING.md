# 管理员个人中心 API 路径对照表

## 概述

本文档列出了前端调用的所有API接口及其对应的后端Controller方法，确保前后端完全匹配。

---

## API 路径对照表

### 1. 个人信息管理

| 功能 | 前端方法 | HTTP方法 | 后端路径 | 后端Controller方法 |
|------|---------|---------|---------|-------------------|
| 获取管理员信息 | `getAdminInfo()` | GET | `/admin/info` | `AdminController.getUserInfo()` |
| 更新管理员信息 | `updateAdminInfo()` | PUT | `/admin/update` | `AdminController.updateAdminInfo()` |
| 修改密码 | `updatePassword()` | PUT | `/admin/password` | `AdminController.updatePassword()` |
| 上传头像 | `uploadAvatar()` | POST | `/admin/avatar/upload` | `AdminController.uploadAvatar()` |

### 2. 统计数据

| 功能 | 前端方法 | HTTP方法 | 后端路径 | 后端Controller方法 |
|------|---------|---------|---------|-------------------|
| 获取统计数据 | `getAdminStatistics()` | GET | `/admin/statistics` | `AdminController.getAdminStatistics()` |
| 推送统计数据 | `pushStatistics()` | POST | `/admin/stats/push` | `AdminController.pushStatsUpdate()` |

### 3. 登录记录

| 功能 | 前端方法 | HTTP方法 | 后端路径 | 后端Controller方法 |
|------|---------|---------|---------|-------------------|
| 获取登录记录 | `getLoginRecords()` | GET | `/admin/login-records` | `AdminController.getLoginRecords()` |
| 导出登录记录 | `exportLoginRecords()` | GET | `/admin/login-records/export` | `AdminController.exportLoginRecords()` |

### 4. 操作记录

| 功能 | 前端方法 | HTTP方法 | 后端路径 | 后端Controller方法 |
|------|---------|---------|---------|-------------------|
| 获取操作记录 | `getOperationRecords()` | GET | `/admin/operation-records` | `AdminController.getOperationRecords()` |
| 导出操作记录 | `exportOperationRecords()` | GET | `/admin/operation-records/export` | `AdminController.exportOperationRecords()` |

### 5. 系统日志

| 功能 | 前端方法 | HTTP方法 | 后端路径 | 后端Controller方法 |
|------|---------|---------|---------|-------------------|
| 获取系统日志 | `getSystemLogs()` | GET | `/admin/system/logs` | `AdminController.getSystemLogs()` |
| 获取日志详情 | `getSystemLogDetail()` | GET | `/admin/system/logs/{id}` | `AdminController.getSystemLogDetail()` |

### 6. 通知与WebSocket

| 功能 | 前端方法 | HTTP方法 | 后端路径 | 后端Controller方法 |
|------|---------|---------|---------|-------------------|
| 发送通知 | `sendNotification()` | POST | `/admin/notification/send` | `AdminController.sendSystemNotification()` |
| 获取WebSocket状态 | `getWebSocketStatus()` | GET | `/admin/websocket/status` | `AdminController.getWebSocketStatus()` |

---

## 参数映射说明

### 1. 获取管理员信息

**前端请求**:
```typescript
GET /admin/info
Headers: {
  Authorization: Bearer {token}
}
```

**后端响应**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "nickname": "管理员",
    "avatar": "http://...",
    "email": "admin@example.com",
    "phone": "13800138000",
    "role": "admin",
    "status": 1,
    "createTime": "2024-01-01T00:00:00",
    "lastLogin": null,
    "loginCount": 0
  }
}
```

**字段映射**:
- 后端 `userId` → 前端 `id`
- 其他字段保持一致

### 2. 更新管理员信息

**前端请求**:
```typescript
PUT /admin/update
Body: {
  nickname: "新昵称",
  email: "new@example.com",
  phone: "13900139000"
}
```

**后端处理**:
- 自动从token中获取当前用户ID
- 保护字段：`username`, `role`, `status` 不可修改

### 3. 修改密码

**前端请求**:
```typescript
PUT /admin/password
Body: {
  oldPassword: "旧密码",
  newPassword: "新密码"
}
```

**后端验证**:
- 验证旧密码是否正确
- 加密新密码后保存

### 4. 获取登录记录

**前端请求**:
```typescript
GET /admin/login-records?page=1&size=10&startTime=2024-01-01&endTime=2024-12-31
```

**查询参数**:
- `page`: 页码（默认1）
- `size`: 每页数量（默认10）
- `startTime`: 开始时间（可选）
- `endTime`: 结束时间（可选）
- `loginStatus`: 登录状态（可选）
- `ipAddress`: IP地址（可选）

**后端响应**:
```json
{
  "success": true,
  "data": {
    "records": [...],
    "total": 100,
    "current": 1,
    "size": 10
  }
}
```

### 5. 获取操作记录

**前端请求**:
```typescript
GET /admin/operation-records?page=1&size=10&operationType=CREATE&module=用户管理
```

**查询参数**:
- `page`: 页码（默认1）
- `size`: 每页数量（默认10）
- `startTime`: 开始时间（可选）
- `endTime`: 结束时间（可选）
- `operationType`: 操作类型（可选）
- `module`: 模块名称（可选）
- `operationResult`: 操作结果（可选）

### 6. 获取系统日志

**前端请求**:
```typescript
GET /admin/system/logs?page=1&size=10&level=ERROR
```

**查询参数**:
- `page`: 页码（默认1）
- `size`: 每页数量（默认10）
- `level`: 日志级别（可选）
- `startTime`: 开始时间（可选）
- `endTime`: 结束时间（可选）

**注意**: 后端实际使用 `operationType`, `module`, `operationResult` 参数，而不是 `level`

### 7. 导出功能

**导出登录记录**:
```typescript
GET /admin/login-records/export?startTime=2024-01-01&endTime=2024-12-31
Response: Excel文件 (application/vnd.ms-excel)
```

**导出操作记录**:
```typescript
GET /admin/operation-records/export?startTime=2024-01-01&endTime=2024-12-31
Response: Excel文件 (application/vnd.ms-excel)
```

### 8. 发送通知

**前端请求**:
```typescript
POST /admin/notification/send
Body: {
  message: "通知内容",
  targetAdminId: 1  // 可选，不传则广播给所有人
}
```

### 9. 获取统计数据

**前端请求**:
```typescript
GET /admin/statistics
```

**后端响应**:
```json
{
  "success": true,
  "data": {
    "totalLogins": 1000,
    "todayLogins": 10,
    "weekLogins": 50,
    "monthLogins": 200,
    "totalOperations": 5000,
    "todayOperations": 50,
    "weekOperations": 300,
    "monthOperations": 1000,
    "activeHours": [0, 5, 10, ...],  // 24个数字
    "operationTypes": {
      "CREATE": 100,
      "UPDATE": 200,
      "DELETE": 50
    },
    "accountAge": 365,
    "securityScore": 95
  }
}
```

### 10. WebSocket状态

**前端请求**:
```typescript
GET /admin/websocket/status
```

**后端响应**:
```json
{
  "success": true,
  "data": {
    "onlineCount": 5,
    "onlineAdmins": ["admin1", "admin2"],
    "timestamp": 1699999999999
  }
}
```

---

## 时间格式说明

### 前端传递时间

查询参数中的时间格式：
```
startTime=2024-01-01
endTime=2024-12-31
```

### 后端处理时间

后端会自动补充时间部分：
```java
startDateTime = LocalDateTime.parse(startTime + "T00:00:00");
endDateTime = LocalDateTime.parse(endTime + "T23:59:59");
```

### 后端返回时间

ISO 8601 格式：
```
2024-11-14T10:30:00
```

---

## 认证说明

所有接口都需要在请求头中携带JWT令牌：

```typescript
Headers: {
  Authorization: Bearer {token}
}
```

后端会：
1. 验证token有效性
2. 检查用户角色是否为 `admin`
3. 从token中提取用户信息

---

## 错误处理

### 常见错误码

| 错误码 | 说明 | 处理方式 |
|-------|------|---------|
| 401 | 未认证 | 跳转到登录页 |
| 403 | 无权限 | 提示权限不足 |
| 404 | 资源不存在 | 提示数据不存在 |
| 500 | 服务器错误 | 提示系统繁忙 |

### 错误响应格式

```json
{
  "success": false,
  "code": 401,
  "message": "未提供合法的身份令牌"
}
```

---

## 注意事项

### 1. 文件上传

头像上传使用 `multipart/form-data`：
```typescript
const formData = new FormData();
formData.append('file', file);
```

### 2. 导出功能

导出接口返回二进制流，需要特殊处理：
```typescript
const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = '文件名.xlsx';
a.click();
```

### 3. 分页参数

后端分页从1开始，不是从0开始：
```
page=1  // 第一页
page=2  // 第二页
```

### 4. 日期参数

前端传递日期字符串，后端自动补充时间：
```
前端: startTime=2024-01-01
后端: 2024-01-01T00:00:00
```

---

## 测试建议

### 1. 使用Postman测试

导入Swagger文档后，可以直接测试所有接口。

### 2. 浏览器开发者工具

查看Network标签，确认：
- 请求路径是否正确
- 请求参数是否正确
- 响应数据格式是否正确

### 3. 后端日志

查看后端控制台日志，确认：
- 接口是否被调用
- 参数是否正确解析
- SQL查询是否正确执行

---

**文档版本**: v1.0  
**更新时间**: 2025-11-14  
**遵循协议**: AURA-X-KYS (KISS/YAGNI/SOLID)
