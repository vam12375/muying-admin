/**
 * 编辑个人资料模态框
 * Edit Profile Modal
 */

'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast';
import type { AdminInfo, AdminInfoUpdateParams } from '@/types/profile';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminInfo: AdminInfo;
  onSuccess: (updatedInfo: Partial<AdminInfo>) => void;
}

export function EditProfileModal({
  isOpen,
  onClose,
  adminInfo,
  onSuccess
}: EditProfileModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AdminInfoUpdateParams>({
    nickname: adminInfo.nickname || '',
    email: adminInfo.email || '',
    phone: adminInfo.phone || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        nickname: adminInfo.nickname || '',
        email: adminInfo.email || '',
        phone: adminInfo.phone || ''
      });
      setErrors({});
    }
  }, [isOpen, adminInfo]);

  // 验证邮箱格式
  const validateEmail = (email: string): boolean => {
    if (!email) return true; // 允许为空
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 验证手机号格式
  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // 允许为空
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = '请输入有效的手机号码';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      console.log('=== 个人资料更新响应 ===', result);

      // 后端使用 code: 200 表示成功
      if (result.code === 200) {
        showToast('success', '个人资料更新成功');
        // 直接传递更新后的数据，无需重新请求
        onSuccess(formData);
        onClose();
      } else {
        console.error('更新失败:', result);
        showToast('error', result.message || '更新失败');
      }
    } catch (error) {
      console.error('更新个人资料失败:', error);
      showToast('error', '更新失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            编辑个人资料
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 表单内容 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 用户名（只读） */}
          <div>
            <Label htmlFor="username" className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4" />
              用户名
            </Label>
            <Input
              id="username"
              value={adminInfo.username}
              disabled
              className="bg-gray-100 dark:bg-gray-700"
            />
            <p className="text-xs text-gray-500 mt-1">用户名不可修改</p>
          </div>

          {/* 昵称 */}
          <div>
            <Label htmlFor="nickname" className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4" />
              昵称
            </Label>
            <Input
              id="nickname"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              placeholder="请输入昵称"
            />
          </div>

          {/* 邮箱 */}
          <div>
            <Label htmlFor="email" className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4" />
              邮箱
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) {
                  setErrors({ ...errors, email: '' });
                }
              }}
              placeholder="请输入邮箱"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* 手机号 */}
          <div>
            <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
              <Phone className="w-4 h-4" />
              手机号
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                if (errors.phone) {
                  setErrors({ ...errors, phone: '' });
                }
              }}
              placeholder="请输入手机号"
              maxLength={11}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>

          {/* 按钮组 */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              取消
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  保存中...
                </>
              ) : (
                '保存'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
