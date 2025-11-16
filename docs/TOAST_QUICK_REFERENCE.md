# Toast 快速参考

## 快速开始

### 1. 导入工具函数（推荐）

```tsx
import { showSuccess, showError, showWarning, showInfo } from '@/lib/utils/toast';
```

### 2. 使用示例

```tsx
// ✅ 成功提示
showSuccess('操作成功！');

// ❌ 错误提示
showError('操作失败，请重试');

// ⚠️ 警告提示
showWarning('请注意检查输入内容');

// ℹ️ 信息提示
showInfo('这是一条提示信息');
```

## 常见场景

### 表单提交
```tsx
const handleSubmit = async (data) => {
  try {
    await api.submit(data);
    showSuccess('提交成功！');
  } catch (error) {
    showError('提交失败：' + error.message);
  }
};
```

### 数据验证
```tsx
if (!data.name) {
  showWarning('请输入商品名称');
  return;
}
```

### API 请求
```tsx
const response = await api.getData();
if (response.success) {
  showSuccess('数据加载成功');
} else {
  showError(response.message || '加载失败');
}
```

### 删除操作
```tsx
const handleDelete = async (id) => {
  if (!confirm('确定要删除吗？')) return;
  
  try {
    await api.delete(id);
    showSuccess('删除成功');
  } catch (error) {
    showError('删除失败');
  }
};
```

## 自定义持续时间

```tsx
// 默认 3 秒
showSuccess('操作成功');

// 自定义 5 秒
showError('重要错误信息', 5000);

// 不自动关闭（需要手动关闭）
showWarning('需要注意的警告', 0);
```

## 在组件中使用 Hook

```tsx
import { useToast } from '@/components/ui/toast';

function MyComponent() {
  const { showToast } = useToast();
  
  const handleClick = () => {
    showToast('success', '操作成功！');
  };
  
  return <button onClick={handleClick}>点击</button>;
}
```

## 替换对照表

| 旧方式 | 新方式 |
|--------|--------|
| `alert('成功')` | `showSuccess('成功')` |
| `alert('失败')` | `showError('失败')` |
| `console.log('提示')` | `showInfo('提示')` |
| `console.warn('警告')` | `showWarning('警告')` |

## 注意事项

1. ✅ Toast 已全局配置，无需额外设置
2. ✅ 可在任何地方调用（组件、工具函数、API 层）
3. ✅ 支持同时显示多个通知
4. ✅ 自动适配暗色模式
5. ❌ 不要在循环中频繁调用
6. ❌ 不能替代确认对话框（仍需使用 confirm 或 Modal）

## 完整文档

查看 [TOAST_USAGE_GUIDE.md](./TOAST_USAGE_GUIDE.md) 获取详细文档和更多示例。
