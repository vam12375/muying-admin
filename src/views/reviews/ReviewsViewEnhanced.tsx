/**
 * 评价管理视图 - 增强版
 * Reviews Management View - Enhanced
 * 
 * 功能：
 * - 评价列表展示
 * - 多维度筛选（状态、评分、商品、用户）
 * - 评价审核（通过/拒绝）
 * - 商家回复
 * - 评价删除
 * - 统计数据展示
 * 
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Search,
  Check,
  X,
  Calendar,
  User,
  MessageSquare,
  Trash2,
  RefreshCw,
  Filter,
  TrendingUp,
  BarChart3,
  Image as ImageIcon,
} from "lucide-react";
import { OptimizedImage } from "@/components/common/OptimizedImage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { reviewsApi } from "@/lib/api/reviews";
import type { Comment, CommentStatistics, CommentStatus } from "@/types/comment";

export function ReviewsViewEnhanced() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState<CommentStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 筛选状态
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | number>("all");
  const [filterRating, setFilterRating] = useState<"all" | number>("all");
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  
  // 弹窗状态
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  // 加载评价数据
  useEffect(() => {
    loadComments();
    loadStatistics();
  }, [currentPage, filterStatus, filterRating]);

  const loadComments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await reviewsApi.getList(
        currentPage,
        pageSize,
        undefined, // productId
        undefined, // userId
        filterRating === "all" ? undefined : filterRating,
        undefined, // maxRating
        filterStatus === "all" ? undefined : filterStatus,
        undefined  // orderId
      );

      if (response.success && response.data) {
        setComments(response.data.records || []);
        setTotal(response.data.total || 0);
      }
    } catch (err: any) {
      console.error("加载评价失败:", err);
      setError(err.message || "加载失败");
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await reviewsApi.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error("加载统计数据失败:", err);
    }
  };

  // 审核通过
  const handleApprove = async (commentId: number) => {
    try {
      await reviewsApi.updateStatus(commentId, 1);
      loadComments();
      loadStatistics();
    } catch (err) {
      console.error("审核失败:", err);
    }
  };

  // 审核拒绝
  const handleReject = async (commentId: number) => {
    try {
      await reviewsApi.updateStatus(commentId, 2);
      loadComments();
      loadStatistics();
    } catch (err) {
      console.error("拒绝失败:", err);
    }
  };

  // 回复评价
  const handleReply = async () => {
    if (!selectedComment || !replyContent.trim()) return;

    try {
      await reviewsApi.reply(selectedComment.commentId, replyContent);
      setReplyModalOpen(false);
      setReplyContent("");
      setSelectedComment(null);
      loadComments();
    } catch (err) {
      console.error("回复失败:", err);
    }
  };

  // 删除评价
  const handleDelete = async (commentId: number) => {
    if (!confirm("确定要删除这条评价吗？")) return;

    try {
      await reviewsApi.delete(commentId);
      loadComments();
      loadStatistics();
    } catch (err) {
      console.error("删除失败:", err);
    }
  };

  // 过滤评价
  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // 状态标签样式
  const getStatusBadge = (status: CommentStatus) => {
    const config = {
      0: { style: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", label: "待审核" },
      1: { style: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", label: "已通过" },
      2: { style: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", label: "已拒绝" },
    };
    return config[status] || config[0];
  };

  // 渲染星级
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-slate-300 dark:text-slate-600"
            }`}
          />
        ))}
      </div>
    );
  };

  // 加载状态
  if (loading && comments.length === 0) {
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
            onClick={loadComments}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            评价管理
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            管理和审核用户评价，提升服务质量
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            loadComments();
            loadStatistics();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
        >
          <RefreshCw className="h-4 w-4" />
          刷新
        </motion.button>
      </motion.div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            label: "总评价数",
            value: stats?.totalComments || 0,
            icon: MessageSquare,
            color: "from-blue-500 to-cyan-500",
          },
          {
            label: "待审核",
            value: stats?.pendingComments || 0,
            icon: Filter,
            color: "from-yellow-500 to-orange-500",
          },
          {
            label: "已通过",
            value: stats?.approvedComments || 0,
            icon: Check,
            color: "from-green-500 to-emerald-500",
          },
          {
            label: "已拒绝",
            value: stats?.rejectedComments || 0,
            icon: X,
            color: "from-red-500 to-pink-500",
          },
          {
            label: "平均评分",
            value: stats?.averageRating?.toFixed(1) || "0.0",
            icon: TrendingUp,
            color: "from-purple-500 to-pink-500",
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <Card className="border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white via-white to-slate-50/50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900/50">
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* 评分分布 */}
      {stats?.ratingDistribution && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-pink-600" />
                评分分布
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = (stats.ratingDistribution as any)[`rating${rating}`] || 0;
                  const percentage = stats.totalComments > 0 
                    ? (count / stats.totalComments) * 100 
                    : 0;
                  return (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-20">
                        <span className="text-sm font-medium">{rating}</span>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex-1 h-6 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, delay: rating * 0.1 }}
                          className="h-full bg-gradient-to-r from-pink-500 to-purple-600"
                        />
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400 w-16 text-right">
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* 搜索和筛选 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="border-slate-200 dark:border-slate-700">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* 搜索框 */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索商品、用户或评价内容..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                />
              </div>

              {/* 状态筛选 */}
              <div className="flex gap-2">
                {[
                  { value: "all", label: "全部" },
                  { value: 0, label: "待审核" },
                  { value: 1, label: "已通过" },
                  { value: 2, label: "已拒绝" },
                ].map((status) => (
                  <motion.button
                    key={status.value}
                    onClick={() => setFilterStatus(status.value as any)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      filterStatus === status.value
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {status.label}
                  </motion.button>
                ))}
              </div>

              {/* 评分筛选 */}
              <div className="flex gap-2">
                {[
                  { value: "all", label: "全部评分" },
                  { value: 5, label: "5星" },
                  { value: 4, label: "4星" },
                  { value: 3, label: "3星" },
                  { value: 2, label: "2星" },
                  { value: 1, label: "1星" },
                ].map((rating) => (
                  <motion.button
                    key={rating.value}
                    onClick={() => setFilterRating(rating.value as any)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      filterRating === rating.value
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {rating.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 评价列表 */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredComments.map((comment, index) => {
            const statusBadge = getStatusBadge(comment.status);
            return (
              <motion.div
                key={comment.commentId}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01, y: -2 }}
              >
                <Card className="border-slate-200 dark:border-slate-700 cursor-pointer">
                  <CardContent className="p-6">
                    {/* 头部信息 */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                            {comment.productName}
                          </h3>
                          <Badge className={statusBadge.style}>{statusBadge.label}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {comment.userName}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {comment.createTime}
                          </div>
                        </div>
                      </div>
                      {renderStars(comment.rating)}
                    </div>

                    {/* 评价内容 */}
                    <p className="text-slate-600 dark:text-slate-300 mb-4">{comment.content}</p>

                    {/* 评价图片 */}
                    {comment.images && comment.images.length > 0 && (
                      <div className="flex gap-2 mb-4">
                        {comment.images.map((img, idx) => (
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

                    {/* 商家回复 */}
                    {comment.replyContent && (
                      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="h-4 w-4 text-pink-600" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            商家回复
                          </span>
                          {comment.replyTime && (
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {comment.replyTime}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {comment.replyContent}
                        </p>
                      </div>
                    )}

                    {/* 操作按钮 */}
                    <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                      {comment.status === 0 && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleApprove(comment.commentId)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            <Check className="h-4 w-4" />
                            通过
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleReject(comment.commentId)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            <X className="h-4 w-4" />
                            拒绝
                          </motion.button>
                        </>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedComment(comment);
                          setReplyModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <MessageSquare className="h-4 w-4" />
                        {comment.replyContent ? "修改回复" : "回复"}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(comment.commentId)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        删除
                      </motion.button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 分页 */}
      {total > pageSize && (
        <div className="flex items-center justify-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg disabled:opacity-50"
          >
            上一页
          </motion.button>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            第 {currentPage} 页 / 共 {Math.ceil(total / pageSize)} 页
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage >= Math.ceil(total / pageSize)}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg disabled:opacity-50"
          >
            下一页
          </motion.button>
        </div>
      )}

      {/* 回复弹窗 */}
      <AnimatePresence>
        {replyModalOpen && selectedComment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setReplyModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                回复评价
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">评价内容</p>
                  <p className="text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                    {selectedComment.content}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">回复内容</p>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="请输入回复内容..."
                    className="w-full h-32 px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReply}
                    className="flex-1 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium"
                  >
                    提交回复
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setReplyModalOpen(false);
                      setReplyContent("");
                    }}
                    className="px-6 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg font-medium"
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
