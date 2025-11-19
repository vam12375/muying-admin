# 性能优化最佳实践

## 快速开始

### 1. 应用数据库索引

```bash
# 在MySQL中执行
mysql -u root -p muying_mall < muying-mall/scripts/performance_optimization_indexes.sql
```

### 2. 启用性能配置

在 `application.yml` 中添加：
```yaml
spring:
  profiles:
    active: performance
```

### 3. 前端使用优化组件

```tsx
// 使用骨架屏
import { TableSkeleton } from '@/components/common/Skeleton';

{loading ? <TableSkeleton rows={5} /> : <Table data={data} />}

// 使用并行加载
import { parallelFetch } from '@/lib/utils/parallelFetch';

const data = await parallelFetch({
  users: () => cachedFetch('/admin/users'),
  products: () => cachedFetch('/admin/products'),
});

// 使用资源预加载
import { ResourcePreloader } from '@/components/common/ResourcePreloader';

<ResourcePreloader
  preloadApis={[
    () => cachedFetch('/admin/dashboard/stats'),
  ]}
/>
```

## 关键优化点

### 后端优化

1. **数据库索引**
   - 已添加30+个索引
   - 覆盖高频查询字段
   - 包含复合索引

2. **批量查询**
   - 使用 `BatchQueryService` 避免N+1问题
   - 一次查询获取多条数据

3. **连接池优化**
   - HikariCP: 最大50个连接
   - Redis: 最大20个连接
   - 合理的超时配置

4. **缓存策略**
   - 用户数据: 30分钟
   - 商品数据: 30分钟
   - 品牌数据: 1小时
   - 批量查询: 30分钟

### 前端优化

1. **代码分割**
   - 动态导入大组件
   - 路由级别代码分割

2. **并行加载**
   - 使用 `parallelFetch` 并行请求
   - Dashboard数据并行加载

3. **图片优化**
   - 使用 `OptimizedImage` 组件
   - 懒加载 + 占位符
   - WebP/AVIF格式

4. **缓存策略**
   - API响应缓存（1-10分钟）
   - 图片预加载
   - 资源预加载

5. **骨架屏**
   - 减少布局偏移（CLS）
   - 改善感知性能

## 性能指标

### 优化前
- LCP: 22-40秒
- FID: 未知
- CLS: 未知
- API响应: 500-2000ms

### 优化后（预期）
- LCP: 1-2秒 ✅
- FID: <100ms ✅
- CLS: <0.1 ✅
- API响应: 50-200ms（缓存命中）✅

## 监控

### 开发环境
```javascript
// 查看性能报告
performanceMonitor.printReport();

// 查看缓存统计
apiCache.getStats();
```

### 生产环境
- 使用Chrome DevTools Lighthouse
- 监控Web Vitals
- 跟踪API响应时间

## 常见问题

### Q: 为什么还是慢？
A: 检查以下几点：
1. 数据库索引是否已应用
2. Redis是否正常运行
3. 网络延迟（本地开发环境）
4. 浏览器缓存是否清除

### Q: 如何验证优化效果？
A: 
1. 打开Chrome DevTools
2. 切换到Lighthouse标签
3. 运行性能测试
4. 查看LCP、FID、CLS指标

### Q: 缓存何时失效？
A: 
- 自动失效：根据TTL时间
- 手动失效：调用 `clearCache()` 或 `@CacheEvict`
- 更新操作：POST/PUT/DELETE自动清除相关缓存
