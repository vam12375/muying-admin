'use client';

/**
 * 积分管理 - 增强版卡片视图
 * Points Management - Enhanced Card View
 * 
 * 功能特性：
 * - 卡片/列表双视图切换
 * - 本地存储记忆功能
 * - 多维度排序
 * - 响应式设计
 * - 丰富的动画效果
 * 
 * Source: 参考 UsersView.tsx 卡片式设计
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, RefreshCw, Grid, List, ArrowUpDown, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { pointsApi } from '@/lib/api/points';
import { UserPoints, PointsListParams } from '@/types/points';
import { PageResult } from '@/types/common';
import { AdjustPointsModal } from './AdjustPointsModal';
import { PointsHistoryModal } from './PointsHistoryModal';

// Toast 通知函数
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  if (typeof window !== 'undefined') {
    console.log(`[${type.toUpperCase()}]`, message);
    // TODO: 集成实际的 toast 组件
  }
};

// 视图模式类型
type ViewMode = 'card' | 'list';

// 排序字段类型
type SortField = 'userId' | 'points' | 'createTime' | 'updateTime';
type SortOrder = 'asc' | 'desc';

// 用户偏好设置接口
interface UserPreferences {
  viewMode: ViewMode;
  sortField: SortField;
  sortOrder: SortOrder;
  pageSize: number;
}

// 默认偏好设置
const DEFAULT_PREFERENCES: UserPreferences = {
  viewMode: 'card',
  sortField: 'userId',
  sortOrder: 'asc',
  pageSize: 12,
};


// 本地存储键名
const STORAGE_KEY = 'points_view_preferences';

// 加载用户偏好
const loadPreferences = (): UserPreferences => {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('加载偏好设置失败:', error);
  }
  return DEFAULT_PREFERENCES;
};

// 保存用户偏好
const savePreferences = (preferences: UserPreferences) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('保存偏好设置失败:', error);
  }
};

export default function PointsViewCardEnhanced() {
  // 加载用户偏好
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  
  // 数据状态
  const [pointsList, setPointsList] = useState<UserPoints[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  
  // 查询参数
  const [params, setParams] = useState<PointsListParams>({
    page: 1,
    size: preferences.pageSize,
    keyword: '',
    status: undefined,
  });
  
  // 模态框状态
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserPoints | null>(null);
  
  // 筛选展开状态
  const [filterExpanded, setFilterExpanded] = useState(false);


  // 初始化：加载偏好设置
  useEffect(() => {
    const loaded = loadPreferences();
    setPreferences(loaded);
    setParams(prev => ({ ...prev, size: loaded.pageSize }));
  }, []);
  
  // 加载数据
  useEffect(() => {
    fetchPointsList();
  }, [params]);
  
  // 获取积分列表
  const fetchPointsList = async () => {
    setLoading(true);
    try {
      const response = await pointsApi.getUserPointsPage(params);
      
      if (!response) {
        throw new Error('获取数据失败');
      }
      
      // 应用排序
      let sortedList = response.records || [];
      sortedList = sortPointsList(sortedList, preferences.sortField, preferences.sortOrder);
      
      setPointsList(sortedList);
      setTotal(response.total || 0);
    } catch (error: any) {
      showToast(error.message || '获取积分列表失败', 'error');
      console.error('加载积分列表失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 排序函数
  const sortPointsList = (list: UserPoints[], field: SortField, order: SortOrder): UserPoints[] => {
    return [...list].sort((a, b) => {
      let aVal: any = field === 'points' ? a.currentPoints : a[field];
      let bVal: any = field === 'points' ? b.currentPoints : b[field];
      
      // 处理日期字段
      if (field === 'createTime' || field === 'updateTime') {
        aVal = new Date(aVal || 0).getTime();
        bVal = new Date(bVal || 0).getTime();
      }
      
      if (order === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  };
  
  // 更新偏好设置
  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
    
    // 如果改变了排序，重新排序当前列表
    if (key === 'sortField' || key === 'sortOrder') {
      const sorted = sortPointsList(
        pointsList,
        key === 'sortField' ? value as SortField : preferences.sortField,
        key === 'sortOrder' ? value as SortOrder : preferences.sortOrder
      );
      setPointsList(sorted);
    }
    
    // 如果改变了每页大小，重新加载
    if (key === 'pageSize') {
      setParams(prev => ({ ...prev, size: value as number, page: 1 }));
    }
  };


  // 搜索处理
  const handleSearch = (keyword: string) => {
    setParams(prev => ({ ...prev, keyword, page: 1 }));
  };
  
  // 状态筛选
  const handleStatusFilter = (status: string) => {
    setParams(prev => ({
      ...prev,
      status: status === 'all' ? undefined : parseInt(status),
      page: 1,
    }));
  };
  
  // 重置筛选
  const handleResetFilter = () => {
    setParams({
      page: 1,
      size: preferences.pageSize,
      keyword: '',
      status: undefined,
    });
    setFilterExpanded(false);
  };
  
  // 刷新数据
  const handleRefresh = () => {
    fetchPointsList();
    showToast('数据已刷新', 'success');
  };
  
  // 调整积分
  const handleAdjustPoints = (user: UserPoints) => {
    setSelectedUser(user);
    setAdjustModalOpen(true);
  };
  
  // 查看历史
  const handleViewHistory = (user: UserPoints) => {
    setSelectedUser(user);
    setHistoryModalOpen(true);
  };
  
  // 冻结/解冻账户
  const handleToggleStatus = async (user: UserPoints) => {
    try {
      const newStatus = user.status === 1 ? 0 : 1;
      await pointsApi.togglePointsStatus(user.userId, newStatus);
      
      showToast(`账户已${newStatus === 1 ? '解冻' : '冻结'}`, 'success');
      fetchPointsList();
    } catch (error: any) {
      showToast(error.message || '状态更新失败', 'error');
      console.error('切换状态失败:', error);
    }
  };
  
  // 分页处理
  const handlePageChange = (newPage: number) => {
    setParams(prev => ({ ...prev, page: newPage }));
  };


  // 渲染统计卡片
  const renderStatistics = () => {
    const totalPoints = pointsList.reduce((sum, user) => sum + (user.currentPoints || 0), 0);
    const activeUsers = pointsList.filter(user => user.status === 1).length;
    const frozenUsers = pointsList.filter(user => user.status === 0).length;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="text-sm opacity-90">总用户数</div>
            <div className="text-3xl font-bold mt-2">{total}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="text-sm opacity-90">活跃用户</div>
            <div className="text-3xl font-bold mt-2">{activeUsers}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="text-sm opacity-90">总积分</div>
            <div className="text-3xl font-bold mt-2">{totalPoints.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="text-sm opacity-90">冻结用户</div>
            <div className="text-3xl font-bold mt-2">{frozenUsers}</div>
          </CardContent>
        </Card>
      </div>
    );
  };


  // 渲染工具栏
  const renderToolbar = () => {
    return (
      <div className="flex flex-col gap-4 mb-6">
        {/* 第一行：搜索和操作按钮 */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="搜索用户ID、昵称、邮箱、手机号..."
              value={params.keyword || ''}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterExpanded(!filterExpanded)}
            >
              <Filter className="w-4 h-4 mr-2" />
              筛选
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新
            </Button>
          </div>
        </div>
        
        {/* 第二行：视图切换和排序 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">视图模式:</span>
            <div className="flex gap-1 border rounded-lg p-1">
              <Button
                variant={preferences.viewMode === 'card' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => updatePreference('viewMode', 'card')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={preferences.viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => updatePreference('viewMode', 'list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">排序:</span>
              <Select
                value={preferences.sortField}
                onValueChange={(value) => updatePreference('sortField', value as SortField)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="userId">用户ID</SelectItem>
                  <SelectItem value="points">积分</SelectItem>
                  <SelectItem value="createTime">创建时间</SelectItem>
                  <SelectItem value="updateTime">更新时间</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => updatePreference('sortOrder', preferences.sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <ArrowUpDown className="w-4 h-4 mr-2" />
              {preferences.sortOrder === 'asc' ? '升序' : '降序'}
            </Button>
          </div>
        </div>
        
        {/* 筛选面板 */}
        {filterExpanded && (
          <Card className="animate-in slide-in-from-top-2">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">账户状态</label>
                  <Select
                    value={params.status?.toString() || 'all'}
                    onValueChange={handleStatusFilter}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="1">正常</SelectItem>
                      <SelectItem value="0">冻结</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end gap-2">
                  <Button variant="outline" onClick={handleResetFilter}>
                    重置筛选
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };


  // 渲染卡片视图
  const renderCardView = () => {
    if (pointsList.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <p>暂无数据</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {pointsList.map((user) => (
          <Card
            key={user.userId}
            className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <CardContent className="p-6">
              {/* 用户头像和基本信息 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{user.username || '未知用户'}</div>
                    <div className="text-xs text-gray-500">ID: {user.userId}</div>
                  </div>
                </div>
                <Badge variant={user.status === 1 ? 'default' : 'destructive'}>
                  {user.status === 1 ? '正常' : '冻结'}
                </Badge>
              </div>
              
              {/* 积分信息 */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-600">当前积分</span>
                  <span className="text-lg font-bold text-blue-600">
                    {user.currentPoints?.toLocaleString() || 0}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-600">累计获得</span>
                  <span className="text-sm font-semibold text-green-600">
                    +{user.totalEarned?.toLocaleString() || 0}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm text-gray-600">累计消费</span>
                  <span className="text-sm font-semibold text-orange-600">
                    -{user.totalSpent?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleAdjustPoints(user)}
                >
                  调整积分
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleViewHistory(user)}
                >
                  交易历史
                </Button>
              </div>
              
              <Button
                variant={user.status === 1 ? 'destructive' : 'default'}
                size="sm"
                className="w-full mt-2"
                onClick={() => handleToggleStatus(user)}
              >
                {user.status === 1 ? '冻结账户' : '解冻账户'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };


  // 渲染列表视图
  const renderListView = () => {
    if (pointsList.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <p>暂无数据</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-2">
        {pointsList.map((user) => (
          <Card
            key={user.userId}
            className="hover:shadow-md transition-all duration-200"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                {/* 左侧：用户信息 */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{user.username || '未知用户'}</span>
                      <Badge variant={user.status === 1 ? 'default' : 'destructive'} className="text-xs">
                        {user.status === 1 ? '正常' : '冻结'}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">ID: {user.userId}</div>
                  </div>
                </div>
                
                {/* 中间：积分信息 */}
                <div className="hidden md:flex items-center gap-6 flex-1">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">当前积分</div>
                    <div className="text-lg font-bold text-blue-600">
                      {user.currentPoints?.toLocaleString() || 0}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xs text-gray-500">累计获得</div>
                    <div className="text-sm font-semibold text-green-600">
                      +{user.totalEarned?.toLocaleString() || 0}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xs text-gray-500">累计消费</div>
                    <div className="text-sm font-semibold text-orange-600">
                      -{user.totalSpent?.toLocaleString() || 0}
                    </div>
                  </div>
                </div>
                
                {/* 右侧：操作按钮 */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAdjustPoints(user)}
                  >
                    调整积分
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewHistory(user)}
                  >
                    交易历史
                  </Button>
                  <Button
                    variant={user.status === 1 ? 'destructive' : 'default'}
                    size="sm"
                    onClick={() => handleToggleStatus(user)}
                  >
                    {user.status === 1 ? '冻结' : '解冻'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };


  // 渲染分页
  const renderPagination = () => {
    const totalPages = Math.ceil(total / params.size!);
    
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex justify-center items-center gap-2 mt-6">
        <Button
          variant="outline"
          size="sm"
          disabled={params.page === 1}
          onClick={() => handlePageChange(params.page! - 1)}
        >
          上一页
        </Button>
        
        <div className="flex items-center gap-2">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (params.page! <= 3) {
              pageNum = i + 1;
            } else if (params.page! >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = params.page! - 2 + i;
            }
            
            return (
              <Button
                key={pageNum}
                variant={params.page === pageNum ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          disabled={params.page === totalPages}
          onClick={() => handlePageChange(params.page! + 1)}
        >
          下一页
        </Button>
        
        <span className="text-sm text-gray-600 ml-4">
          共 {total} 条记录，第 {params.page} / {totalPages} 页
        </span>
      </div>
    );
  };


  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">积分管理</h1>
        <p className="text-sm text-gray-500 mt-1">管理用户积分账户，调整积分和查看交易历史</p>
      </div>
      
      {/* 统计卡片 */}
      {renderStatistics()}
      
      {/* 工具栏 */}
      {renderToolbar()}
      
      {/* 数据视图 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 mt-2">加载中...</p>
        </div>
      ) : (
        <>
          {preferences.viewMode === 'card' ? renderCardView() : renderListView()}
          {renderPagination()}
        </>
      )}
      
      {/* 调整积分模态框 */}
      {selectedUser && (
        <AdjustPointsModal
          open={adjustModalOpen}
          onClose={() => {
            setAdjustModalOpen(false);
            setSelectedUser(null);
          }}
          onSuccess={() => {
            fetchPointsList();
            setAdjustModalOpen(false);
            setSelectedUser(null);
          }}
          userPoints={selectedUser}
        />
      )}
      
      {/* 交易历史模态框 */}
      {selectedUser && (
        <PointsHistoryModal
          open={historyModalOpen}
          onClose={() => {
            setHistoryModalOpen(false);
            setSelectedUser(null);
          }}
          userPoints={selectedUser}
        />
      )}
    </div>
  );
}
