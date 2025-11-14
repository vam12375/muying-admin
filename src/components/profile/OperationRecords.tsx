/**
 * 操作记录组件
 * Operation Records Component
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getOperationRecords, exportOperationRecords } from '@/lib/api/profile';
import type { OperationRecord, ProfileQueryParams } from '@/types/profile';
import {
  History,
  Plus,
  Edit,
  Trash2,
  Eye,
  Settings,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Download
} from 'lucide-react';

export function OperationRecords() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<OperationRecord[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
    total: 0
  });

  useEffect(() => {
    fetchOperationRecords();
  }, [pagination.current, pagination.size]);

  const fetchOperationRecords = async () => {
    try {
      setLoading(true);
      const params: ProfileQueryParams = {
        page: pagination.current,
        size: pagination.size
      };
      
      const response = await getOperationRecords(params);
      if (response.success && response.data) {
        setRecords(response.data.records);
        setPagination(prev => ({
          ...prev,
          total: response.data?.total || 0
        }));
      }
    } catch (error) {
      console.error('获取操作记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取操作图标
  const getOperationIcon = (operation: string) => {
    const operationLower = operation.toLowerCase();
    if (operationLower.includes('新增') || operationLower.includes('创建') || operationLower.includes('添加')) {
      return <Plus className="w-4 h-4 text-green-500" />;
    } else if (operationLower.includes('编辑') || operationLower.includes('修改') || operationLower.includes('更新')) {
      return <Edit className="w-4 h-4 text-blue-500" />;
    } else if (operationLower.includes('删除') || operationLower.includes('移除')) {
      return <Trash2 className="w-4 h-4 text-red-500" />;
    } else if (operationLower.includes('查看') || operationLower.includes('查询')) {
      return <Eye className="w-4 h-4 text-gray-500" />;
    } else if (operationLower.includes('设置') || operationLower.includes('配置')) {
      return <Settings className="w-4 h-4 text-purple-500" />;
    } else {
      return <History className="w-4 h-4 text-gray-400" />;
    }
  };

  // 获取模块颜色
  const getModuleColor = (module: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    const colorMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      '用户管理': 'default',
      '商品管理': 'secondary',
      '订单管理': 'outline',
      '系统设置': 'destructive'
    };
    return colorMap[module] || 'default';
  };

  // 格式化时间
  const formatTime = (time: string) => {
    if (!time) return { date: '-', time: '-' };
    try {
      const date = new Date(time);
      // 检查日期是否有效
      if (isNaN(date.getTime())) {
        return { date: '-', time: '-' };
      }
      return {
        date: date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }),
        time: date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
    } catch (error) {
      console.error('时间格式化失败:', error, time);
      return { date: '-', time: '-' };
    }
  };

  // 格式化耗时
  const formatDuration = (ms?: number) => {
    if (!ms) return '-';
    return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`;
  };

  // 导出操作记录
  const handleExport = async () => {
    try {
      const params: ProfileQueryParams = {
        page: pagination.current,
        size: pagination.size
      };
      const blob = await exportOperationRecords(params);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `操作记录_${new Date().toLocaleDateString()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('导出失败:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              操作记录
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={loading || records.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              导出
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchOperationRecords}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              刷新
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>操作时间</TableHead>
                <TableHead>操作</TableHead>
                <TableHead>模块</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>耗时</TableHead>
                <TableHead>IP地址</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>加载中...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    暂无操作记录
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => {
                  // 使用后端返回的字段名 createTime
                  const { date, time } = formatTime(record.createTime);
                  return (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-gray-900 dark:text-white">
                            {date}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {time}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getOperationIcon(record.operation)}
                          <span className="text-sm">{record.operation}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getModuleColor(record.module)} className="text-xs">
                          {record.module}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {/* 后端返回的是小写 'success' 或 'failed' */}
                        {record.operationResult?.toLowerCase() === 'success' ? (
                          <Badge variant="default" className="bg-green-500">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            成功
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="w-3 h-3 mr-1" />
                            失败
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {/* 使用后端字段名 executionTimeMs */}
                          {formatDuration(record.executionTimeMs)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {record.ipAddress}
                        </code>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* 分页 */}
        {!loading && records.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              共 {pagination.total} 条记录
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
                disabled={pagination.current === 1}
              >
                上一页
              </Button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                第 {pagination.current} 页
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
                disabled={pagination.current * pagination.size >= pagination.total}
              >
                下一页
              </Button>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
