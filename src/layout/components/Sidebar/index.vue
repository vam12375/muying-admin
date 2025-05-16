<template>
  <div :class="{'has-logo': showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
    <div class="notification-area">
      <el-badge :value="unreadMessageCount" :hidden="unreadMessageCount === 0">
        <message-outlined class="message-icon" @click="goToMessage" />
      </el-badge>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'
import variables from '@/styles/variables.module.scss'
import { getUnreadCount } from '@/api/message'
import { MessageOutlined } from '@ant-design/icons-vue'

export default {
  components: { SidebarItem, Logo, MessageOutlined },
  setup() {
    const appStore = useAppStore()
    const router = useRouter()
    const route = useRoute()
    
    // 获取未读消息数量
    const unreadMessageCount = ref(0)
    const messageRefreshTimer = ref(null)
    
    const fetchUnreadCount = async () => {
      try {
        const response = await getUnreadCount()
        if (response.code === 200) {
          unreadMessageCount.value = response.data || 0
        }
      } catch (error) {
        console.error('获取未读消息数量失败:', error)
      }
    }
    
    // 定时刷新未读消息数量
    const startMessageRefresh = () => {
      fetchUnreadCount() // 初始获取一次
      messageRefreshTimer.value = setInterval(() => {
        fetchUnreadCount()
      }, 60000) // 每分钟刷新一次
    }
    
    // 跳转到消息中心
    const goToMessage = () => {
      router.push('/message/index')
    }
    
    onMounted(() => {
      startMessageRefresh()
    })
    
    return {
      isCollapse: computed(() => !appStore.sidebar.opened),
      showLogo: computed(() => appStore.settings.sidebarLogo),
      variables,
      routes: computed(() => {
        // 按照meta.index对路由进行排序
        const permittedRoutes = router.options.routes
          .filter(route => {
            return !route.hidden
          })
          .sort((a, b) => {
            return (a.meta?.index || 100) - (b.meta?.index || 100)
          })
        return permittedRoutes
      }),
      activeMenu: computed(() => {
        const { meta, path } = route
        if (meta.activeMenu) {
          return meta.activeMenu
        }
        return path
      }),
      unreadMessageCount,
      goToMessage
    }
  }
}
</script>

<style lang="scss" scoped>
.notification-area {
  position: fixed;
  left: 20px;
  bottom: 20px;
  z-index: 100;
  display: flex;
  align-items: center;
  
  .message-icon {
    font-size: 20px;
    color: #fff;
    cursor: pointer;
    background: var(--el-color-primary);
    border-radius: 50%;
    padding: 8px;
    
    &:hover {
      background: var(--el-color-primary-light-3);
    }
  }
}
</style> 