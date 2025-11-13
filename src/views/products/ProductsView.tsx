"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit, Trash2, Eye, Package } from 'lucide-react';
import { productsApi } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';

/**
 * 商品管理视图
 * 展示商品列表、搜索、编辑等功能
 * 
 * Source: 参考 muying-admin-react/src/views/product/ProductList.tsx
 */
export function ProductsView() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // 加载商品列表
  useEffect(() => {
    loadProducts();
  }, [currentPage, searchKeyword]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await productsApi.getList(currentPage, pageSize, searchKeyword);
      
      console.log('[Products] API Response:', response);
      
      if (response.success && response.data) {
        const data = response.data;
        // 后端可能返回 records 或 list
        const productList = data.records || data.list || [];
        console.log('[Products] Product list:', productList);
        setProducts(productList);
        setTotal(data.total || 0);
      }
    } catch (err: any) {
      console.error('加载商品列表失败:', err);
      setError(err.message || '加载失败');
      // 即使失败也设置空数组
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadProducts();
  };

  // 格式化商品状态
  const formatStatus = (status: number) => {
    return status === 1 ? '上架' : '下架';
  };

  // 获取状态样式
  const getStatusStyle = (status: number) => {
    return status === 1
      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  };

  // 加载状态
  if (loading && products.length === 0 && !error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 错误提示 */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 dark:bg-red-900/20 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
            <button
              onClick={() => {
                setError(null);
                loadProducts();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              重试
            </button>
          </div>
        </div>
      )}

      {/* 页面标题和操作栏 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <Package className="mr-2 text-pink-500" />
            商品管理
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            共 {total} 个商品
          </p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all">
          <Plus className="h-4 w-4" />
          <span>添加商品</span>
        </button>
      </div>

      {/* 搜索栏 */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700 mb-6">
        <form onSubmit={handleSearch} className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索商品名称..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            搜索
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchKeyword('');
              setCurrentPage(1);
            }}
            className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
          >
            重置
          </button>
        </form>
      </div>

      {/* 商品列表 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  商品信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  价格
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  库存
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  销量
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  创建时间
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {products.length > 0 ? (
                products.map((product) => (
                  <motion.tr
                    key={product.productId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.productImg || '/placeholder-product.png'}
                          alt={product.productName}
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-product.png';
                          }}
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {product.productName}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            ID: {product.productId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {formatPrice(product.price)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${
                        product.stock > 10
                          ? 'text-green-600 dark:text-green-400'
                          : product.stock > 0
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {product.sales || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(product.status)}`}>
                        {formatStatus(product.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {formatDate(product.createTime, 'date')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:text-blue-400 dark:hover:bg-blue-900/20"
                          title="查看"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors dark:text-green-400 dark:hover:bg-green-900/20"
                          title="编辑"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:text-red-400 dark:hover:bg-red-900/20"
                          title="删除"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className="text-slate-500 dark:text-slate-400">暂无商品数据</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        {total > pageSize && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              显示 {(currentPage - 1) * pageSize + 1} 到 {Math.min(currentPage * pageSize, total)} 条，共 {total} 条
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-600 dark:hover:bg-slate-700"
              >
                上一页
              </button>
              <span className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400">
                第 {currentPage} / {Math.ceil(total / pageSize)} 页
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(Math.ceil(total / pageSize), currentPage + 1))}
                disabled={currentPage >= Math.ceil(total / pageSize)}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-600 dark:hover:bg-slate-700"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
