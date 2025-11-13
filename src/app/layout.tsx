import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "母婴商城 - 后台管理系统",
  description: "母婴商城电商平台后台管理系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
