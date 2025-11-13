# 常用模式和最佳实践

- 图表组件实现模式：基于Recharts封装了LineChart、BarChart、PieChart三个图表组件，统一使用Framer Motion动画，支持深色模式，提供formatter自定义格式化。所有图表组件位于src/components/charts/目录，通过index.ts统一导出。
- API错误处理模式：fetchApi函数实现了完善的错误处理机制，包括401/403自动跳转登录、网络错误提示、业务逻辑错误处理。支持白名单路径（不需要token），自动添加Authorization头，统一处理Result<T>和CommonResult<T>两种响应格式。参考自muying-admin-react/src/utils/request.ts。
