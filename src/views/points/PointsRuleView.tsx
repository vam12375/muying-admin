/**
 * 积分规则管理视图
 * Points Rule Management View
 * 
 * 功能：积分规则的增删改查
 * Source: 对接后端 /admin/points/rule 接口
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { pointsApi } from '@/lib/api/points';
import { showSuccess, showError } from '@/lib/utils/toast';
import {
  Search,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Award,
  Calendar,
  TrendingUp,
  Filter,
  ChevronDown
} from 'lucide-react';
import type { PointsRule } from '@/types/points';
import { PointsRuleModal } from './PointsRuleModal';

// 规则类型映射
const RULE_TYPE_MAP: Record<string, { label: string; color: string }> = {
  signin: { label: '签到', color: 'bg-blue-500' },
  order: { label: '订单', color: 'bg-green-500' },
  review: { label: '评论', color: 'bg-purple-500' },
  register: { label: '注册', color: 'bg-orange-500' },
  event: { label: '活动', color: 'bg-pink-500' }
};

export function PointsRuleView() {
  const [loading, setLoading] = useState(false);
  const [ruleList, setRuleList] = useState<PointsRule[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
    total: 0
  });

  // 搜索和筛选
  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // 模态框状态
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<PointsRule | null>(null);

  useEffect(() => {
    loadRules();
  }, [pagination.current, typeFilter, statusFilter]);

  const loadRules = async () => {
    setLoading(true);
    try {
      const data = await pointsApi.getPointsRulePage({
        page: pagination.current,
        size: pagination.size,
        name: keyword.trim() || undefined,
        type: typeFilter === 'all' ? undefined : typeFilter,
        status: statusFilter === 'all' ? undefined : Number(statusFilter)
      });

      if (data) {
        setRuleList(data.records);
        setPagination({
          current: data.current,
          size: data.size,
          total: data.total
        });
      }
    } catch (error: any) {
      showError(error.response?.data?.message || '加载积分规则列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 });
    loadRules();
  };

  const handleCreate = () => {
    setSelectedRule(null);
    setModalOpen(true);
  };

  const handleEdit = (rule: PointsRule) => {
    setSelectedRule(rule);
    setModalOpen(true);
  };

  const handleDelete = async (rule: PointsRule) => {
    if (!confirm(`确定要删除规则"${rule.name}"吗？`)) return;

    try {
      await pointsApi.deletePointsRule(rule.id);
      showSuccess('删除成功');
      loadRules();
    } catch (error: any) {
      showError(error.response?.data?.message || '删除失败');
    }
  };

  return (
    <div className="space-y-6">
      {/* 搜索和操作栏 */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="搜索规则名称..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 h-12 border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={handleSearch} disabled={loading} className="h-12 px-8">
                  查询
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-12"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  筛选
                  <ChevronDown
                    className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                  />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleCreate}
                  className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  新建规则
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={loadRules}
                  disabled={loading}
                  className="h-12"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </motion.div>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-3 pt-2">
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">全部类型</option>
                      <option value="signin">签到</option>
                      <option value="order">订单</option>
                      <option value="review">评论</option>
                      <option value="register">注册</option>
                      <option value="event">活动</option>
                    </select>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">全部状态</option>
                      <option value="1">启用</option>
                      <option value="0">禁用</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* 规则列表 */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <RefreshCw className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-slate-600">加载中...</p>
          </motion.div>
        ) : ruleList.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-12"
          >
            <Award className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">暂无规则</p>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {ruleList.map((rule) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm overflow-hidden h-full">
                  <div className={`absolute top-0 left-0 w-full h-1 ${RULE_TYPE_MAP[rule.type]?.color || 'bg-gray-500'}`} />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{rule.name}</h3>
                          <Badge variant={rule.status === 1 ? 'default' : 'secondary'}>
                            {rule.status === 1 ? '启用' : '禁用'}
                          </Badge>
                        </div>
                        <Badge className={`${RULE_TYPE_MAP[rule.type]?.color || 'bg-gray-500'} text-white`}>
                          {RULE_TYPE_MAP[rule.type]?.label || rule.type}
                        </Badge>
                      </div>
                    </div>

                    {rule.description && (
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{rule.description}</p>
                    )}

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4 text-purple-600" />
                        <span className="text-slate-600">奖励积分：</span>
                        <span className="font-semibold text-purple-600">{rule.points}</span>
                      </div>
                      {rule.maxDaily && (
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          <span className="text-slate-600">每日上限：</span>
                          <span className="font-semibold">{rule.maxDaily}次</span>
                        </div>
                      )}
                      {rule.startTime && rule.endTime && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <span className="text-slate-600 text-xs">
                            {new Date(rule.startTime).toLocaleDateString()} - {new Date(rule.endTime).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(rule)}
                          className="w-full hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          编辑
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(rule)}
                          className="w-full hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          删除
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 分页 */}
      {ruleList.length > 0 && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                共 <span className="font-semibold text-purple-600">{pagination.total}</span> 条记录
              </div>
              <div className="flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination({ ...pagination, current: pagination.current - 1 })}
                    disabled={pagination.current === 1 || loading}
                  >
                    上一页
                  </Button>
                </motion.div>
                <span className="text-sm px-4">
                  {pagination.current} / {Math.ceil(pagination.total / pagination.size) || 1}
                </span>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination({ ...pagination, current: pagination.current + 1 })}
                    disabled={pagination.current >= Math.ceil(pagination.total / pagination.size) || loading}
                  >
                    下一页
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 规则编辑模态框 */}
      <PointsRuleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        rule={selectedRule}
        onSuccess={loadRules}
      />
    </div>
  );
}
