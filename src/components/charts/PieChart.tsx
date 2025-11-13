"use client";

import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

interface PieChartProps {
  data: any[];
  nameKey: string;
  valueKey: string;
  colors?: string[];
  height?: number;
  innerRadius?: number;
  showLegend?: boolean;
  formatter?: (value: number) => string;
}

/**
 * 饼图/环形图组件
 * 基于 Recharts 封装，支持环形图显示
 * 
 * Source: 参考 muying-admin-react 的图表实现
 */
export function PieChart({
  data,
  nameKey,
  valueKey,
  colors = ['#3182ff', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4', '#8b5cf6'],
  height = 300,
  innerRadius = 60,
  showLegend = true,
  formatter
}: PieChartProps) {
  // 计算百分比
  const total = data.reduce((sum, item) => sum + item[valueKey], 0);
  
  const renderLabel = (entry: any) => {
    const percent = ((entry[valueKey] / total) * 100).toFixed(0);
    return `${percent}%`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{ width: '100%', height }}
    >
      <ResponsiveContainer>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={80}
            innerRadius={innerRadius}
            dataKey={valueKey}
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            formatter={(value: number) => formatter ? formatter(value) : value}
          />
          {showLegend && (
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => {
                const item = data.find(d => d[nameKey] === value);
                return item ? `${value} (${item[valueKey]})` : value;
              }}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
