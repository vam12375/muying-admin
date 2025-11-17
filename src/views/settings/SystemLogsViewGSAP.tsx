"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Trash2,
  Eye,
  Search,
  Filter,
  Calendar,
  User,
  Globe,
  Activity,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { useSystemLogGSAP } from '@/hooks/useSystemLogGSAP';
import { SystemLogDetail } from '@/components/settings/SystemLogDetail';
import {
  getSystemLogs,
  getSystemLogStatistics,
  batchDeleteSystemLogs,
  clearOldLogs,
  getOperationTypes,
  getModules,
} from '@/lib/api/systemLog';
import type { SystemLog, SystemLogQuery, SystemLogStatistics } from '@/types/systemLog';
import { showSuccess, showError, showWarning } from '@/lib/utils/toast';

/**
 * 系统日志视图 - GSAP动画版
 * Source: 重新设计，使用GSAP创建炫酷动画效果
 */

export function SystemLogsViewGSAP() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [statistics, setStatistics] = useState<SystemLogStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // 分页状态
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  
  // 筛选状态
  const [keyword, setKeyword] = useState('');
  const [operationType, setOperationType] = useState('');
  const [module, setModule] = useState('');
  const [operationResult, setOperationResult] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  
  const [operationTypes, setOperationTypes] = useState<any[]>([]);
  const [modules, setModules] = useState<string[]>([]);
  
  const refreshBtnRef = useRef<HTMLButtonElement>(null);
  
  const {
    statsCardsRef,
    tableRef,
    filtersRef,
    animateStatsCards,
    animateTableRows,
    animateFilters,
    animateRefresh,
  } = useSystemLogGSAP();

  useEffect(() => {
    loadLogs();
    loadStatistics();
    loadOperationTypes();
    loadModules();
  }, [page]);

  useEffect(() => {
    if (statistics) {
      animateStatsCards();
    }
  }, [statistics]);

  useEffect(() => {
    if (logs.length > 0) {
      animateTableRows();
    }
  }, [logs]);

  useEffect(() => {
    if (showFilters) {
      animateFilters();
    }
  }, [showFilters]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const queryParams: SystemLogQuery = {
        page,
        pageSize,
        keyword: keyword || undefined,
        operationType: operationType || undefined,
        module: module || undefined,
        operationResult: operationResult || undefined,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
      };
      
      const response = await getSystemLogs(queryParams);
      setLogs(response.list || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error('加载日志失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await getSystemLogStatistics(undefined, 7);
      setStatistics(stats);
    } catch (error) {
      console.error('加载统计信息失败:', error);
    }
  };

  const loadOperationTypes = async () => {
    try {
      const types = await getOperationTypes();
      setOperationTypes(types);
    } catch (error) {
      console.error('加载操作类型失败:', error);
    }
  };

  const loadModules = async () => {
    try {
      const moduleList = await getModules();
      setModules(moduleList);
    } catch (error) {
      console.error('加载模块列表失败:', error);
    }
  };

  const handleRefresh = () => {
    if (refreshBtnRef.current) {
      animateRefresh(refreshBtnRef.current);
    }
    loadLogs();
    loadStatistics();
  };

  const handleSearch = () => {
    setPage(1);
    loadLogs();
  };

  const handleReset = () => {
    setKeyword('');
    setOperationType('');
    setModule('');
    setOperationResult('');
    setStartTime('');
    setEndTime('');
    setPage(1);
    loadLogs();
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

  const getOperationTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      CREATE: 'from-green-500 to-emerald-600',
      READ: 'from-blue-500 to-cyan-600',
      UPDATE: 'from-yellow-500 to-orange-600',
      DELETE: 'from-red-500 to-rose-600',
      EXPORT: 'from-purple-500 to-violet-600',
      IMPORT: 'from-indigo-500 to-blue-600',
      LOGIN: 'from-cyan-500 to-teal-600',
      LOGOUT: 'from-gray-500 to-slate-600',
    };
    return colors[type] || 'from-slate-500 to-gray-600';
  };

  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 p-6 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col">
        {/* 头部 */}
        <div className="mb-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                系统日志
              </h1>
              <p className="text-slate-600">实时监控系统操作记录</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                ref={refreshBtnRef}
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-500/30"
              >
                <RefreshCw className="h-4 w-4" />
                刷新
              </button>
              {selectedIds.length > 0 && (
                <button
                  onClick={handleBatchDelete}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all flex items-center gap-2 shadow-lg shadow-red-500/30"
                >
                  <Trash2 className="h-4 w-4" />
                  删除选中 ({selectedIds.length})
                </button>
              )}
              <button
                onClick={handleClearOldLogs}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2 shadow-lg shadow-orange-500/30"
              >
                <Trash2 className="h-4 w-4" />
                清空历史
              </button>
            </div>
          </div>
        </div>

        {/* 统计卡片 */}
        {statistics && statistics.totalLogs !== undefined && (
          <div ref={statsCardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 flex-shrink-0">
            <div className="stat-card bg-white/80 backdrop-blur-xl rounded-xl p-5 border border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <Activity className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-slate-600 text-sm mb-2">总日志数</p>
              <p className="stat-value text-3xl font-bold text-slate-900">
                {(statistics.totalLogs || 0).toLocaleString()}
              </p>
            </div>

            <div className="stat-card bg-white/80 backdrop-blur-xl rounded-xl p-5 border border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-slate-600 text-sm mb-2">成功率</p>
              <p className="stat-value text-3xl font-bold text-slate-900">
                {(statistics.successRate || 0).toFixed(1)}%
              </p>
              <p className="text-xs text-slate-500 mt-2">
                成功 {statistics.successCount || 0} / 失败 {statistics.failedCount || 0}
              </p>
            </div>

            <div className="stat-card bg-white/80 backdrop-blur-xl rounded-xl p-5 border border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <FileText className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-slate-600 text-sm mb-2">今日日志</p>
              <p className="stat-value text-3xl font-bold text-slate-900">
                {(statistics.todayLogs || 0).toLocaleString()}
              </p>
            </div>

            <div className="stat-card bg-white/80 backdrop-blur-xl rounded-xl p-5 border border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <Activity className="h-5 w-5 text-orange-500" />
              </div>
              <p className="text-slate-600 text-sm mb-2">平均响应时间</p>
              <p className="stat-value text-3xl font-bold text-slate-900">
                {(statistics.avgExecutionTime || 0).toFixed(0)}ms
              </p>
              <p className="text-xs text-slate-500 mt-2">
                最大 {statistics.maxExecutionTime || 0}ms
              </p>
            </div>
          </div>
        )}

        {/* 搜索和筛选 */}
        <div className="bg-white/80 backdrop-blur-xl rounded-xl p-5 border border-slate-200 shadow-lg mb-4 flex-shrink-0">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="搜索操作名称、描述..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all flex items-center gap-2 border border-slate-300"
            >
              <Filter className="h-5 w-5" />
              {showFilters ? '隐藏筛选' : '高级筛选'}
            </button>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/30"
            >
              搜索
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all border border-slate-300"
            >
              重置
            </button>
          </div>

          {/* 高级筛选 */}
          {showFilters && (
            <div ref={filtersRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">操作类型</label>
                <select
                  value={operationType}
                  onChange={(e) => setOperationType(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">全部类型</option>
                  {operationTypes.map((type) => (
                    <option key={type.code} value={type.code}>
                      {type.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">操作模块</label>
                <select
                  value={module}
                  onChange={(e) => setModule(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">全部模块</option>
                  {modules.map((mod) => (
                    <option key={mod} value={mod}>
                      {mod}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">操作结果</label>
                <select
                  value={operationResult}
                  onChange={(e) => setOperationResult(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">全部结果</option>
                  <option value="success">成功</option>
                  <option value="failed">失败</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* 日志表格 */}
        <div ref={tableRef} className="bg-white/80 backdrop-blur-xl rounded-xl border border-slate-200 shadow-lg flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === logs.length && logs.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(logs.map((log) => log.id));
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                      className="rounded border-slate-600 text-blue-600 focus:ring-blue-500 bg-slate-800"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">操作信息</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">操作人</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">类型</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">结果</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">IP地址</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">耗时</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">时间</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {logs.map((log) => (
                  <tr key={log.id} className="log-row hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(log.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds([...selectedIds, log.id]);
                          } else {
                            setSelectedIds(selectedIds.filter((id) => id !== log.id));
                          }
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{log.operation}</p>
                          <p className="text-xs text-slate-500 truncate">
                            {log.module} · {log.requestMethod} {log.requestUrl}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{log.adminName}</p>
                          <p className="text-xs text-slate-500">ID: {log.adminId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getOperationTypeColor(
                          log.operationType
                        )} text-white shadow-lg`}
                      >
                        {log.operationType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {log.operationResult === 'success' ? (
                        <div className="flex items-center gap-1.5 text-green-400">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">成功</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-red-400">
                          <XCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">失败</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Globe className="h-4 w-4" />
                        <span className="text-sm">{log.ipAddress}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">
                          {log.executionTimeMs ? `${log.executionTimeMs}ms` : '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{formatTime(log.createTime)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedLog(log);
                          setShowDetail(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

            {logs.length === 0 && !loading && (
              <div className="py-12 text-center">
                <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600">暂无日志记录</p>
              </div>
            )}

            {loading && (
              <div className="py-12 text-center">
                <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-3" />
                <p className="text-slate-600">加载中...</p>
              </div>
            )}
        </div>

        {/* 分页 */}
        {total > pageSize && (
          <div className="mt-4 flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-xl p-4 border border-slate-200 shadow-lg flex-shrink-0">
            <div className="text-sm text-slate-600">
              共 {total} 条记录，第 {page} / {Math.ceil(total / pageSize)} 页
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-slate-600"
              >
                上一页
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= Math.ceil(total / pageSize)}
                className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-slate-600"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 详情弹窗 */}
      <SystemLogDetail
        log={selectedLog}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
      />
    </div>
  );
}
