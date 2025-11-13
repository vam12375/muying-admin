import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 禁用严格模式，避免开发时组件重复渲染
  reactStrictMode: false,
  
  /**
   * API 代理配置
   * 将前端 /admin 开头的请求转发到后端 /api/admin
   * 例如：前端请求 /admin/products -> 后端 http://localhost:8080/api/admin/products
   * 
   * 注意：后端配置了 context-path: /api，所以所有Controller路径都需要加上 /api 前缀
   */
  async rewrites() {
    return [
      {
        source: '/admin/:path*',
        destination: 'http://localhost:8080/api/admin/:path*',
      },
    ];
  },
};

export default nextConfig;
