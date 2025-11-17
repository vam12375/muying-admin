'use client';

/**
 * 商品编辑弹窗
 * Product Edit Modal
 * 
 * Source: 基于 muying-admin-react ProductEditModal.tsx 改造
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Upload } from 'lucide-react';
import type { Product, ProductFormData } from '@/types/product';
import type { Brand } from '@/types/brand';
import type { Category } from '@/types/category';
import { showError } from '@/lib/utils/toast';

interface ProductEditModalProps {
  product: Product | null;
  brands: Brand[];
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductFormData) => Promise<void>;
}

export function ProductEditModal({
  product,
  brands,
  categories,
  isOpen,
  onClose,
  onSave,
}: ProductEditModalProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    categoryId: 0,
    brandId: 0,
    productName: '',
    productSn: '',
    productImg: '',
    productDetail: '',
    priceNew: 0,
    priceOld: 0,
    stock: 0,
    productStatus: '上架',
    isHot: 0,
    isNew: 0,
    isRecommend: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 当商品数据变化时更新表单
  useEffect(() => {
    if (product) {
      setFormData({
        categoryId: product.categoryId,
        brandId: product.brandId,
        productName: product.productName,
        productSn: product.productSn,
        productImg: product.productImg,
        productDetail: product.productDetail,
        priceNew: product.priceNew,
        priceOld: product.priceOld,
        stock: product.stock,
        productStatus: product.productStatus,
        isHot: product.isHot,
        isNew: product.isNew,
        isRecommend: product.isRecommend,
        images: product.images || undefined,
        specsList: product.specsList || undefined,
      });
    } else {
      // 重置表单
      setFormData({
        categoryId: 0,
        brandId: 0,
        productName: '',
        productSn: '',
        productImg: '',
        productDetail: '',
        priceNew: 0,
        priceOld: 0,
        stock: 0,
        productStatus: '上架',
        isHot: 0,
        isNew: 0,
        isRecommend: 0,
      });
    }
    setErrors({});
  }, [product]);

  // 表单验证
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.productName.trim()) {
      newErrors.productName = '请输入商品名称';
    }
    if (!formData.productSn.trim()) {
      newErrors.productSn = '请输入商品编号';
    }
    if (!formData.productImg.trim()) {
      newErrors.productImg = '请输入商品图片URL';
    }
    if (formData.categoryId === 0) {
      newErrors.categoryId = '请选择分类';
    }
    if (formData.brandId === 0) {
      newErrors.brandId = '请选择品牌';
    }
    if (formData.priceNew <= 0) {
      newErrors.priceNew = '现价必须大于0';
    }
    if (formData.priceOld < formData.priceNew) {
      newErrors.priceOld = '原价不能小于现价';
    }
    if (formData.stock < 0) {
      newErrors.stock = '库存不能为负数';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交表单
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setSubmitting(true);
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('保存商品失败:', error);
      showError('保存失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* 头部 */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900">
                {product ? '编辑商品' : '添加商品'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 表单内容 */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 商品名称 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    商品名称 *
                  </label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.productName ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="请输入商品名称"
                  />
                  {errors.productName && (
                    <p className="text-sm text-red-500 mt-1">{errors.productName}</p>
                  )}
                </div>

                {/* 商品编号 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    商品编号 *
                  </label>
                  <input
                    type="text"
                    value={formData.productSn}
                    onChange={(e) => setFormData({ ...formData, productSn: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.productSn ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="请输入商品编号"
                  />
                  {errors.productSn && (
                    <p className="text-sm text-red-500 mt-1">{errors.productSn}</p>
                  )}
                </div>

                {/* 分类 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    分类 *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.categoryId ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    <option value={0}>请选择分类</option>
                    {categories.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="text-sm text-red-500 mt-1">{errors.categoryId}</p>
                  )}
                </div>

                {/* 品牌 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    品牌 *
                  </label>
                  <select
                    value={formData.brandId}
                    onChange={(e) => setFormData({ ...formData, brandId: Number(e.target.value) })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.brandId ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    <option value={0}>请选择品牌</option>
                    {brands.map((brand) => (
                      <option key={brand.brandId} value={brand.brandId}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                  {errors.brandId && (
                    <p className="text-sm text-red-500 mt-1">{errors.brandId}</p>
                  )}
                </div>

                {/* 现价 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    现价 *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.priceNew}
                    onChange={(e) => setFormData({ ...formData, priceNew: Number(e.target.value) })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.priceNew ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.priceNew && (
                    <p className="text-sm text-red-500 mt-1">{errors.priceNew}</p>
                  )}
                </div>

                {/* 原价 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    原价 *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.priceOld}
                    onChange={(e) => setFormData({ ...formData, priceOld: Number(e.target.value) })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.priceOld ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.priceOld && (
                    <p className="text-sm text-red-500 mt-1">{errors.priceOld}</p>
                  )}
                </div>

                {/* 库存 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    库存 *
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.stock ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="0"
                  />
                  {errors.stock && (
                    <p className="text-sm text-red-500 mt-1">{errors.stock}</p>
                  )}
                </div>

                {/* 状态 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    状态
                  </label>
                  <select
                    value={formData.productStatus}
                    onChange={(e) => setFormData({ ...formData, productStatus: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="上架">上架</option>
                    <option value="下架">下架</option>
                  </select>
                </div>

                {/* 商品图片 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    商品图片 *
                  </label>
                  <input
                    type="text"
                    value={formData.productImg}
                    onChange={(e) => setFormData({ ...formData, productImg: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.productImg ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="请输入图片URL"
                  />
                  {errors.productImg && (
                    <p className="text-sm text-red-500 mt-1">{errors.productImg}</p>
                  )}
                  {formData.productImg && (
                    <img
                      src={formData.productImg.startsWith('http') ? formData.productImg : `http://localhost:5173/products/${formData.productImg}`}
                      alt="预览"
                      className="mt-2 w-32 h-32 object-cover rounded-lg"
                    />
                  )}
                </div>

                {/* 标签 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    商品标签
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isHot === 1}
                        onChange={(e) => setFormData({ ...formData, isHot: e.target.checked ? 1 : 0 })}
                        className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">热销</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isNew === 1}
                        onChange={(e) => setFormData({ ...formData, isNew: e.target.checked ? 1 : 0 })}
                        className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">新品</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isRecommend === 1}
                        onChange={(e) => setFormData({ ...formData, isRecommend: e.target.checked ? 1 : 0 })}
                        className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">推荐</span>
                    </label>
                  </div>
                </div>

                {/* 商品详情 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    商品详情
                  </label>
                  <textarea
                    value={formData.productDetail}
                    onChange={(e) => setFormData({ ...formData, productDetail: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请输入商品详情"
                  />
                </div>
              </div>
            </div>

            {/* 底部操作 */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={onClose}
                disabled={submitting}
                className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    保存
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
