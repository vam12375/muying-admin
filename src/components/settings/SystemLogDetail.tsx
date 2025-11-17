"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Clock,
  Globe,
  FileText,
  CheckCircle,
  XCircle,
  Code,
  AlertCircle,
} from 'lucide-react';
import type { SystemLog } from '@/types/systemLog';

/**
 * 系统日志详情组件
 * Source: 自定义实现，遵循KISS原则
 */

interface SystemLogDetailProps {
  log: SystemLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SystemLogDetail({ log, isOpen, onClose }: SystemLogDetailProps) {
  if (!log) return null;

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

  const formatJson = (jsonStr: string | undefined) => {
    if (!jsonStr) return '无';
    try {
      const obj = JSON.parse(jsonStr);
      return JSON.stringify(obj, null, 2);
    } catch {
      return jsonStr;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* 详情面板 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden dark:bg-slate-800"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-500 to-blue-600 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">日志详情</h2>
                  <p className="text-sm text-blue-100">ID: {log.id}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* 内容 */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* 基本信息 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* 操作信息 */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 dark:text-slate-300">
                    <FileText className="h-4 w-4" />
                    操作信息
                  </h3>
                  <div className="space-y-3 pl-6">
                    <div>
                      <p className="text-xs text-slate-500 mb-1 dark:text-slate-400">操作名称</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {log.operation}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1 dark:text-slate-400">操作模块</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {log.module}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1 dark:text-slate-400">操作类型</p>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {log.operationType}
                      </span>
                    </div>
                    {log.description && (
                      <div>
                        <p className="text-xs text-slate-500 mb-1 dark:text-slate-400">操作描述</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {log.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 操作人信息 */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 dark:text-slate-300">
                    <User className="h-4 w-4" />
                    操作人信息
                  </h3>
                  <div className="space-y-3 pl-6">
                    <div>
                      <p className="text-xs text-slate-500 mb-1 dark:text-slate-400">管理员</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {log.adminName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1 dark:text-slate-400">管理员ID</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {log.adminId}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1 dark:text-slate-400">IP地址</p>
                      <div className="flex items-center gap-1.5">
                        <Globe className="h-4 w-4 text-slate-400" />
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {log.ipAddress}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1 dark:text-slate-400">操作时间</p>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {formatTime(log.createTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 请求信息 */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-4 dark:text-slate-300">
                  <Code className="h-4 w-4" />
                  请求信息
                </h3>
                <div className="space-y-3 pl-6">
                  <div>
                    <p className="text-xs text-slate-500 mb-1 dark:text-slate-400">请求方法</p>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      {log.requestMethod}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1 dark:text-slate-400">请求URL</p>
                    <p className="text-sm font-mono text-slate-700 bg-slate-50 px-3 py-2 rounded-lg dark:bg-slate-900/50 dark:text-slate-300">
                      {log.requestUrl}
                    </p>
                  </div>
                  {log.requestParams && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1 dark:text-slate-400">请求参数</p>
                      <pre className="text-xs font-mono text-slate-700 bg-slate-50 px-3 py-2 rounded-lg overflow-x-auto dark:bg-slate-900/50 dark:text-slate-300">
                        {formatJson(log.requestParams)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              {/* 响应信息 */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-4 dark:text-slate-300">
                  {log.operationResult === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  响应信息
                </h3>
                <div className="space-y-3 pl-6">
                  <div>
                    <p className="text-xs text-slate-500 mb-1 dark:text-slate-400">操作结果</p>
                    {log.operationResult === 'success' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle className="h-3.5 w-3.5" />
                        成功
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        <XCircle className="h-3.5 w-3.5" />
                        失败
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1 dark:text-slate-400">响应状态码</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        log.responseStatus >= 200 && log.responseStatus < 300
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                    >
                      {log.responseStatus}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1 dark:text-slate-400">执行时间</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {log.executionTimeMs ? `${log.executionTimeMs} ms` : '-'}
                    </p>
                  </div>
                  {log.errorMessage && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5 dark:text-slate-400">
                        <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                        错误信息
                      </p>
                      <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg dark:bg-red-900/20 dark:text-red-400">
                        {log.errorMessage}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* User Agent */}
              {log.userAgent && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-4 dark:text-slate-300">
                    <Globe className="h-4 w-4" />
                    浏览器信息
                  </h3>
                  <div className="pl-6">
                    <p className="text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg font-mono dark:bg-slate-900/50 dark:text-slate-400">
                      {log.userAgent}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 底部 */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors dark:text-slate-300 dark:hover:bg-slate-700"
              >
                关闭
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
