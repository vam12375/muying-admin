/**
 * 物流管理视图（全新重构版）
 * Logistics Management View (Redesigned)
 * 
 * 特性：现代化Tab切换、GSAP动画、炫酷视觉效果
 * 
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Building, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 space-y-6">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 
                       flex items-center justify-center shadow-lg">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 
                           bg-clip-text text-transparent">
                物流管理
              </h1>
              <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
              管理订单物流信息和物流公司 · 现代化 · 高性能 · 炫酷动画
            </p>
          </div>
        </div>

        {/* 装饰性背景 */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 
                     rounded-full blur-3xl -z-10" />
      </motion.div>

      {/* Tab 切换 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl 
                 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
      >
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 
                     dark:from-gray-800 dark:to-gray-900">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-3 px-8 py-5 font-bold text-lg transition-all relative group
                  ${isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }
                `}
              >
                <div className={`p-2 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg' 
                    : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                }`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                </div>
                <span>{tab.label}</span>
                
                {/* 活动指示器 */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}

                {/* 悬浮光效 */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 -z-10" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 内容 */}
        <div className="p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'list' && <LogisticsListTab />}
            {activeTab === 'company' && <LogisticsCompanyTab />}
          </motion.div>
        </div>
      </motion.div>

      {/* 装饰性浮动元素 */}
      <div className="fixed bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-purple-400/20 
                   rounded-full blur-3xl animate-pulse pointer-events-none" />
    </div>
  );
};

export default LogisticsView;
