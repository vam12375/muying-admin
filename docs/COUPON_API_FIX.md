# 优惠券API数据格式修复

## 问题描述

优惠券编辑页面无法增删改查，后端报错：

```
JSON parse error: Cannot deserialize value of type `java.lang.String` from Array value (token `JsonToken.START_ARRAY`)
```

## 问题根因

**前后端数据格式不匹配**：

### 前端发送的数据格式
```typescript
{
  categoryIds: ["1", "2", "3"],  // 数组
  brandIds: ["10", "20"],        // 数组
  productIds: ["100", "200"]     // 数组
}
```

### 后端期望的数据格式
```java
public class Coupon {
  private String categoryIds;  // 逗号分隔的字符串 "1,2,3"
  private String brandIds;     // 逗号分隔的字符串 "10,20"
  private String productIds;   // 逗号分隔的字符串 "100,200"
}
```

## 解决方案

### 1. 修改表单提交逻辑

在 `CouponFormModal.tsx` 的 `handleSubmit` 方法中，提交前将数组转换为字符串：

```typescript
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!validate()) {
    return;
  }

  setLoading(true);
  try {
    // 转换数组字段为逗号分隔的字符串（后端期望格式）
    const submitData: CouponFormData = {
      ...formData,
      categoryIds: Array.isArray(formData.categoryIds) 
        ? formData.categoryIds.join(',') 
        : formData.categoryIds,
      brandIds: Array.isArray(formData.brandIds) 
        ? formData.brandIds.join(',') 
        : formData.brandIds,
      productIds: Array.isArray(formData.productIds) 
        ? formData.productIds.join(',') 
        : formData.productIds,
    };
    
    await onSubmit(submitData);
    onClose();
  } catch (error) {
    console.error('提交失败:', error);
  } finally {
    setLoading(false);
  }
};
```

### 2. 更新类型定义

在 `coupon.ts` 中更新 `CouponFormData` 接口，支持两种格式：

```typescript
export interface CouponFormData {
  // ... 其他字段
  categoryIds?: string[] | string;    // 适用分类ID（数组或逗号分隔字符串）
  brandIds?: string[] | string;       // 适用品牌ID（数组或逗号分隔字符串）
  productIds?: string[] | string;     // 适用商品ID（数组或逗号分隔字符串）
}
```

### 3. 保持数据读取逻辑

在初始化表单时，将后端返回的字符串转换为数组（用于表单编辑）：

```typescript
useEffect(() => {
  if (initialData) {
    setFormData({
      // ... 其他字段
      categoryIds: initialData.categoryIds?.split(',').filter(Boolean),
      brandIds: initialData.brandIds?.split(',').filter(Boolean),
      productIds: initialData.productIds?.split(',').filter(Boolean),
    });
  }
}, [initialData, isOpen]);
```

## 数据流转过程

```
后端返回 → 前端接收
"1,2,3"  → split(',') → ["1", "2", "3"]
                ↓
         表单编辑（数组格式）
                ↓
         join(',') → "1,2,3"
                ↓
         提交到后端
```

## 设计原则

遵循 **KISS (Keep It Simple, Stupid)** 原则：
- 在数据边界处进行格式转换
- 表单内部使用数组（便于操作）
- API层面使用字符串（符合后端要求）
- 类型定义支持两种格式（灵活性）

## 其他修复

同时修复了所有 TypeScript 类型错误：
- 为所有事件处理器添加明确的类型注解
- `React.ChangeEvent<HTMLInputElement>`
- `React.ChangeEvent<HTMLTextAreaElement>`
- `React.FormEvent<HTMLFormElement>`

## 测试建议

1. **创建优惠券**：测试新建优惠券是否成功
2. **编辑优惠券**：测试编辑现有优惠券是否正常
3. **删除优惠券**：测试删除功能
4. **状态更新**：测试启用/停用功能
5. **边界情况**：
   - 不填写 categoryIds/brandIds/productIds
   - 只填写其中一个
   - 填写多个值

## 相关文件

- `muying-admin/src/views/coupons/CouponFormModal.tsx` - 表单组件
- `muying-admin/src/types/coupon.ts` - 类型定义
- `muying-admin/src/lib/api/coupons.ts` - API服务
- `muying-mall/src/main/java/com/muyingmall/entity/Coupon.java` - 后端实体

---

**修复时间**: 2024-11-13
**遵循协议**: AURA-X-KYS (KISS/YAGNI/SOLID)
