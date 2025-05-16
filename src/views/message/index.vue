<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="消息类型">
          <el-select v-model="listQuery.type" placeholder="选择消息类型" clearable>
            <el-option label="全部消息" value="" />
            <el-option label="催发货提醒" value="shipping_reminder" />
            <el-option label="系统消息" value="system" />
          </el-select>
        </el-form-item>
        <el-form-item label="读取状态">
          <el-select v-model="listQuery.isRead" placeholder="选择读取状态" clearable>
            <el-option label="全部" value="" />
            <el-option label="未读" :value="0" />
            <el-option label="已读" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="listQuery.keyword" placeholder="标题/内容关键词" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="所有消息" name="all"></el-tab-pane>
      <el-tab-pane label="催发货提醒" name="shipping_reminder">
        <el-badge :value="unrepliedShippingReminders" :hidden="!unrepliedShippingReminders" />
      </el-tab-pane>
    </el-tabs>

    <div class="action-bar">
      <el-button type="primary" @click="handleCreateSystemMessage">
        创建系统消息
      </el-button>
      <el-button type="info" @click="handleMarkAllRead" :disabled="!hasUnreadMessages">
        全部标为已读
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中..."
      border
      fit
      highlight-current-row
      size="large"
      stripe
    >
      <el-table-column prop="username" label="用户" min-width="100" align="center">
        <template #default="scope">
          <div class="user-info">
            <el-avatar :size="32" :src="scope.row.avatar">{{ scope.row.username ? scope.row.username.substring(0, 1) : 'U' }}</el-avatar>
            <span>{{ scope.row.username || '系统消息' }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="title" label="标题" min-width="150">
        <template #default="scope">
          <div class="message-title" @click="handleViewMessage(scope.row)">
            <span>{{ scope.row.title }}</span>
            <el-tag v-if="scope.row.isRead === 0" size="small" type="danger">未读</el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="content" label="内容" min-width="250">
        <template #default="scope">
          <div class="message-content">{{ scope.row.content }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="typeDesc" label="类型" min-width="100" align="center">
        <template #default="scope">
          <el-tag
            :type="getMessageTypeTagType(scope.row.type)"
          >
            {{ scope.row.typeDesc }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="时间" min-width="150" align="center">
        <template #default="scope">
          {{ formatDate(scope.row.createTime) }}
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="150" align="center">
        <template #default="scope">
          <el-button
            v-if="scope.row.isRead === 0"
            type="primary"
            size="small"
            @click="handleMarkRead(scope.row)"
          >
            标记已读
          </el-button>
          <el-button
            type="success"
            size="small"
            @click="handleViewMessage(scope.row)"
          >
            查看
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="total > 0"
      style="margin-top: 20px"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100]"
      v-model:current-page="listQuery.page"
      v-model:page-size="listQuery.size"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 消息详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="消息详情" width="40%">
      <div v-if="currentMessage" class="message-detail">
        <h2 class="detail-title">{{ currentMessage.title }}</h2>
        <div class="detail-meta">
          <div class="meta-item">
            <span class="meta-label">发送者：</span>
            <span>{{ currentMessage.username || '系统' }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">类型：</span>
            <span>{{ currentMessage.typeDesc }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">时间：</span>
            <span>{{ formatDate(currentMessage.createTime) }}</span>
          </div>
        </div>
        <div class="detail-content">{{ currentMessage.content }}</div>
        <div class="detail-actions">
          <template v-if="currentMessage.type === 'shipping_reminder'">
            <el-button type="primary" @click="handleViewOrder(currentMessage)">
              查看订单
            </el-button>
            <el-button type="success" @click="handleProcessShippingReminder(currentMessage)">
              处理催发货
            </el-button>
          </template>
        </div>
      </div>
    </el-dialog>

    <!-- 发送系统消息对话框 -->
    <el-dialog v-model="systemMessageDialogVisible" title="发送系统消息" width="500px">
      <el-form :model="systemMessageForm" :rules="systemMessageRules" ref="systemMessageFormRef" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="systemMessageForm.title" placeholder="请输入消息标题" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="systemMessageForm.content"
            type="textarea"
            :rows="5"
            placeholder="请输入消息内容"
          />
        </el-form-item>
        <el-form-item label="附加信息">
          <el-input
            v-model="systemMessageForm.extra"
            placeholder="可选，JSON格式的附加信息"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="systemMessageDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitSystemMessage" :loading="systemMessageSubmitting">
            发送
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getMessageList, getShippingReminderMessages, createSystemMessage, markMessageRead, markAllRead, deleteMessage, getUnreadCount } from '@/api/message'
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
  name: 'MessageList',
  setup() {
    const router = useRouter()
    
    // 消息列表状态
    const list = ref([])
    const total = ref(0)
    const listLoading = ref(false)
    const activeTab = ref('all')
    const hasUnreadMessages = ref(false)
    const unrepliedShippingReminders = ref(0)

    // 查询参数
    const listQuery = reactive({
      page: 1,
      size: 10,
      type: '',
      isRead: '',
      keyword: ''
    })

    // 消息详情对话框
    const detailDialogVisible = ref(false)
    const currentMessage = ref(null)

    // 系统消息对话框
    const systemMessageDialogVisible = ref(false)
    const systemMessageFormRef = ref(null)
    const systemMessageSubmitting = ref(false)
    const systemMessageForm = reactive({
      title: '',
      content: '',
      extra: ''
    })
    const systemMessageRules = {
      title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
      content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
    }

    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return ''
      
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }

    // 获取消息类型样式
    const getMessageTypeTagType = (type) => {
      const typeMap = {
        'system': 'info',
        'order': 'success',
        'promotion': 'warning',
        'points': 'warning',
        'shipping_reminder': 'danger',
        'remind': 'primary',
        'checkin': 'success'
      }
      return typeMap[type] || 'info'
    }

    // 获取消息列表
    const getList = async () => {
      listLoading.value = true
      
      try {
        let response
        if (activeTab.value === 'shipping_reminder') {
          // 催发货消息列表
          response = await getShippingReminderMessages({
            page: listQuery.page,
            size: listQuery.size
          })
        } else {
          // 普通消息列表
          response = await getMessageList({
            page: listQuery.page,
            size: listQuery.size,
            type: listQuery.type,
            isRead: listQuery.isRead,
            keyword: listQuery.keyword
          })
        }

        if (response.code === 200) {
          list.value = response.data.records || []
          total.value = response.data.total || 0
        } else {
          ElMessage.error(response.message || '获取消息列表失败')
        }
      } catch (error) {
        console.error('获取消息列表失败:', error)
        ElMessage.error('获取消息列表失败，请稍后再试')
      } finally {
        listLoading.value = false
      }
    }

    // 获取未读消息数量
    const getUnreadMessageCount = async () => {
      try {
        const response = await getUnreadCount()
        if (response.code === 200) {
          hasUnreadMessages.value = response.data > 0
          unrepliedShippingReminders.value = response.data // 这里假设未读消息数量主要是催发货消息
        }
      } catch (error) {
        console.error('获取未读消息数量失败:', error)
      }
    }

    // 重置查询条件
    const resetQuery = () => {
      listQuery.type = ''
      listQuery.isRead = ''
      listQuery.keyword = ''
      listQuery.page = 1
      getList()
    }

    // 标记消息为已读
    const handleMarkRead = async (row) => {
      try {
        const response = await markMessageRead(row.messageId)
        if (response.code === 200) {
          row.isRead = 1
          ElMessage.success('已标记为已读')
          getUnreadMessageCount()
        } else {
          ElMessage.error(response.message || '操作失败')
        }
      } catch (error) {
        console.error('标记已读失败:', error)
        ElMessage.error('操作失败，请稍后再试')
      }
    }

    // 标记所有消息为已读
    const handleMarkAllRead = async () => {
      try {
        const response = await markAllRead()
        if (response.code === 200) {
          list.value.forEach(item => {
            item.isRead = 1
          })
          ElMessage.success(`已将${response.data || '所有'}条消息标记为已读`)
          getUnreadMessageCount()
        } else {
          ElMessage.error(response.message || '操作失败')
        }
      } catch (error) {
        console.error('标记全部已读失败:', error)
        ElMessage.error('操作失败，请稍后再试')
      }
    }

    // 删除消息
    const handleDelete = async (row) => {
      try {
        await ElMessageBox.confirm('确定要删除这条消息吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        const response = await deleteMessage(row.messageId)
        if (response.code === 200) {
          const index = list.value.findIndex(item => item.messageId === row.messageId)
          if (index !== -1) {
            list.value.splice(index, 1)
          }
          ElMessage.success('删除成功')
          
          // 如果当前页已没有数据且不是第一页，则跳转到上一页
          if (list.value.length === 0 && listQuery.page > 1) {
            listQuery.page -= 1
            getList()
          }
        } else {
          ElMessage.error(response.message || '删除失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除消息失败:', error)
          ElMessage.error('删除失败，请稍后再试')
        }
      }
    }

    // 查看消息详情
    const handleViewMessage = (row) => {
      currentMessage.value = row
      detailDialogVisible.value = true
      
      // 如果是未读消息，自动标记为已读
      if (row.isRead === 0) {
        handleMarkRead(row)
      }
    }

    // 查看订单详情
    const handleViewOrder = (message) => {
      try {
        if (message && message.extra) {
          // 解析extra中的orderId
          const extraData = JSON.parse(message.extra)
          if (extraData && extraData.orderId) {
            // 跳转到订单详情页
            router.push(`/order/detail/${extraData.orderId}`)
            detailDialogVisible.value = false
          }
        }
      } catch (error) {
        console.error('解析订单数据失败:', error)
        ElMessage.error('无法查看订单详情')
      }
    }

    // 处理催发货
    const handleProcessShippingReminder = (message) => {
      try {
        if (message && message.extra) {
          // 解析extra中的orderId
          const extraData = JSON.parse(message.extra)
          if (extraData && extraData.orderId) {
            // 跳转到订单详情页的发货操作
            router.push(`/order/detail/${extraData.orderId}?action=ship`)
            detailDialogVisible.value = false
          }
        }
      } catch (error) {
        console.error('解析订单数据失败:', error)
        ElMessage.error('无法处理催发货')
      }
    }

    // 创建系统消息对话框
    const handleCreateSystemMessage = () => {
      systemMessageForm.title = ''
      systemMessageForm.content = ''
      systemMessageForm.extra = ''
      systemMessageDialogVisible.value = true
    }

    // 提交系统消息
    const submitSystemMessage = async () => {
      // 验证表单
      if (!systemMessageFormRef.value) return
      
      await systemMessageFormRef.value.validate(async (valid) => {
        if (!valid) return
        
        systemMessageSubmitting.value = true
        
        try {
          const response = await createSystemMessage(systemMessageForm)
          if (response.code === 200) {
            ElMessage.success('系统消息发送成功')
            systemMessageDialogVisible.value = false
            getList() // 刷新列表
          } else {
            ElMessage.error(response.message || '发送失败')
          }
        } catch (error) {
          console.error('发送系统消息失败:', error)
          ElMessage.error('发送失败，请稍后再试')
        } finally {
          systemMessageSubmitting.value = false
        }
      })
    }

    // 处理标签页切换
    const handleTabClick = () => {
      listQuery.page = 1
      
      if (activeTab.value === 'shipping_reminder') {
        // 切换到催发货标签页时清除筛选条件
        listQuery.type = 'shipping_reminder'
        listQuery.isRead = ''
        listQuery.keyword = ''
      } else {
        // 重置到默认查询条件
        listQuery.type = ''
      }
      
      getList()
    }

    // 处理分页大小变化
    const handleSizeChange = (size) => {
      listQuery.size = size
      getList()
    }

    // 处理当前页变化
    const handleCurrentChange = (page) => {
      listQuery.page = page
      getList()
    }

    // 监听查询条件变化，更新列表
    watch(() => activeTab.value, (newValue) => {
      if (newValue === 'shipping_reminder') {
        listQuery.type = 'shipping_reminder'
      }
    })

    // 组件挂载时获取数据
    onMounted(() => {
      getList()
      getUnreadMessageCount()
    })

    return {
      // 状态
      list,
      total,
      listLoading,
      listQuery,
      activeTab,
      hasUnreadMessages,
      unrepliedShippingReminders,
      detailDialogVisible,
      currentMessage,
      systemMessageDialogVisible,
      systemMessageFormRef,
      systemMessageSubmitting,
      systemMessageForm,
      systemMessageRules,

      // 方法
      formatDate,
      getMessageTypeTagType,
      getList,
      resetQuery,
      handleMarkRead,
      handleMarkAllRead,
      handleDelete,
      handleViewMessage,
      handleViewOrder,
      handleProcessShippingReminder,
      handleCreateSystemMessage,
      submitSystemMessage,
      handleTabClick,
      handleSizeChange,
      handleCurrentChange
    }
  }
})
</script>

<style lang="scss" scoped>
.filter-container {
  margin-bottom: 16px;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
  gap: 10px;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.message-title {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
}

.message-content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-all;
}

/* 消息详情样式 */
.message-detail {
  padding: 10px;
}

.detail-title {
  font-size: 18px;
  margin-bottom: 15px;
  color: #333;
}

.detail-meta {
  margin-bottom: 15px;
  color: #606266;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.meta-item {
  display: flex;
  align-items: center;
}

.meta-label {
  font-weight: bold;
  margin-right: 8px;
}

.detail-content {
  line-height: 1.6;
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
  white-space: pre-line;
}

.detail-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 