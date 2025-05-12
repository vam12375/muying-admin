<template>
  <div class="pie-chart-container" :style="{ height, width }">
    <div class="pie-chart-title baby-theme" v-if="title">
      <slot name="title">
        <h3 class="chart-title">
          <el-icon><PieChart /></el-icon>
          {{ title }}
        </h3>
      </slot>
      <div class="chart-info" v-if="subtitle">{{ subtitle }}</div>
    </div>
    <div ref="chartContainer" class="chart-dom" :style="{ height: chartHeight }"></div>
    <slot name="footer"></slot>
  </div>
</template>

<script src="./PieChart.js"></script>
<style lang="scss" src="./PieChart.scss"></style> 