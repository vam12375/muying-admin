"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { authApi } from '@/lib/api';
import ClayLoginCard from '@/components/login/ClayLoginCard';
import FluidBackground from '@/components/login/FluidBackground';

// 动态导入Three.js组件，禁用SSR
const ThreeScene = dynamic(() => import('@/components/login/ThreeScene'), { 
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-[#FDFBF7]" />
});

/**
 * 云端育儿室登录页
 * Source: 云端育儿室设计文档 (d.md, ui.md)
 * 遵循协议: AURA-X-KYS
 */
export default function LoginPage() {
  const [error, setError] = useState('');
  const [showTransition, setShowTransition] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const router = useRouter();

  const handleLogin = async (username: string, password: string) => {
    setError('');

    try {
      // 调用后端登录 API
      const response = await authApi.login(username, password);
      
      console.log('后端返回数据:', response);

      const token = response.data?.token;
      const user = response.data?.user;

      if (response.success && token) {
        // 保存 token
        localStorage.setItem('adminToken', token);
        
        // 保存完整的用户信息
        const userInfo = {
          id: user?.id,
          username: user?.username || username,
          nickname: user?.nickname,
          avatar: user?.avatar,
          role: user?.role || 'admin'
        };
        
        localStorage.setItem('adminUser', JSON.stringify(userInfo));
        
        console.log('登录成功，Token 已保存');
        console.log('Token:', token);
        console.log('User Info:', userInfo);
        
        // 不立即跳转，等待动画完成
        return; // 成功后由onSuccess回调处理跳转
      } else {
        console.log('登录失败:', response);
        setError(response.message || '登录失败，请检查用户名和密码');
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('登录错误:', err);
      if (!error) {
        setError('网络错误，请检查后端服务是否启动');
      }
      throw err;
    }
  };

  const handleLoginSuccess = () => {
    // 显示云层拨开转场动画
    setShowTransition(true);
    // 等待转场动画完成后跳转（加快速度）
    setTimeout(() => {
      window.location.href = '/';
    }, 600);
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#FDFBF7]">
      {/* 流体渐变背景层 */}
      <FluidBackground />
      
      {/* 3D 背景层 */}
      <ThreeScene onPasswordFocus={passwordFocused} />

      {/* 云层拨开转场动画 */}
      {showTransition && (
        <>
          {/* 左侧云层 */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: '-100%' }}
            transition={{ 
              duration: 0.6,
              ease: 'easeInOut' 
            }}
            className="fixed top-0 left-0 w-1/2 h-full bg-gradient-to-r from-white to-transparent z-50"
            style={{
              background: 'linear-gradient(to right, #FDFBF7 0%, rgba(253, 251, 247, 0.8) 70%, transparent 100%)'
            }}
          />
          {/* 右侧云层 */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: '100%' }}
            transition={{ 
              duration: 0.6,
              ease: 'easeInOut' 
            }}
            className="fixed top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white to-transparent z-50"
            style={{
              background: 'linear-gradient(to left, #FDFBF7 0%, rgba(253, 251, 247, 0.8) 70%, transparent 100%)'
            }}
          />
          {/* 欢迎文字 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="fixed inset-0 flex items-center justify-center z-[60]"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-bold"
                style={{ color: '#FF9A9E' }}
              >
                欢迎回来！
              </motion.h2>
            </div>
          </motion.div>
        </>
      )}

      {/* 左侧装饰文案 (大屏显示) - 增强版 */}
      <div className="hidden lg:block absolute left-20 bottom-20 text-left pointer-events-none select-none">
        <motion.h2 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-7xl font-black leading-tight tracking-wider" 
          style={{ 
            color: 'rgba(161, 140, 209, 0.15)',
            textShadow: '2px 2px 4px rgba(255, 154, 158, 0.1)'
          }}
        >
          LOVE &<br/>CARE
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-4 text-lg font-semibold"
          style={{ color: 'rgba(255, 154, 158, 0.4)' }}
        >
          暖心守护 · 智慧管理
        </motion.p>
      </div>

      {/* 右侧装饰元素 (大屏显示) */}
      <div className="hidden lg:block absolute right-20 top-20 pointer-events-none select-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-8xl opacity-20"
        >
          🌈
        </motion.div>
      </div>

      {/* 底部装饰小图标 */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-8 pointer-events-none select-none">
        {['🍼', '👶', '🧸', '🎈', '⭐'].map((emoji, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.3, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className="text-3xl"
            style={{
              animation: `float ${3 + index * 0.5}s ease-in-out infinite`,
              animationDelay: `${index * 0.2}s`
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      {/* 登录卡片区域 */}
      <div className="relative z-10 px-4">
        <ClayLoginCard 
          onSubmit={handleLogin} 
          error={error}
          onSuccess={handleLoginSuccess}
          onPasswordFocus={setPasswordFocused}
        />
      </div>

      {/* 添加浮动动画的CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </main>
  );
}
