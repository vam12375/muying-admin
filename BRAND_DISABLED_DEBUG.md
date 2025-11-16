# 品牌禁用状态不显示问题诊断

## 问题现象

在品牌管理页面中，禁用状态的品牌（如"奶粉"）没有显示在列表中，只显示了启用状态的品牌。

## 对比分析

### 旧系统 (muying-admin-react)

**API 调用：**
```typescript
// 不传 status 参数
const params = { page, size, keyword };
const response = await axios.get('/admin/brands', { params });
```

**结果：** 能够显示所有状态的品牌（启用 + 禁用）

### 新系统 (muying-admin)

**API 调用：**
```typescript
// 添加了 status 参数
const queryParams: any = { page, size };
if (keyword) queryParams.keyword = keyword;
if (status !== undefined) queryParams.status = status;
```

**结果：** 禁用状态的品牌不显示

## 可能的原因

1. **后端 API 行为差异**
   - 旧系统：不传 `status` 参数时，后端返回所有状态的品牌
   - 新系统：可能后端 API 有更新，默认行为改变了

2. **参数处理差异**
   - `fetchApi` 中的参数过滤逻辑可能影响了请求

3. **数据映射问题**
   - 禁用品牌的字段映射可能有问题，导致数据被过滤

## 调试步骤

### 1. 检查浏览器控制台日志

打开浏览器开发者工具（F12），查看以下日志：

```
[Brands] Calling getBrandList with params: { ... }
[getBrandList] Request params: { ... }
[API Request] { endpoint, fullUrl, method, ... }
[API Response Status] { ... }
[API Response Data] { ... }
[Brands] API Response: { ... }
[Brands] Raw brand list: [ ... ]
[Brands] Raw brand #0: { ... }
[Brands] Mapped brand #0: { ... }
[Brands] Total brands: X
```

### 2. 检查网络请求

在浏览器开发者工具的 Network 标签中：

1. 找到 `/admin/brands` 请求
2. 查看请求 URL 和查询参数
3. 查看响应数据

**预期：**
- 请求 URL 应该类似：`/api/admin/brands?page=1&size=10&_t=...`
- 不应该包含 `status` 参数（因为 `statusFilter` 默认是 `undefined`）

### 3. 对比旧系统的网络请求

在旧系统中执行相同的操作，对比：
- 请求 URL
- 查询参数
- 响应数据

## 临时解决方案

如果确认是后端 API 的问题，可以尝试以下方案：

### 方案 1：完全移除状态筛选功能

恢复到旧系统的实现，不传递 `status` 参数：

```typescript
// src/lib/api/brands.ts
export async function getBrandList(params: BrandListParams = {}) {
  const { page = 1, size = 10, keyword } = params;
  // 不传递 status 参数
  
  return fetchApi<PageResult<Brand>>('/admin/brands', {
    method: 'GET',
    params: { page, size, keyword }  // 移除 status
  });
}
```

### 方案 2：修改后端 API

如果可以修改后端，确保：
- 不传 `status` 参数时，返回所有状态的品牌
- 传 `status=1` 时，只返回启用的品牌
- 传 `status=0` 时，只返回禁用的品牌

### 方案 3：前端过滤

如果后端无法修改，可以在前端进行过滤：

```typescript
// 始终获取所有品牌，然后在前端过滤
const response = await getBrandList({ 
  page: currentPage, 
  size: pageSize, 
  keyword: searchKeyword
  // 不传 status
});

// 在前端根据 statusFilter 过滤
let filteredBrands = brandList;
if (statusFilter !== undefined) {
  filteredBrands = brandList.filter(brand => brand.status === statusFilter);
}
setBrands(filteredBrands);
```

## 下一步行动

1. ✅ 添加详细的调试日志
2. ⏳ 查看浏览器控制台输出
3. ⏳ 检查网络请求和响应
4. ⏳ 确认问题根源（前端 vs 后端）
5. ⏳ 实施相应的解决方案

---

**创建日期**: 2025-11-16
**状态**: 🔍 调试中
