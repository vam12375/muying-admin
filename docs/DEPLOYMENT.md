# 部署指南 | Deployment Guide

本文档提供母婴商城后台管理系统的详细部署说明。

This document provides detailed deployment instructions for the MomBaby Admin Dashboard.

---

## 📋 目录 | Table of Contents

- [前置要求](#前置要求--prerequisites)
- [本地开发部署](#本地开发部署--local-development)
- [生产环境部署](#生产环境部署--production-deployment)
- [Docker 部署](#docker-部署--docker-deployment)
- [Vercel 部署](#vercel-部署--vercel-deployment)
- [环境变量配置](#环境变量配置--environment-variables)
- [常见问题](#常见问题--troubleshooting)

---

## 🔧 前置要求 | Prerequisites

### 软件要求 | Software Requirements

- **Node.js**: 20.x 或更高版本 | 20.x or higher
- **npm**: 10.x 或更高版本 | 10.x or higher
- **Git**: 用于版本控制 | For version control

### 可选要求 | Optional Requirements

- **Docker**: 用于容器化部署 | For containerized deployment
- **Docker Compose**: 用于多容器编排 | For multi-container orchestration

---

## 💻 本地开发部署 | Local Development

### 1. 克隆项目 | Clone Repository

```bash
git clone <repository-url>
cd muying-admin
```

### 2. 安装依赖 | Install Dependencies

```bash
npm install
```

### 3. 配置环境变量 | Configure Environment

```bash
# 复制环境变量模板 | Copy environment template
cp .env.example .env.local

# 编辑配置 | Edit configuration
# 修改 NEXT_PUBLIC_API_URL 为你的后端地址
# Modify NEXT_PUBLIC_API_URL to your backend URL
```

### 4. 启动开发服务器 | Start Development Server

```bash
npm run dev
```

访问 | Visit: http://localhost:3000

---

## 🚀 生产环境部署 | Production Deployment

### 方式一：传统部署 | Method 1: Traditional Deployment

#### 1. 构建项目 | Build Project

```bash
npm run build
```

#### 2. 启动生产服务器 | Start Production Server

```bash
npm start
```

#### 3. 使用 PM2 管理进程 | Use PM2 for Process Management

```bash
# 安装 PM2 | Install PM2
npm install -g pm2

# 启动应用 | Start application
pm2 start npm --name "muying-admin" -- start

# 查看状态 | Check status
pm2 status

# 查看日志 | View logs
pm2 logs muying-admin

# 设置开机自启 | Enable startup on boot
pm2 startup
pm2 save
```

### 方式二：使用 Nginx 反向代理 | Method 2: Nginx Reverse Proxy

#### Nginx 配置示例 | Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 启用 HTTPS | Enable HTTPS

```bash
# 使用 Certbot 获取 SSL 证书 | Use Certbot for SSL certificate
sudo certbot --nginx -d your-domain.com
```

---

## 🐳 Docker 部署 | Docker Deployment

### 方式一：使用 Docker | Method 1: Using Docker

#### 1. 构建镜像 | Build Image

```bash
docker build -t muying-admin:latest .
```

#### 2. 运行容器 | Run Container

```bash
docker run -d \
  --name muying-admin \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://your-backend-url:8080 \
  muying-admin:latest
```

#### 3. 查看日志 | View Logs

```bash
docker logs -f muying-admin
```

### 方式二：使用 Docker Compose | Method 2: Using Docker Compose

#### 1. 配置 docker-compose.yml | Configure docker-compose.yml

编辑 `docker-compose.yml` 文件，根据需要调整配置。

Edit `docker-compose.yml` file and adjust configuration as needed.

#### 2. 启动服务 | Start Services

```bash
# 启动所有服务 | Start all services
docker-compose up -d

# 查看运行状态 | Check status
docker-compose ps

# 查看日志 | View logs
docker-compose logs -f admin
```

#### 3. 停止服务 | Stop Services

```bash
docker-compose down
```

---

## ☁️ Vercel 部署 | Vercel Deployment

### 方式一：通过 Vercel CLI | Method 1: Via Vercel CLI

#### 1. 安装 Vercel CLI | Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. 登录 Vercel | Login to Vercel

```bash
vercel login
```

#### 3. 部署项目 | Deploy Project

```bash
# 首次部署 | First deployment
vercel

# 生产环境部署 | Production deployment
vercel --prod
```

### 方式二：通过 Vercel Dashboard | Method 2: Via Vercel Dashboard

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "New Project"
3. 导入 Git 仓库 | Import Git repository
4. 配置环境变量 | Configure environment variables
5. 点击 "Deploy"

### 环境变量配置 | Environment Variables Configuration

在 Vercel 项目设置中添加：| Add in Vercel project settings:

```
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_APP_NAME=母婴商城管理系统
NEXT_PUBLIC_APP_VERSION=0.1.0
```

---

## 🔐 环境变量配置 | Environment Variables

### 必需变量 | Required Variables

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `NEXT_PUBLIC_API_URL` | 后端 API 地址 | `http://localhost:8080` |

### 可选变量 | Optional Variables

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `NEXT_PUBLIC_APP_NAME` | 应用名称 | `母婴商城管理系统` |
| `NEXT_PUBLIC_APP_VERSION` | 应用版本 | `0.1.0` |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | 启用分析 | `false` |
| `NEXT_PUBLIC_DEBUG_MODE` | 调试模式 | `false` |
| `NEXT_PUBLIC_API_TIMEOUT` | API 超时时间 | `30000` |

---

## 🔍 健康检查 | Health Check

### 检查应用状态 | Check Application Status

```bash
# 检查应用是否运行 | Check if application is running
curl http://localhost:3000

# 检查 API 连接 | Check API connection
curl http://localhost:3000/api/health
```

---

## 📊 性能优化 | Performance Optimization

### 1. 启用压缩 | Enable Compression

Next.js 默认启用 gzip 压缩。

Next.js enables gzip compression by default.

### 2. 图片优化 | Image Optimization

使用 Next.js Image 组件自动优化图片。

Use Next.js Image component for automatic optimization.

### 3. 缓存策略 | Caching Strategy

```nginx
# Nginx 缓存配置 | Nginx cache configuration
location /_next/static {
    expires 365d;
    add_header Cache-Control "public, immutable";
}
```

---

## 🐛 常见问题 | Troubleshooting

### 问题 1：端口被占用 | Issue 1: Port Already in Use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### 问题 2：API 连接失败 | Issue 2: API Connection Failed

检查：| Check:
- 后端服务是否运行 | Backend service is running
- API URL 配置是否正确 | API URL is configured correctly
- CORS 配置是否正确 | CORS is configured correctly
- 防火墙设置 | Firewall settings

### 问题 3：构建失败 | Issue 3: Build Failed

```bash
# 清理缓存 | Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### 问题 4：Docker 容器无法启动 | Issue 4: Docker Container Won't Start

```bash
# 查看详细日志 | View detailed logs
docker logs muying-admin

# 检查容器状态 | Check container status
docker inspect muying-admin
```

---

## 📈 监控和日志 | Monitoring and Logging

### 应用日志 | Application Logs

```bash
# PM2 日志 | PM2 logs
pm2 logs muying-admin

# Docker 日志 | Docker logs
docker logs -f muying-admin

# 系统日志 | System logs
journalctl -u muying-admin -f
```

### 性能监控 | Performance Monitoring

推荐使用：| Recommended tools:
- Vercel Analytics
- Google Analytics
- Sentry (错误追踪 | Error tracking)

---

## 🔄 更新部署 | Update Deployment

### 更新应用 | Update Application

```bash
# 拉取最新代码 | Pull latest code
git pull origin main

# 安装依赖 | Install dependencies
npm install

# 重新构建 | Rebuild
npm run build

# 重启服务 | Restart service
pm2 restart muying-admin
```

### Docker 更新 | Docker Update

```bash
# 重新构建镜像 | Rebuild image
docker-compose build

# 重启服务 | Restart services
docker-compose up -d
```

---

## 🔒 安全建议 | Security Recommendations

1. **使用 HTTPS** | Use HTTPS in production
2. **设置环境变量** | Set environment variables securely
3. **定期更新依赖** | Regularly update dependencies
4. **启用防火墙** | Enable firewall
5. **限制 API 访问** | Restrict API access
6. **使用强密码** | Use strong passwords
7. **定期备份** | Regular backups

---

## 📞 获取帮助 | Get Help

如遇到部署问题：| If you encounter deployment issues:

- 查看 [故障排查文档](./docs/zh-CN/troubleshooting.md)
- 查看 [常见问题](./docs/zh-CN/troubleshooting.md)
- 提交 GitHub Issue

---

**祝部署顺利！🚀 | Happy Deploying! 🚀**
