import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import { createPinia } from 'pinia'
import * as echarts from 'echarts'
import 'animate.css'
import AOS from 'aos'
import 'aos/dist/aos.css'

import App from './App.vue'
// 引入自定义样式（替换旧的CSS）
import './assets/styles/common.scss'

const app = createApp(App)

// 将echarts注册为全局属性
app.config.globalProperties.$echarts = echarts

// 注册ElementPlus
app.use(ElementPlus, { size: 'default' })

// 注册ElementPlus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 初始化AOS动画库
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true
})

// 使用路由
app.use(router)

// 使用Pinia状态管理
app.use(createPinia())

app.mount('#app')
