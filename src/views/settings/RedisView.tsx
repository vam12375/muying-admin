"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  RefreshCw, 
  Trash2, 
  Eye, 
  Edit, 
  Database,
  Clock,
  HardDrive,
  Activity,
  Server,
  Key,
  AlertCircle
} from 'lucide-react';
import { redisApi } from '@/lib/api/redis';
import type { RedisKeyData, RedisInfoData, RedisValueData } from '@/types/redis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function RedisView() {
  // 状态管理
  const [activeTab, setActiveTab] = useState<'keys' | 'info'>('keys');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 键值管理状态
  const [keys, setKeys] = useState<RedisKeyData[]>([]);
  const [searchPattern, setSearchPattern] = useState('*');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  
  // Redis信息状态
  const [redisInfo, setRedisInfo] = useState<RedisInfoData | null>(null);
  
  // 模态框状态
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentKey, setCurrentKey] = useState('');
  const [currentValue, setCurrentValue] = useState<RedisValueData | null>(null);

  // 获取键列表
  const fetchKeys = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await redisApi.getKeys({
        page: pagination.current,
        size: pagination.pageSize,
        pattern: searchPattern
      });
      
      if (response.success && response.data) {
        setKeys(response.data.items || []);
        setPagination(prev => ({
          ...prev,
          total: response.data?.total || 0
        }));
      }
    } catch (err: any) {
      setError(err.message || '获取键列表失败');
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchPattern]);

  // 获取Redis信息
  const fetchInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await redisApi.getInfo();
      if (response.success && response.data) {
        setRedisInfo(response.data);
      }
    } catch (err: any) {
      setError(err.message || '获取Redis信息失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    if (activeTab === 'keys') {
      fetchKeys();
    } else {
      fetchInfo();
    }
  }, [activeTab, fetchKeys, fetchInfo]);

  // 搜索处理
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchKeys();
  };

  // 查看键值
  const handleView = async (key: string) => {
    try {
      const response = await redisApi.getValue(key);
      if (response.success && response.data) {
        setCurrentKey(key);
        setCurrentValue(response.data);
        setViewModalOpen(true);
      }
    } catch (err: any) {
      alert(err.message || '获取键值失败');
    }
  };

  // 删除键
  const handleDelete = async (key: string) => {
    if (!confirm(`确定要删除键 "${key}" 吗？`)) return;
    
    try {
      const response = await redisApi.deleteKey(key);
      if (response.success) {
        alert('删除成功');
        fetchKeys();
      }
    } catch (err: any) {
      alert(err.message || '删除失败');
    }
  };

  // 清空数据库
  const handleClearDb = async () => {
    if (!confirm('确定要清空Redis数据库吗？此操作不可恢复！')) return;
    
    try {
      const response = await redisApi.clearDb();
      if (response.success) {
        alert('清空成功');
        fetchKeys();
        fetchInfo();
      }
    } catch (err: any) {
      alert(err.message || '清空失败');
    }
  };

  // 格式化TTL
  const formatTTL = (ttl: number) => {
    if (ttl === -1) return '永不过期';
    if (ttl === -2) return '已过期';
    if (ttl < 60) return `${ttl}秒`;
    if (ttl < 3600) return `${Math.floor(ttl / 60)}分钟`;
    if (ttl < 86400) return `${Math.floor(ttl / 3600)}小时`;
    return `${Math.floor(ttl / 86400)}天`;
  };

  // 格式化大小
  const formatSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  // 获取类型颜色
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      string: 'bg-blue-100 text-blue-800',
      list: 'bg-green-100 text-green-800',
      hash: 'bg-orange-100 text-orange-800',
      set: 'bg-red-100 text-red-800',
      zset: 'bg-purple-100 text-purple-800'
    };
    return colors[type.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Database className="h-6 w-6 text-pink-500" />
            Redis管理
          </h1>
          <p className="text-sm text-gray-500 mt-1">管理Redis缓存键值和服务器信息</p>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800">错误</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Tab切换 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('keys')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'keys'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Key className="inline-block h-4 w-4 mr-2" />
              键值管理
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'info'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Server className="inline-block h-4 w-4 mr-2" />
              Redis信息
            </button>
          </div>
        </div>

        {/* 键值管理Tab */}
        {activeTab === 'keys' && (
          <div className="p-6">
            {/* 搜索栏 */}
            <div className="flex gap-3 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="支持通配符，如: user:*"
                  value={searchPattern}
                  onChange={(e) => setSearchPattern(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                搜索
              </Button>
              <Button onClick={fetchKeys} variant="outline" disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                刷新
              </Button>
              <Button onClick={handleClearDb} variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                清空数据库
              </Button>
            </div>

            {/* 键列表表格 */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">键名</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">过期时间</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">大小</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        加载中...
                      </td>
                    </tr>
                  ) : keys.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        暂无数据
                      </td>
                    </tr>
                  ) : (
                    keys.map((item) => (
                      <tr key={item.key} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                          {item.key}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatTTL(item.ttl)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatSize(item.size)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleView(item.key)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(item.key)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* 分页 */}
            {pagination.total > 0 && (
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  共 {pagination.total} 条记录
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={pagination.current === 1}
                    onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
                  >
                    上一页
                  </Button>
                  <span className="px-3 py-1 text-sm text-gray-700">
                    第 {pagination.current} 页
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={pagination.current * pagination.pageSize >= pagination.total}
                    onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
                  >
                    下一页
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Redis信息Tab */}
        {activeTab === 'info' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">服务器状态和性能指标</h3>
              <Button onClick={fetchInfo} variant="outline" disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                刷新信息
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-500">加载中...</div>
            ) : redisInfo ? (
              <div className="space-y-6">
                {/* 统计卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Redis版本</p>
                        <p className="text-2xl font-bold text-blue-900 mt-1">{redisInfo.version}</p>
                      </div>
                      <Server className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600 font-medium">运行时间</p>
                        <p className="text-2xl font-bold text-green-900 mt-1">{redisInfo.uptimeInDays}天</p>
                      </div>
                      <Clock className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-600 font-medium">连接数</p>
                        <p className="text-2xl font-bold text-purple-900 mt-1">{redisInfo.connectedClients}</p>
                      </div>
                      <Activity className="h-8 w-8 text-purple-500" />
                    </div>
                  </div>
                </div>

                {/* 内存信息 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-red-600 font-medium">内存使用</p>
                        <p className="text-2xl font-bold text-red-900 mt-1">{redisInfo.usedMemoryHuman}</p>
                      </div>
                      <HardDrive className="h-8 w-8 text-red-500" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-orange-600 font-medium">内存峰值</p>
                        <p className="text-2xl font-bold text-orange-900 mt-1">{redisInfo.usedMemoryPeakHuman}</p>
                      </div>
                      <HardDrive className="h-8 w-8 text-orange-500" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4 border border-pink-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-pink-600 font-medium">键总数</p>
                        <p className="text-2xl font-bold text-pink-900 mt-1">{redisInfo.totalKeys}</p>
                      </div>
                      <Key className="h-8 w-8 text-pink-500" />
                    </div>
                  </div>
                </div>

                {/* 详细信息 */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">详细信息</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">运行模式:</span>
                      <span className="ml-2 text-gray-900 font-medium">{redisInfo.mode}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">操作系统:</span>
                      <span className="ml-2 text-gray-900 font-medium">{redisInfo.os}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">命中率:</span>
                      <span className="ml-2 text-gray-900 font-medium">{redisInfo.keyspaceHitRate}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500">总命令数:</span>
                      <span className="ml-2 text-gray-900 font-medium">{redisInfo.totalCommands}</span>
                    </div>
                  </div>
                </div>

                {/* 键空间统计 */}
                {redisInfo.keyspaceStats && Object.keys(redisInfo.keyspaceStats).length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900">键空间统计</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">数据库</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">键数量</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">过期键</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">平均TTL</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {Object.entries(redisInfo.keyspaceStats).map(([db, stats]) => (
                            <tr key={db}>
                              <td className="px-4 py-2 text-sm text-gray-900">{db}</td>
                              <td className="px-4 py-2 text-sm text-gray-600">{stats.keys}</td>
                              <td className="px-4 py-2 text-sm text-gray-600">{stats.expires}</td>
                              <td className="px-4 py-2 text-sm text-gray-600">
                                {stats.avg_ttl ? formatTTL(parseInt(stats.avg_ttl) / 1000) : '0'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                暂无数据，请点击刷新按钮获取Redis信息
              </div>
            )}
          </div>
        )}
      </div>

      {/* 查看键值模态框 */}
      {viewModalOpen && currentValue && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl max-w-3xl w-full mx-4 max-h-[80vh] overflow-hidden border border-white/20 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-200/50 flex items-center justify-between bg-gradient-to-r from-pink-50/50 to-purple-50/50 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Eye className="h-5 w-5 text-pink-500" />
                查看键值 - <span className="font-mono text-pink-600">{currentKey}</span>
              </h3>
              <button
                onClick={() => setViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-all duration-200"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50">
                  <p className="text-xs text-gray-500 mb-1.5 font-medium">类型</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(currentValue.type)}`}>
                    {currentValue.type}
                  </span>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50">
                  <p className="text-xs text-gray-500 mb-1.5 font-medium">过期时间</p>
                  <p className="text-sm text-gray-900 font-medium">{formatTTL(currentValue.ttl)}</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50">
                  <p className="text-xs text-gray-500 mb-1.5 font-medium">大小</p>
                  <p className="text-sm text-gray-900 font-medium">{formatSize(currentValue.size)}</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50">
                  <p className="text-xs text-gray-500 mb-1.5 font-medium">键名</p>
                  <p className="text-sm text-gray-900 font-mono truncate font-medium">{currentKey}</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-50/80 to-gray-100/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 shadow-inner">
                <p className="text-xs text-gray-600 mb-3 font-medium flex items-center gap-2">
                  <Database className="h-3.5 w-3.5" />
                  键值内容
                </p>
                <div className="bg-white/60 backdrop-blur-sm rounded-md p-4 border border-gray-200/50">
                  <pre className="text-sm text-gray-900 font-mono whitespace-pre-wrap overflow-auto max-h-96">
                    {typeof currentValue.value === 'object' 
                      ? JSON.stringify(currentValue.value, null, 2)
                      : String(currentValue.value)}
                  </pre>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200/50 flex justify-end gap-3 bg-gradient-to-r from-gray-50/50 to-gray-100/50 backdrop-blur-sm">
              <Button variant="outline" onClick={() => setViewModalOpen(false)}>
                关闭
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
