import { ref, onMounted, onUnmounted, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts/core'
import { 
  BarChart as EchartsBarChart,
  LineChart as EchartsLineChart
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  LegendComponent
} from 'echarts/components'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { Histogram } from '@element-plus/icons-vue'
import { debounce } from 'lodash-es'

// 注册需要的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  LegendComponent,
  EchartsBarChart,
  EchartsLineChart,
  LabelLayout,
  CanvasRenderer
])

export default {
  name: 'BarChartComponent',
  components: {
    Histogram
  },
  props: {
    // 图表标题
    title: {
      type: String,
      default: ''
    },
    // 图表副标题
    subtitle: {
      type: String,
      default: ''
    },
    // 图表宽度
    width: {
      type: String,
      default: '100%'
    },
    // 图表高度
    height: {
      type: String,
      default: '350px'
    },
    // 图表数据
    chartData: {
      type: Object,
      required: true,
      default: () => ({
        categories: [],
        series: []
      })
    },
    // 图表配置
    chartOptions: {
      type: Object,
      default: () => ({})
    },
    // 自动调整大小
    autoResize: {
      type: Boolean,
      default: true
    },
    // 图表主题
    theme: {
      type: String,
      default: ''
    },
    // 是否显示标签
    showLabel: {
      type: Boolean,
      default: false
    },
    // 是否显示图例
    showLegend: {
      type: Boolean,
      default: true
    },
    // 是否为横向柱状图
    horizontal: {
      type: Boolean,
      default: false
    },
    // 柱体样式 'normal', 'gradient', 'pattern'
    barStyle: {
      type: String,
      default: 'normal'
    },
    // 是否启用堆叠效果
    stack: {
      type: Boolean,
      default: false
    },
    // 是否显示边框
    showBorder: {
      type: Boolean,
      default: false
    },
    // 柱体宽度百分比 0-100
    barWidth: {
      type: Number,
      default: 40
    },
    // 是否启用缩放
    dataZoom: {
      type: Boolean,
      default: false
    },
    // 是否使用动画
    animation: {
      type: Boolean,
      default: true
    },
    // 动画持续时间
    animationDuration: {
      type: Number,
      default: 2000
    },
    // 柱体颜色
    barColors: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    // 图表DOM引用
    const chartRef = ref(null)
    const chartContainer = ref(null)
    
    // 图表实例
    let chartInstance = null
    
    // 计算图表高度
    const chartHeight = computed(() => {
      if (props.title) {
        return `calc(100% - 50px)`
      }
      return '100%'
    })
    
    // 获取默认颜色
    const getDefaultColors = () => {
      return [
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ]
        },
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#2378f7' },
            { offset: 0.7, color: '#83bff6' },
            { offset: 1, color: '#83bff6' }
          ]
        },
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#188df0' },
            { offset: 0.5, color: '#83bff6' },
            { offset: 1, color: '#83bff6' }
          ]
        }
      ]
    }
    
    // 生成图表选项
    const generateOptions = () => {
      const { chartData, showLabel, title, subtitle, animationDuration, barColors } = props
      const colors = barColors.length > 0 ? barColors : getDefaultColors()
      
      // 图表基本配置
      const options = {
        title: title ? {
          text: title,
          subtext: subtitle,
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal'
          },
          subtextStyle: {
            fontSize: 12,
            color: '#999'
          }
        } : null,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: title ? '60' : '30',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: chartData.categories || [],
          axisLine: {
            lineStyle: {
              color: '#eee'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#666',
            fontSize: showLabel ? 10 : 0
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#eee',
              type: 'dashed'
            }
          },
          axisLabel: {
            color: '#666',
            fontSize: showLabel ? 10 : 0
          }
        },
        series: [],
        animationDuration: animationDuration
      }
      
      // 处理系列数据
      if (chartData && chartData.series) {
        chartData.series.forEach((item, index) => {
          options.series.push({
            name: item.name,
            type: 'bar',
            barWidth: '60%',
            data: item.data,
            itemStyle: {
              color: colors[index % colors.length]
            },
            label: {
              show: showLabel,
              position: 'top',
              distance: 5,
              color: '#666',
              fontSize: 10
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          })
        })
      }
      
      return options
    }
    
    // 初始化图表
    const initChart = () => {
      // 如果图表已存在则销毁
      if (chartInstance) {
        chartInstance.dispose()
      }
      
      // 创建图表实例
      nextTick(() => {
        // 确保DOM已挂载
        if (chartRef.value) {
          chartInstance = echarts.init(chartRef.value)
          const options = generateOptions()
          chartInstance.setOption(options)
          
          // 响应窗口大小变化
          window.addEventListener('resize', handleResize)
        }
      })
    }
    
    // 处理窗口大小变化
    const handleResize = debounce(() => {
      if (chartInstance) {
        chartInstance.resize()
      }
    }, 100)
    
    // 更新图表
    const updateChart = () => {
      if (chartInstance) {
        const options = generateOptions()
        chartInstance.setOption(options)
      }
    }
    
    // 监听数据变化
    watch(() => props.chartData, () => {
      updateChart()
    }, { deep: true })
    
    // 监听高度/宽度变化
    watch([() => props.height, () => props.width], () => {
      nextTick(() => {
        handleResize()
      })
    })
    
    // 组件挂载后初始化图表
    onMounted(() => {
      initChart()
      
      if (props.autoResize) {
        window.addEventListener('resize', handleResize)
      }
    })
    
    // 组件卸载前清理图表实例
    onBeforeUnmount(() => {
      if (chartInstance) {
        window.removeEventListener('resize', handleResize)
        chartInstance.dispose()
        chartInstance = null
      }
      
      if (props.autoResize) {
        window.removeEventListener('resize', handleResize)
      }
    })
    
    return {
      chartRef,
      chartContainer,
      chartHeight
    }
  }
} 