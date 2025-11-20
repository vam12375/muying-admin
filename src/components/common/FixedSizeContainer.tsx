/**
 * 固定尺寸容器组件
 * 
 * 功能：
 * - 预设容器尺寸，防止布局偏移
 * - 支持骨架屏占位
 * - 减少CLS（累积布局偏移）
 * 
 * Source: 性能优化 - CLS修复
 * 
 */

import { ReactNode } from 'react';

interface FixedSizeContainerProps {
  width?: string | number;
  height?: string | number;
  minHeight?: string | number;
  children: ReactNode;
  className?: string;
}

export function FixedSizeContainer({
  width,
  height,
  minHeight,
  children,
  className = '',
}: FixedSizeContainerProps) {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
  };

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

/**
 * 表格容器（固定高度）
 */
export function TableContainer({ children, rowHeight = 60, headerHeight = 50, rows = 10 }: {
  children: ReactNode;
  rowHeight?: number;
  headerHeight?: number;
  rows?: number;
}) {
  const totalHeight = headerHeight + (rowHeight * rows);
  
  return (
    <FixedSizeContainer minHeight={totalHeight}>
      {children}
    </FixedSizeContainer>
  );
}

/**
 * 卡片网格容器（固定高度）
 */
export function CardGridContainer({ children, cardHeight = 200, columns = 3, rows = 4 }: {
  children: ReactNode;
  cardHeight?: number;
  columns?: number;
  rows?: number;
}) {
  const totalHeight = (cardHeight + 16) * rows; // 16px gap
  
  return (
    <FixedSizeContainer minHeight={totalHeight}>
      <div className={`grid grid-cols-${columns} gap-4`}>
        {children}
      </div>
    </FixedSizeContainer>
  );
}
