# 主题系统使用指南

## 概述

本系统支持两种主题风格：
- **默认风格**：现代化渐变色系统，毛玻璃效果，彩色设计
- **水墨风格**：黑白水墨风格，简约大气，细线条设计

## 功能特性

### 1. 主题切换方式

#### 方式一：快速切换（推荐）
- 点击右上角的调色板图标 🎨
- 即时切换主题，无需刷新页面

#### 方式二：主题设置页面
- 进入 **系统设置 > 主题设置**
- 查看主题预览和详细说明
- 选择喜欢的主题风格

### 2. 主题持久化

- 主题选择会自动保存到 localStorage
- 下次登录时自动应用上次选择的主题
- 无需重复设置

## 技术实现

### 核心文件

```
src/
├── contexts/
│   └── ThemeContext.tsx          # 主题上下文管理
├── components/
│   └── theme/
│       └── ThemeToggle.tsx       # 主题切换按钮
├── views/
│   └── settings/
│       └── ThemeSettingsView.tsx # 主题设置页面
└── app/
    └── globals.css               # 主题样式定义
```

### 主题变量

#### 默认风格
- 使用彩色渐变（粉色、紫色）
- 圆润的圆角设计（0.625rem）
- 丰富的阴影效果
- 毛玻璃效果

#### 水墨风格
- 黑白灰配色方案
- 小圆角设计（0.25rem）
- 细线条边框（1px）
- 简化的阴影效果
- 朱砂红点缀（用于重要操作）

### CSS 变量

```css
/* 水墨风格主题 */
.theme-ink {
  --background: oklch(0.98 0 0);    /* 宣纸白 */
  --foreground: oklch(0.15 0 0);    /* 墨黑 */
  --primary: oklch(0.2 0 0);        /* 浓墨 */
  --destructive: oklch(0.5 0.2 25); /* 朱砂红 */
  --border: oklch(0.88 0 0);        /* 浅灰边框 */
  /* ... 更多变量 */
}
```

## 使用示例

### 在组件中使用主题

```tsx
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
  const { theme, setTheme, toggleTheme } = useTheme();
  
  return (
    <div>
      <p>当前主题: {theme}</p>
      <button onClick={toggleTheme}>切换主题</button>
      <button onClick={() => setTheme('ink')}>使用水墨风格</button>
    </div>
  );
}
```

### 主题特定样式

```tsx
// 组件会自动应用主题样式
<div className="bg-background text-foreground border border-border">
  内容会根据当前主题自动调整颜色
</div>
```

## 设计原则

### KISS (Keep It Simple, Stupid)
- 只提供两种主题，避免过度复杂
- 切换方式简单直观
- 样式覆盖使用 CSS 变量，无需修改组件代码

### YAGNI (You Aren't Gonna Need It)
- 不添加不必要的主题选项
- 不实现复杂的主题编辑器
- 专注于核心的黑白水墨风格需求

### SOLID
- 主题逻辑与组件逻辑分离（ThemeContext）
- 主题样式通过 CSS 变量统一管理
- 易于扩展新主题（如需要）

## 浏览器兼容性

- 支持所有现代浏览器
- 使用 oklch 颜色空间（更好的颜色感知）
- 自动降级到标准颜色格式

## 性能优化

- 主题切换无需重新渲染整个应用
- 使用 CSS 变量实现即时切换
- localStorage 缓存避免重复计算

## 未来扩展

如需添加新主题：

1. 在 `globals.css` 中定义新主题类（如 `.theme-custom`）
2. 在 `ThemeContext.tsx` 中添加新主题类型
3. 在 `ThemeSettingsView.tsx` 中添加新主题选项
4. 更新类型定义

## 常见问题

### Q: 主题切换后页面闪烁？
A: 已通过 `mounted` 状态避免服务端渲染闪烁

### Q: 如何重置主题？
A: 清除 localStorage 中的 `admin_theme` 键，刷新页面

### Q: 可以自定义主题颜色吗？
A: 当前版本不支持，遵循 YAGNI 原则，只提供预设主题

## 维护说明

- 修改主题样式：编辑 `globals.css` 中的 CSS 变量
- 添加新主题：按照"未来扩展"部分的步骤操作
- 主题逻辑问题：检查 `ThemeContext.tsx`
- UI 问题：检查 `ThemeToggle.tsx` 和 `ThemeSettingsView.tsx`

---

**最后更新**: 2024-11-17
**版本**: 1.0.0
