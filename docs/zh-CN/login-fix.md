# 登录问题修复说明

## 🐛 问题描述

登录时出现错误，无法成功登录系统。

## 🔍 问题原因

前端发送的登录参数与后端期望的参数名称不匹配：

**前端发送：**
```json
{
  "username": "admin",
  "password": "123456"
}
```

**后端期望：**
```json
{
  "admin_name": "admin",
  "admin_pass": "123456"
}
```

## ✅ 修复方案

### 修改文件：`app/login/page.tsx`

**修改前：**
```typescript
body: JSON.stringify({ username, password }),
```

**修改后：**
```typescript
body: JSON.stringify({ 
  admin_name: username, 
  admin_pass: password 
}),
```

## 🚀 测试步骤

1. **确保后端已启动**
   ```bash
   cd muying-mall
   mvn spring-boot:run
   ```

2. **确保前端已启动**
   ```bash
   cd muying-admin
   npm run dev
   ```

3. **访问登录页面**
   - 打开浏览器：http://localhost:3000
   - 应该看到登录页面

4. **测试登录**
   - 输入管理员用户名
   - 输入密码
   - 点击"登录"按钮
   - 应该成功跳转到仪表盘

## 📝 后端接口说明

### 登录接口

**URL:** `POST /api/admin/login`

**请求参数：**
```json
{
  "admin_name": "管理员用户名",
  "admin_pass": "管理员密码"
}
```

**成功响应：**
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "token": "JWT_TOKEN_HERE",
    "user": {
      "id": 1,
      "username": "admin",
      "nickname": "管理员",
      "avatar": "头像URL",
      "role": "admin"
    }
  },
  "success": true
}
```

**失败响应：**
```json
{
  "code": 500,
  "message": "用户名或密码错误",
  "data": null,
  "success": false
}
```

## 🔐 创建管理员账号

如果数据库中没有管理员账号，需要先创建：

### 方法1：通过数据库直接插入

```sql
-- 插入管理员用户（密码需要使用 BCrypt 加密）
INSERT INTO user (username, password, nickname, role, status, create_time, update_time)
VALUES (
  'admin',
  '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', -- 密码: admin123
  '系统管理员',
  'admin',
  1,
  NOW(),
  NOW()
);
```

### 方法2：使用 BCrypt 在线工具

1. 访问 BCrypt 在线加密工具
2. 输入你想要的密码
3. 生成 BCrypt 哈希值
4. 将哈希值插入数据库

### 方法3：通过后端代码生成

```java
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "admin123";
        String encodedPassword = encoder.encode(rawPassword);
        System.out.println("加密后的密码: " + encodedPassword);
    }
}
```

## 🎯 常见问题

### 1. 登录后立即跳回登录页

**原因：** Token 没有正确保存或认证检查失败

**解决方案：**
- 检查浏览器控制台是否有错误
- 检查 localStorage 中是否有 `adminToken`
- 检查后端 JWT 配置是否正确

### 2. 提示"该账号没有管理员权限"

**原因：** 用户的 role 字段不是 'admin'

**解决方案：**
```sql
-- 更新用户角色为管理员
UPDATE user SET role = 'admin' WHERE username = 'your_username';
```

### 3. 提示"用户名或密码错误"

**原因：** 
- 用户名不存在
- 密码不正确
- 密码加密方式不匹配

**解决方案：**
- 检查数据库中是否有该用户
- 确认密码是否使用 BCrypt 加密
- 尝试重新设置密码

## 📊 调试技巧

### 1. 查看浏览器控制台

按 F12 打开开发者工具：
- **Console 标签页**：查看 JavaScript 错误
- **Network 标签页**：查看 API 请求和响应

### 2. 查看后端日志

后端控制台会显示详细的请求日志：
```
DEBUG o.s.security.web.FilterChainProxy : Securing POST /admin/login
```

### 3. 使用 Postman 测试

直接测试后端接口：
```
POST http://localhost:8080/api/admin/login
Content-Type: application/json

{
  "admin_name": "admin",
  "admin_pass": "admin123"
}
```

## ✅ 修复确认

修复完成后，应该能够：
- ✅ 成功访问登录页面
- ✅ 输入用户名和密码
- ✅ 点击登录按钮
- ✅ 看到"登录中..."提示
- ✅ 成功跳转到仪表盘
- ✅ 看到统计数据

## 📞 需要帮助？

如果仍然无法登录，请检查：
1. 后端服务是否正常启动
2. 数据库连接是否正常
3. Redis 服务是否启动
4. 管理员账号是否存在
5. 密码是否正确

---

**修复完成！** 🎉

现在可以正常登录系统了。
