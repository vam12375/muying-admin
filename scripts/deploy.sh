#!/bin/bash

# 部署脚本 | Deployment Script

set -e

echo "🚀 开始部署流程... | Starting deployment process..."
echo ""

# 检查参数
ENVIRONMENT=${1:-production}
echo "📝 部署环境: $ENVIRONMENT | Deployment environment: $ENVIRONMENT"
echo ""

# 拉取最新代码
echo "📥 拉取最新代码... | Pulling latest code..."
git pull origin main
echo "✅ 代码更新完成 | Code updated"
echo ""

# 安装依赖
echo "📦 安装依赖... | Installing dependencies..."
npm ci
echo "✅ 依赖安装完成 | Dependencies installed"
echo ""

# 运行测试
echo "🧪 运行测试... | Running tests..."
npm run type-check
npm run lint
echo "✅ 测试通过 | Tests passed"
echo ""

# 构建项目
echo "🏗️  构建项目... | Building project..."
npm run build
echo "✅ 构建完成 | Build completed"
echo ""

# 备份当前版本
echo "💾 备份当前版本... | Backing up current version..."
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR
if [ -d ".next" ]; then
    cp -r .next $BACKUP_DIR/
    echo "✅ 备份完成 | Backup completed"
else
    echo "ℹ️  无需备份 | No backup needed"
fi
echo ""

# 重启服务
echo "🔄 重启服务... | Restarting service..."
if command -v pm2 &> /dev/null; then
    pm2 restart muying-admin || pm2 start npm --name "muying-admin" -- start
    echo "✅ PM2 服务已重启 | PM2 service restarted"
elif command -v docker &> /dev/null; then
    docker-compose down
    docker-compose up -d
    echo "✅ Docker 服务已重启 | Docker service restarted"
else
    echo "⚠️  请手动重启服务 | Please restart service manually"
fi
echo ""

# 健康检查
echo "🏥 执行健康检查... | Running health check..."
sleep 5
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|301\|302"; then
    echo "✅ 服务运行正常 | Service is healthy"
else
    echo "❌ 服务异常，正在回滚... | Service is down, rolling back..."
    if [ -d "$BACKUP_DIR/.next" ]; then
        rm -rf .next
        cp -r $BACKUP_DIR/.next .
        pm2 restart muying-admin
        echo "✅ 已回滚到上一版本 | Rolled back to previous version"
    fi
    exit 1
fi
echo ""

# 清理旧备份（保留最近5个）
echo "🧹 清理旧备份... | Cleaning old backups..."
if [ -d "backups" ]; then
    cd backups
    ls -t | tail -n +6 | xargs -r rm -rf
    cd ..
    echo "✅ 清理完成 | Cleanup completed"
fi
echo ""

echo "🎉 部署完成！| Deployment completed!"
echo ""
echo "📊 部署信息 | Deployment info:"
echo "- 环境: $ENVIRONMENT | Environment: $ENVIRONMENT"
echo "- 时间: $(date) | Time: $(date)"
echo "- 版本: $(git rev-parse --short HEAD) | Version: $(git rev-parse --short HEAD)"
echo ""
echo "🌐 访问地址 | Access URL:"
echo "- http://localhost:3000"
