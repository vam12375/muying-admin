/**
 * 商品分析页面
 * 路由: /products/analytics
 * 
 * 注意：此页面暂时显示占位内容，待后续实现完整的数据分析功能
 */
"use client";

import { Card } from '@/components/ui/card';
import { TrendingUp, Package, DollarSign, ShoppingCart } from 'lucide-react';

export default function ProductAnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">商品分析</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            商品销售数据分析与趋势预测
          </p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">总销售额</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
                ¥128,456
              </p>
              <p className="text-xs text-green-600 mt-1">↑ 12.5%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">销售订单</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
                1,234
              </p>
              <p className="text-xs text-green-600 mt-1">↑ 8.3%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">热销商品</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
                89
              </p>
              <p className="text-xs text-green-600 mt-1">↑ 15.2%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">在售商品</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
                567
              </p>
              <p className="text-xs text-slate-500 mt-1">总计</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* 占位提示 */}
      <Card className="p-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            商品分析功能开发中
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            此功能将提供详细的商品销售趋势分析、库存预警、热销商品排行等数据可视化功能
          </p>
        </div>
      </Card>
    </div>
  );
}
