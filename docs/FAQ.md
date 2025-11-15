# 常见问题 | FAQ

母婴商城后台管理系统常见问题解答。

Frequently Asked Questions for MomBaby Admin Dashboard.

---

## 📋 目录 | Table of Contents

- [安装和配置](#安装和配置--installation--configuration)
- [开发相关](#开发相关--development)
- [部署相关](#部署相关--deployment)
- [API 对接](#api-对接--api-integration)
- [性能优化](#性能优化--performance)
- [故障排查](#故障排查--troubleshooting)

---

## 🔧 安装和配置 | Installation & Configuration

### Q1: 需要什么版本的 Node.js？

**A:** 需要 Node.js 20.x 或更高版本。

```bash
# 检查版本
node -v

# 如果版本过低，请升级
# 推荐使用 nvm 管理 Node.js 版本
```

### Q2: 安装依赖时出错怎么办？

**A:** 尝试以下步骤：

```bash
# 1. 清理缓存
npm cache clean --force

# 2. 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 3. 重新安装
npm install
```

### Q3: 如何配置环境变量？

**A:** 复制 `.env.example` 为 `.env.local` 并修改：

```bash
cp .env.example .env.local
```

然后编辑 `.env.local` 文件：

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Q4: 支持哪些操作系统？

**A:** 支持以下操作系统：
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Linux (Ubuntu 20.04+, CentOS 8+)

---

## 💻 开发相关 | Development

### Q5: 如何启动开发服务器？

**A:** 运行以下命令：

```bash
npm run dev
```

然后访问 http://localhost:3000

### Q6: 开发服务器启动很慢怎么办？

**A:** 可能的原因和解决方案：

1. **首次启动**：首次启动需要编译，会比较慢，属于正常现象
2. **端口被占用**：检查 3000 端口是否被占用
3. **依赖问题**：重新安装依赖 `npm install`
4. **缓存问题**：清理缓存 `rm -rf .next`

### Q7: 如何添加新页面？

**A:** 在 `src/app` 目录下创建新文件夹和 `page.tsx`：

```typescript
// src/app/new-page/page.tsx
export default function NewPage() {
  return <div>新页面</div>
}
```

### Q8: 如何修改主题颜色？

**A:** 编辑 `src/app/globals.css` 文件中的 CSS 变量：

```css
:root {
  --primary: #your-color;
}
```

### Q9: 热更新不工作怎么办？

**A:** 尝试以下方法：

1. 重启开发服务器
2. 清理 `.next` 目录
3. 检查文件保存是否成功
4. 检查是否有语法错误

---

## 🚀 部署相关 | Deployment

### Q10: 如何构建生产版本？

**A:** 运行构建命令：

```bash
npm run build
npm start
```

### Q11: 构建失败怎么办？

**A:** 检查以下几点：

1. **TypeScript 错误**：运行 `npm run type-check`
2. **ESLint 错误**：运行 `npm run lint`
3. **内存不足**：增加 Node.js 内存限制

```bash
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

### Q12: 如何部署到 Vercel？

**A:** 两种方式：

**方式一：使用 Vercel CLI**
```bash
npm install -g vercel
vercel login
vercel --prod
```

**方式二：通过 GitHub**
1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量
4. 部署

### Q13: Docker 部署如何配置？

**A:** 使用提供的 Docker 配置：

```bash
# 构建镜像
docker build -t muying-admin .

# 运行容器
docker run -p 3000:3000 muying-admin

# 或使用 docker-compose
docker-compose up -d
```

### Q14: 如何配置 Nginx 反向代理？

**A:** Nginx 配置示例：

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
    }
}
```

---

## 🔌 API 对接 | API Integration

### Q15: 如何配置后端 API 地址？

**A:** 在 `.env.local` 中配置：

```env
NEXT_PUBLIC_API_URL=http://your-backend-url:8080
```

### Q16: API 请求失败怎么办？

**A:** 检查以下几点：

1. **后端服务是否启动**
2. **API 地址是否正确**
3. **CORS 配置是否正确**
4. **Token 是否有效**

查看浏览器控制台的网络请求详情。

### Q17: 如何处理 CORS 错误？

**A:** 后端需要配置 CORS：

**Spring Boot 示例：**
```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");
        config.setAllowCredentials(true);
        // ...
        return new CorsFilter(source);
    }
}
```

### Q18: Token 过期如何处理？

**A:** 系统会自动处理 Token 过期：

1. 检测到 401 错误
2. 自动跳转到登录页
3. 重新登录获取新 Token

### Q19: 如何自定义 API 请求？

**A:** 使用 `src/lib/api.ts` 中的 API 服务：

```typescript
import { api } from '@/lib/api';

// GET 请求
const data = await api.get('/custom-endpoint');

// POST 请求
const result = await api.post('/custom-endpoint', { data });
```

---

## ⚡ 性能优化 | Performance

### Q20: 如何优化首屏加载速度？

**A:** 几个优化建议：

1. **使用动态导入**：
```typescript
const Component = dynamic(() => import('./Component'), {
  loading: () => <Loading />
});
```

2. **优化图片**：使用 Next.js Image 组件
3. **减少初始包大小**：按需导入
4. **启用缓存**：配置适当的缓存策略

### Q21: 页面切换很慢怎么办？

**A:** 可能的原因：

1. **组件过大**：拆分组件，使用懒加载
2. **数据请求慢**：优化 API 响应时间
3. **动画过多**：减少不必要的动画

### Q22: 如何减小打包体积？

**A:** 优化建议：

1. **分析打包体积**：
```bash
npm run build
# 查看 .next/analyze 目录
```

2. **按需导入**：
```typescript
// ❌ 不好
import _ from 'lodash';

// ✅ 好
import debounce from 'lodash/debounce';
```

3. **移除未使用的依赖**

---

## 🐛 故障排查 | Troubleshooting

### Q23: 页面显示空白怎么办？

**A:** 检查步骤：

1. 打开浏览器控制台查看错误
2. 检查 API 请求是否成功
3. 检查 Token 是否有效
4. 清除浏览器缓存

### Q24: 登录后跳转失败？

**A:** 可能的原因：

1. **Token 存储失败**：检查 localStorage
2. **路由配置错误**：检查 middleware.ts
3. **后端返回格式不对**：检查 API 响应

### Q25: 样式显示不正常？

**A:** 尝试以下方法：

1. **清除缓存**：
```bash
rm -rf .next
npm run dev
```

2. **检查 Tailwind 配置**
3. **检查 CSS 导入顺序**
4. **清除浏览器缓存**

### Q26: TypeScript 报错怎么办？

**A:** 常见解决方法：

1. **重启 IDE**
2. **重新安装依赖**：
```bash
rm -rf node_modules
npm install
```

3. **检查类型定义**：确保 `@types` 包已安装
4. **运行类型检查**：
```bash
npm run type-check
```

### Q27: 开发时内存占用过高？

**A:** 优化建议：

1. **关闭不必要的应用**
2. **增加 Node.js 内存限制**
3. **减少同时打开的文件**
4. **定期重启开发服务器**

### Q28: 如何查看详细错误日志？

**A:** 几种方式：

1. **浏览器控制台**：F12 打开开发者工具
2. **终端输出**：查看运行 `npm run dev` 的终端
3. **Network 面板**：查看网络请求详情
4. **React DevTools**：安装 React 开发者工具

---

## 🔐 安全相关 | Security

### Q29: 如何保护敏感信息？

**A:** 安全建议：

1. **不要提交 `.env.local`**
2. **使用环境变量存储密钥**
3. **定期更新依赖**：
```bash
npm audit
npm audit fix
```

4. **启用 HTTPS**

### Q30: 如何防止 XSS 攻击？

**A:** React 默认会转义内容，但注意：

1. **避免使用 `dangerouslySetInnerHTML`**
2. **验证用户输入**
3. **使用 Content Security Policy**

---

## 📱 移动端相关 | Mobile

### Q31: 移动端显示不正常？

**A:** 检查：

1. **响应式设计**：使用 Tailwind 的响应式类
2. **视口配置**：检查 `viewport` meta 标签
3. **触摸事件**：确保触摸交互正常

### Q32: 如何测试移动端？

**A:** 几种方式：

1. **浏览器开发者工具**：F12 → 设备模拟
2. **真机测试**：使用局域网 IP 访问
3. **模拟器**：使用 iOS/Android 模拟器

---

## 🌐 浏览器兼容性 | Browser Compatibility

### Q33: 支持哪些浏览器？

**A:** 支持现代浏览器：

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Q34: IE 浏览器不支持怎么办？

**A:** 本项目不支持 IE 浏览器，建议升级到现代浏览器。

---

## 💡 其他问题 | Other Questions

### Q35: 如何贡献代码？

**A:** 查看 [贡献指南](./CONTRIBUTING.md)

### Q36: 在哪里报告 Bug？

**A:** 在 GitHub 创建 Issue，包含：
- 问题描述
- 复现步骤
- 环境信息
- 错误截图

### Q37: 如何获取技术支持？

**A:** 几种方式：
- 📖 查看文档
- 🐛 提交 Issue
- 💬 社区讨论

### Q38: 项目使用什么许可证？

**A:** MIT 许可证，可以自由使用和修改。

### Q39: 如何更新到最新版本？

**A:** 拉取最新代码并更新依赖：

```bash
git pull origin main
npm install
npm run build
```

### Q40: 有示例项目吗？

**A:** 本项目本身就是完整的示例，包含所有功能模块。

---

## 📞 还有问题？| Still Have Questions?

如果以上内容没有解决你的问题：

If the above doesn't solve your problem:

- 📖 查看完整文档 | Check full documentation: [./docs](./docs)
- 🔍 搜索已有 Issue | Search existing issues
- 💬 创建新 Issue | Create a new issue
- 📧 联系我们 | Contact us: support@example.com

---

**最后更新 | Last Updated**: 2025-11-15

**文档版本 | Document Version**: 1.0.0
