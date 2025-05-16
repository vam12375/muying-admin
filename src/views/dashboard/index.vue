<template>
  <div class="dashboard-container page-container baby-theme" data-aos="fade-up">
    <div class="dashboard-header">
      <h1 class="page-title">
        <el-icon class="icon"><HomeFilled /></el-icon>
        欢迎使用母婴商城后台管理系统
      </h1>
      <p class="current-date">今天是：{{ currentDate }}</p>
    </div>
    
    <!-- 统计卡片 -->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="6" v-for="(item, index) in statCards" :key="index">
        <div class="stat-card" 
          data-aos="fade-up" 
          :data-aos-delay="index * 100"
          :class="item.type"
          v-loading="loading.stats">
          <el-icon class="stat-icon">
            <component :is="item.icon"></component>
          </el-icon>
          <div class="stat-number" :class="item.type">{{ item.value }}</div>
          <div class="stat-title">{{ item.title }}</div>
        </div>
      </el-col>
    </el-row>
    
    <!-- 趋势图表 -->
    <el-row :gutter="20" class="mt-20">
      <el-col :xs="24" :md="12" data-aos="fade-right">
        <line-chart 
          title="近7天订单趋势" 
          subtitle="每日订单数量统计"
          :chart-data="orderTrendData"
          :area-style="{ startColor: '#FF8FAB', endColor: 'rgba(255, 143, 171, 0.1)' }"
          height="350px"
          :animation-duration="2000"
          :show-shadow="true"
          v-loading="loading.orderTrend">
        </line-chart>
      </el-col>
      <el-col :xs="24" :md="12" data-aos="fade-left">
        <pie-chart 
          title="商品分类占比" 
          subtitle="各分类商品销售情况"
          :chart-data="productCategoryData"
          height="350px"
          :animation-duration="2000"
          :rose-type="true"
          v-loading="loading.categories">
        </pie-chart>
      </el-col>
    </el-row>
    
    <!-- 营收与用户数据 -->
    <el-row :gutter="20" class="mt-20">
      <el-col :xs="24" :md="12" data-aos="fade-up">
        <bar-chart 
          title="月度销售额" 
          subtitle="近6个月销售额对比"
          :chart-data="monthlySalesData"
          height="350px"
          bar-style="gradient"
          :animation-duration="2000"
          v-loading="loading.monthlySales">
        </bar-chart>
      </el-col>
      <el-col :xs="24" :md="12" data-aos="fade-up" data-aos-delay="100">
        <bar-chart 
          title="用户增长" 
          subtitle="近6个月新增用户数"
          :chart-data="userGrowthData"
          height="350px"
          :horizontal="true"
          bar-style="gradient"
          :animation-duration="2000"
          v-loading="loading.userGrowth">
        </bar-chart>
      </el-col>
    </el-row>
    
    <!-- 通知和事项 -->
    <el-row :gutter="20" class="mt-20">
      <el-col :span="12" data-aos="fade-up">
        <el-card class="box-card" v-loading="loading.todoItems">
          <template #header>
            <div class="card-header">
              <span>
                <el-icon><Bell /></el-icon>
                待处理事项
              </span>
              <el-button type="primary" text class="btn-hover-effect">查看全部</el-button>
            </div>
          </template>
          <el-table :data="todoList" style="width: 100%">
            <el-table-column prop="title" label="事项" />
            <el-table-column prop="count" label="数量" width="100">
              <template #default="scope">
                <el-tag :type="getTagType(scope.row.count)">{{ scope.row.count }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button link type="primary" size="small" class="btn-hover-effect">处理</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      
      <el-col :span="12" data-aos="fade-up" data-aos-delay="100">
        <el-card class="box-card" v-loading="loading.systemInfo">
          <template #header>
            <div class="card-header">
              <span>
                <el-icon><InfoFilled /></el-icon>
                系统信息
              </span>
            </div>
          </template>
          <div class="system-info">
            <div class="system-info-item" v-for="(item, index) in systemInfo" :key="index" 
                 data-aos="fade-left" :data-aos-delay="index * 50">
              <span class="label">{{ item.label }}：</span>
              <span class="value">{{ item.value }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script src="./Dashboard.js"></script>
<style lang="scss" src="./Dashboard.scss"></style> 