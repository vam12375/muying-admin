"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Search, DollarSign, Package, RefreshCw, Clock, CheckCircle, XCircle } from 'lucide-react';
import { AfterSale } from './types';

const sampleAfterSales: AfterSale[] = [
  { id: "AS-001", orderId: "ORD-001", customerName: "张女士", type: "refund", reason: "商品质量问题", amount: 299.99, status: "pending", date: "2024-01-15" },
  { id: "AS-002", orderId: "ORD-002", customerName: "李先生", type: "return", reason: "不喜欢", amount: 49.99, status: "processing", date: "2024-01-14" },
  { id: "AS-003", orderId: "ORD-003", customerName: "王女士", type: "exchange", reason: "尺寸不合适", amount: 159.99, status: "completed", date: "2024-01-13" },
];

export function AfterSalesView() {
  const [afterSales] = useState<AfterSale[]>(sampleAfterSales);
  const [filterType, setFilterType] = useState<"all" | AfterSale["type"]>("all");

  const filteredData = afterSales.filter(item => filterType === "all" || item.type === filterType);

  const getTypeInfo = (type: AfterSale["type"]) => {
    const info = {
      refund: { label: "退款", icon: DollarSign, color: "from-red-500 to-pink-500" },
      return: { label: "退货", icon: Package, color: "from-orange-500 to-yellow-500" },
      exchange: { label: "换货", icon: RefreshCw, color: "from-blue-500 to-cyan-500" },
    };
    return info[type];
  };

  const getStatusInfo = (status: AfterSale["status"]) => {
    const info = {
      pending: { label: "待处理", icon: Clock, color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30" },
      processing: { label: "处理中", icon: RefreshCw, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30" },
      completed: { label: "已完成", icon: CheckCircle, color: "bg-green-100 text-green-700 dark:bg-green-900/30" },
      rejected: { label: "已拒绝", icon: XCircle, color: "bg-red-100 text-red-700 dark:bg-red-900/30" },
    };
    return info[status];
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">售后管理</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">处理退款、退货和换货申请</p>
      </motion.div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "总申请", value: afterSales.length, icon: Headphones, color: "from-purple-500 to-pink-500" },
          { label: "退款", value: afterSales.filter(a => a.type === "refund").length, icon: DollarSign, color: "from-red-500 to-pink-500" },
          { label: "退货", value: afterSales.filter(a => a.type === "return").length, icon: Package, color: "from-orange-500 to-yellow-500" },
          { label: "换货", value: afterSales.filter(a => a.type === "exchange").length, icon: RefreshCw, color: "from-blue-500 to-cyan-500" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50"
          >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* 筛选按钮 */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
        {(["all", "refund", "return", "exchange"] as const).map((type) => (
          <motion.button
            key={type}
            onClick={() => setFilterType(type)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filterType === type
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
            }`}
          >
            {type === "all" ? "全部" : getTypeInfo(type as AfterSale["type"]).label}
          </motion.button>
        ))}
      </motion.div>

      {/* 售后列表 */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredData.map((item, index) => {
            const typeInfo = getTypeInfo(item.type);
            const statusInfo = getStatusInfo(item.status);
            const TypeIcon = typeInfo.icon;
            const StatusIcon = statusInfo.icon;

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01, y: -2 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${typeInfo.color} flex items-center justify-center shadow-lg`}>
                      <TypeIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100">{item.id}</h3>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                        <p>订单号: {item.orderId}</p>
                        <p>客户: {item.customerName}</p>
                        <p>原因: {item.reason}</p>
                        <p>金额: ¥{item.amount.toFixed(2)}</p>
                        <p className="text-slate-500 dark:text-slate-400">{item.date}</p>
                      </div>
                    </div>
                  </div>
                  {item.status === "pending" && (
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium"
                      >
                        同意
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium"
                      >
                        拒绝
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
