/**
 * 消息统计卡片组件（带 GSAP 动画）
 * Message Statistics Card Component (with GSAP Animations)
 * 
 * 功能：
 * - 数字滚动动画
 * - 卡片入场动画
 * - 悬浮交互动画
 * - 图标脉冲效果
 */

'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { 
  useCountUpAnimation, 
  useCardEntranceAnimation, 
  useCardHoverAnimation,
  useIconPulseAnimation 
} from '@/hooks/useGSAPAnimations';

interface MessageStatCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  gradient: string; // 渐变色类名，如 'from-blue-500 to-blue-600'
  shadowColor: string; // 阴影颜色，如 'shadow-blue-500/20'
  index: number; // 用于错峰动画
  enablePulse?: boolean; // 是否启用图标脉冲动画
}

export function MessageStatCard({
  title,
  value,
  description,
  icon: Icon,
  gradient,
  shadowColor,
  index,
  enablePulse = false
}: MessageStatCardProps) {
  // GSAP 动画 Hooks
  const numberRef = useCountUpAnimation(value, 1.5, index * 0.1 + 0.3);
  const cardRef = useCardEntranceAnimation(index);
  const { cardRef: hoverCardRef, decorRef } = useCardHoverAnimation();
  const iconRef = useIconPulseAnimation(enablePulse);

  // 合并 refs 的回调函数
  const setCardRef = (el: HTMLDivElement | null) => {
    // 将元素同时赋值给两个 ref
    (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    (hoverCardRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
  };

  return (
    <div
      ref={setCardRef}
      className={`group relative bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white shadow-xl ${shadowColor} hover:shadow-2xl transition-shadow duration-300 cursor-pointer`}
      style={{
        // 启用 GPU 加速
        willChange: 'transform',
        transform: 'translateZ(0)'
      }}
    >
      {/* 装饰圆圈 */}
      <div
        ref={decorRef}
        className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"
        style={{
          willChange: 'transform'
        }}
      />

      {/* 卡片内容 */}
      <div className="relative">
        {/* 顶部：图标和数值 */}
        <div className="flex items-center justify-between mb-4">
          {/* 图标容器 */}
          <div
            ref={iconRef}
            className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm"
            style={{
              willChange: 'transform'
            }}
          >
            <Icon className="w-6 h-6" />
          </div>

          {/* 数值显示 */}
          <div className="text-right">
            <p className="text-sm opacity-90">{title}</p>
            <p
              ref={numberRef}
              className="text-3xl font-bold mt-1 tabular-nums"
              style={{
                willChange: 'transform'
              }}
            >
              0
            </p>
          </div>
        </div>

        {/* 底部：描述信息 */}
        <div className="flex items-center text-sm opacity-90">
          <Icon className="w-4 h-4 mr-1" />
          <span>{description}</span>
        </div>
      </div>

      {/* 悬浮时的光晕效果 */}
      <div className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/5 transition-colors duration-300 pointer-events-none" />
    </div>
  );
}
