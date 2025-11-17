'use client'

/**
 * 充值模态框组件
 * Recharge Modal Component
 */

import { useState } from 'react'
import { accountsApi } from '@/lib/api/accounts'
import type { UserAccount } from '@/types/accounts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X } from 'lucide-react'

interface RechargeModalProps {
  open: boolean
  onClose: () => void
  user: UserAccount
  onSuccess: () => void
}

export function RechargeModal({ open, onClose, user, onSuccess }: RechargeModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'admin_recharge',
    description: '',
    remark: ''
  })
  const [error, setError] = useState<string>('')

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const amount = parseFloat(formData.amount)
    if (isNaN(amount) || amount <= 0) {
      setError('请输入有效的充值金额')
      return
    }

    try {
      setLoading(true)
      await accountsApi.rechargeUserAccount({
        userId: user.userId,
        amount,
        paymentMethod: formData.paymentMethod,
        description: formData.description || undefined,
        remark: formData.remark || undefined
      })
      
      onSuccess()
      onClose()
    } catch (error: any) {
      setError(error.message || '充值失败，请稍后重试')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">用户充值</h2>
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

          {/* 充值金额 */}
          <div className="space-y-2">
            <Label htmlFor="amount">充值金额 *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="请输入充值金额"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          {/* 支付方式 */}
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">支付方式 *</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin_recharge">管理员充值</SelectItem>
                <SelectItem value="alipay">支付宝</SelectItem>
                <SelectItem value="wechat">微信支付</SelectItem>
                <SelectItem value="bank_transfer">银行转账</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 充值说明 */}
          <div className="space-y-2">
            <Label htmlFor="description">充值说明</Label>
            <Input
              id="description"
              placeholder="请输入充值说明（可选）"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* 备注 */}
          <div className="space-y-2">
            <Label htmlFor="remark">备注</Label>
            <Textarea
              id="remark"
              placeholder="请输入备注信息（可选）"
              value={formData.remark}
              onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
              rows={3}
            />
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
              {loading ? '处理中...' : '确认充值'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
