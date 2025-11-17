# 用户管理模块 API 设计文档

## 📋 概述

本文档记录了新系统（muying-admin）用户管理模块的 API 设计，参考旧系统（muying-admin-react）的实现。

**设计原则**: 遵循 KISS/YAGNI/SOLID 原则

---

## 🗂️ 文件结构

```
muying-admin/
├── src/
│   ├── lib/
│   │   └── api/
│   │       ├── users.ts          # 用户基本信息管理 API
│   │       ├── accounts.ts       # 用户账户管理 API
│   │       └── index.ts          # 统一导出
│   └── types/
│       ├── user.ts               # 用户相关类型定义
│       └── accounts.ts           # 账户相关类型定义
```

---

## 📦 模块划分

### 1. users.ts - 用户基本信息管理

**路径**: `/admin/users/*`  
**职责**: 管理员对用户信息进行增删改查

**功能列表**:
- ✅ 分页获取用户列表
- ✅ 获取用户详情
- ✅ 添加用户
- ✅ 更新用户信息
- ✅ 删除用户
- ✅ 修改用户状态（启用/禁用）
- ✅ 修改用户角色

### 2. accounts.ts - 用户账户余额管理 ⭐

**路径**: `/admin/user-accounts/*`  
**职责**: 管理员对用户余额进行增删改查

**功能列表**:

#### 账户管理
- ✅ 获取用户账户列表（带用户信息）
- ✅ 获取用户账户详情
- ✅ 管理员充值
- ✅ 调整余额
- ✅ 冻结/解冻账户

#### 交易记录管理
- ✅ 获取交易记录列表
- ✅ 获取交易详情

---

## 🔌 API 接口详情

### users.ts API

#### 用户基本信息管理

```typescript
// 分页获取用户列表
usersApi.getUserPage(params: UserListParams): Promise<PageResult<User>>

// 获取用户详情
usersApi.getUserById(userId: number): Promise<User>

// 添加用户
usersApi.addUser(data: Partial<User> & { password: string }): Promise<User>

// 更新用户信息
usersApi.updateUser(userId: number, data: Partial<User>): Promise<User>

// 删除用户
usersApi.deleteUser(userId: number): Promise<void>

// 修改用户状态
usersApi.toggleUserStatus(userId: number, status: number): Promise<void>

// 修改用户角色
usersApi.updateUserRole(userId: number, role: string): Promise<void>
```

#### 用户账户管理（集成）

```typescript
// 分页获取用户账户列表
usersApi.getUserAccountPage(params: UserListParams): Promise<PageResult<UserAccount>>

// 获取用户账户详情
usersApi.getUserAccountByUserId(userId: number): Promise<UserAccount>

// 管理员充值
usersApi.rechargeUserAccount(data: RechargeRequest): Promise<AccountTransaction>

// 管理员调整余额
usersApi.adjustUserBalance(data: BalanceAdjustRequest): Promise<AccountTransaction>

// 更改账户状态
usersApi.toggleUserAccountStatus(data: AccountStatusRequest): Promise<void>
```

#### 交易记录管理（集成）

```typescript
// 分页获取交易记录
usersApi.getTransactionPage(params: TransactionListParams): Promise<PageResult<AccountTransaction>>

// 获取交易详情
usersApi.getTransactionDetail(transactionId: number): Promise<AccountTransaction>
```

### accounts.ts API

```typescript
// 分页获取用户账户列表
accountsApi.getUserAccountPage(params: UserListParams): Promise<PageResult<UserAccount>>

// 获取用户账户详情
accountsApi.getUserAccountByUserId(userId: number): Promise<UserAccount>

// 管理员充值
accountsApi.rechargeUserAccount(data: RechargeRequest): Promise<AccountTransaction>

// 管理员调整余额
accountsApi.adjustUserBalance(data: BalanceAdjustRequest): Promise<AccountTransaction>

// 更改账户状态
accountsApi.toggleUserAccountStatus(data: AccountStatusRequest): Promise<void>

// 分页获取交易记录
accountsApi.getTransactionPage(params: TransactionListParams): Promise<PageResult<AccountTransaction>>

// 获取交易详情
accountsApi.getTransactionDetail(transactionId: number): Promise<AccountTransaction>
```

---

## 📝 类型定义

### user.ts 类型

```typescript
// 用户基本信息
interface User {
  userId: number
  username: string
  nickname?: string
  email?: string
  phone?: string
  avatar?: string
  gender?: number
  birthday?: string
  status: number
  role?: string
  createTime?: string
  updateTime?: string
  lastLoginTime?: string
}

// 用户列表查询参数
interface UserListParams {
  page?: number
  size?: number
  keyword?: string
  status?: number
}
```

### accounts.ts 类型

