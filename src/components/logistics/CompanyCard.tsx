/**
 * 物流公司卡片组件
 * Logistics Company Card Component
 * 
 * 带Logo动画的公司卡片
 * 
 */

'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Edit, Trash2, Power, PowerOff, Phone, MapPin } from 'lucide-react';
import { useLogisticsGSAP } from '@/hooks/useLogisticsGSAP';
import { CompanyLogo } from './CompanyLogoMap';
import type { LogisticsCompany } from '@/types/logistics';

interface CompanyCardProps {
  company: LogisticsCompany;
  onEdit?: (company: LogisticsCompany) => void;
  onDelete?: (company: LogisticsCompany) => void;
  onToggleStatus?: (company: LogisticsCompany) => void;
  delay?: number;
}

export function CompanyCard({ 
  company, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  delay = 0 
}: CompanyCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const { animateLogo, animateCardHover } = useLogisticsGSAP();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (logoRef.current) {
      animateLogo(logoRef.current, delay);
    }
  }, [delay]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (cardRef.current) {
      animateCardHover(cardRef.current, true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (cardRef.current) {
      animateCardHover(cardRef.current, false);
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 
                 dark:border-gray-700 p-5 overflow-hidden group"
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform'
      }}
    >
      {/* 背景装饰 */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0
                   transition-opacity duration-500 ${isHovered ? 'opacity-10' : ''}`}
        style={{
          background: company.status === 1 
            ? 'linear-gradient(135deg, #10b981, transparent)' 
            : 'linear-gradient(135deg, #6b7280, transparent)'
        }}
      />

      {/* 内容 */}
      <div className="relative z-10 space-y-3">
        {/* 头部：Logo居中 + 状态 */}
        <div className="flex flex-col items-center">
          <div ref={logoRef} className="mb-3">
            <CompanyLogo 
              code={company.code} 
              name={company.name}
              size="lg"
            />
          </div>

          {/* 公司名称 */}
          <h3 className="font-bold text-base text-gray-900 dark:text-gray-100 text-center mb-1">
            {company.name}
          </h3>

          {/* 状态标签 */}
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm
                       transition-all duration-300 ${
              company.status === 1
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {company.status === 1 ? '✓ 启用' : '✕ 禁用'}
          </div>
        </div>

        {/* 公司代码 */}
        <div className="text-center">
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-mono text-gray-600 dark:text-gray-400">
            {company.code}
          </span>
        </div>

        {/* 简化信息显示 */}
        {(company.contact || company.phone) && (
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Phone className="w-3 h-3" />
            <span className="truncate">{company.contact || company.phone}</span>
          </div>
        )}

        {/* 分隔线 */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />

        {/* 操作按钮 - 紧凑布局 */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => onToggleStatus?.(company)}
            className={`p-2 rounded-lg font-medium text-xs
                       transition-all duration-300 flex items-center justify-center
                       ${company.status === 1
                         ? 'bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-900/20'
                         : 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20'
                       }`}
            title={company.status === 1 ? '禁用' : '启用'}
          >
            {company.status === 1 ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => onEdit?.(company)}
            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100
                     dark:bg-blue-900/20 rounded-lg font-medium text-xs
                     transition-all duration-300 flex items-center justify-center"
            title="编辑"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onDelete?.(company)}
            className="p-2 bg-red-50 text-red-600 hover:bg-red-100
                     dark:bg-red-900/20 rounded-lg font-medium text-xs
                     transition-all duration-300 flex items-center justify-center"
            title="删除"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 悬浮光效 */}
      {isHovered && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent
                     pointer-events-none"
        />
      )}
    </div>
  );
}
