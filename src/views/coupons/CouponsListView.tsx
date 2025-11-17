/**
 * 优惠券列表视图
 * Coupons List View
 * 基于旧系统优化，遵循KISS/YAGNI/SOLID原则
 */

"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Gift,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Copy,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { showSuccess, showError, showWarning } from '@/lib/utils/toast';

import { Badge } from '@/components/ui/badge';
import { couponsApi } from '@/lib/api/coupons';
import { Coupon, CouponFormData, CouponType, CouponStatus, CouponStats } from '@/types/coupon';
import { CouponFormModal } from './CouponFormModal';

export function CouponsListView() {
  // 状态管理
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [stats, setStats] = useState<CouponStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  
  // 筛选状态
  const [searchName, setSearchName] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
  // 弹窗状态
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  
  // 选中项
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // 加载数据
  useEffect(() => {
    loadCoupons();
    loadStats();
  }, [currentPage, pageSize, searchName, filterType, filterStatus]);

  // 加载优惠券列表
  const loadCoupons = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await couponsApi.getList({
        page: currentPage,
        pageSize,
        name: searchName || undefined,
        type: filterType as any || undefined,
        status: filterStatus as any || undefined,
      });

      if (response.success && response.data) {
        setCoupons(response.data.records || []);
        setTotal(response.data.total || 0);
      }
    } catch (err: any) {
      console.error('加载优惠券失败:', err);
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载统计数据
  const loadStats = async () => {
    try {
      const response = await couponsApi.getStatistics();
      console.log('统计数据响应:', response);
      if (response.success && response.data) {
        console.log('统计数据:', response.data);
        setStats(response.data);
      }
    } catch (err) {
      console.error('加载统计数据失败:', err);
    }
  };

  // 创建优惠券
  const handleCreate = () => {
    setEditingCoupon(null);
    setShowFormModal(true);
  };

  // 编辑优惠券
  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setShowFormModal(true);
  };

  // 提交表单
  const handleSubmit = async (data: CouponFormData) => {
    try {
      if (editingCoupon) {
        await couponsApi.update(editingCoupon.id, data);
      } else {
        await couponsApi.create(data);
      }
      loadCoupons();
      loadStats();
    } catch (err: any) {
      console.error('操作失败:', err);
      throw err;
    }
  };

  // 删除优惠券
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个优惠券吗？')) return;
    
    try {
      await couponsApi.delete(id);
      loadCoupons();
      loadStats();
    } catch (err: any) {
      console.error('删除失败:', err);
      showError('删除失败: ' + err.message);
    }
  };

  // 更新状态
  const handleUpdateStatus = async (id: number, status: CouponStatus) => {
    try {
      await couponsApi.updateStatus(id, status);
      loadCoupons();
      loadStats();
    } catch (err: any) {
      console.error('更新状态失败:', err);
      showError('更新状态失败: ' + err.message);
    }
  };

  // 复制优惠券
  const handleCopy = (coupon: Coupon) => {
    setEditingCoupon({
      ...coupon,
      id: 0,
      name: `${coupon.name}_副本`,
      status: CouponStatus.INACTIVE,
    } as Coupon);
    setShowFormModal(true);
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) {
      showWarning('请选择要删除的优惠券');
      return;
    }
    
    if (!confirm(`确定要删除选中的 ${selectedIds.length} 个优惠券吗？`)) return;
    
    try {
      await couponsApi.batchDelete(selectedIds);
      setSelectedIds([]);
      loadCoupons();
      loadStats();
    } catch (err: any) {
      console.error('批量删除失败:', err);
      showError('批量删除失败: ' + err.message);
    }
  };

  // 获取类型标签
  const getTypeTag = (type: CouponType) => {
    return type === CouponType.FIXED ? (
      <Badge variant="default" className="bg-blue-500">固定金额</Badge>
    ) : (
      <Badge variant="default" className="bg-green-500">折扣比例</Badge>
    );
  };

  // 获取状态标签
  const getStatusTag = (status: CouponStatus) => {
    switch (status) {
      case CouponStatus.ACTIVE:
        return <Badge variant="default" className="bg-green-500">生效中</Badge>;
      case CouponStatus.INACTIVE:
        return <Badge variant="secondary">未生效</Badge>;
      case CouponStatus.EXPIRED:
        return <Badge variant="destructive">已过期</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // 格式化日期
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('zh-CN');
  };

  // 计算使用率
  const getUsageRate = (coupon: Coupon) => {
    if (coupon.receivedQuantity === 0) return 0;
    return Math.round((coupon.usedQuantity / coupon.receivedQuantity) * 100);
  };

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            优惠券管理
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            管理系统中的所有优惠券
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          创建优惠券
        </Button>
      </motion.div>

      {/* 统计卡片 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: '总优惠券', value: stats.totalCoupons, color: 'from-pink-500 to-rose-500' },
            { label: '活跃中', value: stats.activeCoupons, color: 'from-green-500 to-emerald-500' },
            { label: '已使用', value: stats.usedCoupons, color: 'from-blue-500 to-cyan-500' },
            { label: '已过期', value: stats.expiredCoupons, color: 'from-red-500 to-orange-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <Gift className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                {stat.value ?? 0}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* 筛选和搜索 */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="搜索优惠券名称..."
                value={searchName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? '收起筛选' : '展开筛选'}
          </Button>

          {selectedIds.length > 0 && (
            <Button variant="destructive" onClick={handleBatchDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              批量删除 ({selectedIds.length})
            </Button>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div>
              <label className="text-sm font-medium mb-2 block">优惠券类型</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="全部类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">全部类型</SelectItem>
                  <SelectItem value={CouponType.FIXED}>固定金额</SelectItem>
                  <SelectItem value={CouponType.PERCENTAGE}>折扣比例</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">状态</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="全部状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">全部状态</SelectItem>
                  <SelectItem value={CouponStatus.ACTIVE}>生效中</SelectItem>
                  <SelectItem value={CouponStatus.INACTIVE}>未生效</SelectItem>
                  <SelectItem value={CouponStatus.EXPIRED}>已过期</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchName('');
                  setFilterType('');
                  setFilterStatus('');
                }}
                className="w-full"
              >
                重置筛选
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 优惠券卡片列表 */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-64 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
              <p className="text-slate-500 dark:text-slate-400">加载中...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={loadCoupons}>重试</Button>
            </div>
          </div>
        ) : coupons.length === 0 ? (
          <div className="flex items-center justify-center h-64 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
            <div className="text-center">
              <Gift className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400 mb-4">暂无优惠券数据</p>
              <Button onClick={handleCreate}>创建第一个优惠券</Button>
            </div>
          </div>
        ) : (
          <>
            {/* 批量操作栏 */}
            {selectedIds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-pink-200 dark:border-pink-800"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    已选择 {selectedIds.length} 个优惠券
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedIds([])}
                    >
                      取消选择
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBatchDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      批量删除
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 卡片列表 */}
            <div className="grid grid-cols-1 gap-4">
              {coupons.map((coupon, index) => (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="flex items-center gap-6 p-6">
                    {/* 选择框 */}
                    <div className="flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(coupon.id)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          if (e.target.checked) {
                            setSelectedIds([...selectedIds, coupon.id]);
                          } else {
                            setSelectedIds(selectedIds.filter(id => id !== coupon.id));
                          }
                        }}
                        className="w-5 h-5 rounded border-slate-300 text-pink-500 focus:ring-pink-500 cursor-pointer"
                      />
                    </div>

                    {/* 优惠券视觉卡片 */}
                    <div className="flex-shrink-0">
                      <div className={`relative w-32 h-24 rounded-lg overflow-hidden ${
                        coupon.type === CouponType.FIXED 
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                          : 'bg-gradient-to-br from-green-500 to-green-600'
                      }`}>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                          <div className="text-2xl font-bold">
                            {coupon.type === CouponType.FIXED
                              ? `¥${coupon.value}`
                              : `${coupon.value}折`}
                          </div>
                          {coupon.minSpend > 0 && (
                            <div className="text-xs mt-1 opacity-90">
                              满¥{coupon.minSpend}可用
                            </div>
                          )}
                        </div>
                        {/* 装饰性圆圈 */}
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-100 dark:bg-slate-900 rounded-full"></div>
                        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-100 dark:bg-slate-900 rounded-full"></div>
                      </div>
                    </div>

                    {/* 优惠券信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 truncate">
                              {coupon.name}
                            </h3>
                            {getTypeTag(coupon.type)}
                            {getStatusTag(coupon.status)}
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            ID: {coupon.id}
                          </p>
                        </div>
                      </div>

                      {/* 统计信息 */}
                      <div className="grid grid-cols-4 gap-4 mb-3">
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">已领取</p>
                          <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            {coupon.receivedQuantity}
                          </p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">已使用</p>
                          <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            {coupon.usedQuantity}
                          </p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">使用率</p>
                          <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            {getUsageRate(coupon)}%
                          </p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">剩余</p>
                          <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            {coupon.totalQuantity - coupon.receivedQuantity}
                          </p>
                        </div>
                      </div>

                      {/* 有效期 */}
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <span>有效期:</span>
                        <span>{formatDate(coupon.startTime)} ~ {formatDate(coupon.endTime)}</span>
                      </div>
                    </div>

                    {/* 操作按钮组 */}
                    <div className="flex-shrink-0 flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(coupon)}
                        className="w-24 justify-start hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:hover:bg-blue-900/20"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        编辑
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(coupon)}
                        className="w-24 justify-start hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300 dark:hover:bg-purple-900/20"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        复制
                      </Button>
                      {coupon.status === CouponStatus.ACTIVE ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(coupon.id, CouponStatus.INACTIVE)}
                          className="w-24 justify-start hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 dark:hover:bg-orange-900/20"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          停用
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(coupon.id, CouponStatus.ACTIVE)}
                          className="w-24 justify-start hover:bg-green-50 hover:text-green-600 hover:border-green-300 dark:hover:bg-green-900/20"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          启用
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(coupon.id)}
                        className="w-24 justify-start hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        删除
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 分页 */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 px-6 py-4">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                共 {total} 条记录，第 {currentPage} / {Math.ceil(total / pageSize)} 页
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  上一页
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= Math.ceil(total / pageSize)}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  下一页
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 表单弹窗 */}
      <CouponFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingCoupon(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingCoupon}
        title={editingCoupon ? '编辑优惠券' : '创建优惠券'}
      />
    </div>
  );
}
