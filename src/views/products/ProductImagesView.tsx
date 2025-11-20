/**
 * 商品图片管理视图组件
 * 用于在Dashboard中展示商品详情图管理功能
 * 
 * Source: 商品管理模块扩展
 * 
 */
"use client";

import { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Trash2, Eye, X } from 'lucide-react';
import { ImageUpload } from '@/components/common/ImageUpload';
import { showSuccess } from '@/lib/utils/toast';

interface DetailImage {
  id: string;
  url: string;
  filename: string;
  uploadTime: string;
}

export function ProductImagesView() {
  const [images, setImages] = useState<DetailImage[]>([]);
  const [uploadingImage, setUploadingImage] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // 从 localStorage 加载图片列表
  useEffect(() => {
    const savedImages = localStorage.getItem('product_detail_images');
    if (savedImages) {
      setImages(JSON.parse(savedImages));
    }
  }, []);

  // 保存图片列表到 localStorage
  const saveImages = (newImages: DetailImage[]) => {
    setImages(newImages);
    localStorage.setItem('product_detail_images', JSON.stringify(newImages));
  };

  // 处理图片上传
  const handleImageUpload = (url: string) => {
    if (!url) return;

    const filename = url.split('/').pop() || '';
    const newImage: DetailImage = {
      id: Date.now().toString(),
      url,
      filename,
      uploadTime: new Date().toISOString(),
    };

    const updatedImages = [newImage, ...images];
    saveImages(updatedImages);
    setUploadingImage('');
    showSuccess('商品详情图上传成功');
  };

  // 删除图片
  const handleDeleteImage = (id: string) => {
    const updatedImages = images.filter(img => img.id !== id);
    saveImages(updatedImages);
    showSuccess('图片已删除');
  };

  // 格式化时间
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">商品图片管理</h1>
          <p className="text-sm text-gray-500 mt-1">
            上传和管理商品详情图，图片将保存到 /details 目录
          </p>
        </div>
      </div>

      {/* 上传区域 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5" />
          上传商品详情图
        </h2>
        
        <div className="max-w-md">
          <ImageUpload
            value={uploadingImage}
            onChange={handleImageUpload}
            folder="details"
            maxSize={10}
            accept="image/jpeg,image/png,image/jpg,image/webp"
          />
          <p className="text-xs text-gray-500 mt-2">
            支持 JPG、PNG、WEBP 格式，单个文件不超过 10MB
          </p>
        </div>
      </div>

      {/* 图片列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          已上传图片 ({images.length})
        </h2>

        {images.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <ImageIcon className="w-16 h-16 mx-auto mb-3 opacity-50" />
            <p>暂无商品详情图</p>
            <p className="text-sm mt-1">请在上方上传图片</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* 图片预览 */}
                <div className="aspect-square relative">
                  <img
                    src={`http://localhost:5173/details/${image.filename}`}
                    alt={image.filename}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* 悬浮操作按钮 */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPreviewImage(`http://localhost:5173/details/${image.filename}`)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      title="预览"
                    >
                      <Eye className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* 图片信息 */}
                <div className="p-2 bg-white">
                  <p className="text-xs text-gray-600 truncate" title={image.filename}>
                    {image.filename}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatTime(image.uploadTime)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 图片预览模态框 */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setPreviewImage(null)}
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
          <img
            src={previewImage}
            alt="预览"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
