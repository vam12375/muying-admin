/**
 * 优惠券表单弹窗组件
 * Coupon Form Modal Component
 */

"use client";

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Coupon, CouponFormData, CouponType, CouponStatus } from '@/types/coupon';

interface CouponFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CouponFormData) => Promise<void>;
  initialData?: Coupon | null;
  title?: string;
}

export function CouponFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title = '创建优惠券',
}: CouponFormModalProps) {
  const [formData, setFormData] = useState<CouponFormData>({
    name: '',
    description: '',
    type: CouponType.FIXED,
    value: 0,
    minSpend: 0,
    maxDiscount: 0,
    totalQuantity: 0,
    userLimit: 1,
    isStackable: 0,
    status: CouponStatus.INACTIVE,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 初始化表单数据
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || '',
        type: initialData.type,
        value: initialData.value,
        minSpend: initialData.minSpend,
        maxDiscount: initialData.maxDiscount,
        totalQuantity: initialData.totalQuantity,
        userLimit: initialData.userLimit,
        isStackable: initialData.isStackable,
        status: initialData.status,
        startTime: initialData.startTime,
        endTime: initialData.endTime,
        categoryIds: initialData.categoryIds?.split(',').filter(Boolean),
        brandIds: initialData.brandIds?.split(',').filter(Boolean),
        productIds: initialData.productIds?.split(',').filter(Boolean),
      });
    } else {
      setFormData({
        name: '',
        description: '',
        type: CouponType.FIXED,
        value: 0,
        minSpend: 0,
        maxDiscount: 0,
        totalQuantity: 0,
        userLimit: 1,
        isStackable: 0,
        status: CouponStatus.INACTIVE,
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  // 表单验证
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入优惠券名称';
    } else if (formData.name.length < 2 || formData.name.length > 50) {
      newErrors.name = '优惠券名称长度应在2-50个字符之间';
    }

    if (formData.value <= 0) {
      newErrors.value = '优惠值必须大于0';
    }

    if (formData.type === CouponType.PERCENTAGE && formData.value > 10) {
      newErrors.value = '折扣比例必须在0-10之间';
    }

    if (formData.minSpend < 0) {
      newErrors.minSpend = '最低消费金额不能为负数';
    }

    if (formData.type === CouponType.FIXED && formData.minSpend > 0 && formData.minSpend <= formData.value) {
      newErrors.minSpend = '最低消费金额应大于优惠金额';
    }

    if (formData.totalQuantity < 0) {
      newErrors.totalQuantity = '发行总量不能为负数';
    }

    if (formData.userLimit < 0) {
      newErrors.userLimit = '每用户领取限制不能为负数';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理提交
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
        categoryIds: Array.isArray(formData.categoryIds) ? formData.categoryIds.join(',') : formData.categoryIds,
        brandIds: Array.isArray(formData.brandIds) ? formData.brandIds.join(',') : formData.brandIds,
        productIds: Array.isArray(formData.productIds) ? formData.productIds.join(',') : formData.productIds,
      };
      
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('提交失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理输入变化
  const handleChange = (field: keyof CouponFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 表单内容 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 基本信息 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              基本信息
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">
                  优惠券名称 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('name', e.target.value)}
                  placeholder="请输入优惠券名称"
                  maxLength={50}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div className="col-span-2">
                <Label htmlFor="description">优惠券描述</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('description', e.target.value)}
                  placeholder="请输入优惠券描述"
                  rows={3}
                  maxLength={200}
                />
              </div>

              <div>
                <Label htmlFor="type">
                  优惠券类型 <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleChange('type', value as CouponType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CouponType.FIXED}>固定金额</SelectItem>
                    <SelectItem value={CouponType.PERCENTAGE}>折扣比例</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">
                  状态 <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange('status', value as CouponStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CouponStatus.ACTIVE}>生效中</SelectItem>
                    <SelectItem value={CouponStatus.INACTIVE}>未生效</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 优惠设置 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              优惠设置
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="value">
                  {formData.type === CouponType.FIXED ? '优惠金额' : '折扣比例'}{' '}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="value"
                  type="number"
                  step={formData.type === CouponType.FIXED ? '0.01' : '0.1'}
                  min="0"
                  max={formData.type === CouponType.PERCENTAGE ? '10' : undefined}
                  value={formData.value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('value', parseFloat(e.target.value) || 0)}
                  placeholder={formData.type === CouponType.FIXED ? '请输入优惠金额' : '请输入折扣比例'}
                  className={errors.value ? 'border-red-500' : ''}
                />
                {errors.value && (
                  <p className="text-sm text-red-500 mt-1">{errors.value}</p>
                )}
              </div>

              <div>
                <Label htmlFor="minSpend">
                  最低消费金额 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="minSpend"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.minSpend}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('minSpend', parseFloat(e.target.value) || 0)}
                  placeholder="0表示无限制"
                  className={errors.minSpend ? 'border-red-500' : ''}
                />
                {errors.minSpend && (
                  <p className="text-sm text-red-500 mt-1">{errors.minSpend}</p>
                )}
              </div>

              {formData.type === CouponType.PERCENTAGE && (
                <div>
                  <Label htmlFor="maxDiscount">最大折扣金额</Label>
                  <Input
                    id="maxDiscount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.maxDiscount || 0}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('maxDiscount', parseFloat(e.target.value) || 0)}
                    placeholder="0表示无限制"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 使用规则 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              使用规则
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="totalQuantity">
                  发行总量 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="totalQuantity"
                  type="number"
                  min="0"
                  value={formData.totalQuantity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('totalQuantity', parseInt(e.target.value) || 0)}
                  placeholder="0表示不限量"
                  className={errors.totalQuantity ? 'border-red-500' : ''}
                />
                {errors.totalQuantity && (
                  <p className="text-sm text-red-500 mt-1">{errors.totalQuantity}</p>
                )}
              </div>

              <div>
                <Label htmlFor="userLimit">
                  每用户限领 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="userLimit"
                  type="number"
                  min="0"
                  value={formData.userLimit}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('userLimit', parseInt(e.target.value) || 0)}
                  placeholder="0表示不限制"
                  className={errors.userLimit ? 'border-red-500' : ''}
                />
                {errors.userLimit && (
                  <p className="text-sm text-red-500 mt-1">{errors.userLimit}</p>
                )}
              </div>

              <div>
                <Label htmlFor="isStackable">
                  是否可叠加 <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.isStackable.toString()}
                  onValueChange={(value) => handleChange('isStackable', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">可叠加</SelectItem>
                    <SelectItem value="0">不可叠加</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">开始时间</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={formData.startTime?.slice(0, 16) || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('startTime', e.target.value ? `${e.target.value}:00` : undefined)}
                />
              </div>

              <div>
                <Label htmlFor="endTime">结束时间</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={formData.endTime?.slice(0, 16) || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('endTime', e.target.value ? `${e.target.value}:00` : undefined)}
                />
              </div>
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
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
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              disabled={loading}
            >
              {loading ? '提交中...' : initialData ? '更新' : '创建'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
