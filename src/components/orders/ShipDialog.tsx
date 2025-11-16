/**
 * 发货对话框组件
 * Source: 基于旧版本发货功能
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, RefreshCw } from 'lucide-react';
import { getEnabledLogisticsCompanies, generateTrackingNo } from '@/lib/api/logistics';
import type { LogisticsCompany } from '@/types/logistics';

interface ShipDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    companyId: number;
    trackingNo?: string;
    receiverName?: string;
    receiverPhone?: string;
    receiverAddress?: string;
  }) => Promise<void>;
  orderNo: string;
  defaultReceiver?: {
    name: string;
    phone: string;
    address: string;
  };
}

export function ShipDialog({
  open,
  onClose,
  onConfirm,
  orderNo,
  defaultReceiver
}: ShipDialogProps) {
  const [companyId, setCompanyId] = useState<number | ''>('');
  const [trackingNo, setTrackingNo] = useState('');
  const [useOrderReceiver, setUseOrderReceiver] = useState(true);
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  
  const [companies, setCompanies] = useState<LogisticsCompany[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [generatingNo, setGeneratingNo] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 加载物流公司列表
  useEffect(() => {
    if (open) {
      fetchCompanies();
    }
  }, [open]);

  const fetchCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const companies = await getEnabledLogisticsCompanies();
      setCompanies(companies || []);
    } catch (error) {
      console.error('获取物流公司失败:', error);
    } finally {
      setLoadingCompanies(false);
    }
  };

  // 生成物流单号
  const handleGenerateNo = async () => {
    if (!companyId) {
      alert('请先选择物流公司');
      return;
    }

    const company = companies.find(c => c.id === companyId);
    if (!company) return;

    setGeneratingNo(true);
    try {
      const trackingNo = await generateTrackingNo(company.code);
      if (trackingNo) {
        setTrackingNo(trackingNo);
      }
    } catch (error) {
      console.error('生成物流单号失败:', error);
      alert('生成物流单号失败');
    } finally {
      setGeneratingNo(false);
    }
  };

  // 提交发货
  const handleSubmit = async () => {
    if (!companyId) {
      alert('请选择物流公司');
      return;
    }

    const data: any = {
      companyId: companyId as number,
      trackingNo: trackingNo || undefined
    };

    if (!useOrderReceiver) {
      if (!receiverName || !receiverPhone || !receiverAddress) {
        alert('请填写完整的收件人信息');
        return;
      }
      data.receiverName = receiverName;
      data.receiverPhone = receiverPhone;
      data.receiverAddress = receiverAddress;
    }

    setSubmitting(true);
    try {
      await onConfirm(data);
      handleClose();
    } catch (error) {
      console.error('发货失败:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // 关闭对话框
  const handleClose = () => {
    setCompanyId('');
    setTrackingNo('');
    setUseOrderReceiver(true);
    setReceiverName('');
    setReceiverPhone('');
    setReceiverAddress('');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={handleClose}
          />

          {/* 对话框 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-lg bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 标题 */}
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">订单发货</h2>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* 内容 */}
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    订单编号
                  </label>
                  <div className="text-sm text-gray-900">{orderNo}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    物流公司 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={companyId}
                    onChange={(e) => setCompanyId(Number(e.target.value))}
                    disabled={loadingCompanies}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
                  >
                    <option value="">请选择物流公司</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    选择物流公司后可自动生成物流单号
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    物流单号
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={trackingNo}
                      onChange={(e) => setTrackingNo(e.target.value)}
                      placeholder="请输入或生成物流单号"
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      onClick={handleGenerateNo}
                      disabled={!companyId || generatingNo}
                      className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {generatingNo ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                      生成
                    </button>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={useOrderReceiver}
                      onChange={(e) => setUseOrderReceiver(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">使用订单收件人信息</span>
                  </label>
                </div>

                {!useOrderReceiver && (
                  <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        收件人 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={receiverName}
                        onChange={(e) => setReceiverName(e.target.value)}
                        placeholder="请输入收件人姓名"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        联系电话 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={receiverPhone}
                        onChange={(e) => setReceiverPhone(e.target.value)}
                        placeholder="请输入联系电话"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        收货地址 <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={receiverAddress}
                        onChange={(e) => setReceiverAddress(e.target.value)}
                        placeholder="请输入收货地址"
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 底部按钮 */}
              <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
                <button
                  onClick={handleClose}
                  disabled={submitting}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  确认发货
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
