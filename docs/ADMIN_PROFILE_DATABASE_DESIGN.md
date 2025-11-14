# 管理员个人中心 - 数据库设计说明

## 📊 设计理念

本系统采用**统一用户表**设计，通过 `role` 字段区分普通用户和管理员，而不是创建独立的管理员表。

### 优点

1. **简化设计** - 避免数据冗余，遵循 KISS 原则
2. **统一管理** - 用户和管理员共享相同的认证机制
3. **灵活扩展** - 可以轻松实现用户升级为管理员
4. **减少JOIN** - 减少跨表查询的复杂度

## 🗄️ 核心表结构

### 1. user 表（用户/管理员统一表）

```sql
CREATE TABLE `user` (
  `user_id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(100) NOT NULL COMMENT '密码',
  `nickname` varchar(50) NULL COMMENT '昵称',
  `email` varchar(100) NOT NULL COMMENT '邮箱',
  `phone` varchar(20) NULL COMMENT '手机号',
  `avatar` varchar(255) NULL COMMENT '头像',
  `gender` enum('male','female','unknown') NULL DEFAULT 'unknown' COMMENT '性别',
  `birthday` date NULL COMMENT '生日',
  `status` tinyint(1) NULL DEFAULT 1 COMMENT '状态：0-禁用，1-正常',
  `role` enum('admin','user') NULL DEFAULT 'user' COMMENT '角色',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `version` int NOT NULL DEFAULT 1 COMMENT '版本号，用于乐观锁控制',
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `idx_username`(`username`),
  UNIQUE INDEX `idx_email`(`email`),
  INDEX `idx_version`(`version`)
) ENGINE = InnoDB COMMENT = '用户表';
```

**关键字段**：
- `role` - 区分用户类型：`'admin'` 或 `'user'`
- `user_id` - 主键，被其他表引用

### 2. admin_login_records 表（管理员登录记录）

```sql
CREATE TABLE `admin_login_records` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `admin_id` INT UNSIGNED NOT NULL COMMENT '管理员ID（关联user表的user_id，role=admin）',
  `admin_name` VARCHAR(50) NOT NULL COMMENT '管理员用户名',
  `login_time` DATETIME NOT NULL COMMENT '登录时间',
  `logout_time` DATETIME NULL COMMENT '登出时间',
  `ip_address` VARCHAR(50) NOT NULL COMMENT 'IP地址',
  `location` VARCHAR(100) NULL COMMENT '登录地点',
  `user_agent` VARCHAR(500) NULL COMMENT '用户代理信息',
  `device_type` VARCHAR(20) NULL COMMENT '设备类型(Desktop/Mobile/Tablet)',
  `browser` VARCHAR(50) NULL COMMENT '浏览器信息',
  `os` VARCHAR(50) NULL COMMENT '操作系统',
  `login_status` VARCHAR(20) NOT NULL DEFAULT 'success' COMMENT '登录状态(success/failed)',
  `failure_reason` VARCHAR(200) NULL COMMENT '失败原因',
  `session_id` VARCHAR(100) NULL COMMENT '会话ID',
  `duration_seconds` INT NULL COMMENT '会话时长(秒)',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  INDEX `idx_admin_id` (`admin_id`),
  INDEX `idx_login_time` (`login_time`),
  INDEX `idx_ip_address` (`ip_address`),
  INDEX `idx_session_id` (`session_id`),
  CONSTRAINT `fk_admin_login_user` FOREIGN KEY (`admin_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='管理员登录记录表（admin_id关联user表）';
```

**关键设计**：
- `admin_id` - 外键关联到 `user.user_id`（只记录 `role='admin'` 的用户）
- `admin_name` - 冗余字段，避免频繁JOIN
- 外键约束 - 级联删除和更新

### 3. admin_operation_logs 表（管理员操作日志）

```sql
CREATE TABLE `admin_operation_logs` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `admin_id` INT UNSIGNED NOT NULL COMMENT '管理员ID（关联user表的user_id，role=admin）',
  `admin_name` VARCHAR(50) NOT NULL COMMENT '管理员用户名',
  `operation` VARCHAR(100) NOT NULL COMMENT '操作名称',
  `module` VARCHAR(50) NOT NULL COMMENT '操作模块',
  `operation_type` VARCHAR(20) NOT NULL COMMENT '操作类型(CREATE/READ/UPDATE/DELETE/EXPORT/IMPORT/LOGIN/LOGOUT)',
  `target_type` VARCHAR(50) NULL COMMENT '操作目标类型',
  `target_id` VARCHAR(100) NULL COMMENT '操作目标ID',
  `request_method` VARCHAR(10) NULL COMMENT '请求方法(GET/POST/PUT/DELETE)',
  `request_url` VARCHAR(500) NULL COMMENT '请求URL',
  `request_params` TEXT NULL COMMENT '请求参数',
  `response_status` INT NULL COMMENT '响应状态码',
  `ip_address` VARCHAR(50) NOT NULL COMMENT 'IP地址',
  `user_agent` VARCHAR(500) NULL COMMENT '用户代理信息',
  `operation_result` VARCHAR(20) NOT NULL DEFAULT 'success' COMMENT '操作结果(success/failed)',
  `error_message` TEXT NULL COMMENT '错误信息',
  `execution_time_ms` BIGINT NULL COMMENT '执行时间(毫秒)',
  `description` VARCHAR(500) NULL COMMENT '操作描述',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  INDEX `idx_admin_id` (`admin_id`),
  INDEX `idx_create_time` (`create_time`),
  INDEX `idx_operation_type` (`operation_type`),
  INDEX `idx_module` (`module`),
  INDEX `idx_operation_result` (`operation_result`),
  CONSTRAINT `fk_admin_operation_user` FOREIGN KEY (`admin_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='管理员操作日志表（admin_id关联user表）';
```

**关键设计**：
- `admin_id` - 外键关联到 `user.user_id`
- `admin_name` - 冗余字段，提高查询性能
- 多个索引 - 优化常见查询场景

### 4. admin_online_status 表（管理员在线状态）

```sql
CREATE TABLE `admin_online_status` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `admin_id` INT UNSIGNED NOT NULL COMMENT '管理员ID（关联user表的user_id，role=admin）',
  `admin_name` VARCHAR(50) NOT NULL COMMENT '管理员用户名',
  `session_id` VARCHAR(100) NOT NULL COMMENT '会话ID',
  `login_time` DATETIME NOT NULL COMMENT '登录时间',
  `last_activity_time` DATETIME NOT NULL COMMENT '最后活动时间',
  `ip_address` VARCHAR(50) NOT NULL COMMENT 'IP地址',
  `user_agent` VARCHAR(500) NULL COMMENT '用户代理信息',
  `is_online` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否在线(1:在线,0:离线)',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_session_id` (`session_id`),
  INDEX `idx_admin_id` (`admin_id`),
  INDEX `idx_is_online` (`is_online`),
  INDEX `idx_last_activity_time` (`last_activity_time`),
  CONSTRAINT `fk_admin_online_user` FOREIGN KEY (`admin_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='管理员在线状态表（admin_id关联user表）';
```

**关键设计**：
- `admin_id` - 外键关联到 `user.user_id`
- `session_id` - 唯一索引，快速查找会话
- `is_online` - 索引，快速统计在线人数

## 🔗 表关系图

```
┌─────────────────────┐
│      user           │
│  (用户/管理员统一表)  │
├─────────────────────┤
│ user_id (PK)        │◄─────┐
│ username            │      │
│ password            │      │
│ role (admin/user)   │      │ FK
│ ...                 │      │
└─────────────────────┘      │
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        │                    │                    │
┌───────▼──────────┐  ┌──────▼─────────┐  ┌──────▼─────────┐
│ admin_login_     │  │ admin_         │  │ admin_online_  │
│ records          │  │ operation_logs │  │ status         │
├──────────────────┤  ├────────────────┤  ├────────────────┤
│ id (PK)          │  │ id (PK)        │  │ id (PK)        │
│ admin_id (FK)    │  │ admin_id (FK)  │  │ admin_id (FK)  │
│ admin_name       │  │ admin_name     │  │ admin_name     │
│ login_time       │  │ operation      │  │ session_id     │
│ ip_address       │  │ module         │  │ is_online      │
│ ...              │  │ ...            │  │ ...            │
└──────────────────┘  └────────────────┘  └────────────────┘
```

## 📝 设计说明

### 1. 为什么使用外键约束？

**优点**：
- ✅ 数据完整性 - 防止孤立记录
- ✅ 级联操作 - 删除用户时自动清理相关记录
- ✅ 文档化 - 明确表之间的关系

**注意事项**：
- 如果不需要外键约束，可以移除 `CONSTRAINT` 部分
- 保留索引 `idx_admin_id` 以优化查询性能

### 2. 为什么冗余 admin_name？

**原因**：
- 避免频繁JOIN `user` 表
- 提高查询性能（特别是日志查询）
- 即使用户名修改，历史记录仍保持一致

**权衡**：
- 空间换时间
- 遵循 YAGNI 原则（只在需要时优化）

### 3. 数据类型选择

| 字段 | 类型 | 说明 |
|------|------|------|
| `admin_id` | `INT UNSIGNED` | 与 `user.user_id` 保持一致 |
| `id` | `BIGINT` | 日志表数据量大，使用BIGINT |
| `ip_address` | `VARCHAR(50)` | 支持IPv6 |
| `user_agent` | `VARCHAR(500)` | 浏览器UA较长 |
| `request_params` | `TEXT` | 参数可能很长 |

## 🔍 查询示例

### 1. 获取管理员的登录记录

```sql
SELECT 
    lr.*,
    u.nickname,
    u.email
FROM admin_login_records lr
INNER JOIN user u ON lr.admin_id = u.user_id
WHERE u.role = 'admin'
  AND lr.admin_id = 1
ORDER BY lr.login_time DESC
LIMIT 10;
```

### 2. 统计管理员操作次数

```sql
SELECT 
    u.user_id,
    u.username,
    u.nickname,
    COUNT(ol.id) as operation_count
FROM user u
LEFT JOIN admin_operation_logs ol ON u.user_id = ol.admin_id
WHERE u.role = 'admin'
GROUP BY u.user_id, u.username, u.nickname
ORDER BY operation_count DESC;
```

### 3. 查询在线管理员

```sql
SELECT 
    u.user_id,
    u.username,
    u.nickname,
    os.login_time,
    os.last_activity_time,
    os.ip_address
FROM user u
INNER JOIN admin_online_status os ON u.user_id = os.admin_id
WHERE u.role = 'admin'
  AND os.is_online = 1
ORDER BY os.last_activity_time DESC;
```

## 🚀 性能优化建议

### 1. 索引优化

已创建的索引：
- `idx_admin_id` - 按管理员查询
- `idx_login_time` / `idx_create_time` - 按时间范围查询
- `idx_operation_type` - 按操作类型查询
- `idx_module` - 按模块查询
- `idx_ip_address` - 按IP查询

### 2. 分区建议（可选）

对于日志表，可以按时间分区：
```sql
ALTER TABLE admin_operation_logs
PARTITION BY RANGE (YEAR(create_time)) (
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p2026 VALUES LESS THAN (2027),
    PARTITION pmax VALUES LESS THAN MAXVALUE
);
```

### 3. 归档策略

定期归档历史数据：
```sql
-- 归档1年前的登录记录
INSERT INTO admin_login_records_archive
SELECT * FROM admin_login_records
WHERE login_time < DATE_SUB(NOW(), INTERVAL 1 YEAR);

DELETE FROM admin_login_records
WHERE login_time < DATE_SUB(NOW(), INTERVAL 1 YEAR);
```

## ✅ 总结

这个设计：
- ✅ 遵循 KISS 原则 - 简单直接
- ✅ 遵循 YAGNI 原则 - 只实现必要功能
- ✅ 遵循 SOLID 原则 - 职责清晰
- ✅ 数据完整性 - 外键约束
- ✅ 查询性能 - 合理的索引和冗余
- ✅ 可扩展性 - 易于添加新字段

---

**设计时间**: 2025-11-14  
**遵循协议**: AURA-X-KYS (KISS/YAGNI/SOLID)
