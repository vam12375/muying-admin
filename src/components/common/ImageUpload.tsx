'use client';

/**
 * 图片上传组件
 * Image Upload Component
 * Source: 新建组件，用于商品图片上传
 */

import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { showSuccess, showError } from '@/lib/utils/toast';
import { OptimizedImage } from './OptimizedImage';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  maxSize?: number; // MB
  accept?: string;
  folder?: string; // 上传到的文件夹，如 'products', 'brands' 等
  filename?: string; // 自定义文件名（不含后缀）
}

export function ImageUpload({
  value,
  onChange,
  maxSize = 5,
  accept = 'image/jpeg,image/png,image/jpg,image/webp',
  folder = 'products',
  filename
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 获取图片预览URL
  const getPreviewUrl = (filename: string) => {
    if (!filename) return '';
    // 确保 filename 是字符串
    const filenameStr = String(filename);
    if (filenameStr.startsWith('http://') || filenameStr.startsWith('https://')) {
      return filenameStr;
    }
    // 使用指定的文件夹路径
    return `http://localhost:5173/${folder}/${filenameStr}`;
  };

  // 处理文件选择
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      showError('请选择图片文件');
      return;
    }

    // 验证文件大小
    if (file.size > maxSize * 1024 * 1024) {
      showError(`图片大小不能超过 ${maxSize}MB`);
      return;
    }

    try {
      setUploading(true);

      // 创建 FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder); // 指定上传文件夹
      
      // 使用自定义文件名（如果提供）
      if (filename) {
        formData.append('filename', filename);
      }

      // 获取认证token（与 fetchApi 保持一致）
      const token = localStorage.getItem('adminToken');
      
      // 上传到后端（使用正确的管理员上传接口）
      const response = await fetch('http://localhost:8080/api/admin/upload', {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('上传失败');
      }

      const result = await response.json();
      
      if (result.code === 200 && result.data) {
        // 后端返回的数据结构：{ url: "...", filename: "..." }
        // 我们只需要文件名部分
        let filename = '';
        if (typeof result.data === 'string') {
          filename = result.data;
        } else if (result.data.filename) {
          filename = result.data.filename;
        } else if (result.data.url) {
          // 从URL中提取文件名
          const urlParts = result.data.url.split('/');
          filename = urlParts[urlParts.length - 1];
        }
        
        onChange(filename);
        setPreview(filename);
        showSuccess('图片上传成功');
      } else {
        throw new Error(result.message || '上传失败');
      }
    } catch (error: any) {
      console.error('图片上传失败:', error);
      showError(error.message || '图片上传失败');
    } finally {
      setUploading(false);
      // 清空 input，允许重复上传同一文件
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 移除图片
  const handleRemove = () => {
    onChange('');
    setPreview('');
  };

  // 触发文件选择
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="relative inline-block">
          <OptimizedImage
            src={preview}
            alt="预览"
            className="w-32 h-32 object-cover rounded-lg border border-gray-200"
            folder={folder as 'products' | 'brands' | 'avatars'}
            width={128}
            height={128}
            lazy={false}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={uploading}
          className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-500">上传中...</span>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-500">点击上传</span>
            </>
          )}
        </button>
      )}

      <p className="text-xs text-gray-500">
        支持 JPG、PNG、WEBP 格式，大小不超过 {maxSize}MB
      </p>
    </div>
  );
}
