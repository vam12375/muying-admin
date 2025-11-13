"use client";

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { motion } from 'framer-motion';

interface BarChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  colors?: string[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  horizontal?: boolean;
  formatter?: (value: number) => string;
}

/**
 * 柱状图组件
 * 基于 Recharts 封装，支持横向/纵向显示
 * 
 * Source: 参考 muying-admin-react 的图表实现
 */
export function BarChart({
  data,
  xKey,
  yKey,
  colors = ['#3182ff', '#4e6fff', '#60a5fa', '#7dd3fc', '#93c5fd', '#c7d2fe', '#ddd6fe'],
  height = 300,
  showGrid = true,
  showLegend = false,
  horizontal = false,
  formatter
}: BarChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      style={{ width: '100%', height }}
    >
      <ResponsiveContainer>
        <RechartsBarChart 
          data={data} 
          layout={horizontal ? 'vertical' : 'horizontal'}
          margin={{ top: 5, right: 20, left: horizontal ? 20 : 0, bottom: 5 }}
        >
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(148, 163, 184, 0.1)"
              horizontal={!horizontal}
              vertical={horizontal}
            />
          )}
          {horizontal ? (
            <>
              <XAxis 
                type="number"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatter}
              />
              <YAxis 
                type="category"
                dataKey={xKey}
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={80}
              />
            </>
          ) : (
            <>
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
            </>
          )}
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
          <Bar 
            dataKey={yKey} 
            radius={[8, 8, 0, 0]}
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
