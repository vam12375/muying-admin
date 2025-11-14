/**
 * 系统日志组件（增强版）
 * System Logs Component (Enhanced)
 * 
 * 注意：后端 /admin/system/logs 实际返回的是操作日志（AdminOperationLog）
 * 本组件将操作日志以系统日志的形式展示，提供丰富的筛选和查看功能
 * 
 * Source: 基于后端 AdminController.getSystemLogs() 接口
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getSystemLogs } from '@/lib/api/profile';
import type { ProfileQueryParams, OperationRecord } from '@/types/profile';
import {
  RefreshCw,
  AlertCircle,
  Info,
  XCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  Eye,
  Download,
  Filter,
  Clock,
  User,
  Globe,
  CheckCircle2,
  Plus,
  Edit,
  Trash2,
  Settings,
  Calendar
} from 'lucide-react';

export function SystemLogsEnhanced() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<OperationRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedLog, setSelectedLog] = useState<OperationRecord | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [params, setParams] = useState<ProfileQueryParams & { 
    operationType?: string;
    module?: string;
    operationResult?: string;
  }>({
    page: 1,
    size: 10,
    operationType: undefined,
    module: undefined,
    operationResult: undefined
  });

  useEffect(() => {
    fetchLogs();
  }, [params.page, params.size, params.operationType, params.module, params.operationResult]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await getSystemLogs(params);
      if (response.success && response.data) {
        setLogs(response.data.records || []);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error('获取系统日志失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchLogs();
  };

  const handleTypeChange = (type: string) => {
    setParams({ ...params, operationType: type === 'all' ? undefined : type, page: 1 });
  };

  const handleModuleChange = (module: string) => {
    setParams({ ...params, module: module === 'all' ? undefined : module, page: 1 });
  };

  const handleResultChange = (result: string) => {
    setParams({ ...params, operationResult: result === 'all' ? undefined : result, page: 1 });
  };

  const handleViewDetail = (log: OperationRecord) => {
    setSelectedLog(log);
    setShowDetail(true);
  };

  // 根据操作类型获取图标
  const getTypeIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'CREATE':
        return <Plus className="w-4 h-4 text-green-500" />;
      case 'UPDATE':
        return <Edit className="w-4 h-4 text-blue-500" />;
      case 'DELETE':
        return <Trash2 className="w-4 h-4 text-red-500" />;
      case 'READ':
        return <Eye className="w-4 h-4 text-gray-500" />;
      case 'EXPORT':
        return <Download className="w-4 h-4 text-purple-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  // 根据操作类型获取徽章样式
  const getTypeBadge = (type: string): 'default' | 'destructive' | 'secondary' | 'outline' => {
    const variants: Record<string, 'default' | 'destructive' | 'secondary' | 'outline'> = {
      CREATE: 'default',
      UPDATE: 'secondary',
      DELETE: 'destructive',
      READ: 'outline',
      EXPORT: 'secondary'
    };
    return variants[type?.toUpperCase()] || 'outline';
  };

  // 格式化时间
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return '-';
    }
  };

  // 格式化执行时间
  const formatDuration = (ms?: number) => {
    if (!ms) return '-';
    return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* 筛选栏 */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-500" />
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 操作类型筛选 */}
            <Select value={params.operationType || 'all'} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="操作类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="CREATE">新增 (CREATE)</SelectItem>
                <SelectItem value="READ">查看 (READ)</SelectItem>
                <SelectItem value="UPDATE">更新 (UPDATE)</SelectItem>
                <SelectItem value="DELETE">删除 (DELETE)</SelectItem>
                <SelectItem value="EXPORT">导出 (EXPORT)</SelectItem>
              </SelectContent>
            </Select>

            {/* 模块筛选 */}
            <Select value={params.module || 'all'} onValueChange={handleModuleChange}>
              <SelectTrigger>
                <SelectValue placeholder="所属模块" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部模块</SelectItem>
                <SelectItem value="用户管理">用户管理</SelectItem>
                <SelectItem value="商品管理">商品管理</SelectItem>
                <SelectItem value="订单管理">订单管理</SelectItem>
                <SelectItem value="系统管理">系统管理</SelectItem>
                <SelectItem value="系统监控">系统监控</SelectItem>
                <SelectItem value="管理员管理">管理员管理</SelectItem>
              </SelectContent>
            </Select>

            {/* 结果筛选 */}
            <Select value={params.operationResult || 'all'} onValueChange={handleResultChange}>
              <SelectTrigger>
                <SelectValue placeholder="操作结果" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部结果</SelectItem>
                <SelectItem value="success">成功</SelectItem>
                <SelectItem value="failed">失败</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={handleRefresh} variant="outline" disabled={loading} size="sm">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
        </div>
      </Card>

      {/* 日志列表 */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b-2 border-gray-200 dark:border-gray-700">
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    类型 / 模块
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                  操作内容
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-center">
                  状态
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    时间 / 耗时
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-center">
                  操作
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                      <span className="text-sm text-gray-500">加载中...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <FileText className="w-12 h-12 text-gray-300" />
                      <span className="text-sm text-gray-500">暂无日志记录</span>
                      <span className="text-xs text-gray-400">尝试调整筛选条件或刷新页面</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log, index) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/10 dark:hover:to-purple-900/10 transition-all duration-200"
                  >
                    {/* 类型 / 模块 */}
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(log.operationType)}
                          <Badge variant={getTypeBadge(log.operationType)} className="text-xs font-medium">
                            {log.operationType}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 ml-6">
                          <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                            {log.module}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* 操作内容 */}
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-1.5">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {log.operation}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <User className="w-3 h-3" />
                          <span>{log.adminName}</span>
                          {log.ipAddress && (
                            <>
                              <span className="text-gray-300 dark:text-gray-600">•</span>
                              <Globe className="w-3 h-3" />
                              <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs">
                                {log.ipAddress}
                              </code>
                            </>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* 状态 */}
                    <TableCell className="py-4 text-center">
                      {log.operationResult?.toLowerCase() === 'success' ? (
                        <Badge variant="default" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-sm">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          成功
                        </Badge>
                      ) : log.operationResult?.toLowerCase() === 'failed' ? (
                        <Badge variant="destructive" className="bg-gradient-to-r from-red-500 to-rose-500 text-white border-0 shadow-sm">
                          <XCircle className="w-3 h-3 mr-1" />
                          失败
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0 shadow-sm">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          未知
                        </Badge>
                      )}
                    </TableCell>

                    {/* 时间 / 耗时 */}
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="font-medium">
                            {formatDate(log.createTime).split(' ')[0]}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span>{formatDate(log.createTime).split(' ')[1]}</span>
                          <span className="text-gray-300 dark:text-gray-600">•</span>
                          <span className="text-blue-600 dark:text-blue-400 font-medium">
                            {formatDuration(log.executionTimeMs)}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* 操作 */}
                    <TableCell className="py-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetail(log)}
                        className="h-8 px-3 text-xs font-medium hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1.5" />
                        查看详情
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* 分页 */}
        {total > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50 dark:bg-gray-800/50">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              共 <span className="font-semibold text-gray-900 dark:text-white">{total}</span> 条记录，
              第 <span className="font-semibold text-gray-900 dark:text-white">{params.page}</span> / 
              <span className="font-semibold text-gray-900 dark:text-white">{Math.ceil(total / (params.size || 10))}</span> 页
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setParams({ ...params, page: (params.page || 1) - 1 })}
                disabled={params.page === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                上一页
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setParams({ ...params, page: (params.page || 1) + 1 })}
                disabled={params.page! >= Math.ceil(total / (params.size || 10))}
              >
                下一页
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* 详情弹窗 */}
      <AnimatePresence>
        {showDetail && selectedLog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetail(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    日志详情
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetail(false)}
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {/* 基本信息 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">操作类型</label>
                    <div className="mt-1 flex items-center gap-2">
                      {getTypeIcon(selectedLog.operationType)}
                      <Badge variant={getTypeBadge(selectedLog.operationType)}>
                        {selectedLog.operationType}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">操作结果</label>
                    <div className="mt-1">
                      {selectedLog.operationResult?.toLowerCase() === 'success' ? (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          成功
                        </Badge>
                      ) : selectedLog.operationResult?.toLowerCase() === 'failed' ? (
                        <Badge variant="destructive">
                          <XCircle className="w-3 h-3 mr-1" />
                          失败
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-500">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          未知
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">所属模块</label>
                    <p className="mt-1 text-sm font-medium">{selectedLog.module}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">操作人</label>
                    <p className="mt-1 text-sm font-medium">{selectedLog.adminName}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">执行时间</label>
                    <p className="mt-1 text-sm">{formatDuration(selectedLog.executionTimeMs)}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">操作时间</label>
                    <p className="mt-1 text-sm">{formatDate(selectedLog.createTime)}</p>
                  </div>
                </div>

                {/* 操作内容 */}
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">操作内容</label>
                  <p className="mt-1 text-sm font-medium">{selectedLog.operation}</p>
                </div>

                {/* 请求信息 */}
                {selectedLog.requestUrl && (
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">请求URL</label>
                    <code className="mt-1 block text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">
                      {selectedLog.requestMethod} {selectedLog.requestUrl}
                    </code>
                  </div>
                )}

                {/* IP地址 */}
                {selectedLog.ipAddress && (
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">IP地址</label>
                    <div className="mt-1 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {selectedLog.ipAddress}
                      </code>
                    </div>
                  </div>
                )}

                {/* 请求参数 */}
                {selectedLog.requestParams && (
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">请求参数</label>
                    <pre className="mt-1 text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto">
                      {selectedLog.requestParams}
                    </pre>
                  </div>
                )}

                {/* 错误信息 */}
                {selectedLog.errorMessage && (
                  <div>
                    <label className="text-xs text-red-500">错误信息</label>
                    <pre className="mt-1 text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded overflow-x-auto">
                      {selectedLog.errorMessage}
                    </pre>
                  </div>
                )}

                {/* 描述 */}
                {selectedLog.description && (
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">操作描述</label>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                      {selectedLog.description}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-4 border-t bg-gray-50 dark:bg-gray-800/50 flex justify-end">
                <Button onClick={() => setShowDetail(false)}>
                  关闭
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
