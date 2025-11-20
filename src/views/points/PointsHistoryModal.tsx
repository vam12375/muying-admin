/**
 * 积分历史记录模态框组件
 * Points History Modal Component
 * 
 * 功能：查看用户的积分交易历史记录
 * 
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getPointsTransactionPage } from '@/lib/api/points';
import { RefreshCw, TrendingUp, TrendingDown, X } from 'lucide-react';
import type { UserPoints, PointsTransaction } from '@/types/points';

interface PointsHistoryModalProps {
  open: boolean;
  onClose: () => void;
  userPoints: UserPoints | null;
}

import { showSuccess, showError } from '@/lib/utils/toast';

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  if (type === 'success') {
    showSuccess(message);
  } else {
    showError(message);
  }
};

export function PointsHistoryModal({ open, onClose, userPoints }: PointsHistoryModalProps) {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
    total: 0
  });

  useEffect(() => {
    if (open && userPoints) {
      loadTransactions();
    }
  }, [open, userPoints, pagination.current]);

  const loadTransactions = async () => {
    if (!userPoints) return;

    setLoading(true);
    try {
      const response = await getPointsTransactionPage({
        userId: userPoints.userId,
        page: pagination.current,
        size: pagination.size
      });

      console.log('交易记录API响应:', response);

      // 处理响应数据
      if (response && response.success !== false) {
        // 如果有 data 属性，使用 data
        const data = response.data || response;
        
        console.log('交易记录数据:', data);
        
        if (data.records) {
          setTransactions(data.records);
          setPagination({
            current: data.current || pagination.current,
            size: data.size || pagination.size,
            total: data.total || 0
          });
        } else {
          // 如果没有 records，可能直接返回了数组
          setTransactions([]);
          setPagination({
            current: 1,
            size: pagination.size,
            total: 0
          });
        }
      } else {
        showToast('加载交易记录失败', 'error');
      }
    } catch (error: any) {
      console.error('加载交易记录失败:', error);
      showToast(error.message || '加载交易记录失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 获取类型标签（支持字符串和数字类型）
  const getTypeLabel = (type: string | number) => {
    if (typeof type === 'string') {
      const stringTypes: Record<string, string> = {
        'earn': '获得',
        'spend': '消费',
        'decrease': '减少',
        'expire': '过期',
        'admin': '管理员调整'
      };
      return stringTypes[type.toLowerCase()] || type;
    }
    
    const numberTypes: Record<number, string> = {
      1: '获得',
      2: '消费',
      3: '过期',
      4: '管理员调整'
    };
    return numberTypes[type] || '未知';
  };

  const getTypeVariant = (type: string | number): 'default' | 'secondary' | 'destructive' | 'outline' => {
    const typeStr = typeof type === 'string' ? type.toLowerCase() : String(type);
    
    if (typeStr === 'earn' || typeStr === '1') return 'default';
    if (typeStr === 'spend' || typeStr === 'decrease' || typeStr === '2') return 'secondary';
    if (typeStr === 'expire' || typeStr === '3') return 'destructive';
    if (typeStr === 'admin' || typeStr === '4') return 'outline';
    
    return 'default';
  };

  const getStatusLabel = (status?: number) => {
    if (status === undefined) return '成功';
    
    const statuses: Record<number, string> = {
      0: '失败',
      1: '成功',
      2: '处理中'
    };
    return statuses[status] || '未知';
  };

  const getStatusVariant = (status?: number): 'default' | 'secondary' | 'destructive' => {
    if (status === undefined) return 'default';
    
    const variants: Record<number, 'default' | 'secondary' | 'destructive'> = {
      0: 'destructive',
      1: 'default',
      2: 'secondary'
    };
    return variants[status] || 'default';
  };

  // 获取积分来源的中文显示
  const getSourceLabel = (source?: string) => {
    if (!source) return '-';
    
    const sourceMap: Record<string, string> = {
      // 基础来源
      'signin': '签到',
      'sign_in': '签到',
      'order': '订单',
      'order_completed': '订单完成',
      'order_complete': '订单完成',
      'review': '评论',
      'comment': '评论',
      'comment_reward': '评论奖励',
      'register': '注册',
      'exchange': '积分兑换',
      'exchange_cancel': '取消兑换',
      'admin': '管理员操作',
      'admin_adjustment': '管理员调整',
      'activity': '活动',
      'event': '活动',
      'event_reward': '活动奖励',
      'refund': '退款',
      'system': '系统',
      // 其他可能的来源
      'purchase': '购买',
      'invite': '邀请',
      'share': '分享',
      'checkin': '签到',
      'task': '任务',
      'gift': '赠送'
    };
    
    return sourceMap[source.toLowerCase()] || source;
  };

  if (!open || !userPoints) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">积分历史记录</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 账户摘要 */}
        <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50">
          <div>
            <div className="text-sm text-gray-600">当前积分</div>
            <div className="text-2xl font-bold">{userPoints.currentPoints || userPoints.points || 0}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">累计获得</div>
            <div className="text-2xl font-bold text-green-600">{userPoints.totalEarned || 0}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">累计消费</div>
            <div className="text-2xl font-bold text-orange-600">{userPoints.totalSpent || userPoints.totalUsed || 0}</div>
          </div>
        </div>

        {/* 交易记录表格 */}
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>交易ID</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>积分变动</TableHead>
                <TableHead>来源</TableHead>
                <TableHead>说明</TableHead>
                <TableHead>关联ID</TableHead>
                <TableHead>时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    加载中...
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    暂无交易记录
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id || transaction.transactionId}>
                    <TableCell className="font-mono text-sm">#{transaction.id}</TableCell>
                    <TableCell>
                      <Badge variant={getTypeVariant(transaction.type)}>
                        {getTypeLabel(transaction.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {transaction.points > 0 ? (
                          <>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className="text-green-600 font-medium">+{transaction.points}</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="h-4 w-4 text-red-600" />
                            <span className="text-red-600 font-medium">{transaction.points}</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{getSourceLabel(transaction.source)}</span>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate" title={transaction.description}>
                      {transaction.description || '-'}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {transaction.referenceId || '-'}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {new Date(transaction.createTime).toLocaleString('zh-CN')}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* 分页 */}
        <div className="flex items-center justify-between p-6 border-t">
          <div className="text-sm text-gray-500">
            共 {pagination.total} 条记录
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
            <span className="text-sm">
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
            <Button
              variant="outline"
              size="sm"
              onClick={loadTransactions}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
