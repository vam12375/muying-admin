/**
 * 物流公司Tab组件
 * Logistics Company Tab Component
 * 
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Power, PowerOff } from 'lucide-react';
import { 
  getLogisticsCompanies, 
  addLogisticsCompany, 
  updateLogisticsCompany, 
  deleteLogisticsCompany 
} from '@/lib/api/logistics';
import type { LogisticsCompany, LogisticsCompanyQueryParams } from '@/types/logistics';
import type { PageResult } from '@/types/common';

const LogisticsCompanyTab: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<LogisticsCompany[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // 模态框状态
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentCompany, setCurrentCompany] = useState<LogisticsCompany | null>(null);

  // 表单数据
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    contact: '',
    phone: '',
    address: '',
    status: 1,
    logo: '',
    sortOrder: 0
  });

  // 加载物流公司列表
  const loadCompanies = async () => {
    setLoading(true);
    try {
      const params: LogisticsCompanyQueryParams = {
        page: pagination.current,
        pageSize: pagination.pageSize
      };
      
      const result: PageResult<LogisticsCompany> = await getLogisticsCompanies(params);
      setCompanies(result.records);
      setPagination(prev => ({
        ...prev,
        total: result.total
      }));
    } catch (error) {
      console.error('加载物流公司列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadCompanies();
  }, [pagination.current, pagination.pageSize]);

  // 打开添加模态框
  const handleAdd = () => {
    setModalMode('add');
    setCurrentCompany(null);
    setFormData({
      code: '',
      name: '',
      contact: '',
      phone: '',
      address: '',
      status: 1,
      logo: '',
      sortOrder: 0
    });
    setModalVisible(true);
  };

  // 打开编辑模态框
  const handleEdit = (company: LogisticsCompany) => {
    setModalMode('edit');
    setCurrentCompany(company);
    setFormData({
      code: company.code,
      name: company.name,
      contact: company.contact || '',
      phone: company.phone || '',
      address: company.address || '',
      status: company.status,
      logo: company.logo || '',
      sortOrder: company.sortOrder
    });
    setModalVisible(true);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      if (modalMode === 'add') {
        await addLogisticsCompany(formData);
      } else if (currentCompany) {
        await updateLogisticsCompany(currentCompany.id, formData);
      }
      setModalVisible(false);
      loadCompanies();
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  // 删除物流公司
  const handleDelete = async (company: LogisticsCompany) => {
    if (!confirm(`确定要删除物流公司 "${company.name}" 吗？`)) return;
    
    try {
      await deleteLogisticsCompany(company.id);
      loadCompanies();
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  // 切换启用状态
  const toggleStatus = async (company: LogisticsCompany) => {
    try {
      await updateLogisticsCompany(company.id, {
        status: company.status === 1 ? 0 : 1
      });
      loadCompanies();
    } catch (error) {
      console.error('状态更新失败:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* 操作栏 */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          共 {pagination.total} 家物流公司
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg
                   hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          添加物流公司
        </button>
      </div>

      {/* 物流公司列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-12 text-gray-500">加载中...</div>
        ) : companies.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">暂无物流公司</div>
        ) : (
          companies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700
                       hover:shadow-lg transition-all p-6"
            >
              {/* 公司信息 */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                      {company.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-mono">{company.code}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    company.status === 1 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {company.status === 1 ? '启用' : '禁用'}
                  </div>
                </div>

                {company.contact && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    联系人: {company.contact}
                  </div>
                )}

                {company.phone && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    电话: {company.phone}
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  排序: {company.sortOrder}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                <button
                  onClick={() => toggleStatus(company)}
                  className={`flex-1 px-3 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
                    company.status === 1
                      ? 'text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                      : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                  }`}
                  title={company.status === 1 ? '禁用' : '启用'}
                >
                  {company.status === 1 ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleEdit(company)}
                  className="flex-1 px-3 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20
                           rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(company)}
                  className="flex-1 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20
                           rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* 分页 */}
      {pagination.total > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            共 {pagination.total} 条记录
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, current: Math.max(1, prev.current - 1) }))}
              disabled={pagination.current === 1}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
              {pagination.current} / {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
              disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        </div>
      )}

      {/* 添加/编辑模态框 */}
      <AnimatePresence>
        {modalVisible && (
          <>
            {/* 遮罩层 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalVisible(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* 模态框 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* 模态框头部 */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {modalMode === 'add' ? '添加物流公司' : '编辑物流公司'}
                  </h2>
                </div>

                {/* 模态框内容 */}
                <div className="px-6 py-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        公司代码 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                        placeholder="如: SF"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        公司名称 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="如: 顺丰速运"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        联系人
                      </label>
                      <input
                        type="text"
                        value={formData.contact}
                        onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                        placeholder="联系人姓名"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        联系电话
                      </label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="联系电话"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      公司地址
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="公司地址"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        状态
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: Number(e.target.value) }))}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={1}>启用</option>
                        <option value={0}>禁用</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        排序
                      </label>
                      <input
                        type="number"
                        value={formData.sortOrder}
                        onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: Number(e.target.value) }))}
                        placeholder="数字越小越靠前"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Logo地址
                    </label>
                    <input
                      type="text"
                      value={formData.logo}
                      onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                      placeholder="Logo图片URL"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* 模态框底部 */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                  <button
                    onClick={() => setModalVisible(false)}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300
                             rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!formData.code || !formData.name}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg
                             hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
                  >
                    确认
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LogisticsCompanyTab;
