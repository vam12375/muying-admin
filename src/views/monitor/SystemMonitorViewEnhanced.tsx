'use client';

/**
 * 系统监控增强视图
 * Enhanced System Monitor View
 * 
 * 特性：
 * - 玻璃态设计
 * - 丰富的动画效果
 * - 实时数据可视化
 * - 响应式布局
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Zap,
  Users,
  BarChart3,
  PieChart,
  Globe,
  Wifi,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/monitor/GlassCard';
import { MetricCard } from '@/components/monitor/MetricCard';
import { ProgressRing } from '@/components/monitor/ProgressRing';
import { AnimatedNumber } from '@/components/monitor/AnimatedNumber';
import { getSystemMetrics } from '@/lib/api/monitor';
import type { SystemMetrics } from '@/types/monitor';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export function SystemMonitorViewEnhanced() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [cpuHistory, setCpuHistory] = useState<number[]>([]);
  const [memoryHistory, setMemoryHistory] = useState<number[]>([]);
  const [requestHistory, setRequestHistory] = useState<number[]>([]);

  // 加载监控数据
  const loadMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSystemMetrics();
      setMetrics(data);
      setLastUpdate(new Date());

      // 更新历史数据（保留最近20个数据点）
      setCpuHistory(prev => [...prev.slice(-19), data.serverPerformance.cpuUsage]);
      setMemoryHistory(prev => [...prev.slice(-19), data.serverPerformance.memoryUsage]);
      setRequestHistory(prev => [...prev.slice(-19), data.apiStatistics.totalRequests]);
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

  // 自动刷新（10秒间隔）
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(loadMetrics, 10000); // 10秒刷新一次
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

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UP': return 'text-green-500';
      case 'DOWN': return 'text-red-500';
      case 'WARNING': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'UP': return CheckCircle;
      case 'DOWN': return XCircle;
      case 'WARNING': return AlertCircle;
      default: return AlertCircle;
    }
  };

  if (loading && !metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 mx-auto mb-4"
          >
            <Activity className="w-16 h-16 text-blue-500" />
          </motion.div>
          <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
            加载监控数据中...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard className="p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">加载监控数据失败</p>
          <Button onClick={loadMetrics}>重试</Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* 顶部操作栏 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              系统监控中心
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              最后更新: {lastUpdate.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50"
              >
                <Zap className={`w-4 h-4 mr-2 ${autoRefresh ? 'text-green-500' : 'text-gray-400'}`} />
                {autoRefresh ? '自动刷新' : '已暂停'}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={loadMetrics}
                disabled={loading}
                className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                刷新
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* 系统健康状态总览 */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">系统健康状态</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">实时监控各组件运行状态</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(metrics.health.components).map(([key, component], index) => {
              const StatusIcon = getStatusIcon(component.status);
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 border border-gray-200 dark:border-slate-600 shadow-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-900 dark:text-white capitalize">
                      {key === 'database' ? '数据库' : 
                       key === 'redis' ? 'Redis' :
                       key === 'diskSpace' ? '磁盘空间' :
                       key === 'memory' ? '内存' : key}
                    </span>
                    <StatusIcon className={`w-5 h-5 ${getStatusColor(component.status)}`} />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {component.message}
                  </p>
                  <Badge
                    variant={component.status === 'UP' ? 'default' : component.status === 'DOWN' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {component.status === 'UP' ? '正常' : component.status === 'DOWN' ? '异常' : '警告'}
                  </Badge>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>

        {/* 关键指标卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="CPU使用率"
            value={metrics.serverPerformance.cpuUsage}
            unit="%"
            icon={Cpu}
            trend={cpuHistory}
            color="blue"
            delay={0}
          />
          <MetricCard
            title="内存使用率"
            value={metrics.serverPerformance.memoryUsage}
            unit="%"
            icon={MemoryStick}
            trend={memoryHistory}
            color="purple"
            delay={0.1}
          />
          <MetricCard
            title="磁盘使用率"
            value={metrics.serverPerformance.diskUsage}
            unit="%"
            icon={HardDrive}
            color="orange"
            delay={0.2}
          />
          <MetricCard
            title="API请求总数"
            value={metrics.apiStatistics.totalRequests}
            icon={Globe}
            trend={requestHistory}
            color="green"
            delay={0.3}
          />
        </div>

        {/* 服务器性能详情 */}
        <GlassCard className="p-6" delay={0.2}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Server className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">服务器性能</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">实时监控服务器资源使用情况</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* CPU */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center"
            >
              <ProgressRing
                progress={metrics.serverPerformance.cpuUsage}
                label="CPU"
                size={140}
              />
              <div className="mt-4 text-center space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  核心数: {metrics.serverPerformance.cpuCores}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  负载: {metrics.serverPerformance.systemLoadAverage.toFixed(2)}
                </p>
              </div>
            </motion.div>

            {/* 内存 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center"
            >
              <ProgressRing
                progress={metrics.serverPerformance.memoryUsage}
                label="内存"
                size={140}
              />
              <div className="mt-4 text-center space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  已用: {formatBytes(metrics.serverPerformance.usedMemory)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  总计: {formatBytes(metrics.serverPerformance.totalMemory)}
                </p>
              </div>
            </motion.div>

            {/* 磁盘 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center"
            >
              <ProgressRing
                progress={metrics.serverPerformance.diskUsage}
                label="磁盘"
                size={140}
              />
              <div className="mt-4 text-center space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  已用: {formatBytes(metrics.serverPerformance.usedDiskSpace)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  总计: {formatBytes(metrics.serverPerformance.totalDiskSpace)}
                </p>
              </div>
            </motion.div>

            {/* JVM */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col items-center"
            >
              <ProgressRing
                progress={metrics.serverPerformance.jvmMemoryUsage}
                label="JVM"
                size={140}
              />
              <div className="mt-4 text-center space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  已用: {formatBytes(metrics.serverPerformance.jvmUsedMemory)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  总计: {formatBytes(metrics.serverPerformance.jvmTotalMemory)}
                </p>
              </div>
            </motion.div>
          </div>

          {/* 系统信息 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">运行时间</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {metrics.serverPerformance.uptimeFormatted}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800"
            >
              <div className="flex items-center gap-3">
                <Activity className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">当前线程</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    <AnimatedNumber value={metrics.serverPerformance.threadCount} />
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800"
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">峰值线程</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    <AnimatedNumber value={metrics.serverPerformance.peakThreadCount} />
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </GlassCard>

        {/* 数据库和Redis监控 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 数据库监控 */}
          <GlassCard className="p-6" delay={0.3}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">数据库监控</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">MySQL性能指标</p>
              </div>
            </div>

            {/* 连接池使用率 */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">连接池使用率</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {metrics.databaseMetrics.activeConnections} / {metrics.databaseMetrics.maxConnections}
                </span>
              </div>
              <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metrics.databaseMetrics.connectionUsage}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                />
              </div>
            </div>

            {/* 统计信息 */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">总查询数</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  <AnimatedNumber value={metrics.databaseMetrics.totalQueries} />
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">慢查询</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  <AnimatedNumber value={metrics.databaseMetrics.slowQueries} />
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">平均查询时间</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  <AnimatedNumber value={metrics.databaseMetrics.avgQueryTime} decimals={2} />
                  <span className="text-sm ml-1">ms</span>
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">数据库大小</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatBytes(metrics.databaseMetrics.databaseSize)}
                </p>
              </motion.div>
            </div>
          </GlassCard>

          {/* Redis监控 */}
          <GlassCard className="p-6" delay={0.4}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500">
                <HardDrive className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Redis监控</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">缓存性能指标</p>
              </div>
            </div>

            {/* 缓存命中率 */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">缓存命中率</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {metrics.redisMetrics.hitRate.toFixed(2)}%
                </span>
              </div>
              <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metrics.redisMetrics.hitRate}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                />
              </div>
            </div>

            {/* 统计信息 */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">已用内存</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.redisMetrics.usedMemoryHuman}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">连接客户端</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  <AnimatedNumber value={metrics.redisMetrics.connectedClients} />
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">总键数</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  <AnimatedNumber value={metrics.redisMetrics.totalKeys} />
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">每秒操作数</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  <AnimatedNumber value={metrics.redisMetrics.opsPerSec} />
                </p>
              </motion.div>
            </div>
          </GlassCard>
        </div>

        {/* API统计 */}
        <GlassCard className="p-6" delay={0.5}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">API调用统计</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">接口性能分析</p>
            </div>
          </div>

          {/* 关键指标 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
            >
              <p className="text-sm opacity-90 mb-1">总请求数</p>
              <p className="text-3xl font-bold">
                <AnimatedNumber value={metrics.apiStatistics.totalRequests} />
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="p-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white"
            >
              <p className="text-sm opacity-90 mb-1">成功请求</p>
              <p className="text-3xl font-bold">
                <AnimatedNumber value={metrics.apiStatistics.successRequests} />
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="p-4 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 text-white"
            >
              <p className="text-sm opacity-90 mb-1">失败请求</p>
              <p className="text-3xl font-bold">
                <AnimatedNumber value={metrics.apiStatistics.failedRequests} />
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white"
            >
              <p className="text-sm opacity-90 mb-1">平均响应时间</p>
              <p className="text-3xl font-bold">
                <AnimatedNumber value={metrics.apiStatistics.avgResponseTime} decimals={2} />
                <span className="text-lg ml-1">ms</span>
              </p>
            </motion.div>
          </div>

          {/* 最慢的API */}
          {metrics.apiStatistics.slowestApis && metrics.apiStatistics.slowestApis.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                最慢的API（Top 5）
              </h3>
              <div className="space-y-3">
                {metrics.apiStatistics.slowestApis.slice(0, 5).map((api, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {api.endpoint}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {api.method} • {api.requestCount} 次请求
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                        {api.avgResponseTime.toFixed(2)}ms
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        最大 {api.maxResponseTime.toFixed(2)}ms
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
