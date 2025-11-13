# 开发规范和规则

- 文档组织规范：
1. 所有文档统一存放在 docs/ 目录
2. 按语言分类：zh-CN/ (中文), en-US/ (英文)
3. 文件命名使用 kebab-case (如 quick-start.md)
4. 每个语言目录包含 README.md 作为索引
5. 根目录 README.md 为双语主入口
6. 禁止使用中文文件名
7. 文档类型：quick-start, integration-guide, user-guide, deployment, components 等
- 源代码组织规范：
1. 所有源代码统一存放在 src/ 目录
2. src/app/ - Next.js App Router (页面和路由)
3. src/components/ - React 组件 (按功能模块分组)
4. src/hooks/ - 自定义 React Hooks (use 前缀)
5. src/lib/ - 工具库、API 服务、配置
6. src/types/ - TypeScript 全局类型定义
7. src/middleware.ts - Next.js 中间件
8. 使用 @/ 路径别名引用 src/ 目录
9. 组件文件使用 PascalCase，Hook 文件使用 camelCase
10. 每个模块使用 index.ts 统一导出
- 字体配置规则：由于Next.js 16 + Turbopack对Google Fonts存在兼容性问题，项目使用系统字体栈（ui-sans-serif, system-ui等）而不是Google Fonts。这样可以避免构建错误，提高加载速度，并保持跨平台一致性。如需自定义字体，应使用本地字体文件或等待Next.js修复后再使用Google Fonts。
