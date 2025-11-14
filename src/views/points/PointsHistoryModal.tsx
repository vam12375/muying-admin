/**
 * 积分历史记录模态框组件
 * Points History Modal Component
 * 
 * 功能：查看用户的积分交易历史记录
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
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

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  if (typeof window !== 'undefined') {
    console.log(`[${type.toUpperCase()}]`, message);
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
      const data = await getPointsTransactionPage({
        userId: userPoints.userId,
        page: pagination.current,
        size: pagination.size
      });

      if (data) {
        setTransactions(data.records);
        setPagination({
          current: data.current,
          size: data.size,
          total: data.total
        });
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || '加载交易记录失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type: number) => {
    const types: Record<number, string> = {
      1: '获得',
      2: '消费',
      3: '过期',
      4: '管理员调整'
    };
    return types[type] || '未知';
  };

  const getTypeVariant = (type: number): 'default' | 'secondary' | 'destructive' | 'outline' => {
    const variants: Record<number, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      1: 'default',
      2: 'secondary',
      3: 'destructive',
      4: 'outline'
    };
    return variants[type] || 'default';
  };

  const getStatusLabel = (status: number) => {
    const statuses: Record<number, string> = {
      0: '失败',
      1: '成功',
      2: '处理中'
    };
    return statuses[status] || '未知';
  };

  const getStatusVariant = (status: number): 'default' | 'secondary' | 'destructive' => {
    const variants: Record<number, 'default' | 'secondary' | 'destructive'> = {
      0: 'destructive',
      1: 'default',
      2: 'secondary'
    };
    return variants[status] || 'default';
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
            <div className="text-2xl font-bold">{userPoints.currentPoints}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">累计获得</div>
            <div className="text-2xl font-bold text-green-600">{userPoints.totalEarned}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">累计消费</div>
            <div className="text-2xl font-bold text-orange-600">{userPoints.totalSpent}</div>
          </div>
        </div>

        {/* 交易记录表格 */}
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>交易流水号</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>积分变动</TableHead>
                <TableHead>交易前</TableHead>
                <TableHead>交易后</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>来源</TableHead>
                <TableHead>说明</TableHead>
                <TableHead>时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    加载中...
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    暂无交易记录
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.transactionId}>
                    <TableCell className="font-mono text-xs">{transaction.transactionNo}</TableCell>
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
                    <TableCell>{transaction.beforePoints}</TableCell>
                    <TableCell>{transaction.afterPoints}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(transaction.status)}>
                        {getStatusLabel(transaction.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.source || '-'}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={transaction.description}>
                      {transaction.description || '-'}
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
