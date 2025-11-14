# 用户管理模块调试指南

## 问题现状

- **前端错误**：系统错误，请稍后再试
- **API 错误**：请求失败，请稍后再试
- **SQL 错误**：查询用户账户失败：错误：未知列 'u.phone' 在 'field list'
- **数据库状态**：`user` 表中已有 `phone` 字段

## 问题分析

既然数据库中已经有 `phone` 字段，但仍然报错"未知列 'u.phone'"，可能的原因：

1. **后端缓存问题**：MyBatis 或 Spring Boot 缓存了旧的表结构
2. **连接池问题**：数据库连接池中的连接使用的是旧的表结构
3. **多数据库实例**：后端连接的数据库实例与您查看的不是同一个
4. **SQL 语句问题**：Mapper 中的 SQL 语句有语法错误

---

## 诊断步骤

### 步骤 1：确认数据库连接

检查后端配置文件中的数据库连接信息：

**文件**：`muying-mall/src/main/resources/application.yml` 或 `application.properties`

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/muying_mall?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
    username: root
    password: your_password
```

**验证**：
1. 确认数据库名称是 `muying_mall`
2. 确认端口号是 `3306`
3. 确认用户名和密码正确

### 步骤 2：在数据库中验证 phone 字段

```sql
-- 连接到后端使用的数据库
USE muying_mall;

-- 查看 user 表结构
DESCRIBE user;

-- 确认 phone 字段存在
SHOW COLUMNS FROM user WHERE Field = 'phone';

-- 测试查询（模拟后端 SQL）
SELECT 
  ua.account_id, ua.user_id, ua.balance, ua.status,
  u.username, u.nickname, u.email, u.phone
FROM user_account ua
LEFT JOIN user u ON ua.user_id = u.user_id
LIMIT 1;
```

**预期结果**：查询应该成功返回数据，包括 `phone` 字段。

### 步骤 3：检查 MyBatis Mapper SQL

**文件**：`muying-mall/src/main/java/com/muyingmall/mapper/UserAccountMapper.java`

问题 SQL（第 120 行）：
```java
@Select({
    "<script>",
    "SELECT",
    "  ua.account_id, ua.user_id, ua.balance, ua.total_recharge, ua.total_consumption, ua.status, ua.create_time, ua.update_time,",
    "  u.username, u.nickname, u.email, u.phone",  // ← 这里使用了 u.phone
    "FROM",
    "  user_account ua",
    "LEFT JOIN",
    "  user u ON ua.user_id = u.user_id",
    // ...
})
IPage<UserAccount> getUserAccountPage(Page<UserAccount> page, @Param("keyword") String keyword, @Param("status") Integer status);
```

### 步骤 4：清理后端缓存并重启

```bash
# 进入后端项目目录
cd muying-mall

# 停止当前运行的服务

# 清理编译缓存
mvn clean

# 重新编译
mvn compile

# 重启服务
mvn spring-boot:run
```

### 步骤 5：检查后端启动日志

启动后端服务，查看控制台输出，寻找以下信息：

1. **数据库连接日志**：
   ```
   HikariPool-1 - Starting...
   HikariPool-1 - Start completed.
   ```

2. **MyBatis 映射日志**：
   ```
   Mapped "{[/admin/user-accounts/page]}" onto ...
   ```

3. **错误日志**：
   ```
   Error querying database. Cause: java.sql.SQLSyntaxErrorException: Unknown column 'u.phone' in 'field list'
   ```

### 步骤 6：测试 API 端点

使用 Postman 或 curl 测试 API：

```bash
# 测试用户账户列表接口
curl -X GET "http://localhost:8080/admin/user-accounts/page?page=1&size=10" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

---

## 可能的解决方案

### 方案 1：强制重启数据库连接池

