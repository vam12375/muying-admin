/**
 * 积分管理占位视图
 * Points Management Placeholder View
 * 
 * 提示用户使用新的子菜单页面
 */

'use client';

import { motion } from 'framer-motion';
import { Award, Package, FileText, Users, ShoppingCart } from 'lucide-react';

export function PointsViewPlaceholder() {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Award className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">积分管理</h2>
        <p className="text-gray-600 mb-8">请从左侧菜单选择具体的管理功能</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg cursor-pointer"
          >
            <Package className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">积分商品</h3>
            <p className="text-xs text-gray-600">管理可兑换商品</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg cursor-pointer"
          >
            <FileText className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">积分规则</h3>
            <p className="text-xs text-gray-600">配置积分规则</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg cursor-pointer"
          >
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">用户积分</h3>
            <p className="text-xs text-gray-600">管理用户积分</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg cursor-pointer"
          >
            <ShoppingCart className="w-8 h-8 text-orange-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">兑换记录</h3>
            <p className="text-xs text-gray-600">查看兑换记录</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
