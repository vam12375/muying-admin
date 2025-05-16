# Muying Admin - 母婴商城后台管理系统

母婴商城系统的后台管理平台，基于Vue 3和Element Plus构建的管理系统。

## 技术栈

- **核心框架**: Vue 3.5
- **构建工具**: Vite 6.3
- **状态管理**: Pinia 3.0
- **路由管理**: Vue Router 4.5
- **UI组件库**: 
  - Element Plus 2.9.9
  - Ant Design Vue 4.2.6
- **CSS预处理器**: Sass 1.72.0
- **HTTP客户端**: Axios 1.9.0
- **动画库**: 
  - GSAP 3.12.7
  - Animate.css 4.1.1
  - VueUse Motion 2.2.4
- **数据可视化**: ECharts 5.6.0
- **其他辅助库**:
  - js-cookie 3.0.5
  - aos 2.3.4
  - concurrently 9.1.2

## 功能特性

- 管理员登录与权限控制
- 商品管理
  - 商品信息管理
  - 商品分类管理
  - 品牌管理
  - 库存管理
- 订单管理
  - 订单列表与详情
  - 订单状态管理
  - 退款处理
- 用户管理
  - 用户信息管理
  - 会员等级管理
- 内容管理
  - 轮播图管理
  - 促销活动管理
  - 优惠券管理
- 统计分析
  - 销售报表
  - 用户分析
  - 商品分析
- 系统设置
  - 角色与权限管理
  - 管理员账户管理
  - 系统参数配置

## 项目设置

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
src/
├── api/          # API请求
├── assets/       # 静态资源
├── components/   # 通用组件
├── layout/       # 布局组件
├── router/       # 路由配置
├── utils/        # 工具函数
├── views/        # 视图组件
├── App.vue       # 应用根组件
├── main.js       # 应用入口
└── style.css     # 全局样式
```

## 开发指南

- 新增页面需在`router/index.js`中添加路由配置
- 与后端API交互的方法应定义在`api`目录下
- 通用组件应放在`components`目录
- 页面级组件应放在`views`目录

## API接口

管理系统默认连接到后端API服务：

- 开发环境: 
  - 管理API: `http://localhost:8080/admin`
  - 通用API: `http://localhost:8080/api`
- 生产环境: 根据部署配置不同而变化

## 权限控制

- 系统采用基于角色(RBAC)的权限控制模型
- 只有角色为`admin`的用户才能访问管理系统
- 权限控制粒度可细化到按钮级别

## 默认管理员账户

- 用户名: admin
- 密码: admin123

**注意**: 生产环境部署前请务必修改默认密码

## 浏览器兼容性

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版) 