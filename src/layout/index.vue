<template>
  <div class="app-wrapper">
    <!-- 侧边栏 -->
    <div class="sidebar-container" :class="{ 'collapse': isCollapse }">
      <div class="logo-container">
        <h1 class="logo-title">
          <el-icon><Present /></el-icon>
          <span v-show="!isCollapse">母婴后台</span>
        </h1>
      </div>
      <el-menu
        :default-active="activeMenu"
        background-color="#F0F3FA"
        text-color="#606266"
        active-text-color="#FF8FAB"
        :collapse="isCollapse"
        :unique-opened="false"
        :collapse-transition="true"
        mode="vertical"
        router
        @select="handleSelect"
      >
        <el-menu-item index="/dashboard">
          <el-icon><HomeFilled /></el-icon>
          <template #title>首页</template>
        </el-menu-item>
        
        <el-sub-menu index="1">
          <template #title>
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </template>
          <el-menu-item index="/user/list">用户列表</el-menu-item>
          <el-menu-item index="/user/analysis">用户分析</el-menu-item>
        </el-sub-menu>
        
        <el-sub-menu index="2">
          <template #title>
            <el-icon><ShoppingBag /></el-icon>
            <span>商品管理</span>
          </template>
          <el-menu-item index="/product/list">商品列表</el-menu-item>
          <el-menu-item index="/product/category">分类管理</el-menu-item>
          <el-menu-item index="/product/brand">品牌管理</el-menu-item>
          <el-menu-item index="/product/analysis">商品分析</el-menu-item>
        </el-sub-menu>
        
        <el-sub-menu index="3">
          <template #title>
            <el-icon><ShoppingCart /></el-icon>
            <span>订单管理</span>
          </template>
          <el-menu-item index="/order/list">订单列表</el-menu-item>
          <el-menu-item index="/order/analysis">订单分析</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="4">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统设置</span>
          </template>
          <el-menu-item index="/system/redis">
            <el-icon><DataAnalysis /></el-icon>
            <span>Redis缓存监控</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
    
    <!-- 主要内容区 -->
    <div class="main-container">
      <!-- 顶部导航 -->
      <div class="navbar">
        <div class="left-menu">
          <el-icon @click="toggleSidebar" class="toggle-btn btn-hover-effect">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
        </div>
        
        <div class="right-menu">
          <div class="right-menu-item">
            <el-tooltip content="刷新页面" placement="bottom">
              <el-icon class="nav-icon btn-hover-effect" @click="refreshPage"><Refresh /></el-icon>
            </el-tooltip>
          </div>
          
          <div class="right-menu-item">
            <el-tooltip content="全屏" placement="bottom">
              <el-icon class="nav-icon btn-hover-effect" @click="toggleFullScreen">
                <FullScreen v-if="!isFullscreen" />
                <Aim v-else />
              </el-icon>
            </el-tooltip>
          </div>
          
          <el-dropdown trigger="click">
            <div class="avatar-wrapper btn-hover-effect">
              <el-avatar :size="32" :src="userAvatar" class="user-avatar">
                {{ userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'A' }}
              </el-avatar>
              <span class="user-name">{{ userInfo.name }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-icon><User /></el-icon>个人中心
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-icon><EditPen /></el-icon>修改密码
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      
      <!-- 内容区 -->
      <div class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  HomeFilled, 
  User, 
  ShoppingBag, 
  ShoppingCart, 
  Fold, 
  Expand, 
  Setting,
  ArrowDown,
  Refresh,
  FullScreen,
  Aim,
  EditPen,
  SwitchButton,
  Present,
  DataAnalysis
} from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getUser, logout } from '@/utils/auth'

const router = useRouter()
const route = useRoute()

// 侧边栏折叠状态
const isCollapse = ref(false)
// 用户信息
const userInfo = ref(getUser() || { name: 'Admin' })
// 用户头像
const userAvatar = ref('')
// 全屏状态
const isFullscreen = ref(false)
// 是否为移动设备
const isMobile = ref(window.innerWidth < 768)

// 计算当前激活的菜单项
const activeMenu = computed(() => {
  return route.path
})

// 切换侧边栏折叠状态
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

// 处理登出
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 清除Token和用户信息
    logout()
    
    // 提示登出成功
    ElMessage({
      type: 'success',
      message: '退出成功'
    })
    
    // 跳转到登录页
    router.push('/login')
  }).catch(() => {
    // 取消登出
  })
}

