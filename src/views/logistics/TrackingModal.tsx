/**
 * 物流追踪模态框
 * Logistics Tracking Modal
 * 
 * 功能: 查看和添加物流追踪记录
 * 遵循协议: AURA-X-KYS (KISS/YAGNI/SOLID)
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, MapPin, Clock, Plus } from 'lucide-react';
import type { Logistics, LogisticsTrack, AddTrackParams } from '@/types/logistics';
import { getLogisticsTracks, addLogisticsTrack } from '@/lib/api/logistics';
import { formatDate } from '@/lib/utils';

interface TrackingModalProps {
  logistics: Logistics;
  onClose: () => void;
  onRefresh?: () => void;
}

export function TrackingModal({ logistics, onClose, onRefresh }: TrackingModalProps) {
  const [tracks, setTracks] = useState<LogisticsTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<AddTrackParams>>({
    logisticsId: logistics.id,
    trackTime: new Date().toISOString().slice(0, 16),
    description: '',
    location: ''
  });

  // 加载追踪记录
  useEffect(() => {
    loadTracks();
  }, [logistics.id]);

  const loadTracks = async () => {
    try {
      setLoading(true);
      const data = await getLogisticsTracks(logistics.id);
      setTracks(data);
    } catch (error) {
      console.error('加载追踪记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 添加追踪记录
  const handleAddTrack = async () => {
    if (!formData.description?.trim()) {
      alert('请输入追踪描述');
      return;
    }

    try {
      setLoading(true);
      await addLogisticsTrack(formData as AddTrackParams);
      alert('添加成功');
      setShowAddForm(false);
      setFormData({
        logisticsId: logistics.id,
        trackTime: new Date().toISOString().slice(0, 16),
        description: '',
        location: ''
      });
      await loadTracks();
      onRefresh?.();
    } catch (error) {
      console.error('添加追踪记录失败:', error);
      alert('添加失败');
    } finally {
      setLoading(false);
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
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 头部 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">物流追踪</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">单号: {logistics.trackingNo}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* 物流信息 */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">物流公司</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">{logistics.company}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">收货人</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {logistics.receiverName} {logistics.receiverPhone}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">收货地址</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">{logistics.receiverAddress}</p>
              </div>
            </div>
          </div>

          {/* 追踪记录 */}
          <div className="p-6 overflow-y-auto max-h-[50vh]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">追踪记录</h3>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                添加记录
              </button>
            </div>

            {/* 添加表单 */}
            {showAddForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl"
              >
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      追踪时间 *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.trackTime}
                      onChange={(e) => setFormData({ ...formData, trackTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      位置信息
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="例如: 北京市朝阳区"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      追踪描述 *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="例如: 快件已到达北京分拨中心"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddTrack}
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {loading ? '添加中...' : '确认添加'}
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      取消
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 追踪时间线 */}
            {loading && tracks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">加载中...</div>
            ) : tracks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">暂无追踪记录</div>
            ) : (
              <div className="relative">
                {/* 时间线 */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-pink-500" />
                
                <div className="space-y-4">
                  {tracks.map((track, index) => (
                    <motion.div
                      key={track.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative pl-12"
                    >
                      {/* 时间点 */}
                      <div className="absolute left-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        {index === 0 ? (
                          <Package className="w-4 h-4 text-white" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-white" />
                        )}
                      </div>

                      {/* 内容 */}
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium text-gray-900 dark:text-white">{track.description}</p>
                          {index === 0 && (
                            <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
                              最新
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(track.trackTime)}
                          </div>
                          {track.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {track.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
