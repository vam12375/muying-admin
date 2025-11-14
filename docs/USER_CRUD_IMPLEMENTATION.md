# 用户 CRUD 功能实施文档

## 实施概述

根据 Swagger UI 和需求分析，系统需要两套用户管理接口：

1. **`/admin/users/*`** - 用户基本信息的 CRUD（增删改查）
2. **`/admin/user-accounts/*`** - 用户账户管理（余额、充值、交易）

## 接口对比

### 已存在：用户账户管理 (AdminUserAccountController)

**路径**：`/admin/user-accounts/*`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/admin/user-accounts/page` | 分页获取用户账户列表 |
| GET | `/admin/user-accounts/{userId}` | 获取用户账户详情 |
| POST | `/admin/user-accounts/recharge` | 管理员给用户充值 |
| PUT | `/admin/user-accounts/{userId}/balance` | 调整用户余额 |
| PUT | `/admin/user-accounts/{userId}/status` | 更改账户状态 |
| GET | `/admin/user-accounts/transactions/page` | 获取交易记录列表 |
| GET | `/admin/user-accounts/transactions/{id}` | 获取交易记录详情 |

### 新增：用户信息管理 (AdminUserController)

**路径**：`/admin/users/*`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/admin/users/page` | 分页获取用户列表 |
| GET | `/admin/users/{id}` | 获取用户详情 |
| POST | `/admin/users` | 添加用户 |
| PUT | `/admin/users/{id}` | 更新用户信息 |
| DELETE | `/admin/users/{id}` | 删除用户 |
| PUT | `/admin/users/{id}/role` | 修改用户角色 |
| PUT | `/admin/users/{id}/status` | 修改用户状态 |
| PUT | `/admin/users/{id}/password/reset` | 重置用户密码 |

---

## 已完成工作

### 1. 创建 AdminUserController

**文件**：`muying-mall/src/main/java/com/muyingmall/controller/admin/AdminUserController.java`

功能特性：
- ✅ 分页获取用户列表（支持关键词搜索、状态筛选、角色筛选）
- ✅ 获取用户详情
- ✅ 添加用户（自动检查用户名、邮箱、手机号唯一性）
- ✅ 更新用户信息
- ✅ 删除用户（保护管理员账户）
- ✅ 修改用户角色
- ✅ 修改用户状态（保护管理员账户）
- ✅ 重置用户密码

### 2. 更新 UserService 接口

**文件**：`muying-mall/src/main/java/com/muyingmall/service/UserService.java`

新增方法：
- ✅ `getUserPage()` - 分页获取用户列表
- ✅ `createUser()` - 创建用户
- ✅ `deleteUser()` - 删除用户
- ✅ `updateUserStatus()` - 更新用户状态
- ✅ `updateUserRole()` - 更新用户角色
- ✅ `resetPassword()` - 重置密码
- ✅ `getUserByEmail()` - 通过邮箱获取用户
- ✅ `getUserByPhone()` - 通过手机号获取用户

---

## 待实施工作

### 1. 实现 UserService 方法

需要在 `UserServiceImpl` 中实现以下方法：

```java
@Override
public PageResult<User> getUserPage(Integer page, Integer size, String keyword, Integer status, String role) {
    // 实现分页查询逻辑
}

@Override
public User createUser(User user) {
    // 实现创建用户逻辑
    // 1. 加密密码
    // 2. 设置默认值
    // 3. 保存到数据库
    // 4. 创建用户账户
}

@Override
public boolean deleteUser(Integer userId) {
    // 实现删除用户逻辑
    // 注意：需要级联删除相关数据
}

@Override
public boolean updateUserStatus(Integer userId, Integer status) {
    // 实现更新状态逻辑
}

@Override
public boolean updateUserRole(Integer userId, String role) {
    // 实现更新角色逻辑
}

@Override
public boolean resetPassword(Integer userId, String newPassword) {
    // 实现重置密码逻辑
    // 1. 加密新密码
    // 2. 更新数据库
}

@Override
public User getUserByEmail(String email) {
    // 实现通过邮箱查询用户
}

@Override
public User getUserByPhone(String phone) {
    // 实现通过手机号查询用户
}
```

### 2. 更新 UserMapper

需要在 `UserMapper` 中添加查询方法：

```java
/**
 * 分页查询用户列表
 */
@Select({
    "<script>",
    "SELECT * FROM user",
    "<where>",
    "  <if test='keyword != null and keyword != \"\"'>",
    "    AND (username LIKE CONCAT('%', #{keyword}, '%')",
    "    OR nickname LIKE CONCAT('%', #{keyword}, '%')",
    "    OR email LIKE CONCAT('%', #{keyword}, '%')",
    "    OR phone LIKE CONCAT('%', #{keyword}, '%'))",
    "  </if>",
    "  <if test='status != null'>",
    "    AND status = #{status}",
    "  </if>",
    "  <if test='role != null and role != \"\"'>",
    "    AND role = #{role}",
    "  </if>",
    "</where>",
    "ORDER BY create_time DESC",
    "</script>"
})
IPage<User> getUserPage(Page<User> page, @Param("keyword") String keyword, 
                        @Param("status") Integer status, @Param("role") String role);

/**
 * 通过邮箱查询用户
 */
@Select("SELECT * FROM user WHERE email = #{email}")
User selectByEmail(@Param("email") String email);

/**
 * 通过手机号查询用户
 */
