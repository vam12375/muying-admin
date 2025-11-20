/**
 * 物流列表Tab组件（全新重构版）
 * Logistics List Tab Component (Redesigned)
 * 
 * 特性：GSAP动画、统计卡片、现代化卡片布局
 * 
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, RefreshCw, Package, Truck, CheckCircle, AlertTriangle } from 'lucide-react';
import { getLogisticsList, updateLogisticsStatus } from '@/lib/api/logistics';
import type { Logistics, LogisticsQueryParams } from '@/types/logistics';
import type { PageResult } from '@/types/common';
import { LogisticsStatCard } from '@/components/logistics/LogisticsStatCard';
import { LogisticsCard } from '@/components/logistics/LogisticsCard';
import { useLogisticsGSAP } from '@/hooks/useLogisticsGSAP';
import { TrackingModal } from './TrackingModal';

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

  // 统计数据
  const [stats, setStats] = useState({
    total: 0,
    shipping: 0,
    delivered: 0,
    exception: 0
  });

  // 详情模态框
  const [selectedLogistics, setSelectedLogistics] = useState<Logistics | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Refs
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { animateLogisticsCards, animateRefresh, animateSearchFocus } = useLogisticsGSAP();

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

      // 计算统计数据
      const shipping = result.records.filter(l => l.status === 'SHIPPING').length;
      const delivered = result.records.filter(l => l.status === 'DELIVERED').length;
      const exception = result.records.filter(l => l.status === 'EXCEPTION').length;
      
      setStats({
        total: result.total,
        shipping,
        delivered,
        exception
      });

      // 触发卡片动画
      setTimeout(() => {
        if (cardsContainerRef.current) {
          const cards = Array.from(cardsContainerRef.current.querySelectorAll('[data-logistics-card]')) as HTMLElement[];
          if (cards.length > 0) {
            animateLogisticsCards(cards);
          }
        }
      }, 100);
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

  // 刷新
  const handleRefresh = () => {
    if (cardsContainerRef.current) {
      const cards = Array.from(cardsContainerRef.current.querySelectorAll('[data-logistics-card]')) as HTMLElement[];
      if (cards.length > 0) {
        animateRefresh(cards);
      }
    }
    setTimeout(loadLogisticsList, 300);
  };



  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <LogisticsStatCard
          title="总物流单"
          value={stats.total}
          icon={Package}
          color="#3b82f6"
          bgColor="#dbeafe"
          delay={0}
        />
        <LogisticsStatCard
          title="运输中"
          value={stats.shipping}
          icon={Truck}
          color="#8b5cf6"
          bgColor="#ede9fe"
          delay={100}
        />
        <LogisticsStatCard
          title="已送达"
          value={stats.delivered}
          icon={CheckCircle}
          color="#10b981"
          bgColor="#d1fae5"
          delay={200}
        />
        <LogisticsStatCard
          title="异常"
          value={stats.exception}
          icon={AlertTriangle}
          color="#ef4444"
          bgColor="#fee2e2"
          delay={300}
        />
      </div>

      {/* 搜索栏 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              关键词搜索
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchParams.keyword || ''}
                onChange={(e) => setSearchParams(prev => ({ ...prev, keyword: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                onFocus={() => searchInputRef.current && animateSearchFocus(searchInputRef.current, true)}
                onBlur={() => searchInputRef.current && animateSearchFocus(searchInputRef.current, false)}
                placeholder="搜索物流单号、收件人..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl
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
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl
                     hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50
                     shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
          >
            <Search className="w-4 h-4" />
            搜索
          </button>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300
                     rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50
                     flex items-center gap-2 font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </button>
        </div>
      </motion.div>

      {/* 物流列表 */}
      <div ref={cardsContainerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            <RefreshCw className="w-12 h-12 mx-auto mb-4 animate-spin opacity-50" />
            <p>加载中...</p>
          </div>
        ) : logisticsList.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>暂无物流信息</p>
          </div>
        ) : (
          logisticsList.map((item) => (
            <div key={item.id} data-logistics-card>
              <LogisticsCard
                logistics={item}
                onViewDetail={(logistics) => {
                  setSelectedLogistics(logistics);
                  setShowDetailModal(true);
                }}
                onUpdate={(logistics) => {
                  console.log('更新状态:', logistics);
                  // TODO: 打开更新模态框
                }}
              />
            </div>
          ))
        )}
      </div>

      {/* 物流详情模态框 */}
      {showDetailModal && selectedLogistics && (
        <TrackingModal
          logistics={selectedLogistics}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedLogistics(null);
          }}
          onRefresh={loadLogisticsList}
        />
      )}

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
