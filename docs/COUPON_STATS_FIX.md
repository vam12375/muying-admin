# 优惠券统计"活跃中"数量显示修复

## 问题描述

优惠券列表页面的统计卡片中，"活跃中"显示为 0，但列表中明显有状态为"生效中"的优惠券。

## 问题根因

后端统计查询逻辑存在问题：

### 原始代码
```java
LambdaQueryWrapper<Coupon> activeQuery = new LambdaQueryWrapper<>();
activeQuery.eq(Coupon::getStatus, "ACTIVE")
        .gt(Coupon::getEndTime, LocalDateTime.now());
long activeCoupons = count(activeQuery);
```

### 问题分析

1. **NULL值处理缺失**：如果 `endTime` 字段为 `NULL`，`.gt()` 条件会导致该记录被排除
2. **查询条件过严**：没有考虑永久有效的优惠券（endTime为NULL的情况）

## 解决方案

### 修改后的代码

```java
// 查询活跃中的优惠券数量（状态为ACTIVE且未过期）
LambdaQueryWrapper<Coupon> activeQuery = new LambdaQueryWrapper<>();
activeQuery.eq(Coupon::getStatus, "ACTIVE")
        .and(wrapper -> wrapper
            .isNull(Coupon::getEndTime)  // endTime为空视为永久有效
            .or()
            .gt(Coupon::getEndTime, LocalDateTime.now())  // 或者未过期
        );
long activeCoupons = count(activeQuery);

// 添加调试日志
log.info("优惠券统计 - 总数: {}, 活跃中: {}", totalCoupons, activeCoupons);

// 如果活跃数量为0，打印所有优惠券的状态用于调试
if (activeCoupons == 0 && totalCoupons > 0) {
    List<Coupon> allCoupons = list();
    log.warn("活跃优惠券数量为0，当前所有优惠券状态:");
    for (Coupon c : allCoupons) {
        log.warn("ID: {}, 名称: {}, 状态: {}, 结束时间: {}", 
            c.getId(), c.getName(), c.getStatus(), c.getEndTime());
    }
}
```

### 关键改进

1. **支持NULL值**：使用 `.isNull(Coupon::getEndTime)` 处理永久有效的优惠券
2. **逻辑OR组合**：endTime为NULL 或 endTime大于当前时间，都算作活跃
3. **添加调试日志**：便于排查问题
4. **详细错误日志**：当统计为0时，输出所有优惠券的详细信息

### 同时修复过期优惠券统计

```java
// 查询已过期的优惠券数量（状态为EXPIRED或已过结束时间）
LambdaQueryWrapper<Coupon> expiredQuery = new LambdaQueryWrapper<>();
expiredQuery.and(wrapper -> wrapper
        .eq(Coupon::getStatus, "EXPIRED")
        .or()
        .and(w -> w
            .isNotNull(Coupon::getEndTime)  // 只有非NULL的endTime才判断是否过期
            .le(Coupon::getEndTime, LocalDateTime.now())
        )
);
long expiredCoupons = count(expiredQuery);
```

## SQL等效查询

修复后的查询逻辑等效于：

### 活跃优惠券
```sql
SELECT COUNT(*) 
FROM coupon 
WHERE status = 'ACTIVE' 
  AND (end_time IS NULL OR end_time > NOW());
```

### 过期优惠券
```sql
SELECT COUNT(*) 
FROM coupon 
WHERE status = 'EXPIRED' 
   OR (end_time IS NOT NULL AND end_time <= NOW());
```

## 测试验证

### 1. 重启后端服务

```bash
# 在后端项目目录
mvn spring-boot:run
```

### 2. 查看后端日志

应该能看到类似输出：
```
INFO  - 优惠券统计 - 总数: 10, 活跃中: 2
```

如果活跃数量仍为0，会看到详细的调试信息：
```
WARN  - 活跃优惠券数量为0，当前所有优惠券状态:
WARN  - ID: 1, 名称: 新用户专享券, 状态: ACTIVE, 结束时间: 2027-05-18T00:00:00
WARN  - ID: 2, 名称: 满100减15, 状态: ACTIVE, 结束时间: 2027-05-15T00:00:00
```

### 3. 刷新前端页面

统计卡片应该正确显示活跃优惠券数量。

## 可能的其他问题

如果修复后仍然显示0，检查：

### 1. 数据库字段类型

确认 `end_time` 字段类型：
```sql
DESCRIBE coupon;
```

应该是 `DATETIME` 或 `TIMESTAMP` 类型。

### 2. 时区问题

检查数据库和应用服务器的时区设置：
```sql
SELECT @@global.time_zone, @@session.time_zone;
```

### 3. 数据格式

检查实际数据：
```sql
SELECT id, name, status, end_time, NOW() as current_time
FROM coupon
WHERE status = 'ACTIVE';
```

确认 `end_time` 确实大于 `current_time`。

## 相关文件

- `muying-mall/src/main/java/com/muyingmall/service/impl/CouponServiceImpl.java` - 后端服务实现
- `muying-admin/src/views/coupons/CouponsListView.tsx` - 前端列表页面
- `muying-admin/src/types/coupon.ts` - 前端类型定义

---

**修复时间**: 2024-11-13
**遵循协议**: AURA-X-KYS (KISS/YAGNI/SOLID)
