/**
 * GSAP 动画自定义 Hook
 * GSAP Animations Custom Hook
 * 
 * 功能：封装消息管理模块的所有 GSAP 动画逻辑
 * - 数字滚动动画
 * - 卡片入场动画
 * - 悬浮交互动画
 * - 刷新动画
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * 数字滚动动画 Hook
 * 从 0 滚动到目标值，带有弹性缓动效果
 */
export function useCountUpAnimation(
  value: number,
  duration: number = 1.5,
  delay: number = 0
) {
  const elementRef = useRef<HTMLParagraphElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    // 清除之前的动画
    if (animationRef.current) {
      animationRef.current.kill();
    }

    // 创建临时对象用于动画
    const counter = { value: 0 };

    // GSAP 数字滚动动画
    animationRef.current = gsap.to(counter, {
      value: value,
      duration: duration,
      delay: delay,
      ease: 'power3.out',
      onUpdate: () => {
        if (elementRef.current) {
          elementRef.current.textContent = Math.round(counter.value).toString();
        }
      },
      // 数字变化时带有轻微缩放
      onStart: () => {
        gsap.to(elementRef.current, {
          scale: 1.1,
          duration: 0.3,
          ease: 'back.out(1.7)'
        });
      },
      onComplete: () => {
        gsap.to(elementRef.current, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [value, duration, delay]);

  return elementRef;
}

/**
 * 卡片入场动画 Hook
 * 从下方滑入，带有透明度渐变和错峰效果
 */
export function useCardEntranceAnimation(index: number = 0) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    // 设置初始状态
    gsap.set(cardRef.current, {
      y: 50,
      opacity: 0,
      scale: 0.9
    });

    // 入场动画
    gsap.to(cardRef.current, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      delay: index * 0.1, // 错峰延迟
      ease: 'power3.out',
      clearProps: 'all' // 动画完成后清除内联样式
    });
  }, [index]);

  return cardRef;
}

/**
 * 卡片悬浮动画 Hook
 * 鼠标悬浮时的交互效果
 */
export function useCardHoverAnimation() {
  const cardRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const decor = decorRef.current;

    const handleMouseEnter = () => {
      // 卡片上浮
      gsap.to(card, {
        y: -8,
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out'
      });

      // 装饰圆圈旋转和缩放
      if (decor) {
        gsap.to(decor, {
          rotation: 180,
          scale: 1.2,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
    };

    const handleMouseLeave = () => {
      // 恢复原状
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });

      if (decor) {
        gsap.to(decor, {
          rotation: 0,
          scale: 1,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return { cardRef, decorRef };
}

/**
 * 列表项入场动画 Hook
 * 从左侧滑入，带有透明度渐变
 */
export function useListItemAnimation(index: number = 0, trigger: boolean = true) {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!itemRef.current || !trigger) return;

    // 设置初始状态
    gsap.set(itemRef.current, {
      x: -30,
      opacity: 0
    });

    // 入场动画
    gsap.to(itemRef.current, {
      x: 0,
      opacity: 1,
      duration: 0.5,
      delay: index * 0.05, // 轻微错峰
      ease: 'power2.out',
      clearProps: 'all'
    });
  }, [index, trigger]);

  return itemRef;
}

/**
 * 进度条填充动画 Hook
 * 平滑填充进度条
 */
export function useProgressBarAnimation(percentage: number, delay: number = 0) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barRef.current) return;

    gsap.fromTo(
      barRef.current,
      { width: '0%' },
      {
        width: `${percentage}%`,
        duration: 1.2,
        delay: delay,
        ease: 'power2.out'
      }
    );
  }, [percentage, delay]);

  return barRef;
}

/**
 * 刷新动画 Hook
 * 触发数据刷新时的动画效果
 */
export function useRefreshAnimation(trigger: number) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || trigger === 0) return;

    // 轻微的"呼吸"效果
    gsap.fromTo(
      containerRef.current,
      { scale: 0.98, opacity: 0.8 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      }
    );
  }, [trigger]);

  return containerRef;
}

/**
 * 删除动画 Hook
 * 元素删除时的淡出效果
 */
export function useDeleteAnimation(onComplete?: () => void) {
  const elementRef = useRef<HTMLDivElement>(null);

  const triggerDelete = () => {
    if (!elementRef.current) return;

    gsap.to(elementRef.current, {
      opacity: 0,
      scale: 0.8,
      height: 0,
      marginBottom: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        onComplete?.();
      }
    });
  };

  return { elementRef, triggerDelete };
}

/**
 * 图标脉冲动画 Hook
 * 图标的持续脉冲效果
 */
export function useIconPulseAnimation(enabled: boolean = true) {
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!iconRef.current || !enabled) return;

    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    
    tl.to(iconRef.current, {
      scale: 1.1,
      duration: 1,
      ease: 'sine.inOut'
    });

    return () => {
      tl.kill();
    };
  }, [enabled]);

  return iconRef;
}
