/**
 * 管理员统计概览组件
 * Admin Statistics Component
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAdminStatistics } from '@/lib/api/profile';
import type { AdminStatistics as AdminStatisticsType } from '@/types/profile';
import {
  Activity,
  Clock,
  Calendar,
  Shield,
  TrendingUp,
  BarChart3
} from 'lucide-react';

export function AdminStatistics() {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<AdminStatisticsType | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await getAdminStatistics();
      console.log('[AdminStatistics] API响应:', response);
      if (response.success && response.data) {
        setStatistics(response.data);
      } else {
        console.warn('[AdminStatistics] 获取统计数据失败，使用默认值');
        // 使用默认值，避免页面报错
        setStatistics({
          loginCount: 0,
          todayLogins: 0,
          weekLogins: 0,
          monthLogins: 0,
          avgSessionDuration: 0,
          operationCount: 0,
          todayOperations: 0,
          weekOperations: 0,
          monthOperations: 0,
          operationTypeDistribution: {},
          moduleStats: []
        });
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
      // 使用默认值，避免页面崩溃
      setStatistics({
        loginCount: 0,
        todayLogins: 0,
        weekLogins: 0,
        monthLogins: 0,
        avgSessionDuration: 0,
        operationCount: 0,
        todayOperations: 0,
        weekOperations: 0,
        monthOperations: 0,
        operationTypeDistribution: {},
        moduleStats: []
      });
    } finally {
      setLoading(false);
    }
  };

  // 格式化时长
  const formatDuration = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)}分钟`;
    }
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}小时${m > 0 ? m + '分钟' : ''}`;
  };

  // 获取安全等级
  const getSecurityLevel = (score: number) => {
    if (score >= 90) return { level: '优秀', color: 'bg-green-500' };
    if (score >= 80) return { level: '良好', color: 'bg-blue-500' };
    if (score >= 70) return { level: '一般', color: 'bg-yellow-500' };
    return { level: '较差', color: 'bg-red-500' };
  };

  if (loading || !statistics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </Card>
        ))}
      </div>
    );
  }

  const securityLevel = getSecurityLevel(statistics.securityScore || 0);

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 登录统计 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <Badge variant="secondary">登录</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {statistics.totalLogins?.toLocaleString() || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">总登录次数</p>
            </div>
            <div className="mt-4 space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>今日</span>
                <span className="font-medium">{statistics.todayLogins || 0}次</span>
              </div>
              <div className="flex justify-between">
                <span>本周</span>
                <span className="font-medium">{statistics.weekLogins || 0}次</span>
              </div>
              <div className="flex justify-between">
                <span>本月</span>
                <span className="font-medium">{statistics.monthLogins || 0}次</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 操作统计 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <Badge variant="secondary">操作</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {statistics.totalOperations?.toLocaleString() || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">总操作次数</p>
            </div>
            <div className="mt-4 space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>今日</span>
                <span className="font-medium">{statistics.todayOperations || 0}次</span>
              </div>
              <div className="flex justify-between">
                <span>本周</span>
                <span className="font-medium">{statistics.weekOperations || 0}次</span>
              </div>
              <div className="flex justify-between">
                <span>本月</span>
                <span className="font-medium">{statistics.monthOperations || 0}次</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 在线时长 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <Badge variant="secondary">时长</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                6.5小时
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">平均在线时长</p>
            </div>
            <div className="mt-4 space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>最长会话</span>
                <span className="font-medium">12.3小时</span>
              </div>
              <div className="flex justify-between">
                <span>在线管理员</span>
                <span className="font-medium">{statistics.onlineAdmins || 0}人</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 账号信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <Badge variant="secondary">账号</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.floor((statistics.accountAge || 0) / 30)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">账号年龄（月）</p>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">安全评分</span>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded ${securityLevel.color} text-white`}>
                  {securityLevel.level}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${securityLevel.color}`}
                  style={{ width: `${statistics.securityScore || 0}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {statistics.securityScore || 0}分
              </p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* 操作类型分布和24小时活跃度 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 操作类型分布 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                操作类型分布
              </h3>
            </div>
            <div className="space-y-3">
              {Object.entries(statistics.operationTypes || {}).map(([type, count], index) => {
                const total = Object.values(statistics.operationTypes || {}).reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'];
                
                return (
                  <div key={type}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{type}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {count}次
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({percentage}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${colors[index % colors.length]}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* 24小时活跃度 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                24小时活跃度
              </h3>
            </div>
            <div className="grid grid-cols-12 gap-1">
              {(statistics.activeHours || []).map((count, hour) => {
                const maxCount = Math.max(...(statistics.activeHours || []));
                const intensity = maxCount > 0 ? count / maxCount : 0;
                const opacity = 0.1 + intensity * 0.9;
                
                return (
                  <div
                    key={hour}
                    className="h-8 rounded flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
                    style={{
                      backgroundColor: `rgba(59, 130, 246, ${opacity})`,
                      border: intensity > 0.7 ? '1px solid rgb(59, 130, 246)' : 'none'
                    }}
                    title={`${hour}:00 - ${count}次操作`}
                  >
                    <span
                      className="text-xs font-medium"
                      style={{ color: intensity > 0.5 ? '#fff' : '#666' }}
                    >
                      {hour}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>0时</span>
              <span>12时</span>
              <span>23时</span>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
