"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit, Trash2, Package, X, Save } from 'lucide-react';
import { getBrandList, getAllBrands, createBrand, updateBrand, deleteBrand } from '@/lib/api/brands';
import { formatDate } from '@/lib/utils';
import { getBrandLogoUrl } from '@/lib/utils/image';
import { showSuccess, showError, showWarning } from '@/lib/utils/toast';
import type { Brand, BrandFormData } from '@/types/brand';

/**
 * 品牌管理视图
 * 展示品牌列表、搜索、创建、编辑、删除等功能
 * 
 * Source: 基于后端 AdminBrandController 实现
 * Design: 遵循 KISS, YAGNI, SOLID 原则
 */
export function BrandsView() {
  // ==================== 状态管理 ====================
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // 模态框状态
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState<BrandFormData>({
    name: '',
    logo: '',
    description: '',
    sort: 0,
    status: 1,
  });
  const [submitting, setSubmitting] = useState(false);

  // ==================== 数据加载 ====================
  useEffect(() => {
    loadBrands();
  }, [currentPage, searchKeyword]);

  /**
   * 加载品牌列表
   * 
   * 注意：由于后端 /admin/brands 默认只返回启用状态的品牌，
   * 我们需要使用 /admin/brands/all 获取所有品牌，然后在前端进行分页和搜索
   */
  const loadBrands = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('[Brands] 使用 getAllBrands 获取所有品牌（包括禁用的）');
      
      // 临时方案：使用 getAllBrands 获取所有品牌
      const allBrandsResponse = await getAllBrands();
      
      console.log('[Brands] getAllBrands Response:', allBrandsResponse);
      
      if (allBrandsResponse.success && allBrandsResponse.data) {
        let allBrands = allBrandsResponse.data;
      
        console.log('[Brands] All brands count:', allBrands.length);
        
        // 前端搜索过滤
        if (searchKeyword) {
          allBrands = allBrands.filter(brand => 
            brand.name.toLowerCase().includes(searchKeyword.toLowerCase())
          );
          console.log('[Brands] After search filter:', allBrands.length);
        }
        
        // 前端分页
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const pagedBrands = allBrands.slice(startIndex, endIndex);
        
        console.log('[Brands] Pagination:', { startIndex, endIndex, pagedCount: pagedBrands.length });
        
        // 数据映射：处理后端字段名不一致的问题
        // 后端可能返回 id 而不是 brandId，showStatus 而不是 status
        const brandList = pagedBrands.map((brand: any, index: number) => {
          // 详细日志：输出每个品牌的原始数据
          if (index < 3) {  // 只输出前3条，避免日志过多
            console.log(`[Brands] Raw brand #${index}:`, {
              id: brand.id,
              brandId: brand.brandId,
              name: brand.name,
              status: brand.status,
              showStatus: brand.showStatus,
              allKeys: Object.keys(brand)
            });
          }
          
          const mappedBrand = {
            ...brand,
            brandId: brand.brandId || brand.id,  // 优先使用 brandId，如果不存在则使用 id
            status: brand.status !== undefined ? brand.status : brand.showStatus,  // 优先使用 status，如果不存在则使用 showStatus
          };
          
          if (index < 3) {
            console.log(`[Brands] Mapped brand #${index}:`, {
              brandId: mappedBrand.brandId,
              name: mappedBrand.name,
              status: mappedBrand.status
            });
          }
          
          return mappedBrand;
        });
        
        console.log('[Brands] Final brand list:', brandList);
        
        // 设置品牌列表和总数
        setBrands(brandList);
        setTotal(allBrands.length);  // 使用过滤后的总数
      }
    } catch (err: any) {
      console.error('加载品牌列表失败:', err);
      setError(err.message || '加载失败');
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  // ==================== 搜索处理 ====================
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadBrands();
  };

  // ==================== 模态框操作 ====================
  /**
   * 打开创建品牌模态框
   */
  const handleCreate = () => {
    setModalMode('create');
    setEditingBrand(null);
    setFormData({
      name: '',
      logo: '',
      description: '',
      sort: 0,
      status: 1,
    });
    setShowModal(true);
  };

  /**
   * 打开编辑品牌模态框
   */
  const handleEdit = (brand: Brand) => {
    setModalMode('edit');
    setEditingBrand(brand);
    // 确保使用正确的字段值
    const statusValue = brand.status !== undefined ? brand.status : (brand.showStatus !== undefined ? brand.showStatus : 1);
    setFormData({
      name: brand.name,
      logo: brand.logo || '',
      description: brand.description || '',
      sort: brand.sort || 0,
      status: statusValue,
    });
    setShowModal(true);
  };

  /**
   * 关闭模态框
   */
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBrand(null);
    setFormData({
      name: '',
      logo: '',
      description: '',
      sort: 0,
      status: 1,
    });
  };

  /**
   * 提交表单（创建或更新）
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showWarning('请输入品牌名称');
      return;
    }

    try {
      setSubmitting(true);

      if (modalMode === 'create') {
        await createBrand(formData);
        showSuccess('创建品牌成功');
      } else if (editingBrand) {
        await updateBrand(editingBrand.brandId, formData);
        showSuccess('更新品牌成功');
      }

      handleCloseModal();
      loadBrands();
    } catch (err: any) {
      console.error('提交失败:', err);
      showError(err.message || '操作失败');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * 删除品牌
   */
  const handleDelete = async (brand: Brand) => {
    if (!confirm(`确定要删除品牌"${brand.name}"吗？`)) {
      return;
    }

    try {
      await deleteBrand(brand.brandId);
      showSuccess('删除品牌成功');
      loadBrands();
    } catch (err: any) {
      console.error('删除失败:', err);
      showError(err.message || '删除失败');
    }
  };

  // ==================== 工具函数 ====================
  /**
   * 格式化品牌状态
   */
  const formatStatus = (status?: number) => {
    return status === 1 ? '启用' : '禁用';
  };

  /**
   * 获取状态样式
   * 参考旧系统：启用=绿色，禁用=红色
   */
  const getStatusStyle = (status?: number) => {
    return status === 1
      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
      : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
  };


  // ==================== 渲染：加载状态 ====================
  if (loading && brands.length === 0 && !error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400">加载中...</p>
        </div>
      </div>
    );
  }

  // ==================== 主渲染 ====================
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
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* 顶部操作栏 */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* 搜索框 */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索品牌名称..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>
        </form>

        {/* 添加品牌按钮 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreate}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>添加品牌</span>
        </motion.button>
      </div>

      {/* 品牌列表 */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Logo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  品牌名称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  描述
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  商品数量
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  排序
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
              {brands.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>暂无品牌数据</p>
                  </td>
                </tr>
              ) : (
                brands.map((brand, index) => {
                  // 调试日志：输出每个品牌的关键字段
                  if (index === 0) {
                    console.log('[Brands] First brand data:', {
                      brandId: brand.brandId,
                      id: brand.id,
                      status: brand.status,
                      showStatus: brand.showStatus,
                      name: brand.name
                    });
                  }
                  
                  return (
                    <motion.tr
                      key={brand.brandId || brand.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                        {brand.brandId || brand.id || '-'}
                      </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative h-10 w-10">
                        {brand.logo ? (
                          <img
                            src={getBrandLogoUrl(brand.logo)}
                            alt={brand.name}
                            className="h-10 w-10 rounded object-cover"
                            onError={(e) => {
                              // 图片加载失败时显示占位符
                              console.error(`[Brands] 图片加载失败: ${brand.name}, URL: ${getBrandLogoUrl(brand.logo)}`);
                              e.currentTarget.style.display = 'none';
                              const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                              if (placeholder) {
                                placeholder.classList.remove('hidden');
                              }
                            }}
                            onLoad={() => {
                              console.log(`[Brands] 图片加载成功: ${brand.name}, URL: ${getBrandLogoUrl(brand.logo)}`);
                            }}
                          />
                        ) : null}
                        <div className={`h-10 w-10 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center ${brand.logo ? 'hidden' : ''}`}>
                          <Package className="h-5 w-5 text-slate-400" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {brand.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-500 dark:text-slate-400 max-w-xs truncate">
                        {brand.description || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Package className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-900 dark:text-slate-100">
                          {brand.productCount || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                      {brand.sort || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusStyle(brand.status)}`}>
                        {formatStatus(brand.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      {brand.createTime ? formatDate(brand.createTime) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(brand)}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          title="编辑"
                        >
                          <Edit className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(brand)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          title="删除"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })
              )}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        {total > pageSize && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              共 {total} 条记录，第 {currentPage} / {Math.ceil(total / pageSize)} 页
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(Math.ceil(total / pageSize), currentPage + 1))}
                disabled={currentPage >= Math.ceil(total / pageSize)}
                className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 创建/编辑品牌模态框 */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* 模态框头部 */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {modalMode === 'create' ? '添加品牌' : '编辑品牌'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* 表单 */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* 品牌名称 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    品牌名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="请输入品牌名称"
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                </div>

                {/* Logo URL */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Logo URL
                  </label>
                  <input
                    type="text"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    placeholder="请输入Logo图片URL"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                  {formData.logo && (
                    <div className="mt-2">
                      <img
                        src={getBrandLogoUrl(formData.logo)}
                        alt="Logo预览"
                        className="h-20 w-20 rounded object-cover border border-slate-200 dark:border-slate-600"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* 品牌描述 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    品牌描述
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="请输入品牌描述"
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white resize-none"
                  />
                </div>

                {/* 排序 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    排序
                  </label>
                  <input
                    type="number"
                    value={formData.sort}
                    onChange={(e) => setFormData({ ...formData, sort: parseInt(e.target.value) || 0 })}
                    placeholder="数字越小越靠前"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                </div>

                {/* 状态 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    状态
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  >
                    <option value={1}>启用</option>
                    <option value={0}>禁用</option>
                  </select>
                </div>

                {/* 按钮组 */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={submitting}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                  >
                    取消
                  </button>
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>提交中...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>{modalMode === 'create' ? '创建' : '保存'}</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
