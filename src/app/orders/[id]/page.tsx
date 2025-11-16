/**
 * 订单详情页面
 * 路由: /orders/[id]
 */
"use client";

import { use } from 'react';
import { OrderDetailView } from '@/views/orders/OrderDetailView';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Next.js 15: params 是 Promise，需要使用 React.use() 解包
  const { id } = use(params);
  return <OrderDetailView orderId={id} />;
}
