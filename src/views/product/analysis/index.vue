<template>
  <div class="product-analysis">
    <!-- 页面标题 -->
    <div class="analysis-header">
      <h1 class="header-title">
        <el-icon><DataAnalysis /></el-icon>
        产品销售分析
      </h1>
      <p class="header-desc">分析产品销售情况，掌握最新销售趋势，优化产品结构和营销策略</p>
    </div>

    <!-- 筛选条件 -->
    <el-card class="filter-container" shadow="hover">
      <template #header>
        <div class="card-title">
          <el-icon><Search /></el-icon>
          筛选条件
        </div>
      </template>
      
      <el-form :model="filterForm" label-width="80px" label-position="left" :inline="true">
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        
        <el-form-item label="商品分类">
          <el-select v-model="filterForm.category" placeholder="请选择商品分类" clearable>
            <el-option
              v-for="item in categories"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <div class="filter-actions">
            <el-button type="primary" @click="handleFilter">
              <el-icon><Search /></el-icon>
              查询
            </el-button>
            <el-button @click="resetFilter">
              <el-icon><RefreshRight /></el-icon>
              重置
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 销售概况 -->
    <div class="stats-container">
      <div v-for="(stat, index) in salesStats" :key="index" class="stat-card">
        <div :class="['stat-icon', stat.type]">
          <el-icon><component :is="stat.icon" /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-title">{{ stat.title }}</div>
          <div class="stat-value">{{ stat.value }}</div>
        </div>
      </div>
    </div>

    <!-- 销售趋势图表 -->
    <div class="chart-container">
      <el-card shadow="hover">
        <template #header>
          <div class="card-title">
            <el-icon><TrendCharts /></el-icon>
            销售趋势
          </div>
        </template>
        <div class="chart-wrapper">
          <LineChart :chart-data="salesTrendData" height="100%" width="100%" />
        </div>
      </el-card>
      
      <el-card shadow="hover">
        <template #header>
          <div class="card-title">
            <el-icon><PieChart /></el-icon>
            商品销售分布
          </div>
        </template>
        <div class="chart-wrapper">
          <PieChart :chart-data="productPieData" height="100%" width="100%" />
        </div>
      </el-card>
    </div>

    <!-- 热销商品排行榜 -->
    <el-card class="products-container" shadow="hover">
      <template #header>
        <div class="header-left">
          <el-icon><ShoppingBag /></el-icon>
          热销商品排行榜
        </div>
        <div class="header-actions">
          <el-button size="small" circle>
            <el-icon><RefreshRight /></el-icon>
          </el-button>
          <el-button size="small" circle>
            <el-icon><Search /></el-icon>
          </el-button>
        </div>
      </template>
      
      <div class="rank-type-toggle">
        <el-radio-group v-model="rankType" size="small">
          <el-radio-button label="amount">按销售额</el-radio-button>
          <el-radio-button label="quantity">按销量</el-radio-button>
        </el-radio-group>
      </div>
      
      <el-table 
        :data="hotProducts" 
        class="product-table" 
        border 
        stripe 
        v-loading="loading"
        style="width: 100%"
      >
        <el-table-column label="排名" width="80" align="center">
          <template #default="scope">
            <div :class="[
              'product-rank', 
              scope.row.rank <= 3 ? `rank-${scope.row.rank}` : 'rank-other'
            ]">
              {{ scope.row.rank }}
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="商品" min-width="180">
          <template #default="scope">
            <div class="product-info">
              <img :src="scope.row.image" class="product-image" />
              <span class="product-name">{{ scope.row.product }}</span>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="分类" prop="category" width="120">
          <template #default="scope">
            <span class="product-category">{{ scope.row.category }}</span>
          </template>
        </el-table-column>
        
        <el-table-column 
          label="价格" 
          prop="price" 
          width="100" 
          align="right"
          sortable
        >
          <template #default="scope">
            <span class="product-price">¥{{ scope.row.price.toFixed(2) }}</span>
          </template>
        </el-table-column>
        
        <el-table-column 
          label="销量" 
          prop="quantity" 
          width="100" 
          align="right"
          sortable
        >
          <template #default="scope">
            <span class="product-quantity">{{ scope.row.quantity }}</span>
          </template>
        </el-table-column>
        
        <el-table-column 
          label="销售额" 
          prop="amount" 
          width="120" 
          align="right"
          sortable
        >
          <template #default="scope">
            <span class="product-amount">¥{{ scope.row.amount.toFixed(2) }}</span>
          </template>
        </el-table-column>
        
        <el-table-column 
          label="销量趋势" 
          width="120" 
          align="center"
        >
          <template #default="scope">
            <div class="trend-chart">
              <BarChart 
                :chart-data="scope.row.trend" 
                height="40px" 
                width="100px" 
                :show-label="false"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          v-model:currentPage="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalProducts"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import ProductAnalysisJS from './ProductAnalysis.js'
import './ProductAnalysis.scss'

export default defineComponent({
  name: 'ProductAnalysis',
  ...ProductAnalysisJS
})
</script> 