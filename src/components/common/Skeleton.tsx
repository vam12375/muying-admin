/**
 * 骨架屏组件
 * 
 * 功能：
 * - 提供加载占位符
 * - 改善感知性能
 * - 减少布局偏移（CLS）
 * 
 * Source: 性能优化 - 骨架屏
 * 
 */

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  count = 1,
}: SkeletonProps) {
  const baseClass = 'animate-pulse bg-gray-200 dark:bg-gray-700';
  
  const variantClass = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded',
  }[variant];

  const style = {
    width: width || (variant === 'circular' ? '40px' : '100%'),
    height: height || (variant === 'circular' ? '40px' : undefined),
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${baseClass} ${variantClass} ${className}`}
          style={style}
        />
      ))}
    </>
  );
}

/**
 * 表格骨架屏
 */
export function TableSkeleton({ rows = 5, columns = 5 }) {
  return (
    <div className="space-y-3">
      {/* 表头 */}
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="flex-1" height={40} />
        ))}
      </div>
      {/* 表格行 */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="flex-1" height={60} />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * 卡片骨架屏
 */
export function CardSkeleton({ count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-3">
          <Skeleton variant="circular" width={60} height={60} />
          <Skeleton width="80%" />
          <Skeleton width="60%" />
          <Skeleton width="90%" />
        </div>
      ))}
    </>
  );
}
