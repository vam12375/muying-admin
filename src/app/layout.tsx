import type { Metadata } from "next";
import "./globals.css";
import "../styles/cls-fix.css";
import { ToastProvider } from "@/components/ui/toast";

/**
 * 根布局
 * 
 * 性能优化：
 * - 使用系统字体栈（避免字体加载延迟）
 * - 最小化全局样式
 * - CLS修复样式
 * - 全局Toast通知
 * 
 * Source: 性能优化 - 布局优化
 * 
 */

export const metadata: Metadata = {
  title: "母婴商城管理后台",
  description: "母婴商城管理系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 预连接到API服务器 */}
        <link rel="preconnect" href="http://localhost:8080" />
        <link rel="preconnect" href="http://localhost:5173" />
        {/* DNS预解析 */}
        <link rel="dns-prefetch" href="http://localhost:8080" />
        <link rel="dns-prefetch" href="http://localhost:5173" />
        {/* 字体预加载（使用系统字体，无需加载） */}
        <style dangerouslySetInnerHTML={{
          __html: `
            * {
              font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            }
          `
        }} />
      </head>
      <body className="antialiased" style={{ minHeight: '100vh' }}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
