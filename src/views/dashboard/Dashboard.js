import { ref, onMounted, computed } from 'vue'
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

export default {
  name: 'Dashboard',
  components: {
    LineChart,
    PieChart,
    BarChart,
    HomeFilled,
    Bell,
    InfoFilled
  },
  setup() {
    // 当前日期
    const currentDate = ref(new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    }))

    // 统计卡片数据
    const statCards = ref([
      { 
        icon: User, 
        title: '注册用户', 
        value: '128', 
        type: 'primary' 
      },
      { 
        icon: ShoppingBag, 
        title: '商品数量', 
        value: '57', 
        type: 'info' 
      },
      { 
        icon: ShoppingCart, 
        title: '总订单数', 
        value: '246', 
        type: 'success' 
      },
      { 
        icon: Money, 
        title: '总收入', 
        value: '¥15,890.75', 
        type: 'warning' 
      }
    ])

    // 订单趋势数据
    const orderTrendData = ref({
      categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      series: [
        {
          name: '本周订单量',
          data: [25, 32, 28, 36, 42, 50, 45]
        },
        {
          name: '上周订单量',
          data: [20, 25, 22, 30, 35, 43, 38]
        }
      ]
    })

    // 商品分类占比数据
    const productCategoryData = ref([
      { value: 32, name: '婴儿奶粉' },
      { value: 24, name: '尿不湿' },
      { value: 16, name: '婴儿服装' },
      { value: 12, name: '婴儿玩具' },
      { value: 8, name: '婴儿洗护' },
      { value: 8, name: '其他' }
    ])

    // 月度销售额数据
    const monthlySalesData = ref({
      categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
      series: [
        {
          name: '销售额',
          data: [11500, 13200, 12800, 15500, 16800, 19200]
        }
      ]
    })

    // 用户增长数据
    const userGrowthData = ref({
      categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
      series: [
        {
          name: '新增用户',
          data: [25, 32, 28, 36, 42, 50]
        }
      ]
    })

    // 待处理事项
    const todoList = ref([
      { title: '待审核商品', count: 5 },
      { title: '待发货订单', count: 12 },
      { title: '待处理退款', count: 3 },
      { title: '库存预警商品', count: 8 }
    ])

    // 系统信息
    const systemInfo = ref([
      { label: '系统版本', value: 'v1.0.0' },
      { label: '服务器环境', value: 'Spring Boot 3.0.0' },
      { label: '数据库', value: 'MySQL 8.0' },
      { label: '前端框架', value: 'Vue 3 + Element Plus' },
      { label: '最后更新', value: '2023-06-15' }
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

    // 假设API调用
    const fetchDashboardData = () => {
      // 模拟API调用延迟
      setTimeout(() => {
        // 在实际项目中，这里会发送真实的API请求
        // 为了演示，这里使用静态数据
        
        // 动画展示数据
        animateNumbers()
      }, 500)
    }

    onMounted(() => {
      fetchDashboardData()
    })

    return {
      currentDate,
      statCards,
      orderTrendData,
      productCategoryData,
      monthlySalesData,
      userGrowthData,
      todoList,
      systemInfo,
      getTagType
    }
  }
} 