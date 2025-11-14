# Spring Boot 3.x 静态资源处理问题修复

## 问题描述

**错误信息**：
```
No static resource admin/profile/info
No static resource admin/profile/statistics
```

**根本原因**：
Spring Boot 3.x 的静态资源处理机制变化，导致 `/admin/**` 路径被当成静态资源请求，而不是 API 请求。

## 问题分析

### Spring Boot 2.x vs 3.x 的差异

| 特性 | Spring Boot 2.x | Spring Boot 3.x |
|------|----------------|----------------|
| 静态资源处理 | 默认处理 `/**` | 更严格的路径匹配 |
| 异常类型 | 返回 404 | 抛出 `NoResourceFoundException` |
| 路径匹配 | 宽松 | 严格 |

### 为什么旧系统可以工作？

旧系统可能：
1. 使用 Spring Boot 2.x
2. 有明确的静态资源配置
3. 使用不同的路径前缀

## 解决方案

### 修复1：添加 WebMvcConfig

**文件**：`muying-mall/src/main/java/com/muyingmall/config/WebMvcConfig.java`

```java
package com.muyingmall.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        configurer.setUseTrailingSlashMatch(true);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 只处理特定路径的静态资源
        registry.addResourceHandler("/upload/**")
                .addResourceLocations("file:upload/");
        
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
        
        // 不添加 /** 通配符，避免拦截 API 请求
    }
}
```

**作用**：
- 明确指定静态资源路径
- 避免 `/**` 通配符拦截所有请求
- 确保 `/admin/**` 路径由控制器处理

### 修复2：处理 NoResourceFoundException

**文件**：`muying-mall/src/main/java/com/muyingmall/common/exception/GlobalExceptionHandler.java`

```java
@ExceptionHandler(org.springframework.web.servlet.resource.NoResourceFoundException.class)
public Result<Void> handleNoResourceFoundException(
        org.springframework.web.servlet.resource.NoResourceFoundException e) {
    log.error("找不到资源: {}", e.getMessage());
    log.error("请求路径: {}", e.getResourcePath());
    return Result.error(404, "请求的资源不存在: " + e.getResourcePath());
}
```

**作用**：
- 捕获 Spring Boot 3.x 特有的异常
- 提供更详细的错误信息
- 便于调试和定位问题

### 修复3：确认权限注解（已完成）

**文件**：`AdminProfileController.java`

```java
@PreAuthorize("hasAuthority('admin')")  // ✅ 正确
// 而不是
@PreAuthorize("hasRole('ADMIN')")      // ❌ 错误
```

## 重启后端服务

### 步骤1：停止服务
```bash
# 在 IDEA 中点击停止按钮
# 或按 Ctrl+F2
```

### 步骤2：清理编译
```bash
cd g:\muying\muying-mall
mvn clean compile
```

### 步骤3：重新启动
```bash
# 在 IDEA 中点击运行按钮
# 或按 Shift+F10
```

### 步骤4：验证启动
查看日志，应该看到：
```
Started MuyingMallApplication in X.XXX seconds
```

**不应该看到**：
```
❌ No static resource admin/profile/info
❌ No static resource admin/profile/statistics
```

## 验证修复

### 1. 测试 API 接口

```bash
# 测试 /info 接口
curl -X GET http://localhost:8080/api/admin/profile/info \
  -H "Authorization: Bearer YOUR_TOKEN"

# 测试 /statistics 接口
curl -X GET http://localhost:8080/api/admin/profile/statistics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**预期响应**：
```json
{
  "code": 200,
  "success": true,
  "data": { ... }
}
```

### 2. 测试前端页面

1. 刷新浏览器：`http://localhost:3000/profile`
2. 打开开发者工具（F12）→ Network 标签
3. 查看请求状态：
   - `/admin/profile/info` → 200 OK ✅
   - `/admin/profile/statistics` → 200 OK ✅

### 3. 检查日志

后端日志应该显示：
```
Mapped "{[/admin/profile/info],methods=[GET]}" onto ...
Mapped "{[/admin/profile/statistics],methods=[GET]}" onto ...
```

## 如果仍然报错

### 问题1：编译错误

```bash
# 查看完整的编译错误
mvn clean compile -X

# 修复错误后重新编译
mvn clean install -DskipTests
```

### 问题2：端口冲突

```bash
# 检查 8080 端口是否被占用
netstat -ano | findstr :8080

# 如果被占用，杀死进程
taskkill /PID <PID> /F
```

### 问题3：缓存问题

```bash
# 清理 IDEA 缓存
# File → Invalidate Caches / Restart

# 清理 Maven 缓存
mvn clean
```

## 技术细节

### Spring Boot 3.x 的变化

1. **Jakarta EE 9+**
   - `javax.*` → `jakarta.*`
   - 需要更新依赖

2. **静态资源处理**
   - 默认不再处理 `/**`
   - 需要明确配置资源路径

3. **异常处理**
   - 新增 `NoResourceFoundException`
   - 需要单独处理

4. **路径匹配**
   - 更严格的匹配规则
   - 需要配置 `PathMatchConfigurer`

### 为什么需要 WebMvcConfig？

Spring Boot 3.x 默认的静态资源处理器会尝试处理所有请求，包括 API 请求。通过明确配置静态资源路径，可以避免这个问题。

**原理**：
```
请求 /admin/profile/info
  ↓
1. 检查是否匹配静态资源路径（/upload/**, /static/**）
  ↓ 不匹配
2. 检查是否匹配控制器路径（/admin/**）
  ↓ 匹配
3. 调用 AdminProfileController.getProfileInfo()
```

如果没有明确配置，流程会变成：
```
请求 /admin/profile/info
  ↓
1. 尝试作为静态资源处理（/**）
  ↓ 找不到资源
2. 抛出 NoResourceFoundException
  ↓
3. 返回 404 或错误信息
```

## 相关文件

### 新增文件
- `muying-mall/src/main/java/com/muyingmall/config/WebMvcConfig.java`

### 修改文件
- `muying-mall/src/main/java/com/muyingmall/common/exception/GlobalExceptionHandler.java`
- `muying-mall/src/main/java/com/muyingmall/controller/admin/AdminProfileController.java`
- `muying-admin/src/lib/api/profile.ts`

## 设计原则

### KISS (Keep It Simple, Stupid)
- 直接配置静态资源路径
- 不引入复杂的路由规则

### YAGNI (You Aren't Gonna Need It)
- 只配置必要的静态资源路径
- 不添加额外的拦截器或过滤器

### SOLID
- **单一职责**：WebMvcConfig 只负责 Web 配置
- **开闭原则**：通过配置扩展，不修改核心代码

## 参考资料

- [Spring Boot 3.0 Migration Guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.0-Migration-Guide)
- [Spring MVC Static Resources](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-config/static-resources.html)
- [NoResourceFoundException](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/servlet/resource/NoResourceFoundException.html)

---

**修复时间**：2025-11-14  
**Spring Boot 版本**：3.2.0  
**遵循协议**：AURA-X-KYS (KISS/YAGNI/SOLID)  
**修复状态**：✅ 已完成，等待重启验证
