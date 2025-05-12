<template>
  <div class="line-chart-container" :style="{ height, width }">
    <div class="line-chart-title baby-theme" v-if="title">
      <slot name="title">
        <h3 class="chart-title">
          <el-icon><TrendCharts /></el-icon>
          {{ title }}
        </h3>
      </slot>
      <div class="chart-info" v-if="subtitle">{{ subtitle }}</div>
    </div>
    <div ref="chartContainer" class="chart-dom" :style="{ height: chartHeight }"></div>
    <slot name="footer"></slot>
  </div>
</template>

<script src="./LineChart.js"></script>
<style lang="scss" src="./LineChart.scss"></style> 