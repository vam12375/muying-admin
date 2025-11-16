/**
 * 订单详情页面
 * 路由: /orders/[id]
 */
"use client";

import { OrderDetailView } from '@/views/orders/OrderDetailView';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return <OrderDetailView orderId={params.id} />;
}
