# 🔧 故障排除指南

## 常见问题及解决方案

### 1. 订单管理页面显示"系统繁忙，请稍后再试"

**问题描述**:
访问订单管理页面时，出现错误提示："系统繁忙，请稍后再试"

后端日志显示：`No static resource admin/orders`

**根本原因**:
API 请求路径不正确，缺少 `/api` 前缀或 `API_BASE_URL` 配置错误。

**可能原因**:
1. 环境变量 `NEXT_PUBLIC_API_URL` 未配置
2. 后端服务未启动或无法访问
3. 后端数据库连接失败
4. CORS 跨域问题

**解决方案**:

#### 方案 1: 配置环境变量（最重要！）

创建 `.env.local` 文件：

```bash
# 在 muying-admin 目录下创建 .env.local 文件
cd muying-admin
echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env.local
```

或者手动创建文件 `muying-admin/.env.local`：

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**重要**: 修改环境变量后，必须重启开发服务器：

```bash
# 停止当前服务器 (Ctrl+C)
# 重新启动
npm run dev
```

#### 方案 2: 检查后端服务状态

```bash
# 检查后端服务是否运行
# 访问: http://localhost:8080/swagger-ui/index.html
```

如果无法访问，启动后端服务：

```bash
cd muying-mall
mvn spring-boot:run
```

#### 方案 3: 检查浏览器控制台

打开浏览器开发者工具 (F12) → Console 标签，查找类似这样的日志：

```
[API Request] {
  endpoint: '/api/admin/orders?page=1&pageSize=10',
  fullUrl: 'http://localhost:8080/api/admin/orders?page=1&pageSize=10',
  method: 'GET',
  hasToken: true
}
```

确认 `fullUrl` 是否正确。如果 URL 不正确，检查环境变量配置。

#### 方案 2: 检查数据库连接

确保 MySQL 数据库正在运行，并且配置正确：

```yaml
# muying-mall/src/main/resources/application.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/muying_mall?useUnicode=true&characterEncoding=utf-8
    username: root
    password: your_password
```

#### 方案 3: 查看后端日志

检查后端控制台输出，查找具体错误信息：

```bash
# 后端日志通常会显示详细的异常堆栈
# 查找类似 "获取订单列表失败" 的错误信息
```

#### 方案 4: 使用模拟数据（临时方案）

如果后端暂时无法使用，可以修改前端代码使用模拟数据：

```typescript
// src/views/orders/OrdersView.tsx
const loadOrders = async () => {
  try {
    setLoading(true);
    setError(null);

    // 临时使用模拟数据
    const mockOrders = [
      {
        orderId: 1,
        orderNo: 'ORD-20241113-001',
        userName: '测试用户',
        actualAmount: 299.00,
        totalAmount: 299.00,
        status: 'pending_payment',
        createTime: new Date().toISOString()
      }
    ];
    
    setOrders(mockOrders);
    setTotal(1);
  } catch (err: any) {
    console.error('加载订单列表失败:', err);
    setError(err.message || '加载失败');
  } finally {
    setLoading(false);
  }
};
```

---

### 2. 商品管理页面无数据

**问题描述**:
商品管理页面显示"暂无商品数据"

**可能原因**:
1. 数据库中没有商品数据
2. API 接口返回空数据
3. 数据格式不匹配

**解决方案**:

#### 方案 1: 检查数据库

```sql
-- 查询商品表
SELECT * FROM product LIMIT 10;

-- 如果没有数据，插入测试数据
INSERT INTO product (product_name, price, stock, status, create_time) 
VALUES ('测试商品', 99.00, 100, 1, NOW());
```

#### 方案 2: 检查 API 响应

打开浏览器开发者工具 (F12)，查看 Network 标签：

1. 找到 `/api/admin/products` 请求
2. 查看 Response 数据格式
3. 确认 `data.records` 或 `data.list` 是否有数据

#### 方案 3: 调整数据映射

如果后端返回的数据格式不同，修改前端代码：

