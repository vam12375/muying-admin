# 🚀 快速启动指南

## 📋 前置要求

- Node.js 20+
- npm 或 yarn
- Git

---

## ⚡ 5分钟快速启动

### 1. 克隆项目
```bash
git clone <repository-url>
cd muying-admin
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑 .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 4. 启动开发服务器
```bash
npm run dev
```

### 5. 访问系统
打开浏览器访问: http://localhost:3000

### 6. 登录
```
用户名: admin
密码: admin123
```

---

## 🎯 功能导航

### 主要模块

1. **📊 仪表盘** - 首页，查看统计数据
2. **📦 商品管理** - 点击展开子菜单
   - 商品列表
   - 商品分类
   - 品牌管理
   - 商品分析
3. **⭐ 评价管理** - 审核用户评价
4. **📋 订单管理** - 处理订单
5. **🎧 售后管理** - 处理退款/退货/换货
6. **👥 用户管理** - 管理用户信息
7. **🎁 优惠券管理** - 创建和管理优惠券
8. **🏆 积分管理** - 查看积分记录
9. **📢 消息管理** - 发送系统消息
10. **🚚 物流管理** - 管理物流公司
11. **⚙️ 系统设置** - 点击展开子菜单
    - 系统监控
    - 系统配置
    - 系统日志

---

## 🎨 界面操作

### 侧边栏
- **展开/收起** - 点击顶部箭头按钮
- **搜索功能** - 使用搜索框快速定位
- **多级菜单** - 点击带箭头的菜单项展开子菜单

### 卡片操作
- **悬停效果** - 鼠标悬停查看动画
- **点击查看** - 点击卡片查看详情
- **筛选数据** - 使用顶部筛选按钮

### 表格操作
- **排序** - 点击表头排序
- **搜索** - 使用搜索框过滤
- **操作** - 点击操作按钮

---

## 🎭 动画效果

### 已实现的动画

1. **侧边栏动画**
   - 展开/收起过渡
   - 菜单项悬停缩放
   - 子菜单展开动画

2. **卡片动画**
   - 悬停上浮效果
   - 统计数字动画
   - 进度条填充

3. **列表动画**
   - 交错进入动画
   - 滑入滑出效果
   - 筛选过渡

4. **按钮动画**
   - 点击按压反馈
   - 悬停缩放
   - 渐变背景

---

## 📱 响应式测试

### 测试不同屏幕尺寸

1. **桌面端** (> 1024px)
   - 打开浏览器
   - 正常浏览

2. **平板端** (768px - 1024px)
   - 按 F12 打开开发者工具
   - 点击设备模拟器
   - 选择 iPad

3. **移动端** (< 768px)
   - 按 F12 打开开发者工具
   - 点击设备模拟器
   - 选择 iPhone

---

## 🎨 自定义主题

### 修改颜色

编辑组件文件中的 Tailwind 类名：

```tsx
// 主色调（粉紫渐变）
className="bg-gradient-to-r from-pink-500 to-purple-600"

// 其他颜色
from-blue-500 to-cyan-500      // 蓝色
from-green-500 to-emerald-500  // 绿色
from-red-500 to-pink-500       // 红色
from-yellow-500 to-orange-500  // 黄色
```

### 修改动画速度

```tsx
// 快速动画
transition={{ duration: 0.2 }}

// 中速动画
transition={{ duration: 0.3 }}

// 慢速动画
transition={{ duration: 0.5 }}
```

---

## 🔧 开发命令

```bash
# 开发模式
npm run dev

# 生产构建
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint

# 类型检查
npm run type-check

# 格式化代码
npm run format
```

---

## 📚 文档导航

### 中文文档
- [模块使用指南](./docs/zh-CN/modules-guide.md)
- [功能特性说明](./FEATURES.md)
- [更新日志](./CHANGELOG.md)
- [快速开始](./docs/zh-CN/quick-start.md)

### 英文文档
- [Dashboard Features](./docs/en-US/dashboard-readme.md)
- [Integration Guide](./docs/en-US/integration-guide.md)
- [Deployment Guide](./docs/en-US/deployment.md)

---

## 🐛 常见问题

### 1. 端口被占用
```bash
# 修改端口
npm run dev -- -p 3001
```

### 2. 依赖安装失败
```bash
# 清除缓存
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 3. 页面空白
- 检查浏览器控制台错误
- 确认 Node.js 版本 >= 20
- 尝试清除浏览器缓存

### 4. 动画卡顿
- 关闭浏览器其他标签页
- 检查 GPU 加速是否开启
- 降低动画复杂度

---

## 💡 使用技巧

### 1. 快捷键（计划中）
```
Ctrl/Cmd + K  - 打开搜索
Ctrl/Cmd + B  - 切换侧边栏
Ctrl/Cmd + /  - 显示快捷键
```

### 2. 搜索技巧
- 输入关键词实时搜索
- 支持拼音首字母
- 支持模糊匹配

### 3. 批量操作
- 勾选多个项目
- 点击批量操作按钮
- 确认操作

---

## 🎯 下一步

### 学习路径

1. **熟悉界面** (10分钟)
   - 浏览所有模块
   - 测试各种功能
   - 体验动画效果

2. **查看文档** (20分钟)
   - 阅读模块指南
   - 了解数据类型
   - 学习最佳实践

3. **开始开发** (30分钟)
   - 修改示例数据
   - 自定义样式
   - 添加新功能

4. **集成后端** (1小时)
   - 配置 API 地址
   - 对接接口
   - 测试功能

---

## 🚀 部署上线

### Vercel 部署（推荐）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel
```

### Docker 部署

```bash
# 构建镜像
docker build -t muying-admin .

# 运行容器
docker run -p 3000:3000 muying-admin
```

### 传统部署

```bash
# 构建
npm run build

# 启动
npm start
```

---

## 📞 获取帮助

### 遇到问题？

1. **查看文档** - 先查看相关文档
2. **搜索问题** - 在 Issues 中搜索
3. **提交 Issue** - 描述问题和环境
4. **加入社区** - 获取实时帮助

### 联系方式
- 📧 Email: support@example.com
- 💬 Discord: discord.gg/example
- 🐛 Issues: github.com/example/issues

---

## 🎉 开始使用

现在你已经准备好了！

1. ✅ 系统已启动
2. ✅ 功能已了解
3. ✅ 文档已阅读
4. ✅ 准备开发

**祝你使用愉快！** 🚀

---

**最后更新**: 2024-01-15  
**版本**: v2.0.0
