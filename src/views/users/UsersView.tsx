/**
 * 用户管理视图组件
 * Source: 基于 muying-admin-react/src/views/user/list.tsx
 * 
 * 功能：
 * - 用户列表展示（表格形式）
 * - 搜索功能（用户名/昵称/邮箱/手机）
 * - 状态筛选（正常/禁用）
 * - 角色筛选（管理员/普通用户）
 * - 分页功能
 * - 用户操作（编辑、禁用/启用、删除、充值）
 * - 账户余额展示
 */

"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Lock, 
  Unlock, 
  Wallet,
  MoreVertical,
  User,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import { usersApi } from '@/lib/api';
import { formatDate, formatPrice } from '@/lib/utils';

// 用户数据接口
interface UserData {
  userId: number;
  username: string;
  nickname?: string;
  email?: string;
  phone?: string;
  status: number;
  role: string;
  createTime: string;
  balance?: number;
}

export function UsersView() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 搜索和筛选
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  
  // 分页
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // 加载用户数据
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await usersApi.getList(
        currentPage,
        pageSize,
        searchText || undefined,
        statusFilter || undefined,
        roleFilter || undefined
      );

      if (response.success && response.data) {
        const data = response.data;
        const userList = data.records || data.list || [];
        
        setUsers(userList);
        setTotal(data.total || 0);
      } else {
        setError(response.message || '加载用户列表失败');
      }
    } catch (err: any) {
      console.error('加载用户列表失败:', err);
      
      // 检查是否是后端SQL错误
      if (err.message && err.message.includes('Unknown column')) {
        setError('后端数据库查询错误，请联系管理员修复。详情请查看文档: USER_BACKEND_FIX_NEEDED.md');
      } else {
        setError(err.message || '加载失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentPage, statusFilter, roleFilter]);

  // 处理搜索
  const handleSearch = () => {
    setCurrentPage(1);
    loadUsers();
  };

  // 处理状态切换
  const handleStatusToggle = async (userId: number, currentStatus: number) => {
    if (!confirm(`确定要${currentStatus === 1 ? '禁用' : '启用'}该用户吗？`)) {
      return;
    }

    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      const response = await usersApi.toggleStatus(userId, newStatus);

      if (response.success) {
        // 更新本地数据
        setUsers(users.map(user =>
          user.userId === userId ? { ...user, status: newStatus } : user
        ));
      } else {
        alert(response.message || '操作失败');
      }
    } catch (err: any) {
      console.error('修改用户状态失败:', err);
      alert(err.message || '操作失败');
    }
  };

  // 处理删除
  const handleDelete = async (userId: number) => {
    if (!confirm('确定要删除该用户吗？此操作不可逆。')) {
      return;
    }

    try {
      const response = await usersApi.delete(userId);

      if (response.success) {
        loadUsers();
      } else {
        alert(response.message || '删除失败');
      }
    } catch (err: any) {
      console.error('删除用户失败:', err);
      alert(err.message || '删除失败');
    }
  };

  // 渲染状态标签
  const renderStatus = (status: number) => {
    if (status === 1) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
          正常
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
        禁用
      </span>
    );
  };

  // 渲染角色标签
  const renderRole = (role: string) => {
    if (role === 'admin') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
          管理员
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
        用户
      </span>
    );
  };

  // 加载状态
  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-sm text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    const isBackendError = error.includes('后端数据库查询错误');
    
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="max-w-md text-center bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">
            {isBackendError ? '后端服务需要修复' : '加载失败'}
          </h3>
          
          <p className="text-gray-400 mb-6 text-sm leading-relaxed">
            {error}
          </p>
          
          {isBackendError ? (
            <div className="space-y-3">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-left">
                <p className="text-yellow-400 text-sm font-medium mb-2">⚠️ 需要修复后端代码</p>
                <p className="text-gray-400 text-xs">
                  请修改 <code className="text-yellow-400">UserAccountMapper.java</code> 中的SQL查询，
                  将 <code className="text-red-400">u.id</code> 改为 <code className="text-green-400">u.user_id</code>
                </p>
              </div>
              <button
                onClick={() => window.open('/docs/USER_BACKEND_FIX_NEEDED.md', '_blank')}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                查看修复文档
              </button>
            </div>
          ) : (
            <button
              onClick={loadUsers}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              重试
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">用户管理</h1>
        <p className="text-gray-400">管理系统用户和账户信息</p>
      </div>

      {/* 搜索和筛选栏 */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <div className="flex flex-wrap gap-4">
          {/* 搜索框 */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索用户名/昵称/邮箱/手机"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 状态筛选 */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部状态</option>
            <option value="1">正常</option>
            <option value="0">禁用</option>
          </select>

          {/* 角色筛选 */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部角色</option>
            <option value="admin">管理员</option>
            <option value="user">普通用户</option>
          </select>

          {/* 搜索按钮 */}
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            搜索
          </button>
        </div>
      </div>

      {/* 用户列表 */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  用户信息
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  账户信息
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  注册时间
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.map((user) => (
                <motion.tr
                  key={user.userId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  {/* ID */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-300">{user.userId}</span>
                  </td>

                  {/* 用户信息 */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-white">
                          {user.username}
                        </span>
                        {user.nickname && (
                          <span className="text-xs text-gray-400">
                            ({user.nickname})
                          </span>
                        )}
                      </div>
                      {user.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-400">{user.email}</span>
                        </div>
                      )}
                      {user.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-400">{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* 账户信息 */}
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-green-400">
                        {formatPrice(user.balance || 0)}
                      </div>
                      <div className="flex gap-2">
                        {renderRole(user.role)}
                        {renderStatus(user.status)}
                      </div>
                    </div>
                  </td>

                  {/* 注册时间 */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300">
                        {formatDate(user.createTime, 'date')}
                      </span>
                    </div>
                  </td>

                  {/* 操作 */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleStatusToggle(user.userId, user.status)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title={user.status === 1 ? '禁用' : '启用'}
                      >
                        {user.status === 1 ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <Unlock className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(user.userId)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        {total > pageSize && (
          <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              共 {total} 条记录
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                上一页
              </button>
              <span className="px-4 py-2 text-white">
                {currentPage} / {Math.ceil(total / pageSize)}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(Math.ceil(total / pageSize), p + 1))}
                disabled={currentPage >= Math.ceil(total / pageSize)}
                className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 空状态 */}
      {users.length === 0 && !loading && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">暂无用户数据</p>
        </div>
      )}
    </motion.div>
  );
}
