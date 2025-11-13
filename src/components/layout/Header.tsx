"use client";

import React from 'react';
import { Bell } from 'lucide-react';

interface HeaderProps {
  activeItem: string;
  showNotifications: boolean;
  onToggleNotifications: () => void;
}

export function Header({ activeItem, showNotifications, onToggleNotifications }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between dark:bg-slate-800 dark:border-slate-700">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {activeItem.charAt(0).toUpperCase() + activeItem.slice(1)}
        </h1>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleNotifications}
          className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors dark:hover:bg-slate-700"
        >
          <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">AD</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Admin User</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
