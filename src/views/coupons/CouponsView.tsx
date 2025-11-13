"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Plus, Percent, Users, TrendingUp } from 'lucide-react';
import { Coupon } from './types';
import { couponsApi } from '@/lib/api';

export function CouponsView() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // 加载优惠券数据
  useEffect(() => {
    loadCoupons();
    loadStats();
  }, []);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await couponsApi.getAvailable();
      if (response.success && response.data) {
        // 转换后端数据格式为前端格式
        const formattedCoupons = response.data.map((item: any) => ({
          id: item.couponId?.toString() || item.id?.toString(),
          name: item.couponName || item.name,
          code: item.couponCode || item.code,
          type: item.discountType === 1 ? 'discount' : 'fixed',
          value: item.discountValue || item.value,
          minAmount: item.minAmount || 0,
          startDate: item.startTime || item.startDate,
          endDate: item.endTime || item.endDate,
          used: item.usedCount || 0,
          total: item.totalCount || item.total || 0,
          status: item.status === 1 ? 'active' : item.status === 0 ? 'inactive' : 'expired',
        }));
        setCoupons(formattedCoupons);
      }
    } catch (err: any) {
      console.error('加载优惠券失败:', err);
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await couponsApi.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('加载统计数据失败:', err);
    }
  };

  // 加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400">加载中...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={loadCoupons}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  // 计算统计数据
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter(c => c.status === "active").length;
  const totalUsed = coupons.reduce((sum, c) => sum + c.used, 0);
  const totalAvailable = coupons.reduce((sum, c) => sum + c.total, 0);
  const usageRate = totalAvailable > 0 ? Math.round((totalUsed / totalAvailable) * 100) : 0;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">优惠券管理</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">创建和管理优惠券</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium shadow-lg"
        >
          <Plus className="h-5 w-5" />
          创建优惠券
        </motion.button>
      </motion.div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "总优惠券", value: stats?.totalCoupons || totalCoupons, icon: Gift, color: "from-pink-500 to-rose-500" },
          { label: "活跃中", value: stats?.activeCoupons || activeCoupons, icon: TrendingUp, color: "from-green-500 to-emerald-500" },
          { label: "已使用", value: stats?.usedCount || totalUsed, icon: Users, color: "from-blue-500 to-cyan-500" },
          { label: "使用率", value: `${stats?.usageRate || usageRate}%`, icon: Percent, color: "from-purple-500 to-indigo-500" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50"
          >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* 优惠券列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {coupons.map((coupon, index) => (
            <motion.div
              key={coupon.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className={`relative bg-gradient-to-br ${
                coupon.status === "active" 
                  ? "from-pink-500 to-purple-600" 
                  : "from-slate-400 to-slate-500"
              } rounded-xl p-6 shadow-xl text-white overflow-hidden`}
            >
              {/* 装饰性背景 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <Gift className="h-8 w-8" />
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    coupon.status === "active" ? "bg-white/20" : "bg-black/20"
                  }`}>
                    {coupon.status === "active" ? "活跃" : coupon.status === "inactive" ? "未激活" : "已过期"}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold mb-2">{coupon.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  {coupon.type === "discount" ? (
                    <>
                      <span className="text-3xl font-bold">{coupon.value}%</span>
                      <span className="text-sm">折扣</span>
                    </>
                  ) : (
                    <>
                      <span className="text-sm">¥</span>
                      <span className="text-3xl font-bold">{coupon.value}</span>
                      <span className="text-sm">优惠</span>
                    </>
                  )}
                </div>
                
                <div className="space-y-2 text-sm bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <p>优惠码: <span className="font-mono font-bold">{coupon.code}</span></p>
                  <p>最低消费: ¥{coupon.minAmount}</p>
                  <p>使用情况: {coupon.used}/{coupon.total}</p>
                  <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(coupon.used / coupon.total) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="bg-white rounded-full h-2"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 添加优惠券弹窗 */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">创建优惠券</h3>
              <div className="space-y-4">
                <input type="text" placeholder="优惠券名称" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg" />
                <input type="text" placeholder="优惠码" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg" />
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium"
                  >
                    创建
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg font-medium"
                  >
                    取消
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