```typescript
// src/views/products/ProductsView.tsx
if (response.success && response.data) {
  const data = response.data;
  // 根据实际返回格式调整
  const productList = data.records || data.list || data.data || [];
  setProducts(productList);
  setTotal(data.total || 0);
}
```

---

### 3. 图表不显示

**问题描述**:
仪表盘的图表（销售趋势、分类分布等）不显示

**可能原因**:
1. 后端 API 返回数据格式不正确
2. 图表数据为空
3. Recharts 库未正确加载

**解决方案**:

#### 方案 1: 检查数据格式

```typescript
// src/views/dashboard/OverviewView.tsx
// 在 loadDashboardData 中添加日志
console.log('Sales data:', salesTrend);
console.log('Category data:', categoryData);
```

#### 方案 2: 使用模拟数据

```typescript
// 临时使用模拟数据
setSalesTrend([
  { month: '1月', sales: 3500 },
  { month: '2月', sales: 4200 },
  { month: '3月', sales: 3800 },
  { month: '4月', sales: 5000 },
  { month: '5月', sales: 4800 },
  { month: '6月', sales: 6000 },
]);
```

#### 方案 3: 检查 Recharts 安装

```bash
# 确认 recharts 已安装
npm list recharts

# 如果未安装，重新安装
npm install recharts
```

---

### 4. 登录后自动跳转到登录页

**问题描述**:
登录成功后，页面自动跳转回登录页

**可能原因**:
1. Token 未正确保存
2. Token 验证失败
3. 后端返回 401/403 错误

**解决方案**:

#### 方案 1: 检查 Token 存储

打开浏览器开发者工具 → Application → Local Storage：

1. 查看是否有 `adminToken` 键
2. 确认 Token 值不为空

#### 方案 2: 检查 API 请求头

在 Network 标签中查看请求：

1. 找到任意 API 请求
2. 查看 Request Headers
3. 确认有 `Authorization: Bearer xxx` 头

#### 方案 3: 修改认证逻辑

```typescript
// src/lib/api.ts
// 在 fetchApi 函数中添加日志
console.log('Token:', token);
console.log('Request URL:', fullUrl);
console.log('Request Headers:', headers);
```

---

### 5. 页面样式错乱

**问题描述**:
页面布局混乱，样式不正常

**可能原因**:
1. Tailwind CSS 未正确编译
2. 浏览器缓存问题
3. CSS 冲突

**解决方案**:

#### 方案 1: 清除缓存并重启

```bash
# 删除 .next 目录
rm -rf .next

# 重新启动开发服务器
npm run dev
```

#### 方案 2: 强制刷新浏览器

- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

#### 方案 3: 检查 Tailwind 配置

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // ...
}
```

---

### 6. API 请求跨域错误

**问题描述**:
浏览器控制台显示 CORS 错误

**可能原因**:
后端未配置 CORS

**解决方案**:

#### 方案 1: 配置后端 CORS

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

#### 方案 2: 使用 Next.js 代理

```javascript
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },
};
```

---

## 调试技巧

### 1. 查看 API 请求详情

打开浏览器开发者工具 (F12) → Network 标签：

1. 刷新页面
2. 找到失败的 API 请求（红色）
3. 点击查看详细信息：
   - Headers: 请求头和响应头
   - Payload: 请求参数
   - Response: 响应数据

### 2. 查看控制台日志

开发者工具 → Console 标签：

1. 查找错误信息（红色）
2. 查找警告信息（黄色）
3. 查找自定义日志（`console.log`）

### 3. 使用 React DevTools

安装 React DevTools 浏览器扩展：

1. 查看组件树
2. 查看组件 Props 和 State
3. 查看组件渲染性能

### 4. 后端日志

查看后端控制台输出：

1. 查找异常堆栈
2. 查找 SQL 语句
3. 查找业务逻辑日志

---

## 联系支持

如果以上方案都无法解决问题：

1. 📧 发送邮件描述问题
2. 🐛 在 GitHub 提交 Issue
3. 💬 加入社区讨论群

提交问题时，请提供：
- 错误截图
- 浏览器控制台日志
- 后端控制台日志
- 操作步骤

---

**最后更新**: 2024-11-13  
**版本**: v2.1.0
