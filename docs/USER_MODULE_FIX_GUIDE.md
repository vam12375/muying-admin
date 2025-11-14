# 用户管理模块修复指南

## 问题描述

用户管理模块在加载用户列表时出现SQL错误：
```
Unknown column 'u.id' in 'on clause'
```

## 问题原因

`UserAccountMapper.java` 中的SQL JOIN语句使用了错误的列名。`user`表的主键是`user_id`而不是`id`。

## 修复步骤

### 1. 已修复的文件

✅ `muying-mall/src/main/java/com/muyingmall/mapper/UserAccountMapper.java`

修复内容：
- 第32行：将 `u.id` 改为 `u.user_id`
- 第115行：将 `u.id` 改为 `u.user_id`

### 2. 重启后端服务

**Windows (CMD):**
```cmd
cd g:\muying\muying-mall
mvn clean package -DskipTests
java -jar target\muying-mall-0.0.1-SNAPSHOT.jar
```

**或者在IDE中重启：**
1. 停止当前运行的Spring Boot应用
2. 重新运行 `MuyingMallApplication`

### 3. 验证修复

1. 等待后端服务完全启动（看到"Started MuyingMallApplication"日志）
2. 在浏览器中访问：`http://localhost:3000/users`
3. 应该能看到用户列表正常加载

## 预期结果

修复后，用户管理页面应该能够：
- ✅ 正常加载用户列表
- ✅ 显示用户基本信息（用户名、昵称、邮箱、手机号）
- ✅ 显示账户余额信息
- ✅ 显示账户状态
- ✅ 支持搜索和筛选功能

## 如果问题仍然存在

### 检查数据库表结构

确认`user`表的主键列名：

```sql
DESCRIBE user;
```

应该看到类似这样的结构：
```
+-------------+--------------+------+-----+---------+----------------+
| Field       | Type         | Null | Key | Default | Extra          |
+-------------+--------------+------+-----+---------+----------------+
| user_id     | int          | NO   | PRI | NULL    | auto_increment |
| username    | varchar(50)  | NO   | UNI | NULL    |                |
| ...         | ...          | ...  | ... | ...     | ...            |
+-------------+--------------+------+-----+---------+----------------+
```

### 检查user_account表

确认`user_account`表存在且结构正确：

```sql
DESCRIBE user_account;
```

应该看到：
```
+-------------+--------------+------+-----+---------+----------------+
| Field       | Type         | Null | Key | Default | Extra          |
+-------------+--------------+------+-----+---------+----------------+
| account_id  | int          | NO   | PRI | NULL    | auto_increment |
| user_id     | int          | NO   | MUL | NULL    |                |
| balance     | decimal(10,2)| NO   |     | 0.00    |                |
| status      | tinyint      | NO   |     | 1       |                |
| create_time | datetime     | YES  |     | NULL    |                |
| update_time | datetime     | YES  |     | NULL    |                |
+-------------+--------------+------+-----+---------+----------------+
```

### 如果表不存在

运行以下SQL创建表：

```sql
-- 用户账户表
CREATE TABLE IF NOT EXISTS `user_account` (
  `account_id` int NOT NULL AUTO_INCREMENT COMMENT '账户ID',
  `user_id` int NOT NULL COMMENT '用户ID',
  `balance` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '账户余额',
  `total_recharge` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '累计充值',
  `total_consumption` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '累计消费',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '账户状态：0-冻结，1-正常',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`account_id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户账户表';

-- 账户交易记录表
CREATE TABLE IF NOT EXISTS `account_transaction` (
  `transaction_id` int NOT NULL AUTO_INCREMENT COMMENT '交易ID',
  `user_id` int NOT NULL COMMENT '用户ID',
  `transaction_no` varchar(64) NOT NULL COMMENT '交易流水号',
  `type` tinyint NOT NULL COMMENT '交易类型：1-充值，2-消费，3-退款，4-管理员调整',
  `amount` decimal(10,2) NOT NULL COMMENT '交易金额',
  `balance_before` decimal(10,2) NOT NULL COMMENT '交易前余额',
  `balance_after` decimal(10,2) NOT NULL COMMENT '交易后余额',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '交易状态：0-失败，1-成功，2-处理中',
  `payment_method` varchar(32) DEFAULT NULL COMMENT '支付方式',
  `description` varchar(255) DEFAULT NULL COMMENT '交易描述',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`transaction_id`),
  UNIQUE KEY `uk_transaction_no` (`transaction_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='账户交易记录表';
```

### 检查后端日志

查看后端控制台输出，确认：
1. 没有其他SQL错误
2. Mapper接口正确加载
3. Service层正常初始化

## 常见问题

### Q1: 重启后仍然报错？

**A**: 确认以下几点：
1. 代码修改已保存
2. Maven重新编译成功
3. 后端服务完全重启（不是热重载）
4. 数据库连接正常

### Q2: 用户列表为空？

**A**: 这是正常的，因为数据库中可能还没有用户数据。可以：
1. 通过前台注册新用户
2. 或手动插入测试数据

### Q3: 如何添加测试数据？

**A**: 运行以下SQL：

```sql
-- 插入测试用户账户
INSERT INTO user_account (user_id, balance, total_recharge, total_consumption, status)
SELECT user_id, 1000.00, 1000.00, 0.00, 1
FROM user
WHERE user_id IN (1, 2, 3)
ON DUPLICATE KEY UPDATE balance = balance;
```

---

**修复时间**: 2025-11-14
**遵循协议**: AURA-X-KYS (KISS/YAGNI/SOLID)
