/**
 * 业务视图组件导出
 * Business View Components Export
 */

// 仪表盘
export { OverviewView } from './dashboard/OverviewView';
export { OverviewViewEnhanced } from './dashboard/OverviewViewEnhanced';

// 商品管理
export { ProductsView } from './products/ProductsView';
export { BrandsView } from './products/BrandsView';
export { CategoriesView } from './products/CategoriesView';

// 订单管理
export { OrdersView } from './orders/OrdersView';

// 评价管理
export { ReviewsView } from './reviews/ReviewsView';
export { ReviewsViewEnhanced } from './reviews/ReviewsViewEnhanced';

// 优惠券管理
export { CouponsView } from './coupons/CouponsView';

// 积分管理
export { PointsViewPlaceholder as PointsView } from './points/PointsViewPlaceholder';

// 消息管理
export { MessagesViewEnhanced as MessagesView } from './messages/MessagesViewEnhanced';

// 物流管理
// 注意：LogisticsView 使用 default export，这里重新导出为 named export 以保持一致性
export { default as LogisticsView } from './logistics/LogisticsView';

// 售后管理
export { AfterSalesView } from './after-sales/AfterSalesView';

// 用户管理
export { UsersView } from './users/UsersView';
