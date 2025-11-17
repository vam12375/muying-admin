/**
 * 积分操作日志视图
 * Points Operation Log View
 * 
 * 功能：查看积分操作日志
 * Source: 对接后端 /admin/points/operation 接口
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { pointsApi } from '@/lib/api/points';
import { showError } from '@/lib/utils/toast';
import {
  Search,
  RefreshCw,
  FileText,
  TrendingUp,
  TrendingDown,
  Filter,
  ChevronDown
} from 'lucide-react';
import type { PointsOperationLog } from '@/types/points';

// 操作类型映射
const OPERATION_TYPE_MAP: Record<string, { label: string; color: string }> = {
  SIGN_IN: { label: '签到', color: 'bg-blue-500' },
  ORDER_REWARD: { label: '订单奖励', color: 'bg-green-500' },
  EXCHANGE_PRODUCT: { label: '兑换商品', color: 'bg-purple-500' },
  ADMIN_ADJUSTMENT: { label: '管理员调整', color: 'bg-orange-500' },
  EVENT_REWARD: { label: '活动奖励', color: 'bg-pink-500' },
  OTHER: { label: '其他', color: 'bg-gray-500' }
};

export function PointsOperationLogView() {
  const [loading, setLoading] = useState(false);
  const [logList, setLogList] = useState<PointsOperationLog[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 20,
    total: 0
  });

  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadLogs();
  }, [pagination.current, typeFilter]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await pointsApi.getPointsOperationLogPage({
        page: pagination.current,
        size: pagination.size,
        operationType: typeFilter === 'all' ? undefined : typeFilter
      });

      if (data) {
        setLogList(data.records);
        setPagination({
          current: data.current,
          size: data.size,
          total: data.total
        });
      }
    } catch (error: any) {
      showError(error.response?.data?.message || '加载操作日志失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 });
    loadLogs();
  };

  return (
    <div className="space-y-6">
      {/* 搜索和筛选栏 */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="搜索用户ID..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 h-12"
                />
              </div>
              <Button onClick={handleSearch} disabled={loading} className="h-12 px-8">
                查询
              </Button>
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="h-12">
                <Filter className="h-4 w-4 mr-2" />
                筛选
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
              <Button variant="outline" onClick={loadLogs} disabled={loading} className="h-12">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="all">全部类型</option>
                    <option value="SIGN_IN">签到</option>
                    <option value="ORDER_REWARD">订单奖励</option>
                    <option value="EXCHANGE_PRODUCT">兑换商品</option>
                    <option value="ADMIN_ADJUSTMENT">管理员调整</option>
                    <option value="EVENT_REWARD">活动奖励</option>
                    <option value="OTHER">其他</option>
                  </select>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* 日志列表 */}
      <AnimatePresence mode="wait">
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-slate-600">加载中...</p>
          </div>
        ) : logList.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">暂无日志</p>
          </div>
        ) : (
          <div className="space-y-2">
            {logList.map((log) => (
              <motion.div key={log.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="border-0 shadow hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-2">
                          {log.pointsChange > 0 ? (
                            <TrendingUp className="h-5 w-5 text-green-600" />
                          ) : (
                            <TrendingDown className="h-5 w-5 text-red-600" />
                          )}
                          <span className={`font-bold text-lg ${log.pointsChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {log.pointsChange > 0 ? '+' : ''}{log.pointsChange}
                          </span>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={`${OPERATION_TYPE_MAP[log.operationType]?.color || 'bg-gray-500'} text-white`}>
                              {OPERATION_TYPE_MAP[log.operationType]?.label || log.operationType}
                            </Badge>
                            <span className="text-sm text-slate-600">用户ID: {log.userId}</span>
                            {log.username && <span className="text-sm font-semibold">{log.username}</span>}
                          </div>
                          {log.description && (
                            <p className="text-sm text-slate-600">{log.description}</p>
                          )}
                        </div>

                        <div className="text-right">
                          <div className="text-sm text-slate-600">当前余额</div>
                          <div className="font-bold text-purple-600">{log.currentBalance}</div>
                        </div>

                        <div className="text-sm text-slate-500">
                          {new Date(log.createTime).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* 分页 */}
      {logList.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                共 <span className="font-semibold text-purple-600">{pagination.total}</span> 条记录
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
    </div>
  );
}
