# CORS 跨域配置指南

## 问题说明

前端（Next.js）运行在 `localhost:3000`，后端（Spring Boot）运行在 `localhost:8080`，浏览器的同源策略会阻止跨域请求。

## 解决方案

### 方案 1：Next.js 代理（已配置）✅

在 `next.config.ts` 中配置了 rewrites，将 `/api/*` 请求转发到后端：

```typescript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:8080/:path*',
    },
  ];
}
```

**使用方式**：
- 前端请求 `/api/admin/dashboard/stats`
- Next.js 自动转发到 `http://localhost:8080/api/admin/dashboard/stats`
- 无需修改后端代码

**注意**：修改 `next.config.ts` 后需要重启开发服务器！

---

### 方案 2：Spring Boot CORS 配置（推荐同时配置）

在后端项目中添加 CORS 配置类：

#### 文件位置
`src/main/java/com/muying/mall/config/CorsConfig.java`

#### 配置代码

```java
package com.muying.mall.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * CORS 跨域配置
 * 允许前端应用访问后端 API
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // 允许的源（开发环境）
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedOrigin("http://127.0.0.1:3000");
        
        // 生产环境需要添加实际域名
        // config.addAllowedOrigin("https://admin.yourdomain.com");
        
        // 允许所有请求方法
        config.addAllowedMethod("*");
        
        // 允许所有请求头
        config.addAllowedHeader("*");
        
        // 允许携带认证信息（如 Cookie、Authorization）
        config.setAllowCredentials(true);
        
        // 预检请求的有效期（秒）
        config.setMaxAge(3600L);
        
        // 暴露的响应头
        config.addExposedHeader("Authorization");
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}
```

#### 或者使用 WebMvcConfigurer 方式

```java
package com.muying.mall.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC 配置 - CORS
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                    "http://localhost:3000",
                    "http://127.0.0.1:3000"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

---

## 配置步骤

### 前端（已完成）✅

1. ✅ 修改 `next.config.ts` 添加 rewrites
2. ✅ 修改 `.env.local` 设置 `NEXT_PUBLIC_API_URL=`（空值表示使用相对路径）
3. ⚠️ **重启 Next.js 开发服务器**（必须！）

```bash
# 停止当前服务器（Ctrl+C）
# 重新启动
npm run dev
```

### 后端（需要操作）

1. 在后端项目创建 `CorsConfig.java`（复制上面的代码）
2. 重启 Spring Boot 应用
3. 验证 CORS 配置是否生效

---

## 验证方法

### 1. 检查浏览器控制台
- ❌ 错误：`Access to fetch at 'http://localhost:8080/...' has been blocked by CORS policy`
- ✅ 正常：API 请求成功，无 CORS 错误

### 2. 检查网络请求
打开浏览器开发者工具 → Network 标签：
- 请求 URL 应该是 `/api/admin/...`（相对路径）
- 响应头应该包含 `Access-Control-Allow-Origin`

### 3. 测试 API
```bash
# 测试后端 CORS 配置
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Authorization" \
     -X OPTIONS \
     http://localhost:8080/api/admin/dashboard/stats -v
```

应该看到响应头：
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Credentials: true
```

---

## 生产环境配置

### 前端
修改 `.env.production`：
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### 后端
在 `CorsConfig.java` 中添加生产域名：
```java
config.addAllowedOrigin("https://admin.yourdomain.com");
```

---

## 常见问题

### Q1: 修改配置后还是报 CORS 错误？
**A**: 确保重启了 Next.js 开发服务器（`next.config.ts` 修改后必须重启）

### Q2: 后端配置了 CORS 还是不行？
**A**: 检查是否有其他拦截器或过滤器覆盖了 CORS 配置

### Q3: 生产环境如何配置？
**A**: 
- 方案 1：使用 Nginx 反向代理统一域名
- 方案 2：后端配置生产域名的 CORS

### Q4: 为什么推荐两种方案都配置？
**A**:
- Next.js 代理：开发环境简单快速
- 后端 CORS：生产环境必需，更灵活
- 双重保障，适应不同部署场景

---

## 当前状态

✅ Next.js 代理已配置  
⚠️ 需要重启 Next.js 开发服务器  
⏳ 后端 CORS 配置待添加（可选，但推荐）

**下一步**：重启前端开发服务器，验证 CORS 问题是否解决。
