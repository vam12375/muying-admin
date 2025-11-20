/**
 * 物流公司Logo映射组件
 * Logistics Company Logo Mapping Component
 * 
 * 提供主流物流公司的Logo展示
 * 
 */

import React from 'react';
import { Truck, Package, Plane, Ship } from 'lucide-react';

// 物流公司Logo配置（根据数据库中的15家公司）
const COMPANY_LOGOS: Record<string, {
  name: string;
  color: string;
  bgColor: string;
  icon: React.ComponentType<any>;
}> = {
  // 1. 顺丰速运
  'SF': {
    name: '顺丰速运',
    color: '#000000',
    bgColor: '#FFD700',
    icon: Plane
  },
  // 2. 圆通速递
  'YT': {
    name: '圆通速递',
    color: '#0066CC',
    bgColor: '#E6F2FF',
    icon: Truck
  },
  // 3. 中通快递
  'YD': {
    name: '中通快递',
    color: '#00AA00',
    bgColor: '#E6FFE6',
    icon: Package
  },
  // 4. EMS邮政
  'EMS': {
    name: 'EMS邮政',
    color: '#006633',
    bgColor: '#E6F5EC',
    icon: Ship
  },
  // 5. 申通快递
  'STO': {
    name: '申通快递',
    color: '#FF6600',
    bgColor: '#FFF0E6',
    icon: Truck
  },
  // 6. 百世快递
  'BEST': {
    name: '百世快递',
    color: '#0099FF',
    bgColor: '#E6F5FF',
    icon: Package
  },
  // 7. 极兔速递
  'JT': {
    name: '极兔速递',
    color: '#FF1744',
    bgColor: '#FFE6EA',
    icon: Truck
  },
  // 8. 德邦快递
  'DB': {
    name: '德邦快递',
    color: '#FF0000',
    bgColor: '#FFE6E6',
    icon: Truck
  },
  // 9. 中通速递
  'ZJS': {
    name: '中通速递',
    color: '#FF6600',
    bgColor: '#FFF0E6',
    icon: Package
  },
  // 10. 韵达快递
  'HTKY': {
    name: '韵达快递',
    color: '#CC0000',
    bgColor: '#FFE6E6',
    icon: Truck
  },
  // 11. 顺丰快递
  'YZPY': {
    name: '顺丰快递',
    color: '#4A148C',
    bgColor: '#EDE7F6',
    icon: Plane
  },
  // 12. 安能物流
  'ANE': {
    name: '安能物流',
    color: '#2196F3',
    bgColor: '#E3F2FD',
    icon: Package
  },
  // 13. 快捷快递
  'FAST': {
    name: '快捷快递',
    color: '#9C27B0',
    bgColor: '#F3E5F5',
    icon: Truck
  },
  // 兼容旧代码（YTO -> YT）
  'YTO': {
    name: '圆通速递',
    color: '#0066CC',
    bgColor: '#E6F2FF',
    icon: Truck
  },
  // 兼容旧代码（ZTO -> YD）
  'ZTO': {
    name: '中通快递',
    color: '#00AA00',
    bgColor: '#E6FFE6',
    icon: Package
  },
  // 兼容旧代码（JD）
  'JD': {
    name: '京东物流',
    color: '#E3393C',
    bgColor: '#FFE6E6',
    icon: Truck
  },
  // 兼容旧代码（CAINIAO）
  'CAINIAO': {
    name: '菜鸟网络',
    color: '#FF6A00',
    bgColor: '#FFF0E6',
    icon: Package
  },
  // 兼容旧代码（DBKD -> DB）
  'DBKD': {
    name: '德邦快递',
    color: '#FF0000',
    bgColor: '#FFE6E6',
    icon: Truck
  }
};

interface CompanyLogoProps {
  code: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  className?: string;
}

export function CompanyLogo({ 
  code, 
  name, 
  size = 'md', 
  showName = false,
  className = '' 
}: CompanyLogoProps) {
  const config = COMPANY_LOGOS[code.toUpperCase()] || {
    name: name || '未知物流',
    color: '#666666',
    bgColor: '#F5F5F5',
    icon: Truck
  };

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo图标 */}
      <div
        className={`${sizeClasses[size]} rounded-xl flex items-center justify-center
                   shadow-md transition-all duration-300 hover:scale-110 hover:rotate-3`}
        style={{ 
          backgroundColor: config.bgColor,
          border: `2px solid ${config.color}20`
        }}
        data-logo
      >
        <Icon 
          className={iconSizes[size]} 
          style={{ color: config.color }}
        />
      </div>

      {/* 公司名称 */}
      {showName && (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {config.name}
          </span>
          <span className="text-xs text-gray-500 font-mono">
            {code.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * 获取物流公司配置
 */
export function getCompanyConfig(code: string) {
  return COMPANY_LOGOS[code.toUpperCase()] || null;
}

/**
 * 获取所有支持的物流公司
 */
export function getAllCompanies() {
  return Object.entries(COMPANY_LOGOS).map(([code, config]) => ({
    code,
    ...config
  }));
}
