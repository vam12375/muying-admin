# 管理员个人中心测试指南

## 快速测试步骤

### 1. 启动服务

#### 后端服务
```bash
cd g:\muying\muying-mall
mvn spring-boot:run
```

等待看到：
```
Started MuyingMallApplication in X.XXX seconds
```

#### 前端服务
```bash
cd g:\muying\muying-admin
npm run dev
```

等待看到：
```
Ready on http://localhost:3000
```

### 2. 登录测试

1. 访问：`http://localhost:3000/login`
2. 输入管理员账号：
   - 用户名：`admin`
   - 密码：（你的管理员密码）
3. 点击"登录"

**预期结果**：
- ✅ 成功跳转到首页
- ✅ 浏览器控制台显示：`用户已登录: admin`
- ✅ localStorage 中存在 `adminToken` 和 `adminUser`

### 3. 访问个人中心

1. 点击左侧菜单"个人中心"或直接访问：`http://localhost:3000/profile`
2. 打开浏览器开发者工具（F12）→ Network 标签

**预期请求**：
```
Request URL: http://localhost:3000/api/admin/profile/info
Request Method: GET
Status Code: 200 OK
```

**预期请求头**：
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
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
    "avatar": null,
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

### 4. 验证页面显示

#### 左侧卡片（管理员信息）
- ✅ 显示头像（首字母圆形图标）
- ✅ 显示昵称或用户名
- ✅ 显示角色徽章："系统管理员"
- ✅ 显示状态徽章："正常"（绿色）或"已禁用"（红色）
- ✅ 显示用户名
- ✅ 显示邮箱（带"已验证"徽章）
- ✅ 显示手机号
- ✅ 显示注册时间和账号年龄
- ✅ 显示最后登录时间

#### 右侧统计卡片
- ✅ 登录次数（蓝色卡片）
- ✅ 操作记录（绿色卡片）
- ✅ 账号状态（紫色卡片）

#### 标签页
- ✅ 统计概览
- ✅ 登录记录
- ✅ 操作记录

### 5. 控制台检查

打开浏览器控制台（F12）→ Console 标签

**预期日志**：
```
[API Request] {
  endpoint: '/admin/profile/info',
  fullUrl: 'http://localhost:3000/api/admin/profile/info',
  method: 'GET',
  hasToken: true
}

[API Response Status] {
  endpoint: '/admin/profile/info',
  status: 200,
  statusText: 'OK',
  ok: true
}

[API Response Data] {
  endpoint: '/admin/profile/info',
  result: { code: 200, success: true, data: {...} }
}
```

**不应该出现的错误**：
- ❌ `401 Unauthorized`
- ❌ `403 Forbidden`
- ❌ `404 Not Found`
- ❌ `未登录，请先登录`
- ❌ `登录已失效`

## 常见问题排查

### 问题1：页面显示"需要登录"

**检查步骤**：
1. 打开控制台，输入：
   ```javascript
   console.log('Token:', localStorage.getItem('adminToken'));
   console.log('User:', localStorage.getItem('adminUser'));
   ```

2. 如果 token 不存在：
   - 重新登录
   - 检查登录接口是否正常

3. 如果 token 存在但仍显示需要登录：
   - 检查 token 是否过期
   - 检查后端 JWT 配置

### 问题2：显示"状态异常"

**检查步骤**：
1. 查看 Network 标签中的 `/admin/profile/info` 请求
2. 检查响应状态码：
   - `200` → 检查响应数据中的 `status` 字段
   - `401` → Token 无效，重新登录
   - `403` → 权限不足，检查用户角色
   - `404` → 接口不存在，检查后端服务

3. 检查数据库：
   ```sql
   SELECT user_id, username, role, status FROM user WHERE username = 'admin';
   ```
   
   确保：
   - `role` = `'admin'`
   - `status` = `1`

### 问题3：字段显示为空或 undefined

**检查步骤**：
1. 查看 Network 标签中的响应数据
2. 对比后端返回的字段名和前端期望的字段名
3. 检查 `profile.ts` 中的字段映射是否正确

**字段映射对照表**：
| 后端字段 | 前端字段 | 说明 |
|---------|---------|------|
| userId | id | 用户ID |
| username | username | 用户名 |
| nickname | nickname | 昵称 |
| avatar | avatar | 头像 |
| email | email | 邮箱 |
| phone | phone | 手机号 |
| role | role | 角色 |
| status | status | 状态 |
| createTime | createTime | 创建时间 |
| lastLoginTime | lastLogin | 最后登录时间 |
| loginCount | loginCount | 登录次数 |

### 问题4：CORS 错误

**错误信息**：
```
Access to fetch at 'http://localhost:8080/api/admin/profile/info' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**解决方法**：
1. 检查后端 CORS 配置（`CorsConfig.java`）
2. 确保允许的源包含 `http://localhost:3000`
3. 重启后端服务

## 测试清单

使用以下清单确保所有功能正常：

### 基础功能
- [ ] 能够正常登录
- [ ] 能够访问个人中心页面
- [ ] 页面不显示"需要登录"错误
- [ ] 页面不显示"状态异常"错误

### 信息显示
- [ ] 头像正确显示（首字母）
- [ ] 用户名正确显示
- [ ] 昵称正确显示
- [ ] 角色徽章正确显示
- [ ] 状态徽章正确显示（正常/已禁用）
- [ ] 邮箱正确显示
- [ ] 手机号正确显示
- [ ] 注册时间正确显示
- [ ] 账号年龄正确计算
- [ ] 最后登录时间正确显示

### 统计卡片
- [ ] 登录次数卡片显示
- [ ] 操作记录卡片显示
- [ ] 账号状态卡片显示

### 标签页
- [ ] 统计概览标签可切换
- [ ] 登录记录标签可切换
- [ ] 操作记录标签可切换

### 网络请求
- [ ] `/admin/profile/info` 请求成功（200）
- [ ] 请求头包含正确的 Authorization
- [ ] 响应数据格式正确
- [ ] 字段映射正确

## 性能检查

### 加载时间
- 页面首次加载：< 2秒
- API 请求响应：< 500ms
- 页面切换动画：流畅无卡顿

### 内存使用
- 打开开发者工具 → Performance → Memory
- 检查是否有内存泄漏
- 页面切换后内存应该释放

## 浏览器兼容性

测试以下浏览器：
- [ ] Chrome（最新版）
- [ ] Firefox（最新版）
- [ ] Edge（最新版）
- [ ] Safari（如果使用 Mac）

## 移动端测试

1. 打开开发者工具（F12）
2. 点击设备工具栏图标（Ctrl+Shift+M）
3. 选择不同设备尺寸测试：
   - [ ] iPhone SE（375x667）
   - [ ] iPhone 12 Pro（390x844）
   - [ ] iPad（768x1024）
   - [ ] iPad Pro（1024x1366）

## 测试完成

如果所有测试项都通过，说明修复成功！

**修复前**：
- ❌ 显示"需要登录"
- ❌ 显示"状态异常"
- ❌ 调用错误的接口 `/user/info`

**修复后**：
- ✅ 正确显示管理员信息
- ✅ 状态显示正常
- ✅ 调用正确的接口 `/admin/profile/info`

---

**测试时间**：2025-11-14  
**遵循协议**：AURA-X-KYS (KISS/YAGNI/SOLID)