```typescript
// 用户账户信息
interface UserAccount {
  accountId: number
  userId: number
  username?: string
  nickname?: string
  email?: string
  phone?: string
  avatar?: string
  balance: number
  totalRecharge: number
  totalConsumption: number
  status: number
  createTime: string
  updateTime: string
}

// 交易记录
interface AccountTransaction {
  transactionId: number
  userId: number
  username?: string
  nickname?: string
  transactionNo: string
  type: number
  amount: number
  balanceBefore: number
  balanceAfter: number
  status: number
  paymentMethod?: string
  description?: string
  remark?: string
  createTime: string
  updateTime?: string
}

// 充值请求参数
interface RechargeRequest {
  userId: number
  amount: number
  paymentMethod: string
  description?: string
  remark?: string
}

// 余额调整请求参数
interface BalanceAdjustRequest {
  userId: number
  amount: number
  reason: string
}

// 账户状态变更请求参数
interface AccountStatusRequest {
  userId: number
  status: number
  reason?: string
}

// 交易记录查询参数
interface TransactionListParams {
  page?: number
  size?: number
  userId?: number
  type?: number
  status?: number
  paymentMethod?: string
  transactionNo?: string
  startTime?: string
  endTime?: string
  keyword?: string
}
```

---

## 🎯 使用示例

### 用户信息管理（usersApi）

#### 示例 1: 获取用户列表

```typescript
import { usersApi } from '@/lib/api'

const result = await usersApi.getUserPage({
  page: 1,
  size: 10,
  keyword: '张三',
  status: 1
})

console.log(result.data.records) // 用户列表
```

#### 示例 2: 添加用户

```typescript
import { usersApi } from '@/lib/api'

await usersApi.addUser({
  username: 'zhangsan',
  password: '123456',
  nickname: '张三',
  email: 'zhangsan@example.com',
  phone: '13800138000',
  role: 'user',
  status: 1
})
```

#### 示例 3: 修改用户状态

```typescript
import { usersApi } from '@/lib/api'

// 禁用用户
await usersApi.toggleUserStatus(1, 0)

// 启用用户
await usersApi.toggleUserStatus(1, 1)
```

### 账户余额管理（accountsApi）

#### 示例 4: 获取用户账户列表

```typescript
import { accountsApi } from '@/lib/api'

const result = await accountsApi.getUserAccountPage({
  page: 1,
  size: 10,
  keyword: '张三',
  status: 1
})

console.log(result.data.records) // 账户列表（带用户信息）
```

#### 示例 5: 管理员充值

```typescript
import { accountsApi } from '@/lib/api'

const result = await accountsApi.rechargeUserAccount({
  userId: 1,
  amount: 100.00,
  paymentMethod: 'admin',
  description: '管理员充值',
  remark: '测试充值'
})

console.log(result.data) // 交易记录
```

#### 示例 6: 调整用户余额

```typescript
import { accountsApi } from '@/lib/api'

const result = await accountsApi.adjustUserBalance({
  userId: 1,
  amount: -50.00,  // 负数表示扣减
  reason: '违规扣款'
})

console.log(result.data) // 交易记录
```

#### 示例 7: 冻结/解冻账户

```typescript
import { accountsApi } from '@/lib/api'

// 冻结账户
await accountsApi.toggleUserAccountStatus({
  userId: 1,
  status: 0,  // 0-冻结，1-正常
  reason: '违规操作'
})

// 解冻账户
await accountsApi.toggleUserAccountStatus({
  userId: 1,
  status: 1,
  reason: '申诉通过'
})
```

#### 示例 8: 获取交易记录

```typescript
import { accountsApi } from '@/lib/api'

const result = await accountsApi.getTransactionPage({
  page: 1,
  size: 20,
  userId: 1,
  type: 1,  // 1-充值，2-消费，3-退款，4-管理员调整
  status: 1 // 1-成功
})

console.log(result.data.records) // 交易记录列表
```

---

## 🔄 与旧系统的对应关系

| 旧系统文件 | 新系统文件 | 说明 |
|-----------|-----------|------|
| `src/api/user.ts` | `src/lib/api/users.ts` | 用户基本信息管理 |
| `src/api/userAccount.ts` | `src/lib/api/accounts.ts` | 用户账户管理 |
| - | `src/types/user.ts` | 用户类型定义 |
| - | `src/types/accounts.ts` | 账户类型定义 |

---

## ✅ 设计优势

1. **职责分离**: `usersApi` 管理用户信息，`accountsApi` 管理账户余额，符合单一职责原则
2. **类型安全**: 完整的 TypeScript 类型定义，支持智能提示
3. **路径清晰**: API路径与后端接口一一对应，易于理解和维护
4. **易于使用**: 根据功能选择对应的API，减少认知负担
5. **清晰注释**: 每个接口都有详细的中文注释、HTTP方法和路径说明
6. **KISS原则**: 简化模块结构，避免过度设计

---

## 📚 相关文档

- [用户模块实现文档](./USER_MODULE_IMPLEMENTATION.md)
- [用户模块UI重设计](./USER_MODULE_UI_REDESIGN.md)
- [用户模块总结](./USER_MODULE_SUMMARY.md)

---

**创建时间**: 2024-11-17  
**遵循协议**: AURA-X-KYS (KISS/YAGNI/SOLID)  
**核心原则**: 简洁、实用、可维护
