# 管理员个人中心快速启动指南

## 🚀 快速开始

### 步骤1：创建数据库表

```bash
# 连接到MySQL数据库
mysql -u root -p

# 选择数据库
use your_database_name;

# 执行SQL脚本
source muying-mall/src/main/resources/db/admin_profile_tables.sql;

# 或者直接执行
mysql -u root -p your_database_name < muying-mall/src/main/resources/db/admin_profile_tables.sql
```

### 步骤2：启动后端服务

```bash
cd muying-mall
mvn clean install
mvn spring-boot:run
```

### 步骤3：启动前端服务

```bash
cd muying-admin
npm install
npm run dev
```

### 步骤4：访问个人中心

打开浏览器访问：
```
http://localhost:3000/profile
```

---

## 📋 功能检查清单

### ✅ 后端检查

1. **数据库表是否创建成功**
```sql
SHOW TABLES LIKE 'admin_%';
```
应该看到：
- admin_login_records
- admin_operation_logs
- admin_online_status

2. **Service实现类是否加载**
查看启动日志，确认以下Bean已创建：
- AdminLoginRecordServiceImpl
- AdminOperationLogServiceImpl

3. **Controller是否注册**
访问Swagger UI：
```
http://localhost:8080/swagger-ui/index.html
```
查找 "管理员个人中心" 标签

### ✅ 前端检查

1. **API配置是否正确**
检查 `.env.local` 文件：
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

2. **页面是否正常加载**
访问个人中心页面，应该看到：
- 个人信息卡片
- 统计数据卡片
- 登录记录表格
- 操作记录表格

---

## 🧪 测试步骤

### 1. 测试登录记录

1. 登出当前账号
2. 重新登录
3. 访问个人中心
4. 查看登录记录，应该能看到刚才的登录记录

### 2. 测试操作记录

1. 执行一些操作（如查看商品列表、编辑订单等）
2. 访问个人中心
3. 查看操作记录，应该能看到刚才的操作

### 3. 测试统计数据

1. 访问个人中心
2. 查看统计卡片，应该显示：
   - 登录次数（今日/本周/本月）
   - 操作次数（今日/本周/本月）
   - 操作类型分布
   - 24小时活跃度

---

## 🐛 常见问题

### 问题1：数据库表创建失败

**原因**：可能是数据库权限不足或表已存在

**解决方案**：
```sql
-- 删除旧表（谨慎操作！）
DROP TABLE IF EXISTS admin_login_records;
DROP TABLE IF EXISTS admin_operation_logs;
DROP TABLE IF EXISTS admin_online_status;

-- 重新执行创建脚本
source muying-mall/src/main/resources/db/admin_profile_tables.sql;
```

### 问题2：后端Service未加载

**原因**：Service实现类未被Spring扫描

**解决方案**：
确认以下文件存在：
- `muying-mall/src/main/java/com/muyingmall/service/impl/AdminLoginRecordServiceImpl.java`
- `muying-mall/src/main/java/com/muyingmall/service/impl/AdminOperationLogServiceImpl.java`

并且包含 `@Service` 注解。

### 问题3：前端API调用失败

**原因**：后端服务未启动或CORS配置问题

**解决方案**：
1. 确认后端服务已启动
2. 检查 `.env.local` 中的API地址
3. 检查浏览器控制台的错误信息

### 问题4：登录记录为空

**原因**：登录时未记录或数据库连接问题

**解决方案**：
1. 查看后端日志，确认是否有错误
2. 检查数据库连接是否正常
3. 手动插入测试数据：
```sql
INSERT INTO admin_login_records (admin_id, admin_name, login_time, ip_address, location, device_type, browser, os, login_status, session_id)
VALUES (1, 'admin', NOW(), '127.0.0.1', '本地', 'Desktop', 'Chrome', 'Windows', 'success', 'test-session');
```

### 问题5：操作记录为空

**原因**：操作日志切面未生效

**解决方案**：
1. 确认 `@AdminOperationLog` 注解已添加到Controller方法上
2. 确认AOP配置正确
3. 手动插入测试数据：
```sql
INSERT INTO admin_operation_logs (admin_id, admin_name, operation, module, operation_type, request_method, request_url, response_status, ip_address, operation_result)
VALUES (1, 'admin', '查看商品列表', '商品管理', 'READ', 'GET', '/admin/products', 200, '127.0.0.1', 'success');
```

---

## 📊 数据验证

### 验证登录记录

```sql
SELECT * FROM admin_login_records ORDER BY login_time DESC LIMIT 10;
```

### 验证操作记录

```sql
SELECT * FROM admin_operation_logs ORDER BY create_time DESC LIMIT 10;
```

### 验证统计数据

```sql
-- 今日登录次数
SELECT COUNT(*) FROM admin_login_records 
WHERE DATE(login_time) = CURDATE();

-- 今日操作次数
SELECT COUNT(*) FROM admin_operation_logs 
WHERE DATE(create_time) = CURDATE();

-- 操作类型分布
SELECT operation_type, COUNT(*) as count 
FROM admin_operation_logs 
GROUP BY operation_type;
```

---

## 🎯 下一步

完成基本功能测试后，可以：

1. **自定义统计周期**
   - 修改统计天数（默认30天）
   - 添加自定义时间范围筛选

2. **增强数据展示**
   - 添加图表可视化
   - 添加数据导出功能

3. **优化性能**
   - 添加Redis缓存
   - 使用消息队列异步记录

4. **增强安全**
   - 添加异常登录告警
   - 添加操作审计报告

---

**祝您使用愉快！** 🎉

如有问题，请查看 [完整实施文档](./ADMIN_PROFILE_IMPLEMENTATION.md)
