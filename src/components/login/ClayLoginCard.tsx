'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { User, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import Mascot from './Mascot';

/**
 * 黏土风格登录卡片组件 - 云端育儿室版本
 * Source: 云端育儿室设计文档 (d.md, ui.md)
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 * 
 * 设计特点：
 * - 黏土拟态 (Claymorphism) 风格
 * - 马卡龙色系配色
 * - 流畅的弹性动画
 * - 吉祥物交互反馈
 */

interface ClayLoginCardProps {
  onSubmit: (username: string, password: string) => Promise<void>;
  error?: string;
  onSuccess?: () => void;
  onPasswordFocus?: (isFocused: boolean) => void; // 通知父组件密码框焦点状态
}

export default function ClayLoginCard({ onSubmit, error, onSuccess, onPasswordFocus }: ClayLoginCardProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 处理密码框焦点变化
  const handlePasswordFocus = (isFocused: boolean) => {
    onPasswordFocus?.(isFocused);
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 基本验证
    if (!username.trim() || !password.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(username, password);
      // 登录成功，触发气球飞走动画
      setIsSuccess(true);
      // 等待动画完成后执行回调（加快跳转速度）
      setTimeout(() => {
        onSuccess?.();
      }, 600);
    } catch (err) {
      setIsLoading(false);
      // 登录失败，触发抖动动画
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  // 切换密码可见性
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <motion.div 
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={
        isSuccess 
          ? { 
              opacity: 0, 
              y: -1000, 
              scale: 0.5,
              rotate: 15,
              transition: { 
                duration: 0.6,
                ease: [0.34, 1.56, 0.64, 1]
              }
            }
          : shake
          ? {
              x: [0, -10, 10, -10, 10, 0],
              transition: { duration: 0.5 }
            }
          : { opacity: 1, y: 0, scale: 1, x: 0 }
      }
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="relative z-10 w-full max-w-md p-10 rounded-[35px]"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.88) 100%)',
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)',
        border: '2px solid rgba(255, 255, 255, 0.6)',
        boxShadow: `
          20px 20px 60px rgba(200, 200, 200, 0.3),
          -20px -20px 60px rgba(255, 255, 255, 0.8),
          inset 2px 2px 5px rgba(255, 255, 255, 1),
          0 8px 32px rgba(255, 154, 158, 0.15)
        `
      }}
    >
      {/* 2D吉祥物 - 躲猫猫的小熊 */}
      <Mascot 
        isPasswordFocused={password.length > 0 && document.activeElement?.getAttribute('type') === 'password'}
        isSuccess={isSuccess}
        hasError={!!error}
      />
      {/* 标题区 - 增强版 */}
      <div className="text-center mb-10">
        <motion.div 
          initial={{ scale: 0, rotate: -180 }} 
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.2, 
            type: "spring", 
            stiffness: 200,
            damping: 15
          }}
          whileHover={{ 
            scale: 1.1, 
            rotate: [0, -10, 10, -10, 0],
            transition: { duration: 0.5 }
          }}
          className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-[28px] cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 50%, #FFC3A0 100%)',
            boxShadow: `
              0 10px 30px rgba(255, 154, 158, 0.5),
              inset 0 2px 0 rgba(255, 255, 255, 0.6),
              inset 0 -2px 8px rgba(255, 154, 158, 0.3)
            `
          }}
        >
          <motion.span 
            className="text-6xl"
            animate={{ 
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🍼
          </motion.span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl font-black mb-3 tracking-wide" 
          style={{ 
            background: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 50%, #A18CD1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 2px 10px rgba(255, 154, 158, 0.2)'
          }}
        >
          BabyCare
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm font-semibold opacity-60" 
          style={{ color: '#A18CD1' }}
        >
          母婴商城智能管理后台
        </motion.p>
        
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-4 h-1 w-20 mx-auto rounded-full"
          style={{
            background: 'linear-gradient(90deg, #FF9A9E 0%, #FECFEF 50%, #A18CD1 100%)'
          }}
        />
      </div>

      {/* 错误提示 - 增强版 */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              x: [0, -5, 5, -5, 5, 0]
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="mb-6 p-4 rounded-[20px] relative overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.12) 0%, rgba(255, 154, 158, 0.18) 100%)',
              border: '2px solid rgba(255, 107, 107, 0.3)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 15px rgba(255, 107, 107, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
            }}
          >
            {/* 装饰性背景动画 */}
            <motion.div
              className="absolute inset-0 opacity-20"
              animate={{
                background: [
                  'linear-gradient(45deg, transparent 30%, rgba(255, 107, 107, 0.3) 50%, transparent 70%)',
                  'linear-gradient(225deg, transparent 30%, rgba(255, 107, 107, 0.3) 50%, transparent 70%)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <p className="text-sm font-semibold relative z-10 flex items-center gap-2" style={{ color: '#FF6B6B' }}>
              <span className="text-lg">⚠️</span>
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="space-y-2">
          <label className="text-sm font-semibold ml-1" style={{ color: '#6B7280' }}>管理员账号</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors" style={{ color: '#FF9A9E' }} />
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full py-4 pl-12 pr-4 rounded-2xl text-gray-700 transition-all duration-300 focus:outline-none"
              style={{ 
                background: 'rgba(255, 255, 255, 0.6)',
                border: '1px solid rgba(255, 154, 158, 0.2)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
              }}
              onFocus={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                e.target.style.borderColor = 'rgba(255, 154, 158, 0.5)';
                e.target.style.boxShadow = '0 4px 16px rgba(255, 154, 158, 0.2), 0 0 0 3px rgba(255, 154, 158, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.6)';
                e.target.style.borderColor = 'rgba(255, 154, 158, 0.2)';
                e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
              }}
              placeholder="请输入ID"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold ml-1" style={{ color: '#6B7280' }}>安全密码</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors z-10" style={{ color: '#FF9A9E' }} />
            <input 
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => handlePasswordFocus(true)}
              onBlur={() => handlePasswordFocus(false)}
              className="w-full py-4 pl-12 pr-12 rounded-2xl text-gray-700 transition-all duration-300 focus:outline-none"
              style={{ 
                background: 'rgba(255, 255, 255, 0.6)',
                border: '1px solid rgba(255, 154, 158, 0.2)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
              }}
              onFocusCapture={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                e.target.style.borderColor = 'rgba(255, 154, 158, 0.5)';
                e.target.style.boxShadow = '0 4px 16px rgba(255, 154, 158, 0.2), 0 0 0 3px rgba(255, 154, 158, 0.1)';
              }}
              onBlurCapture={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.6)';
                e.target.style.borderColor = 'rgba(255, 154, 158, 0.2)';
                e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
              }}
              placeholder="••••••••"
            />
            {/* 密码可见性切换按钮 */}
            <motion.button
              type="button"
              onClick={togglePasswordVisibility}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-1 rounded-lg transition-colors"
              style={{ color: '#A18CD1' }}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        <motion.button
          whileHover={{ 
            scale: isLoading ? 1 : 1.02,
            y: isLoading ? 0 : -2
          }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full py-4 mt-8 text-white font-bold text-lg rounded-[22px] flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden"
          style={{
            background: isLoading 
              ? 'linear-gradient(135deg, #A18CD1 0%, #FBC2EB 100%)'
              : 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 50%, #FFC3A0 100%)',
            boxShadow: isLoading
              ? '0 8px 24px rgba(161, 140, 209, 0.4)'
              : '0 8px 24px rgba(255, 154, 158, 0.4), 0 4px 12px rgba(254, 207, 239, 0.3)',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            cursor: isLoading ? 'wait' : 'pointer',
            opacity: isLoading ? 0.9 : 1
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 154, 158, 0.5), 0 6px 16px rgba(254, 207, 239, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 154, 158, 0.4), 0 4px 12px rgba(254, 207, 239, 0.3)';
            }
          }}
        >
          {/* 光泽效果 */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, transparent 50%, rgba(255, 255, 255, 0.3) 100%)'
            }}
          />
          
          {/* 加载时的流动光效 */}
          {isLoading && (
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
                  'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)'
                ],
                x: ['-100%', '200%']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          )}

          <span className="relative z-10 flex items-center gap-2">
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-5 h-5" />
                </motion.div>
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  正在连接云端...
                </motion.span>
              </>
            ) : (
              <>
                <span>🔐</span>
                安全登录
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </span>
        </motion.button>
      </form>

      {/* 底部辅助链接 - 增强版 */}
      <div className="mt-8 flex justify-between items-center text-sm px-2">
        <motion.a 
          href="#" 
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
          className="transition-all duration-300 font-medium flex items-center gap-1"
          style={{ color: '#A18CD1' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#FF9A9E'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#A18CD1'}
        >
          <span>🔑</span> 忘记密码?
        </motion.a>
        <motion.a 
          href="#" 
          whileHover={{ scale: 1.05, x: 2 }}
          whileTap={{ scale: 0.95 }}
          className="transition-all duration-300 font-medium flex items-center gap-1"
          style={{ color: '#A18CD1' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#FF9A9E'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#A18CD1'}
        >
          申请权限 <span>✨</span>
        </motion.a>
      </div>

      {/* 装饰元素 - 漂浮的小图标 */}
      <motion.div
        className="absolute -top-8 -left-8 text-4xl pointer-events-none select-none"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 10, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        🧸
      </motion.div>
      
      <motion.div
        className="absolute -bottom-6 -right-6 text-3xl pointer-events-none select-none"
        animate={{
          y: [0, -10, 0],
          rotate: [0, -10, 0]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        🎈
      </motion.div>
    </motion.div>
  );
}
