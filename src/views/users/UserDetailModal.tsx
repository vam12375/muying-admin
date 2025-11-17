    /**
 * 用户详情模态框组件
 * User Detail Modal Component
 * 
 * 功能
 * - 查看用户完整信息
 * - 编辑用户基本信息
 * - 查看账户信息
 * - 管理用户状态
 * 
 * Source: 基于 AURA-X-KYS 协议设计
 */

'use client';

import { useState, useEffect } from 'react';
import { X, User as UserIcon, Mail, Phone, Calendar, Wallet, Edit2, Save, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { usersApi } from '@/lib/api/users';
import { accountsApi } from '@/lib/api/accounts';
import type { User } from '@/types/user';
import type { UserAccount } from '@/types/accounts';
import { RechargeModal } from './RechargeModal';
import { AdjustBalanceModal } from './AdjustBalanceModal';
import { TransactionHistoryModal } from './TransactionHistoryModal';

interface UserDetailModalProps {
  userId: number;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export function UserDetailModal({ userId, isOpen, onClose, onUpdate }: UserDetailModalProps) {
  console.log('[UserDetailModal] 渲染:', { userId, isOpen });
  
  const [user, setUser] = useState<User | null>(null);
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nickname: '',
    email: '',
    phone: '',
  });

  // 子模态框状态
  const [showRecharge, setShowRecharge] = useState(false);
  const [showAdjustBalance, setShowAdjustBalance] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      loadUserDetail();
    }
  }, [isOpen, userId]);

  const loadUserDetail = async () => {
    try {
      setLoading(true);
      
      // 1. 获取用户基本信息 - 使用 /admin/users/{id}
      const userResponse = await usersApi.getUserById(userId);
      const userData = userResponse.data;
      
      if (!userData) {
        throw new Error('用户数据为空');
      }
      
      setUser(userData);
      setEditForm({
        nickname: userData.nickname || '',
        email: userData.email || '',
        phone: userData.phone || '',
      });
      
      // 2. 获取用户账户信息
      try {
        const accountResponse = await accountsApi.getUserAccountByUserId(userId);
        if (accountResponse.data) {
          setUserAccount(accountResponse.data);
        }
      } catch (accountError) {
        console.error('获取账户信息失败:', accountError);
        // 账户信息获取失败不影响用户基本信息显示
      }
    } catch (error: any) {
      toast({
        title: '加载失败',
        description: error.message || '获取用户详情失败',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await usersApi.updateUser(userId, editForm);
      
      toast({
        title: '保存成功',
        description: '用户信息已更新'
      });
      
      setIsEditing(false);
      loadUserDetail();
      onUpdate?.();
    } catch (error: any) {
      toast({
        title: '保存失败',
        description: error.message || '更新用户信息失败',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!user) return;

    const newStatus = user.status === 1 ? 0 : 1;
    const statusText = newStatus === 1 ? '启用' : '禁用';

    try {
      setLoading(true);
      await usersApi.toggleUserStatus(userId, newStatus);
      
      toast({
        title: '操作成功',
        description: `用户已${statusText}`,
      });
      
      loadUserDetail();
      onUpdate?.();
    } catch (error: any) {
      toast({
        title: '操作失败',
        description: error.message || `${statusText}用户失败`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {user?.username || '加载中...'}
                </h2>
                <p className="text-sm text-gray-500">
                  用户ID: {userId}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading && !user ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500">加载中...</p>
                </div>
              </div>
            ) : user ? (
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">基本信息</TabsTrigger>
                  <TabsTrigger value="account">账户信息</TabsTrigger>
                  <TabsTrigger value="actions">操作</TabsTrigger>
                </TabsList>

                {/* 基本信息 */}
                <TabsContent value="basic" className="space-y-6 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">用户信息</h3>
                    {!isEditing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        编辑
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsEditing(false);
                            setEditForm({
                              nickname: user.nickname || '',
                              email: user.email || '',
                              phone: user.phone || '',
                            });
                          }}
                          className="gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          取消
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSaveEdit}
                          disabled={loading}
                          className="gap-2"
                        >
                          <Save className="w-4 h-4" />
                          保存
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-gray-700">
                        <UserIcon className="w-4 h-4" />
                        用户名
                      </Label>
                      <Input
                        value={user.username}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-gray-700">
                        <UserIcon className="w-4 h-4" />
                        昵称
                      </Label>
                      <Input
                        value={isEditing ? editForm.nickname : user.nickname || '-'}
                        onChange={(e) => setEditForm({ ...editForm, nickname: e.target.value })}
                        disabled={!isEditing}
                        className={isEditing ? '' : 'bg-gray-50'}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-gray-700">
                        <Mail className="w-4 h-4" />
                        邮箱
                      </Label>
                      <Input
                        value={isEditing ? editForm.email : user.email || '-'}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        disabled={!isEditing}
                        className={isEditing ? '' : 'bg-gray-50'}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-gray-700">
                        <Phone className="w-4 h-4" />
                        手机号
                      </Label>
                      <Input
                        value={isEditing ? editForm.phone : user.phone || '-'}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        disabled={!isEditing}
                        className={isEditing ? '' : 'bg-gray-50'}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4" />
                        注册时间
                      </Label>
                      <Input
                        value={user.createTime || '-'}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700">用户状态</Label>
                      <div>
                        <Badge variant={user.status === 1 ? 'default' : 'destructive'}>
                          {user.status === 1 ? '正常' : '禁用'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* 账户信息 */}
                <TabsContent value="account" className="space-y-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">账户详情</h3>
                  
                  {userAccount ? (
                    <>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                              <Wallet className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-sm text-gray-600">当前余额</span>
                          </div>
                          <p className="text-2xl font-bold text-green-600">
                            ¥{userAccount.balance?.toFixed(2) || '0.00'}
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                              <Wallet className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-sm text-gray-600">累计充值</span>
                          </div>
                          <p className="text-2xl font-bold text-blue-600">
                            ¥{userAccount.totalRecharge?.toFixed(2) || '0.00'}
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                              <Wallet className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-sm text-gray-600">累计消费</span>
                          </div>
                          <p className="text-2xl font-bold text-purple-600">
                            ¥{userAccount.totalConsumption?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">账户ID</span>
                          <span className="font-medium">{userAccount.accountId}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">创建时间</span>
                          <span className="font-medium">{userAccount.createTime || '-'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">更新时间</span>
                          <span className="font-medium">{userAccount.updateTime || '-'}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      暂无账户信息
                    </div>
                  )}
                </TabsContent>

                {/* 操作 */}
                <TabsContent value="actions" className="space-y-4 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">账户操作</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={() => setShowRecharge(true)}
                      className="h-20 text-lg gap-3"
                      variant="outline"
                    >
                      <Wallet className="w-6 h-6" />
                      充值
                    </Button>

                    <Button
                      onClick={() => setShowAdjustBalance(true)}
                      className="h-20 text-lg gap-3"
                      variant="outline"
                    >
                      <Edit2 className="w-6 h-6" />
                      调整余额
                    </Button>

                    <Button
                      onClick={() => setShowTransactions(true)}
                      className="h-20 text-lg gap-3"
                      variant="outline"
                    >
                      <Calendar className="w-6 h-6" />
                      交易记录
                    </Button>

                    <Button
                      onClick={handleToggleStatus}
                      disabled={loading}
                      className="h-20 text-lg gap-3"
                      variant={user?.status === 1 ? 'destructive' : 'default'}
                    >
                      {user?.status === 1 ? '禁用用户' : '启用用户'}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            ) : null}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
            <Button variant="outline" onClick={onClose}>
              关闭
            </Button>
          </div>
        </div>
      </div>

      {/* 子模态框 */}
      {userAccount && (
        <>
          <RechargeModal
            open={showRecharge}
            onClose={() => setShowRecharge(false)}
            user={userAccount}
            onSuccess={() => {
              loadUserDetail();
              onUpdate?.();
            }}
          />

          <AdjustBalanceModal
            open={showAdjustBalance}
            onClose={() => setShowAdjustBalance(false)}
            user={userAccount}
            onSuccess={() => {
              loadUserDetail();
              onUpdate?.();
            }}
          />

          <TransactionHistoryModal
            open={showTransactions}
            onClose={() => setShowTransactions(false)}
            user={userAccount}
          />
        </>
      )}
    </>
  );
}

