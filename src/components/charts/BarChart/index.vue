<template>
  <div class="chart-container" ref="chartContainer" :style="{ height, width }">
    <div class="echart" ref="chartRef"></div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import BarChartJS from './BarChart.js'
import './BarChart.scss'

export default defineComponent({
  name: 'BarChart',
  props: {
    // 图表数据
    chartData: {
      type: Object,
      required: true
    },
    // 图表高度
    height: {
      type: String,
      default: '300px'
    },
    // 图表宽度
    width: {
      type: String,
      default: '100%'
    },
    // 是否显示标签
    showLabel: {
      type: Boolean,
      default: true
    },
    // 柱状图颜色
    barColors: {
      type: Array,
      default: () => []
    },
    // 图表标题
    title: {
      type: String,
      default: ''
    },
    // 图表子标题
    subtitle: {
      type: String,
      default: ''
    },
    // 动画时长
    animationDuration: {
      type: Number,
      default: 1000
    }
  },
  ...BarChartJS
})
</script>