# CLS（累积布局偏移）修复指南

## 什么是CLS？

CLS（Cumulative Layout Shift）衡量页面视觉稳定性。当页面元素在加载过程中移动位置时，就会产生布局偏移。

**评分标准**：
- 优秀：< 0.1
- 需要改进：0.1 - 0.25
- 差：> 0.25

## 常见原因

1. **图片没有尺寸** ❌
2. **动态内容加载** ❌
3. **字体加载** ❌
4. **广告/iframe** ❌
5. **动画效果** ❌

## 已实施的修复

### 1. 图片固定尺寸 ✅

**修改前**：
```tsx
<img src="product.jpg" alt="商品" />
```

**修改后**：
```tsx
<OptimizedImage
  src="product.jpg"
  alt="商品"
  width={200}
  height={200}
/>
```

**效果**：图片容器预设尺寸，防止加载时跳动

### 2. 容器固定高度 ✅

**使用 FixedSizeContainer**：
```tsx
import { TableContainer } from '@/components/common/FixedSizeContainer';

<TableContainer rows={10} rowHeight={60}>
  <Table data={data} />
</TableContainer>
```

**效果**：表格容器预设高度，防止数据加载时跳动

### 3. 骨架屏占位 ✅

**使用 Skeleton**：
```tsx
import { TableSkeleton } from '@/components/common/Skeleton';

{loading ? (
  <TableSkeleton rows={5} columns={5} />
) : (
  <Table data={data} />
)}
```

**效果**：加载时显示占位符，保持布局稳定

### 4. 字体优化 ✅

**使用系统字体栈**：
```css
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

**效果**：无需加载外部字体，避免字体切换导致的偏移

### 5. CSS修复 ✅

**cls-fix.css**：
- 表格固定布局
- 图片容器固定尺寸
- 按钮固定宽度
- 文本防止换行

## 使用指南

### 商品列表页面

```tsx
import { OptimizedImage } from '@/components/common/OptimizedImage';
import { TableContainer } from '@/components/common/FixedSizeContainer';
import { TableSkeleton } from '@/components/common/Skeleton';

export function ProductsView() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  return (
    <TableContainer rows={10} rowHeight={60}>
      {loading ? (
        <TableSkeleton rows={10} columns={6} />
      ) : (
        <table>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="table-row-fixed">
                <td>
                  <OptimizedImage
                    src={product.image}
                    alt={product.name}
                    width={50}
                    height={50}
                  />
                </td>
                <td>{product.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </TableContainer>
  );
}
```

### Dashboard页面

```tsx
import { CardGridContainer } from '@/components/common/FixedSizeContainer';
import { CardSkeleton } from '@/components/common/Skeleton';

export function Dashboard() {
  const [loading, setLoading] = useState(true);

  return (
    <CardGridContainer columns={3} rows={2} cardHeight={200}>
      {loading ? (
        <CardSkeleton count={6} />
      ) : (
        stats.map(stat => <StatCard key={stat.id} {...stat} />)
      )}
    </CardGridContainer>
  );
}
```

## 验证修复效果

1. 打开Chrome DevTools
2. 切换到Lighthouse标签
3. 运行性能测试
4. 查看CLS得分

**预期结果**：
- CLS从0.0007（7次偏移）降至 < 0.1
- 布局偏移次数从7次降至0-2次

## 最佳实践

1. **始终为图片设置width和height**
2. **使用骨架屏占位**
3. **容器预设最小高度**
4. **避免动态插入内容**
5. **使用系统字体**
6. **CSS使用固定布局**

## 常见问题

### Q: 为什么还有偏移？
A: 检查是否所有图片都设置了尺寸，是否使用了骨架屏

### Q: 如何测试CLS？
A: 使用Chrome DevTools Lighthouse或Web Vitals扩展

### Q: 动态内容怎么办？
A: 使用FixedSizeContainer预设容器高度
