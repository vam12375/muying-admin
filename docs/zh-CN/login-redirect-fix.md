# 登录跳转问题修复说明

## 🐛 问题描述

登录成功后显示"操作成功"，但没有跳转到仪表盘页面。

## 🔍 问题原因

1. **认证 Hook 冲突**：`useAuth` Hook 在检查认证时，如果没有 token 会立即跳转到登录页，可能导致刚登录完成后又被重定向回登录页。

2. **路由跳转时机**：使用 `router.push()` 可能在 localStorage 还未完全保存时就开始跳转。

3. **响应数据格式**：后端返回的数据格式可能与前端期望的不完全一致。

## ✅ 修复方案

### 1. 修改 `hooks/useAuth.ts`

**主要改进：**
- 添加路径检查，避免在登录页重复跳转
- 添加详细的调试日志
- 改进错误处理逻辑

```typescript
// 关键修改
const pathname = usePathname();

if (!token) {
  // 只在非登录页时才跳转
  if (pathname !== '/login') {
    router.push('/login');
  }
  setLoading(false);
  return;
}
```

### 2. 修改 `app/login/page.tsx`

**主要改进：**
- 兼容多种后端响应格式
- 添加详细的调试日志
- 使用 `window.location.href` 进行完全刷新跳转

```typescript
// 兼容多种响应格式
const isSuccess = data.success === true || data.code === 200;
const token = data.data?.token || data.token;
const user = data.data?.user || data.user;

// 使用完全刷新跳转
window.location.href = '/';
```

## 🔍 调试步骤

### 1. 打开浏览器控制台

按 F12 打开开发者工具，查看 Console 标签页。

### 2. 尝试登录

输入用户名和密码，点击登录按钮。

### 3. 查看控制台输出

应该看到以下日志：

```
后端返回数据: {code: 200, message: "操作成功", data: {...}, success: true}
登录成功，Token 已保存
Token: eyJhbGciOiJIUzI1NiJ9...
User: {id: 1, username: "admin", ...}
```

### 4. 检查 localStorage

在控制台中输入：
```javascript
localStorage.getItem('adminToken')
localStorage.getItem('adminUser')
```

应该能看到保存的数据。

### 5. 检查页面跳转

登录成功后，页面应该自动跳转到 `/` 并显示仪表盘。

## 📊 后端响应格式

### 标准格式（CommonResult）

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "nickname": "管理员",
      "avatar": null,
      "role": "admin"
    }
  },
  "success": true
}
```

### 前端兼容处理

前端代码现在可以兼容以下格式：

1. **标准格式**：`data.success && data.data.token`
2. **简化格式**：`data.code === 200 && data.token`
3. **直接格式**：`data.token`

## 🎯 常见问题

### 1. 登录后立即跳回登录页

**原因：** Token 没有正确保存或认证检查失败

**解决方案：**
```javascript
// 在控制台检查
console.log('Token:', localStorage.getItem('adminToken'));
console.log('User:', localStorage.getItem('adminUser'));
```

如果没有数据，说明保存失败。检查：
- 浏览器是否禁用了 localStorage
- 是否在隐私模式下运行

### 2. 显示"操作成功"但不跳转

**原因：** 后端返回的数据格式不符合预期

**解决方案：**
查看控制台的"后端返回数据"日志，确认：
- `success` 字段是否为 `true` 或 `code` 是否为 `200`
- `data.token` 或 `token` 字段是否存在

### 3. 跳转后显示"加载中..."

**原因：** 认证检查卡住了

**解决方案：**
查看控制台的认证检查日志：
```
认证检查 - Token: 存在
当前路径: /
用户已登录: admin
```

如果看不到这些日志，说明认证检查有问题。

### 4. 控制台显示 CORS 错误

**原因：** 后端 CORS 配置问题

**解决方案：**
确认后端 `CorsConfig.java` 中包含：
```java
config.addAllowedOrigin("http://localhost:3000");
```

## 🔧 手动测试步骤

### 1. 清除所有数据

```javascript
// 在控制台执行
localStorage.clear();
location.reload();
```

### 2. 访问登录页

访问：http://localhost:3000/login

### 3. 输入测试账号

- 用户名：admin
- 密码：（你的管理员密码）

### 4. 点击登录

观察控制台输出和页面跳转。

### 5. 验证登录状态

成功登录后，应该：
- ✅ 看到仪表盘页面
- ✅ 侧边栏显示导航菜单
- ✅ 顶部显示用户信息
- ✅ localStorage 中有 token 和 user 数据

## 📝 调试命令

### 查看当前登录状态

```javascript
// 在浏览器控制台执行
console.log('Token:', localStorage.getItem('adminToken'));
console.log('User:', JSON.parse(localStorage.getItem('adminUser') || '{}'));
```

### 手动设置登录状态（测试用）

```javascript
// 设置测试 token
localStorage.setItem('adminToken', 'test-token-123');
localStorage.setItem('adminUser', JSON.stringify({
  username: 'admin',
  nickname: '管理员',
  role: 'admin'
}));

// 刷新页面
location.reload();
```

### 清除登录状态

```javascript
localStorage.removeItem('adminToken');
localStorage.removeItem('adminUser');
location.reload();
```

## ✅ 验证修复

修复完成后，应该能够：

1. ✅ 访问登录页面
2. ✅ 输入用户名和密码
3. ✅ 点击登录按钮
4. ✅ 看到控制台日志
5. ✅ 自动跳转到仪表盘
6. ✅ 看到统计数据和导航菜单
7. ✅ 刷新页面后仍然保持登录状态

## 🚀 下一步

登录成功后，你可以：

1. **查看仪表盘** - 查看统计数据
2. **管理商品** - 点击"商品管理"
3. **处理订单** - 点击"订单管理"
4. **退出登录** - 点击侧边栏底部的"退出登录"

## 📞 需要帮助？

如果仍然无法登录，请：

1. 检查后端服务是否正常运行
2. 查看浏览器控制台的完整日志
3. 查看后端控制台的日志
4. 确认数据库中有管理员账号
5. 使用 Postman 直接测试后端登录接口

---

**修复完成！** 🎉

现在登录功能应该正常工作了。
