# 母婴母婴商城管理系统

母婴母婴商城完整项目，包含前台商城（muying-web）和后台管理系统（muying-admin）。

## 项目结构

- **muying-web**: 前台商城项目，基于Vue 3 + Vite，运行在5173端口
- **muying-admin**: 后台管理系统，基于Vue 3 + Vite + Element Plus，运行在3000端口
- **muying-mall**: 后端API服务，基于Spring Boot，运行在8080端口

## 特性

- 完全分离的前台商城和后台管理系统
- 基于角色的权限控制，只有管理员（role=admin）才能访问后台
- 统一的登录验证机制和JWT认证
- 响应式布局，适配各种设备

## 安装和使用

### 安装依赖

```bash
# 安装根目录依赖
npm install

# 安装所有项目依赖
npm run install-deps
```

### 开发模式

```bash
# 同时启动前台和后台
npm run dev
```

这将同时启动：
- 前台商城: http://localhost:5173
- 后台管理系统: http://localhost:3000

### 构建生产版本

```bash
# 同时构建前台和后台
npm run build
```

## 管理员登录

- 后台管理系统访问地址：http://localhost:3000
- 默认管理员账号：admin
- 默认管理员密码：admin123

## 技术栈

### 前端
- Vue 3
- Vue Router
- Pinia
- Element Plus
- Axios

### 后端
- Spring Boot
- MySQL
- MyBatis-Plus
- JWT

## 注意事项

- 后台管理系统只允许role为admin的用户登录
- 前台商城和后台管理系统共用同一个后端API服务 