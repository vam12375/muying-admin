# 常用模式和最佳实践

- 图表组件实现模式：基于Recharts封装了LineChart、BarChart、PieChart三个图表组件，统一使用Framer Motion动画，支持深色模式，提供formatter自定义格式化。所有图表组件位于src/components/charts/目录，通过index.ts统一导出。
- API错误处理模式：fetchApi函数实现了完善的错误处理机制，包括401/403自动跳转登录、网络错误提示、业务逻辑错误处理。支持白名单路径（不需要token），自动添加Authorization头，统一处理Result<T>和CommonResult<T>两种响应格式。参考自muying-admin-react/src/utils/request.ts。
- 优惠券列表UI重构模式（2024-11-13）：将传统表格布局重构为现代卡片式布局。核心改进：1)优惠券视觉卡片（蓝色固定金额/绿色折扣，带装饰圆圈）；2)操作按钮直接展示（编辑/复制/启用/删除，各有独特hover颜色）；3)统计信息卡片化（已领取/已使用/使用率/剩余）；4)批量操作栏（渐变背景突出显示）；5)Framer Motion动画（卡片入场、hover效果）。遵循KISS原则，提升视觉层次和操作效率。详见COUPON_UI_REDESIGN.md。
- 前后端数据格式转换模式：当后端使用逗号分隔字符串存储多值字段（如categoryIds: "1,2,3"），而前端表单需要数组格式时，应在数据边界处进行转换。读取时：split(',').filter(Boolean)转为数组；提交时：Array.isArray(value) ? value.join(',') : value转为字符串。类型定义使用联合类型支持两种格式：string[] | string。这样保持表单内部操作简单（数组），同时满足后端要求（字符串）。遵循KISS原则。
- 优惠券统计查询NULL值处理模式：在统计活跃优惠券时，需要考虑endTime字段可能为NULL的情况（表示永久有效）。正确的查询逻辑应该是：status='ACTIVE' AND (endTime IS NULL OR endTime > NOW())。使用MyBatis-Plus的LambdaQueryWrapper时，应该用.and(wrapper -> wrapper.isNull().or().gt())来组合条件。同时添加调试日志，当统计结果异常时输出详细信息便于排查。这避免了NULL值导致的统计不准确问题。
- 全局路由记忆功能：使用 localStorage 存储 admin_active_item 和 admin_selected_view，在页面刷新后自动恢复到上次访问的页面。退出登录时清除这些记忆。
