"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  CheckCircle,
  Clock,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { SystemLogStatCard } from '@/components/settings/SystemLogStatCard';
import { SystemLogFilters } from '@/components/settings/SystemLogFilters';
import { SystemLogTable } from '@/components/settings/SystemLogTable';
import { SystemLogDetail } from '@/components/settings/SystemLogDetail';
import {
  getSystemLogs,
  getSystemLogStatistics,
  batchDeleteSystemLogs,
  clearOldLogs,
} from '@/lib/api/systemLog';
import type { SystemLog, SystemLogQuery, SystemLogStatistics } from '@/types/systemLog';
import { showSuccess, showError, showWarning } from '@/lib/utils/toast';

/**
 * 系统日志视图
 * Source: 自定义实现，遵循KISS/YAGNI/SOLID原则
 */

export function SystemLogsView() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [statistics, setStatistics] = useState<SystemLogStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  // 分页状态
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  
  // 查询条件
  const [queryParams, setQueryParams] = useState<SystemLogQuery>({
    page: 1,
    pageSize: 10,
  });

  useEffect(() => {
    loadLogs();
    loadStatistics();
  }, [queryParams]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const response = await getSystemLogs(queryParams);
      console.log('日志响应数据:', response); // 调试用
      console.log('日志列表:', response.list); // 调试用
      setLogs(response.list);
      setTotal(response.total);
      setPage(response.page);
    } catch (error) {
      console.error('加载日志失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await getSystemLogStatistics(undefined, 7);
      console.log('统计数据:', stats); // 调试用
      setStatistics(stats);
    } catch (error) {
      console.error('加载统计信息失败:', error);
    }
  };

  const handleFilter = (filters: SystemLogQuery) => {
    setQueryParams({
      ...filters,
      page: 1,
      pageSize,
    });
  };

  const handleReset = () => {
    setQueryParams({
      page: 1,
      pageSize,
    });
  };

  const handleRefresh = () => {
    loadLogs();
    loadStatistics();
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) {
      showWarning('请选择要删除的日志');
      return;
    }

    if (!confirm(`确定要删除选中的 ${selectedIds.length} 条日志吗？`)) {
      return;
    }

    try {
      await batchDeleteSystemLogs(selectedIds);
      showSuccess('删除成功');
      setSelectedIds([]);
      loadLogs();
      loadStatistics();
    } catch (error) {
      console.error('删除失败:', error);
      showError('删除失败');
    }
  };

  const handleClearOldLogs = async () => {
    const days = prompt('请输入要清空多少天之前的日志（例如：30）');
    if (!days) return;

    const daysNum = parseInt(days);
    if (isNaN(daysNum) || daysNum < 1) {
      showWarning('请输入有效的天数');
      return;
    }

    if (!confirm(`确定要清空 ${daysNum} 天之前的所有日志吗？此操作不可恢复！`)) {
      return;
    }

    try {
      await clearOldLogs(daysNum);
      showSuccess('清空成功');
      loadLogs();
      loadStatistics();
    } catch (error) {
      console.error('清空失败:', error);
      showError('清空失败');
    }
  };

  const handleViewDetail = (log: SystemLog) => {
    setSelectedLog(log);
    setShowDetail(true);
  };

  const handlePageChange = (newPage: number) => {
    setQueryParams({
      ...queryParams,
      page: newPage,
    });
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-6 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* 头部 */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 dark:text-slate-100">
              系统日志
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              查看和管理系统操作日志
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 disabled:opacity-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 dark:text-slate-100"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              刷新
            </button>
            {selectedIds.length > 0 && (
              <button
                onClick={handleBatchDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                删除选中 ({selectedIds.length})
              </button>
            )}
            <button
              onClick={handleClearOldLogs}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              清空历史
            </button>
          </div>
        </div>
      </div>



      {/* 统计卡片 */}
      {statistics && statistics.totalLogs !== undefined && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <SystemLogStatCard
            label="总日志数"
            value={(statistics.totalLogs || 0).toLocaleString()}
            icon={FileText}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            index={0}
          />
          <SystemLogStatCard
            label="成功率"
            value={`${(statistics.successRate || 0).toFixed(1)}%`}
            icon={CheckCircle}
            trend={`成功 ${statistics.successCount || 0} / 失败 ${statistics.failedCount || 0}`}
            color="bg-gradient-to-br from-green-500 to-green-600"
            index={1}
          />
          <SystemLogStatCard
            label="今日日志"
            value={(statistics.todayLogs || 0).toLocaleString()}
            icon={FileText}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            index={2}
          />
          <SystemLogStatCard
            label="平均响应时间"
            value={`${(statistics.avgExecutionTime || 0).toFixed(0)}ms`}
            icon={Clock}
            trend={`最大 ${statistics.maxExecutionTime || 0}ms`}
            color="bg-gradient-to-br from-orange-500 to-orange-600"
            index={3}
          />
        </div>
      )}

      {/* 筛选器 */}
      <SystemLogFilters onFilter={handleFilter} onReset={handleReset} />

      {/* 加载状态 */}
      {loading && (!logs || logs.length === 0) && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-400">加载中...</p>
          </div>
        </div>
      )}

      {/* 日志表格 */}
      {!loading || (logs && logs.length > 0) ? (
        <SystemLogTable
          logs={logs}
          onViewDetail={handleViewDetail}
          selectedIds={selectedIds}
          onSelectChange={setSelectedIds}
        />
      ) : null}

      {/* 分页 */}
      {total > pageSize && (
        <div className="mt-6 flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            共 {total} 条记录，第 {page} / {Math.ceil(total / pageSize)} 页
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-600 dark:hover:bg-slate-700 dark:text-slate-100"
            >
              上一页
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= Math.ceil(total / pageSize)}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-600 dark:hover:bg-slate-700 dark:text-slate-100"
            >
              下一页
            </button>
          </div>
        </div>
      )}

      {/* 详情弹窗 */}
      <SystemLogDetail
        log={selectedLog}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
      />
    </div>
  );
}
