# 📝 文档贡献指南 | Documentation Contributing Guide

本文档说明如何为项目添加或更新文档。

This document explains how to add or update documentation for the project.

---

## 📁 文档结构 | Documentation Structure

```
docs/
├── zh-CN/              # 🇨🇳 中文文档 | Chinese documentation
│   ├── README.md       # 文档索引 | Documentation index
│   └── *.md            # 各类文档 | Various documents
├── en-US/              # 🇺🇸 英文文档 | English documentation
│   ├── README.md       # Documentation index
│   └── *.md            # Various documents
└── CONTRIBUTING.md     # 本文件 | This file
```

---

## 📋 命名规范 | Naming Conventions

### 文件命名 | File Naming

**使用 kebab-case（短横线命名法）| Use kebab-case:**

✅ **正确 | Correct:**
- `quick-start.md`
- `integration-guide.md`
- `user-guide.md`
- `login-fix.md`

❌ **错误 | Incorrect:**
- `QuickStart.md`
- `Integration_Guide.md`
- `userGuide.md`
- `登录修复.md` (中文文件名)

### 目录命名 | Directory Naming

**使用语言代码 | Use language codes:**

- `zh-CN/` - 简体中文 | Simplified Chinese
- `en-US/` - 美式英语 | American English
- `zh-TW/` - 繁体中文 | Traditional Chinese (如需要 | if needed)
- `ja-JP/` - 日语 | Japanese (如需要 | if needed)

---

## 📝 文档类型 | Document Types

### 1. 快速开始 | Quick Start
**文件名 | Filename:** `quick-start.md`

**用途 | Purpose:** 帮助新用户快速上手 | Help new users get started quickly

**包含内容 | Contents:**
- 系统要求 | System requirements
- 安装步骤 | Installation steps
- 基本配置 | Basic configuration
- 第一次运行 | First run

### 2. 集成指南 | Integration Guide
**文件名 | Filename:** `integration-guide.md`

**用途 | Purpose:** API 集成和后端对接 | API integration and backend connection

**包含内容 | Contents:**
- API 端点 | API endpoints
- 认证方式 | Authentication
- 数据格式 | Data formats
- 示例代码 | Example code

### 3. 用户指南 | User Guide
**文件名 | Filename:** `user-guide.md`

**用途 | Purpose:** 详细的功能使用说明 | Detailed feature usage

**包含内容 | Contents:**
- 功能概述 | Feature overview
- 操作步骤 | Operation steps
- 最佳实践 | Best practices
- 常见问题 | FAQ

### 4. 部署指南 | Deployment Guide
**文件名 | Filename:** `deployment.md`

**用途 | Purpose:** 生产环境部署 | Production deployment

**包含内容 | Contents:**
- 部署选项 | Deployment options
- 环境配置 | Environment setup
- 构建流程 | Build process
- 故障排查 | Troubleshooting

### 5. 组件文档 | Component Documentation
**文件名 | Filename:** `components.md`

**用途 | Purpose:** 组件使用说明 | Component usage

**包含内容 | Contents:**
- 组件列表 | Component list
- Props 说明 | Props description
- 使用示例 | Usage examples
- 自定义方法 | Customization

---

## ✍️ 编写规范 | Writing Guidelines

### Markdown 格式 | Markdown Format

1. **标题层级 | Heading Levels**
   ```markdown
   # H1 - 文档标题 | Document title
   ## H2 - 主要章节 | Main sections
   ### H3 - 子章节 | Subsections
   #### H4 - 详细内容 | Detailed content
   ```

2. **代码块 | Code Blocks**
   ```markdown
   ```bash
   npm install
   ```
   
   ```typescript
   const example = "code";
   ```
   ```

3. **链接 | Links**
   ```markdown
   # 相对链接 | Relative links
   [快速开始](./quick-start.md)
   
   # 外部链接 | External links
   [Next.js](https://nextjs.org/)
   ```

4. **图片 | Images**
   ```markdown
   ![描述](../assets/image.png)
   ```

### 双语文档 | Bilingual Documentation

**推荐格式 | Recommended format:**

```markdown
## 标题 | Title

中文内容在前，英文内容在后，用竖线分隔。

Chinese content first, English content after, separated by pipe.

**示例 | Example:**
- 列表项 | List item
```

---

## 🔄 更新流程 | Update Process

### 添加新文档 | Adding New Documentation

1. **确定文档类型和语言 | Determine type and language**
   ```bash
   # 中文文档 | Chinese doc
   docs/zh-CN/new-feature.md
   
   # 英文文档 | English doc
   docs/en-US/new-feature.md
   ```

2. **创建文档文件 | Create document file**
   - 使用 kebab-case 命名 | Use kebab-case naming
   - 添加文档头部 | Add document header
   - 编写内容 | Write content

3. **更新索引 | Update index**
   - 在 `README.md` 中添加链接 | Add link in `README.md`
   - 按类别分组 | Group by category

4. **交叉引用 | Cross-reference**
   - 在相关文档中添加链接 | Add links in related docs
   - 更新主 README | Update main README

### 更新现有文档 | Updating Existing Documentation

1. **检查版本 | Check version**
   - 确认文档对应的代码版本 | Confirm code version
   - 检查是否需要更新其他语言版本 | Check if other languages need update

2. **进行修改 | Make changes**
   - 保持格式一致 | Keep format consistent
   - 更新日期和版本号 | Update date and version

3. **验证链接 | Verify links**
   - 确保所有链接有效 | Ensure all links work
   - 检查代码示例 | Check code examples

---

## 📊 文档检查清单 | Documentation Checklist

### 新文档 | New Document

- [ ] 文件名使用 kebab-case | Filename uses kebab-case
- [ ] 放在正确的语言目录 | In correct language directory
- [ ] 包含清晰的标题 | Has clear title
- [ ] 内容结构合理 | Well-structured content
- [ ] 代码示例可运行 | Code examples work
- [ ] 已添加到索引 | Added to index
- [ ] 链接都有效 | All links valid

### 更新文档 | Updated Document

- [ ] 版本信息已更新 | Version info updated
- [ ] 内容准确无误 | Content accurate
- [ ] 格式保持一致 | Format consistent
- [ ] 相关文档已同步 | Related docs synced
- [ ] 其他语言版本已更新 | Other languages updated

---

## 🎨 样式指南 | Style Guide

### 中文文档 | Chinese Documentation

1. **使用简体中文 | Use Simplified Chinese**
2. **专业术语保持一致 | Keep terminology consistent**
3. **代码和命令使用英文 | Use English for code/commands**
4. **适当使用 emoji 增强可读性 | Use emoji appropriately**

### 英文文档 | English Documentation

1. **Use clear, concise language**
2. **Follow American English spelling**
3. **Keep technical terms consistent**
4. **Use proper grammar and punctuation**

---

## 🔗 相关资源 | Related Resources

- [Markdown Guide](https://www.markdownguide.org/)
- [中文文案排版指北](https://github.com/sparanoid/chinese-copywriting-guidelines)
- [Google Developer Documentation Style Guide](https://developers.google.com/style)

---

## 📞 需要帮助？ | Need Help?

如有文档相关问题，请：

If you have documentation questions:

- 📖 查看现有文档作为参考 | Check existing docs as reference
- 💬 在 issue 中提问 | Ask in issues
- 📧 联系维护者 | Contact maintainers

---

**感谢您的贡献！| Thank you for contributing!** 🎉
