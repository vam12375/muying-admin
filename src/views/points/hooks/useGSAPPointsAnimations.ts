/**
 * GSAP积分管理动画Hook
 * GSAP Points Animations Hook
 * 
 * 功能：封装所有GSAP动画逻辑
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface UseGSAPPointsAnimationsProps {
  statsCardsRef: React.RefObject<HTMLDivElement>;
  userCardsRef: React.RefObject<HTMLDivElement>;
  searchBarRef: React.RefObject<HTMLDivElement>;
}

export function useGSAPPointsAnimations({
  statsCardsRef,
  userCardsRef,
  searchBarRef
}: UseGSAPPointsAnimationsProps) {
  
  // 统计卡片动画
  const animateStatsCards = () => {
    if (!statsCardsRef.current) return;

    const cards = statsCardsRef.current.querySelectorAll('.stat-card');
    
    // 卡片入场动画
    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 50,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)'
      }
    );

    // 数字滚动动画
    cards.forEach((card) => {
      const valueElement = card.querySelector('.stat-value');
      if (valueElement) {
        const target = parseInt(valueElement.getAttribute('data-target') || '0');
        
        gsap.fromTo(
          valueElement,
          { textContent: 0 },
          {
            textContent: target,
            duration: 2,
            ease: 'power2.out',
            snap: { textContent: 1 },
            onUpdate: function() {
              const value = Math.round(parseFloat(this.targets()[0].textContent));
              this.targets()[0].textContent = value.toLocaleString();
            }
          }
        );
      }
    });

    // 悬浮动画
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -8,
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
  };

  // 用户卡片动画
  const animateUserCards = () => {
    if (!userCardsRef.current) return;

    const cards = userCardsRef.current.querySelectorAll('.user-card');
    
    gsap.fromTo(
      cards,
      {
        opacity: 0,
        x: -50,
        rotateY: -15
      },
      {
        opacity: 1,
        x: 0,
        rotateY: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out'
      }
    );

    // 悬浮效果
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.01,
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
  };

  // 刷新动画
  const animateRefresh = () => {
    if (!statsCardsRef.current) return;

    const cards = statsCardsRef.current.querySelectorAll('.stat-card');
    
    // 轻微的脉冲效果
    gsap.to(cards, {
      scale: 1.05,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
      stagger: 0.05
    });

    // 重新触发数字滚动
    setTimeout(() => {
      cards.forEach((card) => {
        const valueElement = card.querySelector('.stat-value');
        if (valueElement) {
          const target = parseInt(valueElement.getAttribute('data-target') || '0');
          const current = parseInt(valueElement.textContent?.replace(/,/g, '') || '0');
          
          gsap.fromTo(
            valueElement,
            { textContent: current },
            {
              textContent: target,
              duration: 1.5,
              ease: 'power2.out',
              snap: { textContent: 1 },
              onUpdate: function() {
                const value = Math.round(parseFloat(this.targets()[0].textContent));
                this.targets()[0].textContent = value.toLocaleString();
              }
            }
          );
        }
      });
    }, 400);
  };

  // 搜索动画
  const animateSearch = () => {
    if (!searchBarRef.current) return;

    gsap.to(searchBarRef.current, {
      scale: 0.98,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    });
  };

  // 页面加载动画
  useEffect(() => {
    // 搜索栏入场动画
    if (searchBarRef.current) {
      gsap.fromTo(
        searchBarRef.current,
        {
          opacity: 0,
          y: -30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          delay: 0.3
        }
      );
    }
  }, []);

  return {
    animateStatsCards,
    animateUserCards,
    animateRefresh,
    animateSearch
  };
}
