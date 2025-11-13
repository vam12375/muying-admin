"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Package, Phone, Globe, TrendingUp } from 'lucide-react';
import { Logistics } from './types';

const sampleLogistics: Logistics[] = [
  { id: "LOG-001", name: "顺丰速运", code: "SF", phone: "95338", website: "www.sf-express.com", status: "active", orderCount: 456 },
  { id: "LOG-002", name: "圆通速递", code: "YTO", phone: "95554", website: "www.yto.net.cn", status: "active", orderCount: 234 },
  { id: "LOG-003", name: "中通快递", code: "ZTO", phone: "95311", website: "www.zto.com", status: "active", orderCount: 189 },
  { id: "LOG-004", name: "韵达快递", code: "YD", phone: "95546", website: "www.yundaex.com", status: "inactive", orderCount: 0 },
];

export function LogisticsView() {
  const [logistics] = useState<Logistics[]>(sampleLogistics);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">物流管理</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">管理物流公司和配送信息</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "物流公司", value: logistics.length, icon: Truck, color: "from-blue-500 to-cyan-500" },
          { label: "活跃中", value: logistics.filter(l => l.status === "active").length, icon: TrendingUp, color: "from-green-500 to-emerald-500" },
          { label: "总订单", value: logistics.reduce((sum, l) => sum + l.orderCount, 0), icon: Package, color: "from-purple-500 to-pink-500" },
          { label: "配送中", value: "156", icon: Truck, color: "from-orange-500 to-yellow-500" },
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {logistics.map((company, index) => (
          <motion.div
            key={company.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${
                  company.status === "active" ? "from-blue-500 to-cyan-500" : "from-slate-400 to-slate-500"
                } flex items-center justify-center shadow-lg`}>
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">{company.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">代码: {company.code}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                company.status === "active"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
              }`}>
                {company.status === "active" ? "活跃" : "未激活"}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>{company.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Globe className="h-4 w-4 text-slate-400" />
                <span>{company.website}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Package className="h-4 w-4 text-slate-400" />
                <span>订单数: {company.orderCount}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg text-sm font-medium"
                >
                  编辑
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium"
                >
                  {company.status === "active" ? "停用" : "启用"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
