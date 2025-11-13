# 🔧 故障排除指南

## 常见问题及解决方案

### 1. 字体加载错误

**问题描述：**
```
Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'
```

**原因：**
Next.js 16 + Turbopack 在开发模式下对 Google Fonts 的支持存在兼容性问题。

**解决方案：**

已修复！我们改用系统字体栈，这样更快且更可靠。

**修改内容：**

1. **layout.tsx** - 移除 Google Fonts 导入
```tsx
// 之前
import { Geist, Geist_Mono } from "next/font/google";

// 之后
// 不再导入字体
```

2. **globals.css** - 使用系统字体
```css
body {
  font-family: ui-sans-serif, system-ui, -apple-system, 
    BlinkMacSystemFont, "Segoe UI", Roboto, 
    "Helvetica Neue", Arial, "Noto Sans", sans-serif;
}
```

**优点：**
- ✅ 无需下载字体文件
- ✅ 加载速度更快
- ✅ 跨平台一致性好
- ✅ 无兼容性问题

---

### 2. 端口被占用

**问题描述：**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**解决方案：**

**方法 1：使用其他端口**
```bash
npm run dev -- -p 3001
```

**方法 2：杀死占用端口的进程**

Windows:
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

macOS/Linux:
```bash
lsof -ti:3000 | xargs kill -9
```

---

### 3. 依赖安装失败

**问题描述：**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**解决方案：**

**方法 1：清除缓存重新安装**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**方法 2：使用 --legacy-peer-deps**
```bash
npm install --legacy-peer-deps
```

**方法 3：使用 yarn**
```bash
yarn install
```

---

### 4. TypeScript 类型错误

**问题描述：**
```
Type 'X' is not assignable to type 'Y'
```

**解决方案：**

**检查类型定义：**
```bash
npm run type-check
```

**常见修复：**

1. **导入类型**
```tsx
import type { ViewType } from './types';
```

2. **类型断言**
```tsx
const view = 'overview' as ViewType;
```

3. **可选链**
```tsx
item?.children?.map(...)
```

---

### 5. 页面空白或崩溃

**问题描述：**
页面加载后显示空白或报错

**排查步骤：**

1. **检查浏览器控制台**
```
F12 -> Console 标签
```

2. **检查 Node.js 版本**
```bash
node --version  # 应该 >= 20
```

3. **清除浏览器缓存**
```
Ctrl+Shift+Delete (Windows)
Cmd+Shift+Delete (Mac)
```

4. **重启开发服务器**
```bash
# 停止服务器 (Ctrl+C)
npm run dev
```

---

### 6. 动画卡顿

**问题描述：**
动画不流畅，帧率低

**解决方案：**

**1. 检查 GPU 加速**
- Chrome: `chrome://gpu`
- 确保 "Graphics Feature Status" 都是 "Hardware accelerated"

**2. 减少同时运行的动画**
```tsx
// 减少 delay
transition={{ delay: 0.05 }} // 而不是 0.1
```

**3. 使用 transform 而不是 position**
```tsx
// 好
animate={{ x: 100 }}

// 不好
animate={{ left: 100 }}
```

**4. 关闭其他标签页**
- 释放内存和 CPU 资源

---

### 7. 构建错误

**问题描述：**
```
npm run build 失败
```

**解决方案：**

**1. 检查 TypeScript 错误**
```bash
npm run type-check
```

**2. 检查 ESLint 错误**
```bash
npm run lint
```

**3. 清除 .next 目录**
```bash
rm -rf .next
npm run build
```

**4. 检查环境变量**
```bash
# 确保 .env.local 存在
cp .env.example .env.local
```

---

### 8. API 请求失败

**问题描述：**
```
Failed to fetch
CORS error
```

**解决方案：**

**1. 检查后端是否启动**
```bash
# 后端应该运行在 http://localhost:8080
curl http://localhost:8080/api/health
```

**2. 检查 CORS 配置**

后端需要允许前端域名：
```java
@CrossOrigin(origins = "http://localhost:3000")
```

**3. 检查环境变量**
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

### 9. 深色模式不工作

**问题描述：**
切换深色模式无效

**解决方案：**

**1. 检查 HTML 类名**
```tsx
<html className="dark">
```

**2. 检查 Tailwind 配置**
```js
// tailwind.config.js
darkMode: 'class'
```

**3. 使用浏览器开发工具**
```
F12 -> Elements -> 检查 <html> 标签
```

---

### 10. 移动端显示异常

**问题描述：**
移动端布局错乱

**解决方案：**

**1. 检查 viewport 设置**
```tsx
// layout.tsx
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

**2. 使用响应式类名**
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
```

**3. 测试不同屏幕尺寸**
```
F12 -> 设备模拟器 -> 选择不同设备
```

---

## 🔍 调试技巧

### 1. 使用 React DevTools

**安装：**
- Chrome: [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)

**使用：**
- F12 -> Components 标签
- 查看组件树和 props
- 查看 hooks 状态

### 2. 使用 console.log

**调试组件：**
```tsx
console.log('当前状态:', state);
console.log('Props:', props);
```

**调试动画：**
```tsx
onAnimationComplete={() => console.log('动画完成')}
```

### 3. 使用 Network 面板

**查看 API 请求：**
- F12 -> Network 标签
- 查看请求和响应
- 检查状态码和数据

### 4. 使用 Performance 面板

**分析性能：**
- F12 -> Performance 标签
- 点击录制
- 执行操作
- 停止录制
- 分析结果

---

## 📞 获取帮助

### 如果问题仍未解决

1. **查看文档**
   - [快速开始](./quick-start.md)
   - [模块指南](./modules-guide.md)
   - [功能特性](../../FEATURES.md)

2. **搜索 Issues**
   - 在 GitHub Issues 中搜索类似问题

3. **提交 Issue**
   - 描述问题
   - 提供错误信息
   - 说明环境（OS、Node 版本等）
   - 提供复现步骤

4. **加入社区**
   - Discord
   - 微信群
   - QQ群

---

## 💡 最佳实践

### 避免常见问题

1. **保持依赖更新**
```bash
npm outdated
npm update
```

2. **使用 TypeScript**
- 启用严格模式
- 定义完整类型
- 避免使用 any

3. **代码审查**
- 使用 ESLint
- 使用 Prettier
- 遵循编码规范

4. **性能优化**
- 使用 React.memo
- 避免不必要的渲染
- 优化图片大小

5. **测试**
- 编写单元测试
- 编写集成测试
- 手动测试各种场景

---

## 📝 更新日志

### 2024-01-15
- ✅ 修复字体加载错误
- ✅ 改用系统字体栈
- ✅ 添加故障排除文档

---

**最后更新**: 2024-01-15  
**版本**: v2.0.0
