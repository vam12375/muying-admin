/**
 * 积分管理主视图
 * Points Management Main View
 * 
 * 功能：整合所有积分管理子模块
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Users, Award, Package, ShoppingCart, FileText } from 'lucide-react';
import { PointsViewEnhanced } from './PointsViewEnhanced';
import { PointsRuleView } from './PointsRuleView';
import { PointsProductView } from './PointsProductView';
import { PointsExchangeView } from './PointsExchangeView';
import { PointsOperationLogView } from './PointsOperationLogView';

export function PointsView() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-purple-600" />
              积分管理系统
            </h1>
            <p className="text-slate-600 mt-1">管理用户积分、规则、商品、兑换记录和操作日志</p>
          </div>
        </div>

        {/* Tab导航 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl">
            <TabsTrigger
              value="users"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">用户积分</span>
            </TabsTrigger>
            <TabsTrigger
              value="rules"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">积分规则</span>
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">积分商品</span>
            </TabsTrigger>
            <TabsTrigger
              value="exchanges"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">兑换记录</span>
            </TabsTrigger>
            <TabsTrigger
              value="logs"
              className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">操作日志</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <PointsViewEnhanced />
          </TabsContent>

          <TabsContent value="rules" className="mt-6">
            <PointsRuleView />
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <PointsProductView />
          </TabsContent>

          <TabsContent value="exchanges" className="mt-6">
            <PointsExchangeView />
          </TabsContent>

          <TabsContent value="logs" className="mt-6">
            <PointsOperationLogView />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
