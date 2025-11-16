/**
 * 订单流程图组件
 * Source: 基于旧版本订单流程展示
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Package, CreditCard, Truck, CheckCircle, XCircle } from 'lucide-react';
import type { OrderStatus } from '@/types/order';

interface FlowNode {
  key: string;
  title: string;
  time?: string;
  status: 'completed' | 'processing' | 'waiting' | 'failed';
}

interface OrderFlowChartProps {
  currentNodeKey: OrderStatus;
  nodes: FlowNode[];
}

export function OrderFlowChart({ currentNodeKey, nodes }: OrderFlowChartProps) {
  const getIcon = (key: string) => {
    switch (key) {
      case 'created':
        return <Package className="h-5 w-5" />;
      case 'paid':
        return <CreditCard className="h-5 w-5" />;
      case 'shipped':
        return <Truck className="h-5 w-5" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const getNodeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-600 border-green-300';
      case 'processing':
        return 'bg-blue-100 text-blue-600 border-blue-300';
      case 'failed':
        return 'bg-red-100 text-red-600 border-red-300';
      default:
        return 'bg-gray-100 text-gray-400 border-gray-300';
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        {nodes.map((node, index) => (
          <React.Fragment key={node.key}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${getNodeColor(
                  node.status
                )}`}
              >
                {getIcon(node.key)}
              </div>
              <div className="mt-2 text-center">
                <div className="text-sm font-medium text-gray-900">{node.title}</div>
                {node.time && (
                  <div className="text-xs text-gray-500 mt-1">{node.time}</div>
                )}
              </div>
            </motion.div>

            {index < nodes.length - 1 && (
              <div className="flex-1 mx-4">
                <div
                  className={`h-0.5 ${
                    nodes[index + 1].status === 'completed' || nodes[index + 1].status === 'processing'
                      ? 'bg-green-300'
                      : 'bg-gray-200'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
