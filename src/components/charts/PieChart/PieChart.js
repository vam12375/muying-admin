import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import * as echarts from 'echarts'
import { PieChart } from '@element-plus/icons-vue'
import { debounce } from 'lodash-es'

export default {
  name: 'PieChartComponent',
  components: {
    PieChart
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
      type: Array,
      required: true,
      default: () => []
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
    // 是否启用玫瑰图
    roseType: {
      type: Boolean,
      default: false
    },
    // 中心点文本
    centerText: {
      type: String,
      default: ''
    },
    // 悬浮高亮
    hoverAnimation: {
      type: Boolean,
      default: true
    },
    // 圆环内外半径
    radius: {
      type: Array,
      default: () => ['50%', '70%']
    },
    // 是否显示标签
    showLabels: {
      type: Boolean,
      default: true
    },
    // 是否显示图例
    showLegend: {
      type: Boolean,
      default: true
    },
    // 动画持续时间
    animationDuration: {
      type: Number,
      default: 2000
    }
  },
  setup(props, { emit }) {
    const chartContainer = ref(null)
    let chart = null
    
    const chartHeight = computed(() => {
      if (props.title) {
        return `calc(100% - 50px)`
      }
      return '100%'
    })
    
    // 渲染图表
    const renderChart = () => {
      if (!chartContainer.value) return
      
      // 如果图表已经存在则销毁
      if (chart) {
        chart.dispose()
      }
      
      // 初始化图表
      chart = echarts.init(chartContainer.value, props.theme)
      
      // 应用加载动画
      chart.showLoading({
        text: '数据加载中...',
        color: '#FF8FAB',
        textColor: '#909399',
        maskColor: 'rgba(255, 255, 255, 0.8)',
        zlevel: 0
      })
      
      // 设置图表配置
      const options = getChartOptions()
      
      // 隐藏加载动画
      chart.hideLoading()
      
      // 设置图表配置
      chart.setOption(options)
      
      // 绑定事件
      chart.on('click', (params) => {
        emit('chart-click', params)
      })
      
      // 通知图表已经渲染完成
      emit('rendered', chart)
    }
    
    // 构建图表配置
    const getChartOptions = () => {
      // 设置默认值
      const defaultOptions = {
        color: ['#FF8FAB', '#A5D8FF', '#B5C7E3', '#FFB547', '#67C23A', '#E994B1', '#8FBFE9', '#9FB6D9', '#E9A756', '#5EB134'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: '#E4E7ED',
          borderWidth: 1,
          textStyle: {
            color: '#606266',
          },
          confine: true
        },
        legend: props.showLegend ? {
          orient: 'horizontal',
          bottom: '0%',
          icon: 'circle',
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: '#909399'
          },
          formatter: function(name) {
            // 如果文字太长，则截断
            if (name.length > 12) {
              return name.substring(0, 12) + '...'
            }
            return name
          }
        } : null,
        series: [
          {
            name: props.title || '数据分布',
            type: 'pie',
            radius: props.radius,
            center: ['50%', '50%'],
            avoidLabelOverlap: true,
            // 根据roseType属性决定是否启用玫瑰图
            roseType: props.roseType ? 'radius' : false,
            itemStyle: {
              borderRadius: 6,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: props.showLabels ? {
              show: true,
              formatter: '{b}: {d}%',
              fontSize: 12
            } : {
              show: false
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: 'bold'
              },
              // 添加强调动画
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.2)'
              }
            },
            labelLine: {
              show: props.showLabels,
              length: 10,
              length2: 10,
              lineStyle: {
                color: '#C0C4CC'
              }
            },
            data: props.chartData,
            hoverAnimation: props.hoverAnimation
          }
        ],
        // 添加中心文本
        graphic: props.centerText ? [
          {
            type: 'text',
            left: 'center',
            top: 'center',
            style: {
              text: props.centerText,
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center',
              fill: '#303133'
            }
          }
        ] : null,
        animationDuration: props.animationDuration,
        animationEasing: 'cubicOut',
        animationDelay: function(idx) {
          return idx * 80
        }
      }
      
      // 合并用户自定义配置
      return echarts.util.merge(defaultOptions, props.chartOptions, true)
    }
    
    // 监听窗口大小变化
    const handleResize = debounce(() => {
      if (chart) {
        chart.resize()
      }
    }, 100)
    
    // 监听属性变化
    watch(() => props.chartData, () => {
      renderChart()
    }, {
      deep: true
    })
    
    watch(() => props.chartOptions, () => {
      renderChart()
    }, {
      deep: true
    })
    
    // 组件挂载后初始化图表
    onMounted(() => {
      renderChart()
      
      if (props.autoResize) {
        window.addEventListener('resize', handleResize)
      }
    })
    
    // 组件卸载前销毁图表
    onUnmounted(() => {
      if (chart) {
        chart.dispose()
        chart = null
      }
      
      if (props.autoResize) {
        window.removeEventListener('resize', handleResize)
      }
    })
    
    return {
      chartContainer,
      chartHeight
    }
  }
} 