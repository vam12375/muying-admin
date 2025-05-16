import { ref, onMounted, computed, markRaw } from 'vue'
import { 
  User, 
  ShoppingBag, 
  ShoppingCart, 
  Money, 
  HomeFilled, 
  Bell, 
  InfoFilled 
} from '@element-plus/icons-vue'
import LineChart from '@/components/charts/LineChart/index.vue'
import PieChart from '@/components/charts/PieChart/index.vue'
import BarChart from '@/components/charts/BarChart/index.vue'
import gsap from 'gsap'
import { ElMessage } from 'element-plus'
import { 
  getDashboardStats, 
  getOrderTrend, 
  getProductCategories, 
  getMonthlySales,
  getTodoItems,
  getUserGrowth
} from '@/api/dashboard'

export default {
  name: 'Dashboard',
  components: {
    LineChart,
    PieChart,
    BarChart,
    HomeFilled: markRaw(HomeFilled),
    Bell: markRaw(Bell),
    InfoFilled: markRaw(InfoFilled)
  },
  setup() {
    // 当前日期
    const currentDate = ref(new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    }))

    // 页面加载状态
    const loading = ref({
      stats: false,
      orderTrend: false,
      categories: false,
      monthlySales: false,
      userGrowth: false,
      todoItems: false,
      systemInfo: false
    })

    // 统计卡片数据
    const statCards = ref([
      { 
        icon: markRaw(User), 
        title: '注册用户', 
        value: '0', 
        type: 'primary' 
      },
      { 
        icon: markRaw(ShoppingBag), 
        title: '商品数量', 
        value: '0', 
        type: 'info' 
      },
      { 
        icon: markRaw(ShoppingCart), 
        title: '总订单数', 
        value: '0', 
        type: 'success' 
      },
      { 
        icon: markRaw(Money), 
        title: '总收入', 
        value: '¥0.00', 
        type: 'warning' 
      }
    ])

    // 订单趋势数据
    const orderTrendData = ref({
      categories: [],
      series: [
        {
          name: '本周订单量',
          data: []
        },
        {
          name: '上周订单量',
          data: []
        }
      ]
    })

    // 商品分类占比数据
    const productCategoryData = ref([])

    // 月度销售额数据
    const monthlySalesData = ref({
      categories: [],
      series: [
        {
          name: '销售额',
          data: []
        }
      ]
    })

    // 用户增长数据
    const userGrowthData = ref({
      categories: [],
      series: [
        {
          name: '新增用户',
          data: []
        }
      ]
    })

    // 待处理事项
    const todoList = ref([])

    // 系统信息
    const systemInfo = ref([
      { label: '系统版本', value: 'v3.0.0' },
      { label: '服务器环境', value: 'Spring Boot 3.0.0' },
      { label: '数据库', value: 'MySQL 8.0' },
      { label: '前端框架', value: 'Vue 3 + Element Plus' },
      { label: '最后更新', value: '2025-06-15' }
    ])

    // 根据数量获取标签类型
    const getTagType = (count) => {
      if (count > 10) return 'danger'
      if (count > 5) return 'warning'
      return 'success'
    }

    // 动画数据加载效果
    const animateNumbers = () => {
      statCards.value.forEach((card) => {
        // 排除非数字的值（如带有货币符号的）
        if (card.value.startsWith('¥')) {
          const value = parseFloat(card.value.substring(1).replace(/,/g, ''))
          const startValue = 0
          gsap.to(card, {
            duration: 2, 
            value: `¥${value.toLocaleString()}`,
            onUpdate: () => {
              const currentValue = gsap.utils.interpolate(startValue, value, gsap.getProperty(card, 'progress') || 0)
              card.value = `¥${currentValue.toFixed(2)}`
            }
          })
        } else if (!isNaN(parseFloat(card.value))) {
          const endValue = parseInt(card.value)
          gsap.fromTo(
            card,
            { value: '0' },
            { 
              duration: 2, 
              value: endValue.toString(),
              ease: 'power2.out' 
            }
          )
        }
      })
    }

    // 获取统计数据
    const fetchDashboardStats = async () => {
      loading.value.stats = true
      try {
        console.log('开始获取统计数据...')
        const res = await getDashboardStats()
        console.log('获取统计数据结果:', res)
        if (res.success) {
          const stats = res.data
          
          // 更新统计卡片数据
          statCards.value[0].value = stats.userCount.toString()
          statCards.value[1].value = stats.productCount.toString()
          statCards.value[2].value = stats.orderCount.toString()
          statCards.value[3].value = `¥${stats.totalIncome.toFixed(2)}`
          
          // 动画展示数据
          animateNumbers()
        }
      } catch (error) {
        console.error('获取统计数据失败:', error)
        ElMessage.error('获取统计数据失败，使用模拟数据')
        
        // 使用模拟数据
        statCards.value[0].value = '128'
        statCards.value[1].value = '57'
        statCards.value[2].value = '246'
        statCards.value[3].value = '¥15890.75'
        
        // 动画展示数据
        animateNumbers()
      } finally {
        loading.value.stats = false
      }
    }
    
    // 获取订单趋势数据
    const fetchOrderTrend = async () => {
      loading.value.orderTrend = true
      try {
        const res = await getOrderTrend(7)
        if (res.success) {
          const trendData = res.data
          
          // 更新订单趋势数据
          orderTrendData.value.categories = trendData.dates
          orderTrendData.value.series[0].data = trendData.currentPeriod
          orderTrendData.value.series[1].data = trendData.previousPeriod
        }
      } catch (error) {
        console.error('获取订单趋势数据失败:', error)
        ElMessage.error('获取订单趋势数据失败，使用模拟数据')
        
        // 使用模拟数据
        orderTrendData.value.categories = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        orderTrendData.value.series[0].data = [25, 32, 28, 36, 42, 50, 45]
        orderTrendData.value.series[1].data = [20, 25, 22, 30, 35, 43, 38]
      } finally {
        loading.value.orderTrend = false
      }
    }
    
    // 获取商品分类数据
    const fetchProductCategories = async () => {
      loading.value.categories = true
      try {
        const res = await getProductCategories()
        if (res.success) {
          productCategoryData.value = res.data
        }
      } catch (error) {
        console.error('获取商品分类数据失败:', error)
        ElMessage.error('获取商品分类数据失败，使用模拟数据')
        
        // 使用模拟数据
        productCategoryData.value = [
          { value: 32, name: '婴儿奶粉' },
          { value: 24, name: '尿不湿' },
          { value: 16, name: '婴儿服装' },
          { value: 12, name: '婴儿玩具' },
          { value: 8, name: '婴儿洗护' },
          { value: 8, name: '其他' }
        ]
      } finally {
        loading.value.categories = false
      }
    }
    
    // 获取月度销售额数据
    const fetchMonthlySales = async () => {
      loading.value.monthlySales = true
      try {
        const res = await getMonthlySales(6)
        if (res.success) {
          const salesData = res.data
          
          // 更新月度销售额数据
          monthlySalesData.value.categories = salesData.months
          monthlySalesData.value.series[0].data = salesData.sales
        }
      } catch (error) {
        console.error('获取月度销售额数据失败:', error)
        ElMessage.error('获取月度销售额数据失败，使用模拟数据')
        
        // 使用模拟数据
        monthlySalesData.value.categories = ['1月', '2月', '3月', '4月', '5月', '6月']
        monthlySalesData.value.series[0].data = [11500, 13200, 12800, 15500, 16800, 19200]
      } finally {
        loading.value.monthlySales = false
      }
    }
    
    // 获取用户增长数据
    const fetchUserGrowth = async () => {
      loading.value.userGrowth = true
      try {
        const res = await getUserGrowth(6)
        if (res.success) {
          const growthData = res.data
          
          // 更新用户增长数据
          userGrowthData.value.categories = growthData.months
          userGrowthData.value.series[0].data = growthData.growth
        }
      } catch (error) {
        console.error('获取用户增长数据失败:', error)
        ElMessage.error('获取用户增长数据失败，使用模拟数据')
        
        // 使用模拟数据
        userGrowthData.value.categories = ['1月', '2月', '3月', '4月', '5月', '6月']
        userGrowthData.value.series[0].data = [25, 32, 28, 36, 42, 50]
      } finally {
        loading.value.userGrowth = false
      }
    }
    
    // 获取待处理事项数据
    const fetchTodoItems = async () => {
      loading.value.todoItems = true
      try {
        const res = await getTodoItems()
        if (res.success) {
          todoList.value = res.data
        }
      } catch (error) {
        console.error('获取待处理事项数据失败:', error)
        ElMessage.error('获取待处理事项数据失败，使用模拟数据')
        
        // 使用模拟数据
        todoList.value = [
          { title: '待审核商品', count: 5 },
          { title: '待发货订单', count: 12 },
          { title: '待处理退款', count: 3 },
          { title: '库存预警商品', count: 8 }
        ]
      } finally {
        loading.value.todoItems = false
      }
    }

    // 加载所有仪表盘数据
    const fetchAllDashboardData = () => {
      // 设置为false使用真实API数据
      const useMockData = false;
      
      if (useMockData) {
        console.log('使用模拟数据模式');
        // 模拟数据 - 统计卡片
        statCards.value[0].value = '128';
        statCards.value[1].value = '57';
        statCards.value[2].value = '246';
        statCards.value[3].value = '¥15890.75';
        animateNumbers();
        
        // 模拟数据 - 订单趋势
        orderTrendData.value.categories = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        orderTrendData.value.series[0].data = [25, 32, 28, 36, 42, 50, 45];
        orderTrendData.value.series[1].data = [20, 25, 22, 30, 35, 43, 38];
        
        // 模拟数据 - 商品分类
        productCategoryData.value = [
          { value: 32, name: '婴儿奶粉' },
          { value: 24, name: '尿不湿' },
          { value: 16, name: '婴儿服装' },
          { value: 12, name: '婴儿玩具' },
          { value: 8, name: '婴儿洗护' },
          { value: 8, name: '其他' }
        ];
        
        // 模拟数据 - 月度销售额
        monthlySalesData.value.categories = ['1月', '2月', '3月', '4月', '5月', '6月'];
        monthlySalesData.value.series[0].data = [11500, 13200, 12800, 15500, 16800, 19200];
        
        // 模拟数据 - 用户增长
        userGrowthData.value.categories = ['1月', '2月', '3月', '4月', '5月', '6月'];
        userGrowthData.value.series[0].data = [25, 32, 28, 36, 42, 50];
        
        // 模拟数据 - 待处理事项
        todoList.value = [
          { title: '待审核商品', count: 5 },
          { title: '待发货订单', count: 12 },
          { title: '待处理退款', count: 3 },
          { title: '库存预警商品', count: 8 }
        ];
        
        // 设置加载状态为false
        loading.value.stats = false;
        loading.value.orderTrend = false;
        loading.value.categories = false;
        loading.value.monthlySales = false;
        loading.value.userGrowth = false;
        loading.value.todoItems = false;
        loading.value.systemInfo = false;
      } else {
        fetchDashboardStats()
        fetchOrderTrend()
        fetchProductCategories()
        fetchMonthlySales()
        fetchUserGrowth()
        fetchTodoItems()
      }
    }

    onMounted(() => {
      fetchAllDashboardData()
    })

    return {
      currentDate,
      loading,
      statCards,
      orderTrendData,
      productCategoryData,
      monthlySalesData,
      userGrowthData,
      todoList,
      systemInfo,
      getTagType,
      fetchAllDashboardData
    }
  }
} 