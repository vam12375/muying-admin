<template>
  <div class="comment-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>评价管理</span>
          <el-button 
            v-if="queryParams.orderId" 
            type="primary" 
            size="small" 
            @click="backToOrderDetail"
          >
            返回订单详情
          </el-button>
        </div>
      </template>
      
      <!-- 搜索表单 -->
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="商品ID" prop="productId">
          <el-input v-model="queryParams.productId" placeholder="商品ID" clearable />
        </el-form-item>
        <el-form-item label="订单ID" prop="orderId">
          <el-input v-model="queryParams.orderId" placeholder="订单ID" clearable />
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="queryParams.userId" placeholder="用户ID" clearable />
        </el-form-item>
        <el-form-item label="评分" prop="rating">
          <el-select v-model="queryParams.rating" placeholder="请选择评分" clearable>
            <el-option v-for="i in 5" :key="i" :label="`${i}星`" :value="i" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option label="显示" :value="1" />
            <el-option label="隐藏" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
          <el-button type="info" @click="clearOrderIdFilter" v-if="queryParams.orderId">清除订单筛选</el-button>
          <el-button type="success" @click="exportData">导出数据</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 表格 -->
      <el-table
        v-loading="loading"
        :data="commentList"
        border
        style="width: 100%"
        :row-class-name="rowClassName"
      >
        <el-table-column type="index" width="50" />
        <el-table-column prop="commentId" label="评价ID" width="80" />
        <el-table-column prop="userId" label="用户ID" width="80" />
        <el-table-column prop="userNickname" label="用户昵称" min-width="100">
          <template #default="scope">
            <span>{{ scope.row.userNickname || '匿名用户' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderId" label="订单ID" width="80" />
        <el-table-column prop="productId" label="商品ID" width="80" />
        <el-table-column prop="productName" label="商品名称" min-width="120" />
        <el-table-column prop="content" label="评价内容" min-width="200" show-overflow-tooltip />
        <el-table-column label="评分" width="120">
          <template #default="scope">
            <el-rate v-model="scope.row.rating" disabled show-score />
          </template>
        </el-table-column>
        <el-table-column label="图片" width="120">
          <template #default="scope">
            <el-button v-if="scope.row.images && scope.row.images.length" size="small" @click="previewImages(scope.row.images)">
              查看图片({{ scope.row.images.length }})
            </el-button>
            <span v-else>无图片</span>
          </template>
        </el-table-column>
        <el-table-column prop="isAnonymous" label="匿名" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.isAnonymous === 1 ? 'info' : 'success'">
              {{ scope.row.isAnonymous === 1 ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
              {{ scope.row.status === 1 ? '显示' : '隐藏' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="160" />
        <el-table-column fixed="right" label="操作" width="180">
          <template #default="scope">
            <el-button 
              :type="scope.row.status === 1 ? 'warning' : 'success'"
              size="small" 
              @click="handleStatusChange(scope.row)"
            >
              {{ scope.row.status === 1 ? '隐藏' : '显示' }}
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
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.size"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 图片预览 -->
    <el-dialog v-model="previewVisible" title="图片预览" width="800px">
      <el-carousel height="400px">
        <el-carousel-item v-for="(url, index) in previewImageList" :key="index">
          <img :src="url" style="width: 100%; height: 100%; object-fit: contain;" />
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted, defineComponent } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCommentList, updateCommentStatus, deleteComment, exportCommentData } from '@/api/comment'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'CommentManagement',
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    // 查询参数
    const queryParams = reactive({
      page: 1,
      size: 10,
      productId: undefined,
      orderId: undefined,
      userId: undefined,
      rating: undefined,
      status: undefined
    })
    
    // 评价列表
    const commentList = ref([])
    const total = ref(0)
    const loading = ref(false)
    
    // 图片预览
    const previewVisible = ref(false)
    const previewImageList = ref([])
    
    // 查询评价列表
    const getList = async () => {
      loading.value = true
      try {
        const { data } = await getCommentList(queryParams)
        if (data) {
          commentList.value = data.records
          total.value = data.total
          
          // 处理图片列表
          commentList.value.forEach(item => {
            if (item.images && typeof item.images === 'string') {
              item.images = item.images.split(',').filter(Boolean)
            }
          })
        }
      } catch (error) {
        console.error('获取评价列表失败:', error)
        ElMessage.error('获取评价列表失败')
      } finally {
        loading.value = false
      }
    }
    
    // 重置查询
    const queryForm = ref(null)
    const resetQuery = () => {
      queryForm.value?.resetFields()
      queryParams.page = 1
      getList()
    }
    
    // 查询按钮
    const handleQuery = () => {
      queryParams.page = 1
      getList()
    }
    
    // 分页事件
    const handleSizeChange = (size) => {
      queryParams.size = size
      getList()
    }
    
    const handleCurrentChange = (page) => {
      queryParams.page = page
      getList()
    }
    
    // 状态变更
    const handleStatusChange = async (row) => {
      const newStatus = row.status === 1 ? 0 : 1
      const statusText = newStatus === 1 ? '显示' : '隐藏'
      
      try {
        await ElMessageBox.confirm(`确认要将该评价${statusText}吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        const { data } = await updateCommentStatus(row.commentId, newStatus)
        
        if (data) {
          ElMessage.success(`${statusText}成功`)
          row.status = newStatus
        } else {
          ElMessage.error(`${statusText}失败`)
        }
      } catch (error) {
        console.error(`${statusText}失败:`, error)
      }
    }
    
    // 删除评价
    const handleDelete = async (row) => {
      try {
        await ElMessageBox.confirm('确认要删除该评价吗？删除后无法恢复', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        const { data } = await deleteComment(row.commentId)
        
        if (data) {
          ElMessage.success('删除成功')
          getList()
        } else {
          ElMessage.error('删除失败')
        }
      } catch (error) {
        console.error('删除失败:', error)
      }
    }
    
    // 导出数据
    const exportData = async () => {
      try {
        const { data } = await exportCommentData(queryParams)
        
        if (!data) {
          ElMessage.error('导出失败')
          return
        }
        
        // 创建下载链接
        const blob = new Blob([data], { type: 'application/vnd.ms-excel' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `评价数据_${new Date().getTime()}.xlsx`
        link.click()
        URL.revokeObjectURL(link.href)
        
        ElMessage.success('导出成功')
      } catch (error) {
        console.error('导出失败:', error)
        ElMessage.error('导出失败')
      }
    }
    
    // 图片预览
    const previewImages = (images) => {
      previewImageList.value = images
      previewVisible.value = true
    }
    
    // 清除订单筛选
    const clearOrderIdFilter = () => {
      queryParams.orderId = undefined
      getList()
    }
    
    // 行高亮函数
    const rowClassName = ({ row }) => {
      if (queryParams.orderId && row.orderId === queryParams.orderId) {
        return 'highlight-row'
      }
      return ''
    }
    
    // 返回订单详情
    const backToOrderDetail = () => {
      router.push(`/order/detail/${queryParams.orderId}`)
    }
    
    onMounted(() => {
      // 检查URL参数中是否有orderId
      const orderId = route.query.orderId
      if (orderId) {
        queryParams.orderId = orderId
      }
      getList()
    })
    
    return {
      queryParams,
      commentList,
      total,
      loading,
      queryForm,
      previewVisible,
      previewImageList,
      getList,
      resetQuery,
      handleQuery,
      handleSizeChange,
      handleCurrentChange,
      handleStatusChange,
      handleDelete,
      exportData,
      previewImages,
      clearOrderIdFilter,
      rowClassName,
      backToOrderDetail
    }
  }
})
</script>

<style lang="scss" scoped>
.comment-management {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}

:deep(.highlight-row) {
  background-color: #fdf6ec;
}
</style> 