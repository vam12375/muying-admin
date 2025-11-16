# Toast 使用指南

## 概述

本项目已经配置了优雅的 Toast 通知组件，用于替代传统的 `alert()` 弹窗。Toast 组件提供了更好的用户体验，支持多种类型的通知消息。

## 基本用法

### 1. 在组件中使用

```tsx
import { useToast } from '@/components/ui/toast';

function MyComponent() {
  const { showToast } = useToast();

  const handleSuccess = () => {
    showToast('success', '操作成功！');
  };

  const handleError = () => {
    showToast('error', '操作失败，请重试');
  };

  const handleWarning = () => {
    showToast('warning', '请注意检查输入内容');
  };

  const handleInfo = () => {
    showToast('info', '这是一条提示信息');
  };

  return (
    <div>
      <button onClick={handleSuccess}>成功提示</button>
      <button onClick={handleError}>错误提示</button>
      <button onClick={handleWarning}>警告提示</button>
      <button onClick={handleInfo}>信息提示</button>
    </div>
  );
}
```

### 2. 自定义持续时间

```tsx
// 默认持续时间为 3000ms (3秒)
showToast('success', '操作成功！');

// 自定义持续时间为 5000ms (5秒)
showToast('success', '操作成功！', 5000);

// 持续显示（设置为 0）
showToast('info', '重要信息', 0);
```

## Toast 类型

### success - 成功提示
- **使用场景**：操作成功、保存成功、提交成功等
- **颜色**：绿色
- **图标**：✓ 对勾

```tsx
showToast('success', '商品添加成功！');
showToast('success', '订单已发货');
showToast('success', '设置已保存');
```

### error - 错误提示
- **使用场景**：操作失败、网络错误、验证失败等
- **颜色**：红色
- **图标**：✗ 叉号

```tsx
showToast('error', '网络请求失败');
showToast('error', '用户名或密码错误');
showToast('error', '文件上传失败');
```

### warning - 警告提示
- **使用场景**：需要用户注意的情况、潜在问题等
- **颜色**：黄色
- **图标**：⚠ 警告标志

```tsx
showToast('warning', '库存不足，请及时补货');
showToast('warning', '该操作不可撤销');
showToast('warning', '请先保存当前更改');
```

### info - 信息提示
- **使用场景**：一般性提示、系统通知等
- **颜色**：蓝色
- **图标**：ℹ 信息标志

```tsx
showToast('info', '正在处理您的请求...');
showToast('info', '系统将在5分钟后维护');
showToast('info', '已复制到剪贴板');
```

## 常见使用场景

### 表单提交

```tsx
const handleSubmit = async (data: FormData) => {
  try {
    await api.submitForm(data);
    showToast('success', '表单提交成功！');
    // 跳转或其他操作
  } catch (error) {
    showToast('error', '提交失败：' + error.message);
  }
};
```

### 数据删除

```tsx
const handleDelete = async (id: number) => {
  try {
    await api.deleteItem(id);
    showToast('success', '删除成功！');
    // 刷新列表
  } catch (error) {
    showToast('error', '删除失败，请重试');
  }
};
```

### 文件上传

```tsx
const handleUpload = async (file: File) => {
  if (file.size > 5 * 1024 * 1024) {
    showToast('warning', '文件大小不能超过5MB');
    return;
  }

  try {
    await api.uploadFile(file);
    showToast('success', '文件上传成功！');
  } catch (error) {
    showToast('error', '上传失败：' + error.message);
  }
};
```

### 数据验证

```tsx
const handleValidate = (data: FormData) => {
  if (!data.username) {
    showToast('warning', '请输入用户名');
    return false;
  }
  
  if (!data.email.includes('@')) {
    showToast('warning', '请输入有效的邮箱地址');
    return false;
  }
  
  return true;
};
```

### API 请求

```tsx
const fetchData = async () => {
  try {
    const response = await api.getData();
    if (response.success) {
      showToast('success', '数据加载成功');
      setData(response.data);
    } else {
      showToast('error', response.message || '加载失败');
    }
  } catch (error) {
    showToast('error', '网络错误，请检查连接');
  }
};
```

## 最佳实践

### 1. 消息文案要清晰简洁
```tsx
// ✅ 好的做法
showToast('success', '商品已添加到购物车');
showToast('error', '用户名已存在');

// ❌ 避免的做法
showToast('success', '成功');
showToast('error', '错误');
```

### 2. 根据操作结果选择合适的类型
```tsx
// ✅ 好的做法
if (result.success) {
  showToast('success', '操作成功');
} else {
  showToast('error', result.message);
}

// ❌ 避免的做法
showToast('info', '操作失败'); // 应该用 error
```

### 3. 避免过度使用
```tsx
// ✅ 好的做法 - 只在关键操作时显示
const handleSave = async () => {
  await api.save(data);
  showToast('success', '保存成功');
};

// ❌ 避免的做法 - 每个小操作都显示
const handleClick = () => {
  showToast('info', '按钮被点击了'); // 不必要
};
```

### 4. 合理设置持续时间
```tsx
// 成功消息 - 短时间显示
showToast('success', '操作成功', 2000);

// 错误消息 - 稍长时间显示
showToast('error', '操作失败，请重试', 4000);

// 重要信息 - 需要用户主动关闭
showToast('warning', '重要：请在24小时内完成支付', 0);
```

## 与 alert() 的对比

### 传统 alert()
```tsx
// ❌ 旧的做法
alert('操作成功！');
alert('确定要删除吗？');
```

**缺点：**
- 阻塞页面交互
- 样式无法自定义
- 用户体验差
- 无法同时显示多个消息

### Toast 通知
```tsx
// ✅ 新的做法
showToast('success', '操作成功！');
showToast('warning', '确定要删除吗？');
```

**优点：**
- 不阻塞页面
- 样式美观统一
- 支持多种类型
- 可以同时显示多个
- 自动消失
- 支持暗色模式

## 注意事项

1. **ToastProvider 已配置**：项目已在 `src/app/layout.tsx` 中配置了 ToastProvider，无需重复配置

2. **只在客户端组件中使用**：Toast 只能在客户端组件中使用，如果需要在服务端组件中使用，请将该组件标记为 `'use client'`

3. **避免在循环中使用**：不要在循环中频繁调用 showToast，这会导致大量通知同时显示

4. **错误处理**：在 catch 块中使用 toast 时，建议提供友好的错误消息而不是直接显示技术错误

## 示例：完整的表单组件

```tsx
'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/toast';

export default function ProductForm() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      price: formData.get('price') as string,
    };

    // 验证
    if (!data.name) {
      showToast('warning', '请输入商品名称');
      return;
    }

    if (!data.price || parseFloat(data.price) <= 0) {
      showToast('warning', '请输入有效的价格');
      return;
    }

    // 提交
    setLoading(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        showToast('success', '商品添加成功！');
        e.currentTarget.reset();
      } else {
        const error = await response.json();
        showToast('error', error.message || '添加失败');
      }
    } catch (error) {
      showToast('error', '网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="商品名称" />
      <input name="price" type="number" placeholder="价格" />
      <button type="submit" disabled={loading}>
        {loading ? '提交中...' : '提交'}
      </button>
    </form>
  );
}
```

## 总结

使用 Toast 通知可以显著提升用户体验。记住以下要点：

1. ✅ 使用 `showToast()` 替代 `alert()`
2. ✅ 根据场景选择合适的类型（success/error/warning/info）
3. ✅ 保持消息简洁明了
4. ✅ 合理设置持续时间
5. ✅ 避免过度使用

如有问题，请参考 `src/components/ui/toast.tsx` 的实现代码。
