/**
 * 仪表盘概览视图 - 增强版
 * Dashboard Overview View - Enhanced
 * 
 * 现代化、炫酷的仪表盘设计，包含：
 * - 动画统计卡片
 * - 多种图表展示
 * - 最近订单和热门商品
 * - 渐变色和玻璃态效果
 * 
 * Source: 21st.dev MCP + 现有 API 集成
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import {
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LabelList,
} from "recharts";
import { dashboardApi, ordersApi, productsApi } from '@/lib/api';

// 统计卡片数据类型
interface StatCard {
  id: string;
  label: string;
  value: number;
  change: number;
  icon: any;
  prefix?: string;
  suffix?: string;
}

// 动画统计卡片组件
interface AnimatedStatCardProps {
  title: string;
  value: number;
  growth: number;
  icon: React.ReactNode;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

const AnimatedStatCard: React.FC<AnimatedStatCardProps> = ({
  title,
  value,
  growth,
  icon,
  prefix = "",
  suffix = "",
  decimals = 0,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  const spring = useSpring(0, {
    damping: 50,
    stiffness: 200,
    mass: 1,
  });

  const displayValue = useTransform(spring, (current) =>
    decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toString()
  );

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, value, spring]);

  const isPositive = growth >= 0;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white via-white to-pink-50/20 dark:from-slate-800 dark:via-slate-800 dark:to-pink-900/10 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-transparent" />
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-pink-500/10 backdrop-blur-sm">
              {icon}
            </div>
            <Badge
              variant="outline"
              className={`${
                isPositive
                  ? "text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/20"
                  : "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20"
              } backdrop-blur-sm`}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(growth)}%
            </Badge>
          </div>
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{title}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-sm text-slate-500 dark:text-slate-400">{prefix}</span>
            <motion.p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {displayValue}
            </motion.p>
            <span className="text-sm text-slate-500 dark:text-slate-400">{suffix}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export function OverviewViewEnhanced() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [salesTrend, setSalesTrend] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    loadDashboardData();
  }, []);

  // 加载仪表盘数据
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 并行加载所有数据
      const [
        statsResponse,
        ordersResponse,
        productsResponse,
        monthlySalesResponse,
        categoriesResponse
      ] = await Promise.all([
        dashboardApi.getStats(),
        ordersApi.getList({ page: 1, pageSize: 5 }),
        productsApi.getList(1, 5),
        dashboardApi.getMonthlySales(6),
        dashboardApi.getProductCategories(),
      ]);

      // 处理统计数据
      if (statsResponse.success && statsResponse.data) {
        const data = statsResponse.data;
        const formattedStats: StatCard[] = [
          {
            id: 'users',
            label: '总用户数',
            value: data.userCount || 0,
            change: 12.5,
            icon: Users,
          },
          {
            id: 'orders',
            label: '总订单数',
            value: data.orderCount || 0,
            change: 8.3,
            icon: ShoppingCart,
          },
          {
            id: 'products',
            label: '商品总数',
            value: data.productCount || 0,
            change: 5.2,
            icon: Package,
          },
          {
            id: 'revenue',
            label: '总收入',
            value: data.totalIncome || 0,
            change: 15.8,
            icon: DollarSign,
            prefix: '¥',
          },
        ];
        setStats(formattedStats);
      }

      // 处理最近订单数据
      if (ordersResponse.success && ordersResponse.data) {
        const orders = ordersResponse.data.list || [];
        setRecentOrders(orders.slice(0, 5));
      }

      // 处理热门商品数据
      if (productsResponse.success && productsResponse.data) {
        const products = (productsResponse.data as any).records || [];
        setTopProducts(products.slice(0, 5));
      }

      // 处理月度销售数据
      if (monthlySalesResponse.success && monthlySalesResponse.data) {
        const { months, sales } = monthlySalesResponse.data;
        const chartData = months?.map((month: string, index: number) => ({
          month,
          sales: sales?.[index] || 0,
          orders: Math.floor((sales?.[index] || 0) / 100) // 模拟订单数
        })) || [];
        setSalesTrend(chartData);
      }

      // 处理分类数据
      if (categoriesResponse.success && categoriesResponse.data) {
        const categories = categoriesResponse.data.slice(0, 5);
        const total = categories.reduce((sum: number, cat: any) => sum + (cat.productCount || cat.count || 0), 0);
        setCategoryData(categories.map((cat: any, index: number) => ({
          name: cat.categoryName || cat.name || '未知',
          value: cat.productCount || cat.count || 0,
          percentage: total > 0 ? Math.round(((cat.productCount || cat.count || 0) / total) * 100) : 0,
          fill: `hsl(${index * 72}, 70%, 60%)`
        })));
      }

    } catch (err: any) {
      console.error('加载仪表盘数据失败:', err);
      setError(err.message || '加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 格式化订单状态
  const formatOrderStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending_payment': '待支付',
      'pending_shipment': '待发货',
      'shipped': '已发货',
      'completed': '已完成',
      'cancelled': '已取消',
    };
    return statusMap[status] || status;
  };

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "shipped":
      case "pending_shipment":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "pending_payment":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  // 加载状态
  if (loading && stats.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400">加载中...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  if (!mounted) return null;

  // 图表配置
  const lineChartConfig = {
    sales: {
      label: "销售额",
      color: "hsl(330, 81%, 60%)",
    },
    orders: {
      label: "订单数",
      color: "hsl(280, 81%, 60%)",
    },
  } satisfies ChartConfig;

  const barChartConfig = {
    sales: {
      label: "销售额",
      color: "hsl(330, 81%, 60%)",
    },
  } satisfies ChartConfig;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/20 to-purple-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 -m-6 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            仪表盘概览
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            欢迎回来！这是您今天的业务数据概览
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <AnimatedStatCard
                key={stat.id}
                title={stat.label}
                value={stat.value}
                growth={stat.change}
                icon={<Icon className="h-6 w-6 text-pink-600 dark:text-pink-400" />}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white via-white to-pink-50/10 dark:from-slate-800 dark:via-slate-800 dark:to-pink-900/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>销售趋势</span>
                  <Badge variant="outline" className="bg-pink-500/10">
                    最近6个月
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {salesTrend.length > 0 ? (
                  <ChartContainer config={lineChartConfig} className="h-[300px]">
                    <LineChart data={salesTrend}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="sales"
                        stroke="hsl(330, 81%, 60%)"
                        strokeWidth={2}
                        dot={{ fill: "hsl(330, 81%, 60%)", r: 4 }}
                        name="销售额"
                      />
                      <Line
                        type="monotone"
                        dataKey="orders"
                        stroke="hsl(280, 81%, 60%)"
                        strokeWidth={2}
                        dot={{ fill: "hsl(280, 81%, 60%)", r: 4 }}
                        name="订单数"
                      />
                    </LineChart>
                  </ChartContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-slate-400">
                    暂无数据
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white via-white to-purple-50/10 dark:from-slate-800 dark:via-slate-800 dark:to-purple-900/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>月度销售</span>
                  <Badge variant="outline" className="bg-purple-500/10">
                    2025
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {salesTrend.length > 0 ? (
                  <ChartContainer config={barChartConfig} className="h-[300px]">
                    <BarChart data={salesTrend}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="sales"
                        fill="hsl(330, 81%, 60%)"
                        radius={[8, 8, 0, 0]}
                        name="销售额"
                      />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-slate-400">
                    暂无数据
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white via-white to-pink-50/10 dark:from-slate-800 dark:via-slate-800 dark:to-pink-900/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>分类分布</CardTitle>
              </CardHeader>
              <CardContent>
                {categoryData.length > 0 ? (
                  <ChartContainer config={{}} className="h-[250px]">
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={40}
                        paddingAngle={4}
                        cornerRadius={8}
                      >
                        <LabelList
                          dataKey="percentage"
                          stroke="none"
                          fontSize={12}
                          fontWeight={500}
                          fill="currentColor"
                        />
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-slate-400">
                    暂无数据
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white via-white to-purple-50/10 dark:from-slate-800 dark:via-slate-800 dark:to-purple-900/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>最近订单</span>
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400">
                    实时
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order, index) => (
                      <motion.div
                        key={order.orderId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-slate-50/50 dark:bg-slate-700/30 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors border border-slate-200/50 dark:border-slate-600/50"
                      >
                        <div className="flex items-center gap-4">
                          {getStatusIcon(order.status)}
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-100">
                              {order.orderNo || `订单 #${order.orderId}`}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{order.userName || '用户'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            ¥{order.actualAmount || order.totalAmount}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            order.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                            order.status === 'shipped' || order.status === 'pending_shipment' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                            order.status === 'pending_payment' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                            'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                          }`}>
                            {formatOrderStatus(order.status)}
                          </span>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-center text-slate-500 dark:text-slate-400 py-4">暂无订单数据</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white via-white to-pink-50/10 dark:from-slate-800 dark:via-slate-800 dark:to-pink-900/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>热门商品</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.length > 0 ? (
                  topProducts.map((product, index) => (
                    <motion.div
                      key={product.productId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-slate-50/50 dark:bg-slate-700/30 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors border border-slate-200/50 dark:border-slate-600/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center overflow-hidden">
                          {product.productImg ? (
                            <img 
                              src={product.productImg} 
                              alt={product.productName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <Package className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">{product.productName}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{product.sales || 0} 销量</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">¥{product.price}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{product.stock} 库存</p>
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-green-500" />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-slate-500 dark:text-slate-400 py-4">暂无商品数据</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
