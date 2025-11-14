/**
 * 登录记录组件
 * Login Records Component
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
import { getLoginRecords, exportLoginRecords } from '@/lib/api/profile';
import type { LoginRecord, ProfileQueryParams } from '@/types/profile';
import {
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
  Clock,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Download
} from 'lucide-react';

export function LoginRecords() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<LoginRecord[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
    total: 0
  });

  useEffect(() => {
    fetchLoginRecords();
  }, [pagination.current, pagination.size]);

  const fetchLoginRecords = async () => {
    try {
      setLoading(true);
      const params: ProfileQueryParams = {
        page: pagination.current,
        size: pagination.size
      };
      
      const response = await getLoginRecords(params);
      if (response.success && response.data) {
        setRecords(response.data.records);
        setPagination(prev => ({
          ...prev,
          total: response.data?.total || 0
        }));
      }
    } catch (error) {
      console.error('获取登录记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取设备图标
  const getDeviceIcon = (device?: string) => {
    const deviceLower = device?.toLowerCase() || '';
    if (deviceLower.includes('mobile') || deviceLower.includes('phone')) {
      return <Smartphone className="w-4 h-4 text-blue-500" />;
    } else if (deviceLower.includes('tablet') || deviceLower.includes('ipad')) {
      return <Tablet className="w-4 h-4 text-green-500" />;
    } else {
      return <Monitor className="w-4 h-4 text-gray-500" />;
    }
  };

  // 格式化时间
  const formatTime = (time: string) => {
    const date = new Date(time);
    return {
      date: date.toLocaleDateString('zh-CN'),
      time: date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  };

  // 导出登录记录
  const handleExport = async () => {
    try {
      const params: ProfileQueryParams = {
        page: pagination.current,
        size: pagination.size
      };
      const blob = await exportLoginRecords(params);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `登录记录_${new Date().toLocaleDateString()}.xlsx`;
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
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              登录记录
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
              onClick={fetchLoginRecords}
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
                <TableHead>登录时间</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>IP地址</TableHead>
                <TableHead>地理位置</TableHead>
                <TableHead>设备信息</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>加载中...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    暂无登录记录
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => {
                  const { date, time } = formatTime(record.loginTime);
                  return (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {date}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {time}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {record.loginStatus === 'SUCCESS' ? (
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
                        <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {record.ipAddress}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-sm">{record.location || '未知'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1">
                            {getDeviceIcon(record.device)}
                            <span className="text-sm">{record.device}</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {record.browser} / {record.os}
                          </span>
                        </div>
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
