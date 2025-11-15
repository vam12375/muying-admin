# 物流模块迁移说明

## 迁移概述

已将 `muying-admin-react` 的物流模块类型定义和 API 迁移到 `muying-admin` (Next.js版本)。

## 主要变更

### 1. 类型定义 (`src/types/logistics.ts`)

#### ✅ 更新内容
- **物流状态枚举**: 从7种状态改为4种，与后端保持一致
  - `CREATED` (已创建)
  - `SHIPPING` (运输中)
  - `DELIVERED` (已送达)
  - `EXCEPTION` (异常)

- **Logistics 接口**: 完全对齐后端实体
  ```typescript
  // 新增字段
  companyId: number           // 物流公司ID
  senderName: string          // 发件人姓名
  senderPhone: string         // 发件人电话
  senderAddress: string       // 发件地址
  shippingTime?: string       // 发货时间
  company?: LogisticsCompany  // 物流公司对象（关联）
  order?: any                 // 订单对象（关联）
  ```

- **LogisticsTrack 接口**: 对齐后端字段
  ```typescript
  trackingTime: string        // 追踪时间（原 trackTime）
  content: string             // 内容描述（原 description）
  operator?: string           // 操作员
  detailsJson?: Record<...>   // 详细信息JSON
  ```

- **查询参数**: 统一使用 `pageSize` 而非 `size`

### 2. API 服务 (`src/lib/api/logistics.ts`)

#### ✅ 保留的功能
- ✅ 完整的错误处理和日志记录
- ✅ 所有 React 版本的 API 函数
- ✅ 时间格式处理逻辑
- ✅ 批量操作支持

#### ✅ 适配变更
- 使用 `fetchApi` 替代 `axios request`
- 使用 Next.js 的类型导入方式
- 保持与后端接口的完全兼容

### 3. 组件更新

#### LogisticsListTab.tsx
- ✅ 查询参数: `size` → `pageSize`
- ✅ 物流公司显示: `item.company` → `item.company?.name`

#### LogisticsCompanyTab.tsx
- ✅ 无需修改，已兼容新类型

## API 对照表

| 功能 | 端点 | 方法 | 参数 |
|------|------|------|------|
| 获取物流列表 | `/api/admin/logistics` | GET | page, pageSize, status, keyword |
| 获取物流详情 | `/api/admin/logistics/{id}` | GET | - |
| 根据订单获取 | `/api/admin/logistics/order/{orderId}` | GET | - |
| 更新物流状态 | `/api/admin/logistics/{id}/status` | PUT | status, remark |
| 获取物流轨迹 | `/api/admin/logistics/{id}/tracks` | GET | - |
| 添加物流轨迹 | `/api/admin/logistics/{id}/tracks` | POST | LogisticsTrackParams |
| 批量添加轨迹 | `/api/admin/logistics/{id}/batch-tracks` | POST | LogisticsTrackParams[] |
| 生成物流单号 | `/api/admin/logistics/generateTrackingNo` | GET | companyCode |
| 获取物流公司列表 | `/api/admin/logistics/companies` | GET | page, pageSize, keyword |
| 获取启用的公司 | `/api/admin/logistics/companies/enabled` | GET | - |
| 添加物流公司 | `/api/admin/logistics/companies` | POST | LogisticsCompany |
| 更新物流公司 | `/api/admin/logistics/companies/{id}` | PUT | LogisticsCompany |
| 删除物流公司 | `/api/admin/logistics/companies/{id}` | DELETE | - |

## 后端对应关系

### 实体类
- `com.muyingmall.entity.Logistics` ✅
- `com.muyingmall.entity.LogisticsCompany` ✅
- `com.muyingmall.entity.LogisticsTrack` ✅

### 枚举类
- `com.muyingmall.enums.LogisticsStatus` ✅

### 控制器
- `com.muyingmall.controller.admin.AdminLogisticsController` ✅

## 验证清单

- [x] 类型定义与后端实体完全对齐
- [x] 所有 API 函数已迁移
- [x] 错误处理逻辑已保留
- [x] 组件已适配新类型
- [x] 无 TypeScript 诊断错误
- [x] 保持 KISS/YAGNI/SOLID 原则

## 注意事项

1. **物流状态**: 前端现在使用4种状态，与后端完全一致
2. **公司信息**: `Logistics.company` 现在是对象类型，需使用 `company?.name` 访问名称
3. **参数命名**: 统一使用 `pageSize` 而非 `size`
4. **时间字段**: `shippingTime` 和 `deliveryTime` 对应后端的 `LocalDateTime`

## 迁移完成时间

2024-11-15

## 遵循协议

✅ AURA-X-KYS (KISS/YAGNI/SOLID)
