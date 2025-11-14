'use client'

/**
 * 交易历史模态框组件
 * Transaction History Modal Component
 */

import { useState, useEffect } from 'react'
import { usersApi } from '@/lib/api/users'
import type { UserAccount, AccountTransaction } from '@/types/user'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { X, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react'

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

  // 加载交易记录
  const loadTransactions = async () => {
    try {
      setLoading(true)
      const response = await usersApi.getTransactionPage({
        userId: user.userId,
        page: currentPage,
        size: pageSize
      })
      
      if (response.data) {
        setTransactions(response.data.records || [])
        setTotal(response.data.total || 0)
      }
    } catch (error) {
      console.error('加载交易记录失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      loadTransactions()
    }
  }, [open, currentPage])

  if (!open) return null

  // 获取交易类型标签
  const getTypeLabel = (type: number) => {
    const types: Record<number, { label: string; color: string }> = {
      1: { label: '充值', color: 'bg-green-500' },
      2: { label: '消费', color: 'bg-blue-500' },
      3: { label: '退款', color: 'bg-yellow-500' },
      4: { label: '调整', color: 'bg-purple-500' }
    }
    const config = types[type] || { label: '未知', color: 'bg-gray-500' }
    return <Badge className={config.color}>{config.label}</Badge>
  }

  // 获取状态标签
  const getStatusLabel = (status: number) => {
    const statuses: Record<number, { label: string; variant: any }> = {
      0: { label: '失败', variant: 'destructive' },
      1: { label: '成功', variant: 'default' },
      2: { label: '处理中', variant: 'secondary' }
    }
    const config = statuses[status] || { label: '未知', variant: 'secondary' }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  // 格式化金额
  const formatAmount = (amount: number, type: number) => {
    const isIncrease = type === 1 || type === 3 // 充值和退款是增加
    return (
      <span className={`font-semibold ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
        {isIncrease ? '+' : '-'}¥{Math.abs(amount).toFixed(2)}
      </span>
    )
  }

  // 格式化时间
  const formatTime = (time: string) => {
    return new Date(time).toLocaleString('zh-CN')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">交易历史</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {user.username} (ID: {user.userId})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 用户信息摘要 */}
        <div className="p-6 border-b bg-gray-50">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">当前余额</div>
              <div className="text-2xl font-bold text-green-600">
                ¥{user.balance.toFixed(2)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">累计充值</div>
              <div className="text-2xl font-bold text-blue-600">
                ¥{user.totalRecharge.toFixed(2)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">累计消费</div>
              <div className="text-2xl font-bold text-orange-600">
                ¥{user.totalConsumption.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* 交易记录表格 */}
        <div className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">交易记录 (共 {total} 条)</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={loadTransactions}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              刷新
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">交易流水号</TableHead>
                <TableHead className="w-24">类型</TableHead>
                <TableHead className="text-right w-32">金额</TableHead>
                <TableHead className="text-right w-28">交易前</TableHead>
                <TableHead className="text-right w-28">交易后</TableHead>
                <TableHead className="w-24">状态</TableHead>
                <TableHead className="w-28">支付方式</TableHead>
                <TableHead>描述</TableHead>
                <TableHead className="w-40">时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    加载中...
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    暂无交易记录
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.transactionId}>
                    <TableCell className="font-mono text-xs">
                      {transaction.transactionNo}
                    </TableCell>
                    <TableCell>{getTypeLabel(transaction.type)}</TableCell>
                    <TableCell className="text-right">
                      {formatAmount(transaction.amount, transaction.type)}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      ¥{transaction.balanceBefore.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium">
                      ¥{transaction.balanceAfter.toFixed(2)}
                    </TableCell>
                    <TableCell>{getStatusLabel(transaction.status)}</TableCell>
                    <TableCell className="text-sm">
                      {transaction.paymentMethod || '-'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {transaction.description || '-'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatTime(transaction.createTime)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* 分页 */}
        {total > pageSize && (
          <div className="p-4 border-t flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
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
        <div className="p-6 border-t">
          <Button onClick={onClose} className="w-full">
            关闭
          </Button>
        </div>
      </div>
    </div>
  )
}
