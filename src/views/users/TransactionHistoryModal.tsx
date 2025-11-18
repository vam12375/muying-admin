'use client'

/**
 * 交易历史模态框组件 - 基于色彩科学的简洁设计
 * Transaction History Modal Component - Color Science Based Design
 * 
 * 设计理念：
 * 1. 卡片式布局替代传统表格，提升视觉层次
 * 2. 基于色彩心理学：绿色（增长）、红色（减少）、蓝色（中性）
 * 3. 使用纯色而非渐变，保持视觉简洁
 * 4. 确保 WCAG AA 对比度标准，提升可访问性
 * 5. 遵循 KISS 原则，保持代码简洁清晰
 * 
 * 色彩方案：
 * - 充值：绿色系（#10b981 - emerald-500）- 代表增长和收益
 * - 消费：红色系（#ef4444 - red-500）- 代表支出和减少
 * - 退款：橙色系（#f97316 - orange-500）- 代表返还和调整
 * - 调整：蓝色系（#3b82f6 - blue-500）- 代表中性操作
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { accountsApi } from '@/lib/api/accounts'
import type { UserAccount, AccountTransaction } from '@/types/accounts'
import { Button } from '@/components/ui/button'
import { 
  X, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  CreditCard,
  ArrowUpCircle,
  ArrowDownCircle,
  RotateCcw,
  Settings,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface TransactionHistoryModalProps {
  open: boolean
  onClose: () => void
  user: UserAccount
}

export function TransactionHistoryModal({ open, onClose, user }: TransactionHistoryModalProps) {
  const [loading, setLoading] = useState(false)
  const [transactions, setTransactions] = useState<AccountTransaction[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)
  
  // 统计数据（从交易记录实时计算）
  const [stats, setStats] = useState({
    totalRecharge: user.totalRecharge || 0,
    totalConsumption: user.totalConsumption || 0,
    currentBalance: user.balance || 0
  })

  // 加载交易记录
  const loadTransactions = async () => {
    try {
      setLoading(true)
      console.log('[TransactionHistory] 请求参数:', {
        userId: user.userId,
        page: currentPage,
        size: pageSize
      })
      
      const response = await accountsApi.getTransactionPage({
        userId: user.userId,
        page: currentPage,
        size: pageSize
      })
      
      console.log('[TransactionHistory] API响应:', response)
      
      if (response.data) {
        // 注意：后端使用 list 字段而不是 records
        const records = response.data.list || response.data.records || []
        const totalCount = response.data.total || 0
        
        console.log('[TransactionHistory] 解析数据:', {
          records: records.length,
          total: totalCount,
          firstRecord: records[0]
        })
        
        setTransactions(records)
        setTotal(totalCount)
        
        // 如果是第一页，计算统计数据（从所有交易记录中计算）
        if (currentPage === 1) {
          await calculateStats()
        }
      } else {
        console.warn('[TransactionHistory] 响应数据为空')
        setTransactions([])
        setTotal(0)
      }
    } catch (error: any) {
      console.error('[TransactionHistory] 加载失败:', error)
      console.error('[TransactionHistory] 错误详情:', {
        message: error.message,
        response: error.response,
        data: error.data
      })
      
      toast({
        title: '加载失败',
        description: error.message || '获取交易记录失败，请稍后重试',
        variant: 'destructive',
      })
      
      setTransactions([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  } // 结束 loadTransactions 函数

  // 计算统计数据（从所有交易记录中实时计算）
  const calculateStats = async () => {
    try {
      console.log('[TransactionHistory] 开始计算统计数据')
      
      // 获取所有交易记录（不分页）
      const response = await accountsApi.getTransactionPage({
        userId: user.userId,
        page: 1,
        size: 9999 // 获取所有记录
      })
      
      if (response.data) {
        const allRecords = response.data.list || response.data.records || []
        
        // 计算累计充值（type=1，status=1）
        const totalRecharge = allRecords
          .filter(t => t.type === 1 && t.status === 1)
          .reduce((sum, t) => sum + Math.abs(t.amount), 0)
        
        // 计算累计消费（type=2，status=1）
        const totalConsumption = allRecords
          .filter(t => t.type === 2 && t.status === 1)
          .reduce((sum, t) => sum + Math.abs(t.amount), 0)
        
        // 获取最新的余额（从最新的交易记录中获取）
        const latestTransaction = allRecords[0]
        const currentBalance = latestTransaction ? latestTransaction.afterBalance : user.balance
        
        console.log('[TransactionHistory] 统计结果:', {
          totalRecharge,
          totalConsumption,
          currentBalance,
          recordCount: allRecords.length
        })
        
        setStats({
          totalRecharge,
          totalConsumption,
          currentBalance
        })
      }
    } catch (error: any) {
      console.error('[TransactionHistory] 计算统计数据失败:', error)
      // 如果计算失败，使用用户对象中的数据
      setStats({
        totalRecharge: user.totalRecharge || 0,
        totalConsumption: user.totalConsumption || 0,
        currentBalance: user.balance || 0
      })
    }
  }

  useEffect(() => {
    if (open) {
      // 重置状态
      setCurrentPage(1)
      setTransactions([])
      setTotal(0)
      // 加载数据
      loadTransactions()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // 页码变化时重新加载数据
  useEffect(() => {
    if (open && currentPage > 1) {
      loadTransactions()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  if (!open) return null

  // 获取交易类型配置（基于色彩心理学）
  const getTypeConfig = (type: number) => {
    const configs: Record<number, { 
      label: string
      icon: any
      bgColor: string
      textColor: string
      borderColor: string
      iconBg: string
    }> = {
      1: { 
        label: '充值', 
        icon: ArrowUpCircle,
        bgColor: 'bg-emerald-50',      // 浅绿背景
        textColor: 'text-emerald-600',  // 深绿文字
        borderColor: 'border-l-emerald-500', // 左边框强调色
        iconBg: 'bg-emerald-500'        // 图标背景
      },
      2: { 
        label: '消费', 
        icon: ArrowDownCircle,
        bgColor: 'bg-red-50',
        textColor: 'text-red-600',
        borderColor: 'border-l-red-500',
        iconBg: 'bg-red-500'
      },
      3: { 
        label: '退款', 
        icon: RotateCcw,
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-600',
        borderColor: 'border-l-orange-500',
        iconBg: 'bg-orange-500'
      },
      4: { 
        label: '调整', 
        icon: Settings,
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
        borderColor: 'border-l-blue-500',
        iconBg: 'bg-blue-500'
      }
    }
    return configs[type] || { 
      label: '未知', 
      icon: Wallet,
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-600',
      borderColor: 'border-l-gray-400',
      iconBg: 'bg-gray-500'
    }
  }

  // 获取状态配置（基于语义化颜色）
  const getStatusConfig = (status: number) => {
    const configs: Record<number, { 
      label: string
      icon: any
      color: string
      bgColor: string
    }> = {
      0: { 
        label: '失败', 
        icon: XCircle, 
        color: 'text-red-600',
        bgColor: 'bg-red-100'
      },
      1: { 
        label: '成功', 
        icon: CheckCircle, 
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-100'
      },
      2: { 
        label: '处理中', 
        icon: Clock, 
        color: 'text-amber-600',
        bgColor: 'bg-amber-100'
      }
    }
    return configs[status] || { 
      label: '未知', 
      icon: Clock, 
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    }
  }

  // 格式化金额
  const formatAmount = (amount: number, type: number) => {
    const isIncrease = type === 1 || type === 3 // 充值和退款是增加
    return {
      value: Math.abs(amount).toFixed(2),
      isIncrease,
      sign: isIncrease ? '+' : '-'
    }
  }

  // 格式化时间
  const formatTime = (time: string) => {
    return new Date(time).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 标题栏 - 简洁白色背景 */}
            <div className="bg-white border-b-2 border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Wallet className="h-6 w-6 text-gray-700" />
                    交易历史
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {user.username} (ID: {user.userId})
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* 统计卡片 - 纯色设计 */}
              <div className="grid grid-cols-3 gap-4">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-900"
                >
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <Wallet className="h-4 w-4" />
                    当前余额
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    ¥{stats.currentBalance.toFixed(2)}
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-emerald-50 rounded-lg p-4 border-l-4 border-emerald-500"
                >
                  <div className="flex items-center gap-2 text-emerald-700 text-sm mb-2">
                    <TrendingUp className="h-4 w-4" />
                    累计充值
                  </div>
                  <div className="text-3xl font-bold text-emerald-600">
                    ¥{stats.totalRecharge.toFixed(2)}
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500"
                >
                  <div className="flex items-center gap-2 text-red-700 text-sm mb-2">
                    <TrendingDown className="h-4 w-4" />
                    累计消费
                  </div>
                  <div className="text-3xl font-bold text-red-600">
                    ¥{stats.totalConsumption.toFixed(2)}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* 交易记录列表 */}
            <div className="flex-1 overflow-auto p-6 bg-gray-50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  交易记录 <span className="text-sm text-gray-500 font-normal">(共 {total} 条)</span>
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadTransactions}
                  disabled={loading}
                  className="gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  刷新
                </Button>
              </div>

              {/* 卡片式交易列表 */}
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-12">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
                    <p className="text-gray-500">加载中...</p>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <Wallet className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">暂无交易记录</p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {transactions.map((transaction, index) => {
                      const typeConfig = getTypeConfig(transaction.type)
                      const statusConfig = getStatusConfig(transaction.status)
                      const amount = formatAmount(transaction.amount, transaction.type)
                      const TypeIcon = typeConfig.icon
                      const StatusIcon = statusConfig.icon

                      return (
                        <motion.div
                          key={transaction.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: index * 0.05 }}
                          className={`bg-white rounded-lg border-l-4 ${typeConfig.borderColor} border border-gray-200 p-5 hover:shadow-md transition-all duration-200 group`}
                        >
                          <div className="flex items-start gap-4">
                            {/* 类型图标 - 纯色圆形 */}
                            <div className={`${typeConfig.iconBg} rounded-full p-3 text-white group-hover:scale-110 transition-transform flex-shrink-0`}>
                              <TypeIcon className="h-5 w-5" />
                            </div>

                            {/* 主要信息 */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className={`text-lg font-bold ${typeConfig.textColor}`}>
                                      {typeConfig.label}
                                    </span>
                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${statusConfig.bgColor}`}>
                                      <StatusIcon className={`h-3.5 w-3.5 ${statusConfig.color}`} />
                                      <span className={`text-xs font-medium ${statusConfig.color}`}>
                                        {statusConfig.label}
                                      </span>
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-500 font-mono">
                                    {transaction.transactionNo}
                                  </p>
                                </div>

                                {/* 金额 */}
                                <div className="text-right flex-shrink-0">
                                  <div className={`text-2xl font-bold ${amount.isIncrease ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {amount.sign}¥{amount.value}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    余额: ¥{transaction.afterBalance.toFixed(2)}
                                  </div>
                                </div>
                              </div>

                              {/* 详细信息网格 */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-gray-100">
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">交易前</div>
                                  <div className="text-sm font-medium text-gray-700">
                                    ¥{transaction.beforeBalance.toFixed(2)}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">交易后</div>
                                  <div className="text-sm font-medium text-gray-900">
                                    ¥{transaction.afterBalance.toFixed(2)}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">支付方式</div>
                                  <div className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                    <CreditCard className="h-3 w-3" />
                                    {transaction.paymentMethod || '-'}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">交易时间</div>
                                  <div className="text-sm font-medium text-gray-700">
                                    {formatTime(transaction.createTime)}
                                  </div>
                                </div>
                              </div>

                              {/* 描述信息 */}
                              {transaction.description && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <div className="text-xs text-gray-500 mb-1">备注</div>
                                  <div className="text-sm text-gray-700">
                                    {transaction.description}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                )}
              </div>
            </div>

            {/* 分页 */}
            {total > pageSize && (
              <div className="p-4 border-t bg-white flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  显示 {(currentPage - 1) * pageSize + 1} 到 {Math.min(currentPage * pageSize, total)} 条，共 {total} 条
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || loading}
                  >
                    上一页
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage * pageSize >= total || loading}
                  >
                    下一页
                  </Button>
                </div>
              </div>
            )}

            {/* 底部按钮 */}
            <div className="p-4 border-t bg-white">
              <Button onClick={onClose} className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                关闭
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} // 结束 TransactionHistoryModal 组件
