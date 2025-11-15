/**
 * 系统日志页面
 * 路由: /settings/logs
 * 
 * 注意：此页面暂时显示占位内容，待后续实现完整的日志查询功能
 */
"use client";

import { Card } from '@/components/ui/card';
import { FileText, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react';

export default function SystemLogsPage() {
  const logTypes = [
    {
      icon: Info,
      title: '系统日志',
      count: '1,234',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: AlertCircle,
      title: '错误日志',
      count: '45',
      color: 'from-red-500 to-orange-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      icon: CheckCircle,
      title: '操作日志',
      count: '5,678',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: XCircle,
      title: '安全日志',
      count: '89',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">系统日志</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            查看和管理系统运行日志
          </p>
        </div>
      </div>

      {/* 日志类型统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {logTypes.map((type, index) => {
          const Icon = type.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{type.title}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
                    {type.count}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${type.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 占位提示 */}
      <Card className="p-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            系统日志功能开发中
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            此功能将提供完整的日志查询、筛选、导出功能，支持按时间、级别、模块等多维度检索
          </p>
          <div className="mt-6 text-xs text-slate-400 dark:text-slate-500">
            提示：管理员操作日志可在"个人中心"页面查看
          </div>
        </div>
      </Card>
    </div>
  );
}
