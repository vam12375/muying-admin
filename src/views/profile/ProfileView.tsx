/**
 * 个人中心视图
 * Profile View
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminStatistics } from '@/components/profile/AdminStatistics';
import { LoginRecords } from '@/components/profile/LoginRecords';
import { OperationRecords } from '@/components/profile/OperationRecords';
import { SystemLogsEnhanced } from '@/components/profile/SystemLogsEnhanced';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { getAdminInfo } from '@/lib/api/profile';
import type { AdminInfo } from '@/types/profile';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit,
  Shield,
  Activity,
  Clock,
  BarChart3,
  History,
  LogIn,
  FileText
} from 'lucide-react';

// 统计卡片组件
function StatisticsCards({ adminInfo, formatDate }: { adminInfo: AdminInfo | null; formatDate: (dateStr?: string) => string }) {
  const [statistics, setStatistics] = useState<any>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/statistics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const result = await response.json();
      if (result.success && result.data) {
        setStatistics(result.data);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              登录次数
            </span>
            <div className="p-2 bg-blue-100 dark:bg-blue-800/30 rounded-full">
              <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {statistics?.totalLogins?.toLocaleString() || adminInfo?.loginCount || 0}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            上次登录: {adminInfo?.lastLogin ? formatDate(adminInfo.lastLogin).split(' ')[0] : '未知'}
          </p>
        </Card>
      </motion.div>

      <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              操作记录
            </span>
            <div className="p-2 bg-green-100 dark:bg-green-800/30 rounded-full">
              <History className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">
            {statistics?.totalOperations?.toLocaleString() || 0}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            今日操作: {statistics?.todayOperations || 0}次
          </p>
        </Card>
      </motion.div>

      <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              账号状态
            </span>
            <div className="p-2 bg-purple-100 dark:bg-purple-800/30 rounded-full">
              <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {Number(adminInfo?.status) === 1 ? '正常' : '已禁用'}
            </p>
            <Badge variant={Number(adminInfo?.status) === 1 ? 'default' : 'destructive'}>
              {Number(adminInfo?.status) === 1 ? '✓' : '✗'}
            </Badge>
          </div>
          <div className="mt-2">
            <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${
                  Number(adminInfo?.status) === 1 ? 'bg-purple-600' : 'bg-red-600'
                }`}
                style={{ width: Number(adminInfo?.status) === 1 ? '100%' : '0%' }}
              ></div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export function ProfileView() {
  const [loading, setLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchAdminInfo();
  }, []);

  const fetchAdminInfo = async () => {
    try {
      setLoading(true);
      const response = await getAdminInfo();
      console.log('=== 个人中心API响应 ===');
      console.log('完整响应:', response);
      console.log('success:', response.success);
      console.log('data:', response.data);
      console.log('data类型:', typeof response.data);
      console.log('data是否为null:', response.data === null);
      console.log('data是否为undefined:', response.data === undefined);
      
      if (response.success && response.data) {
        console.log('=== 管理员信息详情 ===');
        console.log('username:', response.data.username);
        console.log('email:', response.data.email);
        console.log('phone:', response.data.phone);
        console.log('status:', response.data.status, '类型:', typeof response.data.status);
        setAdminInfo(response.data);
        console.log('adminInfo已设置');
      } else {
        console.error('=== 数据异常 ===');
        console.error('success:', response.success);
        console.error('data:', response.data);
      }
    } catch (error) {
      console.error('=== 获取管理员信息失败 ===');
      console.error('错误:', error);
    } finally {
      setLoading(false);
    }
  };

  // 格式化日期
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return '未知';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  // 计算账号年龄
  const calculateAccountAge = (dateStr?: string): string => {
    if (!dateStr) return '未知';
    try {
      const createdDate = new Date(dateStr);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - createdDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 30) {
        return `${diffDays}天`;
      } else if (diffDays < 365) {
        return `${Math.floor(diffDays / 30)}个月`;
      } else {
        const years = Math.floor(diffDays / 365);
        const months = Math.floor((diffDays % 365) / 30);
        return `${years}年${months > 0 ? months + '个月' : ''}`;
      }
    } catch {
      return '未知';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            个人中心
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          查看和管理您的个人信息及系统使用情况
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左侧 - 管理员基本信息 */}
        <motion.div
          className="lg:col-span-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="overflow-hidden">
            {/* 顶部彩色背景 */}
            <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            
            {/* 用户信息 */}
            <div className="relative px-6 pb-6">
              <div className="flex justify-center -mt-12 mb-4">
                <AvatarUpload
                  currentAvatar={adminInfo?.avatar}
                  username={adminInfo?.username || 'A'}
                  onSuccess={(avatarUrl) => {
                    // 直接更新本地状态，无需重新请求
                    setAdminInfo(prev => prev ? { ...prev, avatar: avatarUrl } : null);
                  }}
                />
              </div>
              
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {adminInfo?.nickname || adminInfo?.username || '管理员'}
                </h2>
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="default">
                    <Shield className="w-3 h-3 mr-1" />
                    {adminInfo?.role === 'admin' ? '系统管理员' : '普通用户'}
                  </Badge>
                  <Badge variant={Number(adminInfo?.status) === 1 ? 'default' : 'destructive'}>
                    {Number(adminInfo?.status) === 1 ? '正常' : '已禁用'}
                  </Badge>
                </div>
              </div>
              
              <Button 
                className="w-full mb-6" 
                variant="default"
                onClick={() => setShowEditModal(true)}
              >
                <Edit className="w-4 h-4 mr-2" />
                修改个人资料
              </Button>
              
              {/* 详细信息 */}
              <div className="space-y-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">用户名</p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {adminInfo?.username || '未设置'}
                        </p>
                        <Badge variant="outline" className="text-xs">登录账号</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">电子邮箱</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {adminInfo?.email || '未设置'}
                        </p>
                        {adminInfo?.email && (
                          <Badge variant="default" className="text-xs bg-green-500">已验证</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">手机号码</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {adminInfo?.phone || '未设置'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">注册时间</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDate(adminInfo?.createTime)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        账号年龄：{calculateAccountAge(adminInfo?.createTime)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">最后登录</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {adminInfo?.lastLogin ? formatDate(adminInfo.lastLogin) : '未知'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 右侧 - 统计信息和记录 */}
        <motion.div
          className="lg:col-span-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="space-y-6">
            {/* 顶部统计卡片 */}
            <StatisticsCards adminInfo={adminInfo} formatDate={formatDate} />

            {/* 详细信息标签页 */}
            <Card className="p-6">
              <Tabs defaultValue="statistics" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="statistics" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    统计概览
                  </TabsTrigger>
                  <TabsTrigger value="loginRecords" className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    登录记录
                  </TabsTrigger>
                  <TabsTrigger value="operationRecords" className="flex items-center gap-2">
                    <History className="w-4 h-4" />
                    操作记录
                  </TabsTrigger>
                  <TabsTrigger value="systemLogs" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    系统日志
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="statistics" className="mt-6">
                  <AdminStatistics />
                </TabsContent>
                
                <TabsContent value="loginRecords" className="mt-6">
                  <LoginRecords />
                </TabsContent>
                
                <TabsContent value="operationRecords" className="mt-6">
                  <OperationRecords />
                </TabsContent>
                
                <TabsContent value="systemLogs" className="mt-6">
                  <SystemLogsEnhanced />
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* 编辑个人资料模态框 */}
      {adminInfo && (
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          adminInfo={adminInfo}
          onSuccess={(updatedInfo) => {
            // 直接更新本地状态，无需重新请求
            setAdminInfo(prev => prev ? { ...prev, ...updatedInfo } : null);
          }}
        />
      )}
    </div>
  );
}
