"use client";

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { SidebarNew } from './SidebarNew';
import { Header } from './Header';
import { 
  OverviewView,
  ProductsView,
  BrandsView,
  CategoriesView,
  OrdersView,
  ReviewsView,
  AfterSalesView,
  CouponsView,
  PointsView,
  MessagesView,
  LogisticsView,
  UsersView
} from '@/views';
import RedisView from '@/views/settings/RedisView';
import { SystemMonitorViewEnhanced } from '@/views/monitor/SystemMonitorViewEnhanced';
import { ProfileView } from '@/views/profile/ProfileView';
import type { ViewType } from '@/types/dashboard';
import { useAuth } from '@/hooks/useAuth';

export function AdminDashboard() {
  // 所有 Hooks 必须在任何条件返回之前调用
  const { loading, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedView, setSelectedView] = useState<ViewType>('overview');

  // 初始化时从 localStorage 恢复上次访问的页面
  useEffect(() => {
    const savedActiveItem = localStorage.getItem('admin_active_item');
    const savedView = localStorage.getItem('admin_selected_view');
    
    if (savedActiveItem && savedView) {
      setActiveItem(savedActiveItem);
      setSelectedView(savedView as ViewType);
    }
  }, []);

  // 监听路由变化，保存到 localStorage
  useEffect(() => {
    if (activeItem && selectedView) {
      localStorage.setItem('admin_active_item', activeItem);
      localStorage.setItem('admin_selected_view', selectedView);
    }
  }, [activeItem, selectedView]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleItemClick = (itemId: string) => {
    // 处理退出登录
    if (itemId === 'logout') {
      // 清除保存的路由信息
      localStorage.removeItem('admin_active_item');
      localStorage.removeItem('admin_selected_view');
      logout();
      return;
    }

    setActiveItem(itemId);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
    
    // 映射视图
    const viewMap: Record<string, ViewType> = {
      'dashboard': 'overview',
      'products': 'products',
      'product-list': 'product-list',
      'product-category': 'product-category',
      'brand-management': 'brand-management',
      'product-analytics': 'product-analytics',
      'reviews': 'reviews',
      'orders': 'orders',
      'after-sales': 'after-sales',
      'customers': 'customers',
      'users': 'customers', // 用户管理映射到customers视图
      'coupons': 'coupons',
      'points': 'points',
      'messages': 'messages',
      'logistics': 'logistics',
      'profile': 'profile',
      'settings': 'settings',
      'system-monitor': 'system-monitor',
      'system-config': 'system-config',
      'system-logs': 'system-logs',
      'redis-manage': 'redis-manage',
    };
    
    if (viewMap[itemId]) {
      setSelectedView(viewMap[itemId]);
    }
  };

  // 在所有 Hooks 调用之后才进行条件渲染
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-slate-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Mobile hamburger button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-6 left-6 z-50 p-3 rounded-lg bg-white shadow-md border border-slate-100 md:hidden hover:bg-slate-50 transition-all duration-200 dark:bg-slate-800 dark:border-slate-700"
        aria-label="Toggle sidebar"
      >
        {isOpen ? (
          <X className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        ) : (
          <Menu className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        )}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <SidebarNew
        isOpen={isOpen}
        isCollapsed={isCollapsed}
        activeItem={activeItem}
        searchQuery={searchQuery}
        onToggleCollapse={toggleCollapse}
        onItemClick={handleItemClick}
        onSearchChange={setSearchQuery}
        onLogout={logout}
        onNavigateToProfile={() => handleItemClick('profile')}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <Header
          activeItem={activeItem}
          showNotifications={showNotifications}
          onToggleNotifications={() => setShowNotifications(!showNotifications)}
          onNavigateToProfile={() => handleItemClick('profile')}
          onLogout={logout}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-50 via-pink-50/20 to-purple-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
          <AnimatePresence mode="wait">
            {selectedView === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <OverviewView />
              </motion.div>
            )}
            {selectedView === 'products' && (
              <motion.div key="products" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <ProductsView />
              </motion.div>
            )}
            {selectedView === 'product-list' && (
              <motion.div key="product-list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <ProductsView />
              </motion.div>
            )}
            {selectedView === 'product-category' && (
              <motion.div key="product-category" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <CategoriesView />
              </motion.div>
            )}
            {selectedView === 'brand-management' && (
              <motion.div key="brand-management" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <BrandsView />
              </motion.div>
            )}
            {selectedView === 'product-analytics' && (
              <motion.div key="product-analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">商品分析</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-2">功能开发中...</p>
                </div>
              </motion.div>
            )}
            {selectedView === 'reviews' && (
              <motion.div key="reviews" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <ReviewsView />
              </motion.div>
            )}
            {selectedView === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <OrdersView />
              </motion.div>
            )}
            {selectedView === 'after-sales' && (
              <motion.div key="after-sales" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <AfterSalesView />
              </motion.div>
            )}
            {selectedView === 'customers' && (
              <motion.div key="customers" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <UsersView />
              </motion.div>
            )}
            {selectedView === 'coupons' && (
              <motion.div key="coupons" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <CouponsView />
              </motion.div>
            )}
            {selectedView === 'points' && (
              <motion.div key="points" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <PointsView />
              </motion.div>
            )}
            {selectedView === 'messages' && (
              <motion.div key="messages" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <MessagesView />
              </motion.div>
            )}
            {selectedView === 'logistics' && (
              <motion.div key="logistics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <LogisticsView />
              </motion.div>
            )}
            {selectedView === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <ProfileView />
              </motion.div>
            )}
            {selectedView === 'redis-manage' && (
              <motion.div key="redis-manage" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <RedisView />
              </motion.div>
            )}
            {selectedView === 'system-monitor' && (
              <motion.div key="system-monitor" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <SystemMonitorViewEnhanced />
              </motion.div>
            )}
            {(selectedView === 'settings' || selectedView === 'system-config' || selectedView === 'system-logs') && (
              <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {selectedView === 'settings' && '系统设置'}
                    {selectedView === 'system-config' && '系统配置'}
                    {selectedView === 'system-logs' && '系统日志'}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-2">功能开发中...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
