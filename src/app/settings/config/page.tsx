/**
 * 系统配置页面
 * 路由: /settings/config
 * 
 * 注意：此页面暂时显示占位内容，待后续实现完整的系统配置功能
 */
"use client";

import { Card } from '@/components/ui/card';
import { Settings, Globe, Mail, Bell, Shield, Database } from 'lucide-react';

export default function SystemConfigPage() {
  const configSections = [
    {
      icon: Globe,
      title: '网站设置',
      description: '网站名称、Logo、SEO配置等',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Mail,
      title: '邮件配置',
      description: 'SMTP服务器、邮件模板配置',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Bell,
      title: '通知设置',
      description: '系统通知、消息推送配置',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Shield,
      title: '安全设置',
      description: '密码策略、登录限制、API密钥',
      color: 'from-red-500 to-orange-600'
    },
    {
      icon: Database,
      title: '存储配置',
      description: '文件存储、CDN、缓存配置',
      color: 'from-indigo-500 to-purple-600'
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">系统配置</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            管理系统的各项配置参数
          </p>
        </div>
      </div>

      {/* 配置分类卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {configSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <Card 
              key={index}
              className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    {section.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {section.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 占位提示 */}
      <Card className="p-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            系统配置功能开发中
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            此功能将提供完整的系统参数配置界面，包括网站设置、邮件配置、通知设置、安全策略等
          </p>
        </div>
      </Card>
    </div>
  );
}
