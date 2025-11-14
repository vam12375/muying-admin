"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, Lock, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  activeItem: string;
  showNotifications: boolean;
  onToggleNotifications: () => void;
  onNavigateToProfile?: () => void;
  onLogout?: () => void;
}

export function Header({ 
  activeItem, 
  showNotifications, 
  onToggleNotifications,
  onNavigateToProfile,
  onLogout 
}: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // 获取用户信息（从localStorage）
  const getUserInfo = () => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('adminUser');
    console.log('[Header] localStorage.adminUser:', userStr);
    if (!userStr) return null;
    try {
      const parsed = JSON.parse(userStr);
      console.log('[Header] Parsed user info:', parsed);
      console.log('[Header] Avatar URL:', parsed?.avatar);
      return parsed;
    } catch (error) {
      console.error('[Header] Failed to parse user info:', error);
      return null;
    }
  };

  // 从后端获取最新的用户信息
  const fetchLatestUserInfo = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/info`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      console.log('[Header] Fetched latest user info:', result);

      if (result.success && result.data) {
        const latestUserInfo = {
          id: result.data.userId,
          username: result.data.username,
          nickname: result.data.nickname,
          avatar: result.data.avatar,
          role: result.data.role
        };
        
        console.log('[Header] Latest avatar URL:', latestUserInfo.avatar);
        
        // 更新 localStorage
        localStorage.setItem('adminUser', JSON.stringify(latestUserInfo));
        
        // 更新状态
        setUserInfo(latestUserInfo);
      }
    } catch (error) {
      console.error('[Header] Failed to fetch latest user info:', error);
    }
  };

  // 初始化用户信息
  useEffect(() => {
    setUserInfo(getUserInfo());
    
    // 首次加载时从后端获取最新用户信息
    fetchLatestUserInfo();
    
    // 定期从后端获取最新用户信息（每30秒）
    const interval = setInterval(() => {
      fetchLatestUserInfo();
    }, 30000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const displayName = userInfo?.nickname || userInfo?.username || 'Admin User';
  const displayRole = userInfo?.role || 'Administrator';
  const avatarInitial = displayName.charAt(0).toUpperCase();

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between dark:bg-slate-800 dark:border-slate-700">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {activeItem.charAt(0).toUpperCase() + activeItem.slice(1)}
        </h1>
      </div>
      <div className="flex items-center space-x-3">
        {/* 通知按钮 */}
        <button
          onClick={onToggleNotifications}
          className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors dark:hover:bg-slate-700"
        >
          <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* 用户信息区域 */}
        <div className="relative" ref={menuRef}>
          {/* 点击头像显示下拉菜单 */}
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer overflow-hidden bg-gradient-to-br from-pink-400 to-purple-500">
              {userInfo?.avatar ? (
                <img 
                  src={userInfo.avatar} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    const sibling = target.nextElementSibling as HTMLElement;
                    if (sibling) sibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <span 
                className="text-white font-medium text-sm w-full h-full flex items-center justify-center"
                style={{ display: userInfo?.avatar ? 'none' : 'flex' }}
              >
                {avatarInitial}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{displayName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{displayRole}</p>
            </div>
          </button>

          {/* 下拉菜单 */}
          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50"
              >
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigateToProfile?.();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>个人中心</span>
                </button>
                
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    // TODO: 实现修改密码功能
                    console.log('修改密码');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Lock className="h-4 w-4" />
                  <span>修改密码</span>
                </button>

                <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout?.();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>退出登录</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
