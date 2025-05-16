<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.userId"
        placeholder="用户ID"
        style="width: 120px"
        class="filter-item"
        @keyup.enter="handleFilter"
      />
      <el-select
        v-model="listQuery.type"
        placeholder="积分类型"
        clearable
        style="width: 140px"
        class="filter-item"
      >
        <el-option label="获得积分" value="earn" />
        <el-option label="消费积分" value="spend" />
      </el-select>
      <el-select
        v-model="listQuery.source"
        placeholder="积分来源"
        clearable
        style="width: 160px"
        class="filter-item"
      >
        <el-option label="订单消费" value="order" />
        <el-option label="每日签到" value="signin" />
        <el-option label="商品评论" value="review" />
        <el-option label="用户注册" value="register" />
        <el-option label="积分兑换" value="exchange" />
        <el-option label="管理员调整" value="admin" />
      </el-select>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        align="right"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        class="filter-item"
        style="width: 260px"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        @click="exportExcel"
      >
        导出Excel
      </el-button>
    </div>

    <el-tabs v-model="activeTab" @tab-click="handleTabChange">
      <el-tab-pane label="积分历史记录" name="history">
        <el-table
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column label="ID" prop="id" align="center" width="80" />
          <el-table-column label="用户ID" prop="userId" align="center" width="100" />
          <el-table-column label="积分变动" align="center" width="120">
            <template #default="{ row }">
              <span :class="row.points > 0 ? 'text-success' : 'text-danger'">
                {{ row.points > 0 ? '+' : '' }}{{ row.points }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="类型" prop="type" align="center" width="100">
            <template #default="{ row }">
              <el-tag :type="row.type === 'earn' ? 'success' : 'danger'">
                {{ row.type === 'earn' ? '获得' : '消费' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="来源" prop="source" align="center" width="120">
            <template #default="{ row }">
              <el-tag v-if="row.source === 'order'" type="info">订单消费</el-tag>
              <el-tag v-else-if="row.source === 'signin'" type="success">每日签到</el-tag>
              <el-tag v-else-if="row.source === 'review'" type="warning">商品评论</el-tag>
              <el-tag v-else-if="row.source === 'register'" type="primary">用户注册</el-tag>
              <el-tag v-else-if="row.source === 'exchange'" type="danger">积分兑换</el-tag>
              <el-tag v-else-if="row.source === 'admin'" type="info">管理员调整</el-tag>
              <el-tag v-else>{{ row.source }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="关联ID" prop="referenceId" align="center" width="120" />
          <el-table-column label="描述" prop="description" align="left" min-width="180" />
          <el-table-column label="时间" prop="createTime" align="center" width="180" />
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="积分操作日志" name="operation">
        <el-table
          v-loading="operationLoading"
          :data="operationList"
          border
          fit
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column label="ID" prop="id" align="center" width="80" />
          <el-table-column label="用户ID" prop="userId" align="center" width="100" />
          <el-table-column label="操作类型" align="center" width="150">
            <template #default="{ row }">
              <el-tag v-if="row.operationType === 'SIGN_IN'" type="success">签到</el-tag>
              <el-tag v-else-if="row.operationType === 'ORDER_REWARD'" type="primary">订单奖励</el-tag>
              <el-tag v-else-if="row.operationType === 'EXCHANGE_PRODUCT'" type="warning">商品兑换</el-tag>
              <el-tag v-else-if="row.operationType === 'ADMIN_ADJUSTMENT'" type="info">管理员调整</el-tag>
              <el-tag v-else-if="row.operationType === 'EVENT_REWARD'" type="success">活动奖励</el-tag>
              <el-tag v-else>其他</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="积分变动" align="center" width="120">
            <template #default="{ row }">
              <span :class="row.pointsChange > 0 ? 'text-success' : 'text-danger'">
                {{ row.pointsChange > 0 ? '+' : '' }}{{ row.pointsChange }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="当前余额" prop="currentBalance" align="center" width="120" />
          <el-table-column label="描述" prop="description" align="left" min-width="180" />
          <el-table-column label="关联订单" prop="relatedOrderId" align="center" width="120" />
          <el-table-column label="时间" prop="createTime" align="center" width="180" />
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="listQuery.page"
      v-model:limit="listQuery.size"
      @pagination="getList"
    />

    <el-dialog title="积分统计" :visible.sync="statsDialogVisible" width="800px">
      <div class="stats-container">
        <div class="stats-item">
          <h3>今日积分发放</h3>
          <div class="stats-value">{{ stats.todayEarned || 0 }}</div>
        </div>
        <div class="stats-item">
          <h3>今日积分消费</h3>
          <div class="stats-value">{{ stats.todaySpent || 0 }}</div>
        </div>
        <div class="stats-item">
          <h3>总积分发放</h3>
          <div class="stats-value">{{ stats.totalEarned || 0 }}</div>
        </div>
        <div class="stats-item">
          <h3>总积分消费</h3>
          <div class="stats-value">{{ stats.totalSpent || 0 }}</div>
        </div>
      </div>
      <div id="pointsChart" class="chart-container"></div>
    </el-dialog>
  </div>
</template>

<script>
import { getPointsHistoryList, getPointsOperationLogs, getPointsStats } from '@/api/points'
import Pagination from '@/components/Pagination/index.vue'

export default {
  name: 'PointsHistory',
  components: { Pagination },
  data() {
    return {
      list: [],
      operationList: [],
      total: 0,
      listLoading: true,
      operationLoading: false,
      activeTab: 'history',
      dateRange: [],
      statsDialogVisible: false,
      stats: {},
      listQuery: {
        page: 1,
        size: 10,
        userId: undefined,
        type: undefined,
        source: undefined,
        startDate: undefined,
        endDate: undefined
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      if (this.activeTab === 'history') {
        this.getPointsHistory()
      } else {
        this.getOperationLogs()
      }
    },
    getPointsHistory() {
      this.listLoading = true
      
      // 处理日期范围
      if (this.dateRange && this.dateRange.length === 2) {
        this.listQuery.startDate = this.dateRange[0]
        this.listQuery.endDate = this.dateRange[1]
      } else {
        this.listQuery.startDate = undefined
        this.listQuery.endDate = undefined
      }
      
      getPointsHistoryList(this.listQuery).then(response => {
        const { records, total } = response.data
        this.list = records
        this.total = total
        this.listLoading = false
      })
    },
    getOperationLogs() {
      this.operationLoading = true
      
      // 处理日期范围
      if (this.dateRange && this.dateRange.length === 2) {
        this.listQuery.startDate = this.dateRange[0]
        this.listQuery.endDate = this.dateRange[1]
      } else {
        this.listQuery.startDate = undefined
        this.listQuery.endDate = undefined
      }
      
      getPointsOperationLogs(this.listQuery).then(response => {
        const { records, total } = response.data
        this.operationList = records
        this.total = total
        this.operationLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleTabChange() {
      this.listQuery.page = 1
      this.getList()
    },
    exportExcel() {
      this.$message({
        message: '导出功能正在开发中',
        type: 'info'
      })
    },
    showStats() {
      this.statsDialogVisible = true
      this.fetchStats()
    },
    fetchStats() {
      const query = {}
      if (this.dateRange && this.dateRange.length === 2) {
        query.startDate = this.dateRange[0]
        query.endDate = this.dateRange[1]
      }
      
      getPointsStats(query).then(response => {
        this.stats = response.data
        this.$nextTick(() => {
          this.initPointsChart()
        })
      })
    },
    initPointsChart() {
      // 这里可以使用 ECharts 或其他图表库来初始化积分统计图表
      // 示例代码：
      // const chart = echarts.init(document.getElementById('pointsChart'))
      // chart.setOption({...})
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  padding-bottom: 10px;
  .filter-item {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}

.text-success {
  color: #67c23a;
}

.text-danger {
  color: #f56c6c;
}

.stats-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  
  .stats-item {
    text-align: center;
    padding: 15px;
    background-color: #f5f7fa;
    border-radius: 4px;
    width: 22%;
    
    h3 {
      margin: 0 0 10px 0;
      font-size: 16px;
      color: #606266;
    }
    
    .stats-value {
      font-size: 24px;
      font-weight: bold;
      color: #409eff;
    }
  }
}

.chart-container {
  height: 300px;
  margin: 20px 0;
}
</style> 