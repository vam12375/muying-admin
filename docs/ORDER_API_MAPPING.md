# 订单管理 API 路径对照表

## 概述

本文档列出了订单管理模块的所有API接口及其对应的后端Controller方法，确保前后端完全匹配。

---

## API 路径对照表

| 功能 | 前端方法 | HTTP方法 | 后端路径 | 后端Controller方法 | 状态 |
|------|---------|---------|---------|-------------------|------|
| 获取订单列表 | `getOrderList()` | GET | `/admin/orders` | `AdminOrderController.getOrderList()` | ✅ 已匹配 |
| 获取订单详情 | `getOrderDetail()` | GET | `/admin/orders/{id}` | `AdminOrderController.getOrderDetail()` | ✅ 已匹配 |
| 获取订单统计 | `getOrderStatistics()` | GET | `/admin/orders/statistics` | `AdminOrderController.getOrderStatistics()` | ✅ 已匹配 |
| 更新订单状态 | `updateOrderStatus()` | PUT | `/admin/orders/{id}/status` | `AdminOrderController.updateOrderStatus()` | ✅ 已匹配 |
| 订单发货 | `shipOrder()` | PUT | `/admin/orders/{id}/ship` | `AdminOrderController.shipOrder()` | ✅ 已匹配 |
| 导出订单 | `exportOrders()` | GET | `/admin/orders/export` | `AdminOrderController.exportOrders()` | ✅ 已匹配 |

---

## 详细接口说明

### 1. 获取订单列表

**前端调用**:
```typescript
import { getOrderList } from '@/lib/api/orders';

const response = await getOrderList({
  page: 1,
  pageSize: 10,
  status: 'pending_payment',
  orderNo: 'ORD20241114001',
  userId: 123
});
```

**后端接口**:
```
GET /admin/orders?page=1&pageSize=10&status=pending_payment&orderNo=ORD20241114001&userId=123
```

**查询参数**:
- `page`: 页码（默认1）
- `pageSize`: 每页大小（默认10）
- `status`: 订单状态（可选）
  - `pending_payment` - 待付款
  - `pending_shipment` - 待发货
  - `shipped` - 已发货
  - `completed` - 已完成
  - `cancelled` - 已取消
- `orderNo`: 订单编号（可选）
- `userId`: 用户ID（可选）

**响应格式**:
```json
{
  "success": true,
  "data": {
    "list": [
      {
        "orderId": 1,
        "orderNo": "ORD20241114001",
        "userId": 123,
        "totalAmount": 299.00,
        "actualAmount": 279.00,
        "status": "pending_payment",
        "createTime": "2024-11-14T10:30:00",
        ...
      }
    ],
    "total": 100
  }
}
```

### 2. 获取订单详情

**前端调用**:
```typescript
import { getOrderDetail } from '@/lib/api/orders';

const response = await getOrderDetail(1);
```

**后端接口**:
```
GET /admin/orders/1
```

**响应格式**:
```json
{
  "success": true,
  "data": {
    "orderId": 1,
    "orderNo": "ORD20241114001",
    "userId": 123,
    "totalAmount": 299.00,
    "actualAmount": 279.00,
    "status": "pending_payment",
    "receiverName": "张三",
    "receiverPhone": "13800138000",
    "receiverAddress": "北京市朝阳区xxx",
    "products": [
      {
        "orderProductId": 1,
        "productId": 100,
        "productName": "商品名称",
        "price": 99.00,
        "quantity": 3,
        "subtotal": 297.00
      }
    ],
    "createTime": "2024-11-14T10:30:00",
    ...
  }
}
```

### 3. 获取订单统计

**前端调用**:
```typescript
import { getOrderStatistics } from '@/lib/api/orders';

const response = await getOrderStatistics();
```

**后端接口**:
```
GET /admin/orders/statistics
```

**响应格式**:
```json
{
  "success": true,
  "data": {
    "total": 1000,
    "pending_payment": 50,
    "pending_shipment": 100,
    "shipped": 200,
    "completed": 600,
    "cancelled": 50
  }
}
```

