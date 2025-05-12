import { ref, onMounted, watch, computed } from 'vue'
import { 
  DataAnalysis, 
  ShoppingBag, 
  Money, 
  Goods, 
  TrendCharts,
  Search,
  RefreshRight
} from '@element-plus/icons-vue'
import LineChart from '@/components/charts/LineChart/index.vue'
import PieChart from '@/components/charts/PieChart/index.vue'
import BarChart from '@/components/charts/BarChart/index.vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'ProductAnalysis',
  components: {
    LineChart,
    PieChart,
    BarChart,
    DataAnalysis,
    ShoppingBag,
    Money,
    Goods,
    TrendCharts,
    Search,
    RefreshRight
  },
  setup() {
    // 筛选表单
    const filterForm = ref({
      dateRange: [
        new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10),
        new Date().toISOString().substr(0, 10)
      ],
      category: ''
    })

    // 商品分类
    const categories = ref([
      { value: '1', label: '婴儿奶粉' },
      { value: '2', label: '尿不湿' },
      { value: '3', label: '婴儿服装' },
      { value: '4', label: '婴儿玩具' },
      { value: '5', label: '婴儿洗护' },
      { value: '6', label: '其他' }
    ])

    // 销售概况数据
    const salesStats = ref([
      { 
        icon: Money, 
        title: '销售总额', 
        value: '¥128,765.00', 
        type: 'primary' 
      },
      { 
        icon: ShoppingBag, 
        title: '商品总数', 
        value: '358', 
        type: 'info' 
      },
      { 
        icon: Goods, 
        title: '已售商品', 
        value: '1,286', 
        type: 'success' 
      },
      { 
        icon: TrendCharts, 
        title: '同比增长', 
        value: '24.8%', 
        type: 'warning' 
      }
    ])

    // 销售趋势数据
    const salesTrendData = ref({
      categories: ['5/1', '5/2', '5/3', '5/4', '5/5', '5/6', '5/7', '5/8', '5/9', '5/10', 
                   '5/11', '5/12', '5/13', '5/14', '5/15', '5/16', '5/17', '5/18', '5/19', '5/20',
                   '5/21', '5/22', '5/23', '5/24', '5/25', '5/26', '5/27', '5/28', '5/29', '5/30'],
      series: [
        {
          name: '销售金额',
          data: [4500, 5200, 4800, 5500, 6000, 5800, 6200, 5900, 6100, 6300, 
                 6200, 6400, 6500, 6300, 6200, 6400, 6600, 6800, 7000, 7200,
                 7100, 7300, 7400, 7500, 7200, 7400, 7500, 7800, 8000, 8200]
        }
      ]
    })

    // 商品分类饼图数据
    const productPieData = ref([
      { value: 32500, name: '婴儿奶粉' },
      { value: 24200, name: '尿不湿' },
      { value: 18300, name: '婴儿服装' },
      { value: 15400, name: '婴儿玩具' },
      { value: 10800, name: '婴儿洗护' },
      { value: 8765, name: '其他' }
    ])

    // 排行榜类型：按销售额/按销量
    const rankType = ref('amount')

    // 热销商品数据（模拟数据）
    const getHotProducts = () => {
      const mockImages = [
        'https://img.alicdn.com/imgextra/i2/O1CN01nHH9jW1YfkPH0oeB0_!!6000000003088-2-tps-200-200.png',
        'https://img.alicdn.com/imgextra/i1/O1CN01vQOxyx1YOVeZLKpSz_!!6000000003054-2-tps-200-200.png',
        'https://img.alicdn.com/imgextra/i2/O1CN014tjlv51FnXJOSi4wC_!!6000000000535-2-tps-200-200.png',
        'https://img.alicdn.com/imgextra/i3/O1CN01iP4UxL1l5J7Ja8vMR_!!6000000004769-2-tps-200-200.png',
        'https://img.alicdn.com/imgextra/i3/O1CN01YG6Xr61WZWIQrEyJM_!!6000000002796-2-tps-200-200.png',
        'https://img.alicdn.com/imgextra/i4/O1CN01gH1bOD1OQSUxS4N35_!!6000000001698-2-tps-200-200.png',
        'https://img.alicdn.com/imgextra/i3/O1CN01tXHOHh1NrS2xRc64k_!!6000000001622-2-tps-200-200.png',
        'https://img.alicdn.com/imgextra/i1/O1CN01PdYRGG1n6JhMDG1gq_!!6000000005042-2-tps-200-200.png',
        'https://img.alicdn.com/imgextra/i2/O1CN01DxAbGD1vwuIBQUlHo_!!6000000006240-2-tps-200-200.png',
        'https://img.alicdn.com/imgextra/i4/O1CN01IgBQHK1dw3swHuoXB_!!6000000003798-2-tps-200-200.png'
      ]

      const categoryMap = {}
      categories.value.forEach(item => {
        categoryMap[item.value] = item.label
      })

      const products = []
      for (let i = 0; i < 10; i++) {
        const price = Math.floor(Math.random() * 500) + 50
        const quantity = Math.floor(Math.random() * 200) + 50
        const amount = price * quantity
        const categoryId = Math.floor(Math.random() * 6) + 1
        
        products.push({
          id: i + 1,
          rank: i + 1,
          product: `婴儿商品${i + 1}`,
          category: categoryMap[categoryId.toString()],
          price: price,
          quantity: quantity,
          amount: amount,
          image: mockImages[i % mockImages.length],
          trend: {
            categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            series: [{
              name: '销量',
              data: Array.from({length: 7}, () => Math.floor(Math.random() * 50) + 10)
            }]
          }
        })
      }

      // 根据排行类型排序
      if (rankType.value === 'amount') {
        products.sort((a, b) => b.amount - a.amount)
      } else {
        products.sort((a, b) => b.quantity - a.quantity)
      }

      // 重新排名
      products.forEach((item, index) => {
        item.rank = index + 1
      })

      return products
    }

    // 分页相关数据
    const currentPage = ref(1)
    const pageSize = ref(10)
    const totalProducts = ref(100)

    // 加载状态
    const loading = ref(false)

    // 热销商品数据
    const hotProducts = ref([])

    // 处理筛选
    const handleFilter = () => {
      loading.value = true
      
      // 模拟API请求延迟
      setTimeout(() => {
        // 在实际应用中，这里应该发送API请求获取筛选后的数据
        ElMessage.success('筛选条件已应用')
        
        hotProducts.value = getHotProducts()
        loading.value = false
      }, 500)
    }

    // 重置筛选条件
    const resetFilter = () => {
      filterForm.value = {
        dateRange: [
          new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10),
          new Date().toISOString().substr(0, 10)
        ],
        category: ''
      }
      
      // 重新获取数据
      handleFilter()
    }

    // 处理页码变化
    const handleCurrentChange = (val) => {
      currentPage.value = val
      loading.value = true
      
      // 模拟API请求
      setTimeout(() => {
        hotProducts.value = getHotProducts()
        loading.value = false
      }, 500)
    }

    // 处理每页条数变化
    const handleSizeChange = (val) => {
      pageSize.value = val
      currentPage.value = 1
      loading.value = true
      
      // 模拟API请求
      setTimeout(() => {
        hotProducts.value = getHotProducts()
        loading.value = false
      }, 500)
    }

    // 监听排行榜类型变化
    watch(rankType, () => {
      loading.value = true
      
      // 模拟API请求
      setTimeout(() => {
        hotProducts.value = getHotProducts()
        loading.value = false
      }, 500)
    })

    // 初始化数据
    onMounted(() => {
      // 模拟获取数据
      loading.value = true
      
      setTimeout(() => {
        hotProducts.value = getHotProducts()
        loading.value = false
      }, 500)
    })

    return {
      filterForm,
      categories,
      salesStats,
      salesTrendData,
      productPieData,
      rankType,
      hotProducts,
      loading,
      totalProducts,
      currentPage,
      pageSize,
      handleFilter,
      resetFilter,
      handleCurrentChange,
      handleSizeChange
    }
  }
} 