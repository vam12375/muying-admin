'use client';

/**
 * 系统监控视图
 * System Monitor View
 * 
 * 功能：
 * - 实时监控系统健康状态
 * - 服务器性能监控（CPU、内存、磁盘）
 * - 数据库监控
 * - Redis监控
 * - API调用统计
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressRing } from '@/components/monitor/ProgressRing';
import { 
  RefreshCw, 
  Server, 
  Database, 
  Activity,
  HardDrive,
  Cpu,
  MemoryStick,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { getSystemMetrics } from '@/lib/api/monitor';
import type { SystemMetrics } from '@/types/monitor';

export function SystemMonitorView() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // 加载监控数据
  const loadMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSystemMetrics();
      setMetrics(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('加载监控数据失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  // 自动刷新
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadMetrics();
    }, 30000); // 30秒刷新一次

    return () => clearInterval(interval);
  }, [autoRefresh, loadMetrics]);

  // 格式化字节数
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'UP':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'DOWN':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'WARNING':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  // 获取状态徽章
  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      UP: 'default',
      DOWN: 'destructive',
      WARNING: 'secondary',
    };
    
    const labels: Record<string, string> = {
      UP: '正常',
      DOWN: '异常',
      WARNING: '警告',
    };

    return (
      <Badge variant={variants[status] || 'outline'}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">加载监控数据中...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-gray-600">加载监控数据失败</p>
          <Button onClick={loadMetrics} className="mt-4">
            重试
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">系统监控</h2>
          <p className="text-sm text-gray-600 mt-1">
            最后更新: {lastUpdate.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Clock className="w-4 h-4 mr-2" />
            {autoRefresh ? '自动刷新' : '已暂停'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={loadMetrics}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
        </div>
      </div>

      {/* 系统健康状态总览 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            系统健康状态
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(metrics.health.components).map(([key, component]) => (
              <div
                key={key}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium capitalize">
                    {key === 'database' ? '数据库' : 
                     key === 'redis' ? 'Redis' :
                     key === 'diskSpace' ? '磁盘空间' :
                     key === 'memory' ? '内存' : key}
                  </span>
                  {getStatusIcon(component.status)}
                </div>
                <p className="text-sm text-gray-600 mb-2">{component.message}</p>
                {getStatusBadge(component.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 服务器性能 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            服务器性能
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* CPU使用率 */}
            <div className="flex flex-col items-center">
              <ProgressRing
                progress={metrics.serverPerformance.cpuUsage}
                label="CPU使用率"
              />
              <div className="mt-4 text-center text-sm text-gray-600">
                <p>核心数: {metrics.serverPerformance.cpuCores}</p>
                <p>负载: {metrics.serverPerformance.systemLoadAverage.toFixed(2)}</p>
              </div>
            </div>

            {/* 内存使用率 */}
            <div className="flex flex-col items-center">
              <ProgressRing
                progress={metrics.serverPerformance.memoryUsage}
                label="内存使用率"
              />
              <div className="mt-4 text-center text-sm text-gray-600">
                <p>已用: {formatBytes(metrics.serverPerformance.usedMemory)}</p>
                <p>总计: {formatBytes(metrics.serverPerformance.totalMemory)}</p>
              </div>
            </div>

            {/* 磁盘使用率 */}
            <div className="flex flex-col items-center">
              <ProgressRing
                progress={metrics.serverPerformance.diskUsage}
                label="磁盘使用率"
              />
              <div className="mt-4 text-center text-sm text-gray-600">
                <p>已用: {formatBytes(metrics.serverPerformance.usedDiskSpace)}</p>
                <p>总计: {formatBytes(metrics.serverPerformance.totalDiskSpace)}</p>
              </div>
            </div>

            {/* JVM内存使用率 */}
            <div className="flex flex-col items-center">
              <ProgressRing
                progress={metrics.serverPerformance.jvmMemoryUsage}
                label="JVM内存"
              />
              <div className="mt-4 text-center text-sm text-gray-600">
                <p>已用: {formatBytes(metrics.serverPerformance.jvmUsedMemory)}</p>
                <p>总计: {formatBytes(metrics.serverPerformance.jvmTotalMemory)}</p>
              </div>
            </div>
          </div>

          {/* 运行时间和线程信息 */}
          <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Clock className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">运行时间</p>
                <p className="font-semibold">{metrics.serverPerformance.uptimeFormatted}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Activity className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">当前线程</p>
                <p className="font-semibold">{metrics.serverPerformance.threadCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <TrendingUp className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">峰值线程</p>
                <p className="font-semibold">{metrics.serverPerformance.peakThreadCount}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 数据库和Redis监控 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 数据库监控 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              数据库监控
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 连接池使用率 */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">连接池使用率</span>
                  <span className="text-sm text-gray-600">
                    {metrics.databaseMetrics.activeConnections} / {metrics.databaseMetrics.maxConnections}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${metrics.databaseMetrics.connectionUsage}%` }}
                  />
                </div>
              </div>

              {/* 统计信息 */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600">总查询数</p>
                  <p className="text-xl font-bold">{metrics.databaseMetrics.totalQueries.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600">慢查询</p>
                  <p className="text-xl font-bold text-orange-500">{metrics.databaseMetrics.slowQueries}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600">平均查询时间</p>
                  <p className="text-xl font-bold">{metrics.databaseMetrics.avgQueryTime.toFixed(2)}ms</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600">数据库大小</p>
                  <p className="text-xl font-bold">{formatBytes(metrics.databaseMetrics.databaseSize)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Redis监控 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5" />
              Redis监控
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 缓存命中率 */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">缓存命中率</span>
                  <span className="text-sm text-gray-600">
                    {metrics.redisMetrics.hitRate.toFixed(2)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${metrics.redisMetrics.hitRate}%` }}
                  />
                </div>
              </div>

              {/* 统计信息 */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600">已用内存</p>
                  <p className="text-xl font-bold">{metrics.redisMetrics.usedMemoryHuman}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600">连接客户端</p>
                  <p className="text-xl font-bold">{metrics.redisMetrics.connectedClients}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600">总键数</p>
                  <p className="text-xl font-bold">{metrics.redisMetrics.totalKeys.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600">每秒操作数</p>
                  <p className="text-xl font-bold">{metrics.redisMetrics.opsPerSec.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API统计 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            API调用统计
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">总请求数</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                {metrics.apiStatistics.totalRequests.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">成功请求</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-300">
                {metrics.apiStatistics.successRequests.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">失败请求</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-300">
                {metrics.apiStatistics.failedRequests.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">平均响应时间</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                {metrics.apiStatistics.avgResponseTime.toFixed(2)}ms
              </p>
            </div>
          </div>

          {/* 最慢的API */}
          {metrics.apiStatistics.slowestApis && metrics.apiStatistics.slowestApis.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold mb-3">最慢的API</h4>
              <div className="space-y-2">
                {metrics.apiStatistics.slowestApis.slice(0, 5).map((api, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{api.endpoint}</p>
                      <p className="text-xs text-gray-600">{api.method}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-orange-500">
                        {api.avgResponseTime.toFixed(2)}ms
                      </p>
                      <p className="text-xs text-gray-600">
                        {api.requestCount} 次请求
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
