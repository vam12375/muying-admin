"use client";

import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Calendar } from 'lucide-react';
import { getOperationTypes, getModules } from '@/lib/api/systemLog';
import type { SystemLogQuery, OperationType } from '@/types/systemLog';

/**
 * 系统日志筛选组件
 * Source: 自定义实现，遵循KISS原则
 */

interface SystemLogFiltersProps {
  onFilter: (filters: SystemLogQuery) => void;
  onReset: () => void;
}

export function SystemLogFilters({ onFilter, onReset }: SystemLogFiltersProps) {
  const [keyword, setKeyword] = useState('');
  const [operationType, setOperationType] = useState('');
  const [module, setModule] = useState('');
  const [operationResult, setOperationResult] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [operationTypes, setOperationTypes] = useState<OperationType[]>([]);
  const [modules, setModules] = useState<string[]>([]);

  // 加载操作类型和模块列表
  useEffect(() => {
    loadOperationTypes();
    loadModules();
  }, []);

  const loadOperationTypes = async () => {
    try {
      const types = await getOperationTypes();
      setOperationTypes(types);
    } catch (error) {
      console.error('加载操作类型失败:', error);
    }
  };

  const loadModules = async () => {
    try {
      const moduleList = await getModules();
      setModules(moduleList);
    } catch (error) {
      console.error('加载模块列表失败:', error);
    }
  };

  const handleSearch = () => {
    const filters: SystemLogQuery = {
      keyword: keyword || undefined,
      operationType: operationType || undefined,
      module: module || undefined,
      operationResult: operationResult || undefined,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
    };
    onFilter(filters);
  };

  const handleReset = () => {
    setKeyword('');
    setOperationType('');
    setModule('');
    setOperationResult('');
    setStartTime('');
    setEndTime('');
    onReset();
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6 dark:bg-slate-800 dark:border-slate-700">
      {/* 基础搜索 */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="搜索操作名称、描述..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
          />
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 dark:border-slate-600 dark:hover:bg-slate-700 dark:text-slate-100"
        >
          <Filter className="h-5 w-5" />
          高级筛选
        </button>
        <button
          onClick={handleSearch}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
        >
          搜索
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors dark:border-slate-600 dark:hover:bg-slate-700 dark:text-slate-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* 高级筛选 */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          {/* 操作类型 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">
              操作类型
            </label>
            <select
              value={operationType}
              onChange={(e) => setOperationType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
            >
              <option value="">全部类型</option>
              {operationTypes.map((type) => (
                <option key={type.code} value={type.code}>
                  {type.description}
                </option>
              ))}
            </select>
          </div>

          {/* 操作模块 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">
              操作模块
            </label>
            <select
              value={module}
              onChange={(e) => setModule(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
            >
              <option value="">全部模块</option>
              {modules.map((mod) => (
                <option key={mod} value={mod}>
                  {mod}
                </option>
              ))}
            </select>
          </div>

          {/* 操作结果 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">
              操作结果
            </label>
            <select
              value={operationResult}
              onChange={(e) => setOperationResult(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
            >
              <option value="">全部结果</option>
              <option value="success">成功</option>
              <option value="failed">失败</option>
            </select>
          </div>

          {/* 开始时间 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">
              开始时间
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
              />
            </div>
          </div>

          {/* 结束时间 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">
              结束时间
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
