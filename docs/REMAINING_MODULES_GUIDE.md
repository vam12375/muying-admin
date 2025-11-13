# 🔄 剩余模块更新指南

## ✅ 已完成模块 (3/11)

1. ✅ CouponsView - 优惠券管理
2. ✅ PointsView - 积分管理  
3. ✅ ReviewsView - 评价管理

---

## 📋 待更新模块 (8/11)

### 1. MessagesView - 消息管理

**API接口：** `messagesApi`

**更新步骤：**

```typescript
// 1. 导入API
import { messagesApi } from '@/lib/api';

// 2. 添加状态
const [messages, setMessages] = useState([]);
const [stats, setStats] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// 3. 加载数据
useEffect(() => {
  loadMessages();
  loadStats();
}, []);

const loadMessages = async () => {
  try {
    setLoading(true);
    const response = await messagesApi.getList(1, 10);
    if (response.success) {
      const formatted = response.data.records?.map(item => ({
        id: item.messageId?.toString(),
        title: item.title,
        content: item.content,
        type: item.messageType, // 'system' | 'order' | 'promotion'
        status: item.isRead ? 'read' : 'unread',
        date: item.createTime,
      }));
      setMessages(formatted);
    }
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

const loadStats = async () => {
  try {
    const response = await messagesApi.getStats();
    if (response.success) {
      setStats(response.data);
    }
  } catch (err) {
    console.error('加载统计失败:', err);
  }
};

// 4. 标记已读
const handleMarkAsRead = async (messageId: string) => {
  try {
    await messagesApi.markAsRead(parseInt(messageId));
    loadMessages();
  } catch (err) {
    console.error('标记失败:', err);
  }
};
```

---

### 2. LogisticsView - 物流管理

**API接口：** `logisticsApi`

**更新步骤：**

```typescript
// 1. 导入API
import { logisticsApi } from '@/lib/api';

// 2. 添加状态
const [logistics, setLogistics] = useState([]);
const [loading, setLoading] = useState(true);

// 3. 加载数据（示例：获取订单物流）
const loadLogistics = async (orderId: number) => {
  try {
    setLoading(true);
    const response = await logisticsApi.getByOrderId(orderId);
    if (response.success) {
      const formatted = {
        id: response.data.id?.toString(),
        companyName: response.data.companyName,
        companyCode: response.data.companyCode,
        trackingNo: response.data.trackingNo,
        phone: response.data.phone,
        website: response.data.website,
        orderCount: response.data.orderCount || 0,
        status: response.data.status === 1 ? 'active' : 'inactive',
      };
      setLogistics([formatted]);
    }
  } catch (err) {
    console.error('加载物流失败:', err);
  } finally {
    setLoading(false);
  }
};

// 注意：如果需要获取所有物流公司列表，可能需要后端添加新接口
// 或者从订单列表中提取物流信息
```

---

### 3. AfterSalesView - 售后管理

**API接口：** `afterSalesApi`

**更新步骤：**

```typescript
// 1. 导入API
import { afterSalesApi } from '@/lib/api';

// 2. 添加状态
const [afterSales, setAfterSales] = useState([]);
const [stats, setStats] = useState(null);
const [loading, setLoading] = useState(true);

// 3. 加载数据
const loadAfterSales = async () => {
  try {
    setLoading(true);
    const response = await afterSalesApi.getList(1, 10);
    if (response.success) {
      const formatted = response.data.records?.map(item => ({
        id: item.refundId?.toString(),
        orderId: item.orderId?.toString(),
        customerName: item.userName || '未知用户',
        type: item.refundType, // 'refund' | 'return' | 'exchange'
        reason: item.refundReason,
        amount: item.refundAmount,
        status: item.status, // 'pending' | 'processing' | 'completed' | 'rejected'
        date: item.createTime,
      }));
      setAfterSales(formatted);
    }
  } catch (err) {
    console.error('加载售后失败:', err);
  } finally {
    setLoading(false);
  }
};

const loadStats = async () => {
  try {
    const response = await afterSalesApi.getStats();
    if (response.success) {
      setStats(response.data);
    }
  } catch (err) {
    console.error('加载统计失败:', err);
  }
};
```

---

### 4. OrdersView - 订单管理

**API接口：** `ordersApi`

**更新步骤：**

