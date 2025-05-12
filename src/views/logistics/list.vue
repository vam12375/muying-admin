<template>
  <div class="logistics-list-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>物流管理</span>
        </div>
      </template>
      
      <div class="search-box">
        <el-select v-model="queryParams.status" placeholder="物流状态" clearable style="width: 150px;">
          <el-option label="全部" value=""></el-option>
          <el-option label="已创建" value="CREATED"></el-option>
          <el-option label="运输中" value="SHIPPING"></el-option>
          <el-option label="已送达" value="DELIVERED"></el-option>
          <el-option label="异常" value="EXCEPTION"></el-option>
        </el-select>
        <el-input v-model="queryParams.keyword" placeholder="输入物流单号、收件人姓名或电话搜索" clearable @keyup.enter="handleQuery" style="width: 300px;"></el-input>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </div>
      
      <el-table v-loading="loading" :data="logisticsList" border>
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column prop="orderId" label="订单ID" width="80"></el-table-column>
        <el-table-column prop="trackingNo" label="物流单号" width="180"></el-table-column>
        <el-table-column prop="company.name" label="物流公司" width="150"></el-table-column>
        <el-table-column prop="receiverName" label="收件人" width="120"></el-table-column>
        <el-table-column prop="receiverPhone" label="联系电话" width="150"></el-table-column>
        <el-table-column prop="status" label="物流状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="shippingTime" label="发货时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.shippingTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="scope">
            <el-button type="primary" link @click="handleDetail(scope.row)">详情</el-button>
            <el-button 
              type="primary" 
              link 
              @click="handleUpdateStatus(scope.row, 'SHIPPING')" 
              v-if="scope.row.status === 'CREATED'"
            >开始运输</el-button>
            <el-button 
              type="success" 
              link 
              @click="handleUpdateStatus(scope.row, 'DELIVERED')" 
              v-if="scope.row.status === 'SHIPPING'"
            >已送达</el-button>
            <el-button 
              type="danger" 
              link 
              @click="handleUpdateStatus(scope.row, 'EXCEPTION')" 
              v-if="scope.row.status !== 'DELIVERED' && scope.row.status !== 'EXCEPTION'"
            >标记异常</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          v-model:currentPage="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 状态更新对话框 -->
    <el-dialog 
      title="更新物流状态" 
      v-model="statusDialogVisible" 
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="statusForm" ref="statusFormRef" label-width="80px">
        <el-form-item label="物流单号">
          <el-input v-model="statusForm.trackingNo" disabled></el-input>
        </el-form-item>
        <el-form-item label="物流公司">
          <el-input v-model="statusForm.companyName" disabled></el-input>
        </el-form-item>
        <el-form-item label="原状态">
          <el-tag :type="getStatusType(statusForm.oldStatus)">
            {{ getStatusText(statusForm.oldStatus) }}
          </el-tag>
        </el-form-item>
        <el-form-item label="新状态">
          <el-tag :type="getStatusType(statusForm.newStatus)">
            {{ getStatusText(statusForm.newStatus) }}
          </el-tag>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="statusForm.remark" type="textarea" :rows="3" placeholder="请输入备注信息"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="statusDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitStatusForm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { getLogisticsList, updateLogisticsStatus } from '@/api/logistics'

const router = useRouter()

// 查询参数
const queryParams = reactive({
  page: 1,
  pageSize: 10,
  status: '',
  keyword: ''
})

// 列表数据
const logisticsList = ref([])
const total = ref(0)
const loading = ref(false)

// 状态对话框数据
const statusDialogVisible = ref(false)
const statusFormRef = ref(null)
const statusForm = reactive({
  id: undefined,
  trackingNo: '',
  companyName: '',
  oldStatus: '',
  newStatus: '',
  remark: ''
})

// 获取物流列表
const getList = async () => {
  loading.value = true
  try {
    const res = await getLogisticsList(queryParams)
    logisticsList.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    console.error('获取物流列表失败', error)
    ElMessage.error('获取物流列表失败')
  } finally {
    loading.value = false
  }
}

// 获取状态类型
const getStatusType = (status) => {
  switch (status) {
    case 'CREATED': return 'info'
    case 'SHIPPING': return 'primary'
    case 'DELIVERED': return 'success'
    case 'EXCEPTION': return 'danger'
    default: return 'info'
  }
}

// 获取状态文本
const getStatusText = (status) => {
  switch (status) {
    case 'CREATED': return '已创建'
    case 'SHIPPING': return '运输中'
    case 'DELIVERED': return '已送达'
    case 'EXCEPTION': return '异常'
    default: return '未知'
  }
}

// 查询按钮
const handleQuery = () => {
  queryParams.page = 1
  getList()
}

// 重置查询
const resetQuery = () => {
  queryParams.status = ''
  queryParams.keyword = ''
  handleQuery()
}

// 分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getList()
}

// 页码变化
const handleCurrentChange = (page) => {
  queryParams.page = page
  getList()
}

// 查看详情
const handleDetail = (row) => {
  router.push({ name: 'LogisticsDetail', params: { id: row.id } })
}

// 更新状态对话框
const handleUpdateStatus = (row, newStatus) => {
  Object.assign(statusForm, {
    id: row.id,
    trackingNo: row.trackingNo,
    companyName: row.company.name,
    oldStatus: row.status,
    newStatus: newStatus,
    remark: ''
  })
  statusDialogVisible.value = true
}

// 提交状态更新
const submitStatusForm = async () => {
  try {
    await updateLogisticsStatus(statusForm.id, statusForm.newStatus, statusForm.remark)
    ElMessage.success('状态更新成功')
    statusDialogVisible.value = false
    getList()
  } catch (error) {
    console.error('状态更新失败', error)
    ElMessage.error('状态更新失败: ' + (error.response?.data?.message || error.message))
  }
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
    second: '2-digit',
  })
}

// 页面加载时获取数据
onMounted(() => {
  getList()
})
</script>

<style scoped>
.logistics-list-container {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.search-box {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 