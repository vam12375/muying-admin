"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Globe,
  FileText,
} from 'lucide-react';
import type { SystemLog } from '@/types/systemLog';

/**
 * 系统日志表格组件
 * Source: 自定义实现，遵循KISS原则
 */

interface SystemLogTableProps {
  logs: SystemLog[];
  onViewDetail: (log: SystemLog) => void;
  selectedIds: number[];
  onSelectChange: (ids: number[]) => void;
}

export function SystemLogTable({
  logs = [],
  onViewDetail,
  selectedIds,
  onSelectChange,
}: SystemLogTableProps) {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectChange(logs.map((log) => log.id));
    } else {
      onSelectChange([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      onSelectChange([...selectedIds, id]);
    } else {
      onSelectChange(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const getOperationTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      CREATE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      READ: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      UPDATE: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      EXPORT: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      IMPORT: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
      LOGIN: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
      LOGOUT: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    };
    return colors[type] || 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400';
  };

  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-900/50 dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedIds.length === logs.length && logs.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                操作信息
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                操作人
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                类型
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                结果
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                IP地址
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                耗时
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                时间
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {logs.map((log, index) => (
              <motion.tr
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="hover:bg-slate-50 transition-colors dark:hover:bg-slate-700/50"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(log.id)}
                    onChange={(e) => handleSelectOne(log.id, e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate dark:text-slate-100">
                        {log.operation}
                      </p>
                      <p className="text-xs text-slate-500 truncate dark:text-slate-400">
                        {log.module} · {log.requestMethod} {log.requestUrl}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {log.adminName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">ID: {log.adminId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getOperationTypeColor(
                      log.operationType
                    )}`}
                  >
                    {log.operationType}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {log.operationResult === 'success' ? (
                    <div className="flex items-center gap-1.5 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">成功</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-red-600">
                      <XCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">失败</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <Globe className="h-4 w-4" />
                    <span className="text-sm">{log.ipAddress}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                      {log.executionTimeMs ? `${log.executionTimeMs}ms` : '-'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {formatTime(log.createTime)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onViewDetail(log)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:text-blue-400 dark:hover:bg-blue-900/30"
                  >
                    <Eye className="h-4 w-4" />
                    详情
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {logs.length === 0 && (
        <div className="py-12 text-center">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">暂无日志记录</p>
        </div>
      )}
    </div>
  );
}
