/**
 * 积分兑换管理视图
 * Points Exchange Management View
 * 
 * 功能：积分兑换记录管理、发货处理
 * Source: 对接后端 /admin/points/exchange 接口
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
import { showSuccess, showError } from '@/lib/utils/toast';
import {
  Search,
  RefreshCw,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  ChevronDown,
  Eye
} from 'lucide-react';
import type { PointsExchange } from '@/types/points';
import { ExchangeDetailModal } from './ExchangeDetailModal';
import { ShipExchangeModal } from './ShipExchangeModal';

// 状态映射
const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: '待处理', color: 'bg-yellow-500', icon: Clock },
  processing: { label: '处理中', color: 'bg-blue-500', icon: Package },
  shipped: { label: '已发货', color: 'bg-purple-500', icon: Truck },
  completed: { label: '已完成', color: 'bg-green-500', icon: CheckCircle },
  cancelled: { label: '已取消', color: 'bg-red-500', icon: XCircle }
};

export function PointsExchangeView() {
  const [loading, setLoading] = useState(false);
  const [exchangeList, setExchangeList] = useState<PointsExchange[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
    total: 0
  });

  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [shipModalOpen, setShipModalOpen] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState<PointsExchange | null>(null);

  useEffect(() => {
    loadExchanges();
  }, [pagination.current, statusFilter]);

  const loadExchanges = async () => {
    setLoading(true);
    try {
      const data = await pointsApi.getPointsExchangePage({
        page: pagination.current,
        size: pagination.size,
        orderNo: keyword.trim() || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter
      });

      if (data) {
        setExchangeList(data.records);
        setPagination({
          current: data.current,
          size: data.size,
          total: data.total
        });
      }
    } catch (error: any) {
      showError(error.response?.data?.message || '加载兑换记录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 });
    loadExchanges();
  };

  const handleViewDetail = (exchange: PointsExchange) => {
    setSelectedExchange(exchange);
    setDetailModalOpen(true);
  };

  const handleShip = (exchange: PointsExchange) => {
    setSelectedExchange(exchange);
    setShipModalOpen(true);
  };

  const handleUpdateStatus = async (exchange: PointsExchange, newStatus: string) => {
    try {
      await pointsApi.updateExchangeStatus(exchange.id, newStatus);
      showSuccess('状态更新成功');
      loadExchanges();
    } catch (error: any) {
      showError(error.response?.data?.message || '状态更新失败');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="搜索兑换单号..."
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
              <Button variant="outline" onClick={loadExchanges} disabled={loading} className="h-12">
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
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="all">全部状态</option>
                    <option value="pending">待处理</option>
                    <option value="processing">处理中</option>
                    <option value="shipped">已发货</option>
                    <option value="completed">已完成</option>
                    <option value="cancelled">已取消</option>
                  </select>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-slate-600">加载中...</p>
          </div>
        ) : exchangeList.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">暂无兑换记录</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {exchangeList.map((exchange) => {
              const StatusIcon = STATUS_MAP[exchange.status]?.icon || Clock;
              return (
                <motion.div key={exchange.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="border-0 shadow-lg hover:shadow-2xl transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-lg">{exchange.orderNo}</span>
                            <Badge className={`${STATUS_MAP[exchange.status]?.color || 'bg-gray-500'} text-white`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {STATUS_MAP[exchange.status]?.label || exchange.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-slate-600">用户：</span>
                              <span className="font-semibold">{exchange.username}</span>
                            </div>
                            <div>
                              <span className="text-slate-600">商品：</span>
                              <span className="font-semibold">{exchange.productName}</span>
                            </div>
                            <div>
                              <span className="text-slate-600">数量：</span>
                              <span className="font-semibold">{exchange.quantity}</span>
                            </div>
                            <div>
                              <span className="text-slate-600">积分：</span>
                              <span className="font-semibold text-purple-600">{exchange.points}</span>
                            </div>
                          </div>

                          {exchange.trackingNumber && (
                            <div className="text-sm">
                              <span className="text-slate-600">物流：</span>
                              <span className="font-semibold">{exchange.logisticsCompany} - {exchange.trackingNumber}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 ml-6">
                          <Button size="sm" variant="outline" onClick={() => handleViewDetail(exchange)}>
                            <Eye className="h-4 w-4 mr-2" />
                            详情
                          </Button>
                          {exchange.status === 'pending' && (
                            <Button size="sm" onClick={() => handleUpdateStatus(exchange, 'processing')}>
                              处理
                            </Button>
                          )}
                          {exchange.status === 'processing' && (
                            <Button size="sm" onClick={() => handleShip(exchange)}>
                              <Truck className="h-4 w-4 mr-2" />
                              发货
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {exchangeList.length > 0 && (
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

      <ExchangeDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        exchange={selectedExchange}
      />

      <ShipExchangeModal
        open={shipModalOpen}
        onClose={() => setShipModalOpen(false)}
        exchange={selectedExchange}
        onSuccess={loadExchanges}
      />
    </div>
  );
}
