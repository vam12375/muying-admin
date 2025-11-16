/**
 * 物流管理GSAP动画Hook
 * Logistics GSAP Animations Hook
 * 
 * 封装所有物流模块的GSAP动画逻辑
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function useLogisticsGSAP() {
  /**
   * 统计卡片动画：数字从0滚动到目标值
   */
  const animateStatCard = (element: HTMLElement, targetValue: number, duration = 1.5) => {
    const counter = { value: 0 };
    const numberElement = element.querySelector('[data-counter]');
    
    if (!numberElement) return;

    gsap.to(counter, {
      value: targetValue,
      duration,
      ease: 'power3.out',
      onUpdate: () => {
        numberElement.textContent = Math.floor(counter.value).toString();
      }
    });

    // 卡片入场动画
    gsap.from(element, {
      opacity: 0,
      y: 30,
      scale: 0.95,
      duration: 0.6,
      ease: 'back.out(1.7)'
    });
  };

  /**
   * 物流卡片列表stagger动画
   */
  const animateLogisticsCards = (elements: HTMLElement[]) => {
    gsap.from(elements, {
      opacity: 0,
      y: 50,
      scale: 0.9,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power3.out',
      clearProps: 'all'
    });
  };

  /**
   * 卡片悬浮3D效果
   */
  const animateCardHover = (element: HTMLElement, isHovering: boolean) => {
    if (isHovering) {
      gsap.to(element, {
        y: -8,
        scale: 1.02,
        rotationX: 5,
        rotationY: 5,
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        duration: 0.3,
        ease: 'power2.out'
      });
    } else {
      gsap.to(element, {
        y: 0,
        scale: 1,
        rotationX: 0,
        rotationY: 0,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  /**
   * Logo弹性缩放动画
   */
  const animateLogo = (element: HTMLElement, delay = 0) => {
    gsap.from(element, {
      scale: 0,
      rotation: -180,
      opacity: 0,
      duration: 0.8,
      delay,
      ease: 'elastic.out(1, 0.5)'
    });
  };

  /**
   * 状态标签脉冲动画
   */
  const animateStatusBadge = (element: HTMLElement) => {
    gsap.to(element, {
      scale: 1.1,
      duration: 0.6,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });
  };

  /**
   * 追踪时间轴动画
   */
  const animateTimeline = (elements: HTMLElement[]) => {
    // 追踪点依次滑入
    gsap.from(elements, {
      x: -50,
      opacity: 0,
      duration: 0.5,
      stagger: 0.15,
      ease: 'power2.out'
    });

    // 连接线绘制效果
    const lines = elements.map(el => el.querySelector('[data-line]')).filter(Boolean);
    gsap.from(lines, {
      scaleY: 0,
      transformOrigin: 'top',
      duration: 0.4,
      stagger: 0.15,
      ease: 'power2.inOut'
    });
  };

  /**
   * 包裹图标沿路径移动
   */
  const animatePackageMove = (element: HTMLElement, path: string) => {
    gsap.to(element, {
      motionPath: {
        path,
        align: path,
        autoRotate: true
      },
      duration: 3,
      ease: 'power1.inOut',
      repeat: -1
    });
  };

  /**
   * 模态框缩放展开动画
   */
  const animateModal = (element: HTMLElement, isOpen: boolean) => {
    if (isOpen) {
      gsap.fromTo(element,
        {
          scale: 0.8,
          opacity: 0,
          y: 50
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'back.out(1.7)'
        }
      );
    } else {
      gsap.to(element, {
        scale: 0.8,
        opacity: 0,
        y: 50,
        duration: 0.3,
        ease: 'power2.in'
      });
    }
  };

  /**
   * 刷新动画
   */
  const animateRefresh = (elements: HTMLElement[]) => {
    gsap.to(elements, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      stagger: 0.05,
      onComplete: () => {
        gsap.to(elements, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: 'back.out(1.7)'
        });
      }
    });
  };

  /**
   * 搜索框聚焦动画
   */
  const animateSearchFocus = (element: HTMLElement, isFocused: boolean) => {
    if (isFocused) {
      gsap.to(element, {
        scale: 1.02,
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)',
        duration: 0.2,
        ease: 'power2.out'
      });
    } else {
      gsap.to(element, {
        scale: 1,
        boxShadow: '0 0 0 0px rgba(59, 130, 246, 0)',
        duration: 0.2,
        ease: 'power2.out'
      });
    }
  };

  /**
   * 按钮点击波纹效果
   */
  const animateButtonClick = (element: HTMLElement, x: number, y: number) => {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: translate(-50%, -50%);
      pointer-events: none;
    `;
    element.appendChild(ripple);

    gsap.to(ripple, {
      width: 100,
      height: 100,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => ripple.remove()
    });
  };

  /**
   * 进度条填充动画
   */
  const animateProgressBar = (element: HTMLElement, progress: number) => {
    gsap.to(element, {
      width: `${progress}%`,
      duration: 1,
      ease: 'power2.out'
    });
  };

  return {
    animateStatCard,
    animateLogisticsCards,
    animateCardHover,
    animateLogo,
    animateStatusBadge,
    animateTimeline,
    animatePackageMove,
    animateModal,
    animateRefresh,
    animateSearchFocus,
    animateButtonClick,
    animateProgressBar
  };
}

/**
 * 自动播放动画的Hook
 */
export function useAutoAnimate(
  ref: React.RefObject<HTMLElement>,
  animationFn: (element: HTMLElement) => void,
  deps: any[] = []
) {
  useEffect(() => {
    if (ref.current) {
      animationFn(ref.current);
    }
  }, deps);
}
