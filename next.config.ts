import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 禁用严格模式，避免开发时组件重复渲染
  reactStrictMode: false,
  
  /**
   * 图片优化配置
   * Source: 性能优化 - 图片加载优化
   * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
   */
  images: {
    // 允许的外部图片域名
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5173',
        pathname: '/**',
      },
    ],
    // 图片格式优化
    formats: ['image/webp', 'image/avif'],
    // 图片尺寸配置
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 最小化缓存时间
    minimumCacheTTL: 60,
  },

  /**
   * 性能优化配置
   */
  compress: true, // 启用gzip压缩
  poweredByHeader: false, // 移除X-Powered-By头
  
  /**
   * API 代理配置
   * 
   * 后端配置：context-path: /api
   * 后端实际路径：http://localhost:8080/api/admin/*
   * 
   * 前端请求：/admin/orders -> 后端：http://localhost:8080/api/admin/orders
   */
  async rewrites() {
    console.log('Next.js rewrites configuration loaded');
    return [
      {
        source: '/admin/:path*',
        destination: 'http://localhost:8080/api/admin/:path*',
      },
      {
        source: '/products/:path*',
        destination: 'http://localhost:5173/products/:path*',
      },
      {
        source: '/avatars/:path*',
        destination: 'http://localhost:5173/avatars/:path*',
      },
    ];
  },

  /**
   * 响应头优化
   */
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
