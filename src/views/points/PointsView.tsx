"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { PointRecord } from './types';
import { pointsApi } from '@/lib/api';

export function PointsView() {
  const [records, setRecords] = useState<PointRecord[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 加载积分记录
  useEffect(() => {
    loadRecords();
  }, [currentPage]);

  const loadRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await pointsApi.getRecords(currentPage, 10);
      if (response.success && response.data) {
        // 转换后端数据格式
        const formattedRecords = response.data.records?.map((item: any) => ({
          id: item.historyId?.toString() || item.id?.toString(),
          customerName: item.userName || item.username || '未知用户',
          type: item.changeType === 1 || item.points > 0 ? 'earn' : 'spend',
          points: Math.abs(item.points || item.changeAmount || 0),
          reason: item.description || item.reason || '无说明',
          date: item.createTime || item.date,
          balance: item.afterBalance || item.balance || 0,
        })) || [];
        setRecords(formattedRecords);
        setTotalPages(response.data.pages || 1);
        
        // 加载统计数据
        loadStats();
      }
    } catch (err: any) {
      console.error('加载积分记录失败:', err);
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await pointsApi.getInfo();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('加载统计数据失败:', err);
    }
  };

  // 加载状态
  if (loading && records.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400">加载中...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={loadRecords}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  // 计算统计数据
  const totalEarned = records.filter(r => r.type === 'earn').reduce((sum, r) => sum + r.points, 0);
  const totalSpent = records.filter(r => r.type === 'spend').reduce((sum, r) => sum + r.points, 0);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">积分管理</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">管理用户积分和兑换规则</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "总积分发放", value: stats?.totalPoints || totalEarned, icon: Award, color: "from-yellow-500 to-orange-500" },
          { label: "总用户", value: stats?.totalUsers || records.length, icon: Users, color: "from-blue-500 to-cyan-500" },
          { label: "今日获得", value: `+${stats?.todayEarned || 0}`, icon: TrendingUp, color: "from-green-500 to-emerald-500" },
          { label: "今日消耗", value: `-${stats?.todaySpent || totalSpent}`, icon: TrendingDown, color: "from-red-500 to-pink-500" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50"
          >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">用户</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">类型</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">积分</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">原因</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">余额</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">日期</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {records.map((record, index) => (
                <motion.tr
                  key={record.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: "rgba(236, 72, 153, 0.05)" }}
                  className="transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-800 dark:text-slate-100">{record.customerName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      record.type === "earn" 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {record.type === "earn" ? "获得" : "消耗"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-semibold ${
                      record.type === "earn" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}>
                      {record.type === "earn" ? "+" : "-"}{record.points}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{record.reason}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800 dark:text-slate-100">{record.balance}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{record.date}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
