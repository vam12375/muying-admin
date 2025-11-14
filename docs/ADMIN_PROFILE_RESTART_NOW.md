# 🚀 立即重启后端服务

## 问题状态

✅ **代码已修复**：
- 前端 API 路径：`/user/info` → `/admin/profile/info` ✅
- 后端权限注解：`hasRole('ADMIN')` → `hasAuthority('admin')` ✅

❌ **需要重启**：后端服务必须重启才能生效！

---

## 快速重启步骤

### 方法1：IDEA 重启（推荐）

1. **停止当前服务**
   - 点击 IDEA 右上角的红色"停止"按钮 ⏹️
   - 或按快捷键 `Ctrl+F2`

2. **重新启动**
   - 点击绿色"运行"按钮 ▶️
   - 或按快捷键 `Shift+F10`

3. **等待启动完成**
   - 看到：`Started MuyingMallApplication in X.XXX seconds`
   - 确认没有错误日志

### 方法2：命令行重启

```bash
# 1. 停止当前进程（如果在运行）
# 按 Ctrl+C

# 2. 进入项目目录
cd g:\muying\muying-mall

# 3. 启动服务
mvn spring-boot:run
```

### 方法3：使用批处理脚本

```bash
# 双击运行
g:\muying\muying-mall\restart-backend.cmd
```

---

## 验证重启成功

### 1. 检查后端日志

应该看到：
```
Started MuyingMallApplication in X.XXX seconds (JVM running for X.XXX)
```

**不应该看到**：
```
❌ No static resource admin/profile/info
❌ No static resource admin/profile/statistics
```

### 2. 测试 API 接口

打开浏览器或使用 curl：

```bash
# 测试 /info 接口
curl -X GET http://localhost:8080/api/admin/profile/info \
  -H "Authorization: Bearer YOUR_TOKEN"

# 测试 /statistics 接口
curl -X GET http://localhost:8080/api/admin/profile/statistics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**预期响应**：
```json
{
  "code": 200,
  "success": true,
  "data": { ... }
}
```

### 3. 测试前端页面

1. 刷新浏览器：`http://localhost:3000/profile`
2. 打开开发者工具（F12）→ Network 标签
3. 查看请求：
   - `/admin/profile/info` → 200 OK ✅
   - `/admin/profile/statistics` → 200 OK ✅

---

## 如果仍然报错

### 错误1：403 Forbidden

**原因**：权限不足

**解决**：
1. 检查 token 是否有效
2. 重新登录获取新 token
3. 确认用户角色是 `admin`

```sql
-- 检查用户角色
SELECT user_id, username, role, status FROM user WHERE username = 'admin';

-- 如果角色不对，修正
UPDATE user SET role = 'admin' WHERE username = 'admin';
```

### 错误2：404 Not Found

**原因**：接口路径不存在

**解决**：
1. 确认后端服务已重启
2. 检查 `AdminProfileController` 是否正确加载
3. 查看后端日志中的 Mapping 信息

```
# 应该看到类似的日志
Mapped "{[/admin/profile/info],methods=[GET]}" onto ...
Mapped "{[/admin/profile/statistics],methods=[GET]}" onto ...
```

### 错误3：编译错误

**原因**：后端代码有其他编译错误

**解决**：
```bash
# 清理并重新编译
cd g:\muying\muying-mall
mvn clean compile

# 查看错误信息
# 修复编译错误后再启动
```

---

## 完整的修复清单

- [x] 修改前端 API 路径（`profile.ts`）
- [x] 修改后端权限注解（`AdminProfileController.java`）
- [ ] **重启后端服务** ← 当前步骤
- [ ] 刷新前端页面
- [ ] 验证功能正常

---

## 预期结果

重启后，个人中心页面应该：

✅ **正常显示**：
- 管理员头像和基本信息
- 登录次数统计
- 操作记录统计
- 账号状态正常
- 统计概览数据
- 登录记录列表
- 操作记录列表

❌ **不再出现**：
- "需要登录"错误
- "状态异常"错误
- "No static resource"错误
- 403/404 错误

---

## 紧急联系

如果重启后仍有问题，请提供：

1. **后端完整日志**（从启动到错误）
2. **浏览器 Network 截图**（显示请求和响应）
3. **浏览器 Console 日志**（显示 JavaScript 错误）

---

**创建时间**：2025-11-14  
**紧急程度**：🔴 高  
**预计耗时**：2-3 分钟  
**遵循协议**：AURA-X-KYS (KISS/YAGNI/SOLID)
