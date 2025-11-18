"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Baby, ChevronLeft, ChevronRight, Search, LogOut } from 'lucide-react';
import { navigationItems } from '@/lib/constants';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  activeItem: string;
  searchQuery: string;
  onToggleCollapse: () => void;
  onItemClick: (itemId: string) => void;
  onSearchChange: (query: string) => void;
}

export function Sidebar({
  isOpen,
  isCollapsed,
  activeItem,
  searchQuery,
  onToggleCollapse,
  onItemClick,
  onSearchChange,
}: SidebarProps) {
  const router = useRouter();
  
  // 子菜单展开状态管理
  const [expandedMenus, setExpandedMenus] = React.useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar_expanded_menus');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });

  // 切换子菜单展开状态
  const toggleMenu = (menuId: string) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(menuId)) {
      newExpanded.delete(menuId);
    } else {
      newExpanded.add(menuId);
    }
    setExpandedMenus(newExpanded);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar_expanded_menus', JSON.stringify(Array.from(newExpanded)));
    }
  };

  // 处理子菜单点击
  const handleChildClick = (child: any) => {
    if (child.href) {
      // 使用 Next.js 路由导航，不会刷新整个页面
      router.push(child.href);
    } else {
      onItemClick(child.id);
    }
  };
  return (
    <motion.div
      initial={false}
      animate={{
        x: isOpen ? 0 : -320,
        width: isCollapsed ? 112 : 288
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 h-full bg-white border-r border-slate-200 z-40 flex flex-col md:translate-x-0 md:static md:z-auto dark:bg-slate-800 dark:border-slate-700"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50/60 dark:bg-slate-900/30 dark:border-slate-700">
        {!isCollapsed && (
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
              <Baby className="text-white h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-800 text-base dark:text-slate-100">母婴商城</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">后台管理系统</span>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto shadow-sm">
            <Baby className="text-white h-5 w-5" />
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 rounded-md hover:bg-slate-100 transition-all duration-200 dark:hover:bg-slate-700"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          )}
        </button>
      </div>

      {/* Search Bar */}
      {!isCollapsed && (
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-100"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <ul className="space-y-0.5">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedMenus.has(item.id);
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    if (hasChildren) {
                      toggleMenu(item.id);
                    } else {
                      onItemClick(item.id);
                    }
                  }}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-md text-left transition-all duration-200 group
                    ${isActive
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700"}
                    ${isCollapsed ? "justify-center px-2" : ""}`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <div className="flex items-center justify-center min-w-[24px]">
                    <Icon
                      className={`h-4.5 w-4.5 flex-shrink-0
                        ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-700 dark:text-slate-400"}`}
                    />
                  </div>
                  {!isCollapsed && (
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-sm ${isActive ? "font-medium" : "font-normal"}`}>
                        {item.name}
                      </span>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full
                            ${isActive
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {hasChildren && (
                          <ChevronRight
                            className={`h-3.5 w-3.5 transition-transform duration-200 ${
                              isExpanded ? 'rotate-90' : ''
                            } ${isActive ? 'text-white' : 'text-slate-400'}`}
                          />
                        )}
                      </div>
                    </div>
                  )}
                  {isCollapsed && item.badge && (
                    <div className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center rounded-full bg-pink-500 border border-white">
                      <span className="text-[10px] font-medium text-white">
                        {parseInt(item.badge) > 9 ? '9+' : item.badge}
                      </span>
                    </div>
                  )}
                </button>
                
                {/* 子菜单 */}
                {hasChildren && isExpanded && !isCollapsed && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-1 ml-6 space-y-0.5 border-l-2 border-slate-200 dark:border-slate-700 pl-3"
                  >
                    {item.children!.map((child) => {
                      const ChildIcon = child.icon;
                      const isChildActive = activeItem === child.id;
                      return (
                        <li key={child.id}>
                          <button
                            onClick={() => handleChildClick(child)}
                            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-left transition-all duration-200 group
                              ${isChildActive
                                ? "bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700"}`}
                          >
                            <ChildIcon className={`h-3.5 w-3.5 flex-shrink-0 ${isChildActive ? 'text-pink-600 dark:text-pink-400' : 'text-slate-400'}`} />
                            <span className={`text-sm ${isChildActive ? 'font-medium' : 'font-normal'}`}>
                              {child.name}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Profile Section */}
      <div className="mt-auto border-t border-slate-200 dark:border-slate-700">
        <div className={`border-b border-slate-200 bg-slate-50/30 dark:bg-slate-900/30 dark:border-slate-700 ${isCollapsed ? 'py-3 px-2' : 'p-3'}`}>
          {!isCollapsed ? (
            <div className="flex items-center px-3 py-2 rounded-md bg-white hover:bg-slate-50 transition-colors duration-200 dark:bg-slate-800 dark:hover:bg-slate-700">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">AD</span>
              </div>
              <div className="flex-1 min-w-0 ml-2.5">
                <p className="text-sm font-medium text-slate-800 truncate dark:text-slate-100">Admin User</p>
                <p className="text-xs text-slate-500 truncate dark:text-slate-400">admin@mombaby.com</p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full ml-2" title="Online" />
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">AD</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800" />
              </div>
            </div>
          )}
        </div>
        <div className="p-3">
          <button
            onClick={() => onItemClick("logout")}
            className={`w-full flex items-center rounded-md text-left transition-all duration-200 group text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20
              ${isCollapsed ? "justify-center p-2.5" : "space-x-2.5 px-3 py-2.5"}`}
            title={isCollapsed ? "退出登录" : undefined}
          >
            <div className="flex items-center justify-center min-w-[24px]">
              <LogOut className="h-4.5 w-4.5 flex-shrink-0 text-red-500 group-hover:text-red-600" />
            </div>
            {!isCollapsed && <span className="text-sm">退出登录</span>}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
