/**
 * 评价管理视图 - GSAP 动画版
 * Reviews Management View - GSAP Animated
 * 
 * 使用 GSAP 实现丰富的动画效果
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
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
  Sparkles,
  Award,
  ThumbsUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { reviewsApi } from "@/lib/api/reviews";
import type { Comment, CommentStatistics, CommentStatus } from "@/types/comment";

export function ReviewsViewGSAP() {
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

  // GSAP 引用
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // 页面加载动画
  useEffect(() => {
    if (!loading && headerRef.current && statsRef.current) {
      const tl = gsap.timeline();
      
      // 标题动画
      tl.from(headerRef.current, {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      })
      // 统计卡片动画
      .from(statsRef.current.children, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)"
      }, "-=0.4")
      // 图表动画
      .from(chartRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.3")
      // 筛选区域动画
      .from(filterRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.2");
    }
  }, [loading]);

  // 列表项动画
  useEffect(() => {
    if (listRef.current && comments.length > 0) {
      gsap.from(listRef.current.children, {
        x: -30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out"
      });
    }
  }, [comments]);

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
        undefined,
        undefined,
        filterRating === "all" ? undefined : filterRating,
        undefined,
        filterStatus === "all" ? undefined : filterStatus,
        undefined
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
            className={`h-4 w-4 transition-all duration-300 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-slate-300 dark:text-slate-600"
            }`}
          />
        ))}
      </div>
    );
  };

  // 卡片悬停动画
  const handleCardHover = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      y: -8,
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      y: 0,
      scale: 1,
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      duration: 0.3,
      ease: "power2.out"
    });
  };

  // 按钮点击动画
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    gsap.timeline()
      .to(button, { scale: 0.9, duration: 0.1 })
      .to(button, { scale: 1.05, duration: 0.1 })
      .to(button, { scale: 1, duration: 0.1 });
  };

  // 刷新按钮动画
  const handleRefresh = () => {
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
      gsap.to(refreshBtn, {
        rotation: 360,
        duration: 0.6,
        ease: "power2.inOut"
      });
    }
    loadComments();
    loadStatistics();
  };

  // 加载状态
  if (loading && comments.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-pink-200 dark:border-pink-900 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-pink-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-lg font-medium text-slate-600 dark:text-slate-400">加载中...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <X className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={loadComments}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
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
      <div ref={headerRef} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-pink-600" />
            评价管理中心
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            智能管理用户评价，提升服务质量
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="refresh-btn flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          刷新数据
        </button>
      </div>

      {/* 统计卡片 */}
      <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              label: "总评价数",
              value: stats?.totalComments || 0,
              icon: MessageSquare,
              gradient: "from-blue-500 via-cyan-500 to-teal-500",
              bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
            },
            {
              label: "待审核",
              value: stats?.pendingComments || 0,
              icon: Filter,
              gradient: "from-yellow-500 via-orange-500 to-red-500",
              bgGradient: "from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20",
            },
            {
              label: "已通过",
              value: stats?.approvedComments || 0,
              icon: ThumbsUp,
              gradient: "from-green-500 via-emerald-500 to-teal-500",
              bgGradient: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
            },
            {
              label: "已拒绝",
              value: stats?.rejectedComments || 0,
              icon: X,
              gradient: "from-red-500 via-pink-500 to-rose-500",
              bgGradient: "from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20",
            },
            {
              label: "平均评分",
              value: stats?.averageRating?.toFixed(1) || "0.0",
              icon: Award,
              gradient: "from-purple-500 via-pink-500 to-rose-500",
              bgGradient: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`relative overflow-hidden rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 cursor-pointer transition-all hover:shadow-lg`}
                onMouseEnter={handleCardHover}
                onMouseLeave={handleCardLeave}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

      {/* 评分分布图 */}
      {stats?.ratingDistribution && (
        <div ref={chartRef}>
          <Card className="border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <BarChart3 className="w-6 h-6 text-pink-600" />
                  评分分布统计
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = (stats.ratingDistribution as any)[`rating${rating}`] || 0;
                    const percentage = stats.totalComments > 0 
                      ? (count / stats.totalComments) * 100 
                      : 0;
                    return (
                      <div key={rating} className="flex items-center gap-4">
                        <div className="flex items-center gap-2 w-24">
                          <span className="text-lg font-bold text-slate-700 dark:text-slate-300">
                            {rating}
                          </span>
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        </div>
                        <div className="flex-1 h-8 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden relative">
                          <div
                            className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${percentage}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                          </div>
                        </div>
                        <div className="w-32 text-right">
                          <span className="text-lg font-bold text-slate-700 dark:text-slate-300">
                            {count}
                          </span>
                          <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">
                            ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 搜索和筛选 */}
        <div ref={filterRef}>
          <Card className="border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* 搜索框 */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="搜索商品、用户或评价内容..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all"
                  />
                </div>

                {/* 筛选按钮组 */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex gap-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center">
                      状态：
                    </span>
                    {[
                      { value: "all", label: "全部", color: "from-slate-500 to-slate-600" },
                      { value: 0, label: "待审核", color: "from-yellow-500 to-orange-500" },
                      { value: 1, label: "已通过", color: "from-green-500 to-emerald-500" },
                      { value: 2, label: "已拒绝", color: "from-red-500 to-pink-500" },
                    ].map((status) => (
                      <button
                        key={status.value}
                        onClick={(e) => {
                          handleButtonClick(e);
                          setFilterStatus(status.value as any);
                        }}
                        className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          filterStatus === status.value
                            ? `bg-gradient-to-r ${status.color} text-white shadow-lg scale-105`
                            : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:scale-105"
                        }`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center">
                      评分：
                    </span>
                    {[
                      { value: "all", label: "全部" },
                      { value: 5, label: "5★" },
                      { value: 4, label: "4★" },
                      { value: 3, label: "3★" },
                      { value: 2, label: "2★" },
                      { value: 1, label: "1★" },
                    ].map((rating) => (
                      <button
                        key={rating.value}
                        onClick={(e) => {
                          handleButtonClick(e);
                          setFilterRating(rating.value as any);
                        }}
                        className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          filterRating === rating.value
                            ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg scale-105"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:scale-105"
                        }`}
                      >
                        {rating.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 评价列表 */}
        <div ref={listRef} className="space-y-4">
          {filteredComments.map((comment) => {
            const statusBadge = getStatusBadge(comment.status);
            return (
              <div
                key={comment.commentId}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all"
                onMouseEnter={handleCardHover}
                onMouseLeave={handleCardLeave}
              >
                <div className="p-6">
                  {/* 头部信息 */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                          {comment.productName}
                        </h3>
                        <Badge className={`${statusBadge.style} px-3 py-1 text-sm`}>
                          {statusBadge.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span className="font-medium">{comment.userName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{comment.createTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {renderStars(comment.rating)}
                      <span className="text-2xl font-bold text-yellow-500">
                        {comment.rating}.0
                      </span>
                    </div>
                  </div>

                  {/* 评价内容 */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 mb-4">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>

                  {/* 评价图片 */}
                  {comment.images && comment.images.length > 0 && (
                    <div className="flex gap-3 mb-4">
                      {comment.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="w-24 h-24 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 商家回复 */}
                  {comment.replyContent && (
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-4 mb-4 border-l-4 border-pink-500">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-5 h-5 text-pink-600" />
                        <span className="text-sm font-bold text-pink-600 dark:text-pink-400">
                          商家回复
                        </span>
                        {comment.replyTime && (
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {comment.replyTime}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">
                        {comment.replyContent}
                      </p>
                    </div>
                  )}

                  {/* 操作按钮 */}
                  <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                    {comment.status === 0 && (
                      <>
                        <button
                          onClick={(e) => {
                            handleButtonClick(e);
                            handleApprove(comment.commentId);
                          }}
                          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-xl"
                        >
                          <Check className="w-4 h-4" />
                          通过审核
                        </button>
                        <button
                          onClick={(e) => {
                            handleButtonClick(e);
                            handleReject(comment.commentId);
                          }}
                          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-xl"
                        >
                          <X className="w-4 h-4" />
                          拒绝评价
                        </button>
                      </>
                    )}
                    <button
                      onClick={(e) => {
                        handleButtonClick(e);
                        setSelectedComment(comment);
                        setReplyModalOpen(true);
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-xl"
                    >
                      <MessageSquare className="w-4 h-4" />
                      {comment.replyContent ? "修改回复" : "回复评价"}
                    </button>
                    <button
                      onClick={(e) => {
                        handleButtonClick(e);
                        handleDelete(comment.commentId);
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                      删除
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 分页 */}
        {total > pageSize && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-6 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-pink-500 hover:text-pink-600 transition-all"
            >
              上一页
            </button>
            <div className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold shadow-lg">
              第 {currentPage} / {Math.ceil(total / pageSize)} 页
            </div>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage >= Math.ceil(total / pageSize)}
              className="px-6 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-pink-500 hover:text-pink-600 transition-all"
            >
              下一页
            </button>
          </div>
        )}

        {/* 回复弹窗 */}
        {replyModalOpen && selectedComment && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setReplyModalOpen(false)}
          >
            <div
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-2xl w-full shadow-2xl transform transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  回复用户评价
                </h3>
              </div>

              <div className="space-y-6">
                {/* 原评价内容 */}
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">
                    用户评价内容
                  </label>
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border-2 border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {selectedComment.userName}
                      </span>
                      {renderStars(selectedComment.rating)}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      {selectedComment.content}
                    </p>
                  </div>
                </div>

                {/* 回复输入框 */}
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">
                    您的回复
                  </label>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="请输入您的回复内容，让用户感受到您的诚意..."
                    className="w-full h-40 px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 resize-none transition-all"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    {replyContent.length} / 500 字符
                  </p>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-3">
                  <button
                    onClick={handleReply}
                    disabled={!replyContent.trim()}
                    className="flex-1 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    提交回复
                  </button>
                  <button
                    onClick={() => {
                      setReplyModalOpen(false);
                      setReplyContent("");
                    }}
                    className="px-8 py-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-lg transition-all"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