```typescript
// 1. 导入API
import { ordersApi } from '@/lib/api';

// 2. 添加状态
const [orders, setOrders] = useState([]);
const [stats, setStats] = useState(null);
const [loading, setLoading] = useState(true);

// 3. 加载数据
const loadOrders = async () => {
  try {
    setLoading(true);
    const response = await ordersApi.getList(1, 10);
    if (response.success) {
      const formatted = response.data.list?.map(item => ({
        id: item.orderId?.toString(),
        orderNo: item.orderNo,
        customerName: item.userName || '未知用户',
        products: item.products || [],
        totalAmount: item.totalAmount,
        status: item.status, // 'pending_payment' | 'pending_shipment' | 'shipped' | 'completed' | 'cancelled'
        date: item.createTime,
      }));
      setOrders(formatted);
    }
  } catch (err) {
    console.error('加载订单失败:', err);
  } finally {
    setLoading(false);
  }
};

// 4. 更新订单状态
const handleUpdateStatus = async (orderId: string, status: string) => {
  try {
    await ordersApi.updateStatus(parseInt(orderId), status);
    loadOrders();
  } catch (err) {
    console.error('更新状态失败:', err);
  }
};
```

---

### 5. ProductsView - 商品管理

**API接口：** `productsApi`

**更新步骤：**

```typescript
// 1. 导入API
import { productsApi } from '@/lib/api';

// 2. 添加状态
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);

// 3. 加载数据
const loadProducts = async () => {
  try {
    setLoading(true);
    const response = await productsApi.getList(1, 10);
    if (response.success) {
      const formatted = response.data.records?.map(item => ({
        id: item.productId?.toString(),
        name: item.productName,
        image: item.productImg,
        price: item.price,
        stock: item.stock,
        category: item.categoryName,
        brand: item.brandName,
        status: item.status === 1 ? 'active' : 'inactive',
        sales: item.sales || 0,
      }));
      setProducts(formatted);
    }
  } catch (err) {
    console.error('加载商品失败:', err);
  } finally {
    setLoading(false);
  }
};

// 4. 更新商品状态
const handleUpdateStatus = async (productId: string, status: number) => {
  try {
    await productsApi.updateStatus(parseInt(productId), status);
    loadProducts();
  } catch (err) {
    console.error('更新状态失败:', err);
  }
};
```

---

### 6. UsersView - 用户管理

**API接口：** `customersApi`

**更新步骤：**

```typescript
// 1. 导入API
import { customersApi } from '@/lib/api';

// 2. 添加状态
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);

// 3. 加载数据
const loadUsers = async () => {
  try {
    setLoading(true);
    const response = await customersApi.getList(1, 10);
    if (response.success) {
      const formatted = response.data.records?.map(item => ({
        id: item.userId?.toString(),
        username: item.username,
        nickname: item.nickname,
        avatar: item.avatar,
        phone: item.phone,
        email: item.email,
        status: item.status === 1 ? 'active' : 'inactive',
        registerDate: item.createTime,
      }));
      setUsers(formatted);
    }
  } catch (err) {
    console.error('加载用户失败:', err);
  } finally {
    setLoading(false);
  }
};

// 4. 更新用户状态
const handleUpdateStatus = async (userId: string, status: number) => {
  try {
    await customersApi.updateStatus(parseInt(userId), status);
    loadUsers();
  } catch (err) {
    console.error('更新状态失败:', err);
  }
};
```

---

### 7. OverviewView - 仪表盘

**API接口：** `dashboardApi`

**更新步骤：**

```typescript
// 1. 导入API
import { dashboardApi } from '@/lib/api';

// 2. 添加状态
const [stats, setStats] = useState(null);
const [orderTrend, setOrderTrend] = useState([]);
const [loading, setLoading] = useState(true);

// 3. 加载数据
const loadDashboardData = async () => {
  try {
    setLoading(true);
    
    // 加载统计数据
    const statsResponse = await dashboardApi.getStats();
    if (statsResponse.success) {
      setStats(statsResponse.data);
    }
    
    // 加载订单趋势
    const trendResponse = await dashboardApi.getOrderTrend(7);
    if (trendResponse.success) {
      setOrderTrend(trendResponse.data);
    }
  } catch (err) {
    console.error('加载仪表盘数据失败:', err);
  } finally {
    setLoading(false);
  }
};

// 4. 使用统计数据
const totalOrders = stats?.totalOrders || 0;
const totalRevenue = stats?.totalRevenue || 0;
const totalUsers = stats?.totalUsers || 0;
const totalProducts = stats?.totalProducts || 0;
```

