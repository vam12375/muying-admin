#!/bin/bash

# 健康检查脚本 | Health Check Script

set -e

echo "🏥 开始健康检查... | Starting health check..."
echo ""

# 检查前端服务
echo "🌐 检查前端服务... | Checking frontend service..."
FRONTEND_URL="http://localhost:3000"
if curl -s -o /dev/null -w "%{http_code}" $FRONTEND_URL | grep -q "200\|301\|302"; then
    echo "✅ 前端服务正常 | Frontend service is healthy"
else
    echo "❌ 前端服务异常 | Frontend service is down"
    exit 1
fi
echo ""

# 检查后端服务
echo "🔧 检查后端服务... | Checking backend service..."
BACKEND_URL="${NEXT_PUBLIC_API_URL:-http://localhost:8080}"
if curl -s -o /dev/null -w "%{http_code}" $BACKEND_URL | grep -q "200\|301\|302"; then
    echo "✅ 后端服务正常 | Backend service is healthy"
else
    echo "⚠️  后端服务异常 | Backend service is down"
    echo "请检查后端服务是否启动 | Please check if backend service is running"
fi
echo ""

# 检查依赖
echo "📦 检查依赖... | Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "✅ 依赖已安装 | Dependencies installed"
else
    echo "❌ 依赖未安装 | Dependencies not installed"
    echo "请运行: npm install"
    exit 1
fi
echo ""

# 检查环境变量
echo "🔐 检查环境变量... | Checking environment variables..."
if [ -f ".env.local" ]; then
    echo "✅ 环境变量文件存在 | Environment file exists"
else
    echo "⚠️  环境变量文件不存在 | Environment file not found"
    echo "请运行: cp .env.example .env.local"
fi
echo ""

# 检查构建文件
echo "🏗️  检查构建文件... | Checking build files..."
if [ -d ".next" ]; then
    echo "✅ 构建文件存在 | Build files exist"
else
    echo "ℹ️  构建文件不存在 | Build files not found"
    echo "首次运行请执行: npm run build"
fi
echo ""

# 检查磁盘空间
echo "💾 检查磁盘空间... | Checking disk space..."
DISK_USAGE=$(df -h . | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -lt 90 ]; then
    echo "✅ 磁盘空间充足 ($DISK_USAGE% 已使用) | Disk space sufficient ($DISK_USAGE% used)"
else
    echo "⚠️  磁盘空间不足 ($DISK_USAGE% 已使用) | Low disk space ($DISK_USAGE% used)"
fi
echo ""

# 检查内存
echo "🧠 检查内存... | Checking memory..."
if command -v free &> /dev/null; then
    MEMORY_USAGE=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100)}')
    echo "内存使用率: $MEMORY_USAGE% | Memory usage: $MEMORY_USAGE%"
else
    echo "ℹ️  无法检查内存使用情况 | Cannot check memory usage"
fi
echo ""

echo "🎉 健康检查完成！| Health check completed!"
