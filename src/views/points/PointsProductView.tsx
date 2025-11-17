/**
 * 积分商品管理视图
 * Points Product Management View
 * 
 * 功能：积分商品的增删改查
 * Source: 对接后端 /admin/points/product 接口
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { pointsApi } from '@/lib/api/points';
import { showSuccess, showError } from '@/lib/utils/toast';
import {
  Search,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Package,
  Award,
  TrendingUp,
  Filter,
  ChevronDown,
  Image as ImageIcon
} from 'lucide-react';
import type { PointsProduct } from '@/types/points';
import { PointsProductModal } from './PointsProductModal';

// 商品分类映射
const CATEGORY_MAP: Record<string, { label: string; color: string }> = {
  virtual: { label: '虚拟商品', color: 'bg-blue-500' },
  physical: { label: '实物商品', color: 'bg-green-500' },
  coupon: { label: '优惠券', color: 'bg-purple-500' },
  vip: { label: '会员特权', color: 'bg-orange-500' }
};

export function PointsProductView() {
  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState<PointsProduct[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 12,
    total: 0
  });

  // 搜索和筛选
  const [keyword, setKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // 模态框状态
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<PointsProduct | null>(null);

  useEffect(() => {
    loadProducts();
  }, [pagination.current, categoryFilter, statusFilter]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await pointsApi.getPointsProductPage({
        page: pagination.current,
        size: pagination.size,
        name: keyword.trim() || undefined,
        category: categoryFilter === 'all' ? undefined : categoryFilter,
        status: statusFilter === 'all' ? undefined : Number(statusFilter)
      });

      if (data) {
        setProductList(data.records);
        setPagination({
          current: data.current,
          size: data.size,
          total: data.total
        });
      }
    } catch (error: any) {
      showError(error.response?.data?.message || '加载积分商品列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 });
    loadProducts();
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (product: PointsProduct) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (product: PointsProduct) => {
    if (!confirm(`确定要删除商品"${product.name}"吗？`)) return;

    try {
      await pointsApi.deletePointsProduct(product.id);
      showSuccess('删除成功');
      loadProducts();
    } catch (error: any) {
      showError(error.response?.data?.message || '删除失败');
    }
  };

  return (
    <div className="space-y-6">
      {/* 搜索和操作栏 */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="搜索商品名称..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 h-12 border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={handleSearch} disabled={loading} className="h-12 px-8">
                  查询
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-12"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  筛选
                  <ChevronDown
                    className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                  />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleCreate}
                  className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  新建商品
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={loadProducts}
                  disabled={loading}
                  className="h-12"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </motion.div>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-3 pt-2">
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">全部分类</option>
                      <option value="virtual">虚拟商品</option>
                      <option value="physical">实物商品</option>
                      <option value="coupon">优惠券</option>
                      <option value="vip">会员特权</option>
                    </select>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">全部状态</option>
                      <option value="1">上架</option>
                      <option value="0">下架</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* 商品列表 */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <RefreshCw className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-slate-600">加载中...</p>
          </motion.div>
        ) : productList.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-12"
          >
            <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">暂无商品</p>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {productList.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm overflow-hidden h-full">
                  {/* 商品图片 */}
                  <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-slate-300" />
                      </div>
                    )}
                    {product.isHot === 1 && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-red-500 text-white">热门</Badge>
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <Badge variant={product.status === 1 ? 'default' : 'secondary'}>
                        {product.status === 1 ? '上架' : '下架'}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="mb-3">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
                      <Badge className={`${CATEGORY_MAP[product.category]?.color || 'bg-gray-500'} text-white`}>
                        {CATEGORY_MAP[product.category]?.label || product.category}
                      </Badge>
                    </div>

                    {product.description && (
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{product.description}</p>
                    )}

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-purple-600" />
                          <span className="text-sm text-slate-600">所需积分</span>
                        </div>
                        <span className="font-bold text-purple-600 text-lg">{product.points}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-slate-600">库存</span>
                        </div>
                        <span className="font-semibold">{product.stock}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(product)}
                          className="w-full hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          编辑
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(product)}
                          className="w-full hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          删除
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 分页 */}
      {productList.length > 0 && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                共 <span className="font-semibold text-purple-600">{pagination.total}</span> 条记录
              </div>
              <div className="flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination({ ...pagination, current: pagination.current - 1 })}
                    disabled={pagination.current === 1 || loading}
                  >
                    上一页
                  </Button>
                </motion.div>
                <span className="text-sm px-4">
                  {pagination.current} / {Math.ceil(pagination.total / pagination.size) || 1}
                </span>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination({ ...pagination, current: pagination.current + 1 })}
                    disabled={pagination.current >= Math.ceil(pagination.total / pagination.size) || loading}
                  >
                    下一页
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 商品编辑模态框 */}
      <PointsProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={selectedProduct}
        onSuccess={loadProducts}
      />
    </div>
  );
}
