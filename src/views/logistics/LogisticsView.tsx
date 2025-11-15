/**
 * 物流管理视图
 * Logistics Management View
 * 
 * 合并物流列表和物流公司管理两个子模块
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Building } from 'lucide-react';
import LogisticsListTab from '@/views/logistics/LogisticsListTab';
import LogisticsCompanyTab from '@/views/logistics/LogisticsCompanyTab';

type TabType = 'list' | 'company';

const LogisticsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('list');

  const tabs = [
    { id: 'list' as TabType, label: '物流列表', icon: Truck },
    { id: 'company' as TabType, label: '物流公司', icon: Building }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            物流管理
          </h1>
          <p className="text-gray-500 mt-1">管理订单物流信息和物流公司</p>
        </div>
      </motion.div>

      {/* Tab 切换 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-4 font-medium transition-all relative
                  ${isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                
                {/* 活动指示器 */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 内容 */}
        <div className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'list' && <LogisticsListTab />}
            {activeTab === 'company' && <LogisticsCompanyTab />}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LogisticsView;
