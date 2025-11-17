'use client'

/**
 * 调整余额模态框组件
 * Adjust Balance Modal Component
 */

import { useState } from 'react'
import { accountsApi } from '@/lib/api/accounts'
import type { UserAccount } from '@/types/accounts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { X, Plus, Minus } from 'lucide-react'

interface AdjustBalanceModalProps {
  open: boolean
  onClose: () => void
  user: UserAccount
  onSuccess: () => void
}

export function AdjustBalanceModal({ open, onClose, user, onSuccess }: AdjustBalanceModalProps) {
  const [loading, setLoading] = useState(false)
  const [adjustType, setAdjustType] = useState<'increase' | 'decrease'>('increase')
  const [formData, setFormData] = useState({
    amount: '',
    reason: ''
  })
  const [error, setError] = useState<string>('')

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const amount = parseFloat(formData.amount)
    if (isNaN(amount) || amount <= 0) {
      setError('请输入有效的调整金额')
      return
    }

    if (!formData.reason.trim()) {
      setError('请输入调整原因')
      return
    }

    // 减少时检查余额
    if (adjustType === 'decrease' && amount > user.balance) {
      setError('调整金额不能大于当前余额')
      return
    }

    try {
      setLoading(true)
      const finalAmount = adjustType === 'increase' ? amount : -amount
      await accountsApi.adjustUserBalance({
        userId: user.userId,
        amount: finalAmount,
        reason: formData.reason
      })
      
      onSuccess()
      onClose()
    } catch (error: any) {
      setError(error.message || '余额调整失败，请稍后重试')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const calculateNewBalance = () => {
    const amount = parseFloat(formData.amount) || 0
    if (adjustType === 'increase') {
      return user.balance + amount
    } else {
      return user.balance - amount
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">调整余额</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 表单内容 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 用户信息 */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">用户ID:</span>
              <span className="font-medium">{user.userId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">用户名:</span>
              <span className="font-medium">{user.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">当前余额:</span>
              <span className="font-semibold text-green-600">
                ¥{user.balance.toFixed(2)}
              </span>
            </div>
          </div>

          {/* 调整类型 */}
          <div className="space-y-2">
            <Label>调整类型 *</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAdjustType('increase')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                  adjustType === 'increase'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Plus className="h-5 w-5" />
                <span className="font-medium">增加</span>
              </button>
              <button
                type="button"
                onClick={() => setAdjustType('decrease')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                  adjustType === 'decrease'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Minus className="h-5 w-5" />
                <span className="font-medium">减少</span>
              </button>
            </div>
          </div>

          {/* 调整金额 */}
          <div className="space-y-2">
            <Label htmlFor="amount">调整金额 *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              max={adjustType === 'decrease' ? user.balance : undefined}
              placeholder="请输入调整金额"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
            {formData.amount && (
              <div className="text-sm text-muted-foreground">
                调整后余额: 
                <span className={`ml-2 font-semibold ${
                  calculateNewBalance() >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ¥{calculateNewBalance().toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* 调整原因 */}
          <div className="space-y-2">
            <Label htmlFor="reason">调整原因 *</Label>
            <Textarea
              id="reason"
              placeholder="请输入调整原因"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={3}
              required
            />
          </div>

          {/* 提示信息 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>注意：</strong>
              {adjustType === 'increase' 
                ? '增加余额将直接增加用户可用余额'
                : '减少余额时，请确保用户余额充足'}
            </p>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* 按钮 */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              取消
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? '处理中...' : '确认调整'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
