'use client';

/**
 * 用户积分管理视图 - 现代卡片式设计
 * User Points Management View - Modern Card Design
 * 
 * 功能：卡片式布局、用户头像、筛选功能、调整积分、历史记录
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { showSuccess, showError } from '@/lib/utils/toast';
import {
  Search,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  Activity,
  Settings,
  History,
  Star,
  Mail,
  Phone,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { getUserPointsList } from '@/lib/api/points';
import type { UserPoints } from '@/types/points';
import { AdjustPointsModal } from '../AdjustPointsModal';
import { PointsHistoryModal } from '../PointsHistoryModal';
import { LevelBadge } from '@/components/LevelBadge';

const AVATAR_BASE_URL = 'http://localhost:5173/avatars';

export function UserPointsView() {
  const [loading, setLoading] = useState(false);
  const [userPointsList, setUserPointsList] = useState<UserPoints[]>([]);
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalEarned: 0,
    totalSpent: 0,
  });
  
  const [keyword, setKeyword] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const [pagination, setPagination] = useState({
    current: 1,
    size: 12,
    total: 0,
  });

  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedUserPoints, setSelectedUserPoints] = useState<UserPoints | null>(null);

  // 头像加载重试次数记录
  const avatarRetryCount = useRef<Map<number, number>>(new Map());

  useEffect(() => {
    avatarRetryCount.current.clear();
    loadUserPoints();
  }, [pagination.current]);

  useEffect(() => {
    // 计算统计数据
    const totalEarned = userPointsList.reduce((sum, user) => sum + (user.totalEarned || 0), 0);
    const totalSpent = userPointsList.reduce((sum, user) => sum + (user.totalSpent || user.totalUsed || 0), 0);
    const activeUsers = userPointsList.filter(user => (user.points || 0) > 0).length;

    setStatistics({
      totalUsers: pagination.total,
      activeUsers,
      totalEarned,
      totalSpent,
    });
  }, [userPointsList, pagination.total]);

  const loadUserPoints = async () => {
    setLoading(true);
    try {
      const response = await getUserPointsList({
        page: pagination.current,
        size: pagination.size,
        userId: keyword ? Number(keyword) : undefined,
      });

      if (response.success && response.data) {
        const records = response.data.records || [];
        
        // 调试日志：查看返回的数据结构
        console.log('用户积分列表数据:', records);
        if (records.length > 0) {
          console.log('第一个用户数据示例:', records[0]);
        }
        
        setUserPointsList(records);
        setPagination({
          current: response.data.current || pagination.current,
          size: response.data.size || pagination.size,
          total: response.data.total || 0,
        });
      }
    } catch (error: any) {
      showError(error.response?.data?.message || '加载用户积分列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 });
    setTimeout(() => loadUserPoints(), 100);
  };

  const handleRefresh = () => {
    loadUserPoints();
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
    
    if (currentRetries < 3) {
      avatarRetryCount.current.set(userId, currentRetries + 1);
      e.currentTarget.src = `${AVATAR_BASE_URL}/default.jpg`;
    } else {
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

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3">
              <Users className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">总用户数</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
              {statistics.totalUsers}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-3">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">活跃用户</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
              {statistics.activeUsers}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-3">
              <Award className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">累计发放</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
              {statistics.totalEarned}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-3">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">累计消费</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
              {statistics.totalSpent}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 搜索栏 */}
      <Card className="border-0 shadow-lg">
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setKeyword('');
                  setPagination({ ...pagination, current: 1 });
                }}
              >
                重置筛选
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 用户卡片网格 */}
      <div>
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
                className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
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
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white bg-green-500" />
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
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant={userPoints.status === 1 ? 'default' : 'destructive'}
                          className={
                            userPoints.status === 1
                              ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200'
                          }
                        >
                          {userPoints.status === 1 ? '正常' : '禁用'}
                        </Badge>
                        <LevelBadge level={userPoints.level} />
                      </div>
                    </div>
                  </div>

                  {/* 联系信息 */}
                  <div className="space-y-2 mb-6 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        {userPoints.email || userPoints.user?.email || '未设置邮箱'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span>
                        {userPoints.phone || userPoints.user?.phone || '未设置手机'}
                      </span>
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
