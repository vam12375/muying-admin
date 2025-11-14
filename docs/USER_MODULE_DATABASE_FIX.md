# 用户管理模块数据库修复指南

## 问题描述

用户管理模块加载失败，错误信息：
```
[SqlException] 查询用户账户失败：错误：未知列 'u.phone' 在 'field list'
```

**根本原因**：后端 SQL 查询使用了 `u.phone` 字段，但数据库 `user` 表中该字段不存在。

## 解决方案

在 `user` 表中添加 `phone` 字段。

---

## 执行步骤

### 步骤 1：备份数据库（重要！）

```bash
# 在执行任何数据库修改前，先备份
mysqldump -u root -p muying_mall > muying_mall_backup_$(date +%Y%m%d_%H%M%S).sql
```

### 步骤 2：执行 SQL 迁移脚本

**方式 A：使用 MySQL 命令行**

```bash
# 进入 MySQL
mysql -u root -p

# 选择数据库
USE muying_mall;

# 执行迁移脚本
SOURCE muying-mall/src/main/resources/db/add_phone_to_user.sql;
```

**方式 B：使用 Navicat 或其他 GUI 工具**

1. 打开 Navicat，连接到 MySQL 数据库
2. 选择 `muying_mall` 数据库
3. 打开查询窗口
4. 复制以下 SQL 并执行：

```sql
-- 添加 phone 字段到 user 表
ALTER TABLE `user` 
ADD COLUMN `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '手机号' 
AFTER `email`;

-- 添加索引以提高查询性能
ALTER TABLE `user` 
ADD INDEX `idx_phone`(`phone` ASC) USING BTREE;
```

### 步骤 3：验证字段是否添加成功

```sql
-- 查看 user 表结构
DESCRIBE user;

-- 或者使用
SHOW COLUMNS FROM user LIKE 'phone';
```

**预期结果**：
```
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| phone | varchar(20) | YES  | MUL | NULL    |       |
+-------+-------------+------+-----+---------+-------+
```

### 步骤 4：重启后端服务

**Windows 系统**：

```bash
# 停止当前运行的后端服务（在 IDE 中或按 Ctrl+C）

# 进入后端项目目录
cd muying-mall

# 清理并重新编译
mvn clean compile

# 启动服务
mvn spring-boot:run
```

**或者在 IDE 中**：
1. 停止当前运行的 Spring Boot 应用
2. 右键项目 -> Maven -> Reload Project
3. 重新运行 `MuyingMallApplication`

### 步骤 5：验证修复结果

1. 等待后端服务完全启动（看到 "Started MuyingMallApplication"）
2. 打开浏览器访问：`http://localhost:3000/users`
3. 检查用户列表是否正常加载
4. 尝试搜索功能（现在支持通过手机号搜索）

---

## 验证清单

- [ ] 数据库已备份
- [ ] `phone` 字段已添加到 `user` 表
- [ ] 索引 `idx_phone` 已创建
- [ ] 后端服务已重启
- [ ] 用户管理页面正常加载
- [ ] 搜索功能正常工作

---

## 如果问题仍然存在

### 1. 检查数据库连接

```sql
-- 确认当前使用的数据库
SELECT DATABASE();

-- 确认 phone 字段存在
SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'muying_mall' 
  AND TABLE_NAME = 'user' 
  AND COLUMN_NAME = 'phone';
```

### 2. 检查后端日志

查看后端控制台输出，寻找以下关键信息：
- SQL 错误信息
- 表结构加载日志
- MyBatis 映射日志

### 3. 清理缓存

```bash
# 清理 Maven 缓存
mvn clean

# 清理 IDE 缓存（IntelliJ IDEA）
# File -> Invalidate Caches / Restart
```

### 4. 检查 MyBatis 配置

确认 `application.yml` 或 `application.properties` 中的数据库配置正确：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/muying_mall?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
    username: root
    password: your_password
```

---

## 附加功能：手机号搜索

添加 `phone` 字段后，用户管理模块现在支持：

1. **通过手机号搜索用户**
   - 在搜索框输入手机号
   - 支持模糊搜索

2. **显示用户手机号**
   - 用户列表中显示手机号信息
   - 用户详情中显示手机号

3. **手机号验证**（后续可添加）
   - 手机号格式验证
   - 手机号唯一性验证

---

## 技术细节

### 修改的文件

1. **数据库迁移脚本**：
   - `muying-mall/src/main/resources/db/add_phone_to_user.sql`

2. **实体类**（已存在，无需修改）：
   - `muying-mall/src/main/java/com/muyingmall/entity/User.java`
   - 第 39-42 行已定义 `phone` 字段

3. **Mapper 接口**（无需修改）：
   - `muying-mall/src/main/java/com/muyingmall/mapper/UserAccountMapper.java`
   - 第 28 行和第 120 行的 SQL 查询已使用 `u.phone`

### SQL 查询示例

```sql
-- 用户账户列表查询（支持手机号搜索）
SELECT
  ua.account_id, ua.user_id, ua.balance, ua.status,
  u.username, u.nickname, u.email, u.phone
FROM user_account ua
LEFT JOIN user u ON ua.user_id = u.user_id
WHERE u.phone LIKE '%13800138000%';
```

---

## 遵循的设计原则

- **KISS (Keep It Simple, Stupid)**：直接添加字段，不过度设计
- **YAGNI (You Aren't Gonna Need It)**：只添加必要的字段和索引
- **SOLID**：保持代码结构清晰，职责分明

---

**创建时间**：2025-11-14  
**遵循协议**：AURA-X-KYS (KISS/YAGNI/SOLID)
