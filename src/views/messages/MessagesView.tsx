"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Send, Users, Eye, Plus } from 'lucide-react';
import { Message } from './types';

const sampleMessages: Message[] = [
  { id: "MSG-001", title: "新春促销活动", content: "春节期间全场8折优惠", type: "promotion", recipient: "all", status: "sent", date: "2024-01-15", readCount: 856 },
  { id: "MSG-002", title: "订单发货通知", content: "您的订单已发货", type: "order", recipient: "specific", status: "sent", date: "2024-01-14", readCount: 234 },
  { id: "MSG-003", title: "系统维护通知", content: "系统将于今晚进行维护", type: "system", recipient: "all", status: "draft", date: "2024-01-13" },
];

export function MessagesView() {
  const [messages] = useState<Message[]>(sampleMessages);
  const [showModal, setShowModal] = useState(false);

  const getTypeColor = (type: Message["type"]) => {
    const colors = {
      system: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      order: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      promotion: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    };
    return colors[type];
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">消息管理</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">发送和管理系统消息</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium shadow-lg"
        >
          <Plus className="h-5 w-5" />
          新建消息
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "总消息", value: messages.length, icon: Bell, color: "from-purple-500 to-pink-500" },
          { label: "已发送", value: messages.filter(m => m.status === "sent").length, icon: Send, color: "from-green-500 to-emerald-500" },
          { label: "总阅读", value: messages.reduce((sum, m) => sum + (m.readCount || 0), 0), icon: Eye, color: "from-blue-500 to-cyan-500" },
          { label: "覆盖用户", value: "892", icon: Users, color: "from-orange-500 to-yellow-500" },
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

      <div className="space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.01, y: -2 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">{message.title}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor(message.type)}`}>
                    {message.type === "system" ? "系统" : message.type === "order" ? "订单" : "促销"}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    message.status === "sent" 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                  }`}>
                    {message.status === "sent" ? "已发送" : "草稿"}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-2">{message.content}</p>
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <span>发送对象: {message.recipient === "all" ? "全部用户" : "指定用户"}</span>
                  {message.readCount && <span>阅读: {message.readCount}</span>}
                  <span>{message.date}</span>
                </div>
              </div>
              {message.status === "draft" && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg text-sm font-medium"
                >
                  发送
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
