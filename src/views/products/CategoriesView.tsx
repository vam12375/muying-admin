"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit, Trash2, FolderTree, ChevronRight, ChevronDown, X, Save } from 'lucide-react';
import { categoriesApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { Category, CategoryFormData } from '@/types/category';
import { showSuccess, showError, showWarning } from '@/lib/utils/toast';

/**
 * 分类管理视图
 * 展示树形分类结构、创建、编辑、删除等功能
 * 
 * Source: 基于后端 AdminCategoryController 实现
 * Design: 遵循 KISS, YAGNI, SOLID 原则
 */
export function CategoriesView() {
  // ==================== 状态管理 ====================
  const [categories, setCategories] = useState<Category[]>([]);
  const [flatCategories, setFlatCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  // 模态框状态
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    parentId: 0,
    level: 1,
    icon: '',
    description: '',
    sort: 0,
    status: 1,
  });
  const [submitting, setSubmitting] = useState(false);

  // ==================== 数据加载 ====================
  useEffect(() => {
    loadCategories();
  }, []);

  /**
   * 加载分类列表
   */
  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      // 同时加载树形和平铺结构
      const [treeResponse, listResponse] = await Promise.all([
        categoriesApi.getTree(),
        categoriesApi.getList(),
      ]);
      
      console.log('[Categories] Tree Response:', treeResponse);
      console.log('[Categories] List Response:', listResponse);
      
      if (treeResponse.success && treeResponse.data) {
        setCategories(treeResponse.data);
      }
      
      if (listResponse.success && listResponse.data) {
        setFlatCategories(listResponse.data);
      }
    } catch (err: any) {
      console.error('加载分类列表失败:', err);
      setError(err.message || '加载失败');
      setCategories([]);
      setFlatCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // ==================== 树形展开/收起 ====================
  /**
   * 切换分类展开状态
   */
  const toggleExpand = (categoryId: number) => {
    const newExpandedIds = new Set(expandedIds);
    if (newExpandedIds.has(categoryId)) {
      newExpandedIds.delete(categoryId);
    } else {
      newExpandedIds.add(categoryId);
    }
    setExpandedIds(newExpandedIds);
  };

  /**
   * 展开所有分类
   */
  const expandAll = () => {
    const allIds = new Set<number>();
    const collectIds = (cats: Category[]) => {
      cats.forEach(cat => {
        if (cat.children && cat.children.length > 0) {
          allIds.add(cat.categoryId);
          collectIds(cat.children);
        }
      });
    };
    collectIds(categories);
    setExpandedIds(allIds);
  };

  /**
   * 收起所有分类
   */
  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  // ==================== 模态框操作 ====================
  /**
   * 打开创建分类模态框
   */
  const handleCreate = (parentCategory?: Category) => {
    setModalMode('create');
    setEditingCategory(null);
    setFormData({
      name: '',
      parentId: parentCategory?.categoryId || 0,
      level: parentCategory ? (parentCategory.level || 1) + 1 : 1,
      icon: '',
      description: '',
      sort: 0,
      status: 1,
    });
    setShowModal(true);
  };

  /**
   * 打开编辑分类模态框
   */
  const handleEdit = (category: Category) => {
    setModalMode('edit');
    setEditingCategory(category);
    setFormData({
      name: category.name,
      parentId: category.parentId || 0,
      level: category.level || 1,
      icon: category.icon || '',
      description: category.description || '',
      sort: category.sort || 0,
      status: category.status || 1,
    });
    setShowModal(true);
  };

  /**
   * 关闭模态框
   */
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      parentId: 0,
      level: 1,
      icon: '',
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
      showWarning('请输入分类名称');
      return;
    }

    try {
      setSubmitting(true);

      if (modalMode === 'create') {
        await categoriesApi.create(formData);
        showSuccess('创建分类成功');
      } else if (editingCategory) {
        await categoriesApi.update(editingCategory.categoryId, formData);
        showSuccess('更新分类成功');
      }

      handleCloseModal();
      loadCategories();
    } catch (err: any) {
      console.error('提交失败:', err);
      showError(err.message || '操作失败');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * 删除分类
   */
  const handleDelete = async (categoryId: number) => {
    const category = flatCategories.find(c => c.categoryId === categoryId);
    if (!category || !confirm(`确定要删除分类"${category.name}"吗？`)) {
      return;
    }

    try {
      await categoriesApi.delete(category.categoryId);
      showSuccess('删除分类成功');
      loadCategories();
    } catch (err: any) {
      console.error('删除失败:', err);
      showError(err.message || '删除失败');
    }
  };

  /**
   * 切换分类状态
   */
  const handleToggleStatus = async (category: Category) => {
    const newStatus = category.status === 1 ? 0 : 1;
    
    try {
      await categoriesApi.updateStatus(category.categoryId, newStatus);
      showSuccess(`${newStatus === 1 ? '启用' : '禁用'}分类成功`);
      loadCategories();
    } catch (err: any) {
      console.error('更新状态失败:', err);
      showError(err.message || '更新状态失败');
    }
  };

  // ==================== 工具函数 ====================
  /**
   * 格式化分类状态
   */
  const formatStatus = (status?: number) => {
    return status === 1 ? '启用' : '禁用';
  };

  /**
   * 获取状态样式
   */
  const getStatusStyle = (status?: number) => {
    return status === 1
      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  };

  /**
   * 获取父分类名称
   */
  const getParentName = (parentId?: number) => {
    if (!parentId || parentId === 0) return '顶级分类';
    const parent = flatCategories.find(cat => cat.categoryId === parentId);
    return parent?.name || '未知';
  };


  // 渲染加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 渲染错误状态
  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">分类管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理商品分类层级结构</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setModalMode('create');
            setEditingCategory(null);
            setFormData({
              name: '',
              parentId: 0,
              level: 1,
              sort: 0,
              status: 1,
            });
            setShowModal(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg flex items-center gap-2 hover:shadow-lg transition-shadow"
        >
          <Plus className="w-4 h-4" />
          添加分类
        </motion.button>
      </div>

      {/* 分类列表 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="space-y-2">
          {flatCategories.map((category) => (
            <div
              key={category.categoryId}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <FolderTree className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{category.name}</p>
                  <p className="text-sm text-gray-500">
                    {getParentName(category.parentId)} | 层级: {category.level} | 排序: {category.sort}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusStyle(category.status)}`}>
                  {category.status === 1 ? '启用' : '禁用'}
                </span>
                <button
                  onClick={() => handleEdit(category)}
                  className="text-blue-600 hover:text-blue-800 p-1"
                  title="编辑"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.categoryId)}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="删除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 编辑/创建模态框 */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {modalMode === 'create' ? '添加分类' : '编辑分类'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    分类名称 *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请输入分类名称"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    父级分类
                  </label>
                  <select
                    value={formData.parentId}
                    onChange={(e) => {
                      const parentId = Number(e.target.value);
                      const parent = flatCategories.find(c => c.categoryId === parentId);
                      setFormData({
                        ...formData,
                        parentId,
                        level: parentId === 0 ? 1 : (parent?.level || 0) + 1
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>无（顶级分类）</option>
                    {flatCategories
                      .filter(cat => editingCategory ? cat.categoryId !== editingCategory.categoryId : true)
                      .map(cat => (
                        <option key={cat.categoryId} value={cat.categoryId}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      层级
                    </label>
                    <input
                      type="number"
                      value={formData.level}
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      排序
                    </label>
                    <input
                      type="number"
                      value={formData.sort}
                      onChange={(e) => setFormData({ ...formData, sort: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    描述
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请输入分类描述"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    状态
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>启用</option>
                    <option value={0}>禁用</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !formData.name}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
    </div>
  );
}