### 4. 更新订单状态

**前端调用**:
```typescript
import { updateOrderStatus } from '@/lib/api/orders';

const response = await updateOrderStatus(
  1,                    // 订单ID
  'cancelled',          // 新状态
  '用户申请取消'        // 备注（可选）
);
```

**后端接口**:
```
PUT /admin/orders/1/status?status=cancelled&remark=用户申请取消
```

**查询参数**:
- `status`: 订单状态（必填）
- `remark`: 备注（可选）

**响应格式**:
```json
{
  "success": true,
  "data": true,
  "message": "更新订单状态成功"
}
```

### 5. 订单发货

**前端调用**:
```typescript
import { shipOrder } from '@/lib/api/orders';

const response = await shipOrder(1, {
  companyId: 1,                    // 物流公司ID（必填）
  trackingNo: 'SF1234567890',      // 物流单号（可选，不填自动生成）
  receiverName: '张三',            // 收件人姓名（可选）
  receiverPhone: '13800138000',    // 收件人电话（可选）
  receiverAddress: '北京市朝阳区xxx' // 收件人地址（可选）
});
```

**后端接口**:
```
PUT /admin/orders/1/ship?companyId=1&trackingNo=SF1234567890&receiverName=张三&receiverPhone=13800138000&receiverAddress=北京市朝阳区xxx
```

**查询参数**:
- `companyId`: 物流公司ID（必填）
- `trackingNo`: 物流单号（可选，不填自动生成）
- `receiverName`: 收件人姓名（可选，不填使用订单信息）
- `receiverPhone`: 收件人电话（可选，不填使用订单信息）
- `receiverAddress`: 收件人地址（可选，不填使用订单信息）

**后端处理逻辑**:
1. 验证物流公司是否存在
2. 验证订单是否存在
3. 如果未提供物流单号，自动生成
4. 如果未提供收件人信息，使用订单中的信息
5. 创建物流记录
6. 更新订单状态为"已发货"

**响应格式**:
```json
{
  "success": true,
  "data": true,
  "message": "订单发货成功"
}
```

### 6. 导出订单

**前端调用**:
```typescript
import { exportOrders } from '@/lib/api/orders';

await exportOrders({
  status: 'completed',
  orderNo: 'ORD20241114001',
  userId: 123
});
```

**后端接口**:
```
GET /admin/orders/export?status=completed&orderNo=ORD20241114001&userId=123
```

**查询参数**:
- `status`: 订单状态（可选）
- `orderNo`: 订单编号（可选）
- `userId`: 用户ID（可选）

**响应格式**:
```
Content-Type: application/vnd.ms-excel
Content-Disposition: attachment;filename=订单数据_20241114103000.xlsx

[Excel文件二进制数据]
```

**前端处理**:
```typescript
// 自动下载Excel文件
const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `订单数据_${new Date().toLocaleDateString()}.xlsx`;
a.click();
```

---

## 数据类型映射

### 订单状态 (OrderStatus)

| 前端值 | 后端值 | 说明 |
|-------|-------|------|
| `pending_payment` | `PENDING_PAYMENT` | 待付款 |
| `pending_shipment` | `PENDING_SHIPMENT` | 待发货 |
| `shipped` | `SHIPPED` | 已发货 |
| `completed` | `COMPLETED` | 已完成 |
| `cancelled` | `CANCELLED` | 已取消 |

### 支付方式 (PaymentMethod)

| 前端值 | 后端值 | 说明 |
|-------|-------|------|
| `alipay` | `alipay` | 支付宝 |
| `wechat` | `wechat` | 微信支付 |
| `wallet` | `wallet` | 钱包支付 |

### 字段映射

