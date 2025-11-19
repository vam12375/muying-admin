# 性能优化说明

## 优化内容

### 后端优化（muying-mall）

1. **Redis缓存增强**
   - 新增 `@Cacheable` 和 `@CacheEvict` 注解
   - 创建 `CacheAspect` 切面自动处理缓存
   - 已有Service（UserService、ProductService、BrandService）已集成缓存

2. **缓存策略**
   - 用户信息：1小时
   - 商品列表：30分钟
   - 品牌列表：2小时
   - 热门商品：30分钟

### 前端优化（muying-admin）

1. **Next.js配置优化**
   - 启用图片优化（WebP/AVIF）
   - 配置图片缓存策略
   - 启用Gzip压缩
   - 优化响应头

2. **前端缓存层**
   - `apiCache.ts`: 内存缓存工具
   - `cachedFetch.ts`: 带缓存的API请求
   - 自动缓存GET请求
   - 自动清除相关缓存

3. **图片优化**
   - `OptimizedImage.tsx`: 已有的图片组件（懒加载、占位符）
   - `imagePreloader.ts`: 图片预加载工具
   - 优先级队列管理

4. **性能监控**
   - `performanceMonitor.ts`: 监控工具
   - 跟踪Web Vitals（LCP、FID、CLS）
   - 记录API性能和缓存命中率

## 使用方法

### 后端使用缓存注解

```java
@Cacheable(keyPrefix = CacheConstants.USER_DETAIL_KEY, expireTime = 3600)
public User getUserById(Integer id) {
    return userMapper.selectById(id);
}

@CacheEvict(keyPrefixes = {CacheConstants.USER_DETAIL_KEY, CacheConstants.USER_LIST_KEY})
public boolean updateUser(User user) {
    return userMapper.updateById(user) > 0;
}
```

### 前端使用缓存API

```typescript
import { cachedFetch } from '@/lib/api/cachedFetch';

// 自动缓存5分钟
const data = await cachedFetch('/admin/brands', {
  cache: true,
  cacheTTL: 5 * 60 * 1000,
});
```

### 使用优化的图片组件

```tsx
import { OptimizedImage } from '@/components/common/OptimizedImage';

<OptimizedImage
  src="product.jpg"
  alt="商品图片"
  folder="products"
  lazy={true}
  width={200}
  height={200}
/>
```

## 预期效果

- **LCP**: 从 40.77s 降至 2-3s
- **缓存命中率**: 60-80%
- **API响应时间**: 减少70-90%（缓存命中时）
- **首屏加载**: 减少50-70%

## 监控

开发环境下，每30秒自动打印性能报告：
```
📊 Performance Report
Web Vitals: { lcp: 2500, fid: 50, cls: 0.1 }
API Metrics: { cacheHitRate: "75%", avgDuration: "120ms" }
```