---

### 8. SettingsView - 系统设置

**API接口：** `systemApi`

**更新步骤：**

```typescript
// 1. 导入API
import { systemApi } from '@/lib/api';

// 2. 添加状态
const [monitorData, setMonitorData] = useState(null);
const [config, setConfig] = useState(null);
const [logs, setLogs] = useState([]);
const [loading, setLoading] = useState(true);

// 3. 加载监控数据
const loadMonitorData = async () => {
  try {
    const response = await systemApi.getMonitorData();
    if (response.success) {
      setMonitorData(response.data);
    }
  } catch (err) {
    console.error('加载监控数据失败:', err);
  }
};

// 4. 加载配置
const loadConfig = async () => {
  try {
    const response = await systemApi.getConfig();
    if (response.success) {
      setConfig(response.data);
    }
  } catch (err) {
    console.error('加载配置失败:', err);
  }
};

// 5. 加载日志
const loadLogs = async () => {
  try {
    const response = await systemApi.getLogs(1, 10);
    if (response.success) {
      setLogs(response.data.records || []);
    }
  } catch (err) {
    console.error('加载日志失败:', err);
  }
};

// 6. 更新配置
const handleUpdateConfig = async (newConfig: any) => {
  try {
    await systemApi.updateConfig(newConfig);
    loadConfig();
  } catch (err) {
    console.error('更新配置失败:', err);
  }
};
```

---

## 🎯 通用代码模板

### 加载状态组件

```typescript
// 加载中
if (loading && data.length === 0) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
        <p className="text-slate-500 dark:text-slate-400">加载中...</p>
      </div>
    </div>
  );
}

// 错误状态
if (error) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
        >
          重试
        </button>
      </div>
    </div>
  );
}
```

### 数据格式转换函数

```typescript
// 通用转换函数
const formatData = (items: any[]) => {
  return items?.map(item => ({
    // 根据具体模块调整字段映射
    id: item.id?.toString() || item.xxxId?.toString(),
    // ... 其他字段
  })) || [];
};
```

### useEffect 钩子

```typescript
useEffect(() => {
  loadData();
}, [currentPage, filterStatus]); // 根据需要添加依赖
```

---

## 📝 注意事项

### 1. 错误处理

- 所有API调用都要用 try-catch 包裹
- 错误信息要显示给用户
- 提供重试按钮

### 2. 加载状态

- 首次加载显示加载动画
- 后续加载可以显示骨架屏或保留旧数据

### 3. 数据格式

- 后端字段名可能与前端不同，需要转换
- 注意处理 null/undefined 值
- 使用可选链操作符 `?.`

### 4. 性能优化

- 避免不必要的重新渲染
- 使用 useMemo 缓存计算结果
- 使用 useCallback 缓存函数

### 5. 用户体验

- 操作后给予反馈（成功/失败提示）
- 保持原有的动画效果
- 响应式设计要正常工作

---

## 🧪 测试步骤

对于每个更新的模块：

1. **功能测试**
   - [ ] 数据正确加载
   - [ ] 加载状态正确显示
   - [ ] 错误处理正常
   - [ ] 操作功能正常（增删改查）

2. **UI测试**
   - [ ] 动画效果正常
   - [ ] 响应式布局正常
   - [ ] 深色模式正常

3. **性能测试**
   - [ ] 加载速度合理
   - [ ] 无内存泄漏
   - [ ] 动画流畅

---

## 🚀 快速实施

### 批量更新脚本

可以按以下顺序快速更新：

1. 先更新简单的只读模块（MessagesView, LogisticsView）
2. 再更新需要操作的模块（OrdersView, ProductsView）
3. 最后更新复杂的模块（OverviewView, SettingsView）

### 时间估算

- 简单模块：15-20分钟/个
- 中等模块：30-40分钟/个
- 复杂模块：45-60分钟/个

总计：约 3-4 小时完成所有剩余模块

---

**最后更新**: 2024-11-13  
**当前进度**: 3/11 模块已完成 (27%)  
**剩余工作**: 8个模块待更新
