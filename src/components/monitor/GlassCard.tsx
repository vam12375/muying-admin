/**
 * 玻璃态卡片组件
 * Glass Morphism Card Component
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export function GlassCard({ children, className, hover = true, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'bg-white/80 dark:bg-slate-800/80',
        'backdrop-blur-xl',
        'border border-white/20 dark:border-slate-700/50',
        'shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50',
        'transition-all duration-300',
        hover && 'hover:shadow-2xl hover:shadow-slate-300/50 dark:hover:shadow-slate-900/70',
        className
      )}
    >
      {/* 光晕效果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
      
      {/* 内容 */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
