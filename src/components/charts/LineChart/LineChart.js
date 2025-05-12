import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import * as echarts from 'echarts'
import { TrendCharts } from '@element-plus/icons-vue'
import { debounce } from 'lodash-es'

export default {
  name: 'LineChart',
  components: {
    TrendCharts
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
      default: 'macarons'
    },
    // 是否显示标记点
    showSymbol: {
      type: Boolean,
      default: true
    },
    // 是否平滑曲线
    smooth: {
      type: Boolean,
      default: true
    },
    // 区域填充样式
    areaStyle: {
      type: Object,
      default: null
    },
    // 是否显示阴影
    showShadow: {
      type: Boolean,
      default: false
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
      // 如果有标题，则减去标题高度
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
      const { categories, series } = props.chartData
      
      // 设置默认值
      const defaultOptions = {
        color: ['#FF8FAB', '#A5D8FF', '#B5C7E3', '#FFB547', '#67C23A'],
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: '#E4E7ED',
          borderWidth: 1,
          textStyle: {
            color: '#606266',
          },
          confine: true,
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: '#E4E7ED'
            }
          }
        },
        legend: {
          bottom: '0%',
          data: series.map(item => item.name),
          icon: 'circle',
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: '#909399'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '35px',
          top: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: categories,
          axisLine: {
            lineStyle: {
              color: '#E4E7ED'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#909399',
            formatter: function(value) {
              // 如果文字太长，则截断
              if (value.length > 10) {
                return value.substring(0, 10) + '...'
              }
              return value
            }
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
              color: '#F2F6FC'
            }
          },
          axisLabel: {
            color: '#909399'
          }
        },
        series: series.map((item, index) => ({
          name: item.name,
          type: 'line',
          stack: item.stack || null,
          smooth: props.smooth,
          showSymbol: props.showSymbol,
          symbol: 'circle',
          symbolSize: 6,
          emphasis: {
            focus: 'series'
          },
          areaStyle: props.areaStyle ? {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: props.areaStyle.startColor || defaultOptions.color[index]
              },
              {
                offset: 1,
                color: props.areaStyle.endColor || 'rgba(255, 255, 255, 0.2)'
              }
            ])
          } : null,
          data: item.data,
          lineStyle: {
            width: 2.5
          },
          itemStyle: {
            borderWidth: 2
          },
          // 添加阴影效果
          ...(props.showShadow ? {
            lineStyle: {
              width: 2.5,
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              shadowBlur: 8,
              shadowOffsetY: 4
            }
          } : {})
        })),
        animationDuration: props.animationDuration,
        animationEasing: 'cubicOut',
        animationDelay: function(idx) {
          return idx * 100
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