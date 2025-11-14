# 积分管理模块后端待办事项

## 当前状态

前端积分管理模块已完成，但后端 API 返回 500 错误。

## 错误信息

```
GET /admin/points/users/list?page=1&size=10
Response: {"code":500,"message":"系统繁忙，请稍后再试","data":null,"success":false}
```

## 需要实现的后端接口

根据前端需求和 Swagger 文档，需要实现以下接口：

### 1. 用户积分管理

#### 1.1 获取用户积分列表
- **路径**: `GET /admin/points/users/list`
- **参数**:
  - `page`: 页码（默认 1）
  - `size`: 每页大小（默认 10）
  - `keyword`: 搜索关键词（用户名/昵称/邮箱/手机）
  - `status`: 状态筛选（0-冻结，1-正常）
- **返回**: 分页的用户积分列表

#### 1.2 获取用户积分详情
- **路径**: `GET /admin/points/users/{userId}`
- **参数**: `userId` - 用户ID
- **返回**: 用户积分详细信息

#### 1.3 调整用户积分
- **路径**: `POST /admin/points/users/{userId}/adjust`
- **参数**:
  - `userId`: 用户ID（路径参数）
  - `points`: 积分数量（正数为增加，负数为减少）
  - `reason`: 调整原因
  - `source`: 积分来源（默认"管理员调整"）
- **返回**: 操作结果

#### 1.4 更改用户积分状态
- **路径**: `PUT /admin/points/users/{userId}/status`
- **参数**:
  - `userId`: 用户ID（路径参数）
  - `status`: 状态（0-冻结，1-正常）
  - `reason`: 操作原因
- **返回**: 操作结果

### 2. 积分历史管理

#### 2.1 获取积分历史列表
- **路径**: `GET /admin/points/history/list`
- **参数**:
  - `page`: 页码
  - `size`: 每页大小
  - `userId`: 用户ID（可选）
  - `type`: 交易类型（可选）
  - `status`: 交易状态（可选）
- **返回**: 分页的积分交易记录

#### 2.2 获取积分历史详情
- **路径**: `GET /admin/points/history/{id}`
- **参数**: `id` - 交易记录ID
- **返回**: 交易记录详细信息

### 3. 积分统计

#### 3.1 获取积分统计信息
- **路径**: `GET /admin/points/stats`
- **返回**: 积分统计数据
  - `totalUsers`: 总用户数
  - `activeUsers`: 活跃用户数
  - `totalEarned`: 累计发放积分
  - `totalSpent`: 累计消费积分

## 数据库表结构建议

### user_points 表（用户积分表）
```sql
CREATE TABLE user_points (
  points_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  current_points INT DEFAULT 0,
  total_earned INT DEFAULT 0,
  total_spent INT DEFAULT 0,
  status TINYINT DEFAULT 1 COMMENT '0-冻结，1-正常',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_id (user_id),
  INDEX idx_status (status)
);
```

### points_transaction 表（积分交易记录表）
```sql
CREATE TABLE points_transaction (
  transaction_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  transaction_no VARCHAR(64) NOT NULL COMMENT '交易流水号',
  type TINYINT NOT NULL COMMENT '1-获得，2-消费，3-过期，4-管理员调整',
  points INT NOT NULL COMMENT '积分数量（正负）',
  before_points INT NOT NULL COMMENT '交易前积分',
  after_points INT NOT NULL COMMENT '交易后积分',
  status TINYINT DEFAULT 1 COMMENT '0-失败，1-成功，2-处理中',
  source VARCHAR(100) COMMENT '积分来源',
  description VARCHAR(500) COMMENT '交易描述',
  related_order_id INT COMMENT '关联订单ID',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_transaction_no (transaction_no),
  INDEX idx_user_id (user_id),
  INDEX idx_type (type),
  INDEX idx_create_time (create_time)
);
```

## 实现建议

### 1. Controller 层
创建 `AdminPointsController.java`，实现上述所有接口。

### 2. Service 层
创建 `PointsService.java` 和 `PointsServiceImpl.java`，实现业务逻辑：
- 积分增减操作（需要事务支持）
- 积分历史记录
- 积分统计计算

### 3. Mapper 层
创建 `UserPointsMapper.java` 和 `PointsTransactionMapper.java`，实现数据访问。

### 4. 业务逻辑要点

#### 4.1 积分调整
```java
@Transactional
public void adjustUserPoints(Integer userId, Integer points, String reason, String source) {
    // 1. 查询用户当前积分
    UserPoints userPoints = userPointsMapper.selectByUserId(userId);
    
    // 2. 计算调整后积分
    int beforePoints = userPoints.getCurrentPoints();
    int afterPoints = beforePoints + points;
    
    // 3. 验证积分不能为负数
    if (afterPoints < 0) {
        throw new BusinessException("积分不足");
    }
    
    // 4. 更新用户积分
    userPoints.setCurrentPoints(afterPoints);
    if (points > 0) {
        userPoints.setTotalEarned(userPoints.getTotalEarned() + points);
    } else {
        userPoints.setTotalSpent(userPoints.getTotalSpent() + Math.abs(points));
    }
    userPointsMapper.updateById(userPoints);
    
    // 5. 记录交易历史
    PointsTransaction transaction = new PointsTransaction();
    transaction.setUserId(userId);
    transaction.setTransactionNo(generateTransactionNo());
    transaction.setType(4); // 管理员调整
    transaction.setPoints(points);
    transaction.setBeforePoints(beforePoints);
    transaction.setAfterPoints(afterPoints);
    transaction.setStatus(1); // 成功
    transaction.setSource(source);
    transaction.setDescription(reason);
    pointsTransactionMapper.insert(transaction);
}
```

#### 4.2 积分统计
```java
public PointsStatistics getPointsStatistics() {
    PointsStatistics stats = new PointsStatistics();
    
    // 总用户数
    stats.setTotalUsers(userMapper.selectCount(null));
    
    // 活跃用户数（有积分的用户）
    stats.setActiveUsers(userPointsMapper.selectActiveUserCount());
    
    // 累计发放和消费
    Map<String, Object> summary = userPointsMapper.selectPointsSummary();
    stats.setTotalEarned((Integer) summary.get("totalEarned"));
    stats.setTotalSpent((Integer) summary.get("totalSpent"));
    
    return stats;
}
```

## 测试建议

### 1. 单元测试
- 测试积分增减逻辑
- 测试边界条件（负数、超大数）
- 测试并发场景

### 2. 集成测试
- 测试完整的积分调整流程
- 测试事务回滚
- 测试数据一致性

### 3. 接口测试
使用 Postman 或 Swagger UI 测试所有接口。

## 优先级

1. **高优先级**（核心功能）
   - 用户积分列表查询
   - 积分调整
   - 积分历史查询
   - 积分统计

2. **中优先级**（辅助功能）
   - 积分状态管理
   - 高级筛选

3. **低优先级**（扩展功能）
   - 积分规则配置
   - 积分兑换功能
   - 积分等级系统

## 注意事项

1. **数据一致性**：积分调整必须使用事务，确保积分表和交易记录表的数据一致性
2. **并发控制**：使用乐观锁或悲观锁防止并发修改导致的数据错误
3. **日志记录**：所有积分变动都要记录详细的操作日志
4. **权限控制**：只有管理员可以调整用户积分
5. **参数验证**：严格验证所有输入参数，防止非法操作

---

**文档创建时间**: 2025-11-14
**遵循协议**: AURA-X-KYS (KISS/YAGNI/SOLID)
