<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div class="filter-item">
        <el-form :inline="true" :model="queryParams" class="demo-form-inline">
          <el-form-item label="订单编号">
            <el-input v-model="queryParams.orderNo" placeholder="订单编号" clearable />
          </el-form-item>
          <el-form-item label="订单状态">
            <el-select v-model="queryParams.status" placeholder="订单状态" clearable>
              <el-option label="全部" value="" />
              <el-option label="待支付" value="pending_payment" />
              <el-option label="待发货" value="pending_shipment" />
              <el-option label="已发货" value="shipped" />
              <el-option label="已完成" value="completed" />
              <el-option label="已取消" value="cancelled" />
            </el-select>
          </el-form-item>
          <el-form-item label="用户ID">
            <el-input v-model="queryParams.userId" placeholder="用户ID" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="resetQuery">重置</el-button>
            <el-button type="success" @click="handleExport">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 订单统计卡片 -->
    <el-row :gutter="20" class="statistics-container">
      <el-col :span="4" v-for="(item, index) in statistics" :key="index">
        <el-card shadow="hover" class="statistics-card">
          <template #header>
            <div class="card-header">
              <span>{{ item.title }}</span>
            </div>
          </template>
          <div class="statistics-value">{{ item.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 订单列表表格 -->
    <el-card class="table-container">
      <el-table
        v-loading="loading"
        :data="orderList"
        border
        style="width: 100%"
        row-key="orderId"
      >
        <el-table-column prop="orderId" label="订单ID" width="80" />
        <el-table-column prop="orderNo" label="订单编号" width="180" />
        <el-table-column prop="userId" label="用户ID" width="80" />
        <el-table-column label="订单金额" width="120">
          <template #default="scope">
            ¥{{ scope.row.totalAmount }}
          </template>
        </el-table-column>
        <el-table-column label="实付金额" width="120">
          <template #default="scope">
            ¥{{ scope.row.actualAmount }}
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="120">
          <template #default="scope">
            <order-status-tag :status="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="支付方式" width="120">
          <template #default="scope">
            <el-tag 
              v-if="scope.row.paymentMethod" 
              :type="getPaymentMethodTagType(scope.row.paymentMethod)" 
              effect="plain"
            >
              {{ getPaymentMethodText(scope.row.paymentMethod) }}
            </el-tag>
            <el-tag v-else type="info" effect="plain">未支付</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template #default="scope">
            {{ formatDateTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="支付时间" width="180">
          <template #default="scope">
            {{ scope.row.payTime ? formatDateTime(scope.row.payTime) : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="scope">
            <el-button type="primary" link @click="handleDetail(scope.row)">详情</el-button>
            <el-button 
              v-if="scope.row.status === 'pending_shipment'"
              type="success" 
              link 
              @click="handleShip(scope.row)"
            >
              发货
            </el-button>
            <el-button 
              v-if="['pending_payment', 'pending_shipment'].includes(scope.row.status)"
              type="danger" 
              link 
              @click="handleCancel(scope.row)"
            >
              取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 30, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 发货对话框 -->
    <el-dialog title="订单发货" v-model="shipDialogVisible" width="500px">
      <el-form :model="shipForm" label-width="100px">
        <el-form-item label="订单编号">
          <span>{{ currentOrder?.orderNo }}</span>
        </el-form-item>
        <el-form-item label="物流公司" required>
          <el-select v-model="shipForm.shippingCompany" placeholder="请选择物流公司" style="width: 100%">
            <el-option label="顺丰速运" value="SF" />
            <el-option label="中通快递" value="ZTO" />
            <el-option label="圆通速递" value="YTO" />
            <el-option label="韵达快递" value="YD" />
            <el-option label="申通快递" value="STO" />
            <el-option label="京东物流" value="JD" />
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" required>
          <el-input v-model="shipForm.trackingNo" placeholder="请输入物流单号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="shipDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmShip">确认发货</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 取消订单对话框 -->
    <el-dialog title="取消订单" v-model="cancelDialogVisible" width="500px">
      <el-form :model="cancelForm" label-width="100px">
        <el-form-item label="订单编号">
          <span>{{ currentOrder?.orderNo }}</span>
        </el-form-item>
        <el-form-item label="取消原因" required>
          <el-input
            v-model="cancelForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入取消原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmCancel">确认取消订单</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getOrderList, getOrderStatistics, updateOrderStatus, shipOrder, exportOrders } from '@/api/order'
import OrderStatusTag from '@/components/OrderStatusTag.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatImageUrl } from '@/utils/imageUtils'
import { formatDateTime } from '@/utils/dateUtils'

const router = useRouter()
const loading = ref(false)
const orderList = ref([])
const total = ref(0)
const shipDialogVisible = ref(false)
const cancelDialogVisible = ref(false)
const currentOrder = ref(null)

// 查询参数
const queryParams = reactive({
  page: 1,
  pageSize: 10,
  orderNo: '',
  status: '',
  userId: ''
})

// 统计数据
const statistics = ref([
  { title: '总订单数', value: 0 },
  { title: '待支付', value: 0 },
  { title: '待发货', value: 0 },
  { title: '已发货', value: 0 },
  { title: '已完成', value: 0 }
])

// 发货表单
const shipForm = reactive({
  shippingCompany: '',
  trackingNo: ''
})

// 取消订单表单
const cancelForm = reactive({
  remark: ''
})

// 获取订单列表
const getOrders = async () => {
  loading.value = true
  try {
    const response = await getOrderList(queryParams)
    orderList.value = response.data.list
    total.value = response.data.total
  } catch (error) {
    console.error('获取订单列表失败:', error)
    ElMessage.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

// 获取订单统计数据
const fetchStatistics = async () => {
  try {
    const response = await getOrderStatistics()
    if (response.data) {
      statistics.value = [
        { title: '总订单数', value: response.data.total || 0 },
        { title: '待支付', value: response.data.pending_payment || 0 },
        { title: '待发货', value: response.data.pending_shipment || 0 },
        { title: '已发货', value: response.data.shipped || 0 },
        { title: '已完成', value: response.data.completed || 0 }
      ]
    }
  } catch (error) {
    console.error('获取订单统计数据失败:', error)
  }
}

// 处理搜索
const handleSearch = () => {
  queryParams.page = 1
  getOrders()
}

// 重置查询
const resetQuery = () => {
  queryParams.orderNo = ''
  queryParams.status = ''
  queryParams.userId = ''
  queryParams.page = 1
  getOrders()
}

// 处理每页显示数量变化
const handleSizeChange = (val) => {
  queryParams.pageSize = val
  getOrders()
}

// 处理页码变化
const handleCurrentChange = (val) => {
  queryParams.page = val
  getOrders()
}

// 查看订单详情
const handleDetail = (row) => {
  router.push(`/order/detail/${row.orderId}`)
}

// 处理发货
const handleShip = (row) => {
  currentOrder.value = row
  shipForm.shippingCompany = ''
  shipForm.trackingNo = ''
  shipDialogVisible.value = true
}

// 确认发货
const confirmShip = async () => {
  if (!shipForm.shippingCompany || !shipForm.trackingNo) {
    return ElMessage.warning('请填写完整的物流信息')
  }

  try {
    const response = await shipOrder(
      currentOrder.value.orderId,
      shipForm.shippingCompany,
      shipForm.trackingNo
    )
    
    if (response.code === 200) {
      ElMessage.success('发货成功')
      shipDialogVisible.value = false
      getOrders()
      fetchStatistics()
    } else {
      ElMessage.error(response.message || '发货失败')
    }
  } catch (error) {
    console.error('发货失败:', error)
    ElMessage.error('发货失败')
  }
}

// 处理取消订单
const handleCancel = (row) => {
  currentOrder.value = row
  cancelForm.remark = ''
  cancelDialogVisible.value = true
}

// 确认取消订单
const confirmCancel = async () => {
  if (!cancelForm.remark) {
    return ElMessage.warning('请填写取消原因')
  }

  try {
    const response = await updateOrderStatus(
      currentOrder.value.orderId,
      'cancelled',
      cancelForm.remark
    )
    
    if (response.code === 200) {
      ElMessage.success('订单已取消')
      cancelDialogVisible.value = false
      getOrders()
      fetchStatistics()
    } else {
      ElMessage.error(response.message || '取消订单失败')
    }
  } catch (error) {
    console.error('取消订单失败:', error)
    ElMessage.error('取消订单失败')
  }
}

// 导出订单数据
const handleExport = async () => {
  ElMessageBox.confirm('确定要导出订单数据吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const response = await exportOrders(queryParams)
      
      // 创建一个Blob对象
      const blob = new Blob([response], { type: 'application/vnd.ms-excel' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      
      // 获取当前时间为文件名
      const date = new Date()
      const fileName = `订单数据_${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}.xlsx`
      link.download = fileName
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      ElMessage.success('导出成功')
    } catch (error) {
      console.error('导出订单数据失败:', error)
      ElMessage.error('导出订单数据失败')
    }
  }).catch(() => {})
}

// 获取支付方式显示文本
const getPaymentMethodText = (method) => {
  switch (method) {
    case 'alipay':
      return '支付宝'
    case 'wechat':
      return '微信支付'
    case 'wallet':
      return '钱包支付'
    default:
      return method
  }
}

// 获取支付方式标签类型
const getPaymentMethodTagType = (method) => {
  switch (method) {
    case 'alipay':
      return 'primary' // 蓝色
    case 'wechat':
      return 'success' // 绿色
    case 'wallet':
      return 'danger'  // 红色
    default:
      return 'info'    // 灰色
  }
}

// 组件挂载时获取数据
onMounted(() => {
  getOrders()
  fetchStatistics()
})
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.filter-container {
  margin-bottom: 20px;
}

.filter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistics-container {
  margin-bottom: 20px;
}

.statistics-card {
  text-align: center;
}

.statistics-value {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
}

.table-container {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style> 