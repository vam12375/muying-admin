<template>
  <div class="comment-stats">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>评价统计分析</span>
          <div class="header-operations">
            <el-select v-model="period" placeholder="统计周期" @change="fetchStatsData">
              <el-option label="最近7天" :value="7" />
              <el-option label="最近30天" :value="30" />
              <el-option label="最近90天" :value="90" />
              <el-option label="最近365天" :value="365" />
              <el-option label="全部数据" :value="999" />
            </el-select>
            <el-button type="primary" @click="refreshData">刷新数据</el-button>
          </div>
        </div>
      </template>
      
      <!-- 数据概览卡片 -->
      <div class="stats-overview">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card class="stats-card" shadow="hover">
              <div class="stats-item">
                <div class="stats-icon" style="background-color: #409EFF;">
                  <el-icon><Comment /></el-icon>
                </div>
                <div class="stats-info">
                  <div class="stats-title">总评价数</div>
                  <div class="stats-value">{{ statsData.totalComments || 0 }}</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stats-card" shadow="hover">
              <div class="stats-item">
                <div class="stats-icon" style="background-color: #67C23A;">
                  <el-icon><Star /></el-icon>
                </div>
                <div class="stats-info">
                  <div class="stats-title">平均评分</div>
                  <div class="stats-value">{{ (statsData.averageRating || 0).toFixed(1) }}</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stats-card" shadow="hover">
              <div class="stats-item">
                <div class="stats-icon" style="background-color: #E6A23C;">
                  <el-icon><PieChart /></el-icon>
                </div>
                <div class="stats-info">
                  <div class="stats-title">好评率</div>
                  <div class="stats-value">{{ (statsData.positiveRate || 0).toFixed(2) }}%</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stats-card" shadow="hover">
              <div class="stats-item">
                <div class="stats-icon" style="background-color: #F56C6C;">
                  <el-icon><Warning /></el-icon>
                </div>
                <div class="stats-info">
                  <div class="stats-title">差评率</div>
                  <div class="stats-value">{{ (statsData.negativeRate || 0).toFixed(2) }}%</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        
        <!-- 添加第二行统计卡片 -->
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="12">
            <el-card class="stats-card" shadow="hover">
              <div class="stats-item">
                <div class="stats-icon" style="background-color: #9c27b0;">
                  <el-icon><Picture /></el-icon>
                </div>
                <div class="stats-info">
                  <div class="stats-title">有图片评价</div>
                  <div class="stats-value">{{ statsData.commentWithImages || 0 }} ({{ calculatePercentage(statsData.commentWithImages, statsData.totalComments) }}%)</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="stats-card" shadow="hover">
              <div class="stats-item">
                <div class="stats-icon" style="background-color: #795548;">
                  <el-icon><User /></el-icon>
                </div>
                <div class="stats-info">
                  <div class="stats-title">匿名评价</div>
                  <div class="stats-value">{{ statsData.anonymousComments || 0 }} ({{ calculatePercentage(statsData.anonymousComments, statsData.totalComments) }}%)</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      
      <!-- 统计图表区域 -->
      <div class="stats-charts">
        <el-row :gutter="20">
          <!-- 评分分布饼图 -->
          <el-col :span="12">
            <el-card class="chart-card" shadow="hover">
              <template #header>
                <div class="chart-header">
                  <span>评分分布</span>
                </div>
              </template>
              <div ref="ratingPieChartRef" class="chart-container"></div>
            </el-card>
          </el-col>
          
          <!-- 日评价统计折线图 -->
          <el-col :span="12">
            <el-card class="chart-card" shadow="hover">
              <template #header>
                <div class="chart-header">
                  <span>评价趋势</span>
                </div>
              </template>
              <div ref="dailyLineChartRef" class="chart-container"></div>
            </el-card>
          </el-col>
        </el-row>
        
        <el-row :gutter="20" style="margin-top: 20px;">
          <!-- 评分趋势柱状图 -->
          <el-col :span="24">
            <el-card class="chart-card" shadow="hover">
              <template #header>
                <div class="chart-header">
                  <span>评分趋势分析</span>
                </div>
              </template>
              <div ref="ratingTrendChartRef" class="chart-container" style="height: 400px;"></div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onBeforeUnmount, defineComponent } from 'vue'
import { ElMessage } from 'element-plus'
import { Comment, Star, PieChart, Warning, Picture, User } from '@element-plus/icons-vue'
import { getCommentStats } from '@/api/comment'
import * as echarts from 'echarts'

