# 母婴商城后台管理系统 - 项目初始化脚本 (Windows)
# MomBaby Admin Dashboard - Project Setup Script (Windows)

Write-Host "🚀 开始初始化项目... | Starting project setup..." -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js 版本
Write-Host "📦 检查 Node.js 版本... | Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node -v
Write-Host "当前 Node.js 版本 | Current Node.js version: $nodeVersion" -ForegroundColor Green

$requiredVersion = [version]"20.0.0"
$currentVersion = [version]($nodeVersion -replace 'v', '')

if ($currentVersion -lt $requiredVersion) {
    Write-Host "❌ 错误: 需要 Node.js 20 或更高版本 | Error: Node.js 20 or higher required" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js 版本检查通过 | Node.js version check passed" -ForegroundColor Green
Write-Host ""

# 安装依赖
Write-Host "📦 安装项目依赖... | Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 依赖安装失败 | Dependencies installation failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ 依赖安装完成 | Dependencies installed" -ForegroundColor Green
Write-Host ""

# 创建环境变量文件
if (-not (Test-Path .env.local)) {
    Write-Host "📝 创建环境变量文件... | Creating environment file..." -ForegroundColor Yellow
    Copy-Item .env.example .env.local
    Write-Host "✅ 环境变量文件已创建 | Environment file created" -ForegroundColor Green
    Write-Host "⚠️  请编辑 .env.local 文件配置你的环境变量 | Please edit .env.local to configure your environment" -ForegroundColor Yellow
} else {
    Write-Host "ℹ️  环境变量文件已存在 | Environment file already exists" -ForegroundColor Cyan
}
Write-Host ""

# 运行类型检查
Write-Host "🔍 运行 TypeScript 类型检查... | Running TypeScript type check..." -ForegroundColor Yellow
npm run type-check
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 类型检查失败 | Type check failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ 类型检查通过 | Type check passed" -ForegroundColor Green
Write-Host ""

# 运行代码检查
Write-Host "🔍 运行 ESLint 检查... | Running ESLint..." -ForegroundColor Yellow
npm run lint
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  代码检查发现问题 | Lint check found issues" -ForegroundColor Yellow
} else {
    Write-Host "✅ 代码检查通过 | Lint check passed" -ForegroundColor Green
}
Write-Host ""

# 完成
Write-Host "🎉 项目初始化完成！| Project setup completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 下一步 | Next steps:" -ForegroundColor Cyan
Write-Host "1. 编辑 .env.local 配置环境变量 | Edit .env.local to configure environment"
Write-Host "2. 运行 npm run dev 启动开发服务器 | Run npm run dev to start dev server"
Write-Host "3. 访问 http://localhost:3000 | Visit http://localhost:3000"
Write-Host ""
Write-Host "📚 查看文档 | View documentation:" -ForegroundColor Cyan
Write-Host "- 快速开始: .\docs\zh-CN\quick-start.md"
Write-Host "- 后端对接: .\docs\zh-CN\integration-guide.md"
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Magenta
