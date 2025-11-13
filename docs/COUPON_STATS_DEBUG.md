# 优惠券统计数据调试指南

## 问题描述

优惠券列表页面的统计卡片中"活跃中"数字没有显示。

## 调试步骤

### 1. 检查浏览器控制台

打开浏览器开发者工具（F12），查看Console标签页，应该能看到：

```
统计数据响应: { success: true, data: {...} }
统计数据: { totalCoupons: 10, activeCoupons: X, ... }
```

### 2. 检查后端返回数据

后端 `/admin/coupon/stats` 接口应该返回：

```json
{
  "code": 200,
  "success": true,
  "message": "操作成功",
  "data": {
    "totalCoupons": 10,
    "activeCoupons": 0,
    "receivedCount": 9,
    "usedCoupons": 13,
    "expiredCoupons": 0
  }
}
```

### 3. 检查数据库

如果 `activeCoupons` 为 0，可能是因为：

**后端查询逻辑**：
```java
LambdaQueryWrapper<Coupon> activeQuery = new LambdaQueryWrapper<>();
activeQuery.eq(Coupon::getStatus, "ACTIVE")
        .gt(Coupon::getEndTime, LocalDateTime.now());
long activeCoupons = count(activeQuery);
```

**需要满足的条件**：
1. `status` = 'ACTIVE'
2. `end_time` > 当前时间

**SQL查询验证**：
```sql
SELECT COUNT(*) 
FROM coupon 
WHERE status = 'ACTIVE' 
  AND end_time > NOW();
```

### 4. 常见问题

#### 问题1：所有优惠券的 end_time 都已过期
**解决方案**：更新优惠券的结束时间
```sql
UPDATE coupon 
SET end_time = DATE_ADD(NOW(), INTERVAL 30 DAY)
WHERE id IN (1, 2, 3);
```

#### 问题2：所有优惠券的 status 都是 'INACTIVE'
**解决方案**：更新优惠券状态
```sql
UPDATE coupon 
SET status = 'ACTIVE'
WHERE id IN (1, 2, 3);
```

#### 问题3：数据库中没有优惠券数据
**解决方案**：插入测试数据
```sql
INSERT INTO coupon (name, type, value, min_spend, total_quantity, user_limit, is_stackable, status, start_time, end_time, create_time, update_time, received_quantity, used_quantity)
VALUES 
('新用户专享券', 'FIXED', 50.00, 100.00, 1000, 1, 0, 'ACTIVE', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW(), 0, 0),
('满减优惠券', 'FIXED', 100.00, 500.00, 500, 1, 1, 'ACTIVE', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW(), 0, 0),
('折扣券', 'PERCENTAGE', 8.5, 200.00, 200, 1, 0, 'ACTIVE', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW(), 0, 0);
```

### 5. 前端显示逻辑

**代码位置**：`muying-admin/src/views/coupons/CouponsListView.tsx`

```typescript
{stats && (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {[
      { label: '总优惠券', value: stats.totalCoupons, color: 'from-pink-500 to-rose-500' },
      { label: '活跃中', value: stats.activeCoupons, color: 'from-green-500 to-emerald-500' },
      { label: '已使用', value: stats.usedCoupons, color: 'from-blue-500 to-cyan-500' },
      { label: '已过期', value: stats.expiredCoupons, color: 'from-red-500 to-orange-500' },
    ].map((stat, index) => (
      <motion.div key={stat.label}>
        <p className="text-2xl font-bold">
          {stat.value ?? 0}  {/* 使用空值合并运算符，确保显示0 */}
        </p>
      </motion.div>
    ))}
  </div>
)}
```

### 6. 网络请求检查

在浏览器开发者工具的 Network 标签页中：

1. 找到 `/admin/coupon/stats` 请求
2. 查看 Response 标签页
3. 确认返回的 JSON 数据结构

**预期响应**：
```json
{
  "code": 200,
  "success": true,
  "data": {
    "totalCoupons": 10,
    "activeCoupons": 5,
    "receivedCount": 9,
    "usedCoupons": 13,
    "expiredCoupons": 0
  }
}
```

### 7. 类型检查

确保前端类型定义与后端返回一致：

**前端类型**（`muying-admin/src/types/coupon.ts`）：
```typescript
export interface CouponStats {
  totalCoupons: number;
  activeCoupons: number;
  receivedCount: number;
  usedCoupons: number;
  expiredCoupons: number;
  usageRate?: number;
}
```

**后端返回**（`CouponServiceImpl.java`）：
```java
stats.put("totalCoupons", totalCoupons);
stats.put("activeCoupons", activeCoupons);
stats.put("receivedCount", receivedCount);
stats.put("usedCoupons", usedCoupons);
stats.put("expiredCoupons", expiredCoupons);
```

## 快速修复建议

### 方案1：更新现有优惠券数据

```sql
-- 将所有优惠券设置为活跃状态，并延长有效期
UPDATE coupon 
SET status = 'ACTIVE',
    end_time = DATE_ADD(NOW(), INTERVAL 30 DAY),
    update_time = NOW()
WHERE status != 'ACTIVE' OR end_time < NOW();
```

### 方案2：创建新的测试优惠券

通过前端"创建优惠券"按钮创建新优惠券，确保：
- 状态选择"生效中"
- 结束时间设置为未来日期

### 方案3：检查后端日志

查看后端控制台输出，确认统计查询是否有异常：

```bash
# 在后端项目目录执行
tail -f logs/spring.log | grep -i coupon
```

## 预期结果

修复后，统计卡片应该显示：
- 总优惠券：实际数量
- 活跃中：满足条件的数量（> 0）
- 已使用：实际使用数量
- 已过期：过期的数量

---

**创建时间**: 2024-11-13
**相关文件**: 
- `muying-admin/src/views/coupons/CouponsListView.tsx`
- `muying-mall/src/main/java/com/muyingmall/service/impl/CouponServiceImpl.java`
