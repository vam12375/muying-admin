'use client';

/**
 * 商品详情弹窗
 * Product Detail Modal
 * 
 * Source: 基于 muying-admin-react ProductDetailModal.tsx 改造
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Tag, DollarSign, Layers, TrendingUp, Star, Calendar } from 'lucide-react';
import type { Product } from '@/types/product';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  if (!product) return null;

  const formatPrice = (price: number) => `¥${price.toFixed(2)}`;
  const formatDate = (date: string) => date?.substring(0, 10) || '-';

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
              <h2 className="text-xl font-bold text-gray-900">商品详情</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 内容 */}
            <div className="p-6 space-y-6">
              {/* 基本信息 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 商品图片 */}
                <div className="space-y-4">
                  <img
                    src={product.productImg || '/placeholder.png'}
                    alt={product.productName}
                    className="w-full h-80 object-cover rounded-lg"
                  />
                  {product.images && product.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {product.images.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`商品图片 ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* 商品信息 */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {product.productName}
                    </h3>
                    <p className="text-sm text-gray-500">商品编号: {product.productSn}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-500">现价</p>
                      <p className="text-3xl font-bold text-red-500">
                        {formatPrice(product.priceNew)}
                      </p>
                    </div>
                    {product.priceOld > product.priceNew && (
                      <div>
                        <p className="text-sm text-gray-500">原价</p>
                        <p className="text-xl text-gray-400 line-through">
                          {formatPrice(product.priceOld)}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">库存</p>
                        <p className="font-medium text-gray-900">{product.stock}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">销量</p>
                        <p className="font-medium text-gray-900">{product.sales}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">评分</p>
                        <p className="font-medium text-gray-900">{product.rating.toFixed(1)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">评价数</p>
                        <p className="font-medium text-gray-900">{product.reviewCount}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-500">分类:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {product.categoryName || '-'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-500">品牌:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {product.brandName || '-'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-500">创建时间:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(product.createTime)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        product.productStatus === '上架'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {product.productStatus}
                    </span>
                    {product.isHot === 1 && (
                      <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-700">
                        热销
                      </span>
                    )}
                    {product.isNew === 1 && (
                      <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
                        新品
                      </span>
                    )}
                    {product.isRecommend === 1 && (
                      <span className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-700">
                        推荐
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 商品详情 */}
              {product.productDetail && (
                <div className="border-t border-gray-100 pt-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">商品详情</h4>
                  <div
                    className="prose max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{ __html: product.productDetail }}
                  />
                </div>
              )}

              {/* 规格信息 */}
              {product.specsList && product.specsList.length > 0 && (
                <div className="border-t border-gray-100 pt-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">规格信息</h4>
                  <div className="space-y-2">
                    {product.specsList.map((spec: any, index: number) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">{spec.name}:</span>
                        <span className="text-sm font-medium text-gray-900">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 底部操作 */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                关闭
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
