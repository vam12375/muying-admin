'use client';

/**
 * 积分商品管理视图
 * Points Products Management View
 * 
 * Source: 基于 muying-admin-react points/product.tsx 改造
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Plus, Edit2, Trash2, Eye, Package, RefreshCw
} from 'lucide-react';
import { showSuccess, showError } from '@/lib/utils/toast';
import { getPointsProductList, deletePointsProduct } from '@/lib/api/points';
import type { PointsProduct } from '@/types/points';

export function PointsProductsView() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<PointsProduct[]>([]);
  const [keyword, setKeyword] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  // 分页
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // 加载数据
  useEffect(() => {
    loadProducts();
  }, [currentPage, keyword, selectedStatus, selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getPointsProductList({
        page: currentPage,
        size: pageSize,
        name: keyword || undefined,
        category: selectedCategory || undefined,
      });
      
      if (response.success && response.data) {
        setProducts(response.data.records || []);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error('加载积分商品失败:', error);
      showError('加载失败');
    } finally {
      setLoading(false);
    }
  };

  // 搜索处理
  const handleSearch = () => {
    setCurrentPage(1);
    loadProducts();
  };

  // 重置筛选
  const handleReset = () => {
    setKeyword('');
    setSelectedStatus('');
    setSelectedCategory('');
    setCurrentPage(1);
  };

  // 删除商品
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除该商品吗？')) return;
    
    try {
      const response = await deletePointsProduct(id);
      if (response.success) {
        showSuccess('删除成功');
        loadProducts();
      }
    } catch (error) {
      console.error('删除商品失败:', error);
      showError('删除失败');
    }
  };

  // 获取状态样式
  const getStatusStyle = (status: number) => {
    return status === 1
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-100 text-gray-700';
  };

  // 获取状态文本
  const getStatusText = (status: number) => {
    return status === 1 ? '上架中' : '已下架';
  };

  // 获取分类文本
  const getCategoryText = (category: string) => {
    const texts: Record<string, string> = {
      'physical': '实物商品',
      'virtual': '虚拟商品',
      'coupon': '优惠券',
      'vip': '会员特权',
      'other': '其它',
    };
    return texts[category] || category;
  };

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">积分商品管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理可兑换的积分商品</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => showSuccess('功能开发中')}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg flex items-center gap-2 hover:shadow-lg transition-shadow"
        >
          <Plus className="w-4 h-4" />
          添加商品
        </motion.button>
      </div>

      {/* 搜索和筛选 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索商品名称"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 状态筛选 */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部状态</option>
            <option value="active">上架中</option>
            <option value="inactive">已下架</option>
            <option value="coming_soon">即将上架</option>
            <option value="sold_out">已售罄</option>
          </select>

          {/* 分类筛选 */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部分类</option>
            <option value="physical">实物商品</option>
            <option value="virtual">虚拟商品</option>
            <option value="coupon">优惠券</option>
            <option value="vip">会员特权</option>
            <option value="other">其它</option>
          </select>

          {/* 操作按钮 */}
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              搜索
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              重置
            </button>
          </div>
        </div>
      </motion.div>

      {/* 商品列表 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Package className="w-16 h-16 mb-4" />
            <p>暂无积分商品数据</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品信息</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">积分</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">库存</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">兑换量</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">分类</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {products.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{product.points}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getCategoryText(product.category)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusStyle(product.status)}`}>
                        {getStatusText(product.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-blue-600 hover:text-blue-800 p-1" title="查看">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-800 p-1" title="编辑">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-800 p-1" 
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 分页 */}
        {!loading && products.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              共 {total} 条记录，第 {currentPage} / {Math.ceil(total / pageSize)} 页
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(Math.ceil(total / pageSize), currentPage + 1))}
                disabled={currentPage >= Math.ceil(total / pageSize)}
                className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
