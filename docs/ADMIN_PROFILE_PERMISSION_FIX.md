# 管理员个人中心权限修复

## 问题描述

**错误日志**：
```
No static resource admin/profile/info
No static resource admin/profile/statistics
```

**根本原因**：
`AdminProfileController` 使用了错误的权限注解：
- 使用：`@PreAuthorize("hasRole('ADMIN')")`
- 问题：`hasRole()` 会自动添加 `ROLE_` 前缀，检查 `ROLE_ADMIN`
- 实际：JWT 过滤器设置的权限是 `admin`（小写，无前缀）

## 解决方案

### 修改文件
`muying-mall/src/main/java/com/muyingmall/controller/admin/AdminProfileController.java`

### 修改内容

**修改前**：
```java
@PreAuthorize("hasRole('ADMIN')")
public class AdminProfileController {
```

**修改后**：
```java
@PreAuthorize("hasAuthority('admin')")
public class AdminProfileController {
```

### 原理说明

Spring Security 的两种权限检查方式：

| 注解 | 检查内容 | 示例 | 说明 |
|------|---------|------|------|
| `hasRole('ADMIN')` | `ROLE_ADMIN` | 自动添加 `ROLE_` 前缀 | 用于基于角色的访问控制 |
| `hasAuthority('admin')` | `admin` | 直接匹配权限字符串 | 用于基于权限的访问控制 |

**JWT 过滤器设置的权限**：
```java
// JwtAuthenticationFilter.java
Collections.singletonList(new SimpleGrantedAuthority(role))
// role = "admin" (从 JWT token 中获取)
```

**其他控制器的做法**：
```java
// AdminController.java
@PreAuthorize("hasAuthority('admin')")

// SystemController.java  
@PreAuthorize("hasAuthority('admin')")

// AdminUserAccountController.java
@PreAuthorize("hasRole('ADMIN')")  // ❌ 这个也需要修复
```

## 重启后端服务

### 方法1：IDEA 重启
1. 停止当前运行的 Spring Boot 应用
2. 点击"Run"按钮重新启动

### 方法2：命令行重启
```bash
# 停止当前进程（Ctrl+C）
# 然后重新启动
cd g:\muying\muying-mall
mvn spring-boot:run
```

### 方法3：热重载（如果启用了 DevTools）
- 保存文件后自动重新加载
- 无需手动重启

## 验证修复

### 1. 检查后端日志

启动后应该看到：
```
Started MuyingMallApplication in X.XXX seconds
```

**不应该看到**：
```
No static resource admin/profile/info
No static resource admin/profile/statistics
```

### 2. 测试 API 请求

使用 curl 或 Postman 测试：

```bash
curl -X GET http://localhost:8080/api/admin/profile/info \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

**预期响应**：
```json
{
  "code": 200,
  "success": true,
  "data": {
    "userId": 1,
    "username": "admin",
    "nickname": "管理员",
    ...
  }
}
```

**不应该返回**：
- `403 Forbidden`
- `404 Not Found`
- `No static resource`

### 3. 测试前端页面

1. 访问：`http://localhost:3000/profile`
2. 打开浏览器开发者工具 → Network 标签
3. 查看 `/admin/profile/info` 请求
4. 状态码应该是 `200 OK`

## 其他需要修复的控制器

以下控制器也使用了 `hasRole`，建议统一修改为 `hasAuthority`：

### AdminUserAccountController.java
```java
// 修改前
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserAccountController {

// 修改后
@PreAuthorize("hasAuthority('admin')")
public class AdminUserAccountController {
```

### 检查所有使用 hasRole 的地方
```bash
# 在项目根目录执行
grep -r "hasRole" src/main/java/com/muyingmall/controller/
```

## 长期解决方案

### 方案A：统一使用 hasAuthority（推荐）
- 修改所有控制器使用 `hasAuthority('admin')`
- 优点：与 JWT 过滤器保持一致
- 缺点：需要修改多个文件

### 方案B：修改 JWT 过滤器添加 ROLE_ 前缀
```java
// JwtAuthenticationFilter.java
Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
```
- 优点：只需修改一个文件
- 缺点：可能影响其他已有的权限检查

### 方案C：同时支持两种方式
```java
List<GrantedAuthority> authorities = Arrays.asList(
    new SimpleGrantedAuthority(role),           // admin
    new SimpleGrantedAuthority("ROLE_" + role)  // ROLE_admin
);
```
- 优点：兼容性最好
- 缺点：权限列表冗余

**推荐使用方案A**，因为：
1. 符合 KISS 原则（保持简单）
2. 与现有代码风格一致
3. 避免权限冗余

## 相关文件

- `muying-mall/src/main/java/com/muyingmall/controller/admin/AdminProfileController.java`
- `muying-mall/src/main/java/com/muyingmall/security/JwtAuthenticationFilter.java`
- `muying-mall/src/main/java/com/muyingmall/security/SecurityConfig.java`

## 测试清单

- [ ] 后端服务成功启动
- [ ] 没有"No static resource"错误
- [ ] `/admin/profile/info` 返回 200
- [ ] `/admin/profile/statistics` 返回 200
- [ ] 前端个人中心页面正常显示
- [ ] 用户信息正确加载
- [ ] 统计数据正确显示

---

**修复时间**：2025-11-14  
**遵循协议**：AURA-X-KYS (KISS/YAGNI/SOLID)  
**修复状态**：✅ 已完成
