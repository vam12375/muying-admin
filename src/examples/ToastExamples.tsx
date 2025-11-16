/**
 * Toast 使用示例
 * Toast Usage Examples
 * 
 * 本文件展示了如何在不同场景中使用 Toast 通知
 */

'use client';

import { useToast } from '@/components/ui/toast';
import { showSuccess, showError, showWarning, showInfo } from '@/lib/utils/toast';

/**
 * 示例 1: 在组件中使用 useToast Hook
 */
export function Example1_UseToastHook() {
  const { showToast } = useToast();

  const handleClick = () => {
    showToast('success', '操作成功！');
  };

  return (
    <button onClick={handleClick}>
      点击显示 Toast
    </button>
  );
}

/**
 * 示例 2: 使用全局工具函数（推荐）
 * 可以在任何地方调用，包括非组件函数
 */
export function Example2_GlobalToastUtils() {
  const handleSuccess = () => {
    showSuccess('保存成功！');
  };

  const handleError = () => {
    showError('操作失败，请重试');
  };

  const handleWarning = () => {
    showWarning('请注意检查输入内容');
  };

  const handleInfo = () => {
    showInfo('这是一条提示信息');
  };

  return (
    <div className="space-x-2">
      <button onClick={handleSuccess}>成功</button>
      <button onClick={handleError}>错误</button>
      <button onClick={handleWarning}>警告</button>
      <button onClick={handleInfo}>信息</button>
    </div>
  );
}

/**
 * 示例 3: 表单提交
 */
export function Example3_FormSubmit() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    
    // 验证
    if (!name) {
      showWarning('请输入商品名称');
      return;
    }

    try {
      // 模拟 API 请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess('商品添加成功！');
      e.currentTarget.reset();
    } catch (error) {
      showError('添加失败，请重试');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="商品名称" />
      <button type="submit">提交</button>
    </form>
  );
}

/**
 * 示例 4: API 请求错误处理
 */
export function Example4_ApiErrorHandling() {
  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      
      if (!response.ok) {
        throw new Error('请求失败');
      }
      
      const data = await response.json();
      
      if (data.success) {
        showSuccess('数据加载成功');
      } else {
        showError(data.message || '加载失败');
      }
    } catch (error: any) {
      if (error.message.includes('fetch')) {
        showError('网络错误，请检查连接');
      } else {
        showError(error.message || '未知错误');
      }
    }
  };

  return (
    <button onClick={fetchData}>
      加载数据
    </button>
  );
}

/**
 * 示例 5: 文件上传
 */
export function Example5_FileUpload() {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      return;
    }

    // 验证文件大小
    if (file.size > 5 * 1024 * 1024) {
      showWarning('文件大小不能超过 5MB');
      e.target.value = '';
      return;
    }

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      showWarning('只能上传图片文件');
      e.target.value = '';
      return;
    }

    try {
      showInfo('正在上传...');
      
      // 模拟上传
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showSuccess('文件上传成功！');
    } catch (error) {
      showError('上传失败，请重试');
    }
  };

  return (
    <input type="file" onChange={handleFileChange} />
  );
}

/**
 * 示例 6: 删除确认
 */
export function Example6_DeleteConfirmation() {
  const handleDelete = async (id: number) => {
    // 注意：Toast 不能替代确认对话框
    // 对于需要用户确认的操作，应该使用 Modal 或 Dialog
    // 这里只是展示删除后的提示
    
    try {
      // 模拟删除操作
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess('删除成功！');
    } catch (error) {
      showError('删除失败，请重试');
    }
  };

  return (
    <button onClick={() => handleDelete(1)}>
      删除
    </button>
  );
}

/**
 * 示例 7: 批量操作
 */
export function Example7_BatchOperation() {
  const handleBatchDelete = async (ids: number[]) => {
    if (ids.length === 0) {
      showWarning('请先选择要删除的项目');
      return;
    }

    try {
      showInfo(`正在删除 ${ids.length} 个项目...`);
      
      // 模拟批量删除
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showSuccess(`成功删除 ${ids.length} 个项目`);
    } catch (error) {
      showError('批量删除失败');
    }
  };

  return (
    <button onClick={() => handleBatchDelete([1, 2, 3])}>
      批量删除
    </button>
  );
}

/**
 * 示例 8: 在非组件函数中使用
 */
// 这是一个普通的工具函数，不是 React 组件
export async function saveToLocalStorage(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    showSuccess('保存成功');
    return true;
  } catch (error) {
    showError('保存失败，存储空间可能已满');
    return false;
  }
}

/**
 * 示例 9: 自定义持续时间
 */
export function Example9_CustomDuration() {
  const handleShortToast = () => {
    showSuccess('快速提示', 1500); // 1.5秒
  };

  const handleLongToast = () => {
    showError('重要错误信息，请仔细阅读', 6000); // 6秒
  };

  const handlePersistentToast = () => {
    showWarning('需要手动关闭的警告', 0); // 不自动关闭
  };

  return (
    <div className="space-x-2">
      <button onClick={handleShortToast}>短时提示</button>
      <button onClick={handleLongToast}>长时提示</button>
      <button onClick={handlePersistentToast}>持久提示</button>
    </div>
  );
}

/**
 * 示例 10: 链式操作反馈
 */
export function Example10_ChainedOperations() {
  const handleChainedOps = async () => {
    try {
      showInfo('步骤 1: 验证数据...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showInfo('步骤 2: 保存到数据库...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showInfo('步骤 3: 发送通知...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSuccess('所有操作完成！');
    } catch (error) {
      showError('操作失败');
    }
  };

  return (
    <button onClick={handleChainedOps}>
      执行链式操作
    </button>
  );
}
