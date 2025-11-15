#!/bin/bash

# 母婴商城后台管理系统 - 项目初始化脚本
# MomBaby Admin Dashboard - Project Setup Script

set -e

echo "🚀 开始初始化项目... | Starting project setup..."
echo ""

# 检查 Node.js 版本
echo "📦 检查 Node.js 版本... | Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "当前 Node.js 版本 | Current Node.js version: $NODE_VERSION"

REQUIRED_VERSION="v20"
if [[ "$NODE_VERSION" < "$REQUIRED_VERSION" ]]; then
    echo "❌ 错误: 需要 Node.js 20 或更高版本 | Error: Node.js 20 or higher required"
    exit 1
fi
echo "✅ Node.js 版本检查通过 | Node.js version check passed"
echo ""

# 安装依赖
echo "📦 安装项目依赖... | Installing dependencies..."
npm install
echo "✅ 依赖安装完成 | Dependencies installed"
echo ""

# 创建环境变量文件
if [ ! -f .env.local ]; then
    echo "📝 创建环境变量文件... | Creating environment file..."
    cp .env.example .env.local
    echo "✅ 环境变量文件已创建 | Environment file created"
    echo "⚠️  请编辑 .env.local 文件配置你的环境变量 | Please edit .env.local to configure your environment"
else
    echo "ℹ️  环境变量文件已存在 | Environment file already exists"
fi
echo ""

# 运行类型检查
echo "🔍 运行 TypeScript 类型检查... | Running TypeScript type check..."
npm run type-check
echo "✅ 类型检查通过 | Type check passed"
echo ""

# 运行代码检查
echo "🔍 运行 ESLint 检查... | Running ESLint..."
npm run lint
echo "✅ 代码检查通过 | Lint check passed"
echo ""

# 完成
echo "🎉 项目初始化完成！| Project setup completed!"
echo ""
echo "📝 下一步 | Next steps:"
echo "1. 编辑 .env.local 配置环境变量 | Edit .env.local to configure environment"
echo "2. 运行 npm run dev 启动开发服务器 | Run npm run dev to start dev server"
echo "3. 访问 http://localhost:3000 | Visit http://localhost:3000"
echo ""
echo "📚 查看文档 | View documentation:"
echo "- 快速开始: ./docs/zh-CN/quick-start.md"
echo "- 后端对接: ./docs/zh-CN/integration-guide.md"
echo ""
echo "Happy coding! 🚀"
