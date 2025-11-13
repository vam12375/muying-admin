"use client";

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface LineChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  color?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  formatter?: (value: number) => string;
}

/**
 * 折线图组件
 * 基于 Recharts 封装，支持动画和自定义样式
 * 
 * Source: 参考 muying-admin-react 的图表实现
 */
export function LineChart({
  data,
  xKey,
  yKey,
  color = '#3182ff',
  height = 300,
  showGrid = true,
  showLegend = false,
  formatter
}: LineChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ width: '100%', height }}
    >
      <ResponsiveContainer>
        <RechartsLineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(148, 163, 184, 0.1)"
              vertical={false}
            />
          )}
          <XAxis 
            dataKey={xKey}
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatter}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            formatter={(value: number) => formatter ? formatter(value) : value}
          />
          {showLegend && <Legend />}
          <Line
            type="monotone"
            dataKey={yKey}
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, r: 4 }}
            activeDot={{ r: 6 }}
            animationDuration={1000}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
