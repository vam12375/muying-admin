import { createRouter, createWebHistory } from 'vue-router'
import { getToken, isAdmin } from '@/utils/auth'
import { ElMessage } from 'element-plus'

// 布局组件
import Layout from '@/layout/index.vue'
// 静态导入登录组件
import LoginView from '@/views/login/index.vue'

// 静态路由
const constantRoutes = [
  {
    path: '/login',
    component: LoginView, // 使用静态导入的组件
    hidden: true,
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'HomeFilled', requiresAuth: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    name: 'User',
    meta: { title: '用户管理', icon: 'user-outlined', requiresAuth: true },
    children: [
      {
        path: 'list',
        name: 'UserList',
        component: () => import('@/views/user/list.vue'),
        meta: { title: '用户列表', icon: 'team-outlined' }
      }
    ]
  },
  {
    path: '/product',
    component: Layout,
    redirect: '/product/list',
    name: 'Product',
    meta: { title: '商品管理', icon: 'shopping-outlined' },
    children: [
      {
        path: 'list',
        name: 'ProductList',
        component: () => import('@/views/product/ProductList.vue'),
        meta: { title: '商品列表', icon: 'unordered-list-outlined' }
      },
      {
        path: 'category',
        name: 'CategoryManage',
        component: () => import('@/views/product/CategoryManage.vue'),
        meta: { title: '分类管理', icon: 'apartment-outlined' }
      },
      {
        path: 'brand',
        name: 'BrandManage',
        component: () => import('@/views/product/BrandManage.vue'),
        meta: { title: '品牌管理', icon: 'trademark-outlined' }
      },
      {
        path: 'analysis',
        name: 'ProductAnalysis',
        component: () => import('@/views/product/analysis/index.vue'),
        meta: { title: '商品分析', icon: 'line-chart-outlined' }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/list',
    meta: { title: '订单管理', icon: 'order', requiresAuth: true },
    children: [
      {
        path: 'list',
        component: () => import('@/views/order/list.vue'),
        name: 'OrderList',
        meta: { title: '订单列表', requiresAuth: true }
      },
      {
        path: 'detail/:id',
        component: () => import('@/views/order/detail.vue'),
        name: 'OrderDetail',
        meta: { title: '订单详情', requiresAuth: true },
        hidden: true
      }
    ]
  },
  {
    path: '/logistics',
    component: Layout,
    redirect: '/logistics/list',
    meta: { title: '物流管理', icon: 'truck', requiresAuth: true },
    children: [
      {
        path: 'list',
        component: () => import('@/views/logistics/list.vue'),
        name: 'LogisticsList',
        meta: { title: '物流列表', requiresAuth: true }
      },
      {
        path: 'detail/:id',
        component: () => import('@/views/logistics/detail.vue'),
        name: 'LogisticsDetail',
        meta: { title: '物流详情', requiresAuth: true },
        hidden: true
      },
      {
        path: 'company',
        component: () => import('@/views/logistics/company.vue'),
        name: 'LogisticsCompany',
        meta: { title: '物流公司管理', requiresAuth: true }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/redis',
    name: 'System',
    meta: { title: '系统管理', icon: 'setting', requiresAuth: true },
    children: [
      {
        path: 'redis',
        name: 'RedisMonitor',
        component: () => import('@/views/system/redis.vue'),
        meta: { title: 'Redis缓存监控', icon: 'data-analysis', requiresAuth: true }
      }
    ]
  },
  // 404页面必须放在最后
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/error/404.vue'),
    hidden: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 获取token
  const hasToken = getToken()
  
  // 判断是否需要登录权限
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 需要登录，检查是否有token
    if (!hasToken) {
      // 没有token，跳转到登录页
      ElMessage.error('请先登录')
      next({ path: '/login' })
    } else {
      // 有token，检查是否为管理员
      if (isAdmin()) {
        // 是管理员，允许访问
        next()
      } else {
        // 不是管理员，提示无权限并跳转到登录页
        ElMessage.error('您没有管理员权限')
        next({ path: '/login' })
      }
    }
  } else {
    // 不需要登录权限的页面
    if (to.path === '/login' && hasToken) {
      // 已登录状态下访问登录页，跳转到首页
      next({ path: '/' })
    } else {
      // 其他情况正常访问
      next()
    }
  }
})

export default router 