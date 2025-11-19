/**
 * 会员等级徽章组件 - 带GSAP动画
 * Level Badge Component with GSAP Animation
 * 
 * 功能：不同等级不同颜色和动画效果，金牌会员以上有持续性动画
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

'use client';

import { useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import gsap from 'gsap';

interface LevelBadgeProps {
  level: string | number | undefined;
}

// 等级配置
const getLevelConfig = (level: string | number | undefined) => {
  if (!level) {
    return {
      text: '普通会员',
      levelNum: 1,
      className: 'bg-slate-100 text-slate-700 border-slate-300',
      hasAnimation: false,
    };
  }

  const levelNum = typeof level === 'string' ? parseInt(level) : level;
  
  const configs: Record<number, { text: string; levelNum: number; className: string; hasAnimation: boolean }> = {
    1: {
      text: '普通会员',
      levelNum: 1,
      className: 'bg-gradient-to-r from-slate-200 to-slate-300 text-slate-800 border-slate-400',
      hasAnimation: true,
    },
    2: {
      text: '银牌会员',
      levelNum: 2,
      className: 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900 border-gray-500',
      hasAnimation: true,
    },
    3: {
      text: '金牌会员',
      levelNum: 3,
      className: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-yellow-600',
      hasAnimation: true,
    },
    4: {
      text: '钻石会员',
      levelNum: 4,
      className: 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white border-cyan-600',
      hasAnimation: true,
    },
    5: {
      text: '至尊会员',
      levelNum: 5,
      className: 'bg-gradient-to-r from-purple-500 to-pink-600 text-white border-purple-700',
      hasAnimation: true,
    },
  };

  return configs[levelNum] || {
    text: level.toString(),
    levelNum: 0,
    className: 'bg-slate-100 text-slate-700 border-slate-300',
    hasAnimation: false,
  };
};

export function LevelBadge({ level }: LevelBadgeProps) {
  const badgeRef = useRef<HTMLDivElement>(null);
  const config = getLevelConfig(level);

  useEffect(() => {
    if (!badgeRef.current || !config.hasAnimation) return;

    const badge = badgeRef.current;
    let animation: gsap.core.Tween;

    // 根据不同等级设置不同的动画效果
    if (config.levelNum === 1) {
      // 普通会员：轻微呼吸效果
      animation = gsap.to(badge, {
        boxShadow: '0 0 8px rgba(148, 163, 184, 0.3), 0 0 15px rgba(148, 163, 184, 0.15)',
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    } else if (config.levelNum === 2) {
      // 银牌会员：银色光泽效果
      animation = gsap.to(badge, {
        boxShadow: '0 0 12px rgba(156, 163, 175, 0.5), 0 0 20px rgba(156, 163, 175, 0.25)',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    } else if (config.levelNum === 3) {
      // 金牌会员：脉冲光效
      animation = gsap.to(badge, {
        boxShadow: '0 0 20px rgba(251, 191, 36, 0.8), 0 0 40px rgba(251, 191, 36, 0.4)',
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
      });
    } else if (config.levelNum === 4) {
      // 钻石会员：闪烁光效 + 轻微缩放
      const tl = gsap.timeline({ repeat: -1 });
      tl.to(badge, {
        boxShadow: '0 0 25px rgba(34, 211, 238, 0.9), 0 0 50px rgba(34, 211, 238, 0.5)',
        scale: 1.05,
        duration: 1,
        ease: 'power2.inOut',
      })
      .to(badge, {
        boxShadow: '0 0 10px rgba(34, 211, 238, 0.5), 0 0 20px rgba(34, 211, 238, 0.3)',
        scale: 1,
        duration: 1,
        ease: 'power2.inOut',
      });
      animation = tl;
    } else if (config.levelNum === 5) {
      // 至尊会员：彩虹光效 + 旋转光晕
      const tl = gsap.timeline({ repeat: -1 });
      tl.to(badge, {
        boxShadow: '0 0 30px rgba(168, 85, 247, 0.9), 0 0 60px rgba(236, 72, 153, 0.6)',
        scale: 1.08,
        duration: 0.8,
        ease: 'power2.inOut',
      })
      .to(badge, {
        boxShadow: '0 0 35px rgba(236, 72, 153, 0.9), 0 0 70px rgba(168, 85, 247, 0.6)',
        scale: 1.05,
        duration: 0.8,
        ease: 'power2.inOut',
      })
      .to(badge, {
        boxShadow: '0 0 30px rgba(168, 85, 247, 0.9), 0 0 60px rgba(236, 72, 153, 0.6)',
        scale: 1,
        duration: 0.8,
        ease: 'power2.inOut',
      });
      animation = tl;
    }

    return () => {
      if (animation) {
        animation.kill();
      }
    };
  }, [config.hasAnimation, config.levelNum]);

  return (
    <div ref={badgeRef} className="inline-block">
      <Badge
        variant="outline"
        className={`${config.className} font-semibold transition-all duration-300 ${
          config.hasAnimation ? 'shadow-lg' : ''
        }`}
      >
        {config.text}
      </Badge>
    </div>
  );
}