export default defineComponent({
  name: 'CommentStats',
  components: {
    Comment,
    Star,
    PieChart,
    Warning,
    Picture,
    User
  },
  setup() {
    // 统计周期
    const period = ref(7)
    
    // 统计数据
    const statsData = ref({})
    const loading = ref(false)
    
    // 图表引用
    const ratingPieChartRef = ref(null)
    const dailyLineChartRef = ref(null)
    const ratingTrendChartRef = ref(null)
    
    // 图表实例
    let ratingPieChart = null
    let dailyLineChart = null
    let ratingTrendChart = null
    
    // 获取统计数据
    const fetchStatsData = async () => {
      loading.value = true
      try {
        const { data } = await getCommentStats(period.value)
        if (data) {
          statsData.value = data
          renderCharts()
        } else {
          ElMessage.error('获取评价统计数据失败')
        }
      } catch (error) {
        console.error('获取评价统计数据失败:', error)
        ElMessage.error('获取评价统计数据失败')
      } finally {
        loading.value = false
      }
    }
    
    // 刷新数据
    const refreshData = () => {
      fetchStatsData()
    }
    
    // 计算百分比
    const calculatePercentage = (part, total) => {
      if (!part || !total || total === 0) return 0
      return ((part / total) * 100).toFixed(2)
    }
    
    // 渲染图表
    const renderCharts = () => {
      renderRatingPieChart()
      renderDailyLineChart()
      renderRatingTrendChart()
    }
    
    // 渲染评分分布饼图
    const renderRatingPieChart = () => {
      if (!ratingPieChartRef.value) return
      
      if (!ratingPieChart) {
        ratingPieChart = echarts.init(ratingPieChartRef.value)
      }
      
      const ratingDistribution = statsData.value.ratingDistribution || {}
      const pieData = []
      
      for (let i = 5; i >= 1; i--) {
        pieData.push({
          name: `${i}星`,
          value: ratingDistribution[i] || 0
        })
      }
      
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: pieData.map(item => item.name)
        },
        series: [
          {
            name: '评分分布',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              formatter: '{b}: {c} ({d}%)'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: true
            },
            data: pieData,
            color: ['#67C23A', '#85CE61', '#E6A23C', '#F56C6C', '#C45656']
          }
        ]
      }
      
      ratingPieChart.setOption(option)
    }
    
    // 渲染日评价统计折线图
    const renderDailyLineChart = () => {
      if (!dailyLineChartRef.value) return
      
      if (!dailyLineChart) {
        dailyLineChart = echarts.init(dailyLineChartRef.value)
      }
      
      const dateLabels = statsData.value.dateLabels || []
      const dailyData = []
      
      if (statsData.value.dailyRatingData) {
        // 计算每天的总评价数
        for (let i = 0; i < dateLabels.length; i++) {
          let dailyTotal = 0
          statsData.value.dailyRatingData.forEach(series => {
            dailyTotal += series.data[i] || 0
          })
          dailyData.push(dailyTotal)
        }
      }
      
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: dateLabels
        },
        yAxis: {
          type: 'value',
          name: '评价数',
          minInterval: 1
        },
        series: [
          {
            name: '评价数',
            type: 'line',
            smooth: true,
            data: dailyData,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(64, 158, 255, 0.7)' },
                { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
              ])
            },
            itemStyle: {
              color: '#409EFF'
            }
          }
        ]
      }
      
      dailyLineChart.setOption(option)
    }
    
    // 渲染评分趋势柱状图
    const renderRatingTrendChart = () => {
      if (!ratingTrendChartRef.value) return
      
      if (!ratingTrendChart) {
        ratingTrendChart = echarts.init(ratingTrendChartRef.value)
      }
      
      const dateLabels = statsData.value.dateLabels || []
      const seriesData = statsData.value.dailyRatingData || []
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: seriesData.map(item => item.name)
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: dateLabels
        },
        yAxis: {
          type: 'value',
          name: '数量',
          minInterval: 1
        },
        series: seriesData.map(item => ({
          name: item.name,
          type: 'bar',
          stack: '评分',
          emphasis: {
            focus: 'series'
          },
          data: item.data
        })),
        color: ['#C45656', '#F56C6C', '#E6A23C', '#85CE61', '#67C23A']
      }
      
      ratingTrendChart.setOption(option)
    }
    
    // 窗口大小变化时重绘图表
    const handleResize = () => {
      ratingPieChart?.resize()
      dailyLineChart?.resize()
      ratingTrendChart?.resize()
    }
    
    onMounted(() => {
      fetchStatsData()
      window.addEventListener('resize', handleResize)
    })
    
    // 组件卸载前清理图表实例和事件监听
    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize)
      ratingPieChart?.dispose()
      dailyLineChart?.dispose()
      ratingTrendChart?.dispose()
    })
    
    return {
      period,
      statsData,
      loading,
      ratingPieChartRef,
      dailyLineChartRef,
      ratingTrendChartRef,
      fetchStatsData,
      refreshData,
      calculatePercentage
    }
  }
})
</script>

<style lang="scss" scoped>
.comment-stats {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .header-operations {
      display: flex;
      align-items: center;
      gap: 15px;
    }
  }
  
  .stats-overview {
    margin-bottom: 20px;
    
    .stats-card {
      height: 100px;
      
      .stats-item {
        display: flex;
        align-items: center;
        height: 100%;
        
        .stats-icon {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          
          .el-icon {
            font-size: 32px;
            color: white;
          }
        }
        
        .stats-info {
          flex: 1;
          
          .stats-title {
            font-size: 14px;
            color: #909399;
            margin-bottom: 8px;
          }
          
          .stats-value {
            font-size: 24px;
            font-weight: bold;
            color: #303133;
          }
        }
      }
    }
  }
  
  .stats-charts {
    .chart-card {
      margin-bottom: 20px;
      
      .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .chart-container {
        height: 300px;
      }
    }
  }
}
</style> 