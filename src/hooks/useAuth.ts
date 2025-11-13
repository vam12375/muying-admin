"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  username: string;
  [key: string]: any;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const token = localStorage.getItem('adminToken');
      const userStr = localStorage.getItem('adminUser');

      console.log('认证检查 - Token:', token ? '存在' : '不存在');
      console.log('当前路径:', pathname);

      if (!token) {
        // 没有 token，且不在登录页，跳转到登录页
        if (pathname !== '/login') {
          console.log('未登录，跳转到登录页');
          router.push('/login');
        }
        setLoading(false);
        return;
      }

      // 有 token，设置用户信息
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
        console.log('用户已登录:', userData.username);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('认证检查失败:', error);
      setLoading(false);
      if (pathname !== '/login') {
        router.push('/login');
      }
    }
  };

  const logout = () => {
    console.log('用户退出登录');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setUser(null);
    router.push('/login');
  };

  return { user, loading, logout };
}
