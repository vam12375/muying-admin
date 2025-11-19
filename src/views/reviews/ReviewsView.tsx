"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Search, Check, X, Calendar, User } from 'lucide-react';
import { OptimizedImage } from '@/components/common/OptimizedImage';
import { Review } from './types';
import { reviewsApi } from '@/lib/api';

export function ReviewsView() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | Review["status"]>("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // 加载评价数据
  useEffect(() => {
    loadReviews();
    loadStats();
  }, [currentPage, filterStatus]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 构建查询参数
      const statusMap: Record<string, number | undefined> = {
        'all': undefined,
        'pending': 0,
        'approved': 1,
        'rejected': 2,
      };
      
      const response = await reviewsApi.getList(
        currentPage,
        10,
        undefined, // productId
        undefined, // userId
        undefined, // minRating
        undefined, // maxRating
        statusMap[filterStatus], // status
        undefined  // orderId
      );
      
      if (response.success && response.data) {
        // 转换后端数据格式
        const formattedReviews = response.data.records?.map((item: any) => ({
          id: item.commentId?.toString() || item.id?.toString(),
          productName: item.productName || '未知商品',
          customerName: item.userName || item.userNickname || '匿名用户',
          rating: item.rating || 5,
          content: item.content || item.commentContent || '',
          images: item.images || [],
          date: item.createTime || item.date,
          status: item.status === 1 ? 'approved' : item.status === 0 ? 'pending' : 'rejected',
        })) || [];
        setReviews(formattedReviews);
      }
    } catch (err: any) {
      console.error('加载评价失败:', err);
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await reviewsApi.getStats(7);
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('加载统计数据失败:', err);
    }
  };

  // 审核操作
  const handleApprove = async (commentId: string) => {
    try {
      await reviewsApi.updateStatus(parseInt(commentId), 1);
      loadReviews(); // 重新加载数据
    } catch (err) {
      console.error('审核失败:', err);
    }
  };

  const handleReject = async (commentId: string) => {
    try {
      await reviewsApi.updateStatus(parseInt(commentId), 2);
      loadReviews(); // 重新加载数据
    } catch (err) {
      console.error('拒绝失败:', err);
    }
  };

  // 过滤评价
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || review.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // 状态标签样式
  const getStatusBadge = (status: Review["status"]) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    const labels = {
      pending: "待审核",
      approved: "已通过",
      rejected: "已拒绝",
    };
    return { style: styles[status], label: labels[status] };
  };

  // 渲染星级
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.div
            key={star}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: star * 0.05, type: "spring" }}
          >
            <Star
              className={`h-4 w-4 ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-slate-300 dark:text-slate-600"
              }`}
            />
          </motion.div>
        ))}
      </div>
    );
  };

  // 加载状态
  if (loading && reviews.length === 0) {
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
            onClick={loadReviews}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  // 计算统计数据
  const totalReviews = stats?.totalComments || reviews.length;
  const pendingReviews = reviews.filter(r => r.status === "pending").length;
  const approvedReviews = reviews.filter(r => r.status === "approved").length;
  const averageRating = stats?.averageRating?.toFixed(1) || "0.0";

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">评价管理</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">管理和审核用户评价</p>
        </div>
      </motion.div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "总评价数", value: totalReviews, color: "from-blue-500 to-cyan-500" },
          { label: "待审核", value: pendingReviews, color: "from-yellow-500 to-orange-500" },
          { label: "已通过", value: approvedReviews, color: "from-green-500 to-emerald-500" },
          { label: "平均评分", value: averageRating, color: "from-pink-500 to-purple-500" },
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
              <Star className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* 搜索和筛选 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-200/50 dark:border-slate-700/50"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索商品或用户..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50"
            />
          </div>
          <div className="flex gap-2">
            {["all", "pending", "approved", "rejected"].map((status) => (
              <motion.button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === status
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                }`}
              >
                {status === "all" ? "全部" : status === "pending" ? "待审核" : status === "approved" ? "已通过" : "已拒绝"}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 评价列表 */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredReviews.map((review, index) => {
            const statusBadge = getStatusBadge(review.status);
            return (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01, y: -2 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50 cursor-pointer"
                onClick={() => setSelectedReview(review)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">{review.productName}</h3>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge.style}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {review.customerName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {review.date}
                      </div>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>

                <p className="text-slate-600 dark:text-slate-300 mb-4">{review.content}</p>

                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {review.images.map((img, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.1 }}
                        className="w-20 h-20 rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-700"
                      >
                        <OptimizedImage 
                          src={img} 
                          alt="" 
                          className="w-full h-full object-cover"
                          folder="products"
                          width={80}
                          height={80}
                          lazy={true}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}

                {review.status === "pending" && (
                  <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(review.id);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Check className="h-4 w-4" />
                      通过
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(review.id);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <X className="h-4 w-4" />
                      拒绝
                    </motion.button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 详情弹窗 */}
      <AnimatePresence>
        {selectedReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedReview(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">评价详情</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">商品名称</p>
                  <p className="font-medium text-slate-800 dark:text-slate-100">{selectedReview.productName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">用户</p>
                  <p className="font-medium text-slate-800 dark:text-slate-100">{selectedReview.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">评分</p>
                  {renderStars(selectedReview.rating)}
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">评价内容</p>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">{selectedReview.content}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedReview(null)}
                  className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium"
                >
                  关闭
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
