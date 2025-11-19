'use client';

/**
 * 积分规则管理视图
 * Points Rules Management View
 * 
 * Source: 基于 muying-admin-react points/rule.tsx 改造
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Plus, Edit2, Trash2, Award, RefreshCw
} from 'lucide-react';
import { showSuccess, showError } from '@/lib/utils/toast';
import { getPointsRuleList, deletePointsRule } from '@/lib/api/points';
import type { PointsRule } from '@/types/points';

export function PointsRulesView() {
  const [loading, setLoading] = useState(false);
  const [rules, setRules] = useState<PointsRule[]>([]);
  const [keyword, setKeyword] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  
  // 分页
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // 加载数据
  useEffect(() => {
    loadRules();
  }, [currentPage, keyword, selectedType]);

  const loadRules = async () => {
    try {
      setLoading(true);
      const response = await getPointsRuleList({
        page: currentPage,
        size: pageSize,
        name: keyword || undefined,
      });
      
      if (response.success && response.data) {
        setRules(response.data.records || []);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error('加载积分规则失败:', error);
      showError('加载失败');
    } finally {
      setLoading(false);
    }
  };

  // 搜索处理
  const handleSearch = () => {
    setCurrentPage(1);
    loadRules();
  };

  // 重置筛选
  const handleReset = () => {
    setKeyword('');
    setSelectedType('');
    setCurrentPage(1);
  };

  // 获取规则类型文本
  const getRuleTypeText = (type: string) => {
    const texts: Record<string, string> = {
      'sign_in': '签到',
      'order_complete': '完成订单',
      'product_review': '商品评价',
      'profile_complete': '完善资料',
      'invite_user': '邀请用户',
      'daily_share': '每日分享',
      'level_upgrade': '会员升级',
    };
    return texts[type] || type;
  };

  // 删除规则
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除该规则吗？')) return;
    
    try {
      const response = await deletePointsRule(id);
      if (response.success) {
        showSuccess('删除成功');
        loadRules();
      }
    } catch (error) {
      console.error('删除规则失败:', error);
      showError('删除失败');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">积分规则管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理用户获取积分的规则</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => showSuccess('功能开发中')}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg flex items-center gap-2 hover:shadow-lg transition-shadow"
        >
          <Plus className="w-4 h-4" />
          添加规则
        </motion.button>
      </div>

      {/* 搜索和筛选 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索规则名称"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 类型筛选 */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部类型</option>
            <option value="sign_in">签到</option>
            <option value="order_complete">完成订单</option>
            <option value="product_review">商品评价</option>
            <option value="profile_complete">完善资料</option>
            <option value="invite_user">邀请用户</option>
            <option value="daily_share">每日分享</option>
            <option value="level_upgrade">会员升级</option>
          </select>

          {/* 操作按钮 */}
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              搜索
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              重置
            </button>
          </div>
        </div>
      </motion.div>

      {/* 规则列表 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : rules.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Award className="w-16 h-16 mb-4" />
            <p>暂无积分规则数据</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">规则名称</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">规则类型</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">积分值</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">条件</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {rules.map((rule, index) => (
                  <motion.tr
                    key={rule.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rule.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rule.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getRuleTypeText(rule.type)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{rule.value}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{rule.description || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${rule.enabled === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {rule.enabled === 1 ? '启用' : '禁用'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-green-600 hover:text-green-800 p-1" title="编辑">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(rule.id)}
                          className="text-red-600 hover:text-red-800 p-1" 
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
        )}

        {/* 分页 */}
        {!loading && rules.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              共 {total} 条记录，第 {currentPage} / {Math.ceil(total / pageSize)} 页
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(Math.ceil(total / pageSize), currentPage + 1))}
                disabled={currentPage >= Math.ceil(total / pageSize)}
                className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
