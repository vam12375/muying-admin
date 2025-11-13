# 🔧 API 文件编码修复

## 问题

`src/lib/api.ts` 文件编码被 PowerShell 批量替换破坏。

## 解决方案

### 方案 1: 从备份恢复（推荐）

如果你有备份或版本控制：

```bash
# 从 Git 恢复
git restore src/lib/api.ts

# 或从备份恢复
cp src/lib/api.ts.backup src/lib/api.ts
```

### 方案 2: 手动修复编码

1. 在 VS Code 中打开 `src/lib/api.ts`
2. 点击右下角的编码（可能显示为 GBK 或其他）
3. 选择 "Save with Encoding"
4. 选择 "UTF-8"
5. 保存文件

### 方案 3: 重新创建文件

由于文件很大，建议：

1. 删除当前损坏的文件
2. 从旧版本 `muying-admin-react` 复制 API 定义
3. 按照 `API_PATH_RULE.md` 的规则修改路径

## 当前状态

- ✅ Orders API 已修复（使用 `/api/api/admin/orders`）
- ✅ Dashboard API 已修复（使用 `/api/admin/dashboard`）
- ✅ Products API 已修复（使用 `/api/admin/products`）
- ❌ 其他 API 因编码问题需要重新修复

## 建议

由于订单管理已经正常工作，建议：

1. 先使用当前可用的功能
2. 当访问其他模块时，如果出现 "No static resource" 错误
3. 按照 `API_PATH_RULE.md` 的规则修复对应的 API 路径

## 快速修复步骤

如果某个 API 出现错误：

1. 查看浏览器 Console 的错误信息
2. 找到对应的 API 路径
3. 在 `src/lib/api.ts` 中搜索该路径
4. 添加 `/api` 前缀（如果 Controller 路径不包含 `/api`）
5. 或添加 `/api/api` 前缀（如果 Controller 路径已包含 `/api`）

---

**时间**: 2024-11-13  
**状态**: 需要手动修复