// 刷新当前页面
const refreshPage = () => {
  // 刷新页面的简单方法
  window.location.reload()
}

// 切换全屏
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
      isFullscreen.value = false
    }
  }
}

// 窗口大小改变时判断是否为移动设备
const resizeHandler = () => {
  if (window.innerWidth < 768) {
    isMobile.value = true
    isCollapse.value = true
  } else {
    isMobile.value = false
  }
}

// 组件挂载完成后
onMounted(() => {
  // 监听窗口大小变化
  window.addEventListener('resize', resizeHandler)
  
  // 初始化移动设备检测
  resizeHandler()
  
  // 监听全屏变化
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
})

// 组件卸载前
onUnmounted(() => {
  // 移除窗口大小变化监听
  window.removeEventListener('resize', resizeHandler)
  
  // 移除全屏变化监听
  document.removeEventListener('fullscreenchange', () => {})
})

// 添加菜单点击事件处理器，确保正确导航到用户列表页面
const handleSelect = (index) => {
  // 使用router导航到对应路径
  router.push(index)
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.app-wrapper {
  position: relative;
  height: 100vh;
  width: 100%;
  display: flex;
  overflow: hidden;
}

.sidebar-container {
  width: $sidebar-width;
  height: 100%;
  background: $bg-sidebar;
  transition: width $animation-duration-base;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.05);
  position: relative;
  z-index: $z-index-fixed;
  overflow-y: auto;
  overflow-x: hidden;
  
  &.collapse {
    width: $sidebar-collapsed-width;
  }
  
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #eaeaea;
    border-radius: 20px;
  }
  
  .el-menu {
    border-right: none;
  }
}

.logo-container {
  height: $navbar-height;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 $spacing-base;
  overflow: hidden;
  
  .logo-title {
    color: $primary-dark;
    font-size: $font-size-large;
    margin: 0;
    white-space: nowrap;
    display: flex;
    align-items: center;
    font-weight: 500;
    
    .el-icon {
      margin-right: $spacing-small;
      font-size: 24px;
      color: $primary;
    }
  }
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: $bg-container;
}

.navbar {
  height: $navbar-height;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 $spacing-medium;
  background-color: $bg-navbar;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: $z-index-fixed;
  
  .left-menu {
    display: flex;
    align-items: center;
    
    .toggle-btn {
      font-size: 20px;
      cursor: pointer;
      margin-right: $spacing-medium;
      padding: $spacing-mini;
      border-radius: $border-radius-circle;
      transition: all $animation-duration-base;
      
      &.is-active {
        transform: rotate(180deg);
      }
    }
  }
  
  .right-menu {
    display: flex;
    align-items: center;
    
    .right-menu-item {
      margin-right: $spacing-medium;
      
      .nav-icon {
        font-size: 18px;
        padding: $spacing-mini;
        cursor: pointer;
        color: $text-regular;
      }
    }
    
    .avatar-wrapper {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: $spacing-mini $spacing-small;
      border-radius: $border-radius-base;
      transition: all $animation-duration-fast;
      
      .user-avatar {
        background-color: $primary-light;
        color: white;
        font-weight: 600;
      }
      
      .user-name {
        margin: 0 $spacing-small;
        color: $text-primary;
        font-size: $font-size-base;
      }
      
      .el-icon {
        font-size: 12px;
        color: $text-secondary;
      }
    }
  }
}

.app-main {
  flex: 1;
  overflow: auto;
  position: relative;
  padding: $spacing-medium;
}

// 淡入淡出过渡动画
.fade-transform-enter-active, 
.fade-transform-leave-active {
  transition: all 0.5s ease;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

// 响应式媒体查询
@media screen and (max-width: 768px) {
  .sidebar-container {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    z-index: 1001;
    
    &.collapse {
      width: 0;
    }
    
    &:not(.collapse) {
      width: 210px;
    }
  }
  
  .navbar {
    .right-menu {
      .user-name {
        display: none;
      }
    }
  }
}

// 按钮交互效果类
.btn-hover-effect {
  transition: transform $animation-duration-fast;
  
  &:hover {
    transform: translateY(-2px);
    color: $primary;
  }
  
  &:active {
    transform: translateY(0);
  }
}
</style> 