/**
 * 头像上传组件
 * Avatar Upload Component
 */

'use client';

import React, { useState, useRef } from 'react';
import { Camera, Loader2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/toast';

interface AvatarUploadProps {
  currentAvatar?: string;
  username: string;
  onSuccess: (avatarUrl: string) => void;
}

export function AvatarUpload({ currentAvatar, username, onSuccess }: AvatarUploadProps) {
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      showToast('error', '请选择图片文件');
      return;
    }

    // 验证文件大小（最大5MB）
    if (file.size > 5 * 1024 * 1024) {
      showToast('error', '图片大小不能超过5MB');
      return;
    }

    // 预览图片
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setShowPreview(true);
    };
    reader.readAsDataURL(file);
  };

  // 上传头像
  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/avatar/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });

      const result = await response.json();
      console.log('=== 头像上传响应 ===', result);

      // 后端使用 code: 200 表示成功
      if (result.code === 200 && result.data) {
        let avatarUrl = result.data.url || result.data;
        console.log('原始头像URL:', avatarUrl);
        
        // 添加时间戳参数，强制刷新图片缓存
        const timestamp = new Date().getTime();
        avatarUrl = `${avatarUrl}?t=${timestamp}`;
        console.log('带时间戳的头像URL:', avatarUrl);
        
        showToast('success', '头像上传成功');
        onSuccess(avatarUrl);
        setShowPreview(false);
        setPreview(null);
      } else {
        console.error('上传失败:', result);
        showToast('error', result.message || '上传失败');
      }
    } catch (error) {
      console.error('上传头像失败:', error);
      showToast('error', '上传失败，请稍后重试');
    } finally {
      setUploading(false);
    }
  };

  // 取消预览
  const handleCancelPreview = () => {
    setShowPreview(false);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      {/* 头像显示区域 */}
      <div className="relative group">
        <motion.div
          className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-white dark:border-gray-800 shadow-lg cursor-pointer overflow-hidden"
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          onClick={() => fileInputRef.current?.click()}
        >
          {currentAvatar ? (
            <img
              src={currentAvatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            username?.[0] || 'A'
          )}
        </motion.div>

        {/* 悬停时显示的上传提示 */}
        <div
          className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera className="w-6 h-6 text-white" />
        </div>

        {/* 隐藏的文件输入 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* 预览和上传模态框 */}
      {showPreview && preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                预览头像
              </h3>
              <button
                onClick={handleCancelPreview}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                disabled={uploading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 预览图片 */}
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* 按钮组 */}
            <div className="flex gap-3">
              <button
                onClick={handleCancelPreview}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={uploading}
              >
                取消
              </button>
              <button
                onClick={handleUpload}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    上传中...
                  </>
                ) : (
                  '确认上传'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
