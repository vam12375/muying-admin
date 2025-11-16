import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 禁用严格模式，避免开发时组件重复渲染
  reactStrictMode: false,
  
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
    ];
  },
};

export default nextConfig;
