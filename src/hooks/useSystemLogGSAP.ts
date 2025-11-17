/**
 * 系统日志GSAP动画Hook
 * Source: 自定义实现，使用GSAP创建高性能动画
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function useSystemLogGSAP() {
  const statsCardsRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);

  // 统计卡片动画
  const animateStatsCards = () => {
    if (!statsCardsRef.current) return;
    
    const cards = statsCardsRef.current.querySelectorAll('.stat-card');
    
    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 30,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
      }
    );

    // 数字滚动动画
    cards.forEach((card) => {
      const valueElement = card.querySelector('.stat-value');
      if (valueElement) {
        const finalValue = valueElement.textContent || '0';
        const numericValue = parseFloat(finalValue.replace(/[^0-9.]/g, ''));
        
        if (!isNaN(numericValue)) {
          gsap.from(valueElement, {
            textContent: 0,
            duration: 1.5,
            ease: 'power2.out',
            snap: { textContent: 1 },
            onUpdate: function() {
              const current = gsap.getProperty(valueElement, 'textContent') as number;
              if (finalValue.includes('%')) {
                valueElement.textContent = `${Math.round(current)}%`;
              } else if (finalValue.includes('ms')) {
                valueElement.textContent = `${Math.round(current)}ms`;
              } else {
                valueElement.textContent = Math.round(current).toLocaleString();
              }
            }
          });
        }
      }
    });

    // 卡片悬浮动画
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -8,
          scale: 1.02,
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          duration: 0.3,
          ease: 'power2.out',
        });
      });
    });
  };

  // 表格行动画
  const animateTableRows = () => {
    if (!tableRef.current) return;
    
    const rows = tableRef.current.querySelectorAll('.log-row');
    
    gsap.fromTo(
      rows,
      {
        opacity: 0,
        x: -20,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.out',
      }
    );

    // 行悬浮动画
    rows.forEach((row) => {
      row.addEventListener('mouseenter', () => {
        gsap.to(row, {
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          scale: 1.01,
          duration: 0.2,
          ease: 'power2.out',
        });
      });

      row.addEventListener('mouseleave', () => {
        gsap.to(row, {
          backgroundColor: 'transparent',
          scale: 1,
          duration: 0.2,
          ease: 'power2.out',
        });
      });
    });
  };

  // 筛选器动画
  const animateFilters = () => {
    if (!filtersRef.current) return;
    
    gsap.fromTo(
      filtersRef.current,
      {
        opacity: 0,
        y: -20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      }
    );
  };

  // 刷新动画
  const animateRefresh = (element: HTMLElement) => {
    gsap.to(element, {
      rotation: 360,
      duration: 0.6,
      ease: 'power2.inOut',
    });
  };

  // 删除动画
  const animateDelete = (element: HTMLElement, onComplete: () => void) => {
    gsap.to(element, {
      opacity: 0,
      x: 100,
      scale: 0.8,
      duration: 0.4,
      ease: 'power2.in',
      onComplete,
    });
  };

  // 脉冲动画
  const animatePulse = (element: HTMLElement) => {
    gsap.to(element, {
      scale: 1.1,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    });
  };

  return {
    statsCardsRef,
    tableRef,
    filtersRef,
    animateStatsCards,
    animateTableRows,
    animateFilters,
    animateRefresh,
    animateDelete,
    animatePulse,
  };
}
