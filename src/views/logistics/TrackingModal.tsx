/**
 * 物流追踪模态框（增强版）
 * Logistics Tracking Modal (Enhanced)
 * 
 * 特性：时间轴动画、GSAP效果、现代化UI
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Package, Clock, MapPin, RefreshCw } from 'lucide-react';
import type { Logistics, LogisticsTrack, LogisticsTrackParams } from '@/types/logistics';
import { getLogisticsTracks, addLogisticsTrack, batchAddLogisticsTracks } from '@/lib/api/logistics';
import { TrackingTimeline } from '@/components/logistics/TrackingTimeline';
import { CompanyLogo } from '@/components/logistics/CompanyLogoMap';
import { useLogisticsGSAP } from '@/hooks/useLogisticsGSAP';
import { formatDate } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface TrackingModalProps {
  logistics: Logistics;
  onClose: () => void;
  onRefresh?: () => void;
}

export function TrackingModal({ logistics, onClose, onRefresh }: TrackingModalProps) {
  const [tracks, setTracks] = useState<LogisticsTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [autoGenerating, setAutoGenerating] = useState(false);
  const [formData, setFormData] = useState<Partial<LogisticsTrackParams>>({
    trackingTime: new Date().toISOString().slice(0, 16),
    status: '',
    content: '',
    location: '',
    operator: ''
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const { animateModal } = useLogisticsGSAP();

  // 轨迹模板 - 模拟物流运输过程
  const trackTemplates = [
    {
      status: '已揽收',
      content: '快件已从仓库发出，正在运往分拣中心',
      location: '发货仓库'
    },
    {
      status: '运输中',
      content: '快件已到达分拣中心，正在分拣',
      location: '分拣中心'
    },
    {
      status: '运输中',
      content: '快件已从分拣中心发出，正在运往配送站',
      location: '分拣中心'
    },
    {
      status: '派送中',
      content: '快件已到达配送站，等待配送',
      location: '配送站'
    },
    {
      status: '已签收',
      content: '快件已被签收，感谢您使用我们的服务',
      location: '收货地址'
    }
  ];

  // 加载追踪记录
  useEffect(() => {
    loadTracks();
    setTimeout(() => {
      if (modalRef.current) {
        animateModal(modalRef.current, true);
      }
    }, 50);
  }, [logistics.id]);

  const loadTracks = async () => {
    try {
      setLoading(true);
      const data = await getLogisticsTracks(logistics.id);
      setTracks(data.sort((a, b) => 
        new Date(b.trackingTime).getTime() - new Date(a.trackingTime).getTime()
      ));
    } catch (error) {
      console.error('加载追踪记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 添加追踪记录
  const handleAddTrack = async () => {
    if (!formData.status?.trim() || !formData.content?.trim()) {
      toast({
        title: '请填写完整信息',
        description: '状态和内容描述不能为空',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      await addLogisticsTrack(logistics.id, formData as LogisticsTrackParams);
      toast({
        title: '添加成功',
        description: '物流追踪记录已添加',
        variant: 'default'
      });
      setShowAddForm(false);
      setFormData({
        trackingTime: new Date().toISOString().slice(0, 16),
        status: '',
        content: '',
        location: '',
        operator: ''
      });
      await loadTracks();
      onRefresh?.();
    } catch (error) {
      console.error('添加追踪记录失败:', error);
      toast({
        title: '添加失败',
        description: '添加物流追踪记录失败，请重试',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // 自动生成物流轨迹
  const handleAutoGenerate = async () => {
    if (tracks.length > 0) {
      const confirmed = window.confirm(
        `当前已有 ${tracks.length} 条轨迹记录，自动生成将添加新的轨迹点。是否继续？`
      );
      if (!confirmed) return;
    }

    try {
      setAutoGenerating(true);

      // 准备所有轨迹数据
      const allTracks = trackTemplates.map((template, index) => {
        // 计算相对时间，第一个点是当前时间，后续每个点间隔30分钟
        const now = new Date();
        const trackingTime = new Date(now.getTime() + index * 30 * 60 * 1000)
          .toISOString()
          .slice(0, 19)
          .replace('T', ' ');

        return {
          trackingTime,
          status: template.status,
          location: template.location,
          content: template.content,
          operator: 'System'
        };
      });

      console.log(`准备批量生成${allTracks.length}个轨迹点`);

      // 调用批量创建API
      await batchAddLogisticsTracks(logistics.id, allTracks);

      toast({
        title: '自动生成成功',
        description: `已成功生成${allTracks.length}个物流轨迹点`,
        variant: 'default'
      });
      await loadTracks();
      onRefresh?.();
    } catch (error) {
      console.error('自动生成轨迹失败:', error);
      toast({
        title: '自动生成失败',
        description: '生成物流轨迹失败，请重试',
        variant: 'destructive'
      });
    } finally {
      setAutoGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          ref={modalRef}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* 头部 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
            <div className="flex items-center gap-4">
              <CompanyLogo 
                code={logistics.company?.code || 'UNKNOWN'} 
                name={logistics.company?.name}
                size="lg"
              />
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  物流追踪
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-mono mt-1">
                  {logistics.trackingNo}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl hover:bg-white/50 dark:hover:bg-gray-700 
                       flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* 物流信息 */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">物流公司</p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {logistics.company?.name || '未知物流公司'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">收货人</p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {logistics.receiverName} · {logistics.receiverPhone}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">收货地址</p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {logistics.receiverAddress}
                </p>
              </div>
            </div>
          </div>

          {/* 追踪记录 */}
          <div className="p-6 overflow-y-auto max-h-[50vh]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">追踪记录</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAutoGenerate}
                  disabled={autoGenerating || loading}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 
                           text-white rounded-xl hover:shadow-lg transition-all font-medium
                           disabled:opacity-50 disabled:cursor-not-allowed"
                  title="自动生成5个物流轨迹点"
                >
                  {autoGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Package className="w-4 h-4" />
                      自动生成轨迹
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  disabled={autoGenerating || loading}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 
                           text-white rounded-xl hover:shadow-lg transition-all font-medium
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  添加记录
                </button>
              </div>
            </div>

            {/* 添加表单 */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mb-6 p-5 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 
                           rounded-2xl border-2 border-blue-200 dark:border-gray-700"
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          追踪时间 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="datetime-local"
                          value={formData.trackingTime}
                          onChange={(e) => setFormData({ ...formData, trackingTime: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl 
                                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          状态 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          placeholder="例如: 运输中"
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl 
                                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        位置信息
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="例如: 北京市朝阳区分拨中心"
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl 
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        内容描述 <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="例如: 快件已到达北京分拨中心，正在进行分拣"
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl 
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleAddTrack}
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                                 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 font-medium"
                      >
                        {loading ? '添加中...' : '确认添加'}
                      </button>
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 
                                 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 
                                 transition-colors font-medium"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 追踪时间线 */}
            {loading && tracks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 animate-pulse opacity-50" />
                <p>加载中...</p>
              </div>
            ) : (
              <TrackingTimeline tracks={tracks} currentStatus={logistics.status} />
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
