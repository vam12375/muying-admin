'use client';

/**
 * 消息管理视图（增强版）
 * Messages Management View (Enhanced)
 * 
 * 功能：
 * - 现代化UI设计
 * - 渐变色统计卡片
 * - 流畅的动画效果
 * - 优化的用户体验
 */

import { useState, useEffect } from 'react';
import { 
  Bell, 
  Send, 
  Eye, 
  Users, 
  Plus,
  Search,
  Filter,
  Trash2,
  RefreshCw,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { showSuccess, showError } from '@/lib/utils/toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  getMessageList, 
  getMessageStatistics,
  deleteMessage,
  markMessageAsRead 
} from '@/lib/api/messages';
import type { Message, MessageListParams, MessageStatistics } from '@/types/message';
import { MessageFormModal } from './MessageFormModal';
import { MessageDetailModal } from './MessageDetailModal';
import { MessageStatCard, MessageListItem } from '@/components/messages';
import { useRefreshAnimation } from '@/hooks/useGSAPAnimations';

export function MessagesViewEnhanced() {
  // 状态管理
  const [messages, setMessages] = useState<Message[]>([]);
  const [statistics, setStatistics] = useState<MessageStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // 分页状态
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // 模态框状态
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // 刷新触发器（用于动画）
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // GSAP 动画 Hook
  const statsContainerRef = useRefreshAnimation(refreshTrigger);

  // 加载消息列表
  const loadMessages = async () => {
    setLoading(true);
    try {
      const params: MessageListParams = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        keyword: searchKeyword || undefined,
        type: selectedType !== 'all' ? selectedType as any : undefined,
        status: selectedStatus !== 'all' ? selectedStatus as any : undefined
      };

      const result = await getMessageList(params);
      setMessages(result.records || []);
      setPagination(prev => ({
        ...prev,
        total: result.total
      }));
    } catch (error: any) {
      console.error('加载消息列表失败:', error);
      // 显示友好的错误提示
      if (error.message && !error.message.includes('统计接口')) {
        showError(`加载失败: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // 加载统计数据
  const loadStatistics = async () => {
    try {
      const stats = await getMessageStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('加载统计数据失败:', error);
    }
  };

  // 初始加载
  useEffect(() => {
    loadMessages();
    loadStatistics();
  }, [pagination.current, pagination.pageSize]);

  // 搜索处理
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    loadMessages();
  };

  // 删除消息
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这条消息吗？')) return;
    
    try {
      await deleteMessage(id);
      showSuccess('删除成功');
      loadMessages();
      loadStatistics();
    } catch (error) {
      console.error('删除消息失败:', error);
      showError('删除失败，请重试');
    }
  };

  // 查看详情
  const handleViewDetail = async (message: Message) => {
    try {
      // 如果消息未读，标记为已读
      if (message.isRead === 0) {
        await markMessageAsRead(message.messageId);
        // 更新本地状态
        setMessages(prevMessages => 
          prevMessages.map(m => 
            m.messageId === message.messageId 
              ? { ...m, isRead: 1 } 
              : m
          )
        );
        // 刷新统计数据
        loadStatistics();
      }
      
      // 显示消息详情
      setSelectedMessage({ ...message, isRead: 1 });
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error('获取消息详情失败:', error);
      showError('获取消息详情失败，请重试');
    }
  };

  // 消息类型配置
  const messageTypeConfig = {
    system: { label: '系统消息', color: 'bg-blue-500', lightColor: 'bg-blue-50', textColor: 'text-blue-700', icon: Bell },
    order: { label: '订单消息', color: 'bg-green-500', lightColor: 'bg-green-50', textColor: 'text-green-700', icon: MessageSquare },
    promotion: { label: '促销消息', color: 'bg-purple-500', lightColor: 'bg-purple-50', textColor: 'text-purple-700', icon: TrendingUp },
    notification: { label: '通知消息', color: 'bg-orange-500', lightColor: 'bg-orange-50', textColor: 'text-orange-700', icon: Bell }
  };

  // 消息状态配置
  const messageStatusConfig = {
    draft: { label: '草稿', color: 'bg-gray-500', icon: Clock },
    sent: { label: '已发送', color: 'bg-green-500', icon: CheckCircle2 },
    read: { label: '已读', color: 'bg-blue-500', icon: Eye }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="p-6 space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              消息管理
            </h1>
            <p className="text-sm text-gray-500 mt-2">发送和管理系统消息通知</p>
          </div>
          <Button 
            onClick={() => setIsFormModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4 mr-2" />
            新建消息
          </Button>
        </div>

        {/* 统计卡片 - 使用 GSAP 动画组件 */}
        {statistics && (
          <div ref={statsContainerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MessageStatCard
              title="总消息"
              value={statistics.totalMessages}
              description="系统消息总数"
              icon={Bell}
              gradient="from-blue-500 to-blue-600"
              shadowColor="shadow-blue-500/20 hover:shadow-blue-500/30"
              index={0}
            />

            <MessageStatCard
              title="已发送"
              value={statistics.sentMessages}
              description="成功发送消息"
              icon={Send}
              gradient="from-green-500 to-green-600"
              shadowColor="shadow-green-500/20 hover:shadow-green-500/30"
              index={1}
            />

            <MessageStatCard
              title="阅读量"
              value={statistics.totalReadCount}
              description="消息阅读次数"
              icon={Eye}
              gradient="from-purple-500 to-purple-600"
              shadowColor="shadow-purple-500/20 hover:shadow-purple-500/30"
              index={2}
              enablePulse={statistics.totalReadCount > 0}
            />

            <MessageStatCard
              title="覆盖用户"
              value={statistics.totalRecipients}
              description="接收消息用户"
              icon={Users}
              gradient="from-orange-500 to-orange-600"
              shadowColor="shadow-orange-500/20 hover:shadow-orange-500/30"
              index={3}
            />
          </div>
        )}

        {/* 搜索和筛选区域 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="搜索消息标题或内容..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <Button 
                onClick={handleSearch} 
                className="h-11 bg-blue-600 hover:bg-blue-700"
              >
                <Search className="w-4 h-4 mr-2" />
                搜索
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-11"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? '收起筛选' : '展开筛选'}
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                loadMessages();
                loadStatistics();
                setRefreshTrigger(prev => prev + 1); // 触发刷新动画
              }}
              className="h-11"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新
            </Button>
          </div>

          {/* 筛选条件 */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">消息类型：</span>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="system">系统消息</SelectItem>
                    <SelectItem value="order">订单消息</SelectItem>
                    <SelectItem value="promotion">促销消息</SelectItem>
                    <SelectItem value="notification">通知消息</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">消息状态：</span>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="draft">草稿</SelectItem>
                    <SelectItem value="sent">已发送</SelectItem>
                    <SelectItem value="read">已读</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedType('all');
                  setSelectedStatus('all');
                  setSearchKeyword('');
                  setPagination(prev => ({ ...prev, current: 1 }));
                  loadMessages();
                }}
                className="ml-auto"
              >
                重置筛选
              </Button>
            </div>
          )}
        </div>

        {/* 消息列表 - 卡片式设计 */}
        <div className="space-y-3">
          {loading ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
              <div className="flex flex-col items-center gap-3">
                <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
                <p className="text-gray-500">加载中...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
              <div className="flex flex-col items-center gap-3">
                <MessageSquare className="w-12 h-12 text-gray-300" />
                <p className="text-gray-500">暂无消息数据</p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => {
              const typeConfig = messageTypeConfig[message.type as keyof typeof messageTypeConfig];
              const statusConfig = messageStatusConfig[message.status as keyof typeof messageStatusConfig];
              const TypeIcon = typeConfig?.icon || Bell;
              const StatusIcon = statusConfig?.icon || Clock;
              // 如果管理员已查看，进度条显示为 100%
              const readPercentage = message.isRead === 1 
                ? 100 
                : (message.totalCount ? ((message.readCount || 0) / message.totalCount * 100) : 0);

              return (
                <MessageListItem
                  key={message.messageId}
                  message={message}
                  index={index}
                  typeConfig={typeConfig}
                  statusConfig={statusConfig}
                  TypeIcon={TypeIcon}
                  StatusIcon={StatusIcon}
                  readPercentage={readPercentage}
                  onViewDetail={handleViewDetail}
                  onDelete={handleDelete}
                />
              );
            })
          )}
        </div>

        {/* 分页 */}
        {pagination.total > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                共 <span className="font-semibold text-gray-900">{pagination.total}</span> 条记录
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.current === 1}
                  onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
                  className="h-9 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一页
                </Button>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">
                    第 <span className="font-semibold text-blue-600">{pagination.current}</span> / {Math.ceil(pagination.total / pagination.pageSize)} 页
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                  onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
                  className="h-9 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一页
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 消息表单模态框 */}
        <MessageFormModal
          open={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSuccess={() => {
            setIsFormModalOpen(false);
            loadMessages();
            loadStatistics();
          }}
        />

        {/* 消息详情模态框 */}
        {selectedMessage && (
          <MessageDetailModal
            open={isDetailModalOpen}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedMessage(null);
            }}
            message={selectedMessage}
          />
        )}
      </div>
    </div>
  );
}
