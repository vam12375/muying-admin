# 管理员个人中心修复文档

## 问题描述

**现象**：
- 用户管理页面显示 admin 用户存在且状态正常
- 个人中心页面显示"需要登录"和"状态异常"

**截图位置**：
- 用户管理：`g:\muying\muying-admin` - 显示正常
- 个人中心：显示异常

## 问题根源

前端个人中心调用了**错误的API接口**：

```typescript
// ❌ 错误：调用普通用户接口
export async function getAdminInfo(): Promise<ApiResponse<AdminInfo>> {
  return fetchApi<AdminInfo>('/user/info');
}
```

**接口对比**：

| 接口路径 | 控制器 | 用途 | 认证方式 |
|---------|--------|------|---------|
| `/user/info` | UserController | 普通用户个人信息 | JWT (SecurityContext) |
| `/admin/info` | AdminController | 管理员基本信息 | Bearer Token |
| `/admin/profile/info` | AdminProfileController | 管理员个人中心（完整信息） | Bearer Token + @PreAuthorize |

## 解决方案

### 修改内容

**文件**：`muying-admin/src/lib/api/profile.ts`

```typescript
// ✅ 正确：调用管理员个人中心接口
export async function getAdminInfo(): Promise<ApiResponse<AdminInfo>> {
  const response = await fetchApi<any>('/admin/profile/info');
  
  // 字段映射：后端返回的字段名与前端类型定义不一致，需要转换
  if (response.success && response.data) {
    const data = response.data;
    response.data = {
      id: data.userId,              // 后端：userId → 前端：id
      username: data.username,
      nickname: data.nickname,
      avatar: data.avatar,
      email: data.email,
      phone: data.phone,
      role: data.role,
      status: data.status,
      createTime: data.createTime,
      lastLogin: data.lastLoginTime, // 后端：lastLoginTime → 前端：lastLogin
      loginCount: data.loginCount
    };
  }
  
  return response as ApiResponse<AdminInfo>;
}
```

### 字段映射说明

后端返回（AdminProfileController）：
```json
{
  "userId": 1,
  "username": "admin",
  "lastLoginTime": "2025-11-14T10:30:00",
  "lastLoginIp": "127.0.0.1",
  "lastLoginLocation": "本地"
}
```

前端期望（AdminInfo 类型）：
```typescript
{
  id: number;           // 映射自 userId
  username: string;
  lastLogin?: string;   // 映射自 lastLoginTime
}
```

## 验证步骤

### 1. 检查后端服务

确保后端服务正在运行：
```bash
# 检查 Spring Boot 应用
curl http://localhost:8080/api/admin/profile/info \
  -H "Authorization: Bearer YOUR_TOKEN"
```

预期响应：
```json
{
  "code": 200,
  "success": true,
  "data": {
    "userId": 1,
    "username": "admin",
    "nickname": "管理员",
    "email": "admin@example.com",
    "phone": "13800138000",
    "role": "admin",
    "status": 1,
    "createTime": "2024-01-01T00:00:00",
    "lastLoginTime": "2025-11-14T10:30:00",
    "lastLoginIp": "127.0.0.1",
    "lastLoginLocation": "本地"
  }
}
```

### 2. 检查前端认证

打开浏览器控制台，检查：

```javascript
// 检查 token 是否存在
console.log('Token:', localStorage.getItem('adminToken'));

// 检查用户信息
console.log('User:', localStorage.getItem('adminUser'));
```

### 3. 测试个人中心页面

1. 访问：`http://localhost:3000/profile`
2. 打开浏览器开发者工具 → Network 标签
3. 查找 `/admin/profile/info` 请求
4. 检查：
   - 请求头是否包含 `Authorization: Bearer xxx`
   - 响应状态码是否为 200
   - 响应数据是否正确

### 4. 检查页面显示

个人中心应该正确显示：
- ✅ 管理员头像（首字母）
- ✅ 用户名和昵称
- ✅ 角色和状态徽章
- ✅ 邮箱、手机号
- ✅ 注册时间和账号年龄
- ✅ 最后登录时间
- ✅ 登录次数统计

## 可能的问题

### 问题1：401 Unauthorized

**原因**：Token 无效或已过期

**解决**：
1. 重新登录获取新 token
2. 检查 JWT 配置（密钥、过期时间）

### 问题2：403 Forbidden

**原因**：用户角色不是 admin

**解决**：
1. 检查数据库 user 表的 role 字段
2. 确保值为 `"admin"`（不是 `"ADMIN"` 或其他）

```sql
-- 检查用户角色
SELECT user_id, username, role, status FROM user WHERE username = 'admin';

-- 如果角色不正确，修正
UPDATE user SET role = 'admin' WHERE username = 'admin';
```

### 问题3：404 Not Found

**原因**：后端路由配置问题

**解决**：
1. 检查 `AdminProfileController` 是否正确注册
2. 检查 `@RequestMapping("/admin/profile")` 注解
3. 重启后端服务

### 问题4：字段显示为 undefined

**原因**：字段映射不正确

**解决**：
1. 检查后端返回的字段名
2. 更新 `getAdminInfo()` 中的字段映射
3. 检查前端类型定义

## 相关文件

### 前端
- `muying-admin/src/lib/api/profile.ts` - API 接口定义
- `muying-admin/src/types/profile.ts` - 类型定义
- `muying-admin/src/views/profile/ProfileView.tsx` - 个人中心页面
- `muying-admin/src/hooks/useAuth.ts` - 认证 Hook

### 后端
- `muying-mall/src/main/java/com/muyingmall/controller/admin/AdminProfileController.java` - 个人中心控制器
- `muying-mall/src/main/java/com/muyingmall/controller/AdminController.java` - 管理员控制器
- `muying-mall/src/main/java/com/muyingmall/controller/UserController.java` - 用户控制器
- `muying-mall/src/main/java/com/muyingmall/security/SecurityConfig.java` - 安全配置

## 设计原则

本次修复遵循以下原则：

### KISS (Keep It Simple, Stupid)
- 直接修改 API 路径，不引入复杂的适配层
- 在 API 层做简单的字段映射

### YAGNI (You Aren't Gonna Need It)
- 只修改必要的代码
- 不添加额外的功能或抽象

### SOLID
- **单一职责**：每个接口只负责一个功能
  - `/user/info` → 普通用户
  - `/admin/info` → 管理员基本信息
  - `/admin/profile/info` → 管理员个人中心
- **接口隔离**：不同角色使用不同的接口

## 后续优化建议

### 1. 统一字段命名
建议后端统一使用 `id` 而不是 `userId`，减少字段映射的需要。

### 2. 添加类型守卫
```typescript
function isAdminInfo(data: any): data is AdminInfo {
  return data && typeof data.id === 'number' && typeof data.username === 'string';
}
```

### 3. 错误处理增强
```typescript
export async function getAdminInfo(): Promise<ApiResponse<AdminInfo>> {
  try {
    const response = await fetchApi<any>('/admin/profile/info');
    // ... 字段映射
    return response;
  } catch (error) {
    console.error('获取管理员信息失败:', error);
    throw error;
  }
}
```

---

**修复时间**：2025-11-14  
**遵循协议**：AURA-X-KYS (KISS/YAGNI/SOLID)  
**修复状态**：✅ 已完成
