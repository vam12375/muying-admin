# 贡献指南 | Contributing Guide

感谢你对母婴商城后台管理系统的关注！

Thank you for your interest in contributing to MomBaby Admin Dashboard!

---

## 🤝 如何贡献 | How to Contribute

### 报告问题 | Reporting Issues

发现 bug 或有功能建议？请创建一个 issue。

Found a bug or have a feature request? Please create an issue.

**提交 issue 时请包含：| When submitting an issue, please include:**

- 清晰的标题和描述 | Clear title and description
- 复现步骤 | Steps to reproduce
- 预期行为 | Expected behavior
- 实际行为 | Actual behavior
- 截图（如适用）| Screenshots (if applicable)
- 环境信息 | Environment info (OS, browser, Node version)

### 提交代码 | Submitting Code

1. **Fork 项目 | Fork the repository**

2. **创建分支 | Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **编写代码 | Write code**
   - 遵循项目代码风格 | Follow the project's code style
   - 添加必要的注释 | Add necessary comments
   - 确保代码可以正常运行 | Ensure code runs properly

4. **提交更改 | Commit changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```

5. **推送分支 | Push branch**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **创建 Pull Request | Create a Pull Request**

---

## 📝 代码规范 | Code Standards

### 命名规范 | Naming Conventions

- **组件文件**: PascalCase (e.g., `UserList.tsx`)
- **工具函数**: camelCase (e.g., `formatDate.ts`)
- **常量**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **类型/接口**: PascalCase (e.g., `User`, `ApiResponse`)

### 提交信息规范 | Commit Message Convention

使用语义化提交信息 | Use semantic commit messages:

- `feat:` 新功能 | New feature
- `fix:` 修复 bug | Bug fix
- `docs:` 文档更新 | Documentation update
- `style:` 代码格式调整 | Code style changes
- `refactor:` 代码重构 | Code refactoring
- `perf:` 性能优化 | Performance improvement
- `test:` 测试相关 | Test related
- `chore:` 构建/工具相关 | Build/tooling changes

**示例 | Examples:**
```
feat: add user export functionality
fix: resolve login redirect issue
docs: update API integration guide
```

---

## 🧪 测试 | Testing

在提交 PR 前，请确保：| Before submitting a PR, please ensure:

- [ ] 代码通过 ESLint 检查 | Code passes ESLint
  ```bash
  npm run lint
  ```

- [ ] TypeScript 类型检查通过 | TypeScript type check passes
  ```bash
  npm run type-check
  ```

- [ ] 代码格式化正确 | Code is properly formatted
  ```bash
  npm run format
  ```

- [ ] 功能在本地测试通过 | Features work locally
  ```bash
  npm run dev
  ```

---

## 🎨 UI/UX 指南 | UI/UX Guidelines

### 设计原则 | Design Principles

- **一致性 | Consistency**: 保持界面元素的一致性
- **响应式 | Responsive**: 确保在各种设备上都能良好显示
- **可访问性 | Accessibility**: 考虑无障碍访问需求
- **性能 | Performance**: 优化加载速度和交互响应

### 颜色使用 | Color Usage

- 主色调：渐变紫色系 | Primary: Purple gradient
- 成功：绿色 | Success: Green
- 警告：黄色 | Warning: Yellow
- 错误：红色 | Error: Red
- 信息：蓝色 | Info: Blue

---

## 📚 开发资源 | Development Resources

- [Next.js 文档](https://nextjs.org/docs)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Framer Motion 文档](https://www.framer.com/motion/)

---

## 💡 开发建议 | Development Tips

1. **保持简洁 | Keep it simple**: 代码应该易于理解和维护
2. **性能优先 | Performance first**: 考虑性能影响
3. **用户体验 | User experience**: 从用户角度思考
4. **文档完善 | Document well**: 为复杂逻辑添加注释

---

## 🙏 致谢 | Acknowledgments

感谢所有为项目做出贡献的开发者！

Thanks to all contributors who help improve this project!

---

**Happy Coding! 🚀**