| 前端字段 | 后端字段 | 类型 | 说明 |
|---------|---------|------|------|
| `orderId` | `orderId` | number | 订单ID |
| `orderNo` | `orderNo` | string | 订单编号 |
| `userId` | `userId` | number | 用户ID |
| `totalAmount` | `totalAmount` | number | 订单总金额 |
| `actualAmount` | `actualAmount` | number | 实付金额 |
| `status` | `status` | OrderStatus | 订单状态 |
| `paymentMethod` | `paymentMethod` | PaymentMethod | 支付方式 |
| `shippingFee` | `shippingFee` | number | 运费 |
| `receiverName` | `receiverName` | string | 收货人姓名 |
| `receiverPhone` | `receiverPhone` | string | 收货人电话 |
| `receiverAddress` | `receiverAddress` | string | 详细地址 |
| `trackingNo` | `trackingNo` | string | 物流单号 |
| `shippingCompany` | `shippingCompany` | string | 物流公司 |
| `createTime` | `createTime` | string | 创建时间 |
| `updateTime` | `updateTime` | string | 更新时间 |

---

## 错误处理

### 常见错误

| 错误码 | 错误信息 | 处理方式 |
|-------|---------|---------|
| 404 | 订单不存在 | 提示用户订单不存在 |
| 400 | 物流公司不存在 | 提示选择有效的物流公司 |
| 400 | 订单状态不允许此操作 | 提示当前状态不允许操作 |
| 500 | 创建物流记录失败 | 提示系统错误，稍后重试 |

### 错误响应格式

```json
{
  "success": false,
  "code": 404,
  "message": "订单不存在"
}
```

---

## 业务规则

### 1. 订单状态流转

```
待付款 (pending_payment)
  ↓ 支付成功
待发货 (pending_shipment)
  ↓ 发货
已发货 (shipped)
  ↓ 确认收货
已完成 (completed)

任何状态 → 已取消 (cancelled)
```

### 2. 发货规则

- 只有"待发货"状态的订单可以发货
- 发货时必须选择物流公司
- 物流单号可选，不填自动生成
- 发货后订单状态自动变为"已发货"

### 3. 取消规则

- "待付款"状态可以直接取消
- "待发货"状态需要审核后取消
- "已发货"状态不能取消，只能申请退货

### 4. 导出规则

- 导出不分页，获取所有符合条件的订单
- 注意性能问题，建议限制导出数量
- 导出格式为Excel（.xlsx）

---

## 测试建议

### 1. 单元测试

测试每个API方法：
```typescript
describe('Orders API', () => {
  it('should get order list', async () => {
    const response = await getOrderList({ page: 1, pageSize: 10 });
    expect(response.success).toBe(true);
    expect(response.data.list).toBeInstanceOf(Array);
  });
  
  it('should get order detail', async () => {
    const response = await getOrderDetail(1);
    expect(response.success).toBe(true);
    expect(response.data.orderId).toBe(1);
  });
});
```

### 2. 集成测试

测试完整的业务流程：
1. 创建订单
2. 支付订单
3. 发货
4. 确认收货
5. 完成订单

### 3. 性能测试

- 测试大数据量分页查询
- 测试导出大量订单
- 测试并发发货操作

---

## 注意事项

### 1. 时间格式

后端返回ISO 8601格式：
```
2024-11-14T10:30:00
```

前端显示时需要格式化：
```typescript
new Date(order.createTime).toLocaleString('zh-CN');
```

### 2. 金额处理

后端使用 `BigDecimal`，前端使用 `number`：
- 显示时保留2位小数
- 计算时注意精度问题

### 3. 状态枚举

后端使用枚举类 `OrderStatus`，前端使用字符串字面量类型。

### 4. 分页参数

- 后端分页从1开始
- `pageSize` 默认10，最大100

### 5. 导出功能

- 使用 `fetch` API 下载文件
- 需要携带认证token
- 自动触发浏览器下载

---

**文档版本**: v1.0  
**更新时间**: 2025-11-14  
**遵循协议**: AURA-X-KYS (KISS/YAGNI/SOLID)  
**状态**: ✅ 完成