@Select("SELECT * FROM user WHERE phone = #{phone}")
User selectByPhone(@Param("phone") String phone);
```

### 3. 创建前端页面

需要创建用户管理页面，包括：

1. **用户列表页面**：
   - 显示用户列表（用户名、昵称、邮箱、手机号、角色、状态）
   - 搜索功能
   - 筛选功能（状态、角色）
   - 分页功能

2. **用户操作**：
   - 添加用户
   - 编辑用户
   - 删除用户
   - 修改角色
   - 修改状态
   - 重置密码

---

## 实施步骤

### 步骤 1：实现 UserServiceImpl 方法

```bash
# 编辑文件
muying-mall/src/main/java/com/muyingmall/service/impl/UserServiceImpl.java
```

### 步骤 2：更新 UserMapper

```bash
# 编辑文件
muying-mall/src/main/java/com/muyingmall/mapper/UserMapper.java
```

### 步骤 3：编译并重启后端

```bash
cd muying-mall
mvn clean compile
# 在 IDE 中重启服务
```

### 步骤 4：测试 API

使用 Postman 或 Swagger UI 测试新增的接口：

```bash
# 1. 登录获取 token
POST /admin/login

# 2. 测试用户列表
GET /admin/users/page?page=1&size=10

# 3. 测试添加用户
POST /admin/users

# 4. 测试更新用户
PUT /admin/users/{id}

# 5. 测试删除用户
DELETE /admin/users/{id}
```

### 步骤 5：创建前端页面

```bash
# 创建用户管理页面
muying-admin/src/views/users/UsersManagementView.tsx

# 创建用户表单组件
muying-admin/src/components/users/UserFormModal.tsx

# 更新 API 文件
muying-admin/src/lib/api/users.ts
```

---

## 安全考虑

### 1. 权限控制

- ✅ 所有接口都需要管理员权限：`@PreAuthorize("hasRole('ADMIN')")`
- ✅ 不允许删除管理员账户
- ✅ 不允许禁用管理员账户

### 2. 数据验证

- ✅ 用户名唯一性检查
- ✅ 邮箱唯一性检查
- ✅ 手机号唯一性检查
- ✅ 密码长度验证（6-20位）
- ✅ 角色值验证（admin/user）
- ✅ 状态值验证（0/1）

### 3. 敏感信息保护

- ✅ 返回用户信息时清除密码字段
- ✅ 密码加密存储
- ✅ 操作日志记录

---

## 数据库设计

### user 表结构

```sql
CREATE TABLE `user` (
  `user_id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(255) NOT NULL COMMENT '密码',
  `nickname` varchar(50) DEFAULT NULL COMMENT '昵称',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像',
  `gender` varchar(10) DEFAULT NULL COMMENT '性别',
  `birthday` datetime DEFAULT NULL COMMENT '生日',
  `status` int DEFAULT 1 COMMENT '状态：0-禁用，1-正常',
  `role` varchar(20) DEFAULT 'user' COMMENT '角色：admin-管理员，user-普通用户',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_email` (`email`),
  KEY `idx_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

---

## API 文档

### 1. 分页获取用户列表

**请求**：
```http
GET /admin/users/page?page=1&size=10&keyword=test&status=1&role=user
Authorization: Bearer {token}
```

**响应**：
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "total": 100,
    "records": [
      {
        "userId": 1,
        "username": "test",
        "nickname": "测试用户",
        "email": "test@example.com",
        "phone": "13800138000",
        "avatar": "http://...",
        "gender": "male",
        "status": 1,
        "role": "user",
        "createTime": "2025-01-01 00:00:00"
      }
    ],
    "page": 1,
    "size": 10
  }
}
```

### 2. 添加用户

**请求**：
```http
POST /admin/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "newuser",
  "password": "123456",
  "nickname": "新用户",
  "email": "newuser@example.com",
  "phone": "13900139000",
  "role": "user",
  "status": 1
}
```

**响应**：
```json
{
  "code": 200,
  "message": "用户创建成功",
  "data": {
    "userId": 101,
    "username": "newuser",
    "nickname": "新用户",
    ...
  }
}
```

### 3. 更新用户信息

**请求**：
```http
PUT /admin/users/101
Authorization: Bearer {token}
Content-Type: application/json

{
  "nickname": "更新后的昵称",
  "email": "updated@example.com",
  "phone": "13900139001"
}
```

### 4. 删除用户

**请求**：
```http
DELETE /admin/users/101
Authorization: Bearer {token}
```

### 5. 修改用户角色

**请求**：
```http
PUT /admin/users/101/role?role=admin
Authorization: Bearer {token}
```

### 6. 修改用户状态

**请求**：
```http
PUT /admin/users/101/status?status=0
Authorization: Bearer {token}
```

### 7. 重置用户密码

**请求**：
```http
PUT /admin/users/101/password/reset?newPassword=newpass123
Authorization: Bearer {token}
```

---

## 测试清单

- [ ] 分页获取用户列表
- [ ] 搜索功能（用户名、昵称、邮箱、手机号）
- [ ] 状态筛选
- [ ] 角色筛选
- [ ] 添加用户
- [ ] 用户名唯一性检查
- [ ] 邮箱唯一性检查
- [ ] 手机号唯一性检查
- [ ] 更新用户信息
- [ ] 删除用户
- [ ] 保护管理员账户（不能删除）
- [ ] 修改用户角色
- [ ] 修改用户状态
- [ ] 保护管理员账户（不能禁用）
- [ ] 重置用户密码
- [ ] 权限控制（需要管理员权限）

---

## 相关文档

- [用户账户管理实施文档](./USER_MODULE_IMPLEMENTATION.md)
- [用户模块完整修复方案](./USER_MODULE_COMPLETE_FIX.md)
- [用户模块 API 测试指南](./USER_MODULE_API_TEST.md)

---

**创建时间**：2025-11-14  
**遵循协议**：AURA-X-KYS (KISS/YAGNI/SOLID)

**下一步**：实现 UserServiceImpl 中的方法
