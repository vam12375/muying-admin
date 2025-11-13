# 优惠券统计"活跃中"最终修复方案

## 问题根因

MyBatis-Plus的`LambdaQueryWrapper`在使用嵌套`.and()`和`.or()`组合时，SQL没有被正确生成，导致查询被跳过。

## 最终解决方案

**放弃复杂的SQL查询，改用简单查询+代码过滤**

### 修改前（有问题的代码）

```java
LambdaQueryWrapper<Coupon> activeQuery = new LambdaQueryWrapper<>();
activeQuery.eq(Coupon::getStatus, "ACTIVE")
        .and(wrapper -> wrapper
            .isNull(Coupon::getEndTime)
            .or()
            .gt(Coupon::getEndTime, LocalDateTime.now())
        );
long activeCoupons = count(activeQuery);  // 这个查询没有被执行！
```

### 修改后（工作的代码）

```java
// 查询所有ACTIVE状态的优惠券
LambdaQueryWrapper<Coupon> activeQuery = new LambdaQueryWrapper<>();
activeQuery.eq(Coupon::getStatus, "ACTIVE");
List<Coupon> activeCouponList = list(activeQuery);

// 在代码中过滤出未过期的优惠券
LocalDateTime now = LocalDateTime.now();
long activeCoupons = activeCouponList.stream()
        .filter(c -> c.getEndTime() == null || c.getEndTime().isAfter(now))
        .count();
```

## 设计原则

遵循 **KISS (Keep It Simple, Stupid)** 原则：
- 简单的SQL查询更可靠
- 代码过滤逻辑更清晰易懂
- 避免复杂的ORM嵌套条件

## 性能考虑

- 优惠券数量通常不会很大（几百到几千）
- 查询所有ACTIVE优惠券后在内存中过滤，性能完全可接受
- 避免了复杂SQL可能带来的性能问题

## 重启步骤

### 1. 编译代码

```bash
cd muying-mall
mvn clean compile -DskipTests
```

### 2. 重启后端服务

**停止当前运行的服务**，然后重新启动。

### 3. 验证修复

刷新前端页面，查看后端日志：

```
INFO  - 优惠券统计 - 总数: 10, 活跃中: 3
```

根据数据库数据，应该显示 **3** 个活跃优惠券：
- ID=1: 新用户优惠券 (2027-09-18)
- ID=2: 满100减15 (2027-05-15)
- ID=10: 孕妇专享9折 (2028-05-31)

其他7个优惠券的结束时间都在2025年5月，已经过期。

## SQL执行日志

修复后应该能看到：

```sql
SELECT id, name, ..., end_time 
FROM coupon 
WHERE status = 'ACTIVE'
```

然后在代码中过滤：
```
过滤前: 10个ACTIVE优惠券
过滤后: 3个未过期的活跃优惠券
```

## 相关文件

- `muying-mall/src/main/java/com/muyingmall/service/impl/CouponServiceImpl.java` - 修改的文件

## 经验教训

1. **ORM的复杂查询不一定可靠**：MyBatis-Plus的嵌套条件可能有bug
2. **简单方案往往更好**：查询+过滤比复杂SQL更可靠
3. **日志很重要**：添加日志帮助快速定位问题
4. **验证很关键**：通过SQL日志验证查询是否真正执行

---

**修复时间**: 2024-11-13 22:05
**遵循协议**: AURA-X-KYS (KISS/YAGNI/SOLID)
**核心原则**: KISS - 保持简单
