/**
 * 物流列表Tab组件
 * Logistics List Tab Component
 * 
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, RefreshCw, Eye, Edit, Package, MapPin, Clock, Building } from 'lucide-react';
import { getLogisticsList, updateLogisticsStatus } from '@/lib/api/logistics';
import type { Logistics, LogisticsQueryParams } from '@/types/logistics';
import type { PageResult } from '@/types/common';
import { formatDate } from '@/lib/utils';

const LogisticsListTab: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [logisticsList, setLogisticsList] = useState<Logistics[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
    total: 0
  });

  // 搜索参数
  const [searchParams, setSearchParams] = useState<LogisticsQueryParams>({
    keyword: '',
    status: undefined
  });

  // 加载物流列表
  const loadLogisticsList = async () => {
    setLoading(true);
    try {
      const params: LogisticsQueryParams = {
        page: pagination.current,
        pageSize: pagination.size,
        ...searchParams
      };
      
      const result: PageResult<Logistics> = await getLogisticsList(params);
      setLogisticsList(result.records);
      setPagination(prev => ({
        ...prev,
        total: result.total
      }));
    } catch (error) {
      console.error('加载物流列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadLogisticsList();
  }, [pagination.current, pagination.size]);

  // 搜索
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    loadLogisticsList();
  };

  // 重置
  const handleReset = () => {
    setSearchParams({ keyword: '', status: undefined });
    setPagination(prev => ({ ...prev, current: 1 }));
    setTimeout(loadLogisticsList, 0);
  };

  // 获取状态标签样式
  const getStatusStyle = (status: string) => {
    const styles: Record<string, { bg: string; text: string; label: string }> = {
      CREATED: { bg: 'bg-orange-100', text: 'text-orange-700', label: '已创建' },
      SHIPPING: { bg: 'bg-blue-100', text: 'text-blue-700', label: '运输中' },
      DELIVERED: { bg: 'bg-green-100', text: 'text-green-700', label: '已送达' },
      EXCEPTION: { bg: 'bg-red-100', text: 'text-red-700', label: '异常' }
    };
    return styles[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
  };

  return (
    <div className="space-y-6">
      {/* 搜索栏 */}
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            关键词搜索
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchParams.keyword || ''}
              onChange={(e) => setSearchParams(prev => ({ ...prev, keyword: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="搜索物流单号、收件人..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            物流状态
          </label>
          <select
            value={searchParams.status || ''}
            onChange={(e) => setSearchParams(prev => ({ ...prev, status: e.target.value as any }))}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">全部状态</option>
            <option value="CREATED">已创建</option>
            <option value="SHIPPING">运输中</option>
            <option value="DELIVERED">已送达</option>
            <option value="EXCEPTION">异常</option>
          </select>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg
                   hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50
                   flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          搜索
        </button>

        <button
          onClick={handleReset}
          disabled={loading}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300
                   rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50
                   flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          重置
        </button>
      </div>

      {/* 物流列表 */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-gray-500">加载中...</div>
        ) : logisticsList.length === 0 ? (
          <div className="text-center py-12 text-gray-500">暂无物流信息</div>
        ) : (
          logisticsList.map((item, index) => {
            const statusStyle = getStatusStyle(item.status);
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700
                         hover:shadow-lg transition-all p-6"
              >
                <div className="flex items-start justify-between">
                  {/* 左侧信息 */}
                  <div className="flex-1 space-y-3">
                    {/* 物流单号和状态 */}
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-blue-600" />
                      <span className="font-mono font-semibold text-lg">{item.trackingNo}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                        {statusStyle.label}
                      </span>
                    </div>

                    {/* 物流公司 */}
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Building className="w-4 h-4" />
                      <span>{item.company?.name || '未知物流公司'}</span>
                    </div>

                    {/* 收件信息 */}
                    <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {item.receiverName} {item.receiverPhone}
                        </div>
                        <div className="text-sm">{item.receiverAddress}</div>
                      </div>
                    </div>

                    {/* 时间信息 */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>创建: {formatDate(item.createTime)}</span>
                      </div>
                      {item.updateTime && (
                        <div className="flex items-center gap-1">
                          <span>更新: {formatDate(item.updateTime)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 右侧操作 */}
                  <div className="flex flex-col gap-2">
                    <button
                      className="px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20
                               rounded-lg transition-all flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      详情
                    </button>
                    <button
                      className="px-4 py-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20
                               rounded-lg transition-all flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      更新
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* 分页 */}
      {pagination.total > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            共 {pagination.total} 条记录
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, current: Math.max(1, prev.current - 1) }))}
              disabled={pagination.current === 1}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
              {pagination.current} / {Math.ceil(pagination.total / pagination.size)}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
              disabled={pagination.current >= Math.ceil(pagination.total / pagination.size)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogisticsListTab;