在 `application.yml` 中添加：

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
```

然后重启后端服务。

### 方案 2：修改 Mapper SQL（临时方案）

如果问题仍然存在，可以临时移除 `u.phone` 字段：

**文件**：`muying-mall/src/main/java/com/muyingmall/mapper/UserAccountMapper.java`

```java
// 修改第 120 行
"  u.username, u.nickname, u.email",  // 移除 u.phone
```

### 方案 3：检查数据库权限

确认数据库用户有权限查看表结构：

```sql
-- 检查用户权限
SHOW GRANTS FOR 'root'@'localhost';

-- 刷新权限
FLUSH PRIVILEGES;
```

### 方案 4：重建数据库连接

```sql
-- 杀死所有现有连接
SHOW PROCESSLIST;
KILL <process_id>;  -- 对每个连接执行

-- 重启 MySQL 服务（Windows）
net stop MySQL80
net start MySQL80
```

---

## 调试技巧

### 1. 启用 MyBatis SQL 日志

在 `application.yml` 中添加：

```yaml
logging:
  level:
    com.muyingmall.mapper: DEBUG
mybatis:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

这样可以在控制台看到实际执行的 SQL 语句。

### 2. 使用 MyBatis Generator 重新生成 Mapper

如果怀疑 Mapper 有问题，可以使用 MyBatis Generator 重新生成。

### 3. 直接在数据库中测试 SQL

复制 Mapper 中的 SQL，在 Navicat 或 MySQL Workbench 中直接执行，看是否报错。

---

## 常见错误及解决方法

### 错误 1：Unknown column 'u.phone' in 'field list'

**原因**：
- 数据库中确实没有该字段
- 后端连接的数据库不是您查看的那个
- MyBatis 缓存了旧的表结构

**解决**：
1. 确认数据库连接配置
2. 清理缓存并重启
3. 在数据库中手动执行 SQL 测试

### 错误 2：Table 'muying_mall.user' doesn't exist

**原因**：数据库名称或表名错误

**解决**：
1. 检查 `application.yml` 中的数据库名称
2. 确认表名大小写（Linux 系统区分大小写）

### 错误 3：Access denied for user 'root'@'localhost'

**原因**：数据库用户名或密码错误

**解决**：
1. 检查 `application.yml` 中的用户名和密码
2. 在 MySQL 中重置密码

---

## 快速诊断脚本

创建一个 SQL 脚本来快速诊断问题：

```sql
-- 诊断脚本：user_module_diagnosis.sql

-- 1. 检查数据库
SELECT DATABASE() AS current_database;

-- 2. 检查 user 表是否存在
SELECT COUNT(*) AS user_table_exists 
FROM information_schema.tables 
WHERE table_schema = 'muying_mall' 
  AND table_name = 'user';

-- 3. 检查 phone 字段是否存在
SELECT COUNT(*) AS phone_field_exists 
FROM information_schema.columns 
WHERE table_schema = 'muying_mall' 
  AND table_name = 'user' 
  AND column_name = 'phone';

-- 4. 查看 user 表结构
DESCRIBE user;

-- 5. 测试实际查询
SELECT 
  ua.account_id, ua.user_id, ua.balance, ua.status,
  u.username, u.nickname, u.email, u.phone
FROM user_account ua
LEFT JOIN user u ON ua.user_id = u.user_id
LIMIT 1;

-- 6. 检查数据
SELECT COUNT(*) AS user_count FROM user;
SELECT COUNT(*) AS user_account_count FROM user_account;
```

---

## 下一步行动

请按照以下顺序执行：

1. **确认数据库连接**：检查 `application.yml` 配置
2. **在数据库中测试 SQL**：手动执行 Mapper 中的 SQL
3. **清理缓存并重启**：`mvn clean compile` + 重启服务
4. **查看后端日志**：寻找具体的错误信息
5. **提供日志**：如果问题仍然存在，提供完整的后端日志

---

**创建时间**：2025-11-14  
**遵循协议**：AURA-X-KYS (KISS/YAGNI/SOLID)
