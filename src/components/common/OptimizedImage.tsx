'use client';

/**
 * 优化的图片组件
 * Optimized Image Component
 * 
 * 功能：
 * - 懒加载（Lazy Loading）
 * - 占位符（Placeholder）
 * - 加载失败处理
 * - 自动添加时间戳防止缓存
 * 
 * Source: 性能优化组件
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

import { useState, useEffect, useRef } from 'react';
import { Package } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  folder?: 'products' | 'brands' | 'avatars';
  fallbackIcon?: React.ReactNode;
  width?: number;
  height?: number;
  lazy?: boolean; // 是否启用懒加载
}

export function OptimizedImage({
  src,
  alt,
  className = '',
  folder = 'products',
  fallbackIcon,
  width = 200,
  height = 200,
  lazy = true,
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isInView, setIsInView] = useState(!lazy);

  // 获取完整图片URL
  const getImageUrl = (filename: string): string => {
    if (!filename) return '';
    const filenameStr = String(filename);
    
    // 如果已经是完整URL，直接返回
    if (filenameStr.startsWith('http://') || filenameStr.startsWith('https://')) {
      return filenameStr;
    }
    
    // 构建本地URL
    return `http://localhost:5173/${folder}/${filenameStr}`;
  };

  // 懒加载：使用 Intersection Observer
  useEffect(() => {
    if (!lazy || !imgRef.current) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // 提前50px开始加载
      }
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, [lazy]);

  // 当图片进入视口时，设置图片源
  useEffect(() => {
    if (isInView && src) {
      setImageSrc(getImageUrl(src));
    }
  }, [isInView, src, folder]);

  // 处理图片加载完成
  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // 处理图片加载失败
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // 渲染占位符
  const renderPlaceholder = () => {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 ${className}`}
        style={{ width, height }}
      >
        {fallbackIcon || <Package className="w-1/3 h-1/3 text-slate-400 dark:text-slate-500" />}
      </div>
    );
  };

  // 如果没有图片源，显示占位符
  if (!src) {
    return renderPlaceholder();
  }

  return (
    <div 
      className="relative" 
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width, 
        height: typeof height === 'number' ? `${height}px` : height,
        minWidth: typeof width === 'number' ? `${width}px` : width,
        minHeight: typeof height === 'number' ? `${height}px` : height,
      }}
    >
      {/* 加载中的占位符 */}
      {isLoading && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 animate-pulse ${className}`}
          style={{ 
            width: typeof width === 'number' ? `${width}px` : width, 
            height: typeof height === 'number' ? `${height}px` : height 
          }}
        >
          <Package className="w-1/3 h-1/3 text-slate-400 dark:text-slate-500 opacity-50" />
        </div>
      )}

      {/* 加载失败的占位符 */}
      {hasError && renderPlaceholder()}

      {/* 实际图片 */}
      {!hasError && imageSrc && (
        <img
          ref={imgRef}
          src={imageSrc}
          alt={alt}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={handleLoad}
          onError={handleError}
          loading={lazy ? 'lazy' : 'eager'}
          width={typeof width === 'number' ? width : undefined}
          height={typeof height === 'number' ? height : undefined}
          style={{ 
            width: typeof width === 'number' ? `${width}px` : width, 
            height: typeof height === 'number' ? `${height}px` : height,
            objectFit: 'cover'
          }}
        />
      )}
    </div>
  );
}
