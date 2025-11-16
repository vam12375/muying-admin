'use client';

/**
 * 商品列表视图
 * Products List View
 * 
 * Source: 基于 muying-admin-react ProductList.tsx 改造
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Plus, Edit2, Trash2, Eye,
  Package, AlertCircle, CheckCircle
} from 'lucide-react';
import { getProductList, deleteProduct, updateProductStatus, getProductDetail, createProduct, updateProduct } from '@/lib/api/products';
import { getAllBrands } from '@/lib/api/brands';
import { getCategoryList } from '@/lib/api/categories';
import { ProductDetailModal } from '@/components/products/ProductDetailModal';
import { ProductEditModal } from '@/components/products/ProductEditModal';
import { getProductImageUrl } from '@/lib/utils/image';
import { showSuccess, showError, showWarning } from '@/lib/utils/toast';
import type { Product, ProductFormData } from '@/types/product';
import type { Brand } from '@/types/brand';
import type { Category } from '@/types/category';

export function ProductsView() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // 搜索和筛选
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<number | undefined>();
  
  // 分页
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // 弹窗状态
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // 加载数据
  useEffect(() => {
    loadProducts();
    loadBrands();
    loadCategories();
  }, [currentPage, keyword, selectedCategory, selectedStatus]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getProductList({
        page: currentPage,
        size: pageSize,
        keyword,
        categoryId: selectedCategory,
        status: selectedStatus
      });
      
      if (response.success && response.data) {
        setProducts(response.data.records || []);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error('加载商品列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBrands = async () => {
    try {
      const response = await getAllBrands();
      if (response.success && response.data) {
        setBrands(response.data);
      }
    } catch (error) {
      console.error('加载品牌列表失败:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await getCategoryList();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('加载分类列表失败:', error);
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
    setSelectedCategory(undefined);
    setSelectedStatus(undefined);
    setCurrentPage(1);
  };

  // 删除商品
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除该商品吗？')) return;
    
    try {
      const response = await deleteProduct(id);
      if (response.success) {
        showSuccess('删除成功');
        loadProducts();
      }
    } catch (error) {
      console.error('删除商品失败:', error);
      showError('删除失败');
    }
  };

  // 切换商品状态
  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === '上架' ? 0 : 1;
    
    try {
      const response = await updateProductStatus(id, newStatus);
      if (response.success) {
        showSuccess(`${newStatus === 1 ? '上架' : '下架'}成功`);
        loadProducts();
      }
    } catch (error) {
      console.error('更新商品状态失败:', error);
      showError('操作失败');
    }
  };

  // 查看商品详情
  const handleViewDetail = async (id: number) => {
    try {
      const response = await getProductDetail(id);
      if (response.success && response.data) {
        setSelectedProduct(response.data);
        setDetailModalOpen(true);
      }
    } catch (error) {
      console.error('获取商品详情失败:', error);
      showError('获取商品详情失败');
    }
  };

  // 编辑商品
  const handleEdit = async (id: number) => {
    try {
      const response = await getProductDetail(id);
      if (response.success && response.data) {
        setSelectedProduct(response.data);
        setEditModalOpen(true);
      }
    } catch (error) {
      console.error('获取商品详情失败:', error);
      showError('获取商品详情失败');
    }
  };

  // 添加商品
  const handleAdd = () => {
    setSelectedProduct(null);
    setEditModalOpen(true);
  };

  // 保存商品
  const handleSave = async (data: ProductFormData) => {
    try {
      let response;
      if (selectedProduct) {
        response = await updateProduct(selectedProduct.productId, data);
      } else {
        response = await createProduct(data);
      }
      
      if (response.success) {
        showSuccess(selectedProduct ? '更新成功' : '创建成功');
        loadProducts();
      }
    } catch (error) {
      console.error('保存商品失败:', error);
      throw error;
    }
  };

  // 格式化价格
  const formatPrice = (price: number) => {
    return `¥${price.toFixed(2)}`;
  };

  // 获取状态样式
  const getStatusStyle = (status: string) => {
    return status === '上架'
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-100 text-gray-700';
  };

  // 获取库存样式
  const getStockStyle = (stock: number) => {
    if (stock > 10) return 'bg-green-100 text-green-700';
    if (stock > 0) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">商品管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理商品信息、库存和状态</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
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
              placeholder="搜索商品名称/品牌"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 分类筛选 */}
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : undefined)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部分类</option>
            {categories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* 状态筛选 */}
          <select
            value={selectedStatus !== undefined ? selectedStatus : ''}
            onChange={(e) => setSelectedStatus(e.target.value ? Number(e.target.value) : undefined)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部状态</option>
            <option value="1">在售</option>
            <option value="0">下架</option>
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
            <p>暂无商品数据</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    商品信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    价格
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    库存
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    创建时间
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {products.map((product, index) => (
                  <motion.tr
                    key={product.productId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.productId}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getProductImageUrl(product.productImg)}
                          alt={product.productName}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.productName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.categoryName} | {product.brandName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <p className="text-red-500 font-medium">{formatPrice(product.priceNew)}</p>
                        {product.priceOld > product.priceNew && (
                          <p className="text-xs text-gray-400 line-through">
                            {formatPrice(product.priceOld)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStockStyle(product.stock)}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusStyle(product.productStatus)}`}>
                        {product.productStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.createTime?.substring(0, 10)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetail(product.productId)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="查看"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(product.productId)}
                          className="text-green-600 hover:text-green-800 p-1"
                          title="编辑"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(product.productId, product.productStatus)}
                          className="text-yellow-600 hover:text-yellow-800 p-1"
                          title={product.productStatus === '上架' ? '下架' : '上架'}
                        >
                          {product.productStatus === '上架' ? (
                            <AlertCircle className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(product.productId)}
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

      {/* 商品详情弹窗 */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedProduct(null);
        }}
      />

      {/* 商品编辑弹窗 */}
      <ProductEditModal
        product={selectedProduct}
        brands={brands}
        categories={categories}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedProduct(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
