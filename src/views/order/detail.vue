<template>
  <div class="app-container">
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>
    
    <div v-else>
      <!-- 返回和操作按钮 -->
      <div class="top-actions">
        <el-button @click="goBack" icon="ArrowLeft">返回订单列表</el-button>
        <div class="action-buttons">
          <el-button 
            v-if="orderInfo.status === 'completed' && orderInfo.isCommented === 1"
            type="primary" 
            @click="viewComment"
          >
            查看评价
          </el-button>
          <el-button 
            v-if="orderInfo.status === 'pending_shipment'"
            type="success" 
            @click="handleShip"
          >
            发货
          </el-button>
          <el-button 
            v-if="['pending_payment', 'pending_shipment'].includes(orderInfo.status)"
            type="danger" 
            @click="handleCancel"
          >
            取消订单
          </el-button>
        </div>
      </div>

      <!-- 订单状态流程条 -->
      <el-card class="status-card">
        <el-steps :active="getStatusStep(orderInfo.status)" finish-status="success">
          <el-step title="待支付" description="买家下单付款" />
          <el-step title="待发货" description="商家备货发货" />
          <el-step title="已发货" description="等待买家收货" />
          <el-step title="已完成" description="交易完成" />
        </el-steps>
      </el-card>

      <!-- 订单基本信息 -->
      <el-card class="detail-card">
        <template #header>
          <div class="card-header">
            <span>订单基本信息</span>
          </div>
        </template>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="订单编号">{{ orderInfo.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="下单时间">{{ orderInfo.createTime }}</el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <order-status-tag :status="orderInfo.status" />
          </el-descriptions-item>
          <el-descriptions-item label="订单金额">¥{{ orderInfo.totalAmount }}</el-descriptions-item>
          <el-descriptions-item label="实付金额">¥{{ orderInfo.actualAmount }}</el-descriptions-item>
          <el-descriptions-item label="支付方式">
            <el-tag 
              v-if="orderInfo.paymentMethod" 
              :type="getPaymentMethodTagType(orderInfo.paymentMethod)" 
              effect="plain"
            >
              {{ getPaymentMethodText(orderInfo.paymentMethod) }}
            </el-tag>
            <el-tag v-else type="info" effect="plain">未支付</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="支付时间">
            {{ orderInfo.expireTime ? formatDateTime(orderInfo.expireTime) : (orderInfo.payTime ? formatDateTime(orderInfo.payTime) : '-') }}
          </el-descriptions-item>
          <el-descriptions-item label="支付流水号" :span="2">
            <div class="tracking-info" v-if="orderInfo.transactionId">
              {{ orderInfo.transactionId }}
              <el-button 
                type="primary" 
                link 
                @click="copyTrackingNo(orderInfo.transactionId)"
              >
                复制
              </el-button>
            </div>
            <span v-else>-</span>
          </el-descriptions-item>
          <el-descriptions-item label="订单备注">
            {{ orderInfo.remark || '无' }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 商品信息 -->
      <el-card class="detail-card">
        <template #header>
          <div class="card-header">
            <span>商品信息</span>
          </div>
        </template>
        <el-table :data="orderInfo.products || []" border style="width: 100%">
          <el-table-column prop="productId" label="商品ID" width="80" />
          <el-table-column label="商品图片" width="100">
            <template #default="scope">
              <el-image 
                style="width: 60px; height: 60px" 
                :src="formatImageUrl(scope.row.productImg)" 
                fit="cover"
                :preview-src-list="[formatImageUrl(scope.row.productImg)]"
                preview-teleported
              >
                <template #error>
                  <div class="image-error">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="商品名称" />
          <el-table-column label="规格" width="180">
            <template #default="scope">
              <span>{{ scope.row.specs || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单价" width="120">
            <template #default="scope">
              <span>¥{{ scope.row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="80" />
          <el-table-column label="小计" width="120">
            <template #default="scope">
              <span class="price-total">¥{{ (scope.row.price * scope.row.quantity).toFixed(2) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 订单金额信息 -->
        <div class="order-amount">
          <div class="amount-item">
            <span>商品总价：</span>
            <span>¥{{ orderInfo.totalAmount }}</span>
          </div>
          <div class="amount-item">
            <span>运费：</span>
            <span>¥{{ orderInfo.shippingFee || '0.00' }}</span>
          </div>
          <div class="amount-item" v-if="orderInfo.couponAmount">
            <span>优惠券：</span>
            <span>-¥{{ orderInfo.couponAmount }}</span>
          </div>
          <div class="amount-item" v-if="orderInfo.pointsDiscount">
            <span>积分抵扣：</span>
            <span>-¥{{ orderInfo.pointsDiscount }}</span>
          </div>
          <div class="amount-item" v-if="orderInfo.discountAmount">
            <span>其他优惠：</span>
            <span>-¥{{ orderInfo.discountAmount }}</span>
          </div>
          <div class="amount-item total">
            <span>实付金额：</span>
            <span class="price-total">¥{{ orderInfo.actualAmount }}</span>
          </div>
        </div>
      </el-card>

      <!-- 收货信息 -->
      <el-card class="detail-card">
        <template #header>
          <div class="card-header">
            <span>收货信息</span>
          </div>
        </template>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="收货人">{{ orderInfo.receiverName }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ orderInfo.receiverPhone }}</el-descriptions-item>
          <el-descriptions-item label="收货地址">
            {{ `${orderInfo.receiverProvince} ${orderInfo.receiverCity} ${orderInfo.receiverDistrict} ${orderInfo.receiverAddress}` }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 物流信息 -->
      <el-card v-if="orderInfo.status === 'shipped' || orderInfo.status === 'completed'" class="detail-card">
        <template #header>
          <div class="card-header">
            <span>物流信息</span>
            <el-button 
              v-if="logisticsInfo.id" 
              type="primary" 
              size="small" 
              @click="goToLogisticsDetail(logisticsInfo.id)"
            >
              查看物流详情
            </el-button>
          </div>
        </template>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="物流公司">{{ orderInfo.shippingCompany }}</el-descriptions-item>
          <el-descriptions-item label="物流单号">
            <div class="tracking-info">
              {{ orderInfo.trackingNo }}
              <el-button 
                v-if="orderInfo.trackingNo" 
                type="primary" 
                link 
                @click="copyTrackingNo(orderInfo.trackingNo)"
              >
                复制
              </el-button>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="发货时间">{{ orderInfo.shippingTime ? formatDateTime(orderInfo.shippingTime) : '-' }}</el-descriptions-item>
          <el-descriptions-item v-if="orderInfo.status === 'completed'" label="完成时间">
            {{ orderInfo.completionTime ? formatDateTime(orderInfo.completionTime) : '-' }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 订单操作记录 -->
      <el-card class="detail-card">
        <template #header>
          <div class="card-header">
            <span>订单操作记录</span>
          </div>
        </template>
        <el-table :data="orderLogs" border style="width: 100%">
          <el-table-column prop="stateTime" label="操作时间" width="180" />
          <el-table-column prop="oldState" label="原状态" width="120">
            <template #default="scope">
              <order-status-tag :status="scope.row.oldState" />
            </template>
          </el-table-column>
          <el-table-column prop="newState" label="新状态" width="120">
            <template #default="scope">
              <order-status-tag :status="scope.row.newState" />
            </template>
          </el-table-column>
          <el-table-column prop="operator" label="操作人" width="120" />
          <el-table-column prop="remark" label="备注" />
        </el-table>
      </el-card>
    </div>

    <!-- 发货对话框 -->
    <el-dialog title="订单发货" v-model="shipDialogVisible" width="500px">
      <el-form :model="shipForm" label-width="100px">
        <el-form-item label="订单编号">
          <span>{{ orderInfo.orderNo }}</span>
        </el-form-item>
        <el-form-item label="物流公司" required>
          <el-select v-model="shipForm.companyId" placeholder="请选择物流公司" style="width: 100%">
            <el-option 
              v-for="company in logisticsCompanies" 
              :key="company.id" 
              :label="company.name" 
              :value="company.id" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号">
          <div class="tracking-no-wrapper">
            <el-input v-model="shipForm.trackingNo" placeholder="留空将自动生成物流单号" />
            <el-button 
              type="primary" 
              :disabled="!shipForm.companyId"
              @click="generateTrackingNumber"
              :loading="generateLoading"
            >
              生成
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="收件人信息">
          <el-checkbox v-model="useOrderReceiver" @change="handleReceiverChange">使用订单收件人信息</el-checkbox>
        </el-form-item>
        <el-form-item label="收件人姓名" v-if="!useOrderReceiver">
          <el-input v-model="shipForm.receiverName" placeholder="请输入收件人姓名" />
        </el-form-item>
        <el-form-item label="收件人电话" v-if="!useOrderReceiver">
          <el-input v-model="shipForm.receiverPhone" placeholder="请输入收件人电话" />
        </el-form-item>
        <el-form-item label="收件人地址" v-if="!useOrderReceiver">
          <el-input v-model="shipForm.receiverAddress" placeholder="请输入收件人地址" />
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
          <span>{{ orderInfo.orderNo }}</span>
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
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrderDetail, updateOrderStatus, shipOrder } from '@/api/order'
import { getEnabledLogisticsCompanies, generateTrackingNo, getLogisticsByOrderId } from '@/api/logistics'
import OrderStatusTag from '@/components/OrderStatusTag.vue'
import { ElMessage } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'
import { formatImageUrl } from '@/utils/imageUtils'
import { formatDateTime } from '@/utils/dateUtils'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const orderInfo = ref({})
const orderLogs = ref([])
const shipDialogVisible = ref(false)
const cancelDialogVisible = ref(false)
const logisticsCompanies = ref([])
const generateLoading = ref(false)
const useOrderReceiver = ref(true)
const logisticsInfo = ref({})

// 发货表单
const shipForm = reactive({
  companyId: '',
  trackingNo: '',
  receiverName: '',
  receiverPhone: '',
  receiverAddress: ''
})

// 取消订单表单
const cancelForm = reactive({
  remark: ''
})

// 获取订单详情
const fetchOrderDetail = async () => {
  loading.value = true
  const orderId = route.params.id
  
  try {
    const response = await getOrderDetail(orderId)
    if (response.code === 200) {
      orderInfo.value = response.data
      
      // 如果订单已发货，获取物流信息
      if (orderInfo.value.status === 'shipped' || orderInfo.value.status === 'completed') {
        fetchLogisticsInfo(orderId)
      }
      
      // 订单日志
      if (response.data.stateLogs) {
        orderLogs.value = response.data.stateLogs
      } else {
        // 模拟数据，实际应该由后端提供
        orderLogs.value = [
          {
            stateTime: orderInfo.value.createTime,
            oldState: '',
            newState: 'pending_payment',
            operator: '用户',
            remark: '创建订单'
          }
        ]
        
        if (orderInfo.value.payTime) {
          orderLogs.value.push({
            stateTime: orderInfo.value.payTime,
            oldState: 'pending_payment',
            newState: 'pending_shipment',
            operator: '用户',
            remark: '支付订单'
          })
        }
        
        if (orderInfo.value.shippingTime) {
          orderLogs.value.push({
            stateTime: orderInfo.value.shippingTime,
            oldState: 'pending_shipment',
            newState: 'shipped',
            operator: '管理员',
            remark: '订单发货'
          })
        }
        
        if (orderInfo.value.completionTime) {
          orderLogs.value.push({
            stateTime: orderInfo.value.completionTime,
            oldState: 'shipped',
            newState: 'completed',
            operator: '用户',
            remark: '确认收货'
          })
        }
        
        if (orderInfo.value.cancelTime) {
          orderLogs.value.push({
            stateTime: orderInfo.value.cancelTime,
            oldState: orderInfo.value.payTime ? 'pending_shipment' : 'pending_payment',
            newState: 'cancelled',
            operator: orderInfo.value.cancelReason?.includes('超时') ? '系统' : '用户',
            remark: orderInfo.value.cancelReason || '用户取消'
          })
        }
      }
    } else {
      ElMessage.error(response.message || '获取订单详情失败')
    }
  } catch (error) {
    console.error('获取订单详情失败:', error)
    ElMessage.error('获取订单详情失败')
  } finally {
    loading.value = false
  }
}

// 获取物流信息
const fetchLogisticsInfo = async (orderId) => {
  try {
    const response = await getLogisticsByOrderId(orderId)
    if (response.code === 200) {
      logisticsInfo.value = response.data || {}
    } else {
      console.error('获取物流信息失败:', response.message)
    }
  } catch (error) {
    console.error('获取物流信息失败:', error)
  }
}

// 获取支付方式显示文本
const getPaymentMethodText = (method) => {
  if (!method) return '未支付'
  
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

// 获取状态步骤
const getStatusStep = (status) => {
  switch (status) {
    case 'pending_payment':
      return 0
    case 'pending_shipment':
      return 1
    case 'shipped':
      return 2
    case 'completed':
      return 3
    case 'cancelled':
      return 0 // 取消订单时步骤重置
    default:
      return 0
  }
}

// 返回订单列表
const goBack = () => {
  router.push('/order/list')
}

// 获取启用的物流公司列表
const fetchLogisticsCompanies = async () => {
  try {
    const response = await getEnabledLogisticsCompanies()
    if (response.code === 200) {
      logisticsCompanies.value = response.data
    } else {
      ElMessage.error(response.message || '获取物流公司列表失败')
    }
  } catch (error) {
    console.error('获取物流公司列表失败:', error)
    ElMessage.error('获取物流公司列表失败')
  }
}

// 生成物流单号
const generateTrackingNumber = async () => {
  if (!shipForm.companyId) {
    return ElMessage.warning('请先选择物流公司')
  }
  
  generateLoading.value = true
  try {
    const selectedCompany = logisticsCompanies.value.find(item => item.id === shipForm.companyId)
    if (!selectedCompany) {
      return ElMessage.warning('无效的物流公司')
    }
    
    const response = await generateTrackingNo(selectedCompany.code)
    if (response.code === 200) {
      shipForm.trackingNo = response.data
      ElMessage.success('物流单号生成成功')
    } else {
      ElMessage.error(response.message || '生成物流单号失败')
    }
  } catch (error) {
    console.error('生成物流单号失败:', error)
    ElMessage.error('生成物流单号失败')
  } finally {
    generateLoading.value = false
  }
}

// 处理收件人信息变更
const handleReceiverChange = () => {
  if (useOrderReceiver.value) {
    // 重置表单值，发货时将使用订单的收件人信息
    shipForm.receiverName = ''
    shipForm.receiverPhone = ''
    shipForm.receiverAddress = ''
  } else {
    // 默认填充订单收件人信息，但允许修改
    shipForm.receiverName = orderInfo.value.receiverName || ''
    shipForm.receiverPhone = orderInfo.value.receiverPhone || ''
    shipForm.receiverAddress = [
      orderInfo.value.receiverProvince || '',
      orderInfo.value.receiverCity || '',
      orderInfo.value.receiverDistrict || '',
      orderInfo.value.receiverAddress || ''
    ].filter(Boolean).join(' ')
  }
}

// 处理发货
const handleShip = () => {
  shipForm.companyId = ''
  shipForm.trackingNo = ''
  useOrderReceiver.value = true
  handleReceiverChange()
  shipDialogVisible.value = true
}

// 确认发货
const confirmShip = async () => {
  if (!shipForm.companyId) {
    return ElMessage.warning('请选择物流公司')
  }

  try {
    const receiverName = useOrderReceiver.value ? null : shipForm.receiverName
    const receiverPhone = useOrderReceiver.value ? null : shipForm.receiverPhone
    const receiverAddress = useOrderReceiver.value ? null : shipForm.receiverAddress
    
    const response = await shipOrder(
      orderInfo.value.orderId,
      shipForm.companyId,
      shipForm.trackingNo,
      receiverName,
      receiverPhone,
      receiverAddress
    )
    
    if (response.code === 200) {
      ElMessage.success('发货成功')
      shipDialogVisible.value = false
      await fetchOrderDetail() // 重新获取订单详情
      
      // 如果返回的数据中包含物流ID，刷新物流信息
      if (response.data && response.data.logisticsId) {
        fetchLogisticsInfo(orderInfo.value.orderId)
      }
    } else {
      ElMessage.error(response.message || '发货失败')
    }
  } catch (error) {
    console.error('发货失败:', error)
    ElMessage.error('发货失败')
  }
}

// 处理取消订单
const handleCancel = () => {
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
      orderInfo.value.orderId,
      'cancelled',
      cancelForm.remark
    )
    
    if (response.code === 200) {
      ElMessage.success('订单已取消')
      cancelDialogVisible.value = false
      fetchOrderDetail() // 重新获取订单详情
    } else {
      ElMessage.error(response.message || '取消订单失败')
    }
  } catch (error) {
    console.error('取消订单失败:', error)
    ElMessage.error('取消订单失败')
  }
}

// 跳转到物流详情页面
const goToLogisticsDetail = (logisticsId) => {
  router.push(`/logistics/detail/${logisticsId}`)
}

// 复制物流单号
const copyTrackingNo = (trackingNo) => {
  navigator.clipboard.writeText(trackingNo)
    .then(() => {
      ElMessage.success('物流单号已复制到剪贴板')
    })
    .catch(() => {
      ElMessage.error('复制失败，请手动复制')
    })
}

// 查看订单评价
const viewComment = () => {
  router.push({
    path: '/comment/index',
    query: { orderId: orderInfo.value.orderId }
  })
}

// 组件挂载时获取数据
onMounted(() => {
  fetchOrderDetail()
  fetchLogisticsCompanies()
})

// 监听路由参数变化，当订单ID变化时重新获取详情
watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    fetchOrderDetail()
  }
}, { immediate: true })
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.loading-container {
  padding: 20px;
}

.top-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.status-card {
  margin-bottom: 20px;
  padding: 10px 0;
}

.detail-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-amount {
  margin-top: 20px;
  padding: 10px 20px;
  border-top: 1px solid #eee;
  width: 300px;
  float: right;
}

.amount-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.total {
  font-weight: bold;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.price-total {
  color: #f56c6c;
  font-weight: bold;
}

.image-error {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
  color: #909399;
  font-size: 20px;
}

.tracking-no-wrapper {
  display: flex;
  gap: 10px;
}

.tracking-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style> 