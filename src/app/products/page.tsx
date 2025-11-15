/**
 * 商品管理页面 - 重定向到商品列表
 * 路由: /products
 */
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/products/list');
  }, [router]);
  
  return null;
}
