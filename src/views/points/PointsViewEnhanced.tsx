/**
 * 积分管理视图 - 现代卡片式设计
 * Points Management View - Modern Card Design
 * 
 * 功能：卡片式布局、用户头像、GSAP动画
 * 
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
// 注意：此组件已被新的独立子菜单页面替代
// import { getUserPointsPage, togglePointsStatus, getPointsStatistics } from '@/lib/api/points';
import { showSuccess, showError } from '@/lib/utils/toast';
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
  Star,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import { AdjustPointsModal } from './AdjustPointsModal';
import { PointsHistoryModal } from './PointsHistoryModal';
import type { UserPoints, PointsStatistics as PointsStats } from '@/types/points';
import { useGSAPPointsAnimations } from './hooks/useGSAPPointsAnimations';

const AVATAR_BASE_URL = 'http://localhost:5173/avatars';

export function PointsViewEnhanced() {
  const [loading, setLoading] = useState(false);
  const [userPointsList, setUserPointsList] = useState<UserPoints[]>([]);
  const [statistics, setStatistics] = useState<PointsStats | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 12,
    total: 0
  });

  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedUserPoints, setSelectedUserPoints] = useState<UserPoints | null>(null);

  // 头像加载重试次数记录（userId -> 重试次数）
  const avatarRetryCount = useRef<Map<number, number>>(new Map());

  const statsCardsRef = useRef<HTMLDivElement>(null);
  const userCardsRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);

  const { animateStatsCards, animateUserCards, animateRefresh, animateSearch } = useGSAPPointsAnimations({
    statsCardsRef,
    userCardsRef,
    searchBarRef
  });

  useEffect(() => {
    // 清空头像重试计数
    avatarRetryCount.current.clear();
    loadUserPoints();
    loadStatistics();
  }, [pagination.current, statusFilter]);

  useEffect(() => {
    if (statistics) {
      animateStatsCards();
    }
  }, [statistics]);

  useEffect(() => {
    if (userPointsList.length > 0) {
      animateUserCards();
    }
  }, [userPointsList]);

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
      showError(error.response?.data?.message || '加载用户积分列表失败');
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
    animateSearch();
    setPagination({ ...pagination, current: 1 });
    setTimeout(() => loadUserPoints(), 300);
  };

  const handleRefresh = () => {
    animateRefresh();
    loadUserPoints();
    loadStatistics();
  };

  const handleToggleStatus = async (userPoints: UserPoints) => {
    const currentStatus = userPoints.status ?? userPoints.user?.status ?? 1;
    const newStatus = currentStatus === 1 ? 0 : 1;
    const action = newStatus === 1 ? '解冻' : '冻结';

    try {
      await togglePointsStatus(userPoints.userId, newStatus, `管理员${action}积分账户`);
      showSuccess(`${action}成功`);
      loadUserPoints();
    } catch (error: any) {
      showError(error.response?.data?.message || `${action}失败`);
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

  const getUserAvatar = (userPoints: UserPoints) => {
    const avatar = userPoints.user?.avatar || userPoints.username;
    if (avatar && avatar.startsWith('http')) {
      return avatar;
    }
    return `${AVATAR_BASE_URL}/${avatar || 'default'}.jpg`;
  };

  // 处理头像加载失败，限制重试次数为3次
  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement>, userId: number) => {
    const currentRetries = avatarRetryCount.current.get(userId) || 0;
    
    // 如果重试次数小于3次，尝试加载默认头像
    if (currentRetries < 3) {
      avatarRetryCount.current.set(userId, currentRetries + 1);
      e.currentTarget.src = `${AVATAR_BASE_URL}/default.jpg`;
    } else {
      // 超过3次后，不再重试，使用一个占位符或者移除src
      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect width="64" height="64" fill="%23e2e8f0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%2394a3b8"%3E?%3C/text%3E%3C/svg%3E';
    }
  };

  return (
    <div className="space-y-6">
      {/* 刷新按钮 */}
      <div className="flex justify-end">
        <Button
          onClick={handleRefresh}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          刷新数据
        </Button>
      </div>

      {/* 统计卡片 - 参考优惠券管理样式 */}
      <div ref={statsCardsRef} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="stat-card bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3">
              <Users className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">总用户数</p>
            <p className="stat-value text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1" data-target={statistics?.totalUsers || 0}>
              0
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-3">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">活跃用户</p>
            <p className="stat-value text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1" data-target={statistics?.activeUsers || 0}>
              0
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-3">
              <Award className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">累计发放</p>
            <p className="stat-value text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1" data-target={statistics?.totalEarned || 0}>
              0
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-3">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">累计消费</p>
            <p className="stat-value text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1" data-target={statistics?.totalSpent || 0}>
              0
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 搜索栏 */}
      <Card ref={searchBarRef} className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="搜索用户名、昵称、邮箱、手机号..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 h-12"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading} className="h-12 px-6">
              查询
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-12"
            >
              <Filter className="h-4 w-4 mr-2" />
              筛选
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {showFilters && (
            <div className="flex gap-3 mt-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option value="all">全部状态</option>
                <option value="1">正常</option>
                <option value="0">冻结</option>
              </select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 用户卡片网格 */}
      <div ref={userCardsRef}>
        {loading ? (
          <div className="text-center py-20">
            <RefreshCw className="h-16 w-16 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-slate-600">加载中...</p>
          </div>
        ) : userPointsList.length === 0 ? (
          <div className="text-center py-20">
            <Award className="h-20 w-20 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">暂无数据</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userPointsList.map((userPoints) => (
              <Card
                key={userPoints.id || userPoints.pointsId}
                className="user-card border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group opacity-0"
              >
                {/* 顶部渐变条 */}
                <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                
                <CardContent className="p-6">
                  {/* 用户头像和基本信息 */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative">
                      <img
                        src={getUserAvatar(userPoints)}
                        alt={userPoints.username || 'User'}
                        className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-lg"
                        onError={(e) => handleAvatarError(e, userPoints.userId)}
                      />
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                        (userPoints.status ?? userPoints.user?.status ?? 1) === 1 ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate">
                        {userPoints.username || userPoints.user?.username || `用户${userPoints.userId}`}
                      </h3>
                      {(userPoints.nickname || userPoints.user?.nickname) && (
                        <p className="text-sm text-slate-500 truncate">
                          {userPoints.nickname || userPoints.user?.nickname}
                        </p>
                      )}
                      <Badge
                        variant={(userPoints.status ?? userPoints.user?.status ?? 1) === 1 ? 'default' : 'destructive'}
                        className="mt-2"
                      >
                        {(userPoints.status ?? userPoints.user?.status ?? 1) === 1 ? '正常' : '禁用'}
                      </Badge>
                    </div>
                  </div>

                  {/* 联系信息 */}
                  <div className="space-y-2 mb-6 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{(userPoints.email || userPoints.user?.email) || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="h-4 w-4" />
                      <span>{(userPoints.phone || userPoints.user?.phone) || '-'}</span>
                    </div>
                  </div>

                  {/* 积分统计 */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Star className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                      <div className="text-xl font-bold text-blue-700">
                        {userPoints.currentPoints || userPoints.points || 0}
                      </div>
                      <div className="text-xs text-blue-600">当前</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-1" />
                      <div className="text-xl font-bold text-green-700">
                        {userPoints.totalEarned || 0}
                      </div>
                      <div className="text-xs text-green-600">获得</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <TrendingDown className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                      <div className="text-xl font-bold text-orange-700">
                        {userPoints.totalSpent || userPoints.totalUsed || 0}
                      </div>
                      <div className="text-xs text-orange-600">消费</div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAdjustPoints(userPoints)}
                      className="w-full"
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      调整
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewHistory(userPoints)}
                      className="w-full"
                    >
                      <History className="h-4 w-4 mr-1" />
                      历史
                    </Button>
                    <Button
                      size="sm"
                      variant={(userPoints.status ?? userPoints.user?.status ?? 1) === 1 ? 'destructive' : 'default'}
                      onClick={() => handleToggleStatus(userPoints)}
                      className="w-full col-span-2"
                    >
                      {(userPoints.status ?? userPoints.user?.status ?? 1) === 1 ? (
                        <>
                          <Lock className="h-4 w-4 mr-1" />
                          冻结
                        </>
                      ) : (
                        <>
                          <Unlock className="h-4 w-4 mr-1" />
                          解冻
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 分页 */}
      {userPointsList.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                共 <span className="font-bold text-purple-600">{pagination.total}</span> 条记录
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination({ ...pagination, current: pagination.current - 1 })}
                  disabled={pagination.current === 1 || loading}
                >
                  上一页
                </Button>
                <span className="text-sm px-4">
                  {pagination.current} / {Math.ceil(pagination.total / pagination.size) || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination({ ...pagination, current: pagination.current + 1 })}
                  disabled={pagination.current >= Math.ceil(pagination.total / pagination.size) || loading}
                >
                  下一页
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
