"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Baby, ChevronLeft, ChevronRight, Search, LogOut, ChevronDown } from 'lucide-react';
import { navigationItems } from '@/lib/constants';
import type { NavigationItem } from '@/types/dashboard';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  activeItem: string;
  searchQuery: string;
  onToggleCollapse: () => void;
  onItemClick: (itemId: string) => void;
  onSearchChange: (query: string) => void;
  onLogout?: () => void;
}

export function SidebarNew({
  isOpen,
  isCollapsed,
  activeItem,
  searchQuery,
  onToggleCollapse,
  onItemClick,
  onSearchChange,
  onLogout,
}: SidebarProps) {
  // 展开的菜单项
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['products', 'settings']));

  // 切换子菜单展开状态
  const toggleExpand = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  // 渲染导航项
  const renderNavItem = (item: NavigationItem, level: number = 0) => {
    const Icon = item.icon;
    const isActive = activeItem === item.id;
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <motion.li
        key={item.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.button
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.id);
            } else {
              onItemClick(item.id);
            }
          }}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-200 group relative overflow-hidden
            ${isActive
              ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700"}
            ${isCollapsed ? "justify-center px-2" : ""}
            ${level > 0 ? "ml-4" : ""}`}
          title={isCollapsed ? item.name : undefined}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* 背景动画效果 */}
          {!isActive && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100"
              initial={false}
              transition={{ duration: 0.3 }}
            />
          )}

          <div className="flex items-center space-x-2.5 relative z-10">
            <motion.div
              className="flex items-center justify-center min-w-[24px]"
              whileHover={{ rotate: isActive ? 0 : 12 }}
              transition={{ duration: 0.2 }}
            >
              <Icon
                className={`h-4.5 w-4.5 flex-shrink-0
                  ${isActive ? "text-white" : "text-slate-500 group-hover:text-pink-500 dark:text-slate-400"}`}
              />
            </motion.div>
            {!isCollapsed && (
              <span className={`text-sm ${isActive ? "font-medium" : "font-normal"}`}>
                {item.name}
              </span>
            )}
          </div>

          {!isCollapsed && (
            <div className="flex items-center space-x-2 relative z-10">
              {item.badge && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`px-1.5 py-0.5 text-xs font-medium rounded-full
                    ${isActive
                      ? "bg-white/20 text-white"
                      : "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400"}`}
                >
                  {item.badge}
                </motion.span>
              )}
              {hasChildren && (
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                </motion.div>
              )}
            </div>
          )}

          {/* 折叠状态下的徽章 */}
          {isCollapsed && item.badge && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-pink-500 border-2 border-white dark:border-slate-800 shadow-lg"
            >
              <span className="text-[10px] font-bold text-white">
                {parseInt(item.badge) > 9 ? '9+' : item.badge}
              </span>
            </motion.div>
          )}
        </motion.button>

        {/* 子菜单 */}
        {hasChildren && !isCollapsed && (
          <AnimatePresence>
            {isExpanded && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden space-y-0.5 mt-1"
              >
                {item.children!.map((child) => renderNavItem(child, level + 1))}
              </motion.ul>
            )}
          </AnimatePresence>
        )}
      </motion.li>
    );
  };

  return (
    <motion.div
      initial={false}
      animate={{
        x: isOpen ? 0 : -320,
        width: isCollapsed ? 80 : 288
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 h-full bg-white/80 backdrop-blur-xl border-r border-slate-200/50 z-40 flex flex-col md:translate-x-0 md:static md:z-auto dark:bg-slate-900/80 dark:border-slate-700/50 shadow-xl"
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between p-5 border-b border-slate-200/50 bg-gradient-to-r from-pink-50/50 to-purple-50/50 dark:from-slate-800/50 dark:to-slate-900/50 dark:border-slate-700/50"
        whileHover={{ backgroundColor: "rgba(236, 72, 153, 0.05)" }}
        transition={{ duration: 0.2 }}
      >
        {!isCollapsed && (
          <motion.div
            className="flex items-center space-x-2.5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/30"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Baby className="text-white h-5 w-5" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-800 text-base bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent dark:from-pink-400 dark:to-purple-400">
                母婴商城
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">后台管理系统</span>
            </div>
          </motion.div>
        )}
        {isCollapsed && (
          <motion.div
            className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto shadow-lg shadow-pink-500/30"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Baby className="text-white h-5 w-5" />
          </motion.div>
        )}
        <motion.button
          onClick={onToggleCollapse}
          className="hidden md:flex p-2 rounded-lg hover:bg-white/50 transition-all duration-200 dark:hover:bg-slate-700/50 backdrop-blur-sm"
          aria-label={isCollapsed ? "展开侧边栏" : "收起侧边栏"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            )}
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Search Bar */}
      {!isCollapsed && (
        <motion.div
          className="px-4 py-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="relative group">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg opacity-0 group-focus-within:opacity-20 blur-xl transition-opacity duration-300"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-pink-500 transition-colors duration-200 z-10" />
            <input
              type="text"
              placeholder="搜索功能..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="relative w-full pl-10 pr-4 py-2.5 bg-slate-50/50 backdrop-blur-sm border border-slate-200/50 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-200 dark:bg-slate-800/50 dark:border-slate-700/50 dark:text-slate-100 z-10"
            />
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto custom-scrollbar">
        <motion.ul
          className="space-y-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {navigationItems.map((item) => renderNavItem(item))}
        </motion.ul>
      </nav>

      {/* Bottom Profile Section */}
      <div className="mt-auto border-t border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50">
        <motion.div
          className={`border-b border-slate-200/50 dark:border-slate-700/50 ${isCollapsed ? 'py-3 px-2' : 'p-3'}`}
          whileHover={{ backgroundColor: "rgba(236, 72, 153, 0.05)" }}
        >
          {!isCollapsed ? (
            <motion.div
              className="flex items-center px-3 py-2.5 rounded-lg bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-200 cursor-pointer dark:bg-slate-800/50 dark:hover:bg-slate-700/50 shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="w-9 h-9 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <span className="text-white font-bold text-sm">AD</span>
              </motion.div>
              <div className="flex-1 min-w-0 ml-3">
                <p className="text-sm font-semibold text-slate-800 truncate dark:text-slate-100">Admin User</p>
                <p className="text-xs text-slate-500 truncate dark:text-slate-400">admin@mombaby.com</p>
              </div>
              <motion.div
                className="w-2.5 h-2.5 bg-green-500 rounded-full ml-2 shadow-lg shadow-green-500/50"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.8, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                title="在线"
              />
            </motion.div>
          ) : (
            <div className="flex justify-center">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">AD</span>
                </div>
                <motion.div
                  className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 shadow-lg shadow-green-500/50"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </motion.div>
            </div>
          )}
        </motion.div>
        <div className="p-3">
          <motion.button
            onClick={onLogout}
            className={`w-full flex items-center rounded-lg text-left transition-all duration-200 group relative overflow-hidden
              ${isCollapsed ? "justify-center p-2.5" : "space-x-2.5 px-3 py-2.5"}
              text-red-600 hover:text-white`}
            title={isCollapsed ? "退出登录" : undefined}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-600 opacity-0 group-hover:opacity-100"
              initial={false}
              transition={{ duration: 0.3 }}
            />
            <div className="flex items-center justify-center min-w-[24px] relative z-10">
              <LogOut className="h-4.5 w-4.5 flex-shrink-0" />
            </div>
            {!isCollapsed && <span className="text-sm font-medium relative z-10">退出登录</span>}
          </motion.button>
        </div>
      </div>

      {/* 自定义滚动条样式 */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(203, 213, 225, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(203, 213, 225, 0.8);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.5);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(71, 85, 105, 0.8);
        }
      `}</style>
    </motion.div>
  );
}
