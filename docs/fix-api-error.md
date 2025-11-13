# 🔧 修复 "系统繁忙" 错误

## 问题症状

- 订单管理页面显示 "系统繁忙，请稍后再试"
- 后端日志显示：`No static resource admin/orders`
- 浏览器控制台显示：`[API Error] 系统繁忙，请稍后再试`

## 快速修复步骤

### 步骤 1: 创建环境变量文件

在 `muying-admin` 目录下创建 `.env.local` 文件：

```bash
cd muying-admin
```

**Windows (PowerShell)**:
```powershell
echo "NEXT_PUBLIC_API_URL=http://localhost:8080" | Out-File -FilePath .env.local -Encoding utf8
```

**Windows (CMD)**:
```cmd
echo NEXT_PUBLIC_API_URL=http://localhost:8080 > .env.local
```

**Mac/Linux**:
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env.local
```

或者手动创建文件，内容如下：

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 步骤 2: 重启前端开发服务器

**重要**: 修改环境变量后必须重启！

```bash
# 1. 停止当前服务器
# 按 Ctrl+C

# 2. 重新启动
npm run dev
```

### 步骤 3: 确认后端服务运行

```bash
# 在另一个终端窗口
cd muying-mall
mvn spring-boot:run
```

或者访问 Swagger UI 确认：
```
http://localhost:8080/swagger-ui/index.html
```

### 步骤 4: 清除浏览器缓存

- **Windows**: `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`

### 步骤 5: 验证修复

1. 打开浏览器开发者工具 (F12)
2. 切换到 Console 标签
3. 刷新页面
4. 查找类似这样的日志：

```
[API Request] {
  endpoint: '/api/admin/orders?page=1&pageSize=10',
  fullUrl: 'http://localhost:8080/api/admin/orders?page=1&pageSize=10',
  method: 'GET',
  hasToken: true
}
```

5. 确认 `fullUrl` 包含完整的 URL

---

## 如果问题仍然存在

### 检查 1: 环境变量是否生效

在浏览器控制台执行：

```javascript
console.log('API_BASE_URL:', process.env.NEXT_PUBLIC_API_URL);
```

应该输出：`http://localhost:8080`

### 检查 2: 后端 CORS 配置

确认后端允许跨域请求。检查后端是否有 CORS 配置：

```java
// muying-mall/src/main/java/com/muyingmall/config/CorsConfig.java
@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");
        config.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}
```

### 检查 3: 网络请求详情

在浏览器开发者工具 → Network 标签：

1. 找到失败的请求（红色）
2. 查看 Request URL
3. 查看 Response

**正确的 Request URL 应该是**:
```
http://localhost:8080/api/admin/orders?page=1&pageSize=10
```

**错误的 Request URL 可能是**:
```
http://localhost:8080/admin/orders?page=1&pageSize=10  (缺少 /api)
http://localhost:3000/api/admin/orders?page=1&pageSize=10  (错误的端口)
```

---

## 常见错误及解决方案

### 错误 1: 环境变量未生效

**原因**: 修改环境变量后未重启服务器

**解决**: 停止服务器 (Ctrl+C)，然后重新运行 `npm run dev`

### 错误 2: 后端服务未启动

**症状**: 浏览器显示 "Failed to fetch" 或 "网络连接失败"

**解决**: 启动后端服务 `mvn spring-boot:run`

### 错误 3: 端口冲突

**症状**: 前端或后端无法启动

**解决**:
- 前端: 修改端口 `npm run dev -- -p 3001`
- 后端: 修改 `application.yml` 中的 `server.port`

### 错误 4: Token 失效

**症状**: 自动跳转到登录页

**解决**: 重新登录获取新的 Token

---

## 验证修复成功

修复成功后，你应该看到：

1. ✅ 订单管理页面正常显示
2. ✅ 统计卡片显示数据（待支付、待发货等）
3. ✅ 订单列表显示数据
4. ✅ 浏览器控制台无错误信息
5. ✅ 后端日志无异常

---

## 需要帮助？

如果以上步骤都无法解决问题：

1. 📸 截图浏览器控制台的完整错误信息
2. 📋 复制后端控制台的完整日志
3. 📝 描述你的操作步骤
4. 💬 在 GitHub 提交 Issue 或联系技术支持

---

**最后更新**: 2024-11-13  
**适用版本**: v2.1.0
