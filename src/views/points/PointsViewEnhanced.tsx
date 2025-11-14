/**
 * 积分管理增强版视图组件
 * Points Management Enhanced View Component
 * 
 * 功能：现代化UI、丰富动画、高性能渲染
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getUserPointsPage, togglePointsStatus, getPointsStatistics } from '@/lib/api/points';
import {
  Search,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  Activity,
  Lock,
  Unlock,
  History,
  Settings,
  Sparkles,
  Filter,
  ChevronDown,
  Star
} from 'lucide-react';
import { AdjustPointsModal } from './AdjustPointsModal';
import { PointsHistoryModal } from './PointsHistoryModal';
import type { UserPoints, PointsStatistics as PointsStats } from '@/types/points';

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  if (typeof window !== 'undefined') {
    console.log(`[${type.toUpperCase()}]`, message);
  }
};

// 动画变体
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  }
};

const cardHoverVariants = {
  rest: { scale: 1, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
  hover: {
    scale: 1.02,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10
    }
  }
};

export function PointsViewEnhanced() {
  const [loading, setLoading] = useState(false);
  const [userPointsList, setUserPointsList] = useState<UserPoints[]>([]);
  const [statistics, setStatistics] = useState<PointsStats | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
    total: 0
  });

  // 搜索和筛选
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // 模态框状态
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedUserPoints, setSelectedUserPoints] = useState<UserPoints | null>(null);

  useEffect(() => {
    loadUserPoints();
    loadStatistics();
  }, [pagination.current, statusFilter]);

  const loadUserPoints = async () => {
    setLoading(true);
    try {
      const data = await getUserPointsPage({
        page: pagination.current,
        size: pagination.size,
        keyword: keyword.trim() || undefined,
        status: statusFilter === 'all' ? undefined : Number(statusFilter)
      });

      if (data) {
        setUserPointsList(data.records);
        setPagination({
          current: data.current,
          size: data.size,
          total: data.total
        });
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || '加载用户积分列表失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const data = await getPointsStatistics();
      if (data) {
        setStatistics(data);
      }
    } catch (error: any) {
      console.error('加载统计信息失败:', error);
    }
  };

  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 });
    loadUserPoints();
  };

  const handleToggleStatus = async (userPoints: UserPoints) => {
    const newStatus = userPoints.status === 1 ? 0 : 1;
    const action = newStatus === 1 ? '解冻' : '冻结';

    try {
      await togglePointsStatus(userPoints.userId, newStatus, `管理员${action}积分账户`);
      showToast(`${action}成功`, 'success');
      loadUserPoints();
    } catch (error: any) {
      showToast(error.response?.data?.message || `${action}失败`, 'error');
    }
  };

  const handleAdjustPoints = (userPoints: UserPoints) => {
    setSelectedUserPoints(userPoints);
    setAdjustModalOpen(true);
  };

  const handleViewHistory = (userPoints: UserPoints) => {
    setSelectedUserPoints(userPoints);
    setHistoryModalOpen(true);
  };

  // 计算统计数据的百分比变化（模拟）
  const statsWithTrend = useMemo(() => {
    if (!statistics) return null;
    return {
      totalUsers: { value: statistics.totalUsers || 0, trend: '+12.5%', isUp: true },
      activeUsers: { value: statistics.activeUsers || 0, trend: '+8.3%', isUp: true },
      totalEarned: { value: statistics.totalEarned || 0, trend: '+15.7%', isUp: true },
      totalSpent: { value: statistics.totalSpent || 0, trend: '+10.2%', isUp: true }
    };
  }, [statistics]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* 页面标题 */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-purple-600" />
              积分管理
            </h1>
            <p className="text-slate-600 mt-1">管理用户积分，查看积分统计和历史记录</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => {
                loadUserPoints();
                loadStatistics();
              }}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              刷新数据
            </Button>
          </motion.div>
        </motion.div>

        {/* 统计卡片 */}
        {statsWithTrend && (
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 总用户数 */}
            <motion.div
              variants={cardHoverVariants}
              initial="rest"
              whileHover="hover"
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg"
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-8 w-8 opacity-80" />
                  <Badge className="bg-white/20 text-white border-0">
                    {statsWithTrend.totalUsers.trend}
                  </Badge>
                </div>
                <div className="text-3xl font-bold mb-1">{statsWithTrend.totalUsers.value}</div>
                <div className="text-blue-100 text-sm">总用户数</div>
              </div>
            </motion.div>

            {/* 活跃用户 */}
            <motion.div
              variants={cardHoverVariants}
              initial="rest"
              whileHover="hover"
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white shadow-lg"
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="h-8 w-8 opacity-80" />
                  <Badge className="bg-white/20 text-white border-0">
                    {statsWithTrend.activeUsers.trend}
                  </Badge>
                </div>
                <div className="text-3xl font-bold mb-1">{statsWithTrend.activeUsers.value}</div>
                <div className="text-green-100 text-sm">活跃用户</div>
              </div>
            </motion.div>

            {/* 累计发放 */}
            <motion.div
              variants={cardHoverVariants}
              initial="rest"
              whileHover="hover"
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white shadow-lg"
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <Award className="h-8 w-8 opacity-80" />
                  <Badge className="bg-white/20 text-white border-0">
                    {statsWithTrend.totalEarned.trend}
                  </Badge>
                </div>
                <div className="text-3xl font-bold mb-1">{statsWithTrend.totalEarned.value}</div>
                <div className="text-purple-100 text-sm">累计发放</div>
              </div>
            </motion.div>

            {/* 累计消费 */}
            <motion.div
              variants={cardHoverVariants}
              initial="rest"
              whileHover="hover"
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-6 text-white shadow-lg"
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="h-8 w-8 opacity-80" />
                  <Badge className="bg-white/20 text-white border-0">
                    {statsWithTrend.totalSpent.trend}
                  </Badge>
                </div>
                <div className="text-3xl font-bold mb-1">{statsWithTrend.totalSpent.value}</div>
                <div className="text-orange-100 text-sm">累计消费</div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* 搜索和筛选区域 */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      placeholder="搜索用户名、昵称、邮箱、手机号..."
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
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="all">全部状态</option>
                          <option value="1">正常</option>
                          <option value="0">冻结</option>
                        </select>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 用户积分卡片列表 */}
        <motion.div variants={itemVariants}>
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
            ) : userPointsList.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-12"
              >
                <Award className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">暂无数据</p>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                variants={containerVariants}
                className="grid grid-cols-1 gap-4"
              >
                {userPointsList.map((userPoints, index) => (
                  <motion.div
                    key={userPoints.pointsId}
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ scale: 1.01 }}
                    className="group"
                  >
                    <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" />
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          {/* 左侧：用户信息 */}
                          <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                              <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                                className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg"
                              >
                                {userPoints.username?.charAt(0).toUpperCase()}
                              </motion.div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-lg">{userPoints.username}</span>
                                  {userPoints.nickname && (
                                    <span className="text-slate-500">({userPoints.nickname})</span>
                                  )}
                                  <Badge
                                    variant={userPoints.status === 1 ? 'default' : 'destructive'}
                                    className="ml-2"
                                  >
                                    {userPoints.status === 1 ? '正常' : '冻结'}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                                  <span>ID: {userPoints.userId}</span>
                                  {userPoints.email && <span>📧 {userPoints.email}</span>}
                                  {userPoints.phone && <span>📱 {userPoints.phone}</span>}
                                </div>
                              </div>
                            </div>

                            {/* 积分统计 */}
                            <div className="grid grid-cols-3 gap-4">
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <Star className="h-5 w-5 text-blue-600" />
                                  <span className="text-xs text-blue-600 font-medium">当前积分</span>
                                </div>
                                <div className="text-2xl font-bold text-blue-700">
                                  {userPoints.currentPoints}
                                </div>
                              </motion.div>

                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4 border border-green-200"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <TrendingUp className="h-5 w-5 text-green-600" />
                                  <span className="text-xs text-green-600 font-medium">累计获得</span>
                                </div>
                                <div className="text-2xl font-bold text-green-700">
                                  {userPoints.totalEarned}
                                </div>
                              </motion.div>

                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-gradient-to-br from-orange-50 to-red-100 rounded-xl p-4 border border-orange-200"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <TrendingDown className="h-5 w-5 text-orange-600" />
                                  <span className="text-xs text-orange-600 font-medium">累计消费</span>
                                </div>
                                <div className="text-2xl font-bold text-orange-700">
                                  {userPoints.totalSpent}
                                </div>
                              </motion.div>
                            </div>
                          </div>

                          {/* 右侧：操作按钮 */}
                          <div className="flex flex-col gap-2 ml-6">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAdjustPoints(userPoints)}
                                className="w-full justify-start hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300"
                              >
                                <Settings className="h-4 w-4 mr-2" />
                                调整积分
                              </Button>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewHistory(userPoints)}
                                className="w-full justify-start hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                              >
                                <History className="h-4 w-4 mr-2" />
                                交易历史
                              </Button>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                size="sm"
                                variant={userPoints.status === 1 ? 'destructive' : 'default'}
                                onClick={() => handleToggleStatus(userPoints)}
                                className="w-full justify-start"
                              >
                                {userPoints.status === 1 ? (
                                  <>
                                    <Lock className="h-4 w-4 mr-2" />
                                    冻结账户
                                  </>
                                ) : (
                                  <>
                                    <Unlock className="h-4 w-4 mr-2" />
                                    解冻账户
                                  </>
                                )}
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 分页 */}
        {userPointsList.length > 0 && (
          <motion.div variants={itemVariants}>
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
          </motion.div>
        )}
      </motion.div>

      {/* 模态框 */}
      <AdjustPointsModal
        open={adjustModalOpen}
        onClose={() => setAdjustModalOpen(false)}
        userPoints={selectedUserPoints}
        onSuccess={() => {
          loadUserPoints();
          loadStatistics();
        }}
      />

      <PointsHistoryModal
        open={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        userPoints={selectedUserPoints}
      />
    </div>
  );
}
